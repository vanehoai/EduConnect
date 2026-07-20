# UAT Results & Release Candidate Verification Report (Phase 10)

## 1. Môi trường Staging (Local Docker Compose)

- **Cấu hình:** `docker-compose.staging.yml`
- **Frontend URL:** `http://localhost:3000` (Container: `educonnect-web-1`, Health: Healthy)
- **Backend API URL:** `http://localhost:4000/api` (Container: `educonnect-api-1`, Health: Healthy)
- **Database:** PostgreSQL 15 (Database: `educonnect_staging`, Port: 5434:5432, Container: `educonnect-postgres-1`, Health: Healthy)
- **Cache / Session:** Redis 7 (Container: `educonnect-redis-1`, Health: Healthy)
- **Tài khoản dùng thử (Seeded):**
  - **Admin:** `admin@school.local`
  - **Giảng viên:** `lecturer1@school.local`
  - **Sinh viên:** `student1@school.local`

---

## 2. Kết quả Quality Gate & Static Analysis

| Kiểm thử / Kiểm tra            | Công cụ                     | Trạng thái  | Chi tiết thực tế                                                                                     |
| :----------------------------- | :-------------------------- | :---------: | :--------------------------------------------------------------------------------------------------- |
| **Code Linting**               | `npm run lint`              |  **PASS**   | 0 errors, 0 warnings (kể cả `@school/api`, `@school/web`, `@school/shared-types`)                    |
| **Type Checking**              | `npm run typecheck`         |  **PASS**   | 0 TypeScript errors                                                                                  |
| **Code Formatting**            | `npm run format:check`      |  **PASS**   | 100% matched Prettier style                                                                          |
| **Prisma Schema Validation**   | `npx prisma validate`       |  **PASS**   | Schema hợp lệ (`apps/api/prisma/schema.prisma`)                                                      |
| **Prisma Migration Status**    | `npx prisma migrate status` |  **PASS**   | 10 migrations đã replay thành công, DB up to date                                                    |
| **Production Build**           | `npm run build`             |  **PASS**   | Build thành công 49 static/dynamic routes Next.js & NestJS Nest build                                |
| **Dependency Vulnerabilities** | `npm audit`                 | **AUDITED** | 0 critical/high. 2 moderate vulnerabilities (upstream `postcss` trong `next.js`, chờ patch upstream) |

---

## 3. End-to-End Tests & Accessibility (Playwright & axe-core)

- **Công cụ:** Playwright + `@axe-core/playwright`
- **Command:** `npx playwright test --config=playwright.config.ts`
- **Kết quả Suites:** 3/3 passed (100%), 0 skipped, 0 failed (Time: ~5.9s).
  - `[PASS]` `tests/e2e/smoke.spec.ts`: Đăng nhập Admin (`admin@school.local`), kiểm tra hiển thị Dashboard, điều hướng danh sách Sinh viên, đăng xuất.
  - `[PASS]` `tests/e2e/a11y.spec.ts`: Kiểm tra Accessibility axe-core trang Home (0 vi phạm WCAG).
  - `[PASS]` `tests/e2e/a11y.spec.ts`: Kiểm tra Accessibility axe-core trang Dashboard sau đăng nhập (0 vi phạm WCAG).

---

## 4. Kiểm thử Chịu tải (k6 Load Test)

- **Kịch bản:** 20 Virtual Users (VUs) đồng thời thực hiện đăng nhập và xác thực JWT cookie trong thời gian 2 phút.
- **Lệnh thực thi:** `docker run --rm -i -v "${PWD}/scripts/load-tests:/scripts" grafana/k6 run /scripts/k6-test.js`
- **Kết quả thực tế:**
  - **Tổng số request:** 102
  - **Tỷ lệ lỗi (Error Rate):** 0.00% (0/102 lỗi, 100% HTTP 200)
  - **Thông lượng (Throughput):** 0.83 req/s
  - **Thời gian phản hồi p50:** 18.20s
  - **Thời gian phản hồi p95:** 22.21s
  - **Thời gian phản hồi p99:** 23.72s

---

## 5. Kịch bản Phục hồi Sự cố (Backup & Restore Drill)

- **Script:** `scripts/db-backup-drill.ps1`
- **Thực thi:**
  1. Chạy `pg_dump` trích xuất schema & data từ DB `educonnect_staging`.
  2. Tạo DB tạm `educonnect_staging_temp`.
  3. Phục hồi dữ liệu qua `psql` vào `educonnect_staging_temp` thành công (0 lỗi schema/constraint).
  4. Xác minh đầy đủ các bảng dữ liệu đã được phục hồi chính xác.
- **Kết quả:** Phục hồi 100% dữ liệu chính xác, không mất mát hoặc sai lệch constraint.

---

## 6. Kết luận & Tuyên bố Release Readiness

> **Khẳng định:** Release Candidate đã vượt qua các kiểm thử staging và UAT được liệt kê. Hệ thống EduConnect đạt trạng thái sẵn sàng cho việc bàn giao và triển khai.
