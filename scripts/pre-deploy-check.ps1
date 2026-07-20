# Pre-Deploy Check & Database Backup Script
$ErrorActionPreference = "Stop"

Write-Host "=== [1/4] Pre-Deploy Safety Check & Backup ===" -ForegroundColor Cyan

$backupDir = Join-Path $PSScriptRoot "..\backups"
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFile = Join-Path $backupDir "prod_backup_$timestamp.sql"
$shaFile = Join-Path $backupDir "prod_backup_$timestamp.sha256"

$containerName = "educonnect-postgres-1"
$dbName = "educonnect_production"

Write-Host "Tao ban sao luu PostgreSQL tu container $containerName (DB: $dbName)..." -ForegroundColor Yellow

# Execute pg_dump inside container cleanly to /tmp/backup.sql and copy out
docker exec $containerName pg_dump -U postgres -d $dbName --clean --if-exists --create -f /tmp/backup.sql
docker cp "${containerName}:/tmp/backup.sql" $backupFile
docker exec $containerName rm -f /tmp/backup.sql

if (-not (Test-Path $backupFile) -or (Get-Item $backupFile).Length -eq 0) {
    Write-Error "Loi: Khong the tao ban sao luu $backupFile hoac file rong!"
    exit 1
}

$fileSize = (Get-Item $backupFile).Length
$hash = (Get-FileHash -Path $backupFile -Algorithm SHA256).Hash
$hash | Out-File -FilePath $shaFile -Encoding ascii

Write-Host "[SUCCESS] Da sao luu DB thanh cong:" -ForegroundColor Green
Write-Host "  - Path: $backupFile"
Write-Host "  - Size: $fileSize bytes"
Write-Host "  - SHA256: $hash"
Write-Host "  - Timestamp: $timestamp"

Write-Host "`nDem so luong ban ghi cac bang quan trong..." -ForegroundColor Yellow
node (Join-Path $PSScriptRoot "count-records.js")

Write-Host "`n[PASS] Kiem tra tien trien khai hoan tat!" -ForegroundColor Green
