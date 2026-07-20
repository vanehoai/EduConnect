# Hướng dẫn sử dụng: Giảng viên (Lecturer)

## 1. Đăng nhập

- Truy cập vào trang chủ. Điền thông tin đăng nhập:
  - **Email**: `lecturer@school.local` (Hoặc các tài khoản lecturer1 đến lecturer5)
  - **Mật khẩu**: `Password@123`
- Nhấn "Đăng nhập". Hệ thống điều hướng bạn vào Dashboard dành cho Giảng viên.

## 2. Quản lý Đào tạo & Lớp học

- **Xem Lịch dạy (`/dashboard`)**: Trang Dashboard hiển thị nhanh các lớp học phần bạn đang phụ trách.
- **Quản lý Điểm danh (`/dashboard/attendance`)**:
  - Truy cập danh sách sinh viên của từng lớp học phần.
  - Tích chọn điểm danh từng buổi. Hệ thống tự động tính tỷ lệ vắng mặt. Nếu quá % quy định, sinh viên có thể bị cấm thi.
- **Nhập điểm (`/dashboard/grades`)**:
  - Xem danh sách sinh viên theo lớp.
  - Nhập điểm thành phần, điểm giữa kỳ, điểm thi. Hệ thống tự động tính điểm tổng kết hệ 10 và hệ 4 (A, B, C, D, F).
  - Chọn "Công bố điểm" (Publish) để sinh viên có thể nhìn thấy điểm của mình.

## 3. Tổ chức Kỳ thi trực tuyến

- **Ngân hàng câu hỏi (`/dashboard/question-bank`)**:
  - Tạo câu hỏi trắc nghiệm mới (Single Choice, Multiple Choice, True/False).
  - Chọn mức độ (Dễ, Trung bình, Khó) và gắn vào một học phần.
  - **Lưu ý**: Bạn chỉ có quyền sửa/xóa các câu hỏi do chính bạn tạo ra (Quyền Ownership).
- **Quản lý Kỳ thi (`/dashboard/exams`)**:
  - Tạo mới một kỳ thi. Định cấu hình thời gian thi (Duration), trộn câu hỏi (Shuffle questions), trộn đáp án (Shuffle options), và chế độ xem kết quả.
  - Chọn "Thêm câu hỏi" để lấy câu hỏi từ Ngân hàng đưa vào đề thi.
  - Phân công sinh viên (Assignment) tham gia kỳ thi.
  - Kích hoạt kỳ thi khi đến giờ (Publish). Sinh viên bắt đầu làm bài.
  - Xem điểm số sinh viên đạt được ngay sau khi họ nộp bài.

## 4. Lỗi thường gặp

- **Không thể công bố điểm**: Bạn cần hoàn thành việc nhập điểm cho toàn bộ danh sách lớp (không được để trống) thì mới được công bố.
- **Không sửa được câu hỏi**: Nếu nút "Sửa/Xóa" bị mờ, nghĩa là câu hỏi đó do một giảng viên khác soạn.
- **Sinh viên báo không thấy kỳ thi**: Hãy kiểm tra xem bạn đã chọn (Assign) sinh viên đó vào danh sách thi chưa, và kỳ thi đã chuyển sang trạng thái "PUBLISHED" hay chưa.

## 5. Đăng xuất

- Nhấn vào Avatar góc trên cùng bên phải.
- Chọn **Đăng xuất (Log out)**.
