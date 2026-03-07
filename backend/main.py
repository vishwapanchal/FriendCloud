import subprocess
import os
import jwt
import datetime
import platform
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse
from pydantic import BaseModel, EmailStr
from typing import Optional

from motor.motor_asyncio import AsyncIOMotorClient
import bcrypt

load_dotenv()

app = FastAPI(title="FriendCloud VPS Auth Backend", version="3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

JWT_SECRET = os.getenv("JWT_SECRET", "super-secret-friendcloud-key")
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")

# MongoDB Setup
client = AsyncIOMotorClient(MONGODB_URL)
db = client.friendcloud
users_collection = db.get_collection("users")

# Password Hashing
def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_token_and_get_email(token: Optional[str]):
    if not token:
        raise HTTPException(status_code=401, detail="Missing authentication token.")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload["sub"]
    except Exception:
        raise HTTPException(status_code=401, detail="Session expired or invalid. Please log in again.")

async def authorize_user(email: str):
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=403, detail=f"Access Denied: Record not found.")
    return user

class UserSignup(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

@app.post("/auth/signup")
async def signup(user: UserSignup):
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = {"email": user.email, "hashed_password": hashed_password}
    await users_collection.insert_one(new_user)
    
    return {"message": "User created successfully"}

@app.post("/auth/login")
async def login(user: UserLogin):
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    payload = {"sub": user.email, "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7)}
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    
    return {"token": token, "email": user.email}

class LaunchRequest(BaseModel):
    image: str = "ubuntu"
    ram: str = "512m"
    cpu: str = "1"
    passkey: Optional[str] = None
    instance_id: str

class ExecuteRequest(BaseModel):
    command: Optional[str] = ""
    image: str = "ubuntu"
    passkey: Optional[str] = None
    instance_id: str

class TerminateRequest(BaseModel):
    passkey: Optional[str] = None
    instance_id: str

class AuthReq(BaseModel):
    passkey: Optional[str] = None

@app.post("/launch")
async def launch_instance(request: LaunchRequest):

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

@app.post("/sysinfo")
async def get_sysinfo(req: Optional[AuthReq] = None):
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

    container_name = f"fc-{request.instance_id}"
    subprocess.run(["docker", "rm", "-f", container_name], capture_output=True)
    return {"message": f"Hardware Resources Released."}

@app.get("/download-agent")
async def download_agent():
    exe_path = os.path.join(os.path.dirname(__file__), "../host_builder/dist/FriendCloud-Host.exe")
    if os.path.exists(exe_path):
        return FileResponse(path=exe_path, filename="FriendCloud-Host.exe", media_type="application/octet-stream")
    raise HTTPException(status_code=404, detail="Host Agent not found. The server admin needs to build it.")

frontend_dist = os.path.join(os.path.dirname(__file__), "../frontend/dist")

if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=f"{frontend_dist}/assets"), name="assets")
    
    # Catch-all route for the SPA, but exclude actual API routes
    @app.get("/{catchall:path}")
    async def serve_frontend(request: Request, catchall: str):
        # Allow actual API requests to fall through or return 404s properly
        if catchall.startswith("auth/") or catchall.startswith("sysinfo") or catchall.startswith("launch") or catchall.startswith("execute") or catchall.startswith("terminate") or catchall.startswith("download-agent"):
             raise HTTPException(status_code=404, detail="Not Found")
             
        requested_file = os.path.join(frontend_dist, catchall)
        if os.path.isfile(requested_file):
            return FileResponse(requested_file)
        return FileResponse(f"{frontend_dist}/index.html")