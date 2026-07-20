# Lộ trình Phát triển Tương lai (Future Roadmap)

Để khắc phục các hạn chế hiện có và nâng tầm hệ thống EduConnect thành một nền tảng chuyển đổi số toàn diện (Enterprise-grade), dưới đây là lộ trình phát triển được đề xuất cho các phiên bản tiếp theo:

## Phase 13: Enterprise Integrations (Phiên bản v1.1)

- **Payment Gateway**: Tích hợp VNPay, MoMo. Xử lý IPN Webhooks đảm bảo tính đúng đắn của hóa đơn khi thanh toán qua ngân hàng. Xử lý giao dịch timeout.
- **Email/SMS Service**: Tích hợp SendGrid / AWS SES. Khi có thông báo khẩn cấp từ nhà trường hoặc hóa đơn mới, hệ thống sẽ tự động gửi email cho sinh viên.

## Phase 14: Mobile App & Push Notifications (Phiên bản v1.5)

- **React Native Mobile App**: Xây dựng ứng dụng di động cho Sinh viên và Giảng viên (tái sử dụng chung API của NestJS).
- **FCM (Firebase Cloud Messaging)**: Hỗ trợ Push Notifications trực tiếp đến điện thoại người dùng, đảm bảo sinh viên không bỏ lỡ lịch thi hay hạn nộp học phí.

## Phase 15: AI Analytics & Advanced Reporting (Phiên bản v2.0)

- **Học máy (Machine Learning)**: Đưa AI vào phân tích điểm số, tự động cảnh báo nguy cơ sinh viên trượt môn hoặc bỏ học trước khi kỳ học kết thúc.
- **Dashboard Động**: Chuyển đổi module Thống kê tĩnh hiện tại sang dạng BI (Business Intelligence) cho phép Ban Giám hiệu kéo thả tự tạo biểu đồ báo cáo tài chính/học vụ theo ý muốn.

## Phase 16: Infrastructure Scaling

- Chuyển đổi từ Docker Compose chạy trên 1 Server sang **Kubernetes (K8s)** để tự động Scale các container API trong mùa thi (khi có hàng ngàn sinh viên truy cập cùng lúc).
- Sử dụng Database Replication (Master - Slave) cho PostgreSQL để phân tách các luồng Đọc và Ghi dữ liệu.
