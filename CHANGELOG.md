# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-07-20

### Added

- **Authentication & Security**: JWT-based authentication, Role-Based Access Control (RBAC), and strict ownership checking. Helmet and CORS enabled. Rate limiting implemented.
- **Academic Core**: Complete models and workflows for Academic Years, Semesters, Departments, Courses, and Class Sections.
- **Enrollments & Attendance**: Student enrollment flows, prerequisite checking, attendance sessions, and tracking.
- **Grades & GPA**: Grade components, score calculations, letter grade mapping, final GPA accumulation, and student transcripts.
- **Question Bank & Exams**: Online exam system, automated grading, soft deletion, and assignments.
- **Finance**: Fee types, tuition rates, invoices, receipts, and mock online payments.
- **Notifications & Communications**: Service Requests (ticketing), real-time application announcements, and user notification preferences.
- **Analytics & Reporting**: Admin/staff dashboard with charts (student statuses, financial summaries), and automated Academic Risks warnings.
- **E2E & Performance**: Setup Playwright for End-to-End browser testing, k6 for API load testing, and optimized N+1 database queries.

### Changed

- Refactored `apps/api` Prisma queries with optimized `include` to solve N+1 problems.
- Transformed heavy recharts into Next.js `dynamic` components in `apps/web`.
- Updated `.github/workflows/ci.yml` to include Playwright E2E and production testing.

### Fixed

- Fixed ESLint rules across both backend and frontend.
- Added strict Type checking.

## [0.1.0] - 2026-07-01

- Initial Monorepo Setup (NestJS + Next.js + Prisma)
