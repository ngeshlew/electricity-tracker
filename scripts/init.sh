#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"

mkdir -p "$ROOT_DIR/.cursor/rules" "$ROOT_DIR/memory-bank/backups" "$ROOT_DIR/docs" "$ROOT_DIR/docs/design-systems" "$ROOT_DIR/wiki" "$ROOT_DIR/scripts"

# Create memory bank files if missing
for f in projectbrief.md systemPatterns.md techContext.md activeContext.md progress.md protection.md; do
  if [ ! -f "$ROOT_DIR/memory-bank/$f" ]; then
    echo "Initializing memory-bank/$f"
    touch "$ROOT_DIR/memory-bank/$f"
  fi
done

# Seed README usage snippet if not present
if ! grep -q "/plan" "$ROOT_DIR/README.md" 2>/dev/null; then
  cat >> "$ROOT_DIR/README.md" <<'EOF'

---
Quick Cursor commands:
- /init, /plan, /execute, /review, /commit
EOF
fi

echo "Initialization complete. Open in Cursor and start with /init then /plan."