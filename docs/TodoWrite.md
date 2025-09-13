# TodoWrite — Public Wiki (Free) Strategy

- [x] Research constraints: GitHub Pages for private repos requires public visibility or paid plan
- [x] Scan codebase for Context7 and TodoWrite references (none found); adopt simple Markdown tracker
- [x] Examine existing pages setup (docs/ Jekyll, wiki/ content, publish-wiki.sh)
- [x] Propose three free approaches and evaluate trade-offs
- [x] Decide approach: Cloudflare Pages building MkDocs site from `wiki/`
- [x] Implement MkDocs config (`mkdocs.yml`), requirements (`requirements.txt`)
- [x] Add robust build script `scripts/build-wiki.sh` with error handling and `--strict`
- [x] Remove submodule gitlink causing CI clone failure
- [x] Fix dependency conflict (mkdocs 1.5.3 + material 9.5.18)
- [x] Remove invalid `site_url`
- [x] Update docs-scoped MkDocs config (`docs/mkdocs.yml`) for Cloudflare root=docs
- [x] Fix nav to use docs_dir-relative paths; neutralize broken links in `wiki/commands/Index.md`
- [x] Add CI check (GitHub Actions) to run `mkdocs build --strict` and markdownlint
- [ ] Configure Cloudflare Pages: Root `docs/`; Build `pip install -r requirements.txt && mkdocs build --config-file mkdocs.yml --strict`; Output `site`
- [ ] Optional: Add Netlify fallback (`netlify.toml`)

## Options considered
- Option A — Mirror wiki/docs to a separate public repo and use that repo’s GitHub Pages or Wiki
  - Pros: Stays within GitHub; public access; simple viewer experience
  - Cons: Requires an extra public repo; needs automation to mirror; permission mgmt across repos
- Option B — Cloudflare Pages builds the `wiki/` with MkDocs (chosen)
  - Pros: Free; works with private repos; fast CDN; simple setup; good theming/search
  - Cons: External provider; Python build required; needs Pages integration
- Option C — Read the Docs (MkDocs) or Netlify (static hosting) from the same repo
  - Pros: Free plans; good docs UX (RTD); easy deploy (Netlify)
  - Cons: RTD best for public repos; Netlify requires provider linkage and build setup

## Notes
- Context7 not present; applied general best practices: strict builds, explicit requirements, defensive checks, and clear error messages.
- If later you want a public GitHub-only solution, create a public docs repo and push `site/` or mirror `wiki/` to that repo.