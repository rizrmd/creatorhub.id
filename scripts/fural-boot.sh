#!/usr/bin/env bash
# Boot CreatorHub inside Fural custom sandbox CS5ed975e8597b20551e51f5d8
# (creatorhub-digitalfusion.fural.space → :3000).
# Apply with:
#   fural-agent sandboxes update CS5ed975e8597b20551e51f5d8 --boot-script-file scripts/fural-boot.sh
set -euo pipefail

export PATH="${HOME}/.local/pg-root/usr/libexec/postgresql18:${HOME}/.local/pg-root/usr/bin:${HOME}/.local/go/bin:${HOME}/.local/bin:${HOME}/go-sdk/go/bin:${PATH}"
export LD_LIBRARY_PATH="${HOME}/.local/pg-root/usr/lib:${LD_LIBRARY_PATH:-}"
export ICU_DATA="${HOME}/.local/pg-root/usr/share/icu/76.1"
export GOPATH="${GOPATH:-${HOME}/go}"
export GOCACHE="${GOCACHE:-${HOME}/.cache/go-build}"

ROOT="${CREATORHUB_ROOT:-/home/dev/www}"
PGROOT="${HOME}/.local/pg-root"
PGDATA="${HOME}/data/postgres"
PGPORT="${PGPORT:-5432}"
ALPINE_MIRROR="https://dl-cdn.alpinelinux.org/alpine/v3.23/main/x86_64"

log() { echo "[boot] $*"; }

extract_apk() {
  local url="$1"
  local dest="$2"
  local tmp
  tmp="$(mktemp)"
  curl -fsSL "$url" -o "$tmp"
  tar -C "$dest" -xzf "$tmp"
  rm -f "$tmp"
}

PG_APKS=(
  postgresql18-18.6-r0.apk
  postgresql-common-1.2-r2.apk
  icu-libs-76.1-r1.apk
  icu-data-en-76.1-r1.apk
  lz4-libs-1.10.0-r0.apk
  zstd-libs-1.5.7-r2.apk
  libxml2-2.13.9-r1.apk
  xz-libs-5.8.3-r0.apk
  libldap-2.6.13-r0.apk
  libsasl-2.1.28-r9.apk
  gdbm-1.26-r0.apk
  postgresql18-contrib-18.6-r0.apk
  libuuid-2.41.4-r0.apk
)

install_postgres() {
  mkdir -p "$PGROOT"
  local need=0
  if [ ! -x "${PGROOT}/usr/libexec/postgresql18/postgres" ]; then need=1; fi
  if [ ! -e "${PGROOT}/usr/lib/libldap.so.2" ]; then need=1; fi
  if [ ! -e "${PGROOT}/usr/lib/libsasl2.so.3" ]; then need=1; fi
  if [ ! -e "${PGROOT}/usr/lib/libgdbm.so.6" ]; then need=1; fi
  if [ ! -e "${PGROOT}/usr/lib/liblzma.so.5" ]; then need=1; fi
  if [ ! -e "${PGROOT}/usr/share/postgresql18/extension/uuid-ossp.control" ]; then need=1; fi
  if [ ! -e "${PGROOT}/usr/lib/libuuid.so.1" ]; then need=1; fi
  if [ "$need" = "0" ]; then
    log "postgres server already unpacked"
    return 0
  fi
  log "installing postgresql18 server + libs under ${PGROOT}"
  local apk
  for apk in "${PG_APKS[@]}"; do
    log "apk ${apk}"
    extract_apk "${ALPINE_MIRROR}/${apk}" "$PGROOT"
  done
  if [ ! -x "${PGROOT}/usr/libexec/postgresql18/postgres" ]; then
    log "ERROR: postgres binary missing after apk extract"
    return 1
  fi
  log "ldd postgres:"
  ldd "${PGROOT}/usr/libexec/postgresql18/postgres" || true
}

wrap_postgres() {
  local pgbin="${PGROOT}/usr/libexec/postgresql18"
  local real="${pgbin}/postgres.real"
  if [ -x "$real" ]; then
    return 0
  fi
  if [ ! -x "${pgbin}/postgres" ]; then
    log "ERROR: postgres binary missing"
    return 1
  fi
  # initdb execs ./postgres -V without guaranteeing LD_LIBRARY_PATH.
  mv "${pgbin}/postgres" "$real"
  cat > "${pgbin}/postgres" <<'WRAP'
#!/bin/sh
export LD_LIBRARY_PATH="${HOME}/.local/pg-root/usr/lib:${LD_LIBRARY_PATH:-}"
export ICU_DATA="${HOME}/.local/pg-root/usr/share/icu/76.1"
exec "$(dirname "$0")/postgres.real" "$@"
WRAP
  chmod +x "${pgbin}/postgres"
}

