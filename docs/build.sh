#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

if ! command -v python3 >/dev/null 2>&1 && ! command -v python >/dev/null 2>&1; then
  echo "Python is required." >&2
  exit 1
fi

PY=python3
command -v python3 >/dev/null 2>&1 || PY=python

$PY -m pip install --upgrade pip >/dev/null 2>&1 || true
pip install -r requirements.txt

mkdocs build --config-file mkdocs.yml --strict

echo "Built to $(realpath site)"