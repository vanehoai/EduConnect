# Các Hạn chế Hiện tại (Known Limitations)

Mặc dù hệ thống EduConnect đã hoàn thành toàn bộ các yêu cầu lõi, phiên bản v1.0.0 hiện hành vẫn còn một số điểm giới hạn cần được lưu ý trước khi đi vào vận hành thực tế tại các trường quy mô lớn.

1. **Triển khai thực tế (Deployment)**
   - Hệ thống mới chỉ chạy tốt qua Docker trên Local và Môi trường Staging (Test Servers).
   - Chưa được deploy ra Public VPS / Cloud thực tế (như AWS EC2, DigitalOcean). Chưa thiết lập Domain và SSL Certificates thật.

2. **Cổng thanh toán (Payment Gateway)**
   - Module Tài chính hiện chỉ hỗ trợ _Mock Payment Provider_ (ghi nhận thanh toán ảo).
   - Chưa tích hợp thật với các cổng như VNPay, MoMo, PayPal hay ngân hàng. Chưa có xử lý IPN (Instant Payment Notification - Webhook).

3. **Gửi Email / SMS (Communication)**
   - Tính năng thông báo (Announcements / Notifications) mới chỉ hoạt động dạng In-App (Push vào Database và hiển thị trên chuông báo của giao diện).
   - Chưa tích hợp với các dịch vụ gửi Mail thật (SendGrid, AWS SES) hoặc SMS (Twilio, VietGuys) do chưa có thông tin API Key thật.

4. **Quản lý File đính kèm (File Storage)**
   - Chưa có chỗ lưu trữ File mở rộng (như Amazon S3, MinIO) cho avatar sinh viên hoặc tài liệu học liệu. Hiện dữ liệu giả lập đang dùng ảnh placeholder.

5. **Độ bao phủ Test (Test Coverage)**
   - E2E Tests (Playwright) mới chỉ bao phủ các luồng thao tác chính (Login, Thi trực tuyến, Đóng học phí). Chưa cover hết 100% các corner cases ở Frontend.
   - Accessibility (Khả năng truy cập) chưa được tự động kiểm tra trên toàn bộ các route (mới test trên các route chính).

6. **Monitoring & Tracing**
   - Healthcheck `/api/health` đã hoạt động tốt, nhưng chưa kết nối với các công cụ giám sát chuyên nghiệp bên ngoài (như Sentry để bắt lỗi Frontend, Datadog/NewRelic để giám sát hiệu năng API chuyên sâu).
