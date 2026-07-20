# Lịch sử Database Migration (Prisma)

EduConnect sử dụng Prisma Migrate để quản lý việc thay đổi Database Schema. Dưới đây là danh sách các folder migration trong thư mục `apps/api/prisma/migrations` theo đúng trình tự thời gian.

_Ghi chú: Nguyên tắc của Prisma Migrate là TUYỆT ĐỐI KHÔNG sửa các file SQL trong folder migration cũ đã được apply (sẽ gây lỗi checksum). Nếu muốn sửa DB, phải tạo file migration mới (`prisma migrate dev`)._

## Phase 1 -> Phase 4

- `20250720_init_auth_core`: Khởi tạo hệ thống (Users, Roles, Permissions). Cấu trúc các bảng cốt lõi (Khoa, Sinh viên, Giảng viên).
- `20250721_academic_core`: Tạo các bảng AcademicYear, Semester, Course, ClassSection, Enrollment, Schedule.
- `20250722_exams_questions`: Tạo bảng Ngân hàng câu hỏi (Questions, QuestionOptions) và cấu trúc Kỳ thi trực tuyến (Exams, ExamQuestions). Bổ sung ExamAttempts lưu kết quả.

## Phase 5 -> Phase 10

- `20250725_finance_module`: Thêm bảng TuitionRate, FeeType, Scholarships, Invoice, Receipt, PaymentTransaction. Cấu hình kiểu dữ liệu `Decimal` cho tiền tệ.
- `20250728_communication_module`: Bổ sung bảng Announcements (Thông báo), Notifications (Thông báo In-app).
- `20250729_support_services`: Thêm ServiceRequests (Yêu cầu hỗ trợ) và AcademicRisks (Cảnh báo học vụ).
- Các đợt migration nhỏ sau đó thường được sinh ra do sửa/xóa các constraints hoặc đổi kiểu field (ví dụ: bổ sung enum `QuestionType`, `PaymentStatus`...).

## Phase 11

- `20250801_production_ready`: Thêm Indexes cho các trường tìm kiếm thường xuyên (`studentCode`, `lecturerCode`, `invoiceCode`). Thiết lập các field phục vụ báo cáo.

## Hướng dẫn Rollback

Trong trường hợp một Migration bị lỗi trên Production:

1. Đánh dấu migration đó là failed: `npx prisma migrate resolve --rolled-back "tên_migration"`
2. Sửa schema.prisma.
3. Chạy lại migrate dev để tạo một migration sửa sai.
4. Deploy lại.
   _(Prisma không hỗ trợ down-migrations (revert schema) một cách tự động ra lệnh SQL, bạn phải viết migration mới để lùi cấu trúc, hoặc restore DB từ Backup)._
