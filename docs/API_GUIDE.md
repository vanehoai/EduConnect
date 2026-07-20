# Hướng dẫn API (API Guide) - EduConnect

Đây là tài liệu rút gọn liệt kê các Endpoint quan trọng trong hệ thống. Để xem toàn bộ cấu trúc Request/Response, hãy chạy API ở môi trường Development và truy cập Swagger UI tại: `http://localhost:3001/api/docs`.

## 1. Authentication (`/auth`)

- `POST /auth/login`: Xác thực email/password. Trả về Access Token (và thiết lập HttpOnly Cookie cho Refresh Token).
  - _Permissions_: Public.
- `POST /auth/refresh`: Cấp mới Access Token bằng Refresh Token từ cookie.
- `GET /auth/me`: Lấy thông tin User hiện tại kèm danh sách Permissions.

## 2. Quản lý Đào tạo (Core Academic)

- `GET /students`, `POST /students`, `PUT /students/:id`, `DELETE /students/:id`
  - _Permissions_: `student.read`, `student.manage`, `student.create`...
- `POST /students/import`: Import CSV sinh viên.
- `GET /courses`, `GET /class-sections`
  - _Permissions_: `course.read`, `class-section.read`.
- `POST /enrollments`: Đăng ký học phần.
  - _Permissions_: `enrollment.create` (Sinh viên chỉ được đăng ký cho chính mình).

## 3. Điểm số và Điểm danh (`/attendance`, `/grades`)

- `PUT /attendance/:classSectionId`: Cập nhật điểm danh cả lớp.
  - _Permissions_: `attendance.manage` (Và phải là Giảng viên đứng lớp đó).
- `PUT /grades/:classSectionId`: Nhập điểm thành phần.
  - _Permissions_: `grade.manage` (Và phải là Giảng viên đứng lớp đó).
- `POST /grades/:classSectionId/publish`: Công bố điểm để sinh viên có thể xem.

## 4. Ngân hàng câu hỏi & Kỳ thi (`/questions`, `/exams`)

- `GET /questions`, `POST /questions`, `PUT /questions/:id`
  - _Ownership_: Giảng viên chỉ sửa được câu hỏi do mình tạo (`createdByUserId`).
- `POST /questions/import`: Import câu hỏi CSV.
- `POST /exams`: Tạo kỳ thi.
  - _Ownership_: Admin hoặc Giảng viên sở hữu mới có quyền thao tác.
- `POST /exams/:id/assignments`: Gán sinh viên vào danh sách thi.

## 5. Làm bài thi trực tuyến (`/exam-attempts`)

- `POST /exams/:id/attempts/start`: Sinh viên bắt đầu làm bài. Backend sinh ra Snapshot đề thi.
- `PUT /exam-attempts/:id/answers/:questionId`: Lưu nháp 1 đáp án (Auto-save).
- `POST /exam-attempts/:id/submit`: Sinh viên nộp bài. Backend chấm điểm và chuyển trạng thái hoàn thành.

## 6. Tài chính (`/finance`)

- `GET /invoices`: Lấy danh sách Hóa đơn. Sinh viên chỉ thấy hóa đơn của chính mình.
- `POST /payments`: Tạo một Transaction thanh toán.
  - _Role_: Dành cho Sinh viên tự thanh toán trên web.
- `POST /receipts`: Admin xác nhận tạo Phiếu thu (Khi sinh viên đóng tiền mặt).

## 7. Tiện ích (`/announcements`, `/service-requests`, `/academic-risks`)

- `GET /announcements`: Lấy thông báo theo phân quyền và phòng ban của User hiện hành.
- `POST /service-requests`: Sinh viên tạo đơn yêu cầu.
- `PUT /service-requests/:id/resolve`: Admin / Training Staff giải quyết yêu cầu.
- `GET /academic-risks`: Lấy danh sách cảnh báo học vụ.
