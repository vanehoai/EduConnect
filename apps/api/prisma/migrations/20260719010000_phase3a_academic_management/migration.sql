-- Phase 3A: academic master data.
-- The initial migration remains immutable; constraints unsupported by Prisma
-- are intentionally maintained in this migration.

ALTER TYPE "SemesterStatus" ADD VALUE IF NOT EXISTS 'CLOSED';

ALTER TABLE "Course"
ADD COLUMN "description" TEXT;

ALTER TABLE "AcademicYear"
ADD CONSTRAINT "AcademicYear_valid_dates_check"
CHECK ("startDate" < "endDate");

ALTER TABLE "Semester"
ADD CONSTRAINT "Semester_valid_dates_check"
CHECK ("startDate" < "endDate"),
ADD CONSTRAINT "Semester_valid_registration_dates_check"
CHECK ("registrationStartDate" < "registrationEndDate"),
ADD CONSTRAINT "Semester_registration_before_start_check"
CHECK ("registrationEndDate" <= "startDate"::timestamp);

ALTER TABLE "Course"
ADD CONSTRAINT "Course_positive_credits_check"
CHECK ("credits" > 0),
ADD CONSTRAINT "Course_nonnegative_theory_periods_check"
CHECK ("theoryPeriods" >= 0),
ADD CONSTRAINT "Course_nonnegative_practice_periods_check"
CHECK ("practicePeriods" >= 0),
ADD CONSTRAINT "Course_nonnegative_tuition_check"
CHECK ("tuitionFeePerCredit" >= 0);

ALTER TABLE "Prerequisite"
ADD CONSTRAINT "Prerequisite_not_self_check"
CHECK ("courseId" <> "prerequisiteCourseId");

CREATE UNIQUE INDEX "AcademicYear_single_current_idx"
ON "AcademicYear" ("isCurrent")
WHERE "isCurrent" = true;

CREATE UNIQUE INDEX "Semester_single_registration_open_idx"
ON "Semester" ("status")
WHERE "status" = 'REGISTRATION_OPEN';
