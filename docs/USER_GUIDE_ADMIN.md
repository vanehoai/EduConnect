# Hướng dẫn sử dụng: Quản trị hệ thống (Admin)

## 1. Đăng nhập

- Truy cập vào trang chủ. Điền thông tin đăng nhập:
  - **Email**: `admin@school.local` (Tài khoản demo mặc định)
  - **Mật khẩu**: `Password@123`
- Nhấn "Đăng nhập". Hệ thống sẽ điều hướng bạn vào Dashboard dành cho Admin.

## 2. Tổng quan (Dashboard)

- Tại trang chủ `/dashboard`, bạn sẽ thấy các số liệu tổng quan về tình trạng hoạt động của hệ thống, bao gồm số lượng người dùng đang truy cập, tải của hệ thống, và các thông báo gần nhất.
- Bảng điều khiển (Sidebar) bên trái sẽ hiển thị toàn bộ các tính năng khả dụng đối với vai trò Admin. (Admin có quyền xem và thao tác trên mọi màn hình).

## 3. Quản lý Hệ thống (System Management)

_Admin là người duy nhất có quyền can thiệp vào cấu trúc danh tính và vai trò gốc của hệ thống._

- **Quản lý Tài khoản (Users)**: Tìm kiếm, khóa (deactivate), hoặc thiết lập lại mật khẩu cho các tài khoản người dùng khác (Sinh viên, Giảng viên, Nhân viên).
- **Phân quyền (Roles & Permissions)**: (Nếu được bật trên UI) Xem cấu trúc nhóm quyền được gắn cho từng loại tài khoản.

## 4. Quản lý Cảnh báo & Hỗ trợ

Là quản trị viên, bạn cũng có quyền xem và giám sát toàn bộ các yêu cầu của sinh viên:

- Truy cập menu **Yêu cầu dịch vụ** (`/dashboard/service-requests`) để xem danh sách các yêu cầu hỗ trợ. Bạn có thể thay đổi trạng thái yêu cầu, phân công cho nhân viên phụ trách, hoặc trực tiếp trả lời.
- Truy cập menu **Cảnh báo học vụ** (`/dashboard/academic-risks`) để xem các sinh viên đang trong diện bị cảnh cáo (do kết quả học tập kém, điểm danh vắng nhiều). Hệ thống có phân loại theo mức độ (Low, Medium, High, Critical). Admin có thể đánh dấu là đã giải quyết (Resolve) hoặc bỏ qua (Dismiss).

## 5. Thống kê Báo cáo (Analytics)

- Truy cập menu **Thống kê** (`/dashboard/analytics`).
- Xem các biểu đồ về số lượng sinh viên đang theo học, số giảng viên, môn học và số lớp học phần đang mở. Admin có cái nhìn bao quát về cả khía cạnh Đào tạo lẫn Tài chính.

## 6. Lỗi thường gặp

- **Lỗi 403 Forbidden**: Do token hết hạn hoặc tài khoản bị thay đổi quyền. Vui lòng thử đăng xuất và đăng nhập lại.
- **Không tìm thấy dữ liệu**: Hãy kiểm tra lại bộ lọc tìm kiếm hoặc trạng thái (ví dụ: dữ liệu đã bị xóa mềm chỉ hiển thị khi lọc trạng thái "DELETED").

## 7. Đăng xuất

- Nhấn vào Avatar ở góc trên cùng bên phải màn hình.
- Chọn **Đăng xuất (Log out)**. Dữ liệu session sẽ được xóa an toàn.
