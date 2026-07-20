# Đề cương Thuyết trình Bảo vệ Đồ án (EduConnect)

**Thời lượng dự kiến**: 12 - 15 phút.
**Số lượng thành viên**: 5 sinh viên.
**Nguyên tắc**: Slide ít chữ, dùng sơ đồ hình ảnh (Mermaid), tập trung vào các key selling points của dự án.

---

## Thành viên 1: Đặt vấn đề & Phân tích yêu cầu (2-3 phút)

**Slide 1: Tiêu đề & Giới thiệu Nhóm**

- Tên đề tài: Hệ thống Quản lý Trường học Tích hợp (EduConnect).
- Tên các thành viên & Giảng viên hướng dẫn.

**Slide 2: Đặt vấn đề (Pain Points)**

- Các trường học hiện tại thường dùng nhiều phần mềm rời rạc (1 cái xếp thời khóa biểu, 1 cái đóng học phí, 1 cái thi trắc nghiệm).
- Gây khó khăn cho việc đồng bộ dữ liệu, rủi ro bảo mật và trải nghiệm kém cho sinh viên.

**Slide 3: Mục tiêu Dự án**

- Xây dựng 1 giải pháp SaaS tích hợp: Đào tạo, Tài chính, Thi trực tuyến, Hỗ trợ sinh viên.
- Tất cả quy về một nền tảng (Single source of truth) với trải nghiệm người dùng (UI/UX) hiện đại, thống nhất.

---

## Thành viên 2: Kiến trúc Hệ thống & Cơ sở dữ liệu (3 phút)

**Slide 4: Sơ đồ Kiến trúc Tổng quan**

- Giới thiệu mô hình Monorepo (Turborepo).
- Frontend: Next.js (Server & Client Components) tối ưu SEO và tốc độ.
- Backend: NestJS (REST API) mạnh mẽ, kiến trúc DDD.
- CSDL: PostgreSQL & Redis.

**Slide 5: Phân quyền động (Dynamic RBAC)**

- Hệ thống không fix cứng Role trong Code.
- Sử dụng bảng Permission mapping qua Role. Đảm bảo bảo mật nhiều tầng: API Guards, Ownership Check.

**Slide 6: Thiết kế CSDL (ER Diagram)**

- Nhấn mạnh các Domain: Người dùng, Môn học/Lớp, Thi cử, Tài chính.
- Sử dụng Soft-delete để bảo toàn toàn vẹn dữ liệu.

---

## Thành viên 3: Module Đào tạo & Thi Trực tuyến (3 phút)

**Slide 7: Luồng Đào tạo (Core Academic Flow)**

- Quản lý từ Khoa -> Môn học -> Lớp học phần -> Gán Giảng viên -> Điểm danh -> Nhập điểm.

**Slide 8: Kiến trúc Thi trực tuyến (Online Exam)**

- Tính năng Auto-save siêu nhanh nhờ debounce và transactions.
- Đồng bộ thời gian thi qua Server (Client không thể cheat đồng hồ).
- Chống xem trộm đáp án (Server không gửi correct answer về Frontend nếu chưa nộp bài).

**Slide 9: Snapshot Dữ liệu thi**

- Lưu lại Snapshot nội dung câu hỏi lúc sinh viên thi, đề phòng sau này Giảng viên sửa câu hỏi làm sai lệch kết quả lịch sử.

---

## Thành viên 4: Module Tài chính & Tiện ích (3 phút)

**Slide 10: Luồng Tài chính (Finance Flow)**

- Hệ thống tự sinh Hóa đơn (Invoice) dựa trên Số tín chỉ môn học x Định mức học phí.
- Hỗ trợ khấu trừ Học bổng (Percentage hoặc Amount).
- Tự động sinh Phiếu thu (Receipt) khi thanh toán.

**Slide 11: Tiện ích Sinh viên**

- Cảnh báo học vụ (Academic Risks): Tự động hoặc thủ công.
- Yêu cầu dịch vụ (Service Requests): Workflow xử lý đơn từ hành chính.

---

## Thành viên 5: Quản trị, DevOps & Kết luận (3 phút)

**Slide 12: Đảm bảo Chất lượng (Quality Assurance)**

- Unit Tests: 167/167 tests passed (Coverage quan trọng các logic tính điểm, tính tiền).
- E2E Tests (Playwright) & Type-safe hoàn toàn từ DB lên UI (Prisma -> DTO -> React).

**Slide 13: CI/CD & Triển khai Docker**

- Trình bày file `docker-compose.production.yml`.
- Quy trình tự build image, tự chạy Prisma Migration khi deploy.

**Slide 14: Hạn chế & Hướng phát triển**

- Hạn chế: Chưa tích hợp Payment Gateway thật (như VNPay, MoMo), mới chỉ là mock.
- Tương lai: Thêm Microservices cho luồng gửi Email/SMS, tích hợp AI phân tích phổ điểm.

**Slide 15: Kết luận & Q&A**

- Chốt lại thành quả đạt được.
- Cảm ơn và nhường lời cho Hội đồng đặt câu hỏi.
