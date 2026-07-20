# EduConnect Incident Response Plan (v1.0.0)

## 1. Severities & Escalation

- **SEV-1 (Critical):** API down, Database inaccessible, Data corruption. Response: < 15 mins.
- **SEV-2 (High):** Major feature degraded (e.g. Exam submission failing), Redis down. Response: < 1 hour.
- **SEV-3 (Medium):** Minor bug, non-critical UI degradation. Response: < 24 hours.

---

## 2. Emergency Recovery Workflows

### 2.1 Service Outage (API or Web Down)

1. Inspect container status: `docker compose -f docker-compose.production.yml ps`
2. Check container logs: `docker logs --tail 100 educonnect-api-1`
3. Restart healthy containers: `docker compose -f docker-compose.production.yml restart api web`

### 2.2 Database Failure / Corruption

1. Stop API container: `docker compose -f docker-compose.production.yml stop api`
2. Verify pre-deploy backup: `pwsh ./scripts/rollback-db.ps1`
3. Restart API container: `docker compose -f docker-compose.production.yml start api`

### 2.3 Failed Migration Rollback

1. Do NOT delete old migrations or alter historical migration files.
2. Verify migration status: `docker exec educonnect-api-1 npx prisma migrate status`
3. If migration partially failed, execute DB rollback drill script: `pwsh ./scripts/rollback-db.ps1`

### 2.4 Secret Compromise / Leaked Token

1. Generate new 32-character random secrets.
2. Update `.env.production` on production host.
3. Re-create API & Web containers: `docker compose -f docker-compose.production.yml up -d --force-recreate`
4. Active JWT tokens signed with old secret will immediately be invalidated (forcing re-login).
