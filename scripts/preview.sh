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
hint_re = re.compile(r'{%\s*hint\s+style="(\w+)"\s*%}')
code_re = re.compile(r'{%\s*code\s+title="([^"]*)"[^%]*%}')
strip_re = re.compile(
    r'{%\s*(tabs|endtabs|endtab|endhint|stepper|endstepper|step|endstep|endcode|code)\s*%}\n?'
)
HINT_ICON = {"info": "ℹ️", "success": "✅", "warning": "⚠️", "danger": "🚨"}

for path in glob.glob(f"{root}/**/*.md", recursive=True):
    with open(path) as f:
        text = f.read()
    new = tab_re.sub(r'**📑 \1**\n', text)
    new = hint_re.sub(lambda m: f'**{HINT_ICON.get(m.group(1), "ℹ️")}**', new)
    new = code_re.sub(r'**`\1`**\n', new)
    new = strip_re.sub('', new)
    if new != text:
        with open(path, "w") as f:
            f.write(new)
        print(f"rewrote gitbook blocks: {path}")
EOF

echo
echo "Serving docs preview at http://localhost:${PORT}"
echo "(Note: on gitbook.com the 📑 sections render as real tab widgets.)"
cd "$DST"
exec npx -y honkit serve --port "$PORT"
