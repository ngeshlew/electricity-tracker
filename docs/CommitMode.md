# Commit Mode

Commit Mode is a focused workflow to keep changes small, reviewable, and testable.

## Steps
1) Restate goal and constraints (2-3 lines)
2) Plan a minimal viable change
   - enumerate target files only
   - acceptance checks (tests/build/behavior)
3) Execute only what you planned
4) Validate with build/tests; summarize results
5) Produce a Conventional Commit

## Conventional Commits
- feat(scope?): description
- fix(scope?): description
- docs|refactor|test|chore|build|ci|perf|style: description

Body: what and why; notable impacts
Footer: issues/refs/breaking changes

## Examples
- feat(api): add pagination params to list endpoint
- fix(auth): handle expired refresh tokens on startup

## Tips
- If scope grows, pause and re-/plan
- Prefer multiple small commits over one large one