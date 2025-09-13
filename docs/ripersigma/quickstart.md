# RIPER Sigma Quickstart

## 📋 Prerequisites

1. **Cursor IDE** installed and configured
2. **Node.js** v18+ (for MCP `npx` servers)
3. **Project folder** initialized

## 🎯 Quick Setup (5 minutes)

### Step 1: Install Framework
```bash
# If using the cursorstarter template, open the repo in Cursor then run:
bash scripts/init.sh

# Otherwise copy `.cursor/`, `memory-bank/`, and `scripts/` into your project root, then run:
bash scripts/init.sh
```

### Step 2: Enable Core Framework
1. Open Cursor IDE
2. Go to Settings → Cursor Rules and enable:
   - `.cursor/rules/ripersigma105.mdc`
   - `.cursor/rules/cursorstarter-core.mdc`
   - `.cursor/rules/commit-mode.mdc`
   - `.cursor/rules/code-protection.mdc`
   - `.cursor/rules/permissions.mdc`
   - `.cursor/rules/context.mdc`
3. Optional overlays:
   - `.cursor/rules/webdev-best-practices.mdc`
   - `.cursor/rules/analytics-clarity.mdc`
4. In Cursor: Settings → Features → enable Codebase Indexing

### Step 3: Initialize Memory Bank
```
/start
```
Or via CLI:
```bash
bash scripts/init.sh
```
This creates:
- `/memory-bank/` folder (and `/memory-bank/backups/`)
- Six memory files: `projectbrief.md`, `systemPatterns.md`, `techContext.md`, `activeContext.md`, `progress.md`, `protection.md`

## 🔥 Basic Usage

### Mode Switching
- `/r` or `/research` - Research mode 🔍
- `/i` or `/innovate` - Innovate mode 💡
- `/p` or `/plan` - Plan mode 📝
- `/e` or `/execute` - Execute mode ⚙️
- `/rev` or `/review` - Review mode 🔎

### Code Protection
```javascript
// !cp PROTECTED - Never modify
function criticalFunction() {
  // Core business logic
}
// !cp END-P

// !cg GUARDED - Ask before changing
function importantFunction() {
  // Important logic
}
// !cg END-G
```

### Context Management
```
!af src/main.js        # Add file to context
!ac validateUser()     # Add code reference
!cm                    # Set mode-appropriate context
!cc                    # Clear all context
```

## 🔌 Optional: MCP Services

### Enable Services (Choose what you need)

1. **GitHub Integration**
   ```bash
   npm install -g @modelcontextprotocol/server-github
   export GITHUB_TOKEN=your_token
   ```
   - Already listed in `.cursor/mcp.json` (service: `github`)
   - Use: `!gr pytorch` to search repos

2. **Web Search**
   ```bash
   npm install -g @modelcontextprotocol/server-brave-search
   export BRAVE_SEARCH_API_KEY=your_key
   ```
   - Already listed in `.cursor/mcp.json` (service: `brave-search`)
   - Use: `!ws AI frameworks` to search

3. **Browser Automation**
   ```bash
   npm install -g @modelcontextprotocol/server-puppeteer
   ```
   - Already listed in `.cursor/mcp.json` (service: `puppeteer`)
   - Use: `!pn https://example.com` to navigate; `!ps name` for a screenshot

4. **Docker**
   ```bash
   npm install -g docker-mcp
   # Ensure Docker Desktop/daemon is running
   ```
   - Already listed in `.cursor/mcp.json` (service: `docker`)
   - See: `docs/ripersigma/mcp/docker_setup.md` for available operations and examples

## 🏢 Optional: BMAD Enterprise

### Soft Migration (Recommended for start)
1. Keep using memory banks
2. Enable BMAD rule files in `.cursor/rules/`:
   - `bmad-roles.mdc` — Role system
   - `prd-system.mdc` — PRD management
   - `quality-gates.mdc` — Quality gates
   - `enterprise.mdc` — Enterprise workflows

### Commands
```
!br Developer      # Switch to Developer role
!prdn             # Create new PRD
!kg               # Check current quality gate
```

## 📚 Cheat Sheets

### Essential Commands
| Action | Command | Mode Required |
|--------|---------|---------------|
| Read files | automatic | Any |
| Write code | automatic | EXECUTE |
| Create plan | automatic | PLAN |
| Search web | !ws query | NOT EXECUTE |
| Take screenshot | !ps name | Any |

### Mode Permissions
| Mode | Can Do | Cannot Do |
|------|--------|-----------|
| RESEARCH 🔍 | Read, analyze | Write, modify |
| INNOVATE 💡 | Read, suggest | Implement |
| PLAN 📝 | Read, design | Execute |
| EXECUTE ⚙️ | All operations | Deviate from plan |
| REVIEW 🔎 | Read, verify | Modify |

## 🚨 Common Issues

### "Operation not permitted"
- Check current mode with `[MODE: X]` 
- Switch to the appropriate mode
- EXECUTE mode has most permissions

### "MCP service not available"
- Service not installed
- Environment variable not set
- Check `docs/ripersigma/mcp/` for setup guides

### "No search in EXECUTE mode"
- This is intentional! 
- Maintains focus during implementation
- Switch to RESEARCH/PLAN to search

## 💡 Pro Tips

1. **Start Simple**: Use the core framework first, add MCP/BMAD later
2. **Mode Discipline**: Let modes guide your workflow
3. **Protection Markers**: Use them for critical code
4. **Context Awareness**: Keep context focused and relevant
5. **Gradual Adoption**: Enable features as needed
6. **Analytics**: See `docs/analytics/Clarity.md` for Microsoft Clarity setup and a mode-aware checklist
7. **Web.dev overlays**: See `docs/webdev-integration.md` for PWA, Streams, Passkeys, and Web Vitals guidance across modes

## 🎓 Next Steps

1. Read complete documentation in `/docs/`
2. Review the symbol reference guide
3. Try a simple project with RIPER modes
4. Enable MCP services one at a time
5. Consider BMAD for team projects

---
*Framework Version: 1.0.5 | Quick Start v1.1*

## Design Systems Integration
- Read `docs/design-systems/meta-guidelines.md`
- Make a selection with `docs/design-systems/decision-tree.md`
- Follow `docs/design-systems/mode-checklists.md` during each mode
- Record outcomes in `memory-bank/` files as indicated
