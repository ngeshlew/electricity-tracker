#!/usr/bin/env bash
set -euo pipefail

# Publish local wiki/ to GitHub Wiki using a temporary clone of <repo>.wiki.git
# Usage: GIT_REMOTE=origin ./scripts/publish-wiki.sh

REMOTE_NAME="${GIT_REMOTE:-origin}"
ORIGIN_URL="$(git remote get-url "$REMOTE_NAME")"

# Derive <owner>/<repo> from typical git remotes (https or ssh), even if tokens are embedded
OWNER_REPO="$(echo "$ORIGIN_URL" | sed -E 's#.*github.com[:/ ]([^/]+/[^/.]+)(\.git)?$#\1#')"
if [ -z "$OWNER_REPO" ] || [[ "$OWNER_REPO" == *:* ]]; then
  echo "Could not parse owner/repo from remote URL: $ORIGIN_URL" >&2
  exit 1
fi

# Preserve the authenticated transport/base from origin (supports https with token or ssh)
ORIGIN_BASE=""
if echo "$ORIGIN_URL" | grep -Eq '^https?://'; then
	ORIGIN_BASE="$(echo "$ORIGIN_URL" | sed -E 's#^(https?://[^/]+/).*$#\1#')"
elif echo "$ORIGIN_URL" | grep -Eq '^git@'; then
	ORIGIN_BASE="$(echo "$ORIGIN_URL" | sed -E 's#^(git@[^:]+:).*$#\1#')"
fi

if [ -z "$ORIGIN_BASE" ]; then
	# Fallback to public https base (may fail for private repos if not authenticated)
	ORIGIN_BASE="https://github.com/"
fi

WIKI_URL="${ORIGIN_BASE}${OWNER_REPO}.wiki.git"
TMP_DIR="$(mktemp -d)"

echo "Cloning wiki repo: $WIKI_URL"
if ! git clone "$WIKI_URL" "$TMP_DIR"; then
	echo "Failed to clone wiki repo at $WIKI_URL. Ensure the repo wiki is enabled and credentials are valid." >&2
	exit 1
fi

# Sync files from wiki/ into the wiki repo
if command -v rsync >/dev/null 2>&1; then
	rsync -a --delete wiki/ "$TMP_DIR"/
else
	# Fallback without rsync: delete everything except .git then copy
	shopt -s dotglob
	rm -rf "$TMP_DIR"/*
	shopt -u dotglob
	cp -a wiki/. "$TMP_DIR"/
fi

cd "$TMP_DIR"
if [ -n "$(git status --porcelain)" ]; then
	git add -A
	git commit -m "docs(wiki): update wiki from starter"
	git push
	echo "Wiki published."
else
	echo "No changes to publish."
fi