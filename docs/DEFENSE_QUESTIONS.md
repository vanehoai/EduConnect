# Bộ Câu Hỏi Bảo Vệ Đồ Án (Defense Questions)

Dưới đây là 30+ câu hỏi thường gặp từ Hội đồng phản biện và gợi ý trả lời dành cho dự án EduConnect.

## I. Kiến trúc & Công nghệ (Architecture & Technologies)

**Q1: Tại sao nhóm lại chọn kiến trúc Monorepo thay vì chia repo Backend và Frontend riêng?**

> **Trả lời:** Monorepo giúp nhóm tái sử dụng code (shared types, DTOs) giữa Frontend (Next.js) và Backend (NestJS) rất dễ dàng. Khi database schema (Prisma) thay đổi, Type Error sẽ hiển thị ngay lập tức ở cả 2 nơi, giúp giảm thiểu rủi ro khi deploy. Tool Turborepo giúp quản lý build cache hiệu quả.

**Q2: Tại sao chọn NestJS cho Backend mà không phải Express thuần?**

> **Trả lời:** NestJS cung cấp một kiến trúc chuẩn (Angular-like) với Dependency Injection (DI), giúp code dễ test, dễ scale và làm việc nhóm tốt hơn. NestJS cũng tích hợp sẵn với TypeScript, Decorators, Guards, và Interceptors phù hợp cho một dự án phức tạp.

**Q3: Phân biệt Server Components và Client Components trong Next.js (App Router)?**

> **Trả lời:** Server Components được render 1 lần trên server, giảm dung lượng JS gửi xuống client và rất tốt cho SEO/Security. Client Components (có `'use client'`) được dùng khi cần tương tác (như hooks `useState`, `onClick`). Trong dự án, nhóm cố gắng đẩy việc fetch dữ liệu tĩnh lên Server Components, và chỉ dùng Client Components cho các form/dashboard cần tương tác thực.

**Q4: Vai trò của Redis trong hệ thống là gì? Nếu Redis chết, hệ thống có sập không?**

> **Trả lời:** Nhóm dùng Redis để caching (giảm tải DB) hoặc làm Message Broker (BullMQ). Nếu kiến trúc được thiết kế chuẩn (Graceful Degradation), khi Redis chết, hệ thống có thể fallback về việc query trực tiếp DB, hệ thống sẽ chậm đi chứ không sập.

## II. Database & Prisma (Cơ sở dữ liệu)

**Q5: Tại sao lại dùng Soft Delete thay vì Hard Delete? Cách triển khai trong Prisma?**

> **Trả lời:** EduConnect là phần mềm nghiệp vụ (ERP/SaaS), việc Hard Delete sẽ phá vỡ toàn vẹn dữ liệu (ví dụ xóa Khoa sẽ làm mất dữ liệu sinh viên của khoa đó). Nhóm dùng Soft Delete (thêm trường `status = DELETED`). Khi query, ta phải luôn chèn thêm điều kiện `where: { status: { not: 'DELETED' } }`.

**Q6: Làm sao để giải quyết bài toán N+1 query khi hiển thị danh sách sinh viên kèm Khoa và Lớp?**

> **Trả lời:** Trong Prisma, ta dùng tính năng `include` để join các bảng liên quan. Prisma engine dưới background bằng Rust sẽ tối ưu hóa việc query bằng cách sử dụng `JOIN` hoặc gộp ID query, giải quyết triệt để N+1 query so với việc loop và fetch thủ công.

**Q7: Nếu 2 sinh viên cùng thanh toán 1 hóa đơn cùng lúc (Concurrency), làm sao để không bị trừ tiền 2 lần?**

> **Trả lời:** Cần sử dụng Database Transaction. Khi thanh toán, ta dùng `prisma.$transaction`. Nếu nghiêm ngặt hơn, ta phải khóa row hóa đơn bằng (Pessimistic Locking `SELECT ... FOR UPDATE`) để request thứ 2 phải chờ request 1 xử lý xong, hoặc sử dụng Optimistic Locking (dựa vào version/updatedAt).

**Q8: Tại sao lại cần lưu Snapshot câu hỏi trong bảng ExamAttempt thay vì join sang bảng Question?**

> **Trả lời:** Để đảm bảo tính toàn vẹn lịch sử. Nếu giảng viên sửa nội dung câu hỏi sau khi thi xong, nếu dùng JOIN thì kết quả bài làm cũ của sinh viên sẽ hiển thị nội dung mới (sai lệch). Snapshot giữ lại bản sao câu hỏi tại đúng thời điểm thi.

