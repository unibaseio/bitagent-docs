#!/usr/bin/env bash
# Local GitBook preview via HonKit.
#
# GitBook.com renders {% tabs %} blocks as real tab widgets, but HonKit's
# template engine doesn't know those tags. This script copies the docs to a
# temp directory, rewrites tab blocks into plain markdown sections (each tab
# becomes a bold "📑 <title>" label), and serves the copy with HonKit.
#
# Usage: ./scripts/preview.sh [port]   (default port: 4001)
set -euo pipefail

PORT="${1:-4001}"
SRC="$(cd "$(dirname "$0")/.." && pwd)"
DST="${TMPDIR:-/tmp}/bitagent-docs-preview"

rm -rf "$DST"
mkdir -p "$DST"
rsync -a \
  --exclude 'node_modules' --exclude '_book' --exclude '.git' \
  --exclude '.claude' --exclude 'internal' --exclude 'scripts' \
  "$SRC"/ "$DST"/

python3 - "$DST" <<'EOF'
import glob, re, sys

root = sys.argv[1]
tab_re = re.compile(r'{%\s*tab\s+title="([^"]*)"\s*%}')
strip_re = re.compile(r'{%\s*(tabs|endtabs|endtab)\s*%}\n?')

for path in glob.glob(f"{root}/**/*.md", recursive=True):
    with open(path) as f:
        text = f.read()
    new = tab_re.sub(r'**📑 \1**\n', text)
    new = strip_re.sub('', new)
    if new != text:
        with open(path, "w") as f:
            f.write(new)
        print(f"rewrote tabs: {path}")
EOF

echo
echo "Serving docs preview at http://localhost:${PORT}"
echo "(Note: on gitbook.com the 📑 sections render as real tab widgets.)"
cd "$DST"
exec npx -y honkit serve --port "$PORT"
