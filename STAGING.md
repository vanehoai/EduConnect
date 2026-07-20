# Hướng Dẫn Cấu Hình và Chạy Môi Trường Staging

## 1. Giới thiệu

Môi trường Staging (Pre-production) là bản sao của môi trường Production, dùng để kiểm thử cuối cùng trước khi deploy.

## 2. Yêu cầu hệ thống

- Docker & Docker Compose
- Node.js >= 18
- PostgreSQL 15+
- Redis 7+

## 3. Cấu hình biến môi trường

Tạo file `.env.staging` từ `.env.example`:

```env
NODE_ENV=staging
PORT=3000
DATABASE_URL=postgres://user:pass@staging-db-host:5432/educonnect_staging
REDIS_URL=redis://staging-redis-host:6379
JWT_SECRET=your_staging_jwt_secret
```

## 4. Triển khai với Docker

1. Kéo mã nguồn mới nhất:
   `git pull origin staging`
2. Build image:
   `docker-compose -f docker-compose.staging.yml build`
3. Chạy container:
   `docker-compose -f docker-compose.staging.yml up -d`
4. Chạy migration:
   `docker-compose -f docker-compose.staging.yml exec api npm run db:migrate`

## 5. Kiểm tra trạng thái

- Kiểm tra logs: `docker-compose -f docker-compose.staging.yml logs -f`
- API Health check: `curl http://localhost:3000/health`
