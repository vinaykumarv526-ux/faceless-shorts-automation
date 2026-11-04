import os
import sys
import json
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
SKILL_DIR = ROOT / "faceless-shorts"
AUTOMATION_DIR = ROOT / "automation"
PIPELINE_DIR = AUTOMATION_DIR / "pipeline"

def run_cmd(cmd, cwd=None):
    print(f"Running: {' '.join(cmd) if isinstance(cmd, list) else cmd}")
    res = subprocess.run(cmd, cwd=cwd, shell=isinstance(cmd, str), capture_output=True, text=True)
    if res.returncode != 0:
        print(f"STDOUT: {res.stdout}")
        print(f"STDERR: {res.stderr}")
        raise RuntimeError(f"Command failed with code {res.returncode}")
    return res.stdout

def main():
    topics_file = PIPELINE_DIR / "topics.json"
    state_file = PIPELINE_DIR / "state.json"

    with open(topics_file) as f:
        data = json.load(f)
    
    topics = data["topics"]
    
    # Load index from state
    idx = 0
    if state_file.exists():
        with open(state_file) as f:
            idx = json.load(f).get("next_index", 0)

    selected_topic = topics[idx % len(topics)]
    print(f"\n==========================================")
    print(f"Selected Topic: {selected_topic['title']}")
    print(f"Style: {selected_topic['style']}")
    print(f"==========================================\n")

    style = selected_topic["style"]
    example_dir = SKILL_DIR / "styles" / style / "example"
    proj_dir = ROOT / "runs" / f"run_{selected_topic['id']}"
    
    if proj_dir.exists():
        shutil.rmtree(proj_dir)
    
    shutil.copytree(example_dir, proj_dir)
    print(f"Created project folder at {proj_dir}")

    # Build and render the video
    py_bin = sys.executable
    print("Running cues, audio mixing, and frame capture...")
    
    # Run capture check
    run_cmd(["node", "tools/capture.mjs", "check"], cwd=proj_dir)
    run_cmd(["node", "tools/capture.mjs", "cues"], cwd=proj_dir)
    run_cmd([py_bin, str(proj_dir / "tools" / "mix.py"), "."], cwd=proj_dir)

    # Render video
    renders_dir = proj_dir / "renders"
    renders_dir.mkdir(exist_ok=True)
    video_out = renders_dir / "final.mp4"
    
    print("Rendering video via Headless Chrome & FFmpeg...")
    run_cmd(["node", "tools/capture.mjs", "video", str(video_out)], cwd=proj_dir)
    
    print(f"\nRendered short successfully: {video_out} ({os.path.getsize(video_out)} bytes)")

    # Publish
    from uploader import upload_to_youtube, upload_to_facebook_reel
    print("Publishing short...")
    upload_to_youtube(
        str(video_out),
        selected_topic["title"],
        selected_topic["hook"],
        selected_topic.get("tags", [])
    )
    upload_to_facebook_reel(
        str(video_out),
        selected_topic["title"],
        selected_topic["hook"]
    )

    # Update state
    with open(state_file, "w") as f:
        json.dump({"next_index": idx + 1, "last_topic": selected_topic["id"]}, f, indent=2)

    print("\nALL COMPLETE!")

if __name__ == "__main__":
    main()
