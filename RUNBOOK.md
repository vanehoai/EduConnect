# Sổ Tay Vận Hành (Runbook) - EduConnect v1.0.0

## 1. Cấu hình Cảnh báo & Giám sát (Monitoring & Alerts)

| Alert Metric               | Điều kiện Cảnh báo                         | Mức độ | Hành động                                                          |
| :------------------------- | :----------------------------------------- | :----: | :----------------------------------------------------------------- |
| **API Unavailable**        | `GET /api/health/live` không trả về 200    | SEV-1  | Kiểm tra container API, restart service                            |
| **Readiness Failed**       | `GET /api/health/ready` trả về 503         | SEV-1  | Kiểm tra kết nối Postgres & Redis                                  |
| **HTTP 5xx Spikes**        | Tỷ lệ 5xx > 1% trong 5 phút                | SEV-1  | Tra cứu log JSON qua Correlation ID (`x-request-id`)               |
| **High Response Time**     | Latency p95 > 1.0s trên GET APIs           | SEV-2  | Phân tích query slow, kiểm tra Redis cache                         |
| **Database Failure**       | Kết nối DB bị ngắt hoặc Connection Limit   | SEV-1  | Kiểm tra CPU/Memory container Postgres, kill slow query            |
| **Redis Failure**          | Kết nối Redis bị ngắt                      | SEV-2  | Khởi động lại Redis, kiểm tra Memory limit                         |
| **High Disk Usage**        | Dung lượng đĩa / volume > 85%              | SEV-2  | Dọn dẹp log cũ (`docker system prune`), lưu trữ backup             |
| **High CPU/Memory**        | Container CPU > 90% hoặc RAM > 85%         | SEV-2  | Tăng resource limits trong compose file                            |
| **Backup Failure**         | Cron backup hoặc SHA256 verification lỗi   | SEV-2  | Chạy script backup thủ công `pwsh ./scripts/pre-deploy-check.ps1`  |
| **Scheduler Failure**      | Advisory lock acquisition / Cron job fail  | SEV-3  | Kiểm tra log `announcement-scheduler` và `academic-risk-scheduler` |
| **Login Brute Force**      | Throttler kích hoạt HTTP 429 trên `/login` | SEV-3  | Theo dõi IP nguồn, kiểm tra rate limit config                      |
| **Payment Webhook Errors** | Webhook verification / Idempotency fail    | SEV-2  | Kiểm tra `MOCK_PAYMENT_WEBHOOK_SECRET` và audit log                |

---

## 2. Kịch bản Xử lý Sự cố & Đổi Secret

### 2.1 Đổi JWT Secrets / Database Credentials

1. Cập nhật secret mới trong `.env.production` (hoặc Secret Manager).
2. Tái khởi tạo container API:
   ```bash
   docker compose -f docker-compose.production.yml up -d --force-recreate api
   ```
3. Mọi access token cũ sẽ tự động bị từ chối, yêu cầu người dùng đăng nhập lại.

### 2.2 Xử lý Tài khoản Bị Khóa / Tấn công Brute-Force

- Kiểm tra Throttler log và AuditLog trong DB.
- Đặt lại mật khẩu tài khoản bị nghi ngờ bị xâm nhập qua DB hoặc API quản trị.
