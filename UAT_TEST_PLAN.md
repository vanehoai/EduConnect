# Kế Hoạch Kiểm Thử UAT (User Acceptance Testing)

## 1. Giới thiệu

Tài liệu này mô tả kế hoạch kiểm thử UAT cho hệ thống EduConnect (Phase 10), đảm bảo hệ thống đáp ứng đúng yêu cầu của người dùng trước khi triển khai chính thức.

## 2. Các Vai Trò (Roles) Tham Gia

- **ADMIN**: Quản trị viên hệ thống.
- **LECTURER**: Giảng viên.
- **STUDENT**: Sinh viên.

## 3. Tài Khoản Mẫu (Không chứa mật khẩu thật)

- Admin: `admin_uat@educonnect.com`
- Lecturer: `lecturer_uat@educonnect.com`
- Student: `student_uat@educonnect.com`

## 4. Phạm vi kiểm thử (In-Scope)

- Đăng nhập/Đăng xuất/Quên mật khẩu.
- Phân quyền theo vai trò.
- Quản lý khóa học (Lecturer tạo, Admin duyệt, Student đăng ký).
- Tương tác hệ thống, theo dõi tiến độ.
- Hệ thống thông báo.

## 5. Quy trình thực hiện

1. Chuẩn bị môi trường UAT với dữ liệu mẫu.
2. Cấp tài khoản cho nhóm người dùng thử nghiệm.
3. Người dùng thực hiện các kịch bản kiểm thử (Test Cases).
4. Ghi nhận lỗi và phản hồi.
5. Sửa lỗi và kiểm thử lại.
6. Ký nghiệm thu (Sign-off).
