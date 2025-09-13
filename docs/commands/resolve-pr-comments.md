# Resolve PR Comments (Cursor)

Workflow:
- Research: discover all comments (gh api + gh pr view)
- Plan: classify by priority and actionability; create checklist
- Execute: implement changes; tests/lint; mark done
- Review: verify all addressed; commit and summarize

Useful commands:
```bash
gh pr view --comments
gh api repos/$(gh repo view --json owner,name | jq -r '.owner.login')/$(gh repo view --json owner,name | jq -r '.name')/pulls/$(gh pr view --json number | jq -r '.number')/comments
```

Consider parallelizing independent groups by file.