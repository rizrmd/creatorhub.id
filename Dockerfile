# syntax=docker/dockerfile:1

# =============================================
# Stage 1: Frontend build
# =============================================
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend

# Dependency layer — only rebuilds when package-lock changes
COPY frontend/package.json frontend/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm install --no-audit --no-fund

# Config layer — rebuilds when build tooling changes
COPY frontend/index.html frontend/vite.config.ts frontend/tsconfig.json frontend/tsconfig.app.json frontend/tsconfig.node.json frontend/components.json ./
COPY frontend/public/ ./public/

# Source layer — rebuilds when app code changes
COPY frontend/src/ ./src/
RUN npm run build

# =============================================
# Stage 2: Go backend build
# =============================================
FROM golang:1.25-alpine AS backend-builder
WORKDIR /app/backend

RUN apk add --no-cache git ca-certificates

# Module layer — only rebuilds when go.sum changes
COPY backend/go.mod backend/go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
    go mod download

# Schema layer — rebuilds when migrations change
COPY backend/migrations/ ./migrations/

# Source layer — rebuilds when application code changes
COPY backend/internal/ ./internal/
COPY backend/cmd/ ./cmd/
COPY backend/main.go ./

RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /creatorhub .

# =============================================
# Stage 3: Production runtime
# =============================================
FROM alpine:3.21 AS runner
WORKDIR /app

RUN apk add --no-cache ca-certificates curl

COPY --from=backend-builder /creatorhub /app/creatorhub
COPY --from=frontend-builder /app/frontend/dist /app/static

ENV PORT=3000
ENV STATIC_DIR=/app/static

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT}/health || exit 1

CMD ["/app/creatorhub"]