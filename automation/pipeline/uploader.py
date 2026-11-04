import os
import sys
import json
import requests
from datetime import datetime, timezone
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

def upload_to_youtube(video_path, title, description, tags, publish_at_iso=None):
    schedule_text = f" (Scheduled for: {publish_at_iso})" if publish_at_iso else " (Publish immediately)"
    print(f"Uploading to YouTube: {title}{schedule_text}")
    
    # Load credentials from environment variables or file
    refresh_token = os.environ.get("YT_REFRESH_TOKEN")
    client_id = os.environ.get("YT_CLIENT_ID")
    client_secret = os.environ.get("YT_CLIENT_SECRET")
    
    if not (refresh_token and client_id and client_secret):
        token_path = os.environ.get("YT_TOKEN_FILE", "youtube_token.json")
        if os.path.exists(token_path):
            with open(token_path) as f:
                data = json.load(f)
                refresh_token = data.get("refresh_token")
                client_id = data.get("client_id")
                client_secret = data.get("client_secret")
    
    if not (refresh_token and client_id and client_secret):
        print("Error: Missing YouTube credentials (refresh_token, client_id, client_secret).")
        return None

    creds = Credentials(
        token=None,
        refresh_token=refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=client_id,
        client_secret=client_secret,
        scopes=["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube.readonly"]
    )

    youtube = build("youtube", "v3", credentials=creds)

    status_dict = {
        "selfDeclaredMadeForKids": False
    }

    if publish_at_iso:
        # YouTube requires private status when scheduling
        status_dict["privacyStatus"] = "private"
        status_dict["publishAt"] = publish_at_iso
    else:
        status_dict["privacyStatus"] = "public"

    body = {
        "snippet": {
            "title": f"{title} #shorts",
            "description": f"{description}\n\n#shorts #viral #facts",
            "tags": tags + ["shorts", "viral", "fyp"],
            "categoryId": "27"  # Education
        },
        "status": status_dict
    }

    media = MediaFileUpload(video_path, mimetype="video/mp4", resumable=True)
    request = youtube.videos().insert(
        part="snippet,status",
        body=body,
        media_body=media
    )

    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            print(f"Uploaded {int(status.progress() * 100)}%")

    video_id = response.get("id")
    print(f"SUCCESS: Uploaded YouTube Short! Video ID: {video_id} - Scheduled: {publish_at_iso or 'Immediate'}")
    return video_id

def upload_to_facebook_reel(video_path, title, description):
    page_id = os.environ.get("FB_PAGE_ID")
    access_token = os.environ.get("FB_ACCESS_TOKEN")
    
    if not (page_id and access_token):
        print("Notice: FB_PAGE_ID or FB_ACCESS_TOKEN not set; skipping Facebook Reels upload.")
        return None

    print(f"Uploading to Facebook Reels (Page ID: {page_id})...")
    
    try:
        # 1. Initialize Reel upload session
        init_url = f"https://graph.facebook.com/v19.0/{page_id}/video_reels"
        init_res = requests.post(init_url, data={
            "upload_phase": "start",
            "access_token": access_token
        }).json()

        video_id = init_res.get("video_id")
        upload_url = init_res.get("upload_url")
        if not video_id or not upload_url:
            print(f"Failed to start FB Reel session: {init_res}")
            return None

        # 2. Upload video binary
        file_size = os.path.getsize(video_path)
        with open(video_path, "rb") as f:
            headers = {
                "Authorization": f"OAuth {access_token}",
                "offset": "0",
                "file_size": str(file_size)
            }
            upload_res = requests.post(upload_url, headers=headers, data=f).json()

        # 3. Publish Reel
        publish_res = requests.post(init_url, data={
            "upload_phase": "finish",
            "access_token": access_token,
            "video_id": video_id,
            "video_state": "PUBLISHED",
            "description": f"{title}\n\n{description}\n#reels #viral #shorts"
        }).json()

        print(f"SUCCESS: Published Facebook Reel! Video ID: {video_id}")
        return video_id
    except Exception as e:
        print(f"Facebook upload notice: {e}")
        return None

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python uploader.py <video_path> [title] [description] [publish_at_iso]")
        sys.exit(1)
        
    vid = sys.argv[1]
    tit = sys.argv[2] if len(sys.argv) > 2 else "What Happens If? #shorts"
    desc = sys.argv[3] if len(sys.argv) > 3 else "Crazy science facts you need to know."
    pub_iso = sys.argv[4] if len(sys.argv) > 4 else None
    tags = ["facts", "science", "curiosity"]
    
    upload_to_youtube(vid, tit, desc, tags, publish_at_iso=pub_iso)
    upload_to_facebook_reel(vid, tit, desc)
