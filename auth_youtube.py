import json
import os
import sys
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCOPES = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube.readonly'
]

CLIENT_SECRET_FILE = 'client_secret.json'
TOKEN_OUTPUT_FILE = 'youtube_token.json'

def main():
    if not os.path.exists(CLIENT_SECRET_FILE):
        print(f"Error: {CLIENT_SECRET_FILE} not found in current directory.", flush=True)
        return

    flow = InstalledAppFlow.from_client_secrets_file(
        CLIENT_SECRET_FILE,
        scopes=SCOPES
    )
    
    print("Starting authentication server on http://localhost:8080 ...", flush=True)
    # Using fixed port 8080
    creds = flow.run_local_server(port=8080, open_browser=True, prompt='consent')

    token_data = {
        'token': creds.token,
        'refresh_token': creds.refresh_token,
        'token_uri': creds.token_uri,
        'client_id': creds.client_id,
        'client_secret': creds.client_secret,
        'scopes': creds.scopes
    }

    with open(TOKEN_OUTPUT_FILE, 'w') as f:
        json.dump(token_data, f, indent=2)

    print(f"\nAuthorization successful! Credentials saved to {TOKEN_OUTPUT_FILE}", flush=True)
    
    try:
        youtube = build('youtube', 'v3', credentials=creds)
        channels_response = youtube.channels().list(
            mine=True,
            part='snippet'
        ).execute()

        for item in channels_response.get('items', []):
            print(f"SUCCESS: Connected to YouTube Channel: {item['snippet']['title']} (ID: {item['id']})", flush=True)
    except Exception as e:
        print(f"Verified token saved, but channel check notice: {e}", flush=True)

if __name__ == '__main__':
    main()
