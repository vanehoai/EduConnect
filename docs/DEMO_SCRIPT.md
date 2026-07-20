# Kịch bản Demo Hệ thống EduConnect (10 - 15 phút)

Kịch bản này được thiết kế để trình bày đồ án môn học hoặc bảo vệ tốt nghiệp, nhằm show ra toàn bộ các phân hệ chính của EduConnect một cách mạch lạc.

## 1. Chuẩn bị (Trước khi Demo)

- Đảm bảo hệ thống đang chạy (cả API và Web) trên máy local hoặc staging.
- Mở sẵn 3 trình duyệt (hoặc 3 cửa sổ Ẩn danh):
  1. Trình duyệt 1: Đăng nhập sẵn bằng tài khoản Admin (`admin@school.local`).
  2. Trình duyệt 2: Đăng nhập sẵn bằng tài khoản Giảng viên (`lecturer@school.local`).
  3. Trình duyệt 3: Đăng nhập sẵn bằng tài khoản Sinh viên (`student@school.local`).

## 2. Phần 1: Giới thiệu Kiến trúc & Tổng quan (2 phút)

- **Người trình bày**: Chào Hội đồng. Nhóm xin trình bày demo hệ thống EduConnect - Hệ thống quản lý trường học đa phân hệ (Monorepo).
- **Thao tác**: Mở màn hình Admin (Trình duyệt 1).
- **Trình bày**:
  - Hệ thống sử dụng NestJS (Backend), Next.js (Frontend), PostgreSQL và Redis.
  - Từ Dashboard Admin, ta thấy tổng quan hệ thống: số lượng người dùng, biểu đồ Analytics (chuyển sang tab `/dashboard/analytics`).
  - Điểm mạnh của hệ thống là RBAC linh hoạt (chỉ Admin mới thấy được toàn bộ các tính năng bên thanh menu trái).

## 3. Phần 2: Quản lý Đào tạo & Giảng viên (3 phút)

- **Thao tác**: Chuyển sang màn hình Giảng viên (Trình duyệt 2).
- **Trình bày**:
  - Giảng viên thấy được lịch dạy và lớp học phần mình đang phụ trách.
  - Tiến hành thao tác **Điểm danh**: Vào `/dashboard/attendance`, tích vắng một vài sinh viên và lưu lại.
  - Tiến hành thao tác **Nhập điểm**: Vào `/dashboard/grades`, nhập thử điểm Giữa kỳ / Cuối kỳ. Hệ thống tự động tính ra điểm hệ 10 và hệ 4 (A, B, C...).
  - Giải thích việc sau khi giảng viên "Công bố", sinh viên mới có thể xem.

## 4. Phần 3: Trải nghiệm của Sinh viên & Tài chính (3 phút)

- **Thao tác**: Chuyển sang màn hình Sinh viên (Trình duyệt 3).
- **Trình bày**:
  - Sinh viên xem được Điểm số vừa được Giảng viên công bố tại `/dashboard/student/academic-results`.
  - Giới thiệu **Module Tài chính**: Vào `/dashboard/student/finance`.
  - Hiển thị công nợ học phí. Demo luồng thanh toán: Nhấn nút "Thanh toán", hiển thị popup điền thẻ mô phỏng. Bấm Submit.
  - Sau khi Submit, trạng thái Hóa đơn tự động chuyển thành "Đã thanh toán" (PAID), và ở tab Phiếu thu sinh ra một Receipt mới. Hệ thống xử lý Transaction an toàn.

## 5. Phần 4: Thi trực tuyến - Online Exam (4 phút)

- **Thao tác**: Trở lại màn hình Giảng viên (Trình duyệt 2), sau đó chuyển qua Sinh viên (Trình duyệt 3).
- **Trình bày**:
  - **Giảng viên**: Vào `/dashboard/question-bank` tạo 1-2 câu hỏi mới. Sau đó vào `/dashboard/exams`, tạo 1 bài thi mới (hoặc dùng bài thi đang Mở sẵn), set Thời gian thi.
  - **Sinh viên**: Vào `/dashboard/student/exams`. Nhấn "Làm bài".
  - **Thực hành làm bài**: Giao diện chia đôi màn hình. Đồng hồ đếm ngược được khóa với Server (Tránh cheat thời gian phía Client).
  - Chọn đáp án ngẫu nhiên. Trình bày tính năng **Auto-save**: Cứ tick chọn là có chữ "Đã lưu" nhỏ hiện lên (Lưu ý: refresh trang F5, đáp án vẫn còn).
  - Nhấn Nộp bài. Màn hình báo nộp thành công và hiển thị kết quả nếu giảng viên cho phép.

## 6. Phần 5: Tính năng bổ trợ & Kết luận (2-3 phút)

- **Thao tác**: Trình duyệt 1 (Admin/Phòng đào tạo) và Trình duyệt 3 (Sinh viên).
- **Trình bày**:
  - Tính năng **Thông báo (Announcements)**: Phòng đào tạo gửi thông báo khẩn, Sinh viên nhận được ngay.
  - Tính năng **Yêu cầu hỗ trợ (Service Requests)**: Sinh viên tạo request "Xin cấp bảng điểm". Admin nhìn thấy ở tab `/dashboard/service-requests`, nhấn "Resolve" và gửi tin nhắn lại cho sinh viên.
- **Kết luận**:
  - Hệ thống đáp ứng toàn vẹn chuỗi quy trình từ Đào tạo - Học phí - Thi cử - Chăm sóc sinh viên.
  - Cảm ơn Hội đồng đã theo dõi. Nhóm sẵn sàng trả lời câu hỏi phản biện.
