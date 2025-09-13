---
layout: page
title: Installation
permalink: /installation.html
---

### Cursor Starter — Installation Guide

This guide installs and runs the Cursor Starter from scratch. Steps are ordered exactly as required: download the framework from GitHub, copy the framework files, create directory structures, initialize the framework, and then complete the rest of the setup.

### Supported platforms
- macOS 12+
- Ubuntu/Debian Linux (or similar)
- Windows 11 via WSL2 Ubuntu
- Docker (optional)

### Prerequisites
- Git 2.35+ (`git --version`)
- Node.js 18 LTS or 20 LTS (`node -v`)
- One package manager: pnpm 8+ (recommended) / npm 9+ / yarn 1.x
- Optional: Docker 24+ and Docker Compose v2

---

### 1) Download the framework (clone from GitHub)

Option A — Use this repository directly:
```bash
git clone https://github.com/ngeshlew/cursorstarter.git cursor-starter
cd cursor-starter
```

Option B — Use as a template (recommended for new projects):
- On GitHub, click “Use this template” on `ngeshlew/cursorstarter` and create your new repository.
- Then clone your new repo:
```bash
git clone https://github.com/<your-user>/<your-repo>.git
cd <your-repo>
```

Option C — Degit (copy without git history):
```bash
npm create degit@latest ngeshlew/cursorstarter my-app
cd my-app
```

---

### 2) Copy the framework files
If you cloned into a temporary folder and wish to copy the framework into another project directory:
```bash
# Example: copy from ./cursor-starter into ./my-app
mkdir -p my-app
rsync -a --exclude .git cursor-starter/ my-app/
# Fallback without rsync:
# cp -a cursor-starter/. my-app/
cd my-app
```
If you already created your repo via “Use this template” or degit, you can skip copying and just `cd` into your project folder.

---

### 3) Create directory structures
If these paths do not already exist, create them:
```bash
mkdir -p .cursor/rules memory-bank/backups docs wiki scripts
```
These are used by Cursor workflows, memory bank backups, docs, local wiki, and helper scripts.

---

### 4) Initialize the framework
Run the initialization script to seed required files and update the README with quick Cursor commands:
```bash
bash scripts/init.sh
# or
chmod +x scripts/init.sh && ./scripts/init.sh
```
You should see “Initialization complete. Open in Cursor and start with /init then /plan.”

---

### 5) Install Node and a package manager
Recommended: nvm + pnpm via Corepack.

macOS/Linux (including WSL2 Ubuntu):
```bash
# Install nvm
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
# Install Node LTS
nvm install --lts
# Enable pnpm
corepack enable
corepack prepare pnpm@latest --activate
```

Alternatively, you can use npm or yarn if preferred.

---

### 6) Configure environment variables
If present, copy `.env.example` to `.env.local` and fill values:
```bash
[ -f .env.example ] && cp .env.example .env.local || true
```
Common variables:
- `NODE_ENV=development`
- `PORT=3000`
- Any project‑specific keys (e.g., `NEXT_PUBLIC_*`)

Never commit secrets; use `.env.local` for local development.

---

### 7) Install dependencies
```bash
pnpm install
# or: npm install
# or: yarn install
```

---

### 8) Run the development server
```bash
pnpm dev
# or: npm run dev
# or: yarn dev
```
Open the URL printed in your terminal (commonly `http://localhost:3000`).

---

### 9) Linting, formatting, type checks, and tests
```bash
pnpm lint
pnpm format
pnpm typecheck
pnpm test
```
If Husky hooks are used, enable them locally:
```bash
pnpm dlx husky init
```

---

### 10) Build and run for production
```bash
pnpm build
pnpm start
```
Ensure production environment variables are set (e.g., `.env.production`).

---

### 11) Optional: Docker workflow
```bash
# Build image
docker build -t cursor-starter:latest .
# Run container (adjust port as needed)
docker run --name cursor-starter -p 3000:3000 --env-file .env.local cursor-starter:latest
```
With Compose (if `docker-compose.yml` exists):
```bash
docker compose up --build
```

---

### 12) Optional: GitHub Codespaces
- Click “Code → Create codespace on main” in GitHub.
- Ensure `.devcontainer/` is present for preinstalled toolchains.

---

### 13) Verify your installation
- App loads locally without errors
- Lint, typecheck, tests pass:
```bash
pnpm lint && pnpm typecheck && pnpm test
```
- Production build succeeds:
```bash
pnpm build
```

---

### Troubleshooting
- Node version mismatch: use `.nvmrc` if present
```bash
nvm install
nvm use
```
- pnpm not found:
```bash
corepack enable
corepack prepare pnpm@latest --activate
```
- Port already in use:
```bash
PORT=3001 pnpm dev
```
- Permission denied on scripts:
```bash
chmod +x ./scripts/*.sh 2>/dev/null || true
```

---

### Upgrading
```bash
git pull --rebase origin main
pnpm install
pnpm up -L
```

### Uninstall / Cleanup
```bash
pkill -f "pnpm dev" || true
cd .. && rm -rf <your-project-folder>
pnpm store prune
```