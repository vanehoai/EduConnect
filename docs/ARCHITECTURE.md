# Kiến trúc Tổng quan - EduConnect

## 1. Tổng quan hệ thống

EduConnect là một hệ thống quản lý trường học tích hợp (Education Management SaaS) được xây dựng theo kiến trúc **Monorepo** với các công nghệ hiện đại. Hệ thống cung cấp giải pháp toàn diện cho việc quản lý đào tạo, tài chính, kiểm tra đánh giá, thông báo và yêu cầu dịch vụ sinh viên.

## 2. Công nghệ sử dụng (Tech Stack)

- **Quản lý Monorepo**: Turborepo, npm workspaces.
- **Backend**: NestJS (Node.js), TypeScript.
- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Shadcn UI.
- **Cơ sở dữ liệu**: PostgreSQL (Primary DB), Redis (Caching, Session, Queue).
- **ORM**: Prisma.
- **Xác thực & Phân quyền**: JWT (JSON Web Token), Role-Based Access Control (RBAC).

## 3. Sơ đồ Kiến trúc Hệ thống (System Architecture)

```mermaid
graph TD
    Client[Client Browser/App] --> |HTTP/HTTPS| NextJS[Next.js Frontend\n(Server & Client Components)]
    NextJS --> |REST API| NestJS[NestJS Backend API]

    subgraph Backend [Backend Services - NestJS]
        NestJS --> Auth[Auth Module]
        NestJS --> Core[Core Modules\nStudent, Lecturer, Course...]
        NestJS --> Exam[Exam & Question Bank]
        NestJS --> Finance[Finance Module]
        NestJS --> Comms[Communication\nNotifications, Support]
    end

    Backend --> |Prisma ORM| PostgreSQL[(PostgreSQL Database)]
    Backend --> |BullMQ / Cache| Redis[(Redis Cache/Queue)]
```

## 4. Cấu trúc Monorepo

Dự án được cấu trúc theo dạng workspace để dễ dàng tái sử dụng code giữa Frontend và Backend.

- `apps/api`: Chứa toàn bộ mã nguồn Backend (NestJS). Cung cấp RESTful API.
- `apps/web`: Chứa toàn bộ mã nguồn Frontend (Next.js). Cung cấp giao diện người dùng (SSR + CSR).
- `packages/shared-types`: (Mô phỏng) Chứa các type, DTO, constants có thể dùng chung giữa Frontend và Backend.

## 5. Tổ chức Modules (NestJS Backend)

Backend được tổ chức thành các module độc lập theo miền dữ liệu (Domain-Driven Design - DDD) ở mức độ cơ bản:

- **AuthModule**: Quản lý đăng nhập, cấp phát JWT, xác minh phân quyền (Guards).
- **Users/Roles/Permissions**: Quản lý danh tính, phân quyền động.
- **Academic Modules**: Gồm Departments, Courses, Class Sections, Semesters, Academic Years. Quản lý luồng đào tạo cốt lõi.
- **ExamModule & QuestionsModule**: Quản lý ngân hàng câu hỏi, tạo đề thi, tổ chức thi trực tuyến.
- **ExamAttemptsModule**: Quản lý tiến trình làm bài thi, auto-save, chấm điểm.
- **FinanceModule**: Quản lý loại học phí, định mức, hóa đơn, biên lai.
- **Communication & Support**: Announcements (Thông báo), Service Requests (Yêu cầu hỗ trợ sinh viên).

## 6. Tổ chức Routes (Next.js Frontend)

Frontend sử dụng Next.js App Router (`app/`), cấu trúc như sau:

- `app/(auth)/login`: Trang đăng nhập.
- `app/dashboard`: Layout chính sau khi đăng nhập. Có sidebar tự động thay đổi theo vai trò.
- `app/dashboard/student/*`: Các trang dành riêng cho Sinh viên.
- `app/dashboard/finance/*`: Các trang dành cho quản lý tài chính.
- `app/dashboard/exams`, `app/dashboard/question-bank`: Dành cho Giảng viên/Phòng Đào tạo.
- `app/dashboard/academic-risks`, `app/dashboard/service-requests`: Dành cho Phòng Đào tạo/Admin.
- `app/dashboard/analytics`: Báo cáo thống kê.

## 7. Xử lý Lỗi (Error Handling)

- **Backend**: Sử dụng Global Exception Filter để bắt mọi exception. Trả về format chuẩn `{ statusCode, message, error }`. Prisma exceptions (P2002, P2025...) được mapping sang HTTP status codes tương ứng.
- **Frontend**: Sử dụng `error.tsx` của Next.js để bắt lỗi rendering. Sử dụng `toast` từ thư viện `sonner` để hiển thị lỗi từ API call. `apiRequest` interceptor sẽ ném ra `Error` nếu response không thành công.
