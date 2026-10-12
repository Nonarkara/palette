#!/usr/bin/env bash
# Local-only preview, no install or account. One server, no new browser tabs.
set -euo pipefail
cd "$(dirname "$0")"
if command -v python3 >/dev/null 2>&1; then
  echo "Palette: http://127.0.0.1:4173 — Ctrl-C to stop."
  exec python3 -m http.server 4173 --bind 127.0.0.1
elif command -v node >/dev/null 2>&1; then
  exec node scripts/serve.mjs
else
  echo "Palette needs Python 3 or Node.js to serve its local JSON data." >&2
  echo "Install either runtime, then run bash start.sh again. No npm install is needed." >&2
  exit 1
fi
