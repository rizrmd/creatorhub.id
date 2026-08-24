#!/bin/bash
# =============================================================
# CreatorHub — atomic frontend deploy + FULL verification
# Prevents: missing CSS, stale Cloudflare cache, unverified deploys
#
# LOCAL (PowerShell, from repo root):
#   $js=(Get-ChildItem frontend/dist/assets/index-*.js).Name
#   $css=(Get-ChildItem frontend/dist/assets/index-*.css).Name
#   ssh riz@107.155.75.50 "mkdir -p /tmp/ch-deploy"
#   scp frontend/dist/index.html riz@107.155.75.50:/tmp/ch-deploy/index.html
#   scp "frontend/dist/assets/$js" "riz@107.155.75.50:/tmp/ch-deploy/$js"
#   scp "frontend/dist/assets/$css" "riz@107.155.75.50:/tmp/ch-deploy/$css"
#   scp scripts/deploy-frontend.sh riz@107.155.75.50:/tmp/deploy-frontend.sh
#   ssh riz@107.155.75.50 "bash /tmp/deploy-frontend.sh"
#
# Optional marker check: ssh ... "MARKER='unique-string' bash /tmp/deploy-frontend.sh"
# =============================================================
set -u
SRC=/tmp/ch-deploy
FAIL=0

step() { echo ""; echo "=== $1 ==="; }
ok()   { echo "  [OK] $1"; }
bad()  { echo "  [FAIL] $1"; FAIL=1; }

step "0. Staged files in $SRC"
[ -f "$SRC/index.html" ] || bad "index.html missing in $SRC"
JS_COUNT=$(ls "$SRC"/index-*.js 2>/dev/null | wc -l)
CSS_COUNT=$(ls "$SRC"/index-*.css 2>/dev/null | wc -l)
[ "$JS_COUNT" = "1" ] || bad "expected exactly 1 index-*.js, found $JS_COUNT"
[ "$CSS_COUNT" = "1" ] || bad "expected exactly 1 index-*.css, found $CSS_COUNT"
if [ "$FAIL" != "0" ]; then echo "Staging incomplete/ambiguous — NOTHING deployed. Clean /tmp/ch-deploy and re-upload. Abort."; exit 1; fi
JS=$(ls "$SRC"/index-*.js | head -1)
CSS=$(ls "$SRC"/index-*.css | head -1)
JS_NAME=$(basename "$JS"); CSS_NAME=$(basename "$CSS")
ok "index.html + $JS_NAME + $CSS_NAME"

step "1. Find app container"
CONTAINER=$(docker ps --filter name=emzin0v --format '{{.Names}}' | head -1)
[ -n "$CONTAINER" ] || { bad "container not found"; exit 1; }
ok "$CONTAINER"

step "2. Clear old assets"
docker exec "$CONTAINER" sh -c 'rm -f /app/static/index.html /app/static/assets/index-*'
ok "removed old index.html + assets/index-*"

step "3. Copy new files"
docker cp "$SRC/index.html" "$CONTAINER:/app/static/index.html" || bad "cp index.html"
docker cp "$JS"  "$CONTAINER:/app/static/assets/$JS_NAME"  || bad "cp $JS_NAME"
docker cp "$CSS" "$CONTAINER:/app/static/assets/$CSS_NAME" || bad "cp $CSS_NAME"

step "4. Verify byte sizes (staged vs container)"
check_size() {
  local srcf="$1" dstf="$2" name="$3"
  local s1 s2
  s1=$(stat -c%s "$srcf")
  s2=$(docker exec "$CONTAINER" stat -c%s "$dstf" 2>/dev/null || echo -1)
  if [ "$s1" = "$s2" ]; then ok "$name ($s1 bytes)"; else bad "$name size mismatch staged=$s1 container=$s2"; fi
}
check_size "$SRC/index.html" "/app/static/index.html" "index.html"
check_size "$JS"  "/app/static/assets/$JS_NAME"  "$JS_NAME"
check_size "$CSS" "/app/static/assets/$CSS_NAME" "$CSS_NAME"

step "5. Verify container index.html references exactly the new files"
REF=$(docker exec "$CONTAINER" grep -oE 'index-[A-Za-z0-9_-]+\.(js|css)' /app/static/index.html | sort -u)
echo "$REF" | sed 's/^/  ref: /'
echo "$REF" | grep -q "$JS_NAME"  || bad "index.html does not reference $JS_NAME"
echo "$REF" | grep -q "$CSS_NAME" || bad "index.html does not reference $CSS_NAME"
for r in $REF; do
  docker exec "$CONTAINER" test -f "/app/static/assets/$r" || bad "referenced $r missing in assets/"
done

step "6. Verify no stale index-* assets remain"
STALE=$(docker exec "$CONTAINER" ls /app/static/assets | grep -E '^index-.*\.(js|css)$' | grep -v -e "$JS_NAME" -e "$CSS_NAME" || true)
if [ -n "$STALE" ]; then bad "stale: $STALE"; else ok "none"; fi

step "7. Purge Cloudflare cache"
ENVF="$HOME/.creatorhub-deploy.env"
[ -f "$ENVF" ] && . "$ENVF"
if [ -n "${CF_TOKEN:-}" ] && [ -n "${CF_ZONE:-}" ]; then
  RES=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$CF_ZONE/purge_cache" \
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" \
    -d '{"purge_everything": true}')
  echo "$RES" | grep -q '"success":true' && ok "purge_everything success" || bad "purge: $RES"
else
  bad "CF_TOKEN/CF_ZONE missing in $ENVF — cache NOT purged"
fi

sleep 2
step "8. Verify LIVE site serves the new build"
LIVE_JS=$(curl -s https://creatorhub.id/ | grep -oE 'index-[A-Za-z0-9_-]+\.js' | head -1)
LIVE_CSS=$(curl -s https://creatorhub.id/ | grep -oE 'index-[A-Za-z0-9_-]+\.css' | head -1)
[ "$LIVE_JS" = "$JS_NAME" ] && ok "live HTML js -> $LIVE_JS" || bad "live HTML js -> $LIVE_JS (expected $JS_NAME)"
[ "$LIVE_CSS" = "$CSS_NAME" ] && ok "live HTML css -> $LIVE_CSS" || bad "live HTML css -> $LIVE_CSS (expected $CSS_NAME)"
CODE=$(curl -s -o /dev/null -w '%{http_code}' "https://creatorhub.id/assets/$JS_NAME")
[ "$CODE" = "200" ] && ok "live JS 200" || bad "live JS HTTP $CODE"
CODE=$(curl -s -o /dev/null -w '%{http_code}' "https://creatorhub.id/assets/$CSS_NAME")
[ "$CODE" = "200" ] && ok "live CSS 200" || bad "live CSS HTTP $CODE"

if [ -n "${MARKER:-}" ]; then
  step "9. Marker check in live JS"
  if curl -s "https://creatorhub.id/assets/$JS_NAME" | grep -qF "$MARKER"; then ok "found: $MARKER"; else bad "MARKER not found: $MARKER"; fi
fi

echo ""
if [ "$FAIL" = "0" ]; then
  echo "ALL CHECKS PASSED — deploy verified end-to-end"
else
  echo "DEPLOY HAS FAILURES — DO NOT CLAIM IT WORKS"
  exit 1
fi
