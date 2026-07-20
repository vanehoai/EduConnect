# EduConnect Backup & Restore Protocol (v1.0.0)

## 1. Automated Pre-Deployment Backup

Before every deployment or migration, run the automated backup script:

```powershell
pwsh ./scripts/pre-deploy-check.ps1
```

This script:

1. Performs `pg_dump` of database `educonnect_production`.
2. Stores backup in `backups/prod_backup_<timestamp>.sql`.
3. Computes and saves SHA256 checksum in `backups/prod_backup_<timestamp>.sha256`.
4. Logs backup file size and timestamp.

---

## 2. Emergency Restoration Process

To restore the database from the latest verified backup:

```powershell
pwsh ./scripts/rollback-db.ps1
```

Verification steps:

1. Verifies SHA256 checksum of backup file against `.sha256` manifest.
2. Restores PostgreSQL database cleanly using `psql`.
3. Re-runs `npx prisma migrate status` to confirm migration alignment.
4. Executes production smoke test `node scripts/smoke-test-production.js`.
