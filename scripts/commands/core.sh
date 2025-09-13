#!/usr/bin/env bash

# shellcheck source=/dev/null
. "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/utils.sh"

cc_init() {
  echo "[init] Initializing memory bank and context..."
  cc_ensure_dirs
  local base; base="$(cc_base_dir)"
  cc_touch_heading "$base/memory-bank/projectbrief.md" "# Project Brief"
  cc_touch_heading "$base/memory-bank/activeContext.md" "# Active Context"
  cc_touch_heading "$base/memory-bank/systemPatterns.md" "# System Patterns"
  cc_touch_heading "$base/memory-bank/techContext.md" "# Technical Context"
  cc_touch_heading "$base/memory-bank/progress.md" "# Progress"
  cc_touch_heading "$base/memory-bank/protection.md" "# Protection"
  echo "[init] Done. Edit memory-bank/*.md to provide details."
}

cc_plan() {
  local base; base="$(cc_base_dir)"
  echo "[plan] Updating memory bank entries..."
  cc_append_section "$base/memory-bank/activeContext.md" "## Plan" "- Target files: \n- Acceptance checks: "
  cc_append_section "$base/memory-bank/progress.md" "## Planned Work" "- Scope: \n- Milestones: "
  echo "[plan] Consider PRD and design system updates (docs/analytics/Clarity.md)."
}

cc_execute() {
  local base; base="$(cc_base_dir)"
  echo "[execute] Recording execution checkpoint..."
  cc_append_section "$base/memory-bank/progress.md" "## Execution" "- Changes applied: \n- Impact: "
  echo "[execute] Use Cursor rules: /execute"
}

cc_review() {
  local base; base="$(cc_base_dir)"
  echo "[review] Summarize changes and results."
  cc_append_section "$base/memory-bank/progress.md" "## Review" "- Summary: \n- Test/build results: "
}

cc_commit() {
  echo "[commit] Compose a Conventional Commit message."
  echo "[commit] Example: feat(scope): concise description"
}

cc_help() {
  cat <<EOF
cursor commands:
  init       Initialize memory bank templates
  plan       Append planning notes (activeContext, progress)
  execute    Append execution checkpoint (progress)
  review     Append review notes (progress)
  commit     Guidance for Conventional Commits
  list       List available commands (including plugins)
  help       Show this help
EOF
}