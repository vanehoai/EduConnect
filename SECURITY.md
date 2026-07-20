# Security Policies & Hardening

## Overview

Dự án EduConnect đã được áp dụng (hardened) các chính sách bảo mật cho Production (Phase 8), tập trung vào Application Security, Network Security, và Operations Security.

## 1. Authentication & Authorization

- **JWT (JSON Web Token)**: Hệ thống sử dụng cặp Access Token (ngắn hạn - 15m) và Refresh Token (dài hạn - 7d).
- **Secret Length**: `JWT_ACCESS_SECRET` và `JWT_REFRESH_SECRET` bị **bắt buộc** phải có tối thiểu 32 ký tự. Ứng dụng sẽ tự động từ chối khởi động (Crash-loop) nếu phát hiện secret quá ngắn hoặc dùng giá trị mặc định trong môi trường production.
- **RBAC**: API được bảo vệ bằng guards `@Roles()` và `@Permissions()`. User (Sinh viên, Giảng viên) không có quyền can thiệp dữ liệu lẫn nhau.

## 2. API Protection

- **CORS**: Được quản lý qua `CORS_ORIGIN`. Tuyệt đối không cho phép dùng wildcard `*` với credentials.
- **Helmet**: Helmet được cấu hình với các Header nghiêm ngặt:
  - `Content-Security-Policy`: Mặc định ngăn chặn các script/style thực thi ngoài luồng.
  - `Strict-Transport-Security` (HSTS): Ngăn chặn MITM.
  - X-Frame-Options, X-Content-Type-Options.
- **Rate Limiting**: Toàn bộ hệ thống áp dụng Throttle (`@nestjs/throttler`), với giới hạn đặc biệt khắt khe cho endpoint login/refresh (Mặc định: 5 requests / phút).
- **Validation**: `ValidationPipe` sử dụng `whitelist: true` và `forbidNonWhitelisted: true`, đảm bảo API sẽ chặn mọi request chứa trường dữ liệu không nằm trong DTO định nghĩa.

## 3. Data Protection

- Các trường nhạy cảm như Mật khẩu, Token, Key thanh toán đều được **Redact (che giấu)** tự động trong Logs thông qua `pino-http`.
- AuditLogs không lưu trữ JWT token hay Mật khẩu trong bất kỳ hoàn cảnh nào.
- Dữ liệu rác/độc hại được chống thông qua Zod ở Frontend và Class Validator ở Backend.
- **CSV Formula Injection**: Các trường xuất CSV được escape bằng ký tự `'` để tránh chèn mã thực thi Excel.

## 4. Frontend Next.js Security

- **Security Headers**: Áp dụng tại Next Config để bổ trợ cho backend.
- **Error Boundaries**: Ứng dụng Next.js xử lý lỗi bằng `app/error.tsx` tùy chỉnh, hoàn toàn che giấu stack trace và internal state của hệ thống khi ở trên production.

## 5. Dependency Vulnerabilities

- Mọi bản cập nhật dependency được giám sát tự động bằng `npm audit`.
- **Note**: Hiện tại Next.js `canary` có thể bao gồm dependency `postcss` (vulnerability ở mức độ moderate liên quan đến XSS style tag). Lỗi này xuất phát từ bên thứ ba và đã được mitigate nhờ CSP headers và hệ thống render chuẩn của React/NextJS. Việc cố gắng `npm audit fix --force` bị cấm để tránh gây hỏng (breaking change) đến hệ thống build của Next.js.
