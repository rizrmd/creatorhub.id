# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands must be run from `frontend/` — that is the project root where `package.json` lives.

```bash
cd frontend
npm install       # install dependencies
npm run dev       # watch-mode build → frontend/dist/ (auto-rebuilds on file save)
npm run build     # type-check (tsc) + production build → frontend/dist/
```

There are no tests, no linter config, and no preview server script.

> **After every code change**: `npm run dev` (watch mode) rebuilds automatically on save — no manual restart needed. If you add/remove a dependency, run `npm install` then restart the watch process.

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
