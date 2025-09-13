#!/usr/bin/env bash
set -euo pipefail

# Add cursor_commands repo as a submodule under scripts/cursor_commands
# Usage:
#   ./scripts/add-cursor-commands.sh https://github.com/<you>/cursor_commands.git [branch]
# Private repo support (optional): export GIT_USER and GIT_PAT

URL="${1:-}"
BRANCH="${2:-}"
TARGET_DIR="scripts/cursor_commands"

if [ -z "$URL" ]; then
  echo "Usage: $0 <repo-url> [branch]" >&2
  exit 1
fi

AUTH_URL="$URL"
if [ -n "${GIT_USER:-}" ] && [ -n "${GIT_PAT:-}" ]; then
  AUTH_URL="$(echo "$URL" | sed -E "s#https://#https://${GIT_USER}:${GIT_PAT}@#")"
fi

if [ -d "$TARGET_DIR/.git" ]; then
  echo "Submodule already present at $TARGET_DIR; updating remote/branch if provided"
  (cd "$TARGET_DIR" && git remote set-url origin "$AUTH_URL")
  if [ -n "$BRANCH" ]; then
    (cd "$TARGET_DIR" && git fetch origin "$BRANCH" && git checkout -q "$BRANCH")
  fi
else
  if [ -n "$BRANCH" ]; then
    git submodule add -b "$BRANCH" "$AUTH_URL" "$TARGET_DIR"
  else
    git submodule add "$AUTH_URL" "$TARGET_DIR"
  fi
fi

git submodule update --init --recursive

echo "cursor_commands submodule is set at $TARGET_DIR"