import os, base64, random, string, subprocess, threading, re, platform
import customtkinter as ctk
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# We import psutil dynamically inside the route so it doesn't break if missing on boot
try:
    import psutil
except ImportError:
    pass

PASSKEY = ''.join(random.choices(string.ascii_letters + string.digits, k=16))

app = FastAPI(title="FriendCloud Host Agent")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

class TaskReq(BaseModel):
    image: str = "ubuntu"
    ram: str = "512m"
    cpu: str = "1"
    passkey: str
    instance_id: str
    command: str = ""

class AuthReq(BaseModel):
    passkey: str

# --- NEW TELEMETRY ENDPOINT ---
@app.post("/sysinfo")
async def get_sysinfo(req: AuthReq):
    if req.passkey != PASSKEY: 
        raise HTTPException(status_code=401, detail="Access Denied.")
    
    try:
        dkr = subprocess.run(["docker", "--version"], capture_output=True, text=True).stdout.strip()
    except Exception: 
        dkr = "Docker not found"
        
    try:
        import psutil
        ram_gb = round(psutil.virtual_memory().total / (1024**3), 2)
        ram_str = f"{ram_gb} GB"
    except ImportError:
        ram_str = "Unknown"

    return {
        "os": f"{platform.system()} {platform.release()}",
        "cpu_name": platform.processor() or platform.machine() or "Unknown CPU",
        "cores": os.cpu_count(),
        "ram": ram_str,
        "docker": dkr,
        "node": platform.node()
    }

@app.post("/launch")
async def launch_instance(req: TaskReq):
    if req.passkey != PASSKEY: raise HTTPException(status_code=401, detail="Access Denied.")
    cname = f"fc-{req.instance_id}"
    subprocess.run(["docker", "rm", "-f", cname], capture_output=True)
    cmd = ["docker", "run", "-d", "--name", cname, "--memory", req.ram, "--cpus", req.cpu, "--network", "none", req.image, "tail", "-f", "/dev/null"]
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0: raise HTTPException(status_code=500, detail=proc.stderr)
    return {"message": f"Instance {cname} running on Host."}

@app.post("/execute")
async def execute_task(req: TaskReq):
    if req.passkey != PASSKEY: raise HTTPException(status_code=401, detail="Access Denied.")
    entry = ["python", "-c", req.command] if "python" in req.image else (["node", "-e", req.command] if "node" in req.image else ["sh", "-c", req.command])
    cmd = ["docker", "exec", f"fc-{req.instance_id}"] + entry
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        out = proc.stdout + (f"\n[STDERR]\n{proc.stderr}" if proc.stderr else "")
        return {"output": out if out.strip() else "[Executed seamlessly on Host]"}
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=408, detail="Timeout.")

@app.post("/terminate")
async def terminate_instance(req: TaskReq):
    if req.passkey != PASSKEY: raise HTTPException(status_code=401, detail="Access Denied.")
    subprocess.run(["docker", "rm", "-f", f"fc-{req.instance_id}"], capture_output=True)
    return {"message": "Destroyed."}

def run_server():
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="error")

ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("blue")

class HostApp(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("FriendCloud Secure Host")
        self.geometry("450x400")
        self.resizable(False, False)

        self.label_title = ctk.CTkLabel(self, text="☁️ FriendCloud Host", font=ctk.CTkFont(size=24, weight="bold"))
        self.label_title.pack(pady=(30, 5))

        self.status_label = ctk.CTkLabel(self, text="Status: Offline", text_color="gray", font=ctk.CTkFont(size=14))
        self.status_label.pack(pady=(0, 20))

        self.start_btn = ctk.CTkButton(self, text="▶ Start Hosting", command=self.start_hosting, fg_color="#10b981", hover_color="#059669", height=50, font=ctk.CTkFont(size=16, weight="bold"))
        self.start_btn.pack(pady=10)

        self.code_label = ctk.CTkLabel(self, text="Your P2P Secret Code:")
        self.code_label.pack(pady=(20, 0))
        
        self.code_entry = ctk.CTkEntry(self, width=350, justify="center", state="readonly")
        self.code_entry.pack(pady=5)

        self.copy_btn = ctk.CTkButton(self, text="Copy to Clipboard", command=self.copy_code, state="disabled", fg_color="gray")
        self.copy_btn.pack(pady=10)

    def copy_code(self):
        self.clipboard_clear()
        self.clipboard_append(self.code_entry.get())
        self.copy_btn.configure(text="Copied! ✅")
        self.after(2000, lambda: self.copy_btn.configure(text="Copy to Clipboard"))

    def start_hosting(self):
        try:
            subprocess.run(["docker", "--version"], check=True, stdout=subprocess.DEVNULL)
        except Exception:
            self.status_label.configure(text="Error: Docker Desktop is not running!", text_color="#ef4444")
            return

        self.start_btn.configure(state="disabled", text="Connecting to Network...")
        self.status_label.configure(text="Status: Bypassing Firewalls...", text_color="#f59e0b")
        threading.Thread(target=self._run_backend, daemon=True).start()

    def _run_backend(self):
        try:
            cmd = [
                "ssh", 
                "-o", "StrictHostKeyChecking=no", 
                "-o", "UserKnownHostsFile=NUL", 
                "-o", "ServerAliveInterval=15",
                "-o", "ServerAliveCountMax=3",
                "-R", "80:127.0.0.1:8000", 
                "nokey@localhost.run"
            ]
            
            startupinfo = None
            if os.name == 'nt':
                startupinfo = subprocess.STARTUPINFO()
                startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW

            process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, startupinfo=startupinfo)
            
            public_url = None
            for line in iter(process.stdout.readline, ''):
                clean_line = line.strip()
                match = re.search(r'(https://[a-zA-Z0-9.-]+\.lhr\.(life|net))', clean_line)
                if match:
                    public_url = match.group(1)
                    break
            
            if not public_url:
                raise Exception(f"Tunnel refused.")

            raw_secret = f"{public_url}|{PASSKEY}"
            b64_secret = base64.b64encode(raw_secret.encode('utf-8')).decode('utf-8')

            self.after(0, self._ui_success, b64_secret)
            run_server()
            
        except Exception as e:
            self.after(0, self._ui_error, str(e))

    def _ui_success(self, b64_secret):
        self.code_entry.configure(state="normal")
        self.code_entry.delete(0, "end")
        self.code_entry.insert(0, b64_secret)
        self.code_entry.configure(state="readonly")
        self.copy_btn.configure(state="normal", fg_color="#3b82f6", hover_color="#2563eb")
        self.status_label.configure(text="Status: Online & Protected", text_color="#10b981")
        self.start_btn.configure(text="Node Active ✅")

    def _ui_error(self, error_msg):
        self.status_label.configure(text=error_msg[:45] + "...", text_color="#ef4444")
        self.start_btn.configure(state="normal", text="▶ Start Hosting")

if __name__ == "__main__":
    app = HostApp()
    app.mainloop()