start_postgres() {
  mkdir -p "$(dirname "$PGDATA")" "$HOME/.local/bin"
  if [ ! -f "${PGDATA}/PG_VERSION" ]; then
    log "initdb ${PGDATA}"
    "${PGROOT}/usr/libexec/postgresql18/initdb" \
      -D "$PGDATA" \
      --username=postgres \
      --auth=trust \
      --no-instructions \
      --locale=C \
      --encoding=UTF8
    {
      echo "listen_addresses = '127.0.0.1'"
      echo "port = ${PGPORT}"
      echo "unix_socket_directories = '${PGDATA}'"
    } >> "${PGDATA}/postgresql.conf"
    cat >> "${PGDATA}/pg_hba.conf" <<'HBA'
host all all 127.0.0.1/32 trust
local all all trust
HBA
  fi

  local conf="${PGDATA}/postgresql.conf"
  local libdir="${PGROOT}/usr/lib/postgresql18"
  local sharedir="${PGROOT}/usr/share/postgresql18"
  if [ -f "$conf" ] && ! grep -q '^extension_control_path' "$conf"; then
    log "setting extension_control_path / dynamic_library_path"
    {
      echo "dynamic_library_path = '${libdir}:\$libdir'"
      echo "extension_control_path = '${sharedir}'"
    } >> "$conf"
    if "${PGROOT}/usr/libexec/postgresql18/pg_ctl" -D "$PGDATA" status >/dev/null 2>&1; then
      "${PGROOT}/usr/libexec/postgresql18/pg_ctl" -D "$PGDATA" -m fast restart || true
    fi
  fi

  if "${PGROOT}/usr/libexec/postgresql18/pg_ctl" -D "$PGDATA" status >/dev/null 2>&1; then
    log "postgres already running"
  else
    log "starting postgres on 127.0.0.1:${PGPORT}"
    "${PGROOT}/usr/libexec/postgresql18/pg_ctl" \
      -D "$PGDATA" \
      -l "${HOME}/data/postgres.log" \
      -o "-h 127.0.0.1 -p ${PGPORT} -k ${PGDATA}" \
      start
  fi

  for _ in $(seq 1 40); do
    if pg_isready -h 127.0.0.1 -p "$PGPORT" -U postgres >/dev/null 2>&1; then
      log "postgres ready"
      return 0
    fi
    sleep 0.25
  done
  log "ERROR: postgres did not become ready"
  tail -n 50 "${HOME}/data/postgres.log" || true
  return 1
}

ensure_db() {
  if ! psql -h 127.0.0.1 -p "$PGPORT" -U postgres -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='chub'" | grep -q 1; then
    log "creating database chub"
    psql -h 127.0.0.1 -p "$PGPORT" -U postgres -d postgres -c "CREATE DATABASE chub;"
  fi
}

restore_dump_if_present() {
  local dump="${HOME}/data/chub.dump"
  local marker="${HOME}/data/chub.restored"
  if [ -f "$marker" ]; then
    log "prod dump already restored"
    return 0
  fi
  if [ ! -f "$dump" ]; then
    log "no ${dump} — app migrations will create schema"
    return 0
  fi
  log "restoring ${dump} into chub"
  pg_restore --no-owner --no-acl -h 127.0.0.1 -p "$PGPORT" -U postgres -d chub "$dump" \
    || psql -h 127.0.0.1 -p "$PGPORT" -U postgres -d chub -f "$dump" \
    || true
  touch "$marker"
}

sync_repo() {
  mkdir -p "$ROOT"
  if [ -d "${ROOT}/.git" ]; then
    log "updating repo"
    git -C "$ROOT" fetch --depth 1 origin main
    git -C "$ROOT" reset --hard origin/main
    return 0
  fi
  log "cloning creatorhub.id"
  local tmp
  tmp="$(mktemp -d)"
  git clone --depth 1 https://github.com/rizrmd/creatorhub.id.git "$tmp"
  cp -a "$tmp"/. "$ROOT/"
  rm -rf "$tmp"
}

unpack_dist_tar() {
  if [ ! -f "${ROOT}/frontend/dist.tar" ]; then
    return 1
  fi
  log "extracting frontend/dist.tar"
  tar -C "${ROOT}/frontend" -xf "${ROOT}/frontend/dist.tar"
  if [ -d "${ROOT}/frontend/dist/dist" ]; then
    mv "${ROOT}/frontend/dist/dist" "${ROOT}/frontend/dist-unpacked"
    rm -rf "${ROOT}/frontend/dist"
    mv "${ROOT}/frontend/dist-unpacked" "${ROOT}/frontend/dist"
  fi
  [ -f "${ROOT}/frontend/dist/index.html" ]
}

