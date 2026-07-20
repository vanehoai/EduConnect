# Hướng dẫn sử dụng: Phòng tài chính (Finance Staff)

## 1. Đăng nhập

- Truy cập vào trang chủ. Điền thông tin đăng nhập:
  - **Email**: `finance@school.local`
  - **Mật khẩu**: `Password@123`
- Nhấn "Đăng nhập". Hệ thống điều hướng bạn vào Dashboard dành cho Phòng tài chính.

## 2. Quản lý Danh mục (Catalogs)

- **Loại học phí (`/dashboard/finance/fee-types`)**: Quản lý các loại phí (Học phí cơ bản, Phí dịch vụ, Tiền phạt...).
- **Định mức học phí (`/dashboard/finance/tuition-rates`)**: Định giá tín chỉ áp dụng cho từng Khoa và từng Năm học (VD: 650.000đ/tín chỉ).
- **Học bổng & Miễn giảm (`/dashboard/finance/scholarships`)**: Khai báo các loại học bổng (theo % hoặc số tiền cố định).

## 3. Quản lý Hóa đơn & Thu tiền

- **Hóa đơn (`/dashboard/finance/invoices`)**:
  - Xem danh sách hóa đơn của tất cả sinh viên.
  - Hệ thống tự động tạo hóa đơn dựa trên số tín chỉ sinh viên đăng ký học và định mức đã khai báo.
  - Theo dõi trạng thái hóa đơn (UNPAID, PARTIAL, PAID).
- **Phiếu thu (`/dashboard/finance/receipts`)**:
  - Biên lai thu tiền tự động phát sinh khi sinh viên thanh toán.
  - Bạn có thể xem chi tiết thời gian thanh toán, phương thức (Chuyển khoản, Tiền mặt) và số tiền đã đóng.

## 4. Thao tác chính

- **Cập nhật trạng thái thủ công**: Trong một số trường hợp sinh viên đóng tiền mặt tại phòng tài vụ, nhân viên có quyền ghi nhận thanh toán thủ công.
- **Áp dụng học bổng**: Giảm trừ số tiền nợ trên hóa đơn nếu sinh viên thuộc diện chính sách.

## 5. Lỗi thường gặp

- **Hóa đơn tính sai tiền**: Kiểm tra lại xem sinh viên có đăng ký thêm môn sau khi hóa đơn đã phát hành hay không. Hoặc định mức (`TuitionRate`) cho Khoa/Khóa của sinh viên chưa được cấu hình.
- **Không thấy lịch sử thanh toán**: Lịch sử chỉ hiển thị nếu giao dịch (PaymentTransaction) chuyển sang trạng thái SUCCESS.

## 6. Đăng xuất

- Nhấn vào Avatar góc trên cùng bên phải.
- Chọn **Đăng xuất (Log out)**.
