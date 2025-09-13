# Modes

RIPER Sigma defines five modes with permission-aware behavior:

- Research (Ω₁): read-only, gather findings
- Innovate (Ω₂): explore options, no real file changes
- Plan (Ω₃): plan/spec changes, limited creation
- Execute (Ω₄): implement planned changes, limited deletions
- Review (Ω₅): validate against plan, read-only

Switch modes in Cursor chat:
```
/research (/r)
/innovate (/i)
/plan     (/p)
/execute  (/e)
/review   (/rev)
```

Reference: `.cursor/rules/ripersigma105.mdc` and `docs/ripersigma/mode_transition_diagram.md`

Design Systems: see `docs/design-systems/mode-checklists.md` for per-mode guidance.