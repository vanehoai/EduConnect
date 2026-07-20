# Hướng dẫn sử dụng: Phòng đào tạo (Training Staff)

## 1. Đăng nhập

- Truy cập vào trang chủ. Điền thông tin đăng nhập:
  - **Email**: `training@school.local`
  - **Mật khẩu**: `Password@123`
- Nhấn "Đăng nhập". Hệ thống điều hướng bạn vào Dashboard dành cho Phòng đào tạo.

## 2. Quản lý Đào tạo (Core Academic)

Đây là nghiệp vụ chính của Phòng đào tạo:

- **Khoa/Bộ môn (`/dashboard/departments`)**: Quản lý danh sách các Khoa, phân công Trưởng khoa.
- **Giảng viên (`/dashboard/lecturers`)**: Thêm mới, cập nhật hồ sơ, phân công Giảng viên vào các Khoa.
- **Sinh viên (`/dashboard/students`)**: Thêm mới, xem danh sách sinh viên. Sinh viên sẽ được tự động xếp vào khóa và lớp.
- **Môn học (`/dashboard/courses`)**: Quản lý chương trình học, số tín chỉ, mô tả môn, và môn tiên quyết.
- **Lớp học phần (`/dashboard/class-sections`)**: Mở lớp học phần cho Học kỳ hiện tại, gán giảng viên phụ trách, định mức sĩ số và cấu hình phòng học.

## 3. Tổ chức Kỳ thi (Exam Management)

- **Kỳ thi (`/dashboard/exams`)**: Xem danh sách các kỳ thi được Giảng viên tạo. Phòng đào tạo có quyền phân công kỳ thi cho sinh viên và cấu hình thời gian thi để sinh viên thấy trên hệ thống.
- **Ngân hàng câu hỏi (`/dashboard/question-bank`)**: Theo dõi kho câu hỏi trắc nghiệm của toàn trường do các giảng viên biên soạn. Hỗ trợ import câu hỏi hàng loạt từ file CSV.

## 4. Dịch vụ Sinh viên & Cảnh báo Học vụ

- **Yêu cầu dịch vụ (`/dashboard/service-requests`)**: Tiếp nhận các loại đơn từ (xin nghỉ học, cấp bảng điểm, xác nhận sinh viên) do sinh viên gửi lên. Cập nhật trạng thái xử lý (In Progress, Resolved).
- **Cảnh báo học vụ (`/dashboard/academic-risks`)**: Theo dõi các sinh viên có kết quả học tập kém, hoặc vắng quá số buổi quy định. Nhập ghi chú xử lý để lưu lại vết.

## 5. Lỗi thường gặp

- **Không thể xếp lịch thi / mở lớp**: Hãy kiểm tra xem "Học kỳ (Semester)" hiện tại đã được cấu hình và đang ở trạng thái ACTIVE hay chưa. Lớp học phần chỉ có thể gán vào học kỳ đang mở.
- **Lỗi import sinh viên / câu hỏi**: Đảm bảo file CSV tuân thủ chính xác định dạng header. Lỗi thường phát sinh khi import file CSV có chứa công thức (Formula) trái phép.

## 6. Đăng xuất

- Nhấn vào Avatar góc trên cùng bên phải.
- Chọn **Đăng xuất (Log out)**.
