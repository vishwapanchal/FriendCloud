import os
import base64
import random
import string
import subprocess
import threading
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pyngrok import ngrok, conf

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

    print("2. Starting Secure Tunnel...")
    ngrok_token = input("\nEnter your Ngrok Authtoken (get it from dashboard.ngrok.com): ").strip()
    if ngrok_token:
        ngrok.set_auth_token(ngrok_token)

    # Start Ngrok
    tunnel = ngrok.connect(8080)
    public_url = tunnel.public_url

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

    uvicorn.run(app, host="127.0.0.1", port=8080, log_level="error")
