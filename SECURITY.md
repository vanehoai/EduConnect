# Security Policies & Hardening (v1.0.0)

## Overview

Dự án EduConnect đã áp dụng toàn bộ các chính sách bảo mật cho Production (Phases 8-11), bao gồm Application Security, Infrastructure Security và Operations Security.

## 1. Authentication & Authorization Controls

- **JWT Secrets**: `JWT_ACCESS_SECRET` và `JWT_REFRESH_SECRET` bắt buộc tối thiểu 32 ký tự, cấm từ khóa 'development'.
- **Swagger Documentation**: Swagger `/api/docs` bị **tắt hoàn toàn** trong môi trường Production (`NODE_ENV === 'production'`).
- **Cookie Security**: HTTP-only, SameSite=Lax (hoặc Strict), Secure flag kích hoạt khi chạy HTTPS.
- **RBAC & Ownership**: Kiểm tra quyền chi tiết qua `@Permissions()` và kiểm tra chủ sở hữu dữ liệu trực tiếp trong tầng Service.

## 2. API Protection & Headers

- **CORS**: Chỉ cho phép danh sách trắng trong `CORS_ORIGIN`. Từ chối tất cả origin lạ.
- **Security Headers (Helmet)**: HSTS (`maxAge: 31536000`), `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`.
- **Content Security Policy (CSP)**: `connect-src` kiểm soát chặt chẽ origin được phép gọi.
- **Rate Limiting**: Throttler bảo vệ API login (mặc định 5 req/phút).
- **Error Stack Trace Concealment**: `AllExceptionsFilter` che giấu toàn bộ stack trace và chi tiết lỗi nội bộ khi gặp lỗi 5xx trên Production.

## 3. Operations & Container Security

- **Non-Root Containers**: Web và API containers thực thi bằng tài khoản không có quyền root (`user: node`).
- **Log Redaction**: Pino HTTP tự động che giấu mật khẩu, token và thông tin nhạy cảm trong logs.
- **Zero Secret In Image**: Image Docker được build không chứa file `.env` hoặc secrets hard-code.
- **Vulnerability Governance**: Không sử dụng `npm audit fix --force` gây breaking changes. 0 critical/high vulnerabilities.
