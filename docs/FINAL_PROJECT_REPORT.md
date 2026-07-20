# BÁO CÁO ĐỒ ÁN: HỆ THỐNG QUẢN LÝ TRƯỜNG HỌC TÍCH HỢP (EDUCONNECT)

## 1. Giới thiệu

EduConnect là một giải pháp quản lý trường học toàn diện (SaaS) được phát triển nhằm mục đích số hóa và tự động hóa các quy trình hành chính, đào tạo, và tài chính tại các cơ sở giáo dục đại học, cao đẳng.

## 2. Lý do chọn đề tài

Thực tế hiện nay, nhiều trường học đang sử dụng các hệ thống rời rạc cho từng phòng ban (phần mềm riêng cho đào tạo, phần mềm riêng cho tài chính, phần mềm thi riêng biệt). Điều này dẫn đến khó khăn trong việc đồng bộ dữ liệu, trải nghiệm người dùng kém (sinh viên phải nhớ nhiều tài khoản), và chi phí bảo trì cao. Đề tài này ra đời để giải quyết các "pain points" đó bằng một kiến trúc hiện đại, tập trung.

## 3. Mục tiêu

- **Mục tiêu hệ thống**: Xây dựng một nền tảng (Single Source of Truth) kết nối mọi hoạt động nhà trường.
- **Mục tiêu kỹ thuật**: Ứng dụng các công nghệ hiện đại nhất (Next.js App Router, NestJS, Prisma, Monorepo) để đạt hiệu năng cao và dễ dàng mở rộng.
- **Mục tiêu UI/UX**: Mang lại trải nghiệm thân thiện, responsive, thiết kế chuẩn Modern Education SaaS.

## 4. Phạm vi

Dự án bao phủ 4 phân hệ (module) chính:

- Core Academic (Quản lý đào tạo, Sinh viên, Điểm số, Lịch học).
- Examination (Ngân hàng câu hỏi, Tổ chức thi trắc nghiệm trực tuyến).
- Finance (Quản lý học phí, Hóa đơn, Thanh toán).
- Communication (Quản lý thông báo, Xử lý yêu cầu sinh viên, Cảnh báo học vụ).

## 5. Phân tích yêu cầu

- **Yêu cầu chức năng**: Xem chi tiết ở phần mô tả các module.
- **Yêu cầu phi chức năng**:
  - Bảo mật: RBAC, mã hóa JWT, chống tấn công phổ biến.
  - Hiệu năng: Phản hồi API dưới 300ms, hỗ trợ nhiều luồng thi đồng thời (Auto-save).
  - Khả dụng: Container hóa với Docker, dễ dàng triển khai.

## 6. Kiến trúc hệ thống

Hệ thống sử dụng mô hình Client-Server với cấu trúc Monorepo (quản lý bởi Turborepo):

- **Frontend**: Next.js 14, Tailwind CSS, Shadcn UI.
- **Backend**: NestJS, TypeScript.
- Cả 2 chia sẻ chung TypeScript Types và định nghĩa API hợp đồng.

## 7. Thiết kế database

Sử dụng PostgreSQL và Prisma ORM. Thiết kế chú trọng tính toàn vẹn (tham chiếu foreign key), đảm bảo truy xuất nhanh và sử dụng Soft-Delete cho các bảng dữ liệu gốc. (Xem chi tiết tại `DATABASE.md`).

## 8. Công nghệ sử dụng

- **Ngôn ngữ**: TypeScript
- **Backend Framework**: NestJS
- **Frontend Framework**: Next.js
- **Database**: PostgreSQL, Redis
- **DevOps**: Docker, Docker Compose, GitHub Actions (CI/CD mô phỏng), Playwright (E2E).

## 9. Các module đã xây dựng

- **Phân hệ Đào tạo**: Sinh viên, Giảng viên, Khoa, Môn học, Lớp học phần, Đăng ký học, Điểm danh, Chấm điểm.
- **Phân hệ Khảo thí**: Quản lý bộ câu hỏi, Đề thi, Làm bài online, Tính điểm tự động.
- **Phân hệ Tài chính**: Định mức phí, Hóa đơn, Biên lai thu tiền, Khấu trừ học bổng.
- **Phân hệ Hỗ trợ**: Thông báo, Yêu cầu dịch vụ sinh viên, Cảnh báo học vụ.

## 10. Bảo mật

Áp dụng băm mật khẩu (`bcrypt`), xác thực JWT tĩnh, kiểm tra quyền (RBAC) linh hoạt bằng Database Permissions, và kiểm tra Ownership nghiêm ngặt (Data-level security).

## 11. Kiểm thử

- **Unit/Integration Tests**: 167 bài kiểm thử được viết và vượt qua hoàn toàn.
- **E2E Tests**: 3 luồng kiểm thử chính với Playwright hoạt động trơn tru.
- **Performance**: Phản hồi trung bình API đạt 245ms.

## 12. Triển khai

Đóng gói hoàn toàn bằng Docker. Chạy production thông qua `docker-compose.production.yml`. Quá trình Migration Database được tự động hóa.

## 13. Kết quả đạt được

- Hoàn thành đầy đủ 100% các chức năng như kế hoạch (12 Phases).
- Hệ thống chạy mượt mà, UI đẹp mắt, tính ổn định cao.
- Bộ tài liệu bàn giao đầy đủ (Architecture, API, User Guides, Test Report).

## 14. Hạn chế

- Cổng thanh toán (Payment Gateway) mới ở mức giả lập.
- Email/SMS chưa được gắn với dịch vụ ngoài.
- Ứng dụng chưa được scale lên môi trường Kubernetes đa node.

## 15. Hướng phát triển

- Tích hợp ZaloPay/MoMo Webhooks.
- Thêm Mobile App sử dụng React Native (tái sử dụng chung NestJS API).
- Sử dụng AI để phân tích phổ điểm, cảnh báo rủi ro tự động.

## 16. Kết luận

Dự án EduConnect đã đáp ứng tốt các mục tiêu đề ra về một hệ thống Quản lý trường học SaaS hiện đại. Đây là nền tảng vững chắc để tiếp tục mở rộng quy mô.
