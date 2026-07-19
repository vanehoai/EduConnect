# EduConnect – Integrated School Management System

EduConnect là nền tảng quản lý trường học tích hợp ba nhóm nghiệp vụ: quản lý đào tạo, thi trắc nghiệm trực tuyến và quản lý học phí/thanh toán. Repository được tổ chức theo **modular monolith** để MVP dễ vận hành nhưng vẫn có ranh giới module rõ ràng cho các giai đoạn tiếp theo.

## Trạng thái hiện tại

Giai đoạn 1 đã cung cấp nền tảng chạy được gồm:

- Monorepo npm workspaces với NestJS API, Next.js App Router và shared types.
- PostgreSQL, Redis, API và Web qua Docker Compose.
- Prisma schema đầy đủ cho xác thực/RBAC, đào tạo, thi, học phí, thanh toán, thông báo và audit log.
- Migration ban đầu và seed dữ liệu phát triển có thể chạy lặp lại.
- Health API, chuẩn response chung, validation toàn cục, exception filter và Swagger.
- Giao diện khởi đầu responsive bằng Tailwind CSS và các component theo nền tảng Shadcn UI.

Giai đoạn 2 đã bổ sung Authentication, Authorization, RBAC và Permissions:

- Đăng nhập, refresh token rotation, logout, logout all, thông tin hiện tại và đổi mật khẩu.
- Access/refresh JWT chỉ lưu trong HttpOnly cookie; database chỉ lưu hash của refresh token.
- CSRF double-submit cookie, rate limit đăng nhập, khóa tạm tài khoản, login history và audit log.
- Global JWT/role/permission guards cùng các decorator @Public(), @Roles(), @Permissions() và @CurrentUser().
- API quản trị tài khoản, vai trò và quyền dành cho ADMIN.
- Trang /login, /dashboard, /forbidden, middleware bảo vệ route và menu theo vai trò.

Giai đoạn 3 (3A, 3B, 3C, 3D) hiện đã hoàn thành. Hệ thống bao gồm quản lý đào tạo, lớp học phần, lịch học, đăng ký môn học, điểm danh và quản lý điểm số, GPA (CPA). Đã vượt qua kiểm thử tự động và kiểm tra tích hợp được liệt kê.

## Xác thực và bảo mật cookie

EduConnect dùng một phương án nhất quán cho browser:

- Access token ngắn hạn nằm trong cookie **educonnect_access** có HttpOnly.
- Refresh token dài hạn nằm trong cookie **educonnect_refresh** có HttpOnly, được rotation sau mỗi lần refresh; token cũ bị thu hồi và reuse sẽ thu hồi cả token family.
- Cookie **educonnect_csrf** không chứa token đăng nhập. Frontend đọc giá trị này và gửi lại bằng header **x-csrf-token** cho request thay đổi dữ liệu.
- Cookie dùng SameSite=Lax. Đặt COOKIE_SECURE=true khi chạy qua HTTPS; local Docker dùng false.
- Frontend luôn gửi credentials và không lưu access/refresh token trong localStorage hoặc sessionStorage.

Trong production nên đặt frontend và API sau cùng một HTTPS reverse proxy/site. SameSite kết hợp double-submit CSRF bảo vệ các endpoint dùng cookie trước request cross-site giả mạo.

### Authentication API

| Method | Endpoint                  | Mục đích                                  |
| ------ | ------------------------- | ----------------------------------------- |
| POST   | /api/auth/login           | Đăng nhập, tạo token family và cookie     |
| POST   | /api/auth/refresh         | Rotation access/refresh token             |
| POST   | /api/auth/logout          | Thu hồi phiên hiện tại                    |
| POST   | /api/auth/logout-all      | Thu hồi tất cả phiên                      |
| GET    | /api/auth/me              | Thông tin, vai trò và permission hiện tại |
| POST   | /api/auth/change-password | Đổi mật khẩu và thu hồi tất cả phiên      |

Admin có các endpoint /api/admin/users, /api/admin/roles và /api/admin/permissions để quản lý tài khoản, gán role và permission. Swagger mô tả chi tiết request/response tại http://localhost:4000/api/docs.

### Permission Giai đoạn 2

Permission được đặt theo cấu trúc resource.action: user.read/create/update/delete, role.read/manage, student.read/manage, lecturer.read/manage, course.read/manage, exam.read/manage, grade.read/manage, invoice.read/manage, payment.read/manage và audit.read.

## Giai đoạn 3A - Danh mục đào tạo nền tảng

Giai đoạn 3A triển khai quản lý Khoa, Giảng viên, Sinh viên, Năm học, Học kỳ, Môn học và Môn tiên quyết.

## Giai đoạn 3B - Lớp học phần và Lịch học

Giai đoạn 3B triển khai quản lý **Lớp học phần (Class Section)** và **Lịch học (Schedule)**. Phạm vi này chưa triển khai đăng ký môn học, điểm danh hay điểm số.

Các migration trong Giai đoạn 3B:

