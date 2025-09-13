#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"
cd "$ROOT_DIR"

err() { echo "[build-wiki] $*" >&2; }

if ! command -v python3 >/dev/null 2>&1 && ! command -v python >/dev/null 2>&1; then
  err "Python is required to build the wiki. Install Python 3 and retry."
  exit 1
fi

PYTHON_BIN="python3"
command -v python3 >/dev/null 2>&1 || PYTHON_BIN="python"

if ! command -v "$PYTHON_BIN" >/dev/null 2>&1; then
  err "Python interpreter not found."
  exit 1
fi

if [ ! -f requirements.txt ]; then
  err "requirements.txt not found at repo root."
  exit 1
fi

# Optional venv for local use
if [ -z "${VIRTUAL_ENV:-}" ]; then
  VENV_DIR=".venv-wiki"
  if [ ! -d "$VENV_DIR" ]; then
    "$PYTHON_BIN" -m venv "$VENV_DIR" || { err "Failed to create virtualenv"; exit 1; }
  fi
  # shellcheck disable=SC1091
  source "$VENV_DIR/bin/activate"
fi

python -m pip install --upgrade pip >/dev/null 2>&1 || true
pip install -r requirements.txt || { err "Dependency install failed"; exit 1; }

if [ ! -f mkdocs.yml ]; then
  err "mkdocs.yml not found at repo root."
  exit 1
fi

if [ ! -d wiki ]; then
  err "wiki/ directory not found. Nothing to build."
  exit 1
fi

mkdocs build --strict || { err "MkDocs build failed"; exit 1; }

echo "Wiki built successfully at $(realpath site)"