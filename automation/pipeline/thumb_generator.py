import os
import sys
import re
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent.parent

NICHE_BADGES = {
    "human_body": "[BIOLOGICAL BLUEPRINT]",
    "survival": "[SURVIVAL PROTOCOL]",
    "mystery": "[UNSOLVED ARCHIVE]",
    "history": "[DECLASSIFIED RECORD]",
    "science": "[PHYSICS SIMULATION]",
    "technology": "[SYSTEM ARCHITECTURE]"
}

def derive_smart_hook(title):
    cleaned = title.strip().rstrip("?!.")
    lower = cleaned.lower()
    
    # Strip common conversational question stems
    prefixes = [
        "what happens if you ",
        "what happens if ",
        "what to do if your ",
        "what to do if ",
        "how does a ",
        "how does ",
        "why does ",
        "why fast ",
        "why your ",
        "the truth about ",
        "how one ",
        "the secret behind "
    ]
    for p in prefixes:
        if lower.startswith(p):
            cleaned = cleaned[len(p):].strip()
            break
            
    words = cleaned.split()
    if len(words) <= 4:
        return " ".join(words).upper()
    return " ".join(words[:4]).upper()

def derive_smart_badge(topic):
    if topic.get("thumb_badge"):
        return topic["thumb_badge"]
    niche = topic.get("niche", "").lower()
    if niche in NICHE_BADGES:
        return NICHE_BADGES[niche]
    return "[SYSTEM ARCHITECTURE]"