## III. Authentication & Authorization (Bảo mật)

**Q9: RBAC (Role-based access control) trong dự án được triển khai như thế nào?**

> **Trả lời:** Không hard-code Role. Hệ thống có bảng Permission và RolePermission. Khi đăng nhập, backend fetch tất cả Permission của User đó và nhúng vào JWT Token. Sử dụng NestJS Guard `@RequirePermissions('exam.read')` để check request.

**Q10: JWT có nhược điểm gì so với Session? Nhóm khắc phục bằng cách nào?**

> **Trả lời:** JWT không thể bị thu hồi (revoke) ngay lập tức trước khi hết hạn (trừ khi dùng Token Blacklist trên Redis). Nhóm khắc phục bằng cách để thời gian sống (expiration) của Access Token ngắn (vd: 15-30 phút), và dùng Refresh Token lưu ở HttpOnly Cookie để cấp mới.

**Q11: CORS là gì? Nhóm cấu hình CORS như thế nào?**

> **Trả lời:** Cross-Origin Resource Sharing. Nó ngăn các domain độc hại gọi API của hệ thống. Nhóm cấu hình trong `main.ts` của NestJS để chỉ cho phép các origin tin cậy (như domain của Frontend) được phép request.

**Q12: Dữ liệu mật khẩu được lưu trữ ra sao?**

> **Trả lời:** Mật khẩu được băm (hashing) bằng `bcryptjs` với salt rounds = 12 trước khi lưu vào DB. Ngay cả DBA cũng không thể biết mật khẩu gốc. Khi login, server dùng `bcrypt.compare` để đối chiếu.

## IV. Kiểm thử & Quality Assurance (Testing)

**Q13: Unit Test khác Integration Test như thế nào trong bối cảnh dự án này?**

> **Trả lời:**
>
> - Unit Test: Test độc lập 1 hàm hoặc 1 Class (VD: Test `ExamsService`). Ta sẽ Mock PrismaService để không đụng vào DB thật. Tốc độ chạy rất nhanh.
> - Integration Test: Test sự phối hợp, ví dụ gọi API qua Route -> Controller -> Service -> gọi DB thật (nhưng là test DB). Mất thời gian setup hơn nhưng đảm bảo thực tế.

**Q14: Playwright E2E test hoạt động ra sao?**

> **Trả lời:** Mở một trình duyệt ảo (Headless browser), thao tác click, gõ text y hệt user thật, và assert DOM xem màn hình có hiển thị đúng như mong đợi không. Nó bao phủ toàn bộ stack từ FE xuống DB.

## V. Docker & CI/CD

**Q15: Lợi ích của việc Dockerize Next.js và NestJS?**

> **Trả lời:** "It works on my machine". Docker đóng gói code và môi trường (Node.js version, OS dependencies) vào 1 image duy nhất. Đảm bảo chạy ở máy Dev thế nào thì lên Production Server (Linux) sẽ chạy y hệt như vậy.

**Q16: Khi thay đổi Schema Prisma, làm sao update DB trên Server qua Docker?**

> **Trả lời:** Trong CI/CD script, ta sẽ chạy lệnh `npx prisma migrate deploy` trước khi (hoặc trong khi) khởi động container API mới. Nó sẽ tự động apply các file migration SQL chưa được chạy vào DB.

## VI. Câu hỏi Vận hành & Thực tế

**Q17: Auto-save bài thi trắc nghiệm hoạt động thế nào để không sập server khi có 1000 SV cùng thi?**

> **Trả lời:** Nếu mỗi click gọi 1 API thì sẽ sập. Ta phải dùng kỹ thuật **Debounce** ở Frontend (gom các click lại, 2-3s mới gọi API 1 lần). Ở Backend, API này phải rất nhẹ, bỏ qua các bước validation rườm rà, và lý tưởng là ghi tạm vào Redis trước khi đồng bộ xuống PostgreSQL (Write-behind).

**Q18: Điểm yếu nhất của hệ thống hiện tại là gì?**

> **Trả lời:** (Dựa vào Known Limitations) Chưa tích hợp Payment Gateway thật (như VNPay), hiện mới chỉ lưu transaction giả lập. Nếu đưa vào thực tế cần kết nối Webhook. Thứ hai là phần Notification hiện tại mới push vào DB, chưa gửi qua Email hay SMS thật sự qua các dịch vụ như SendGrid/Twilio.
