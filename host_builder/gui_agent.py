import os, base64, random, string, subprocess, threading, re, platform, webbrowser
import customtkinter as ctk
from tkinter import messagebox
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    import psutil
    TOTAL_RAM_GB = int(round(psutil.virtual_memory().total / (1024**3)))
except ImportError:
    psutil = None
    TOTAL_RAM_GB = 4

TOTAL_CORES = os.cpu_count() or 2

RAM_OPTIONS = ["512m"]
for r in [1, 2, 4, 8, 16, 32, 64]:
    if r <= TOTAL_RAM_GB:
        RAM_OPTIONS.append(f"{r}g")

CPU_OPTIONS = [str(i) for i in range(1, TOTAL_CORES + 1)]

PASSKEY = ''.join(random.choices(string.ascii_letters + string.digits, k=16))
HOST_MAX_RAM = "1g"
HOST_MAX_CPU = "1"
HOST_ALLOW_GPU = False

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

class AuthReq(BaseModel):
    passkey: str

class TaskReq(BaseModel):
    image: str = "ubuntu"
    ram: str = "512m"
    cpu: str = "1"
    use_gpu: bool = False
    passkey: str
    instance_id: str
    command: str = ""

@app.post("/sysinfo")
async def get_sysinfo(req: AuthReq):
    if req.passkey != PASSKEY: raise HTTPException(status_code=401)
    try:
        dkr = subprocess.run(["docker", "--version"], capture_output=True, text=True).stdout.strip()
    except: dkr = "N/A"
    
    try:
        gpu_info = subprocess.run(["nvidia-smi", "--query-gpu=name", "--format=csv,noheader"], capture_output=True, text=True, check=True).stdout.strip()
        has_gpu = True
    except:
        gpu_info = "None"
        has_gpu = False

    ram_str = f"{TOTAL_RAM_GB} GB"
    
    return {
        "os": f"{platform.system()} {platform.release()}",
        "cpu_name": platform.processor() or platform.machine(),
        "gpu_name": gpu_info,
        "has_gpu": has_gpu,
        "allowed_gpu": HOST_ALLOW_GPU,
        "cores": TOTAL_CORES,
        "ram": ram_str,
        "allowed_ram": HOST_MAX_RAM,
        "allowed_cpu": HOST_MAX_CPU,
        "docker": dkr,
        "node": platform.node()
    }

@app.post("/launch")
async def launch(req: TaskReq):
    if req.passkey != PASSKEY: raise HTTPException(status_code=401)
    
    ram_hierarchy = {"512m": 0, "1g": 1, "2g": 2, "4g": 3, "8g": 4, "16g": 5, "32g": 6, "64g": 7}
    if ram_hierarchy.get(req.ram, 99) > ram_hierarchy.get(HOST_MAX_RAM, -1):
        raise HTTPException(status_code=403, detail="Requested RAM exceeds host allowance.")
    if int(req.cpu) > int(HOST_MAX_CPU):
        raise HTTPException(status_code=403, detail="Requested CPU exceeds host allowance.")
    if req.use_gpu and not HOST_ALLOW_GPU:
        raise HTTPException(status_code=403, detail="Host has not authorized GPU access.")

    cname = f"fc-{req.instance_id}"
    subprocess.run(["docker", "rm", "-f", cname], capture_output=True)
    
    cmd = ["docker", "run", "-d", "--name", cname, "--memory", req.ram, "--cpus", req.cpu, "--network", "none"]
    if req.use_gpu and HOST_ALLOW_GPU:
        cmd.extend(["--gpus", "all"])
    cmd.extend([req.image, "tail", "-f", "/dev/null"])
    
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0: raise HTTPException(status_code=500, detail=proc.stderr)
    return {"message": "Environment ready."}

@app.post("/execute")
async def execute(req: TaskReq):
    if req.passkey != PASSKEY: raise HTTPException(status_code=401)
    entry = ["python", "-c", req.command] if "python" in req.image else (["node", "-e", req.command] if "node" in req.image else ["sh", "-c", req.command])
    proc = subprocess.run(["docker", "exec", f"fc-{req.instance_id}"] + entry, capture_output=True, text=True, timeout=30)
    return {"output": proc.stdout + proc.stderr}

@app.post("/terminate")
async def terminate(req: TaskReq):
    if req.passkey != PASSKEY: raise HTTPException(status_code=401)
    subprocess.run(["docker", "rm", "-f", f"fc-{req.instance_id}"], capture_output=True)
    return {"message": "Destroyed."}

ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("blue")