- `20260719020000_phase3b_class_section_constraints`: Chứa các CHECK constraint quan trọng (ví dụ: `maxCapacity > 0`, `startTime < endTime`, `validFrom <= validTo`).
- `20260718195254_dummy_drift`: Thực hiện DROP INDEX thừa để tối ưu CSDL.

Permission của Giai đoạn 3B:

- **ADMIN** và **TRAINING_STAFF** có toàn bộ quyền `class-section.*` và `schedule.*` (quản trị toàn cục).
- **LECTURER** không có quyền truy cập quản trị toàn cục. Giảng viên chỉ thao tác qua các endpoint dành riêng: `GET /api/lecturers/me/class-sections`, `GET /api/lecturers/me/class-sections/:id/students`, `GET /api/lecturers/me/class-sections/:id/schedules`, và `GET /api/lecturers/me/schedule`.
- **STUDENT** không có quyền truy cập quản trị toàn cục. Sinh viên chỉ truy cập endpoint dành riêng để xem danh sách lớp khả dụng: `GET /api/students/me/available-class-sections`.

Các endpoint `me` sử dụng danh tính trực tiếp từ JWT, không nhận `lecturerId` hay `studentId` từ phía client để đảm bảo bảo mật tuyệt đối. Giai đoạn này đã vượt qua kiểm tra tĩnh và kiểm thử tự động.

Migration Giai đoạn 3A `20260719010000_phase3a_academic_management` bổ sung mô tả môn học, trạng thái học kỳ `CLOSED`, các CHECK constraint cho thời gian/numerics, CHECK chống môn tiên quyết tự tham chiếu và hai partial unique index:

- Chỉ một `AcademicYear` có `isCurrent = true`.
- Chỉ một `Semester` có `status = REGISTRATION_OPEN`.

### API Giai đoạn 3A

| Nhóm                    | Endpoint chính                                                                                                               |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Khoa                    | `GET/POST /api/departments`, `GET/PATCH/DELETE /api/departments/:id`, `POST /api/departments/:id/restore`                    |
| Giảng viên              | `GET/POST /api/lecturers`, `GET /api/lecturers/me`, `GET/PATCH/DELETE /api/lecturers/:id`, `POST /api/lecturers/:id/restore` |
| Sinh viên               | `GET/POST /api/students`, `GET /api/students/me`, `GET/PATCH/DELETE /api/students/:id`, `POST /api/students/:id/restore`     |
| Import/export sinh viên | `POST /api/students/import`, `GET /api/students/export`, `GET /api/students/import-template`                                 |
| Năm học                 | `GET/POST /api/academic-years`, `GET/PATCH/DELETE /api/academic-years/:id`                                                   |
| Học kỳ                  | `GET/POST /api/semesters`, `GET/PATCH/DELETE /api/semesters/:id`                                                             |
| Môn học                 | `GET/POST /api/courses`, `GET/PATCH/DELETE /api/courses/:id`, `POST /api/courses/:id/restore`                                |
| Môn tiên quyết          | `GET/POST /api/courses/:id/prerequisites`, `PATCH/DELETE /api/courses/:id/prerequisites/:prerequisiteCourseId`               |

Các endpoint danh sách có pagination, search, filter và whitelist sorting. Import CSV trả lỗi theo từng dòng; với `atomic=true`, chỉ cần một dòng lỗi thì transaction không tạo bất kỳ sinh viên/tài khoản nào. Service kiểm tra dữ liệu tham chiếu trước khi soft-delete và kiểm tra vòng lặp toàn bộ đồ thị môn tiên quyết. Các thao tác tạo, sửa, xóa, khôi phục và thay đổi môn tiên quyết đều ghi audit log.

Frontend thật nằm dưới `/dashboard/departments`, `/dashboard/lecturers`, `/dashboard/students`, `/dashboard/academic-years`, `/dashboard/semesters`, `/dashboard/courses`, `/dashboard/courses/:id` và `/dashboard/profile`. Menu và thao tác được hiển thị theo permission; backend guard vẫn là lớp kiểm soát bắt buộc.

Permission mới của 3A dùng cấu trúc `resource.action`: `department.*`, `student.create/update/delete/import/export`, `lecturer.create/update/delete`, `academic-year.read/manage`, `semester.read/manage`, `course.create/update/delete` và `course-prerequisite.manage`. ADMIN có toàn bộ quyền; TRAINING_STAFF quản lý danh mục học vụ; FINANCE_STAFF chỉ đọc sinh viên/môn học theo quyền hiện có; LECTURER và STUDENT chỉ đọc các danh mục phù hợp và hồ sơ của chính mình.

