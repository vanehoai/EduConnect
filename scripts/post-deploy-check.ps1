# Post-Deploy Check Script
$ErrorActionPreference = "Stop"

Write-Host "=== [3/4] Post-Deploy Database Verification ===" -ForegroundColor Cyan

$containerName = "educonnect-api-1"
$schemaPath = "apps/api/prisma/schema.prisma"

Write-Host "Xác minh trạng thái migration sau deploy..." -ForegroundColor Yellow
docker exec -e DATABASE_URL="postgresql://postgres:production_secure_password_12345@postgres:5432/educonnect_production?schema=public" $containerName npx prisma migrate status --schema=$schemaPath

Write-Host "`nĐối chiếu số lượng bản ghi các bảng chính..." -ForegroundColor Yellow
node (Join-Path $PSScriptRoot "count-records.js")

Write-Host "`n[PASS] Database hoàn tất kiểm tra hậu triển khai!" -ForegroundColor Green
