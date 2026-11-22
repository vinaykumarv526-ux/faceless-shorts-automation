import json
import os
import sys
import webbrowser
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import requests
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials

CLIENT_SECRET_FILE = 'client_secret.json'
TOKEN_OUTPUT_FILE = 'youtube_token.json'
PORT = 8080
REDIRECT_URI = f"http://localhost:{PORT}/"

class OAuthHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # Suppress default server access logs

    def do_GET(self):
        parsed = urlparse(self.path)
        qs = parse_qs(parsed.query)

        if "code" in qs:
            code = qs["code"][0]
            self.send_response(200)
            self.send_header("Content-type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(b"""
            <html><body style="font-family:sans-serif;text-align:center;padding:50px;">
            <h1 style="color:#10b981;">&#10004; Authorization Successful!</h1>
            <p>Your YouTube connection has been refreshed. You can close this tab now.</p>
            </body></html>
            """)
            self.server.auth_code = code
        else:
            self.send_response(200)
            self.send_header("Content-type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(b"Waiting for authorization...")

def main():
    if not os.path.exists(CLIENT_SECRET_FILE):
        print(f"Error: {CLIENT_SECRET_FILE} not found.", flush=True)
        return

    with open(CLIENT_SECRET_FILE) as f:
        cs = json.load(f)
    
    cfg = cs.get("installed") or cs.get("web")
    client_id = cfg["client_id"]
    client_secret = cfg["client_secret"]
    token_uri = cfg.get("token_uri", "https://oauth2.googleapis.com/token")

    scopes = "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly"
    auth_url = (
        f"https://accounts.google.com/o/oauth2/auth?"
        f"client_id={client_id}&"
        f"redirect_uri={REDIRECT_URI}&"
        f"response_type=code&"
        f"scope={scopes}&"
        f"access_type=offline&"
        f"prompt=consent"
    )

    server = HTTPServer(("localhost", PORT), OAuthHandler)
    server.auth_code = None

    print(f"\n=======================================================", flush=True)
    print(f"Please open this URL in your browser to authorize:", flush=True)
    print(f"{auth_url}", flush=True)
    print(f"=======================================================\n", flush=True)

    webbrowser.open(auth_url)

    while server.auth_code is None:
        server.handle_request()

    print("\nReceived authorization code from Google! Exchanging for token...", flush=True)

    # Exchange code for tokens
    resp = requests.post(token_uri, data={
        "code": server.auth_code,
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code"
    }).json()

    if "refresh_token" not in resp:
        print(f"Notice: Google did not return a new refresh_token in response: {resp}")
        if "access_token" in resp:
            print("Access token received, but refresh token missing. Ensure prompt=consent is used.")
        return

    token_data = {
        "token": resp.get("access_token"),
        "refresh_token": resp.get("refresh_token"),
        "token_uri": token_uri,
        "client_id": client_id,
        "client_secret": client_secret,
        "scopes": scopes.split()
    }

    with open(TOKEN_OUTPUT_FILE, "w") as f:
        json.dump(token_data, f, indent=2)

    print(f"SUCCESS: Saved new tokens to {TOKEN_OUTPUT_FILE}!", flush=True)

    # Test channel connection
    creds = Credentials(
        token=resp.get("access_token"),
        refresh_token=resp.get("refresh_token"),
        token_uri=token_uri,
        client_id=client_id,
        client_secret=client_secret
    )
    youtube = build("youtube", "v3", credentials=creds)
    ch = youtube.channels().list(mine=True, part="snippet").execute()
    for it in ch.get("items", []):
        print(f"Verified Channel: {it['snippet']['title']} (ID: {it['id']})", flush=True)

    # Automatically update GitHub Secret
    print("\nUpdating GitHub Secrets on vinaykumarv526-ux/faceless-shorts-automation ...", flush=True)
    os.system(f'gh secret set YT_REFRESH_TOKEN -b "{resp["refresh_token"]}" --repo vinaykumarv526-ux/faceless-shorts-automation')
    print("GitHub Secret YT_REFRESH_TOKEN updated successfully!", flush=True)

    # Trigger a workflow run
    print("Triggering GitHub Actions workflow...", flush=True)
    os.system('gh workflow run daily_short.yml --repo vinaykumarv526-ux/faceless-shorts-automation')
    print("Automation resumed in the cloud!", flush=True)

if __name__ == '__main__':
    main()
