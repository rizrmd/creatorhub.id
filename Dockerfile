# syntax=docker/dockerfile:1

# =============================================
# Stage 1: Frontend build
# =============================================
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# =============================================
# Stage 2: Go backend build
# =============================================
FROM golang:1.22-alpine AS backend-builder
WORKDIR /app/backend

RUN apk add --no-cache git ca-certificates

COPY backend/go.mod backend/go.sum ./
RUN go mod download

COPY backend/ ./
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /creatorhub .

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

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:${PORT}/health || exit 1

CMD ["/app/creatorhub"]