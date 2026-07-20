# Sổ Tay Vận Hành (Runbook) - EduConnect

## 1. Cấu hình Cảnh báo (Alerts)

- **CPU/RAM Usage**: > 85% trong 5 phút.
- **API Error Rate (5xx)**: > 2% tổng request.
- **Database CPU/Connections**: Đạt ngưỡng giới hạn cấu hình.
- Công cụ: Prometheus, Grafana, Datadog hoặc AWS CloudWatch.
- Kênh nhận cảnh báo: Slack, Email, SMS (PagerDuty).

## 2. Các Kịch Bản Xử Lý Sự Cố (Incident Response)

### 2.1. API Unavailable (502 Bad Gateway / 503 Service Unavailable)

- **Nguyên nhân**: Node.js/API container bị crash, cấu hình Nginx/Load Balancer sai.
- **Khắc phục**:
  1. Check logs của API container: `docker logs <container_id>` hoặc qua công cụ log tập trung.
  2. Khởi động lại dịch vụ: `docker restart api_service` hoặc scale lại pods trên K8s.
  3. Kiểm tra lại health check endpoint (`/health`).

### 2.2. Database Fail (PostgreSQL Down)

- **Nguyên nhân**: Quá tải connection, hết ổ cứng, lỗi phần cứng máy chủ DB.
- **Khắc phục**:
  1. Kiểm tra tài nguyên DB server (Disk space, CPU).
  2. Kill các query treo (long-running queries) gây deadlocks.
  3. Failover sang DB Replica nếu đang dùng Master-Slave hoặc AWS RDS Multi-AZ.

### 2.3. Redis Fail (Cache/Queue Down)

- **Nguyên nhân**: Hết RAM, Redis server crash.
- **Khắc phục**:
  1. Khởi động lại Redis service.
  2. Nếu dùng cho cache: Hệ thống nên có cơ chế fallback đọc từ DB khi cache miss hoặc Redis down (đảm bảo không sập dây chuyền).
  3. Nếu dùng cho queue: Các job bị kẹt sẽ được retry khi Redis online lại.

### 2.4. Backup Thất Bại (Daily Backup failed)

- **Nguyên nhân**: Hết dung lượng ổ lưu trữ backup (S3/Disk), script cronjob lỗi.
- **Khắc phục**:
  1. Kiểm tra log của backup cronjob.
  2. Dọn dẹp các file backup quá cũ (Retention policy).
  3. Chạy backup thủ công để đảm bảo an toàn ngay lập tức.
