# Báo cáo Kiểm thử Tổng kết (Test Report)

Tài liệu ghi lại kết quả thực tế của toàn bộ các chiến dịch kiểm thử (Testing Campaigns) được thực thi trong Phase 8 (Testing & QA) và xác nhận lại ở Phase 12 (Quality Gates) của dự án EduConnect.

## 1. Unit & Integration Tests (Backend + Frontend)

Sử dụng Jest (cho NestJS API) và Vitest/RTL (cho Next.js Components).

- **Số lượng Test Suites**: 28/28 passed (100%)
- **Số lượng Test Cases**: 167/167 passed (100%)
- **Độ bao phủ (Coverage)**: Tập trung vào các Module cốt lõi như Authentication (JWT/Roles), Finance (Invoice Calculation), Exam (Auto-save, Scoring).

## 2. E2E Tests (Playwright)

Các kịch bản người dùng (User Flows) được giả lập thao tác click thực tế.

- **Số lượng kịch bản E2E**: 3/3 passed (100%)
  1. Luồng Admin Đăng nhập và tạo Khóa học.
  2. Luồng Sinh viên thực hiện Bài thi trực tuyến (Bấm giờ, chọn đáp án, nộp bài).
  3. Luồng Sinh viên thanh toán Học phí giả lập.
- **Ghi chú**: Không có test nào bị skipped.

## 3. Khả năng truy cập (Accessibility - a11y)

- **Công cụ**: axe-core (thông qua cypress-axe hoặc jest-axe).
- **Kết quả**: 0 violations (0 lỗi nghiêm trọng) trên các trang đã kiểm tra (Dashboard Login, Danh sách Sinh viên, Trang làm bài thi).
- **Lưu ý**: Chỉ scan một số route chính, chưa cover toàn bộ 100% các page phụ.

## 4. Kiểm thử Hiệu năng (Performance - K6)

- Kịch bản Login Burst (Mô phỏng giờ cao điểm đăng nhập):
  - **P95 Latency**: 2.70s (Trong giới hạn chấp nhận được, do cần chạy thuật toán băm `bcrypt` nặng).
- Kịch bản Authenticated GET (Mô phỏng tải data dashboard thông thường):
  - **P95 Latency**: 245.9ms (Tuyệt vời, đáp ứng tiêu chuẩn SaaS < 300ms).

## 5. Security & Infrastructure (Quality Gates)

- **NPM Audit**: 0 critical/high vulnerabilities (Không phát hiện lỗ hổng bảo mật nghiêm trọng nào từ thư viện bên thứ 3).
- **Docker Services**: Healthy (Tất cả container API, Web, Postgres, Redis khởi động thành công trên Production Compose).
- **Migrations**: 10/10 executed thành công. Không có lỗi lệch drift schema.
- **Smoke Tests**: 8/8 passed (Các endpoint healthcheck API `/health` đều trả về HTTP 200).

## 6. Kết luận

Dự án hoàn toàn đáp ứng các tiêu chí Quality Gates đặt ra ban đầu. Code đã sẵn sàng để triển khai v1.0.0.
