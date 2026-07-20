# Từ điển Dữ liệu (Data Dictionary) - EduConnect

Tài liệu này giải thích các Table chính trong cơ sở dữ liệu Prisma của dự án.

## 1. Module Access Control (Phân quyền)

- **User**: Bảng lưu danh tính gốc.
  - `email` (Unique): Định danh đăng nhập.
  - `passwordHash`: Mật khẩu mã hóa bcrypt.
  - `status`: Trạng thái User (ACTIVE, INACTIVE, DELETED).
- **Role**: Bảng định nghĩa vai trò (Admin, Student...).
- **Permission**: Bảng định nghĩa các quyền chi tiết (vd: `student.read`).
- **UserRole / RolePermission**: Bảng join n-n.

## 2. Module Academic (Học vụ)

- **Student**: Hồ sơ sinh viên.
  - `studentCode` (Unique, Indexed): Mã SV (VD: SV2025001).
  - Liên kết với `userId` và `departmentId`.
- **Lecturer**: Hồ sơ giảng viên.
  - `lecturerCode` (Unique).
- **Department**: Khoa, phòng ban.
- **AcademicYear / Semester**: Năm học và Học kỳ.
  - Cần đảm bảo logic logic không thể có 2 Học kỳ cùng "IN_PROGRESS".
- **Course**: Môn học chuẩn.
  - `credits`: Số tín chỉ (Dùng để tính tiền học phí sau này).
- **ClassSection**: Lớp học phần được mở trong 1 học kỳ.
  - `status`: OPEN, IN_PROGRESS, COMPLETED.
- **Enrollment**: Đăng ký môn học của Sinh viên.
- **Grade**: Điểm chi tiết.
  - Chứa `midtermScore`, `finalScore`, `finalScore10`, `finalScore4`.

## 3. Module Exam (Khảo thí)

- **Question**: Câu hỏi gốc trong Ngân hàng.
  - `type`: SINGLE_CHOICE, MULTIPLE_CHOICE, TRUE_FALSE.
  - `difficulty`: EASY, MEDIUM, HARD.
- **QuestionOption**: Đáp án của một câu hỏi.
  - `isCorrect` (Boolean): Đánh dấu đáp án đúng. _(Dữ liệu nhạy cảm, không được leak ra API cho sinh viên chưa thi)._
- **Exam**: Kỳ thi.
  - `startsAt`, `endsAt`: Khung giờ mở kỳ thi.
  - `durationMinutes`: Thời gian đếm ngược.
- **ExamQuestion**: Cấu trúc đề thi (Link giữa Exam và Question).
- **ExamAttempt**: Lượt thi của Sinh viên.
  - `questionSnapshot`: JSONB chứa bản lưu của nội dung câu hỏi lúc làm bài, đề phòng câu hỏi gốc bị sửa.
  - `score`: Điểm đạt được tự động chấm.

## 4. Module Finance (Tài chính)

- **TuitionRate**: Định mức học phí.
  - `amountPerCredit`: Số tiền 1 tín chỉ.
- **Invoice**: Hóa đơn học phí sinh viên.
  - `totalAmount`: Tổng tiền.
  - `balanceAmount`: Tiền còn nợ. Bằng 0 khi đã thanh toán hết.
  - `status`: UNPAID, PARTIAL, PAID.
- **Receipt**: Biên lai, sinh ra khi Invoice có thanh toán.
- **PaymentTransaction**: Bảng lưu vết các GD từ Payment Gateway.

## 5. Các lưu ý chung

- Tất cả các bảng (trừ bảng join thuần) đều có `id` kiểu UUID (`String` với mặc định `uuid()`).
- Có `createdAt` và `updatedAt`.
- Mọi quan hệ đều được xử lý Referencing qua mức DB Engine (Foreign Keys thực trong PostgreSQL).
- Các trường chứa tiền (`amount`, `balanceAmount`, `totalAmount`) đang sử dụng kiểu `Decimal` để tránh sai số khi tính toán thập phân (Floating point issues).
