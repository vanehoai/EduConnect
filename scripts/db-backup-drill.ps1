$ErrorActionPreference = "Stop"

Write-Host "1. Backup educonnect_staging..."
docker exec educonnect-postgres-1 pg_dump -U postgres educonnect_staging > backup.sql
Write-Host "Backup completed. File size:"
(Get-Item backup.sql).length

Write-Host "2. Create educonnect_staging_temp..."
docker exec educonnect-postgres-1 psql -U postgres -d postgres -c "DROP DATABASE IF EXISTS educonnect_staging_temp;"
docker exec educonnect-postgres-1 psql -U postgres -d postgres -c "CREATE DATABASE educonnect_staging_temp;"

Write-Host "3. Restore to educonnect_staging_temp..."
Get-Content backup.sql | docker exec -i educonnect-postgres-1 psql -U postgres -d educonnect_staging_temp

Write-Host "4. Verify Restore..."
docker exec educonnect-postgres-1 psql -U postgres -d educonnect_staging_temp -c "\dt"

Write-Host "Backup and Restore drill completed successfully!"
