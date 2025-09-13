#!/usr/bin/env bash

# Load plugin commands from scripts/cursor_commands if available
cc_plugins_load() {
  local plugin_dir="scripts/cursor_commands"
  if [ -d "$plugin_dir" ]; then
    # source any *.sh files as command providers
    for f in "$plugin_dir"/*.sh; do
      [ -e "$f" ] || continue
      # shellcheck disable=SC1090
      . "$f"
    done
  fi
}

cc_plugins_list() {
  local plugin_dir="scripts/cursor_commands"
  if [ -d "$plugin_dir" ]; then
    ls -1 "$plugin_dir" | sed 's/^/  /'
  else
    echo "  (none)"
  fi
}

# Mode hooks (with automation)
cc_hook_init() {
  echo "[hook:init] Activate rules: ripersigma105.mdc, cursorstarter-core.mdc"
}

cc_hook_research() {
  local base; base="$(cc_base_dir)"
  # Ensure design system and clarity pointers exist
  mkdir -p "$base/docs"
  cc_append_if_not_present "$base/docs/Structure.md" "## Design System" EOF

## Design System
- Capture tokens, components, and accessibility decisions here.
- Link to UI libraries and patterns.

EOF
  cc_append_if_not_present "$base/docs/analytics/Clarity.md" "Mode-Aware Notes" EOF

## Mode-Aware Notes
- Research mode triggered; ensure hypotheses and questions are tracked.

EOF
}

cc_hook_plan() {
  local base; base="$(cc_base_dir)"
  mkdir -p "$base/docs"
  # PRD scaffold
  cc_append_if_not_present "$base/docs/PRD.md" "# Product Requirements" EOF
# Product Requirements Document

## Overview
- Problem
- Goals

## Users & Use Cases
- Personas

## Requirements
- Functional
- Non-functional

## Acceptance Criteria
- 

EOF
  # Design System reminder
  cc_append_if_not_present "$base/docs/Structure.md" "## Design System" EOF

## Design System
- Components, tokens, and patterns to be updated per plan.

EOF
  # Clarity analytics callout (already present, ensure section exists)
  cc_append_if_not_present "$base/docs/analytics/Clarity.md" "## Mode-Aware Notes" EOF

## Mode-Aware Notes
- Plan mode triggered; ensure experiment IDs and session tagging planned.

EOF
  echo "[hook:plan] Generated/updated PRD.md, Design System section, and Clarity notes."
}

cc_hook_execute() {
  echo "[hook:execute] Apply code-protection and permissions; see .cursor/rules/code-protection.mdc, permissions.mdc"
}

cc_hook_review() {
  local base; base="$(cc_base_dir)"
  mkdir -p "$base/docs"
  cc_append_if_not_present "$base/docs/quality-checks.md" "# Quality Gates" EOF
# Quality Gates
- Linting
- Tests
- Performance
- Accessibility
- Security

EOF
  echo "[hook:review] Ensured quality-checks.md exists with skeleton."
}