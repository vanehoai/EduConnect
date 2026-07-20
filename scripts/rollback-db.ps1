# Rollback DB Script
$ErrorActionPreference = "Stop"

Write-Host "=== [4/4] Database Emergency Rollback Script ===" -ForegroundColor Red

$backupDir = Join-Path $PSScriptRoot "..\backups"
if (-not (Test-Path $backupDir)) {
    Write-Error "Khong tim thấy thu muc backups $backupDir!"
    exit 1
}

$latestBackup = Get-ChildItem -Path $backupDir -Filter "prod_backup_*.sql" | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if (-not $latestBackup) {
    Write-Error "Khong tim thấy file backup sql nao trong $backupDir!"
    exit 1
}

$backupPath = $latestBackup.FullName
$shaPath = $backupPath -replace '\.sql$', '.sha256'

Write-Host "File backup moi nhat: $backupPath" -ForegroundColor Yellow

if (Test-Path $shaPath) {
    $expectedHash = (Get-Content -Path $shaPath).Trim()
    $currentHash = (Get-FileHash -Path $backupPath -Algorithm SHA256).Hash
    if ($expectedHash -ne $currentHash) {
        Write-Error "SAI LECH CHECKSUM SHA256! File backup bi hong hoac thay doi!"
        exit 1
    }
    Write-Host "[VERIFIED] SHA256 checksum trung khop ($currentHash)" -ForegroundColor Green
}

$dbContainer = "educonnect-postgres-1"
$dbName = "educonnect_production"

Write-Host "Khoi phuc du lieu tu $backupPath vao $dbName..." -ForegroundColor Red
cmd /c "docker exec -i $dbContainer psql -U postgres -d $dbName < `"$backupPath`""

Write-Host "[SUCCESS] Phuc hoi Database Rollback hoan tat thanh cong!" -ForegroundColor Green