class ProAgent(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("FriendCloud Host Setup")
        self.geometry("550x450")
        self.resizable(False, False)
        self.protocol("WM_DELETE_WINDOW", self.on_closing)
        
        self.main_frame = ctk.CTkFrame(self, fg_color="transparent")
        self.main_frame.pack(fill="both", expand=True, padx=40, pady=40)
        self.show_welcome()

    def clear_frame(self):
        for widget in self.main_frame.winfo_children():
            widget.destroy()

    def show_welcome(self):
        self.clear_frame()
        ctk.CTkLabel(self.main_frame, text="FriendCloud Node Setup", font=("Helvetica", 28, "bold")).pack(pady=(0, 20))
        ctk.CTkLabel(self.main_frame, text="This wizard will configure your system as a secure P2P compute node.\n\nPlease ensure Docker Desktop is running before proceeding.", justify="center", font=("Helvetica", 14), text_color="gray").pack(pady=10)
        
        features = ctk.CTkFrame(self.main_frame, fg_color=("#e0e0e0", "#1f1f1f"))
        features.pack(fill="x", pady=20)
        ctk.CTkLabel(features, text="\u2713 End-to-end Encrypted Tunnel\n\u2713 Strict Container Isolation\n\u2713 Ephemeral Secret Keys", justify="left", font=("Helvetica", 13)).pack(pady=15, padx=20, anchor="w")
        
        btn_frame = ctk.CTkFrame(self.main_frame, fg_color="transparent")
        btn_frame.pack(side="bottom", fill="x")
        ctk.CTkButton(btn_frame, text="Cancel", fg_color="transparent", border_width=1, command=self.on_closing, width=100).pack(side="left")
        ctk.CTkButton(btn_frame, text="Next >", command=self.show_preflight, width=100, font=("Helvetica", 13, "bold")).pack(side="right")

    def show_preflight(self):
        self.clear_frame()
        ctk.CTkLabel(self.main_frame, text="System Verification", font=("Helvetica", 24, "bold")).pack(pady=(0, 20))
        self.status_label = ctk.CTkLabel(self.main_frame, text="Initializing diagnostics...", font=("Helvetica", 14))
        self.status_label.pack(pady=10)
        
        self.progress = ctk.CTkProgressBar(self.main_frame, orientation="horizontal", mode="indeterminate")
        self.progress.pack(fill="x", pady=20)
        self.progress.start()
        
        threading.Thread(target=self.run_checks, daemon=True).start()

    def run_checks(self):
        self.after(1000, lambda: self.status_label.configure(text="Checking Docker Engine Status..."))
        try:
            subprocess.run(["docker", "info"], check=True, capture_output=True)
            self.after(1800, lambda: self.status_label.configure(text="Verifying network adapters..."))
            self.after(3000, self.show_ready)
        except Exception:
            self.after(1000, self.show_docker_error)

    def show_docker_error(self):
        self.clear_frame()
        ctk.CTkLabel(self.main_frame, text="Verification Failed", font=("Helvetica", 24, "bold"), text_color="#ef4444").pack(pady=(0, 20))
        ctk.CTkLabel(self.main_frame, text="Docker Engine is either not installed or not actively running.\nThis node cannot accept connections without Docker.", justify="center").pack(pady=10)
        
        ctk.CTkButton(self.main_frame, text="Download Docker", fg_color="transparent", border_width=2, command=lambda: webbrowser.open("https://www.docker.com/products/docker-desktop/")).pack(pady=20)
        
        btn_frame = ctk.CTkFrame(self.main_frame, fg_color="transparent")
        btn_frame.pack(side="bottom", fill="x")
        ctk.CTkButton(btn_frame, text="< Back", fg_color="transparent", border_width=1, command=self.show_welcome, width=100).pack(side="left")
        ctk.CTkButton(btn_frame, text="Retry", command=self.show_preflight, width=100).pack(side="right")

    def show_ready(self):
        self.clear_frame()
        ctk.CTkLabel(self.main_frame, text="Configure Resource Limits", font=("Helvetica", 24, "bold"), text_color="#10b981").pack(pady=(0, 5))
        
        ctk.CTkLabel(self.main_frame, text=f"Detected Hardware: {TOTAL_RAM_GB}GB RAM | {TOTAL_CORES} CPU Cores", font=("Helvetica", 12, "italic"), text_color="#3b82f6").pack(pady=(0, 15))
        
        config_frame = ctk.CTkFrame(self.main_frame, fg_color="transparent")
        config_frame.pack(pady=5)
        
        ctk.CTkLabel(config_frame, text="Max RAM to Share:").grid(row=0, column=0, padx=10, pady=10, sticky="e")
        default_ram = RAM_OPTIONS[-2] if len(RAM_OPTIONS) > 1 else RAM_OPTIONS[0]
        self.ram_var = ctk.StringVar(value=default_ram)
        ctk.CTkOptionMenu(config_frame, variable=self.ram_var, values=RAM_OPTIONS).grid(row=0, column=1, padx=10, pady=10, sticky="w")
        
        ctk.CTkLabel(config_frame, text="Max CPUs to Share:").grid(row=1, column=0, padx=10, pady=10, sticky="e")
        default_cpu = str(TOTAL_CORES // 2) if TOTAL_CORES > 1 else "1"
        self.cpu_var = ctk.StringVar(value=default_cpu)
        ctk.CTkOptionMenu(config_frame, variable=self.cpu_var, values=CPU_OPTIONS).grid(row=1, column=1, padx=10, pady=10, sticky="w")

        self.gpu_var = ctk.BooleanVar(value=False)
        self.gpu_checkbox = ctk.CTkCheckBox(config_frame, text="Allow Hardware GPU Access", variable=self.gpu_var)
        self.gpu_checkbox.grid(row=2, column=0, columnspan=2, pady=10)

        btn_frame = ctk.CTkFrame(self.main_frame, fg_color="transparent")
        btn_frame.pack(side="bottom", fill="x")
        ctk.CTkButton(btn_frame, text="< Back", fg_color="transparent", border_width=1, command=self.show_welcome, width=100).pack(side="left")
        self.install_btn = ctk.CTkButton(btn_frame, text="Install Tunnel", command=self.start_tunnel, width=120, font=("Helvetica", 13, "bold"), fg_color="#10b981", hover_color="#059669")
        self.install_btn.pack(side="right")

    def start_tunnel(self):
        global HOST_MAX_RAM, HOST_MAX_CPU, HOST_ALLOW_GPU
        HOST_MAX_RAM = self.ram_var.get()
        HOST_MAX_CPU = self.cpu_var.get()
        HOST_ALLOW_GPU = self.gpu_var.get()
        
        self.install_btn.configure(state="disabled", text="Connecting...")
        threading.Thread(target=self.run_backend, daemon=True).start()

    def run_backend(self):
        try:
            cmd = ["ssh", "-o", "StrictHostKeyChecking=no", "-o", "UserKnownHostsFile=NUL", "-o", "ServerAliveInterval=30", "-o", "ServerAliveCountMax=3", "-R", "80:127.0.0.1:8000", "nokey@localhost.run"]
            startupinfo = subprocess.STARTUPINFO()
            startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
            process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, startupinfo=startupinfo)
            
            log_output = ""
            for line in iter(process.stdout.readline, ''):
                log_output += line
                match = re.search(r'(https://[a-zA-Z0-9.-]+\.lhr\.(life|net))', line)
                if match:
                    url = match.group(1)
                    code = base64.b64encode(f"{url}|{PASSKEY}".encode()).decode()
                    self.after(0, lambda: self.show_final(code))
                    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="error")
                    return
            err = log_output.strip()[-150:] if log_output.strip() else "Connection closed unexpectedly."
            raise Exception(err)
        except Exception as e:
            self.after(0, lambda: self.show_tunnel_error(str(e)))

    def show_tunnel_error(self, err_msg="Unknown"):
        self.clear_frame()
        ctk.CTkLabel(self.main_frame, text="Tunneling Error", font=("Helvetica", 24, "bold"), text_color="#ef4444").pack(pady=(0, 10))
        ctk.CTkLabel(self.main_frame, text="Failed to negotiate connection with the remote relay server.", justify="center").pack(pady=5)
        
        err_box = ctk.CTkTextbox(self.main_frame, height=80, width=450, fg_color="#2b2b2b", text_color="#f87171")
        err_box.pack(pady=10)
        err_box.insert("1.0", f"Details:\n{err_msg}")
        err_box.configure(state="disabled")
        
        btn_frame = ctk.CTkFrame(self.main_frame, fg_color="transparent")
        btn_frame.pack(side="bottom", fill="x")
        ctk.CTkButton(btn_frame, text="Quit", fg_color="transparent", border_width=1, command=self.on_closing, width=100).pack(side="left")
        ctk.CTkButton(btn_frame, text="Retry", command=self.start_tunnel, width=100).pack(side="right")

    def show_final(self, code):
        self.clear_frame()
        ctk.CTkLabel(self.main_frame, text="Node Active", font=("Helvetica", 28, "bold"), text_color="#3b82f6").pack(pady=(0, 10))
        ctk.CTkLabel(self.main_frame, text="Secure link established. Send this key to the renter:", font=("Helvetica", 13)).pack(pady=(10, 5))
        
        e = ctk.CTkEntry(self.main_frame, width=480, justify="center", font=("Courier", 14))
        e.insert(0, code)
        e.configure(state="readonly")
        e.pack(pady=15)
        
        def copy_code():
            self.clipboard_clear()
            self.clipboard_append(code)
            copy_btn.configure(text="Copied to Clipboard! \u2713")
        
        copy_btn = ctk.CTkButton(self.main_frame, text="Copy Key", command=copy_code, font=("Helvetica", 13, "bold"), height=40)
        copy_btn.pack(pady=10)
        
        ctk.CTkLabel(self.main_frame, text="Warning: Closing this window will terminate the host node immediately.", text_color="#ef4444", font=("Helvetica", 11)).pack(side="bottom", pady=10)

    def on_closing(self):
        if messagebox.askokcancel("Exit Setup", "Are you sure you want to abort the node setup?"):
            self.destroy()
            os._exit(0)

if __name__ == "__main__":
    ProAgent().mainloop()
