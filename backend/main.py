import subprocess
import os
import jwt
import datetime
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse
from pydantic import BaseModel

from fastapi_sso.sso.google import GoogleSSO
from fastapi_sso.sso.microsoft import MicrosoftSSO

load_dotenv()

app = FastAPI(title="FriendCloud VPS Auth Backend", version="3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SECURITY CONFIGURATION
JWT_SECRET = os.getenv("JWT_SECRET", "super-secret-friendcloud-key")
ALLOWED_EMAILS = [email.strip() for email in os.getenv("ALLOWED_EMAILS", "").split(",")]

# SSO PROVIDERS
google_sso = GoogleSSO(
    client_id=os.getenv("GOOGLE_CLIENT_ID", ""),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET", ""),
    redirect_uri=os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/auth/google/callback"),
    allow_insecure_http=True # Allows testing on localhost HTTP
)

microsoft_sso = MicrosoftSSO(
    client_id=os.getenv("MICROSOFT_CLIENT_ID", ""),
    client_secret=os.getenv("MICROSOFT_CLIENT_SECRET", ""),
    redirect_uri=os.getenv("MICROSOFT_REDIRECT_URI", "http://localhost:8000/auth/microsoft/callback"),
    allow_insecure_http=True
)

# ---------------------------------------------------
# AUTHENTICATION LOGIC
# ---------------------------------------------------
def verify_token_and_get_email(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload["sub"]
    except Exception:
        raise HTTPException(status_code=401, detail="Session expired or invalid. Please log in again.")

def authorize_user(email: str):
    if "*" in ALLOWED_EMAILS:
        return # Allow everyone
    if email not in ALLOWED_EMAILS:
        raise HTTPException(status_code=403, detail=f"Access Denied: The email {email} is not whitelisted by the host.")

@app.get("/auth/google/login")
async def google_login():
    return await google_sso.get_login_redirect()

@app.get("/auth/google/callback")
async def google_callback(request: Request):
    user = await google_sso.verify_and_process(request)
    authorize_user(user.email) # Verify against whitelist
    
    # Create JWT Token
    payload = {"sub": user.email, "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)}
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    
    return RedirectResponse(url=f"/?token={token}&email={user.email}")

@app.get("/auth/microsoft/login")
async def microsoft_login():
    return await microsoft_sso.get_login_redirect()

@app.get("/auth/microsoft/callback")
async def microsoft_callback(request: Request):
    user = await microsoft_sso.verify_and_process(request)
    authorize_user(user.email)
    
    payload = {"sub": user.email, "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)}
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    
    return RedirectResponse(url=f"/?token={token}&email={user.email}")


# ---------------------------------------------------
# DOCKER EXECUTION API (Now protected by JWT `token`)
# ---------------------------------------------------
class LaunchRequest(BaseModel):
    image: str
    ram: str
    cpu: str
    token: str
    instance_id: str

class ExecuteRequest(BaseModel):
    command: str
    image: str
    token: str
    instance_id: str

class TerminateRequest(BaseModel):
    token: str
    instance_id: str

@app.post("/launch")
async def launch_instance(request: LaunchRequest):
    email = verify_token_and_get_email(request.token)
    authorize_user(email)

    container_name = f"fc-{request.instance_id}"
    subprocess.run(["docker", "rm", "-f", container_name], capture_output=True)

    docker_cmd = [
        "docker", "run", "-d", "--name", container_name,
        "--memory", request.ram, "--cpus", request.cpu,
        "--network", "none", request.image, "tail", "-f", "/dev/null"
    ]

    try:
        process = subprocess.run(docker_cmd, capture_output=True, text=True)
        if process.returncode != 0: raise Exception(process.stderr)
        return {"message": f"Virtual Environment Initialized."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Launch failed: {str(e)}")

@app.post("/execute")
async def execute_task(request: ExecuteRequest):
    email = verify_token_and_get_email(request.token)
    authorize_user(email)

    container_name = f"fc-{request.instance_id}"

    if "python" in request.image: entrypoint = ["python", "-c", request.command]
    elif "node" in request.image: entrypoint = ["node", "-e", request.command]
    else: entrypoint = ["sh", "-c", request.command]

    docker_cmd = ["docker", "exec", container_name] + entrypoint

    try:
        process = subprocess.run(docker_cmd, capture_output=True, text=True, timeout=30)
        output = process.stdout
        if process.stderr: output += f"\n[STDERR]\n{process.stderr}"
        if not output.strip(): output = "[Executed without output]"
        return {"output": output}
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=408, detail="Execution timed out after 30 seconds.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Execution failed: {str(e)}")


class AuthReq(BaseModel):
    passkey: str = None  # Optional for local main.py testing

@app.post("/sysinfo")
async def get_sysinfo(req: AuthReq = None):
    import platform
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

@app.post("/terminate")
async def terminate_instance(request: TerminateRequest):
    email = verify_token_and_get_email(request.token)
    authorize_user(email)

    container_name = f"fc-{request.instance_id}"
    subprocess.run(["docker", "rm", "-f", container_name], capture_output=True)
    return {"message": f"Hardware Resources Released."}


@app.get("/download-agent")
async def download_agent():
    # Looks for the .exe inside the host_builder/dist folder
    exe_path = os.path.join(os.path.dirname(__file__), "../host_builder/dist/FriendCloud-Host.exe")
    if os.path.exists(exe_path):
        return FileResponse(path=exe_path, filename="FriendCloud-Host.exe", media_type="application/octet-stream")
    raise HTTPException(status_code=404, detail="Host Agent not found. The server admin needs to build it.")

# ==========================================
# FRONTEND SERVING LOGIC (FOR NGROK)
# ==========================================
frontend_dist = os.path.join(os.path.dirname(__file__), "../frontend/dist")

if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=f"{frontend_dist}/assets"), name="assets")
    @app.get("/{catchall:path}")
    async def serve_frontend(catchall: str):
        requested_file = os.path.join(frontend_dist, catchall)
        if os.path.isfile(requested_file):
            return FileResponse(requested_file)
        return FileResponse(f"{frontend_dist}/index.html")
