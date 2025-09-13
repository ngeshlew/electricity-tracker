# Troubleshooting

## Rules not loading
- Ensure rule filenames are lowercase where required by Cursor
- Verify files exist under `.cursor/rules/`
- Restart Cursor after adding new rule files

## Codebase indexing stale
- Check Cursor Settings > Features > Codebase Indexing
- Force reindex by toggling off/on or touching files
- Use `.cursorignore` to exclude build artifacts

## Submodule not accessible
- Use SSH URLs for private repos
- `git submodule update --init --recursive`
- Check your SSH keys (`ssh -T git@github.com`)

## MCP services not available
- Install the server packages globally (see `docs/ripersigma/mcp/*`)
- Export required tokens (e.g., `GITHUB_TOKEN`, `BRAVE_SEARCH_API_KEY`)
- Verify `.cursor/mcp.json` configuration