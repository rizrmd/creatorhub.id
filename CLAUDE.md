# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

When the user says `npm run dev` (without specifying a directory), run it from `docs/CreatorHub Dashboard/` — that is the old Vite + vanilla JS prototype.

```bash
cd "docs/CreatorHub Dashboard"
npm install
npm run dev       # Vite dev server for the old prototype
```

> **Windows note**: `npm` is not a direct Win32 executable, so `Start-Process -FilePath "npm"` will fail. Use `cmd.exe` to launch it in background:
> ```powershell
> Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd /d D:\creatorhub.id\docs\CreatorHub Dashboard && npm run dev" -WindowStyle Normal
> ```
> Or simply run `npm run dev` in a dedicated terminal. The Vite dev server runs on `http://localhost:5173/`.

For the **active React frontend**, commands must be run from `frontend/`:

```bash
cd frontend
npm install       # install dependencies
npm run build     # type-check (tsc) + production build → frontend/dist/
```

There are no tests, no linter config, and no preview server script.

## Workflow

**IMPORTANT: Never run dev server or restart backend locally. Always deploy directly to production.**

After every frontend code change:

1. Build frontend
2. Commit & push to `main`
3. Deploy to production using fast frontend-only copy:

```powershell
cd frontend; npm run build
$container = (docker ps --filter "name=emzin0v" --format "{{.Names}}" | Select-Object -First 1)
docker cp dist/. "$container:/app/static/"
```

This copies the new `dist/` into the live container in ~5-10 seconds. No image rebuild needed.