Áp dụng migration và kiểm tra seed idempotent:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:seed
```

## Kiến trúc

```text
.
├── apps/
│   ├── api/                    # NestJS REST API + Prisma
│   └── web/                    # Next.js App Router
├── packages/
│   ├── shared-types/           # Kiểu API/RBAC dùng chung
│   ├── eslint-config/          # Quy tắc lint dùng chung
│   └── tsconfig/               # Cấu hình TypeScript dùng chung
├── docker-compose.yml
├── .env.example
└── package.json
```

Backend sẽ phát triển theo các module nghiệp vụ trong cùng một ứng dụng NestJS. Các module giao tiếp qua service contract và cùng một PostgreSQL database; không dùng microservice ở MVP. Redis dành cho cache, rate limiting, phiên thi và dữ liệu tạm có TTL.

## Yêu cầu môi trường

### Chạy bằng Docker (khuyến nghị)

- Docker Desktop có Docker Compose v2.
- Tối thiểu khoảng 4 GB RAM trống cho các container.

### Chạy trực tiếp để phát triển

- Node.js 22 trở lên.
- npm 10 trở lên.
- PostgreSQL 17 và Redis 7, hoặc chỉ chạy hai dịch vụ này bằng Docker.

## Khởi động toàn bộ hệ thống

Từ thư mục gốc repository:

```bash
docker compose up --build
```

Lần chạy đầu, API tự động áp dụng migration và seed dữ liệu phát triển trước khi khởi động. Khi các health check hoàn tất, truy cập:

- Web: http://localhost:3000
- API health: http://localhost:4000/api/health
- Swagger: http://localhost:4000/api/docs
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

Dừng hệ thống nhưng giữ dữ liệu:

```bash
docker compose down
```

Muốn xóa cả dữ liệu PostgreSQL/Redis của môi trường development:

```bash
docker compose down --volumes
```

Lệnh cuối sẽ xóa volume dữ liệu cục bộ và không thể hoàn tác.

Nếu port 5432 đã được PostgreSQL cục bộ sử dụng, đặt POSTGRES_PORT=55432 trước khi chạy Compose. Kết nối nội bộ của API vẫn dùng postgres:5432; khi chạy Prisma trực tiếp từ host, cập nhật DATABASE_URL sang port host tương ứng.

## Chạy môi trường development

1. Sao chép `.env.example` thành `.env`.
2. Cài dependencies và sinh Prisma Client:

```bash
npm install
npm run db:generate
```

3. Khởi động PostgreSQL và Redis:

```bash
docker compose up postgres redis -d
```

4. Áp dụng migration và seed:

```bash
npm run db:migrate
npm run db:seed
```

5. Mở hai terminal riêng:

```bash
npm run dev:api
npm run dev:web
```

## Tài khoản seed

| Vai trò         | Email                   |
| --------------- | ----------------------- |
| Quản trị viên   | `admin@school.local`    |
| Phòng đào tạo   | `training@school.local` |
| Phòng tài chính | `finance@school.local`  |
| Giảng viên      | `lecturer@school.local` |
| Sinh viên       | `student@school.local`  |

Mật khẩu development cho tất cả tài khoản trên là `Password@123`.

> Mật khẩu này **chỉ dùng trong môi trường development**. Không sử dụng dữ liệu seed hoặc mật khẩu này ở staging/production.

Seed còn tạo 3 khoa, 5 giảng viên, 20 sinh viên, 10 môn học, 2 học kỳ, 8 lớp học phần, dữ liệu đăng ký môn, 30 câu hỏi, 2 kỳ thi, 5 hóa đơn và một số giao dịch thanh toán mẫu.

## Scripts thường dùng

| Lệnh                  | Mục đích                          |
| --------------------- | --------------------------------- |
| `npm run dev:api`     | Chạy API với chế độ watch         |
| `npm run dev:web`     | Chạy Web với hot reload           |
| `npm run db:generate` | Sinh Prisma Client                |
| `npm run db:migrate`  | Tạo/áp dụng migration development |
| `npm run db:seed`     | Seed dữ liệu development          |
| `npm run lint`        | Kiểm tra quy tắc code             |
| `npm run typecheck`   | Kiểm tra kiểu TypeScript          |
| `npm run test`        | Chạy unit test                    |
| `npm run build`       | Build toàn bộ workspace           |

## Quy ước dữ liệu quan trọng

- Tiền VND dùng `Decimal(18,0)`, không dùng `float`.
- Điểm dùng `Decimal` với precision/scale rõ ràng. Quy tắc làm tròn nghiệp vụ sẽ được tập trung trong grade service ở Giai đoạn 3.
- Các bảng nghiệp vụ cần khôi phục có `deletedAt` để xóa mềm.
- Refresh token chỉ lưu hash; audit log không lưu mật khẩu hoặc token.
- Đăng ký lớp, nộp bài thi và xử lý payment webhook sẽ dùng database transaction ở các giai đoạn nghiệp vụ tương ứng.
- `PaymentWebhook` có unique constraint theo provider/event ID và `PaymentTransaction` có idempotency key duy nhất để làm nền chống xử lý lặp.

## Biến môi trường

Tham khảo đầy đủ trong `.env.example`. Những secret sau bắt buộc phải thay bằng chuỗi ngẫu nhiên mạnh ngoài development:

- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `MOCK_PAYMENT_WEBHOOK_SECRET`
- `POSTGRES_PASSWORD`

Không commit file `.env` lên repository.

## Kiểm tra nhanh

Sau khi hệ thống chạy, lệnh sau phải trả về response có `success: true` và `database: up`:

```bash
curl http://localhost:4000/api/health
```

Giao diện tại http://localhost:3000 cũng hiển thị nhãn **Hệ thống đã sẵn sàng** khi kết nối API thành công.
