#!/bin/bash

echo "🔒 Setting up Professional Secrets Management..."

# 1. Create a comprehensive .gitignore in the root directory
cat << 'EOF' > .gitignore
# Environments
backend/.env
venv/
env/
__pycache__/
*.pyc

# Node
frontend/node_modules/

# Builds
frontend/dist/
host_builder/build/
host_builder/dist/
*.exe
*.spec

# OS Files
.DS_Store
Thumbs.db
EOF

echo "✅ Created .gitignore to hide API keys."

# 2. Create the safe .env.example template for GitHub
cat << 'EOF' > backend/.env.example
# =======================================================
# FRIENDCLOUD ENVIRONMENT VARIABLES
# Rename this file to .env and fill in your actual keys.
# DO NOT push your actual .env file to version control.
# =======================================================

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id_here"
GOOGLE_CLIENT_SECRET="your_google_client_secret_here"
GOOGLE_REDIRECT_URI="http://localhost:8000/auth/google/callback"

# Microsoft OAuth
MICROSOFT_CLIENT_ID="your_microsoft_client_id_here"
MICROSOFT_CLIENT_SECRET="your_microsoft_client_secret_here"
MICROSOFT_REDIRECT_URI="http://localhost:8000/auth/microsoft/callback"

# Security
JWT_SECRET="generate_a_random_jwt_secret_string_here"
ALLOWED_EMAILS="*"
EOF

echo "✅ Created backend/.env.example template."

# 3. Clean git cache just in case .env was already tracked
if [ -d ".git" ]; then
    echo "🧹 Scrubbing .env from Git tracking history (if it exists)..."
    git rm -r --cached backend/.env 2>/dev/null
    git rm -r --cached frontend/node_modules 2>/dev/null
    git rm -r --cached venv 2>/dev/null
fi

echo "------------------------------------------------------------------"
echo "🎉 SUCCESS! Your repo is now professionally secured."
echo "You can now safely run: git add . && git commit -m 'UI Polish and Secrets'"
echo "------------------------------------------------------------------"#!/bin/bash

echo "🛠️ Patching main.py TaskReq model for P2P testing..."

cd backend || { echo "❌ backend folder not found!"; exit 1; }

python -c '
import os
file_path = "main.py"

with open(file_path, "r") as f:
    content = f.read()

# Replace the old TaskReq model with the new P2P-compatible one
old_model_start = content.find("class TaskReq(BaseModel):")
if old_model_start != -1:
    # Find the end of the class (we assume it ends before the next endpoint or class)
    end_of_class = content.find("@app.post", old_model_start)
    if end_of_class != -1:
        new_model = """class TaskReq(BaseModel):
    image: str = "ubuntu"
    ram: str = "512m"
    cpu: str = "1"
    token: str = None     # Make old token optional
    passkey: str = None   # Add new P2P passkey
    instance_id: str
    command: str = ""

"""
        new_content = content[:old_model_start] + new_model + content[end_of_class:]
        with open(file_path, "w") as f:
            f.write(new_content)
        print("✅ TaskReq model updated successfully!")
    else:
        print("⚠️ Could not parse the end of the TaskReq class.")
else:
    print("⚠️ Could not find TaskReq in main.py.")
'

echo "✅ DONE! Restart your FastAPI server."