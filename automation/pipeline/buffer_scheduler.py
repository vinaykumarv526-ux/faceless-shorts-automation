import os
import sys
import json
import shutil
import subprocess
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
SKILL_DIR = ROOT / "faceless-shorts"
AUTOMATION_DIR = ROOT / "automation"
PIPELINE_DIR = AUTOMATION_DIR / "pipeline"

# US Eastern Time (UTC-5 in standard, UTC-4 in daylight saving)
# Peak viewing hours in UTC:
# Weekdays:
# Slot 1: 8:30 AM EST -> 13:30 UTC
# Slot 2: 1:00 PM EST -> 18:00 UTC
# Slot 3: 7:00 PM EST -> 23:00 UTC
# Weekends (Sat/Sun):
# Slot 1: 10:00 AM EST -> 15:00 UTC
# Slot 2: 2:30 PM EST -> 19:30 UTC
# Slot 3: 8:00 PM EST -> 00:30 UTC (next day)

def run_cmd(cmd, cwd=None):
    print(f"Running: {' '.join(cmd) if isinstance(cmd, list) else cmd}")
    res = subprocess.run(cmd, cwd=cwd, shell=isinstance(cmd, str), capture_output=True, text=True)
    if res.returncode != 0:
        print(f"STDOUT: {res.stdout}")
        print(f"STDERR: {res.stderr}")
        raise RuntimeError(f"Command failed with code {res.returncode}")
    return res.stdout

def get_target_slots(now_utc=None):
    if now_utc is None:
        now_utc = datetime.now(timezone.utc)
    
    slots = []
    # Day 0 (today), Day 1 (tomorrow), Day 2 (day after tomorrow)
    for day_offset in [0, 1, 2]:
        target_date = (now_utc + timedelta(days=day_offset)).date()
        weekday = target_date.weekday() # 5=Sat, 6=Sun
        is_weekend = weekday >= 5

        if is_weekend:
            times = [(15, 0), (19, 30), (23, 59)]
        else:
            times = [(13, 30), (18, 0), (23, 0)]

        for i, (hour, minute) in enumerate(times, 1):
            slot_dt = datetime(target_date.year, target_date.month, target_date.day, hour, minute, tzinfo=timezone.utc)
            # Only keep slots in future (at least 15 min from now)
            if slot_dt > now_utc + timedelta(minutes=15):
                slot_id = f"{target_date.strftime('%Y-%m-%d')}_slot{i}"
                slots.append({
                    "id": slot_id,
                    "date": str(target_date),
                    "slot_num": i,
                    "iso": slot_dt.strftime("%Y-%m-%dT%H:%M:%SZ"),
                    "dt": slot_dt
                })

    return slots

def build_short(topic, output_mp4):
    style = topic["style"]
    example_dir = SKILL_DIR / "styles" / style / "example"
    proj_dir = ROOT / "runs" / f"run_{topic['id']}"

    if proj_dir.exists():
        shutil.rmtree(proj_dir)

    shutil.copytree(example_dir, proj_dir)
    print(f"\n[BUILD] Building '{topic['title']}' using style '{style}' at {proj_dir}")

    py_bin = sys.executable
    voice_py = SKILL_DIR / "scripts" / "voice.py"
    words_py = SKILL_DIR / "scripts" / "words.py"

    # Step 1: Synthesize real AI voice with Kokoro
    print("1. Synthesizing voiceover with Kokoro (am_michael)...")
    run_cmd([py_bin, str(voice_py), "."], cwd=proj_dir)

    # Step 2: Compute word timings with Whisper
    print("2. Computing word-level timing cues with Whisper...")
    run_cmd([py_bin, str(words_py), "."], cwd=proj_dir)

    # Step 3: Extract scene cues & verify timeline
    print("3. Checking timeline and cues...")
    run_cmd(["node", "tools/capture.mjs", "check"], cwd=proj_dir)
    run_cmd(["node", "tools/capture.mjs", "cues"], cwd=proj_dir)

    # Step 4: Mix voice + background music + sound effects
    print("4. Mixing soundtrack (voice + music ducking + sound effects)...")
    run_cmd([py_bin, str(proj_dir / "tools" / "mix.py"), "."], cwd=proj_dir)

    # Step 5: Render video via Headless Chrome with audio merged
    output_mp4.parent.mkdir(parents=True, exist_ok=True)
    print("5. Rendering final MP4 via Chrome and FFmpeg (optimized fast preset)...")
    # Using --draft flag renders crisp 30fps video in 2-4 minutes instead of 1 hour
    run_cmd(["node", "tools/capture.mjs", "video", str(output_mp4), "--draft"], cwd=proj_dir)
    print(f"SUCCESS: Rendered video with voice: {output_mp4} ({output_mp4.stat().st_size} bytes)")

def maintain_schedule_buffer(max_to_schedule=1):
    topics_file = PIPELINE_DIR / "topics.json"
    state_file = PIPELINE_DIR / "state.json"

    with open(topics_file) as f:
        topics_data = json.load(f)
    topics = topics_data["topics"]

    state = {
        "next_index": 0,
        "scheduled_slots": {}
    }
    if state_file.exists():
        try:
            with open(state_file) as f:
                state = json.load(f)
        except Exception:
            pass

    scheduled_slots = state.get("scheduled_slots", {})
    next_idx = state.get("next_index", 0)

    target_slots = get_target_slots()
    print(f"\n==========================================")
    print(f"Current Target Slots for 2-Day Buffer:")
    for s in target_slots:
        status = "SCHEDULED" if s["id"] in scheduled_slots else "MISSING"
        print(f"  [{status}] {s['id']} -> {s['iso']}")
    print(f"==========================================\n")

    unfilled_slots = [s for s in target_slots if s["id"] not in scheduled_slots]
    if not unfilled_slots:
        print("2-Day Buffer is 100% full! All videos for today, tomorrow, and day after tomorrow are scheduled.")
        return

    from uploader import upload_to_youtube, upload_to_facebook_reel

    slots_to_process = unfilled_slots[:max_to_schedule]
    print(f"Scheduling {len(slots_to_process)} slot(s) in this runner pass...")

    for slot in slots_to_process:
        topic = topics[next_idx % len(topics)]
        next_idx += 1

        print(f"\n--- Scheduling Slot: {slot['id']} ({slot['iso']}) ---")
        print(f"Topic: {topic['title']} ({topic['style']})")

        video_file = ROOT / "renders" / f"{slot['id']}.mp4"
        build_short(topic, video_file)

        # Upload and schedule on YouTube
        yt_id = upload_to_youtube(
            str(video_file),
            topic["title"],
            topic["hook"],
            topic.get("tags", []),
            publish_at_iso=slot["iso"]
        )

        fb_id = upload_to_facebook_reel(
            str(video_file),
            topic["title"],
            topic["hook"]
        )

        scheduled_slots[slot["id"]] = {
            "topic_id": topic["id"],
            "title": topic["title"],
            "style": topic["style"],
            "publish_at": slot["iso"],
            "youtube_id": yt_id,
            "facebook_id": fb_id,
            "scheduled_at": datetime.now(timezone.utc).isoformat()
        }

        # Save state progressively
        state["next_index"] = next_idx
        state["scheduled_slots"] = scheduled_slots
        with open(state_file, "w") as f:
            json.dump(state, f, indent=2)

    print("\nBuffer maintenance pass complete. State updated.")

if __name__ == "__main__":
    count = int(sys.argv[1]) if len(sys.argv) > 1 else 1
    maintain_schedule_buffer(max_to_schedule=count)
