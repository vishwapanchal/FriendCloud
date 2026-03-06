import os, base64, random, string, subprocess, threading, re, platform, webbrowser, ctypes, time
import customtkinter as ctk
from tkinter import messagebox
from PIL import Image, ImageDraw
import pystray
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# --- HARDWARE DETECTION ---
try:
    import psutil
    TOTAL_RAM_GB = int(round(psutil.virtual_memory().total / (1024**3)))
    # Calculates free space on the primary system drive (C: on Windows)
    TOTAL_STORAGE_GB = int(psutil.disk_usage('/').free / (1024**3))
except ImportError:
    psutil = None
    TOTAL_RAM_GB = 4
    TOTAL_STORAGE_GB = 50

TOTAL_CORES = os.cpu_count() or 2
CREATE_NO_WINDOW = 0x08000000 if platform.system() == "Windows" else 0

PASSKEY = ''.join(random.choices(string.ascii_letters + string.digits, k=16))

# Default Slider Values
HOST_MAX_RAM = max(0.5, float(TOTAL_RAM_GB // 2))
HOST_MAX_CPU = max(1, TOTAL_CORES // 2)
HOST_MAX_STORAGE = min(20, TOTAL_STORAGE_GB)
HOST_ALLOW_GPU = False

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

class AuthReq(BaseModel): 
    passkey: str

class TaskReq(BaseModel):
    image: str = "ubuntu"
    ram: str = "512m"
    cpu: str = "1"
    storage: str = "5g"
    use_gpu: bool = False
    passkey: str
    instance_id: str
    command: str = ""

@app.post("/sysinfo")
async def get_sysinfo(req: AuthReq):
    if req.passkey != PASSKEY: raise HTTPException(status_code=401)
    try: dkr = subprocess.run(["docker", "--version"], capture_output=True, text=True, creationflags=CREATE_NO_WINDOW).stdout.strip()
    except: dkr = "N/A"
    try:
        gpu_info = subprocess.run(["nvidia-smi", "--query-gpu=name", "--format=csv,noheader"], capture_output=True, text=True, check=True, creationflags=CREATE_NO_WINDOW).stdout.strip()
        has_gpu = True
    except: gpu_info, has_gpu = "None", False
    
    return {
        "os": f"{platform.system()} {platform.release()}", 
        "cpu_name": platform.processor() or platform.machine(),
        "gpu_name": gpu_info, 
        "has_gpu": has_gpu, 
        "allowed_gpu": HOST_ALLOW_GPU, 
        "cores": TOTAL_CORES,
        "ram": f"{TOTAL_RAM_GB} GB", 
        "allowed_ram": HOST_MAX_RAM, 
        "allowed_cpu": HOST_MAX_CPU, 
        "allowed_storage": HOST_MAX_STORAGE, 
        "docker": dkr, 
        "node": platform.node()
    }

@app.post("/launch")
async def launch(req: TaskReq):
    if req.passkey != PASSKEY: raise HTTPException(status_code=401)
    
    # Parse requested limits
    req_ram_gb = 0.5 if req.ram == "512m" else float(req.ram.replace("g", "").replace("G", ""))
    req_storage_gb = float(req.storage.replace("g", "").replace("G", ""))
    
    # Validate against Host's maximum sliders
    if req_ram_gb > HOST_MAX_RAM: raise HTTPException(status_code=403, detail="Requested RAM exceeds host allowance.")
    if int(req.cpu) > HOST_MAX_CPU: raise HTTPException(status_code=403, detail="Requested CPU exceeds host allowance.")
    if req_storage_gb > HOST_MAX_STORAGE: raise HTTPException(status_code=403, detail="Requested Storage exceeds host allowance.")

    cname = f"fc-{req.instance_id}"
    subprocess.run(["docker", "rm", "-f", cname], capture_output=True, creationflags=CREATE_NO_WINDOW)
    
    cmd = ["docker", "run", "-d", "--name", cname, "--memory", req.ram, "--cpus", req.cpu, "--network", "none"]
    if req.use_gpu and HOST_ALLOW_GPU: cmd.extend(["--gpus", "all"])
    cmd.extend([req.image, "tail", "-f", "/dev/null"])
    
    proc = subprocess.run(cmd, capture_output=True, text=True, creationflags=CREATE_NO_WINDOW)
    if proc.returncode != 0: raise HTTPException(status_code=500, detail=proc.stderr)
    return {"message": "Environment ready."}

@app.post("/execute")
async def execute(req: TaskReq):
    if req.passkey != PASSKEY: raise HTTPException(status_code=401)
    entry = ["python", "-c", req.command] if "python" in req.image else (["node", "-e", req.command] if "node" in req.image else ["sh", "-c", req.command])
    proc = subprocess.run(["docker", "exec", f"fc-{req.instance_id}"] + entry, capture_output=True, text=True, timeout=30, creationflags=CREATE_NO_WINDOW)
    return {"output": proc.stdout + proc.stderr}

@app.post("/terminate")
async def terminate(req: TaskReq):
    if req.passkey != PASSKEY: raise HTTPException(status_code=401)
    subprocess.run(["docker", "rm", "-f", f"fc-{req.instance_id}"], capture_output=True, creationflags=CREATE_NO_WINDOW)
    return {"message": "Destroyed."}

def start_api_server(): 
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="error")

threading.Thread(target=start_api_server, daemon=True).start()

# --- DESKTOP UI ---
ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("blue")

class ProAgent(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("FriendCloud Host Setup")
        self.geometry("600x550")
        self.resizable(False, False)
        self.protocol("WM_DELETE_WINDOW", self.on_closing)
        self.ssh_process = None
        self.main_frame = ctk.CTkFrame(self, fg_color="transparent")
        self.main_frame.pack(fill="both", expand=True, padx=40, pady=40)
        self.show_welcome()

    def clear_frame(self):
        for widget in self.main_frame.winfo_children(): widget.destroy()

    def show_welcome(self):
        self.clear_frame()
        ctk.CTkLabel(self.main_frame, text="FriendCloud Node Setup", font=("Helvetica", 28, "bold")).pack(pady=(0, 10))
        ctk.CTkLabel(self.main_frame, text="Configure your system as a secure P2P compute node.", justify="center", font=("Helvetica", 14), text_color="gray").pack(pady=5)
        features = ctk.CTkFrame(self.main_frame, fg_color=("#e0e0e0", "#1f1f1f"))
        features.pack(fill="x", pady=20)
        ctk.CTkLabel(features, text="\u2713 Automatic Environment Repair\n\u2713 End-to-end Encrypted Tunnel\n\u2713 Strict Container Isolation", justify="left", font=("Helvetica", 13)).pack(pady=15, padx=20, anchor="w")
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
        try:
            self.after(0, lambda: self.status_label.configure(text="Checking for OpenSSH Client..."))
            subprocess.run(["ssh", "-V"], check=True, capture_output=True, creationflags=CREATE_NO_WINDOW)
        except Exception:
            self.after(0, self.ask_install_ssh)
            return

        try:
            self.after(500, lambda: self.status_label.configure(text="Checking Docker Engine Status..."))
            subprocess.run(["docker", "info"], check=True, capture_output=True, creationflags=CREATE_NO_WINDOW)
            self.after(1000, self.show_ready)
        except Exception:
            self.after(0, self.show_docker_error)

    def ask_install_ssh(self):
        self.progress.stop()
        if messagebox.askyesno("Dependency Missing", "OpenSSH Client is required but not found.\n\nWould you like to install and enable it automatically? (Requires Admin)"):
            self.status_label.configure(text="Installing OpenSSH... Please wait.")
            self.progress.start()
            threading.Thread(target=self.install_ssh_admin, daemon=True).start()
        else:
            self.show_welcome()

    def install_ssh_admin(self):
        ps_cmd = "Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0"
        try:
            ctypes.windll.shell32.ShellExecuteW(None, "runas", "powershell.exe", f"-Command {ps_cmd}", None, 1)
            time.sleep(15)
            self.after(0, self.run_checks)
        except Exception as e:
            self.after(0, lambda: messagebox.showerror("Install Failed", f"Could not install OpenSSH: {e}"))
            self.after(0, self.show_welcome)

    def show_docker_error(self):
        self.clear_frame()
        ctk.CTkLabel(self.main_frame, text="Verification Failed", font=("Helvetica", 24, "bold"), text_color="#ef4444").pack(pady=(0, 20))
        ctk.CTkLabel(self.main_frame, text="Docker Engine is either not installed or not actively running.", justify="center").pack(pady=10)
        ctk.CTkButton(self.main_frame, text="Download Docker", fg_color="transparent", border_width=2, command=lambda: webbrowser.open("https://www.docker.com/products/docker-desktop/")).pack(pady=20)
        btn_frame = ctk.CTkFrame(self.main_frame, fg_color="transparent")
        btn_frame.pack(side="bottom", fill="x")
        ctk.CTkButton(btn_frame, text="< Back", fg_color="transparent", border_width=1, command=self.show_welcome, width=100).pack(side="left")
        ctk.CTkButton(btn_frame, text="Retry", command=self.show_preflight, width=100).pack(side="right")

    def show_ready(self):
        self.clear_frame()
        ctk.CTkLabel(self.main_frame, text="Resource Limits", font=("Helvetica", 24, "bold"), text_color="#10b981").pack(pady=(0, 10))
        ctk.CTkLabel(self.main_frame, text="Drag sliders to set the maximum resources available for rent.", font=("Helvetica", 12), text_color="gray").pack(pady=(0, 15))
        
        config_frame = ctk.CTkFrame(self.main_frame, fg_color="transparent")
        config_frame.pack(fill="x", pady=5)

        # 1. RAM SLIDER
        self.ram_val_lbl = ctk.CTkLabel(config_frame, text=f"Max RAM: {HOST_MAX_RAM} GB", font=("Helvetica", 13, "bold"))
        self.ram_val_lbl.pack(anchor="w")
        self.ram_slider = ctk.CTkSlider(config_frame, from_=0.5, to=max(1, TOTAL_RAM_GB), number_of_steps=int(max(1, (TOTAL_RAM_GB-0.5)*2)), command=self.update_ram)
        self.ram_slider.set(HOST_MAX_RAM)
        self.ram_slider.pack(fill="x", pady=(0, 15))

        # 2. CPU SLIDER
        self.cpu_val_lbl = ctk.CTkLabel(config_frame, text=f"Max CPU Cores: {HOST_MAX_CPU}", font=("Helvetica", 13, "bold"))
        self.cpu_val_lbl.pack(anchor="w")
        self.cpu_slider = ctk.CTkSlider(config_frame, from_=1, to=TOTAL_CORES, number_of_steps=max(1, TOTAL_CORES-1), command=self.update_cpu)
        self.cpu_slider.set(HOST_MAX_CPU)
        self.cpu_slider.pack(fill="x", pady=(0, 15))

        # 3. STORAGE SLIDER
        self.storage_val_lbl = ctk.CTkLabel(config_frame, text=f"Max Storage: {HOST_MAX_STORAGE} GB", font=("Helvetica", 13, "bold"))
        self.storage_val_lbl.pack(anchor="w")
        self.storage_slider = ctk.CTkSlider(config_frame, from_=1, to=max(1, TOTAL_STORAGE_GB), number_of_steps=max(1, TOTAL_STORAGE_GB-1), command=self.update_storage)
        self.storage_slider.set(HOST_MAX_STORAGE)
        self.storage_slider.pack(fill="x", pady=(0, 15))

        # 4. GPU CHECKBOX
        self.gpu_var = ctk.BooleanVar(value=False)
        ctk.CTkCheckBox(config_frame, text="Allow Hardware GPU Access", variable=self.gpu_var).pack(anchor="w", pady=10)

        btn_frame = ctk.CTkFrame(self.main_frame, fg_color="transparent")
        btn_frame.pack(side="bottom", fill="x")
        ctk.CTkButton(btn_frame, text="< Back", fg_color="transparent", border_width=1, command=self.show_welcome, width=100).pack(side="left")
        self.install_btn = ctk.CTkButton(btn_frame, text="Initiate Tunnel", command=self.start_tunnel, width=130, font=("Helvetica", 13, "bold"), fg_color="#10b981", hover_color="#059669")
        self.install_btn.pack(side="right")

    def update_ram(self, val): self.ram_val_lbl.configure(text=f"Max RAM: {val:.1f} GB")
    def update_cpu(self, val): self.cpu_val_lbl.configure(text=f"Max CPU Cores: {int(val)}")
    def update_storage(self, val): self.storage_val_lbl.configure(text=f"Max Storage: {int(val)} GB")

    def start_tunnel(self):
        global HOST_MAX_RAM, HOST_MAX_CPU, HOST_MAX_STORAGE, HOST_ALLOW_GPU, PASSKEY
        HOST_MAX_RAM = float(self.ram_slider.get())
        HOST_MAX_CPU = int(self.cpu_slider.get())
        HOST_MAX_STORAGE = int(self.storage_slider.get())
        HOST_ALLOW_GPU = self.gpu_var.get()
        PASSKEY = ''.join(random.choices(string.ascii_letters + string.digits, k=16))
        
        self.install_btn.configure(state="disabled", text="Connecting...")
        threading.Thread(target=self.run_ssh_tunnel, daemon=True).start()

    def run_ssh_tunnel(self):
        relays = [
            ["ssh", "-o", "StrictHostKeyChecking=no", "-o", "UserKnownHostsFile=NUL", "-o", "ServerAliveInterval=15", "-o", "ServerAliveCountMax=3", "-R", "80:127.0.0.1:8000", "nokey@localhost.run"],
            ["ssh", "-o", "StrictHostKeyChecking=no", "-o", "UserKnownHostsFile=NUL", "-o", "ServerAliveInterval=15", "-o", "ServerAliveCountMax=3", "-R", "80:127.0.0.1:8000", "serveo.net"],
            ["ssh", "-p", "443", "-o", "StrictHostKeyChecking=no", "-o", "UserKnownHostsFile=NUL", "-o", "ServerAliveInterval=15", "-o", "ServerAliveCountMax=3", "-R", "0:localhost:8000", "a.pinggy.io"]
        ]
        last_error = ""
        for cmd in relays:
            try:
                self.ssh_process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, creationflags=CREATE_NO_WINDOW)
                output_log = []
                for line in iter(self.ssh_process.stdout.readline, ''):
                    output_log.append(line.strip())
                    match = re.search(r'(https://[a-zA-Z0-9.-]+\.(?:lhr\.life|lhr\.net|serveo\.net|pinggy\.link|pinggy\.online))', line)
                    if match:
                        code = base64.b64encode(f"{match.group(1)}|{PASSKEY}".encode()).decode()
                        self.after(0, lambda c=code: self.show_final(c))
                        self.ssh_process.wait()
                        self.after(0, lambda: self.show_tunnel_error("Connection dropped."))
                        return
                    if self.ssh_process.poll() is not None: break
                if output_log: last_error = "\n".join(output_log[-3:])
            except Exception as e: last_error = str(e)
        self.after(0, lambda: self.show_tunnel_error(f"Relay Failed.\n{last_error}"))

    def show_tunnel_error(self, err_msg="Unknown"):
        self.clear_frame()
        ctk.CTkLabel(self.main_frame, text="Tunnel Failed", font=("Helvetica", 24, "bold"), text_color="#ef4444").pack(pady=(0, 10))
        err_box = ctk.CTkTextbox(self.main_frame, height=100, width=450, fg_color="#2b2b2b", text_color="#f87171")
        err_box.pack(pady=10); err_box.insert("1.0", f"Details:\n{err_msg}"); err_box.configure(state="disabled")
        btn_frame = ctk.CTkFrame(self.main_frame, fg_color="transparent")
        btn_frame.pack(side="bottom", fill="x")
        ctk.CTkButton(btn_frame, text="Quit", fg_color="transparent", border_width=1, command=self.on_closing, width=100).pack(side="left")
        ctk.CTkButton(btn_frame, text="Retry", command=self.start_tunnel, width=140).pack(side="right")

    def show_final(self, code):
        self.clear_frame()
        ctk.CTkLabel(self.main_frame, text="Node Active", font=("Helvetica", 28, "bold"), text_color="#3b82f6").pack(pady=(0, 10))
        ctk.CTkLabel(self.main_frame, text="Secure link established. Send this key to the renter:", font=("Helvetica", 13)).pack(pady=(10, 5))
        e = ctk.CTkEntry(self.main_frame, width=480, justify="center", font=("Courier", 14))
        e.insert(0, code); e.configure(state="readonly"); e.pack(pady=15)
        def copy(): self.clipboard_clear(); self.clipboard_append(code); copy_btn.configure(text="Copied! \u2713")
        copy_btn = ctk.CTkButton(self.main_frame, text="Copy Key", command=copy, font=("Helvetica", 13, "bold"), height=40)
        copy_btn.pack(pady=10)
        
        def regen():
            if self.ssh_process:
                try: self.ssh_process.terminate()
                except: pass
            self.start_tunnel()
        regen_btn = ctk.CTkButton(self.main_frame, text="Regenerate Key / Restart Link", command=regen, font=("Helvetica", 11), fg_color="#ef4444", hover_color="#dc2626")
        regen_btn.pack(pady=5)
        
        ctk.CTkLabel(self.main_frame, text="Note: Closing window minimizes node to system tray.", text_color="#10b981", font=("Helvetica", 11)).pack(side="bottom", pady=10)

    def on_closing(self):
        # Instead of asking and terminating, we hide the window to tray
        self.withdraw()
        threading.Thread(target=self.create_tray_icon, daemon=True).start()

    def create_tray_icon(self):
        if hasattr(self, 'tray_icon') and self.tray_icon is not None:
            return
            
        # Generate a fallback generic icon (blue circle on dark rect)
        image = Image.new('RGB', (64, 64), color=(15, 23, 42))
        try:
            draw = ImageDraw.Draw(image)
            draw.ellipse((16, 16, 48, 48), fill=(6, 182, 212))
        except: pass
        
        menu = pystray.Menu(
            pystray.MenuItem("Show Window", self.show_window_from_tray),
            pystray.MenuItem("Quit FriendCloud Host", self.quit_from_tray)
        )
        self.tray_icon = pystray.Icon("FriendCloud", image, "FriendCloud Node", menu)
        self.tray_icon.run()

    def show_window_from_tray(self, icon, item):
        icon.stop()
        self.tray_icon = None
        self.after(0, self.deiconify)
        
    def quit_from_tray(self, icon, item):
        icon.stop()
        if self.ssh_process: 
            try: self.ssh_process.terminate()
            except: pass
        self.destroy(); os._exit(0)

if __name__ == "__main__": ProAgent().mainloop()
