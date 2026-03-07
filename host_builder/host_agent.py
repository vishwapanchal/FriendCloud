import os
import base64
import random
import string
import subprocess
import threading
import time
import re
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Generate a random passkey for this session
PASSKEY = ''.join(random.choices(string.ascii_letters + string.digits, k=16))

app = FastAPI(title="FriendCloud P2P Host")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

class TaskReq(BaseModel):
    image: str = "ubuntu"
    ram: str = "512m"
    cpu: str = "1"
    passkey: str
    instance_id: str
    command: str = ""

@app.post("/launch")
async def launch_instance(req: TaskReq):
    if req.passkey != PASSKEY: raise HTTPException(status_code=401, detail="Access Denied.")
    cname = f"fc-{req.instance_id}"
    subprocess.run(["docker", "rm", "-f", cname], capture_output=True)
    cmd = ["docker", "run", "-d", "--name", cname, "--memory", req.ram, "--cpus", req.cpu, "--network", "none", req.image, "tail", "-f", "/dev/null"]
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0: raise HTTPException(status_code=500, detail=proc.stderr)
    return {"message": f"Instance {cname} running."}

@app.post("/execute")
async def execute_task(req: TaskReq):
    if req.passkey != PASSKEY: raise HTTPException(status_code=401, detail="Access Denied.")
    entry = ["python", "-c", req.command] if "python" in req.image else (["node", "-e", req.command] if "node" in req.image else ["sh", "-c", req.command])
    cmd = ["docker", "exec", f"fc-{req.instance_id}"] + entry
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        out = proc.stdout + (f"\n[STDERR]\n{proc.stderr}" if proc.stderr else "")
        return {"output": out if out.strip() else "[Executed seamlessly]"}
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=408, detail="Timeout.")

@app.post("/terminate")
async def terminate_instance(req: TaskReq):
    if req.passkey != PASSKEY: raise HTTPException(status_code=401, detail="Access Denied.")
    subprocess.run(["docker", "rm", "-f", f"fc-{req.instance_id}"], capture_output=True)
    return {"message": "Destroyed."}

def start_cloudflare_tunnel(port=8000, timeout=30):
    """Start a Cloudflare quick tunnel and return the public URL."""
    proc = subprocess.Popen(
        ["cloudflared", "tunnel", "--url", f"http://localhost:{port}"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    # cloudflared outputs the tunnel URL to stderr
    url = None
    start_time = time.time()
    while time.time() - start_time < timeout:
        line = proc.stderr.readline()
        if not line:
            break
        # Look for the trycloudflare.com URL
        match = re.search(r'(https://[a-zA-Z0-9\-]+\.trycloudflare\.com)', line)
        if match:
            url = match.group(1)
            break

    if url is None:
        proc.terminate()
        raise RuntimeError("Failed to start Cloudflare tunnel. Make sure 'cloudflared' is installed.")

    return url, proc

if __name__ == "__main__":
    print("="*60)
    print("   ☁️  FriendCloud Host Agent")
    print("="*60)
    print("\n1. Checking Docker...")
    try:
        subprocess.run(["docker", "--version"], check=True, stdout=subprocess.DEVNULL)
    except Exception:
        print("[ERROR] Docker Desktop is not running! Please start Docker and try again.")
        input("Press Enter to exit...")
        exit(1)

    print("2. Checking Cloudflared...")
    try:
        subprocess.run(["cloudflared", "--version"], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception:
        print("[ERROR] 'cloudflared' is not installed!")
        print("        Download it from: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/")
        input("Press Enter to exit...")
        exit(1)

    print("3. Starting Secure Tunnel (Cloudflare)...")
    try:
        public_url, tunnel_proc = start_cloudflare_tunnel(8000)
    except RuntimeError as e:
        print(f"[ERROR] {e}")
        input("Press Enter to exit...")
        exit(1)

    # Generate Secret Code
    raw_secret = f"{public_url}|{PASSKEY}"
    b64_secret = base64.b64encode(raw_secret.encode('utf-8')).decode('utf-8')

    print("\n" + "="*60)
    print(" ✅ YOUR PC IS NOW HOSTING A FRIENDCLOUD NODE!")
    print("="*60)
    print("\nCopy this Secret Code and send it to your friend:")
    print("\n------------------------------------------------------------")
    print(f" {b64_secret} ")
    print("------------------------------------------------------------\n")
    print("Leave this window open. Close it to shut down your node.\n")

    try:
        uvicorn.run(app, host="127.0.0.1", port=8000, log_level="error")
    finally:
        tunnel_proc.terminate()