def generate_thumbnail(video_or_proj, topic, output_thumb_path, peak_sec=12.0):
    output_thumb_path = Path(output_thumb_path)
    output_thumb_path.parent.mkdir(parents=True, exist_ok=True)
    
    video_or_proj = Path(video_or_proj)
    temp_frame = output_thumb_path.parent / f"_temp_frame_{output_thumb_path.stem}.jpg"
    
    # 1. Capture peak frame (FFmpeg from mp4 if video file, or capture.mjs if project dir)
    frame_captured = False
    if video_or_proj.is_file() and video_or_proj.suffix.lower() == ".mp4":
        try:
            cmd = [
                "ffmpeg", "-y",
                "-ss", str(peak_sec),
                "-i", str(video_or_proj),
                "-frames:v", "1",
                "-q:v", "2",
                str(temp_frame)
            ]
            subprocess.run(cmd, check=True, capture_output=True)
            if temp_frame.exists():
                frame_captured = True
        except Exception as e:
            print(f"FFmpeg frame capture notice: {e}")
            
    if not frame_captured:
        # Fallback to tools/capture.mjs if proj_dir
        proj_dir = video_or_proj if video_or_proj.is_dir() else ROOT / "models" / "architectural_retention_loop"
        temp_dir = proj_dir / "review" / "temp_thumb"
        temp_dir.mkdir(parents=True, exist_ok=True)
        try:
            subprocess.run(
                ["node", "tools/capture.mjs", "frames", str(temp_dir), str(peak_sec)],
                cwd=proj_dir,
                check=True,
                capture_output=True
            )
            candidate = temp_dir / f"t{peak_sec:.2f}.jpg"
            if candidate.exists():
                temp_frame = candidate
                frame_captured = True
        except Exception as e:
            print(f"Capture.mjs notice: {e}")

    # 2. Base canvas (1280x720 for YouTube Thumbnail standard)
    w_out, h_out = 1280, 720
    thumb_img = Image.new("RGB", (w_out, h_out), color="#080E18")

    if frame_captured and temp_frame.exists():
        try:
            v_img = Image.open(temp_frame).convert("RGB")
            # Scale vertical 1080x1920 to fit right focal area
            focal_w = 720
            focal_h = h_out
            v_cropped = v_img.resize((focal_w, int(focal_w * (1920 / 1080))), Image.Resampling.LANCZOS)
            top = (v_cropped.height - focal_h) // 2
            v_final = v_cropped.crop((0, top, focal_w, top + focal_h))

            # Paste on right side
            thumb_img.paste(v_final, (w_out - focal_w + 30, 0))

            # Smooth horizontal alpha gradient from solid navy on left to transparent over video
            grad_w = 340
            gradient = Image.new("L", (grad_w, h_out), color=0)
            for x in range(grad_w):
                alpha = int(255 * (x / grad_w))
                for y in range(h_out):
                    gradient.putpixel((x, y), alpha)

            dark_strip = Image.new("RGB", (grad_w, h_out), color="#080E18")
            thumb_img.paste(dark_strip, (w_out - focal_w - 70, 0), Image.eval(gradient, lambda a: 255 - a))
        except Exception as e:
            print(f"Frame processing notice: {e}")

    draw = ImageDraw.Draw(thumb_img)

    # 3. Smart typography & badges
    hook_text = topic.get("thumb_hook") or derive_smart_hook(topic.get("title", "SYSTEM BREAKDOWN"))
    badge_text = derive_smart_badge(topic)
    accent = topic.get("accent_color", "#FFD43B")  # Vibrant electric yellow

    # Font lookup
    font_path = ROOT / "models" / "architectural_retention_loop" / "fonts" / "Inter-Black.otf"
    font_size = 76
    try:
        font_main = ImageFont.truetype(str(font_path), font_size)
        font_badge = ImageFont.truetype(str(font_path), 30)
        font_sub = ImageFont.truetype(str(font_path), 26)
    except Exception:
        font_main = ImageFont.load_default()
        font_badge = ImageFont.load_default()
        font_sub = ImageFont.load_default()

    # Draw Badge
    badge_x = 64
    badge_y = 100
    draw.rectangle([badge_x - 10, badge_y - 8, badge_x + 400, badge_y + 44], fill="#102236", outline="#4FD1E8", width=3)
    draw.text((badge_x + 12, badge_y), badge_text, fill="#4FD1E8", font=font_badge)

    # Wrap hook into 2-3 bold lines (max 2 words per line for visual punch)
    hook_words = hook_text.split()
    lines = []
    if len(hook_words) <= 2:
        lines = [" ".join(hook_words)]
    elif len(hook_words) <= 4:
        lines = [" ".join(hook_words[:2]), " ".join(hook_words[2:])]
    else:
        lines = [" ".join(hook_words[:2]), " ".join(hook_words[2:4]), " ".join(hook_words[4:])]

    text_y = 195
    for i, line_str in enumerate(lines):
        line_color = accent if i == (len(lines) - 1) else "#FFFFFF"
        # 8-direction black drop shadows for high legibility
        for dx, dy in [(-5, -5), (-5, 5), (5, -5), (5, 5), (-4, 0), (4, 0), (0, -4), (0, 4), (0, 7)]:
            draw.text((badge_x + dx, text_y + dy), line_str, font=font_main, fill="#000000")
        draw.text((badge_x, text_y), line_str, font=font_main, fill=line_color)
        text_y += 98

    # Bottom sub-pill
    sub_pill = topic.get("thumb_sub", "HOW IT ACTUALLY WORKS")
    draw.rectangle([badge_x, text_y + 20, badge_x + 460, text_y + 72], fill="#16273D", outline="#254366", width=2)
    draw.text((badge_x + 20, text_y + 32), f"▶  {sub_pill}", fill="#E2E8F0", font=font_sub)

    # Tech brackets on corners (Top-Left, Bottom-Left, Top-Right)
    draw.line([(28, 55), (28, 28), (55, 28)], fill="#4FD1E8", width=4)
    draw.line([(28, h_out - 55), (28, h_out - 28), (55, h_out - 28)], fill="#4FD1E8", width=4)
    draw.line([(w_out - 55, 28), (w_out - 28, 28), (w_out - 28, 55)], fill="#4FD1E8", width=4)
    # Bottom-right is intentionally kept 100% clean for YouTube timestamp pill

    thumb_img.save(output_thumb_path, "JPEG", quality=95)
    
    # Cleanup temp frame
    if temp_frame.exists() and temp_frame.name.startswith("_temp_frame_"):
        try:
            temp_frame.unlink()
        except Exception:
            pass

    print(f"SUCCESS: Generated Automated YouTube Thumbnail: {output_thumb_path} (1280x720)")
    return output_thumb_path

if __name__ == "__main__":
    test_topic = {
        "title": "Why Fast Charging Stops at 80%",
        "niche": "technology",
        "thumb_hook": "STOP AT 80%",
        "accent_color": "#FFD43B"
    }
    sample_video = ROOT / "models" / "architectural_retention_loop" / "renders" / "architectural_loop_sample.mp4"
    out_file = ROOT / "models" / "architectural_retention_loop" / "renders" / "automated_thumbnail.jpg"
    generate_thumbnail(sample_video, test_topic, out_file, peak_sec=12.0)