**Do NOT:**
- Run `npm run dev` for development
- Restart local backend (`creatorhub.exe`)
- Build locally just to test (use production URL directly: https://creatorhub.id)

## Architecture

This is a **React 19 SPA** built with TypeScript and Vite. It calls a backend API at `/api/v1` (configurable via `VITE_API_URL` env var).

### File structure

```
frontend/
├── src/
│   ├── App.tsx                   # root router — all 8 routes defined here
│   ├── main.tsx                  # React entry point
│   ├── index.css                 # Tailwind v4 + CSS variables (design tokens)
│   ├── types/index.ts            # all shared TypeScript types
│   ├── lib/
│   │   ├── api.ts                # axios client + typed API functions
│   │   └── utils.ts              # cn() helper (clsx + tailwind-merge)
│   ├── hooks/
│   │   ├── useCreators.ts        # TanStack Query hooks for creator endpoints
│   │   ├── useCampaigns.ts       # TanStack Query hooks for campaign endpoints
│   │   └── useMessages.ts        # TanStack Query hooks for message endpoints
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components (button, select, dialog, …)
│   │   └── layout/               # Sidebar, Header, Layout (Outlet wrapper)
│   └── pages/                    # one file per route
│       ├── Dashboard.tsx
│       ├── Marketplace.tsx
│       ├── Campaigns.tsx
│       ├── Analytics.tsx
│       ├── MediaMonitoring.tsx
│       ├── Messages.tsx
│       ├── Payments.tsx
│       └── Settings.tsx
├── vite.config.ts                # Vite + React + Tailwind v4 plugins, @/ alias
├── tsconfig.app.json             # strict TS, noUnusedLocals/Parameters enforced
├── components.json               # shadcn/ui config (new-york style, slate base)
└── package.json
```

`docs/reference/` — old vanilla JS prototype, no longer the active codebase.  
`docs/pages/` — per-page UI spec markdown (read-only reference).  
`docs/CreatorHub Dashboard/` — old Vite + vanilla JS prototype (referensi lama). Run with:

```bash
cd "docs/CreatorHub Dashboard"
npm install
npm run dev
```

### Routing

React Router v7 (`BrowserRouter`). Routes are declared in `App.tsx`:

```
/                 → redirect to /marketplace
/dashboard        → Dashboard
/marketplace      → Marketplace   (default landing)
/campaigns        → Campaigns
/analytics        → Analytics
/media-monitoring → MediaMonitoring
/messages         → Messages
/payments         → Payments
/settings         → Settings
```

`Layout.tsx` wraps all routes with the shared Sidebar + Header + `<Outlet />`. The right Campaign Brief panel is rendered inside individual page components, not in the layout.

### Data model

All data is fetched from the backend API (`/api/v1`). No in-memory seed data or localStorage.

- **`creatorsApi`** — `list(params)`, `getById(id)` → `GET /creators`, `GET /creators/:id`
- **`campaignsApi`** — CRUD + add/remove creator → `GET|POST /campaigns`, `PUT|DELETE /campaigns/:id`, etc.
- **`messagesApi`** — channels + messages → `GET /messages/channels`, `POST /messages/channels/:id/messages`, etc.

TanStack Query v5 is used for all data fetching and caching (see `src/hooks/`).

### Key types (`src/types/index.ts`)

- `Creator` — id, name, city, category, platforms, followers, engagementRate, price, verified, rating, etc.
- `CreatorListParams` — filter/sort/pagination params sent to `GET /creators`
- `CreatorListResponse` — `{ data, total, page, pageSize, totalPages }`
- `Campaign` — id, title, status (`draft|active|completed|paused`), budget, creators[]
- `ChatChannel` / `Message` — messaging primitives

### Design system

**Tailwind v4** + **shadcn/ui** (new-york style, slate base color). Components live in `src/components/ui/` and are sourced from shadcn. Design tokens are CSS custom properties in `src/index.css`.

- Add a new shadcn component: `npx shadcn@latest add <component>` from the `frontend/` directory.
- `cn()` utility in `src/lib/utils.ts` merges class names (`clsx` + `tailwind-merge`).
- Icons: **lucide-react** (imported individually, e.g. `import { Search } from "lucide-react"`).

### Radix UI Select rule

`<SelectItem>` must never have `value=""`. Use a sentinel string (e.g. `"all"`) for the "show all" option, and convert it to `undefined` in `onValueChange`:

```tsx
// correct
<SelectItem value="all">Semua Kategori</SelectItem>
onValueChange={(v) => setFilter(v === "all" ? undefined : v)}
```

### TypeScript strictness

`tsconfig.app.json` enables `noUnusedLocals` and `noUnusedParameters`. Remove unused imports/variables or the build (`npm run build`) will fail.

## Backend

Go 1.22+ server (`backend/`). Serves the API at `/api/v1/*` and the built frontend SPA at `/*`.

```bash
cd backend

# Build executable
go build -o creatorhub.exe .

# Run (reads .env, runs migrations automatically, serves on :8080)
./creatorhub.exe
```

Environment variables (copy `.env.example` → `.env`):

| Variable | Default | Description |
|---|---|---|
| `PORT` | `8080` | HTTP listen port |
| `DATABASE_URL` | `postgres://postgres:postgres@localhost:5432/creatorhub?sslmode=disable` | PostgreSQL DSN |
| `STATIC_DIR` | `../frontend/dist` | Path to Vite build output |
| `JWT_SECRET` | `creatorhub-secret-change-in-production` | JWT signing secret (required in production) |

### Database migrations

Migrations are managed with **goose v3**. SQL files live in `backend/migrations/` and are **embedded into the binary** at build time — no external files needed at runtime.

**Migrations run automatically on every server start** (`goose.Up` is idempotent — already-applied migrations are skipped). Applied versions are tracked in the `goose_db_version` table.

#### Format

Each file must begin with a goose marker and include a `Down` section:

```sql
-- +goose Up
CREATE TABLE ...

-- +goose Down
DROP TABLE ...
```

#### Naming

Files must be numbered sequentially: `001_<name>.sql`, `002_<name>.sql`, etc. Never rename or renumber existing files — goose identifies migrations by version number.

#### Standalone migrate CLI

```bash
cd backend

go run ./cmd/migrate            # same as: up
go run ./cmd/migrate up         # apply all pending migrations
go run ./cmd/migrate down       # roll back one migration
go run ./cmd/migrate status     # show applied / pending migrations
go run ./cmd/migrate reset      # roll back all migrations
go run ./cmd/migrate version    # print current version
```

#### Adding a new migration

1. Create `backend/migrations/003_<description>.sql` (next sequential number).
2. Write `-- +goose Up` / `-- +goose Down` sections.
3. Rebuild the binary (`go build -o creatorhub.exe .`) — the file is embedded at build time.
4. Run `./creatorhub.exe` or `go run ./cmd/migrate up` — the new migration applies automatically.

> Never modify or delete an already-applied migration file. Modify schema by adding a new migration instead.

## Deployment

Production runs on **Coolify** at `107.155.75.50`. A single Docker container builds the React frontend and Go backend, runs DB migrations on startup, and serves the SPA + API. use ssh riz@107.155.75.50

| Item | Value |
|---|---|
| **Production URL** | https://creatorhub.id |
| **Coolify UI** | https://107.155.75.50/project/sws0ckk/environment/wgcsog0wcog040cgssoow00c/application/emzin0vth67dgrpfoulsz996 |
| **App UUID** | `emzin0vth67dgrpfoulsz996` |
| **App DB ID** | `154` |
| **Git repo** | `rizrmd/creatorhub.id` → branch `main` |
| **Build pack** | Dockerfile at repo root (`/Dockerfile`) |
| **Exposed port** | `3000` |

### Dockerfile

Multi-stage build at repo root:

1. **frontend-builder** — `npm ci` + `npm run build` → `frontend/dist`
2. **backend-builder** — `go build` → `/creatorhub` binary (migrations embedded)
3. **runner** — Alpine image with binary + static files at `/app/static`

Test the image locally before pushing:

```bash
docker build -t creatorhub-test .
```

### Production environment variables

Set in Coolify (runtime only — no build-time vars needed; frontend is built inside the Dockerfile).

| Variable | Production value | Notes |
|---|---|---|
| `DATABASE_URL` | `postgres://postgres:<password>@107.155.75.50:5389/chub?sslmode=disable` | External PostgreSQL |
| `JWT_SECRET` | random secret (`openssl rand -base64 32`) | Never use the dev default |
| `PORT` | `3000` | Must match Coolify `ports_exposes` |
| `STATIC_DIR` | `/app/static` | Path inside the container |

`VITE_API_URL` is **not** needed — the SPA defaults to `/api/v1` (same origin).

> **Important:** Never insert env vars directly into the Coolify database with plain SQL. Coolify encrypts values via Laravel — raw inserts cause `DecryptException` and deployment failure. Always use the Coolify UI or the artisan snippet below.

#### Add / update env vars via artisan

```bash
docker exec coolify php artisan tinker --execute='
$app = \App\Models\Application::where("uuid", "emzin0vth67dgrpfoulsz996")->first();
$app->environment_variables()->updateOrCreate(
  ["key" => "DATABASE_URL"],
  ["value" => "postgres://postgres:<password>@107.155.75.50:5389/chub?sslmode=disable", "is_runtime" => true, "is_buildtime" => false, "is_preview" => false, "is_required" => true]
);
echo "done";
'
```

Audit current values (passwords masked):

```bash
docker exec coolify php artisan tinker --execute='
$app = \App\Models\Application::where("uuid", "emzin0vth67dgrpfoulsz996")->first();
foreach ($app->environment_variables()->where("is_preview", false)->orderBy("key")->get() as $e) {
  echo $e->key . " = " . ($e->key === "JWT_SECRET" ? "<secret>" : $e->value) . PHP_EOL;
}
'
```

### Deploy (after pushing to `main`)

```bash
# 1. Commit and push
git add .
git commit -m "your changes"
git push origin main

# 2. Trigger deploy from repo root (must use FULL commit SHA)
FULL_SHA=$(git rev-parse HEAD)

docker exec -i coolify-db psql -U coolify -d coolify -c \
  "UPDATE applications SET git_commit_sha = '${FULL_SHA}' WHERE uuid = 'emzin0vth67dgrpfoulsz996';"

# force_rebuild=false → Docker layer cache ON (~20–35s)
# force_rebuild=true  → --no-cache full rebuild (~60–90s); only when Dockerfile/deps change
QUEUE_ID=$(docker exec -i coolify-db psql -U coolify -d coolify -t -c \
  "INSERT INTO application_deployment_queues
   (application_id, deployment_uuid, commit, status, force_rebuild, is_webhook, created_at, updated_at, application_name, server_id)
   SELECT '154', gen_random_uuid()::text, '${FULL_SHA}', 'queued', false, true, NOW(), NOW(), 'creatorhub.id', 0
   RETURNING id;" | grep -oE '[0-9]+' | head -1)

docker exec coolify php artisan tinker --execute="\App\Jobs\ApplicationDeploymentJob::dispatch(${QUEUE_ID});"
```

> Always use the **full 40-character SHA** from `git rev-parse HEAD`. Short SHAs cause `fatal: couldn't find remote ref` during clone.

#### Fast frontend-only deploy (~5–10s, skip Docker rebuild)

When only `frontend/src/` changed and the container is already running:

```bash
cd frontend && npm run build
CONTAINER=$(docker ps --filter "name=emzin0v" --format "{{.Names}}" | head -1)
docker cp dist/. "$CONTAINER:/app/static/"
```

This copies the new `dist/` into the live container — no image rebuild, no healthcheck wait.

#### Deploy timing (measured on this server)

| Mode | `force_rebuild` | Typical duration | Notes |
|---|---|---|---|
| Cached build | `false` | ~20–35s | Only changed Docker layers rebuild; same SHA skips build entirely |
| Full rebuild | `true` | ~60–90s | `--no-cache` — reinstalls npm + recompiles Go every time |
| Restart only | — | ~25s | `restart_only=true`; no code update |
| Hot copy (above) | — | ~5–10s | Frontend-only; bypasses Coolify build |

### Database migrations (production)

Migrations run **automatically on every container start** (`goose.Up` in `main.go`). SQL files are embedded in the Go binary at build time — no manual step needed after deploy.

Production database: `chub` on `107.155.75.50:5389` (via `DATABASE_URL`).

Expected state after a fresh deploy:

| Migration | Purpose |
|---|---|
| `001_initial.sql` | Core tables (creators, campaigns, messages, cities) |
| `002_seed.sql` | Seed creators, cities, campaigns |
| `003_update_image_urls.sql` | Fix creator image paths |
| `004_users.sql` | Users table + auth |
| `005_creator_fields.sql` | Extra creator columns (handle, hue, star_creator, …) |
| `006_campaign_fields.sql` | Extra campaign columns (brand, objective, budget_spent, …) |

#### Verify migrations

```bash
# 1. Check goose status against production DB
cd backend
DATABASE_URL='postgres://postgres:<password>@107.155.75.50:5389/chub?sslmode=disable' \
  go run ./cmd/migrate status
# All 6 migrations should show an "Applied At" timestamp — no "Pending"

# 2. Confirm version table
psql "$DATABASE_URL" -c "SELECT version_id, is_applied FROM goose_db_version ORDER BY version_id;"
# Expect versions 0–6, all is_applied = true

# 3. Confirm tables and seed data
psql "$DATABASE_URL" -c "\dt"
# Expect: campaigns, campaign_creators, chat_channels, cities, creator_platforms,
#         creators, goose_db_version, messages, users

psql "$DATABASE_URL" -c "
  SELECT 'creators' AS tbl, COUNT(*) FROM creators
  UNION ALL SELECT 'cities', COUNT(*) FROM cities
  UNION ALL SELECT 'campaigns', COUNT(*) FROM campaigns
  UNION ALL SELECT 'users', COUNT(*) FROM users;"
# Expect: creators=8, cities=11, campaigns=2, users=1

# 4. Check container startup logs
docker logs $(docker ps --filter "name=emzin0v" --format "{{.Names}}") 2>&1 | grep goose
# Expect: "goose: successfully migrated database to version: 6"
```

#### Manual migration (if needed)

```bash
cd backend
DATABASE_URL='postgres://postgres:<password>@107.155.75.50:5389/chub?sslmode=disable' \
  go run ./cmd/migrate up
```

Or redeploy — the container re-runs `goose.Up` on every start (idempotent; already-applied migrations are skipped).

### Verify deployment

```bash
# Deployment status
docker exec -i coolify-db psql -U coolify -d coolify -c \
  "SELECT deployment_uuid, status, commit, created_at FROM application_deployment_queues
   WHERE application_id = '154' ORDER BY created_at DESC LIMIT 3;"

# Container health
docker ps --filter "name=emzin0v" --format 'table {{.Names}}\t{{.Status}}'

# HTTP checks
curl -fsS https://creatorhub.id/health          # {"status":"ok"}
curl -fsS -X POST https://creatorhub.id/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@creatorhub.id","password":"Admin123!"}'

# App logs (container name changes each deploy — use filter)
docker logs $(docker ps --filter "name=emzin0v" --format "{{.Names}}") --tail 50
```

Default admin account (created on first boot if no users exist): `admin@creatorhub.id` / `Admin123!`

### Frontend Deploy Verification (MANDATORY)

**NEVER claim "deployed" without running ALL verification steps.**

After every frontend deploy:

```bash
# 1. CLEAR old assets first
CONTAINER=$(docker ps --filter "name=emzin0v" --format "{{.Names}}" | head -1)
docker exec "$CONTAINER" sh -c 'rm -rf /app/static/assets/*'

# 2. Copy new dist
docker cp frontend/dist/. "$CONTAINER:/app/static/"

# 3. VERIFY — check file exists and size matches local build
docker exec "$CONTAINER" ls -la /app/static/assets/
# Compare JS file size with: ls -la frontend/dist/assets/*.js

# 4. VERIFY — index.html references the new JS
docker exec "$CONTAINER" cat /app/static/index.html
```

**If any step fails, DO NOT say "deployed". Fix it first.**

### Code Tracing Rules (MANDATORY)

Before claiming a fix works:

1. **Search for ALL places a value is set** — use grep for `setFilters`, `setState`, etc.
2. **Trace execution order** — React effects run in order; later effects can override earlier ones
3. **Check for race conditions** — cleanup effects run on unmount and can save stale state
4. **Test the fix yourself** — login, verify the behavior, THEN tell user to test

**Never assume one code change is enough.**

### Code Removal Rules (MANDATORY)

When removing UI elements (buttons, badges, features):

1. **Grep for every symbol** the removed code uses (component names, icons, state setters, imports)
2. **Check if any OTHER code** still references those symbols
3. **Remove dead imports, dead state, dead callbacks** — not just the JSX
4. **Run `npm run build`** to verify TypeScript is clean before claiming done

```bash
# Before removing a button that calls setFoo:
grep -n "setFoo" src/pages/MyPage.tsx    # find ALL callers
grep -n "import.*FooIcon" src/pages/MyPage.tsx  # find import
# Only remove if ALL callers are removed
```

**Common mistakes when removing code:**
- Removed button JSX but left the import → `TS6133: 'X' is declared but its value is never read`
- Removed button but left the useState setter → `TS6133: 'setX' is declared but its value is never read`
- Replaced callback body with empty → unused params → `TS6133: 'a' is declared but its value is never read`

### Cost of Unverified Claims

| Failure | Time Wasted | User Frustration |
|---------|-------------|------------------|
| Claim "deployed" without verification | ~5 min per attempt | High |
| Don't clean old files before deploy | ~5 min debugging | High |
| Don't trace full code path | ~10 min re-fixing | Very High |
| Tell user to test broken fix | ~3 min per attempt | Extreme |

**Total cost of lazy verification: 30+ minutes wasted, user trust damaged.**

### Database Access Rules (MANDATORY)

**NEVER try inline SQL through PowerShell SSH.** Quotes will be mangled every time.

```bash
# WRONG — will fail with quote errors
ssh riz@107.155.75.50 "PGPASSWORD=postgres psql -c \"UPDATE ...\""

# CORRECT — scp SQL file, then run it
echo "UPDATE creators SET image_url = '/creators/x.jpg' WHERE id = 'x';" > /tmp/fix.sql
scp /tmp/fix.sql riz@107.155.75.50:/tmp/fix.sql
ssh riz@107.155.75.50 "PGPASSWORD=<password> psql -h 107.155.75.50 -p 5389 -U postgres -d chub -f /tmp/fix.sql"
```

**Password:** Check CLAUDE.md line 261 (production DATABASE_URL) or extract from container env:
```bash
docker exec $CONTAINER env | grep DATABASE_URL
```

### Image/Photo Debugging Rules (MANDATORY)

When user says "no photo" or "image not showing":

1. **Check the API response** — look at `imageUrl` field
2. **Test the URL** — `curl -sI https://creatorhub.id/$imageUrl`
3. **If 404** — check if URL path matches file location in `/app/static/`
4. **Common issue:** DB stores `/static/creators/x.jpg` but server serves from root → URL should be `/creators/x.jpg`

```bash
# Quick diagnosis
curl -sI https://creatorhub.id/creators/$FILENAME   # should be 200
curl -sI https://creatorhub.id/static/creators/$FILENAME  # will be 404
```

### Browser Caching Rules (MANDATORY)

When deploying new frontend files:

1. **Always rebuild** — old JS hash files may be cached by browser
2. **Verify deployed JS hash matches** — `docker exec $CONTAINER cat /app/static/index.html | grep 'index-'`
3. **If user says "still old"** — it's browser cache, NOT Cloudflare (Cloudflare has `cf-cache-status: DYNAMIC` for HTML)
4. **Tell user to clear browser cache** — not Ctrl+Shift+R, full cache clear in Chrome settings
5. **Never blame Cloudflare** — check `cf-cache-status` header first

### Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| `The payload is invalid` / `DecryptException` | Env var inserted as plain SQL | Delete bad rows; recreate via Coolify UI or artisan |
| `fatal: couldn't find remote ref` | Short commit SHA used | Use `git rev-parse HEAD` (full SHA) |
| Deployment stuck in `queued` | Horizon not processing | Manually dispatch: `ApplicationDeploymentJob::dispatch(QUEUE_ID)` |
| Frontend build fails in Docker | TypeScript errors | Run `cd frontend && npm run build` locally first |
| DB connection refused | Wrong `DATABASE_URL` or missing `?sslmode=disable` | Fix env var in Coolify; redeploy |
| Migrations not applied | Container failed before `goose.Up` | Check logs; run `go run ./cmd/migrate status` then `up` manually |
| Pending migrations after deploy | Old binary without new migration file | Rebuild + redeploy so new SQL is embedded in binary |
