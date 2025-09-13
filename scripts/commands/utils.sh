#!/usr/bin/env bash
set -euo pipefail

cc_base_dir() {
  # Allow tests to run in an isolated directory via CC_BASE_DIR
  local base="${CC_BASE_DIR:-.}"
  printf "%s" "$base"
}

cc_ensure_dirs() {
  local base; base="$(cc_base_dir)"
  mkdir -p "$base/memory-bank" "$base/docs" "$base/wiki"
}

cc_now() { date -Iseconds; }

cc_append_section() {
  # Usage: cc_append_section <file> <title> [body]
  local file="$1"; shift
  local title="$1"; shift || true
  local body="${*:-}"
  # Ensure parent directory exists
  mkdir -p "$(dirname "$file")"
  {
    echo "";
    echo "${title} ($(cc_now))";
    if [ -n "$body" ]; then
      echo "$body"
    fi
  } >> "$file"
}

cc_touch_heading() {
  # Ensure a top-level heading exists in file if creating new
  local file="$1"; shift
  local heading="$1"; shift
  if [ ! -s "$file" ]; then
    echo "${heading}" > "$file"
  fi
}

cc_append_if_not_present() {
  # Usage: cc_append_if_not_present <file> <grep_pattern> <here_doc_marker>
  local file="$1"; shift
  local pattern="$1"; shift
  local marker="$1"; shift
  if ! grep -q "$pattern" "$file" 2>/dev/null; then
    cat >> "$file" <<$marker
$*
$marker
  fi
}