# EduConnect Production Architecture & Operational Manual (v1.0.0)

## 1. Overview & Architecture

EduConnect is an integrated school management system deployed via Docker Compose in production mode.

- **Frontend (`@school/web`):** Next.js 15 standalone build served on `http://localhost:3000`. Non-root user `node`.
- **Backend API (`@school/api`):** NestJS framework served on `http://localhost:4000/api`. Non-root user `node`.
- **Database (`postgres`):** PostgreSQL 15 containerized service on port `5435:5432` with persistent volume `postgres_prod_data`.
- **Cache (`redis`):** Redis 7 containerized service on port `6379` with persistent volume `redis_prod_data`.

---

## 2. Environment Variables & Mandatory Secrets

Production deployment enforces environment variable validation (`apps/api/src/config/env.validation.ts`).

| Variable                      | Description                       | Requirement                                     |
| :---------------------------- | :-------------------------------- | :---------------------------------------------- |
| `NODE_ENV`                    | Environment name                  | Must be `production`                            |
| `PORT`                        | NestJS API Internal Port          | `3000`                                          |
| `DATABASE_URL`                | PostgreSQL connection string      | Must specify non-default production credentials |
| `REDIS_URL`                   | Redis connection string           | `redis://redis:6379`                            |
| `JWT_ACCESS_SECRET`           | Secret for signing access tokens  | Min 32 chars, no 'development' string           |
| `JWT_REFRESH_SECRET`          | Secret for signing refresh tokens | Min 32 chars, no 'development' string           |
| `CORS_ORIGIN`                 | Allowed CORS origins              | Whitelisted production domain(s)                |
| `APP_URL`                     | Public frontend URL               | `https://educonnect.example.com`                |
| `API_URL`                     | Public API URL                    | `https://api.educonnect.example.com/api`        |
| `POSTGRES_PASSWORD`           | PostgreSQL database password      | High entropy production password                |
| `MOCK_PAYMENT_WEBHOOK_SECRET` | Webhook verification secret       | Min 32 chars secret                             |
| `COOKIE_SECURE`               | Cookie Secure flag                | `true` in HTTPS production                      |

---

## 3. Monitoring & Alert Definitions (12 Critical Scenarios)

The system logs in structured JSON format with Pino HTTP logging. Each request carries a unique `x-request-id` (Correlation ID).

1. **API Unavailable:** Healthcheck `GET /api/health/live` fails or returns non-200.
2. **Readiness Failed:** `GET /api/health/ready` returns 503 (Database/Redis disconnected).
3. **HTTP 5xx Spikes:** 5xx response rate > 1% over 5 minutes.
4. **High Response Time:** Latency p95 > 1.0s for authenticated GET endpoints.
5. **Database Connection Failure:** PrismaClientInitializationError or connection timeout.
6. **Redis Connection Failure:** Redis connection dropped; fallback in-memory cache active.
7. **High Disk Usage:** Host / volume disk usage > 85%.
8. **High CPU / Memory Usage:** Container CPU > 90% or RAM > 85% of limit.
9. **Backup Failure:** Scheduled pg_dump or SHA256 verification fails.
10. **Scheduler Failure:** `@nestjs/schedule` cron job failed or advisory lock acquisition failed.
11. **Login Brute Force:** Rate limiter triggers 429 Too Many Requests on `POST /api/auth/login`.
12. **Payment Webhook Errors:** Invalid signature or failed idempotency check on payment webhooks.
