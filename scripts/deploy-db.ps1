# Deploy DB Script
$ErrorActionPreference = "Stop"

Write-Host "=== [2/4] Deploy Database Migrations ===" -ForegroundColor Cyan

$containerName = "educonnect-api-1"
$schemaPath = "apps/api/prisma/schema.prisma"

Write-Host "Kiểm tra trạng thái migration trước khi deploy..." -ForegroundColor Yellow
docker exec $containerName npx prisma migrate status --schema=$schemaPath

Write-Host "`nThực thi prisma migrate deploy..." -ForegroundColor Yellow
docker exec $containerName npx prisma migrate deploy --schema=$schemaPath

Write-Host "`n[SUCCESS] Phản hồi migration thành công!" -ForegroundColor Green
