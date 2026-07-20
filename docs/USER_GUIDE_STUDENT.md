# Hướng dẫn sử dụng: Sinh viên (Student)

## 1. Đăng nhập

- Truy cập vào trang chủ. Điền thông tin đăng nhập:
  - **Email**: `student@school.local` (Hoặc các tài khoản từ student2 đến student20)
  - **Mật khẩu**: `Password@123`
- Nhấn "Đăng nhập". Hệ thống điều hướng bạn vào Dashboard dành cho Sinh viên.

## 2. Thông tin Học vụ

- **Tổng quan (`/dashboard`)**: Xem lịch học tuần này và các số liệu tóm tắt (số môn đang học, thông báo mới).
- **Kết quả học tập (`/dashboard/student/academic-results`)**:
  - Xem điểm chi tiết của tất cả các môn học qua các học kỳ.
  - Xem điểm trung bình tích lũy (GPA, CPA).
- **Hồ sơ cá nhân (`/dashboard/profile`)**:
  - Xem thông tin liên lạc, mã sinh viên, trạng thái nhập học và Khoa quản lý.

## 3. Tài chính Học vụ

- **Tra cứu Học phí (`/dashboard/student/finance`)**:
  - Xem tổng số nợ học phí hiện tại.
  - Xem danh sách các Hóa đơn (Invoices). Những hóa đơn nào có trạng thái "UNPAID" (Chưa thanh toán) sẽ hiển thị nút "Thanh toán".
  - **Thanh toán trực tuyến**: Khi nhấn nút Thanh toán, hệ thống sẽ hiển thị một form giả lập cổng thanh toán trực tuyến. Sau khi nhập thông tin thẻ và xác nhận, hóa đơn sẽ tự động chuyển sang "PAID" và hệ thống sinh ra một Phiếu thu (Receipt).
  - Lịch sử thanh toán và Phiếu thu có thể xem tại cùng màn hình này.

## 4. Thi trắc nghiệm trực tuyến

- **Kỳ thi của tôi (`/dashboard/student/exams`)**:
  - Danh sách các kỳ thi bạn được phân công tham gia.
  - Chọn một kỳ thi đang mở, nhấn "Làm bài".
- **Quá trình làm bài**:
  - Màn hình hiển thị câu hỏi và đồng hồ đếm ngược (được đồng bộ với server).
  - Hệ thống hỗ trợ **Auto-save**: cứ mỗi khi bạn chọn một đáp án, đáp án đó được tự động lưu lên máy chủ sau vài trăm mili-giây. Bạn có thể F5 lại trang mà không mất bài.
  - Khi hoàn tất, nhấn "Nộp bài".
- **Xem kết quả**:
  - Sau khi nộp, nếu giảng viên cấu hình cho phép, bạn có thể nhấn "Xem kết quả" để xem điểm số, số câu đúng/sai.
  - Chú ý: Đáp án chi tiết của từng câu chỉ hiển thị nếu giảng viên mở tính năng này.

## 5. Dịch vụ Sinh viên & Thông báo

- **Gửi Yêu cầu (`/dashboard/service-requests`)**:
  - Nếu cần giấy xác nhận sinh viên, cấp bảng điểm, hoặc giải quyết khiếu nại, bạn tạo một "Yêu cầu mới" tại đây.
  - Theo dõi trạng thái giải quyết của Phòng đào tạo (Đang xử lý / Đã giải quyết / Đã hủy).
- **Xem Thông báo (`/dashboard/announcements`)**:
  - Nhận thông báo từ nhà trường (Lịch nghỉ lễ, Lịch thi, Nộp học phí).
  - Chỉ những thông báo nhắm tới toàn trường hoặc khoa của bạn mới được hiển thị.

## 6. Đăng xuất

- Nhấn vào Avatar góc trên cùng bên phải.
- Chọn **Đăng xuất (Log out)**.
