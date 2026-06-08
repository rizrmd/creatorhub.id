---
description: Launch the CreatorHub app (kill existing process on :8080 first, then start backend + verify)
---

# Run CreatorHub

## Steps

### 1. Kill any process holding port 8080

```powershell
$pid8080 = (Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue).OwningProcess
if ($pid8080) { Stop-Process -Id $pid8080 -Force; Start-Sleep -Milliseconds 500 }
```

### 2. Build the backend (only if source changed)

```powershell
Set-Location "F:\ai\creatorhub.id\backend"
go build -o creatorhub.exe .
```

### 3. Start the server in background

```powershell
Start-Process -FilePath "F:\ai\creatorhub.id\backend\creatorhub.exe" `
  -WorkingDirectory "F:\ai\creatorhub.id\backend" `
  -NoNewWindow -PassThru
Start-Sleep -Seconds 2
```

### 4. Smoke-test

```powershell
Invoke-RestMethod "http://localhost:8080/health"
Invoke-RestMethod "http://localhost:8080/api/v1/creators?pageSize=1"
```

Server runs at **http://localhost:8080**. Static frontend is served from `frontend/dist/`.

## Notes

- Always run from `backend/` as working dir so `.env` is loaded.
- If frontend changed, rebuild first: `cd frontend && npm run build`.
- Log output goes to stdout (not stderr) — no red PowerShell noise.
