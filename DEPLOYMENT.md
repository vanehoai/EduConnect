# Hướng Dẫn Deploy Lên Production (v1.0.0)

## 1. Quy trình chuẩn bị (Pre-Deployment)

1. Đảm bảo toàn bộ mã nguồn trên nhánh `feature/phase-11-production-launch` đã vượt qua 13 Quality Gates.
2. Cấu hình file `.env.production` bằng các secret sản xuất độc lập.
3. Chạy script backup & kiểm tra tiền triển khai:
   ```powershell
   pwsh ./scripts/pre-deploy-check.ps1
   ```

## 2. Quy trình Triển khai (Production Deployment)

### 2.1 Qua GitHub Actions (Automated CI/CD)

1. Truy cập GitHub Actions workflow `.github/workflows/deploy-production.yml`.
2. Chọn `Run workflow` qua trigger `workflow_dispatch` (yêu cầu phê duyệt môi trường `production`).
3. Workflow tự động chạy Lint, Typecheck, Unit/Integration tests, Build Docker images, Backup DB, Migrate deploy và Smoke Test.

### 2.2 Qua Docker Compose Production (Manual / Local Production-Like)

```bash
docker compose -f docker-compose.production.yml config --quiet
docker compose -f docker-compose.production.yml up -d --build
```

## 3. Kiểm tra sau khi Deploy (Post-Deployment Verification)

1. Thực thi script kiểm thử khói sản xuất:
   ```bash
   node scripts/smoke-test-production.js
   ```
2. Kiểm tra Health Endpoints:
   - Live: `GET http://localhost:4000/api/health/live`
   - Ready: `GET http://localhost:4000/api/health/ready`

## 4. Quy trình Rollback Khẩn cấp

Nếu có sự cố không mong muốn:

1. Thực thi script phục hồi Database khẩn cấp:
   ```powershell
   pwsh ./scripts/rollback-db.ps1
   ```
2. Khôi phục container về phiên bản ổn định trước đó.
