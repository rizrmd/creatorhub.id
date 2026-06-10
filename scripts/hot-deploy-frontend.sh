#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/frontend"

echo "→ Building frontend..."
npm run build

CONTAINER="$(docker ps --filter 'name=emzin0v' --format '{{.Names}}' | head -1)"
if [[ -z "$CONTAINER" ]]; then
  echo "✗ No running creatorhub container found (filter: emzin0v)" >&2
  exit 1
fi

echo "→ Copying dist/ → $CONTAINER:/app/static/"
docker cp dist/. "$CONTAINER:/app/static/"

echo "✓ Frontend hot-deployed in $(pwd)/dist → $CONTAINER"