ensure_frontend() {
  if [ -f "${ROOT}/frontend/dist/index.html" ]; then
    log "frontend dist present"
    return 0
  fi
  if unpack_dist_tar; then
    log "using frontend/dist.tar"
    return 0
  fi
  log "building frontend"
  cd "${ROOT}/frontend"
  set +e
  if [ -f package-lock.json ]; then
    npm ci || npm install
  else
    npm install
  fi
  npm run build
  local rc=$?
  set -e
  if [ "$rc" = "0" ] && [ -f "${ROOT}/frontend/dist/index.html" ]; then
    return 0
  fi
  log "ERROR: frontend dist missing"
  return 1
}

ensure_binary() {
  mkdir -p "${ROOT}/bin"
  if [ -f "${ROOT}/backend/creatorhub-linux" ]; then
    if [ ! -x "${ROOT}/bin/creatorhub" ] || [ "${ROOT}/backend/creatorhub-linux" -nt "${ROOT}/bin/creatorhub" ]; then
      log "installing committed creatorhub-linux"
      cp "${ROOT}/backend/creatorhub-linux" "${ROOT}/bin/creatorhub"
      chmod +x "${ROOT}/bin/creatorhub"
    fi
  fi
  if [ -x "${ROOT}/bin/creatorhub" ]; then
    log "using ${ROOT}/bin/creatorhub"
    return 0
  fi
  if ! command -v go >/dev/null 2>&1; then
    log "ERROR: no creatorhub binary and go is not installed"
    return 1
  fi
  log "building creatorhub"
  cd "${ROOT}/backend"
  CGO_ENABLED=0 go build -o "${ROOT}/bin/creatorhub" .
  chmod +x "${ROOT}/bin/creatorhub"
}

write_env() {
  local envfile="${ROOT}/.env"
  local secrets="${HOME}/.creatorhub.env"
  mkdir -p "$ROOT"
  if [ -f "$secrets" ] && [ ! -f "$envfile" ]; then
    log "copying ${secrets} -> ${envfile}"
    cp "$secrets" "$envfile"
  fi
  upsert_env() {
    local file="$1" key="$2" val="$3"
    if grep -q "^${key}=" "$file"; then
      sed -i "s|^${key}=.*|${key}=${val}|" "$file"
    else
      printf '%s=%s\n' "$key" "$val" >> "$file"
    fi
  }
  merge_secret() {
    local key="$1"
    local val
    [ -f "$secrets" ] || return 0
    val="$(grep "^${key}=" "$secrets" | tail -1 | cut -d= -f2-)"
    [ -n "$val" ] || return 0
    upsert_env "$envfile" "$key" "$val"
  }
  if [ -f "$envfile" ]; then
    # Always point sandbox at local postgres + local static files.
    upsert_env "$envfile" DATABASE_URL "postgres://postgres@127.0.0.1:${PGPORT}/chub?sslmode=disable"
    upsert_env "$envfile" STATIC_DIR "${ROOT}/frontend/dist"
    upsert_env "$envfile" PORT "3000"
    upsert_env "$envfile" BASIC_AUTH_USER "${BASIC_AUTH_USER:-a}"
    upsert_env "$envfile" BASIC_AUTH_PASS "${BASIC_AUTH_PASS:-a}"
    merge_secret BASIC_AUTH_USER
    merge_secret BASIC_AUTH_PASS
    log "using ${envfile}"
    return 0
  fi
  log "writing ${envfile}"
  cat > "$envfile" <<EOF
PORT=3000
DATABASE_URL=postgres://postgres@127.0.0.1:${PGPORT}/chub?sslmode=disable
STATIC_DIR=${ROOT}/frontend/dist
JWT_SECRET=${JWT_SECRET:-change-me-sandbox}
TIKHUB_API_KEY=${TIKHUB_API_KEY:-}
WORKER_SECRET=${WORKER_SECRET:-}
BASIC_AUTH_USER=${BASIC_AUTH_USER:-a}
BASIC_AUTH_PASS=${BASIC_AUTH_PASS:-a}
EOF
}

install_postgres
wrap_postgres
start_postgres
ensure_db
restore_dump_if_present
sync_repo
ensure_frontend
ensure_binary
write_env

set -a
# shellcheck disable=SC1091
. "${ROOT}/.env"
set +a

export PORT="${PORT:-3000}"
export STATIC_DIR="${STATIC_DIR:-${ROOT}/frontend/dist}"
export DATABASE_URL="${DATABASE_URL:-postgres://postgres@127.0.0.1:${PGPORT}/chub?sslmode=disable}"

cd "$ROOT"
log "starting creatorhub on 0.0.0.0:${PORT} db=${DATABASE_URL%%@*}@… static=${STATIC_DIR}"
exec "${ROOT}/bin/creatorhub"
