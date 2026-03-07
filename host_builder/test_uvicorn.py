import sys
import threading
from fastapi import FastAPI
import uvicorn
import time
import requests

sys.stdout = None
sys.stderr = None

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

def run_server():
    try:
        uvicorn.run(app, host="127.0.0.1", port=8129, log_level="error")
    except Exception as e:
        with open("uvicorn_error.log", "w") as f:
            f.write(str(e))

threading.Thread(target=run_server, daemon=True).start()
time.sleep(2)
try:
    r = requests.get("http://127.0.0.1:8129/")
    with open("uvicorn_test.log", "w") as f:
        f.write("Success: " + r.text)
except Exception as e:
    with open("uvicorn_test.log", "w") as f:
        f.write("Failed to connect: " + str(e))
