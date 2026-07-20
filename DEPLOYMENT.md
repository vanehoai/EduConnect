# Hướng Dẫn Deploy Lên Production

## 1. Quy trình chuẩn bị (Pre-Deployment)

1. Đảm bảo toàn bộ mã nguồn trên nhánh `main` đã qua môi trường Staging và UAT.
2. Kiểm tra CI/CD pipelines (Build, Test, Security Scan) báo PASS.
3. Backup Database trên Production trước khi deploy.
   - Lệnh: `pg_dump -U user -h db-host educonnect_prod > backup_YYYYMMDD.sql`
4. Gửi thông báo Downtime cho người dùng (nếu cần).

## 2. Các bước Deployment

Quy trình sử dụng CI/CD (GitHub Actions / GitLab CI):

1. Tạo Release Tag trên Git: `git tag v1.0.0 && git push origin v1.0.0`
2. CI/CD sẽ tự động:
   - Build Docker Image với tag `v1.0.0`.
   - Push lên Container Registry.
   - Deploy lên Kubernetes / Docker Swarm (Cập nhật image).
   - Chạy Database Migrations tự động.

## 3. Kiểm tra sau khi Deploy (Post-Deployment)

1. Gọi API Health check: `/health`.
2. Kiểm tra log lỗi: Elastic/Kibana, Datadog hoặc công cụ log đang dùng.
3. Đăng nhập thử với các tài khoản Test Role.

## 4. Kịch bản Rollback

Nếu có lỗi nghiêm trọng trên Production:

1. Revert image version về tag trước đó trên k8s/docker.
2. Nếu có lỗi cấu trúc DB, sử dụng bản backup hoặc lệnh migrate rollback.
3. Cập nhật lại trạng thái hệ thống.
