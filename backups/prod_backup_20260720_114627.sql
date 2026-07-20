--
-- PostgreSQL database dump
--

\restrict hMAfc0jlPyGXlz0DEWAZbH6Hbh70dzZkd0sfW5GYV0CJYc3FQQh2aIOQcqEqp1F

-- Dumped from database version 15.18
-- Dumped by pg_dump version 15.18

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE IF EXISTS educonnect_production;
--
-- Name: educonnect_production; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE educonnect_production WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE educonnect_production OWNER TO postgres;

\unrestrict hMAfc0jlPyGXlz0DEWAZbH6Hbh70dzZkd0sfW5GYV0CJYc3FQQh2aIOQcqEqp1F
\connect educonnect_production
\restrict hMAfc0jlPyGXlz0DEWAZbH6Hbh70dzZkd0sfW5GYV0CJYc3FQQh2aIOQcqEqp1F

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: AcademicStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AcademicStatus" AS ENUM (
    'STUDYING',
    'SUSPENDED',
    'GRADUATED',
    'WITHDRAWN'
);


ALTER TYPE public."AcademicStatus" OWNER TO postgres;

--
-- Name: AnnouncementAudienceType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AnnouncementAudienceType" AS ENUM (
    'ALL_USERS',
    'ROLE',
    'DEPARTMENT',
    'CLASS_SECTION',
    'STUDENT',
    'LECTURER'
);


ALTER TYPE public."AnnouncementAudienceType" OWNER TO postgres;

--
-- Name: AnnouncementCategory; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AnnouncementCategory" AS ENUM (
    'GENERAL',
    'ACADEMIC',
    'EXAM',
    'ATTENDANCE',
    'FINANCE',
    'SCHOLARSHIP',
    'SYSTEM',
    'EVENT',
    'OTHER'
);


ALTER TYPE public."AnnouncementCategory" OWNER TO postgres;

--
-- Name: AnnouncementPriority; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AnnouncementPriority" AS ENUM (
    'LOW',
    'NORMAL',
    'HIGH',
    'URGENT'
);


ALTER TYPE public."AnnouncementPriority" OWNER TO postgres;

--
-- Name: AnnouncementStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AnnouncementStatus" AS ENUM (
    'DRAFT',
    'SCHEDULED',
    'PUBLISHED',
    'EXPIRED',
    'CANCELLED'
);


ALTER TYPE public."AnnouncementStatus" OWNER TO postgres;

--
-- Name: AttendanceStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AttendanceStatus" AS ENUM (
    'PRESENT',
    'ABSENT',
    'LATE',
    'EXCUSED'
);


ALTER TYPE public."AttendanceStatus" OWNER TO postgres;

--
-- Name: ClassSectionStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ClassSectionStatus" AS ENUM (
    'DRAFT',
    'OPEN',
    'CLOSED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public."ClassSectionStatus" OWNER TO postgres;

--
-- Name: CommentVisibility; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CommentVisibility" AS ENUM (
    'PUBLIC',
    'INTERNAL'
);


ALTER TYPE public."CommentVisibility" OWNER TO postgres;

--
-- Name: DifficultyLevel; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DifficultyLevel" AS ENUM (
    'EASY',
    'MEDIUM',
    'HARD'
);


ALTER TYPE public."DifficultyLevel" OWNER TO postgres;

--
-- Name: DiscountType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DiscountType" AS ENUM (
    'PERCENTAGE',
    'FIXED_AMOUNT'
);


ALTER TYPE public."DiscountType" OWNER TO postgres;

--
-- Name: EnrollmentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EnrollmentStatus" AS ENUM (
    'ENROLLED',
    'DROPPED',
    'COMPLETED',
    'FAILED'
);


ALTER TYPE public."EnrollmentStatus" OWNER TO postgres;

--
-- Name: ExamAttemptStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ExamAttemptStatus" AS ENUM (
    'IN_PROGRESS',
    'SUBMITTED',
    'AUTO_SUBMITTED',
    'GRADED',
    'INVALIDATED',
    'EXPIRED',
    'CANCELLED'
);


ALTER TYPE public."ExamAttemptStatus" OWNER TO postgres;

--
-- Name: ExamStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ExamStatus" AS ENUM (
    'DRAFT',
    'SCHEDULED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
    'OPEN',
    'CLOSED',
    'PUBLISHED'
);


ALTER TYPE public."ExamStatus" OWNER TO postgres;

--
-- Name: FeeCalculationMethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."FeeCalculationMethod" AS ENUM (
    'FIXED',
    'PER_CREDIT',
    'PER_COURSE',
    'PER_SEMESTER'
);


ALTER TYPE public."FeeCalculationMethod" OWNER TO postgres;

--
-- Name: FeeCategory; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."FeeCategory" AS ENUM (
    'TUITION',
    'REGISTRATION',
    'FACILITY',
    'LAB',
    'LIBRARY',
    'EXAM',
    'OTHER'
);


ALTER TYPE public."FeeCategory" OWNER TO postgres;

--
-- Name: FinancialAdjustmentType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."FinancialAdjustmentType" AS ENUM (
    'CREDIT',
    'DEBIT'
);


ALTER TYPE public."FinancialAdjustmentType" OWNER TO postgres;

--
-- Name: Gender; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Gender" AS ENUM (
    'MALE',
    'FEMALE',
    'OTHER'
);


ALTER TYPE public."Gender" OWNER TO postgres;

--
-- Name: GradeComponentType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."GradeComponentType" AS ENUM (
    'ATTENDANCE',
    'ASSIGNMENT',
    'MIDTERM',
    'FINAL',
    'OTHER'
);


ALTER TYPE public."GradeComponentType" OWNER TO postgres;

--
-- Name: InvoiceStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."InvoiceStatus" AS ENUM (
    'UNPAID',
    'PARTIALLY_PAID',
    'PAID',
    'OVERDUE',
    'CANCELLED',
    'REFUNDED',
    'VOID',
    'DRAFT',
    'ISSUED'
);


ALTER TYPE public."InvoiceStatus" OWNER TO postgres;

--
-- Name: LecturerStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."LecturerStatus" AS ENUM (
    'ACTIVE',
    'ON_LEAVE',
    'RETIRED',
    'INACTIVE'
);


ALTER TYPE public."LecturerStatus" OWNER TO postgres;

--
-- Name: NotificationType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."NotificationType" AS ENUM (
    'ENROLLMENT_SUCCESS',
    'SCHEDULE_CHANGED',
    'EXAM_REMINDER',
    'GRADE_PUBLISHED',
    'INVOICE_CREATED',
    'TUITION_DUE',
    'PAYMENT_SUCCESS',
    'PAYMENT_FAILED',
    'SYSTEM',
    'ANNOUNCEMENT_PUBLISHED',
    'SERVICE_REQUEST_CREATED',
    'SERVICE_REQUEST_ASSIGNED',
    'SERVICE_REQUEST_UPDATED',
    'SERVICE_REQUEST_RESOLVED',
    'SERVICE_REQUEST_CANCELLED',
    'SERVICE_REQUEST_SLA_WARNING',
    'SERVICE_REQUEST_SLA_BREACHED'
);


ALTER TYPE public."NotificationType" OWNER TO postgres;

--
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentMethod" AS ENUM (
    'CASH',
    'BANK_TRANSFER',
    'INTERNAL_TRANSFER',
    'OTHER'
);


ALTER TYPE public."PaymentMethod" OWNER TO postgres;

--
-- Name: PaymentProvider; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentProvider" AS ENUM (
    'MOCK',
    'VNPAY',
    'MOMO',
    'ZALOPAY',
    'BANK_TRANSFER'
);


ALTER TYPE public."PaymentProvider" OWNER TO postgres;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PENDING',
    'SUCCEEDED',
    'FAILED',
    'CANCELLED',
    'REFUNDED',
    'VERIFIED'
);


ALTER TYPE public."PaymentStatus" OWNER TO postgres;

--
-- Name: QuestionType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."QuestionType" AS ENUM (
    'SINGLE_CHOICE',
    'MULTIPLE_CHOICE',
    'TRUE_FALSE'
);


ALTER TYPE public."QuestionType" OWNER TO postgres;

--
-- Name: ReceiptStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReceiptStatus" AS ENUM (
    'ISSUED',
    'CANCELLED'
);


ALTER TYPE public."ReceiptStatus" OWNER TO postgres;

--
-- Name: RecordStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RecordStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'ARCHIVED'
);


ALTER TYPE public."RecordStatus" OWNER TO postgres;

--
-- Name: RiskSeverity; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RiskSeverity" AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
);


ALTER TYPE public."RiskSeverity" OWNER TO postgres;

--
-- Name: RiskStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RiskStatus" AS ENUM (
    'OPEN',
    'ACKNOWLEDGED',
    'RESOLVED',
    'DISMISSED'
);


ALTER TYPE public."RiskStatus" OWNER TO postgres;

--
-- Name: RiskType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RiskType" AS ENUM (
    'LOW_GPA',
    'GPA_DECLINE',
    'HIGH_ABSENCE',
    'CONSECUTIVE_ABSENCE',
    'FAILED_COURSES',
    'LOW_CREDIT_COMPLETION',
    'EXAM_INCOMPLETE',
    'FINANCIAL_HOLD',
    'OTHER'
);


ALTER TYPE public."RiskType" OWNER TO postgres;

--
-- Name: ScholarshipStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ScholarshipStatus" AS ENUM (
    'APPROVED',
    'REJECTED',
    'PENDING',
    'REVOKED'
);


ALTER TYPE public."ScholarshipStatus" OWNER TO postgres;

--
-- Name: SemesterStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SemesterStatus" AS ENUM (
    'PLANNED',
    'REGISTRATION_OPEN',
    'IN_PROGRESS',
    'COMPLETED',
    'CLOSED'
);


ALTER TYPE public."SemesterStatus" OWNER TO postgres;

--
-- Name: SemesterTerm; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SemesterTerm" AS ENUM (
    'FIRST',
    'SECOND',
    'SUMMER'
);


ALTER TYPE public."SemesterTerm" OWNER TO postgres;

--
-- Name: ServiceRequestPriority; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ServiceRequestPriority" AS ENUM (
    'LOW',
    'NORMAL',
    'HIGH',
    'URGENT'
);


ALTER TYPE public."ServiceRequestPriority" OWNER TO postgres;

--
-- Name: ServiceRequestStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ServiceRequestStatus" AS ENUM (
    'OPEN',
    'ASSIGNED',
    'IN_PROGRESS',
    'WAITING_FOR_STUDENT',
    'RESOLVED',
    'CLOSED',
    'CANCELLED',
    'REOPENED'
);


ALTER TYPE public."ServiceRequestStatus" OWNER TO postgres;

--
-- Name: ShowResultMode; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ShowResultMode" AS ENUM (
    'IMMEDIATELY',
    'AFTER_EXAM_END',
    'AFTER_PUBLISH',
    'NEVER'
);


ALTER TYPE public."ShowResultMode" OWNER TO postgres;

--
-- Name: TuitionItemType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TuitionItemType" AS ENUM (
    'CREDIT_FEE',
    'ADDITIONAL_FEE',
    'DISCOUNT',
    'SCHOLARSHIP',
    'PREVIOUS_DEBT'
);


ALTER TYPE public."TuitionItemType" OWNER TO postgres;

--
-- Name: UserStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserStatus" AS ENUM (
    'ACTIVE',
    'LOCKED',
    'INACTIVE'
);


ALTER TYPE public."UserStatus" OWNER TO postgres;

--
-- Name: WebhookStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."WebhookStatus" AS ENUM (
    'RECEIVED',
    'PROCESSED',
    'IGNORED_DUPLICATE',
    'FAILED'
);


ALTER TYPE public."WebhookStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AcademicRiskAlert; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AcademicRiskAlert" (
    id text NOT NULL,
    "studentId" text NOT NULL,
    "semesterId" text NOT NULL,
    type public."RiskType" NOT NULL,
    severity public."RiskSeverity" NOT NULL,
    status public."RiskStatus" DEFAULT 'OPEN'::public."RiskStatus" NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    "ruleCode" character varying(50) NOT NULL,
    "ruleSnapshot" jsonb,
    "evaluationPeriod" character varying(50) NOT NULL,
    "detectedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "acknowledgedAt" timestamp(3) without time zone,
    "acknowledgedByUserId" text,
    "resolvedAt" timestamp(3) without time zone,
    "resolvedByUserId" text,
    "resolutionNote" text,
    "dismissedAt" timestamp(3) without time zone,
    "dismissedByUserId" text,
    "dismissReason" text,
    "notificationSentAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AcademicRiskAlert" OWNER TO postgres;

--
-- Name: AcademicRiskRule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AcademicRiskRule" (
    id text NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(200) NOT NULL,
    description text,
    type public."RiskType" NOT NULL,
    "defaultSeverity" public."RiskSeverity" NOT NULL,
    "thresholdConfig" jsonb NOT NULL,
    "evaluationPeriodType" character varying(50) NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "effectiveFrom" date,
    "effectiveTo" date,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AcademicRiskRule" OWNER TO postgres;

--
-- Name: AcademicYear; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AcademicYear" (
    id text NOT NULL,
    code character varying(20) NOT NULL,
    name character varying(100) NOT NULL,
    "startDate" date NOT NULL,
    "endDate" date NOT NULL,
    "isCurrent" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    CONSTRAINT "AcademicYear_valid_dates_check" CHECK (("startDate" < "endDate"))
);


ALTER TABLE public."AcademicYear" OWNER TO postgres;

--
-- Name: Announcement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Announcement" (
    id text NOT NULL,
    title character varying(300) NOT NULL,
    summary character varying(1000),
    content text NOT NULL,
    category public."AnnouncementCategory" DEFAULT 'GENERAL'::public."AnnouncementCategory" NOT NULL,
    priority public."AnnouncementPriority" DEFAULT 'NORMAL'::public."AnnouncementPriority" NOT NULL,
    status public."AnnouncementStatus" DEFAULT 'DRAFT'::public."AnnouncementStatus" NOT NULL,
    "publishAt" timestamp(3) without time zone,
    "expiresAt" timestamp(3) without time zone,
    "publishedAt" timestamp(3) without time zone,
    "publishedByUserId" text,
    "cancelledAt" timestamp(3) without time zone,
    "cancelledByUserId" text,
    "cancelReason" text,
    "createdByUserId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Announcement" OWNER TO postgres;

--
-- Name: AnnouncementAudience; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AnnouncementAudience" (
    id text NOT NULL,
    "announcementId" text NOT NULL,
    "audienceType" public."AnnouncementAudienceType" NOT NULL,
    "roleId" text,
    "departmentId" text,
    "classSectionId" text,
    "studentId" text,
    "lecturerId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AnnouncementAudience" OWNER TO postgres;

--
-- Name: AnnouncementReadReceipt; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AnnouncementReadReceipt" (
    "announcementId" text NOT NULL,
    "userId" text NOT NULL,
    "readAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AnnouncementReadReceipt" OWNER TO postgres;

--
-- Name: AttendanceRecord; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AttendanceRecord" (
    id text NOT NULL,
    "attendanceSessionId" text NOT NULL,
    "studentId" text NOT NULL,
    status public."AttendanceStatus" NOT NULL,
    note character varying(500),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "markedAt" timestamp(3) without time zone,
    "markedByUserId" text
);


ALTER TABLE public."AttendanceRecord" OWNER TO postgres;

--
-- Name: AttendanceSession; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AttendanceSession" (
    id text NOT NULL,
    "classSectionId" text NOT NULL,
    "createdById" text NOT NULL,
    "sessionDate" date NOT NULL,
    topic character varying(300),
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "endTime" time(0) without time zone NOT NULL,
    "startTime" time(0) without time zone NOT NULL,
    CONSTRAINT "AttendanceSession_time_check" CHECK (("startTime" < "endTime"))
);


ALTER TABLE public."AttendanceSession" OWNER TO postgres;

--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AuditLog" (
    id text NOT NULL,
    "actorUserId" text,
    action character varying(100) NOT NULL,
    "entityType" character varying(100) NOT NULL,
    "entityId" character varying(100),
    "oldValues" jsonb,
    "newValues" jsonb,
    "ipAddress" character varying(64),
    "userAgent" character varying(500),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AuditLog" OWNER TO postgres;

--
-- Name: ClassSection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ClassSection" (
    id text NOT NULL,
    "sectionCode" character varying(40) NOT NULL,
    "courseId" text NOT NULL,
    "semesterId" text NOT NULL,
    "lecturerId" text NOT NULL,
    room character varying(50),
    "maxCapacity" integer NOT NULL,
    "enrolledCount" integer DEFAULT 0 NOT NULL,
    status public."ClassSectionStatus" DEFAULT 'DRAFT'::public."ClassSectionStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    CONSTRAINT "ClassSection_positive_capacity_check" CHECK (("maxCapacity" > 0))
);


ALTER TABLE public."ClassSection" OWNER TO postgres;

--
-- Name: Course; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Course" (
    id text NOT NULL,
    "courseCode" character varying(30) NOT NULL,
    name character varying(200) NOT NULL,
    credits integer NOT NULL,
    "theoryPeriods" integer DEFAULT 0 NOT NULL,
    "practicePeriods" integer DEFAULT 0 NOT NULL,
    "tuitionFeePerCredit" numeric(18,0) NOT NULL,
    "departmentId" text NOT NULL,
    status public."RecordStatus" DEFAULT 'ACTIVE'::public."RecordStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    description text,
    CONSTRAINT "Course_nonnegative_practice_periods_check" CHECK (("practicePeriods" >= 0)),
    CONSTRAINT "Course_nonnegative_theory_periods_check" CHECK (("theoryPeriods" >= 0)),
    CONSTRAINT "Course_nonnegative_tuition_check" CHECK (("tuitionFeePerCredit" >= (0)::numeric)),
    CONSTRAINT "Course_positive_credits_check" CHECK ((credits > 0))
);


ALTER TABLE public."Course" OWNER TO postgres;

--
-- Name: Department; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Department" (
    id text NOT NULL,
    code character varying(20) NOT NULL,
    name character varying(150) NOT NULL,
    description text,
    "headLecturerId" text,
    status public."RecordStatus" DEFAULT 'ACTIVE'::public."RecordStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."Department" OWNER TO postgres;

--
-- Name: Enrollment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Enrollment" (
    id text NOT NULL,
    "studentId" text NOT NULL,
    "classSectionId" text NOT NULL,
    status public."EnrollmentStatus" DEFAULT 'ENROLLED'::public."EnrollmentStatus" NOT NULL,
    "enrolledAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "droppedAt" timestamp(3) without time zone,
    "finalScore" numeric(5,2),
    "letterGrade" character varying(5),
    passed boolean,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "finalGradePublishedAt" timestamp(3) without time zone,
    "finalGradePublishedByUserId" text
);


ALTER TABLE public."Enrollment" OWNER TO postgres;

--
-- Name: Exam; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Exam" (
    id text NOT NULL,
    "examCode" character varying(40) NOT NULL,
    name character varying(200) NOT NULL,
    "courseId" text NOT NULL,
    "classSectionId" text NOT NULL,
    "createdByUserId" text NOT NULL,
    "startsAt" timestamp(3) without time zone NOT NULL,
    "endsAt" timestamp(3) without time zone NOT NULL,
    "durationMinutes" integer NOT NULL,
    "maxAttempts" integer DEFAULT 1 NOT NULL,
    "passScore" numeric(5,2) NOT NULL,
    "questionCount" integer NOT NULL,
    "shuffleQuestions" boolean DEFAULT true NOT NULL,
    "shuffleOptions" boolean DEFAULT true NOT NULL,
    "showResult" boolean DEFAULT false NOT NULL,
    "answerPublishAt" timestamp(3) without time zone,
    status public."ExamStatus" DEFAULT 'DRAFT'::public."ExamStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "allowLateStart" boolean DEFAULT true NOT NULL,
    "allowReview" boolean DEFAULT false NOT NULL,
    "autoSubmit" boolean DEFAULT true NOT NULL,
    description text,
    "showResultMode" public."ShowResultMode" DEFAULT 'NEVER'::public."ShowResultMode" NOT NULL
);


ALTER TABLE public."Exam" OWNER TO postgres;

--
-- Name: ExamAssignment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ExamAssignment" (
    id text NOT NULL,
    "examId" text NOT NULL,
    "studentId" text NOT NULL,
    "assignedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ExamAssignment" OWNER TO postgres;

--
-- Name: ExamAttempt; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ExamAttempt" (
    id text NOT NULL,
    "examId" text NOT NULL,
    "studentId" text NOT NULL,
    "attemptNumber" integer NOT NULL,
    "startedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "submittedAt" timestamp(3) without time zone,
    status public."ExamAttemptStatus" DEFAULT 'IN_PROGRESS'::public."ExamAttemptStatus" NOT NULL,
    score numeric(8,2),
    percentage numeric(5,2),
    passed boolean,
    "ipAddress" character varying(64),
    "userAgent" character varying(500),
    "tabSwitchCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ExamAttempt" OWNER TO postgres;

--
-- Name: ExamAttemptQuestion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ExamAttemptQuestion" (
    id text NOT NULL,
    "examAttemptId" text NOT NULL,
    "questionId" text NOT NULL,
    "contentSnapshot" text NOT NULL,
    "typeSnapshot" public."QuestionType" NOT NULL,
    "optionsSnapshot" jsonb NOT NULL,
    "correctAnswerSnapshot" jsonb NOT NULL,
    "explanationSnapshot" text,
    points numeric(6,2) NOT NULL,
    "displayOrder" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ExamAttemptQuestion" OWNER TO postgres;

--
-- Name: ExamQuestion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ExamQuestion" (
    "examId" text NOT NULL,
    "questionId" text NOT NULL,
    points numeric(6,2) DEFAULT 1 NOT NULL,
    "displayOrder" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ExamQuestion" OWNER TO postgres;

--
-- Name: FeeType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FeeType" (
    id text NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(200) NOT NULL,
    description text,
    category public."FeeCategory" DEFAULT 'OTHER'::public."FeeCategory" NOT NULL,
    "calculationMethod" public."FeeCalculationMethod" DEFAULT 'FIXED'::public."FeeCalculationMethod" NOT NULL,
    "defaultAmount" numeric(18,0) DEFAULT 0 NOT NULL,
    "isMandatory" boolean DEFAULT false NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."FeeType" OWNER TO postgres;

--
-- Name: FinancialAdjustment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FinancialAdjustment" (
    id text NOT NULL,
    "studentId" text NOT NULL,
    "invoiceId" text,
    type public."FinancialAdjustmentType" NOT NULL,
    amount numeric(18,0) NOT NULL,
    reason character varying(500) NOT NULL,
    "createdByUserId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."FinancialAdjustment" OWNER TO postgres;

--
-- Name: GradeComponent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."GradeComponent" (
    id text NOT NULL,
    "classSectionId" text NOT NULL,
    name character varying(150) NOT NULL,
    type public."GradeComponentType" NOT NULL,
    weight numeric(5,2) NOT NULL,
    "maxScore" numeric(5,2) DEFAULT 10 NOT NULL,
    "displayOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    CONSTRAINT "GradeComponent_maxScore_check" CHECK (("maxScore" > (0)::numeric)),
    CONSTRAINT "GradeComponent_weight_check" CHECK (((weight > (0)::numeric) AND (weight <= (100)::numeric)))
);


ALTER TABLE public."GradeComponent" OWNER TO postgres;

--
-- Name: Invoice; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Invoice" (
    id text NOT NULL,
    "invoiceCode" character varying(50) NOT NULL,
    "studentId" text NOT NULL,
    "semesterId" text NOT NULL,
    subtotal numeric(18,0) NOT NULL,
    "discountAmount" numeric(18,0) DEFAULT 0 NOT NULL,
    "scholarshipAmount" numeric(18,0) DEFAULT 0 NOT NULL,
    "previousDebt" numeric(18,0) DEFAULT 0 NOT NULL,
    "totalAmount" numeric(18,0) NOT NULL,
    "paidAmount" numeric(18,0) DEFAULT 0 NOT NULL,
    "balanceAmount" numeric(18,0) NOT NULL,
    "dueDate" date NOT NULL,
    status public."InvoiceStatus" DEFAULT 'UNPAID'::public."InvoiceStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "adjustmentAmount" numeric(18,0) DEFAULT 0 NOT NULL,
    "cancelReason" character varying(500),
    "cancelledAt" timestamp(3) without time zone,
    "cancelledByUserId" text,
    "issueDate" date,
    "issuedAt" timestamp(3) without time zone,
    "issuedByUserId" text,
    notes text
);


ALTER TABLE public."Invoice" OWNER TO postgres;

--
-- Name: InvoiceItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."InvoiceItem" (
    id text NOT NULL,
    "invoiceId" text NOT NULL,
    "tuitionItemId" text,
    description character varying(300) NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    "unitAmount" numeric(18,0) NOT NULL,
    "totalAmount" numeric(18,0) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "calculationSnapshot" jsonb,
    "courseId" text,
    "discountAmount" numeric(18,0) DEFAULT 0 NOT NULL,
    "enrollmentId" text,
    "feeTypeId" text
);


ALTER TABLE public."InvoiceItem" OWNER TO postgres;

--
-- Name: Lecturer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Lecturer" (
    id text NOT NULL,
    "lecturerCode" character varying(30) NOT NULL,
    "userId" text NOT NULL,
    "departmentId" text NOT NULL,
    "fullName" character varying(150) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(20),
    "dateOfBirth" date,
    gender public."Gender",
    "academicRank" character varying(100),
    specialization character varying(200),
    status public."LecturerStatus" DEFAULT 'ACTIVE'::public."LecturerStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."Lecturer" OWNER TO postgres;

--
-- Name: LoginHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LoginHistory" (
    id text NOT NULL,
    "userId" text,
    "emailAttempt" character varying(255) NOT NULL,
    "ipAddress" character varying(64),
    "userAgent" character varying(500),
    successful boolean NOT NULL,
    "failureReason" character varying(255),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LoginHistory" OWNER TO postgres;

--
-- Name: Notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type public."NotificationType" NOT NULL,
    title character varying(200) NOT NULL,
    content text NOT NULL,
    data jsonb,
    "readAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Notification" OWNER TO postgres;

--
-- Name: NotificationPreference; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."NotificationPreference" (
    id text NOT NULL,
    "userId" text NOT NULL,
    category character varying(50) NOT NULL,
    "inAppEnabled" boolean DEFAULT true NOT NULL,
    "emailEnabled" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."NotificationPreference" OWNER TO postgres;

--
-- Name: PaymentAllocation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PaymentAllocation" (
    id text NOT NULL,
    "paymentTransactionId" text NOT NULL,
    "invoiceId" text NOT NULL,
    amount numeric(18,0) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PaymentAllocation" OWNER TO postgres;

--
-- Name: PaymentTransaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PaymentTransaction" (
    id text NOT NULL,
    "transactionCode" character varying(50) NOT NULL,
    "invoiceId" text NOT NULL,
    "studentId" text NOT NULL,
    provider public."PaymentProvider" DEFAULT 'MOCK'::public."PaymentProvider" NOT NULL,
    "externalTransactionId" character varying(100),
    "idempotencyKey" character varying(100) NOT NULL,
    amount numeric(18,0) NOT NULL,
    currency character(3) DEFAULT 'VND'::bpchar NOT NULL,
    status public."PaymentStatus" DEFAULT 'PENDING'::public."PaymentStatus" NOT NULL,
    "failureReason" character varying(500),
    "initiatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "completedAt" timestamp(3) without time zone,
    metadata jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "cancelReason" character varying(500),
    "cancelledAt" timestamp(3) without time zone,
    "cancelledByUserId" text,
    method public."PaymentMethod" DEFAULT 'OTHER'::public."PaymentMethod" NOT NULL,
    notes text,
    "receivedByUserId" text,
    "verifiedAt" timestamp(3) without time zone,
    "verifiedByUserId" text
);


ALTER TABLE public."PaymentTransaction" OWNER TO postgres;

--
-- Name: PaymentWebhook; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PaymentWebhook" (
    id text NOT NULL,
    "paymentTransactionId" text,
    provider public."PaymentProvider" NOT NULL,
    "eventId" character varying(100) NOT NULL,
    signature character varying(255) NOT NULL,
    payload jsonb NOT NULL,
    status public."WebhookStatus" DEFAULT 'RECEIVED'::public."WebhookStatus" NOT NULL,
    "processedAt" timestamp(3) without time zone,
    "failureReason" character varying(500),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PaymentWebhook" OWNER TO postgres;

--
-- Name: Permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Permission" (
    id text NOT NULL,
    code character varying(100) NOT NULL,
    name character varying(150) NOT NULL,
    description character varying(500),
    module character varying(50) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Permission" OWNER TO postgres;

--
-- Name: Prerequisite; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Prerequisite" (
    "courseId" text NOT NULL,
    "prerequisiteCourseId" text NOT NULL,
    "minimumGrade" numeric(5,2),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    CONSTRAINT "Prerequisite_not_self_check" CHECK (("courseId" <> "prerequisiteCourseId"))
);


ALTER TABLE public."Prerequisite" OWNER TO postgres;

--
-- Name: Question; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Question" (
    id text NOT NULL,
    "questionCode" character varying(40) NOT NULL,
    "courseId" text NOT NULL,
    content text NOT NULL,
    chapter character varying(150),
    difficulty public."DifficultyLevel" NOT NULL,
    type public."QuestionType" NOT NULL,
    explanation text,
    "shuffleOptions" boolean DEFAULT true NOT NULL,
    "createdByUserId" text NOT NULL,
    status public."RecordStatus" DEFAULT 'ACTIVE'::public."RecordStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "defaultScore" numeric(5,2) DEFAULT 1 NOT NULL
);


ALTER TABLE public."Question" OWNER TO postgres;

--
-- Name: QuestionOption; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."QuestionOption" (
    id text NOT NULL,
    "questionId" text NOT NULL,
    content text NOT NULL,
    "isCorrect" boolean DEFAULT false NOT NULL,
    "displayOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."QuestionOption" OWNER TO postgres;

--
-- Name: Receipt; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Receipt" (
    id text NOT NULL,
    "receiptNumber" character varying(50) NOT NULL,
    "invoiceId" text NOT NULL,
    "paymentTransactionId" text NOT NULL,
    amount numeric(18,0) NOT NULL,
    "issuedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "cancelReason" character varying(500),
    "cancelledAt" timestamp(3) without time zone,
    "issuedByUserId" text,
    status public."ReceiptStatus" DEFAULT 'ISSUED'::public."ReceiptStatus" NOT NULL
);


ALTER TABLE public."Receipt" OWNER TO postgres;

--
-- Name: RefreshToken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RefreshToken" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "tokenHash" character varying(255) NOT NULL,
    "familyId" character varying(100) NOT NULL,
    "replacedByTokenHash" character varying(255),
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "revokedAt" timestamp(3) without time zone,
    "createdByIp" character varying(64),
    "revokedByIp" character varying(64),
    "userAgent" character varying(500),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."RefreshToken" OWNER TO postgres;

--
-- Name: Role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Role" (
    id text NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(100) NOT NULL,
    description character varying(500),
    "isSystem" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Role" OWNER TO postgres;

--
-- Name: RolePermission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RolePermission" (
    "roleId" text NOT NULL,
    "permissionId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."RolePermission" OWNER TO postgres;

--
-- Name: Schedule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Schedule" (
    id text NOT NULL,
    "classSectionId" text NOT NULL,
    "dayOfWeek" integer NOT NULL,
    "startTime" time(0) without time zone NOT NULL,
    "endTime" time(0) without time zone NOT NULL,
    room character varying(50),
    "validFrom" date,
    "validTo" date,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    CONSTRAINT "Schedule_valid_dates_check" CHECK ((("validFrom" IS NULL) OR ("validTo" IS NULL) OR ("validFrom" <= "validTo"))),
    CONSTRAINT "Schedule_valid_times_check" CHECK (("startTime" < "endTime"))
);


ALTER TABLE public."Schedule" OWNER TO postgres;

--
-- Name: Scholarship; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Scholarship" (
    id text NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(200) NOT NULL,
    description text,
    "discountType" public."DiscountType" NOT NULL,
    "discountValue" numeric(18,2) NOT NULL,
    "maximumAmount" numeric(18,0),
    "applicableFeeTypeId" text,
    "effectiveFrom" date NOT NULL,
    "effectiveTo" date,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Scholarship" OWNER TO postgres;

--
-- Name: Semester; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Semester" (
    id text NOT NULL,
    "academicYearId" text NOT NULL,
    code character varying(30) NOT NULL,
    name character varying(100) NOT NULL,
    term public."SemesterTerm" NOT NULL,
    "startDate" date NOT NULL,
    "endDate" date NOT NULL,
    "registrationStartDate" timestamp(3) without time zone NOT NULL,
    "registrationEndDate" timestamp(3) without time zone NOT NULL,
    "maxCredits" integer DEFAULT 24 NOT NULL,
    status public."SemesterStatus" DEFAULT 'PLANNED'::public."SemesterStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    CONSTRAINT "Semester_registration_before_start_check" CHECK (("registrationEndDate" <= ("startDate")::timestamp without time zone)),
    CONSTRAINT "Semester_valid_dates_check" CHECK (("startDate" < "endDate")),
    CONSTRAINT "Semester_valid_registration_dates_check" CHECK (("registrationStartDate" < "registrationEndDate"))
);


ALTER TABLE public."Semester" OWNER TO postgres;

--
-- Name: ServiceRequest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ServiceRequest" (
    id text NOT NULL,
    "requestNumber" character varying(50) NOT NULL,
    "studentId" text NOT NULL,
    "categoryId" text NOT NULL,
    subject character varying(300) NOT NULL,
    description text NOT NULL,
    priority public."ServiceRequestPriority" DEFAULT 'NORMAL'::public."ServiceRequestPriority" NOT NULL,
    status public."ServiceRequestStatus" DEFAULT 'OPEN'::public."ServiceRequestStatus" NOT NULL,
    "assignedToUserId" text,
    "assignedByUserId" text,
    "assignedAt" timestamp(3) without time zone,
    "dueAt" timestamp(3) without time zone,
    "firstResponseAt" timestamp(3) without time zone,
    "resolvedAt" timestamp(3) without time zone,
    "resolvedByUserId" text,
    "resolutionSummary" text,
    "cancelledAt" timestamp(3) without time zone,
    "cancelledByUserId" text,
    "cancelReason" text,
    "closedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ServiceRequest" OWNER TO postgres;

--
-- Name: ServiceRequestAttachment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ServiceRequestAttachment" (
    id text NOT NULL,
    "serviceRequestId" text NOT NULL,
    "commentId" text,
    "uploadedByUserId" text NOT NULL,
    "originalName" character varying(500) NOT NULL,
    "storageKey" character varying(500) NOT NULL,
    "mimeType" character varying(100) NOT NULL,
    "sizeBytes" integer NOT NULL,
    checksum character varying(255),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."ServiceRequestAttachment" OWNER TO postgres;

--
-- Name: ServiceRequestCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ServiceRequestCategory" (
    id text NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(200) NOT NULL,
    description text,
    "owningDepartmentId" text,
    "defaultPriority" public."ServiceRequestPriority" DEFAULT 'NORMAL'::public."ServiceRequestPriority" NOT NULL,
    "defaultAssigneeRoleId" text,
    "slaHours" integer,
    "requiresAttachment" boolean DEFAULT false NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ServiceRequestCategory" OWNER TO postgres;

--
-- Name: ServiceRequestComment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ServiceRequestComment" (
    id text NOT NULL,
    "serviceRequestId" text NOT NULL,
    "authorUserId" text NOT NULL,
    content text NOT NULL,
    visibility public."CommentVisibility" DEFAULT 'PUBLIC'::public."CommentVisibility" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."ServiceRequestComment" OWNER TO postgres;

--
-- Name: Student; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Student" (
    id text NOT NULL,
    "studentCode" character varying(30) NOT NULL,
    "userId" text NOT NULL,
    "departmentId" text NOT NULL,
    "admissionAcademicYearId" text,
    "fullName" character varying(150) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(20),
    "dateOfBirth" date,
    gender public."Gender",
    address character varying(500),
    "cohortClass" character varying(50) NOT NULL,
    cohort character varying(20) NOT NULL,
    "enrollmentDate" date NOT NULL,
    "academicStatus" public."AcademicStatus" DEFAULT 'STUDYING'::public."AcademicStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."Student" OWNER TO postgres;

--
-- Name: StudentAnswer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StudentAnswer" (
    id text NOT NULL,
    "examAttemptId" text NOT NULL,
    "examAttemptQuestionId" text NOT NULL,
    "selectedOptionIds" jsonb NOT NULL,
    "isCorrect" boolean,
    "earnedPoints" numeric(6,2),
    "answeredAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."StudentAnswer" OWNER TO postgres;

--
-- Name: StudentGrade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StudentGrade" (
    id text NOT NULL,
    "gradeComponentId" text NOT NULL,
    "studentId" text NOT NULL,
    score numeric(5,2) NOT NULL,
    "gradedByUserId" text NOT NULL,
    feedback character varying(1000),
    "gradedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    CONSTRAINT "StudentGrade_score_check" CHECK ((score >= (0)::numeric))
);


ALTER TABLE public."StudentGrade" OWNER TO postgres;

--
-- Name: StudentScholarship; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StudentScholarship" (
    id text NOT NULL,
    "studentId" text NOT NULL,
    "scholarshipId" text NOT NULL,
    "semesterId" text,
    status public."ScholarshipStatus" DEFAULT 'APPROVED'::public."ScholarshipStatus" NOT NULL,
    notes text,
    "approvedByUserId" text,
    "approvedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."StudentScholarship" OWNER TO postgres;

--
-- Name: TuitionItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TuitionItem" (
    id text NOT NULL,
    "tuitionPolicyId" text NOT NULL,
    "courseId" text,
    name character varying(200) NOT NULL,
    type public."TuitionItemType" NOT NULL,
    amount numeric(18,0) NOT NULL,
    description character varying(500),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."TuitionItem" OWNER TO postgres;

--
-- Name: TuitionPolicy; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TuitionPolicy" (
    id text NOT NULL,
    "semesterId" text NOT NULL,
    name character varying(200) NOT NULL,
    description text,
    "creditFee" numeric(18,0) NOT NULL,
    "effectiveFrom" date NOT NULL,
    "effectiveTo" date,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."TuitionPolicy" OWNER TO postgres;

--
-- Name: TuitionRate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TuitionRate" (
    id text NOT NULL,
    "academicYearId" text,
    "semesterId" text,
    "departmentId" text,
    "courseId" text,
    "feeTypeId" text NOT NULL,
    "amountPerCredit" numeric(18,0),
    "fixedAmount" numeric(18,0),
    "effectiveFrom" date NOT NULL,
    "effectiveTo" date,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."TuitionRate" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email character varying(255) NOT NULL,
    "passwordHash" character varying(255) NOT NULL,
    "fullName" character varying(150) NOT NULL,
    phone character varying(20),
    "avatarUrl" character varying(500),
    status public."UserStatus" DEFAULT 'ACTIVE'::public."UserStatus" NOT NULL,
    "failedLoginAttempts" integer DEFAULT 0 NOT NULL,
    "lockedUntil" timestamp(3) without time zone,
    "lastLoginAt" timestamp(3) without time zone,
    "passwordChangedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: UserRole; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserRole" (
    "userId" text NOT NULL,
    "roleId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."UserRole" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: AcademicRiskAlert; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AcademicRiskAlert" (id, "studentId", "semesterId", type, severity, status, title, description, "ruleCode", "ruleSnapshot", "evaluationPeriod", "detectedAt", "acknowledgedAt", "acknowledgedByUserId", "resolvedAt", "resolvedByUserId", "resolutionNote", "dismissedAt", "dismissedByUserId", "dismissReason", "notificationSentAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: AcademicRiskRule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AcademicRiskRule" (id, code, name, description, type, "defaultSeverity", "thresholdConfig", "evaluationPeriodType", "isActive", "effectiveFrom", "effectiveTo", "createdAt", "updatedAt") FROM stdin;
cmrsqcy1100l8f2so17tm4l29	LOW_GPA	GPA học kỳ thấp	\N	LOW_GPA	MEDIUM	{"minGpa": 2}	semester	t	\N	\N	2026-07-20 04:34:20.101	2026-07-20 04:34:20.101
cmrsqcy1800l9f2souvwdb92t	GPA_DECLINE	GPA giảm mạnh	\N	GPA_DECLINE	MEDIUM	{"maxDecline": 0.5}	semester	t	\N	\N	2026-07-20 04:34:20.108	2026-07-20 04:34:20.108
cmrsqcy1d00laf2so08sm49b1	HIGH_ABSENCE	Tỷ lệ vắng cao	\N	HIGH_ABSENCE	HIGH	{"maxAbsenceRate": 0.2}	semester	t	\N	\N	2026-07-20 04:34:20.114	2026-07-20 04:34:20.114
cmrsqcy1j00lbf2so3c5ph9r1	CONSECUTIVE_ABSENCE	Vắng liên tiếp	\N	CONSECUTIVE_ABSENCE	HIGH	{"maxConsecutive": 3}	week	t	\N	\N	2026-07-20 04:34:20.119	2026-07-20 04:34:20.119
cmrsqcy1n00lcf2sooe5u8ow7	FAILED_COURSES	Trượt nhiều môn	\N	FAILED_COURSES	HIGH	{"maxFailedCourses": 2}	semester	t	\N	\N	2026-07-20 04:34:20.123	2026-07-20 04:34:20.123
cmrsqcy1r00ldf2so8ax35pom	LOW_CREDIT_COMPLETION	Hoàn thành ít tín chỉ	\N	LOW_CREDIT_COMPLETION	MEDIUM	{"minCompletionRate": 0.5}	semester	t	\N	\N	2026-07-20 04:34:20.128	2026-07-20 04:34:20.128
cmrsqcy1v00lef2so0teoizus	EXAM_INCOMPLETE	Bỏ lỡ kỳ thi	\N	EXAM_INCOMPLETE	MEDIUM	{"maxMissedExams": 1}	semester	t	\N	\N	2026-07-20 04:34:20.132	2026-07-20 04:34:20.132
cmrsqcy2000lff2sopp94p0im	FINANCIAL_HOLD	Công nợ quá hạn	\N	FINANCIAL_HOLD	MEDIUM	{"overdueThresholdDays": 30}	month	t	\N	\N	2026-07-20 04:34:20.136	2026-07-20 04:34:20.136
\.


--
-- Data for Name: AcademicYear; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AcademicYear" (id, code, name, "startDate", "endDate", "isCurrent", "createdAt", "updatedAt") FROM stdin;
cmrsqcw7f003ff2souurq2vsj	2025-2026	Năm học 2025 - 2026	2025-09-01	2026-08-31	t	2026-07-20 04:34:17.74	2026-07-20 04:34:17.74
\.


--
-- Data for Name: Announcement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Announcement" (id, title, summary, content, category, priority, status, "publishAt", "expiresAt", "publishedAt", "publishedByUserId", "cancelledAt", "cancelledByUserId", "cancelReason", "createdByUserId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: AnnouncementAudience; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AnnouncementAudience" (id, "announcementId", "audienceType", "roleId", "departmentId", "classSectionId", "studentId", "lecturerId", "createdAt") FROM stdin;
\.


--
-- Data for Name: AnnouncementReadReceipt; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AnnouncementReadReceipt" ("announcementId", "userId", "readAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: AttendanceRecord; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AttendanceRecord" (id, "attendanceSessionId", "studentId", status, note, "createdAt", "updatedAt", "markedAt", "markedByUserId") FROM stdin;
\.


--
-- Data for Name: AttendanceSession; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AttendanceSession" (id, "classSectionId", "createdById", "sessionDate", topic, notes, "createdAt", "updatedAt", "endTime", "startTime") FROM stdin;
\.


--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AuditLog" (id, "actorUserId", action, "entityType", "entityId", "oldValues", "newValues", "ipAddress", "userAgent", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ClassSection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ClassSection" (id, "sectionCode", "courseId", "semesterId", "lecturerId", room, "maxCapacity", "enrolledCount", status, "createdAt", "updatedAt", "deletedAt") FROM stdin;
cmrsqcwmo006bf2soo9bp627d	CS101-20252-01	cmrsqcwkv005rf2soa22bp66i	cmrsqcw7m003jf2som6m8021h	cmrsqcw8g003pf2so25mxjau1	A1.01	40	7	IN_PROGRESS	2026-07-20 04:34:18.288	2026-07-20 04:34:18.868	\N
cmrsqcwn2006ff2soz4ylvv1j	CS102-20252-02	cmrsqcwl3005tf2soi2c42j6q	cmrsqcw7m003jf2som6m8021h	cmrsqcw91003sf2so79pf1w9q	A2.02	40	8	IN_PROGRESS	2026-07-20 04:34:18.303	2026-07-20 04:34:18.876	\N
cmrsqcwna006jf2sox594bt16	CS201-20252-03	cmrsqcwl8005vf2sorqu65ikb	cmrsqcw7m003jf2som6m8021h	cmrsqcw9i003vf2sojjrnw611	A3.03	40	9	IN_PROGRESS	2026-07-20 04:34:18.31	2026-07-20 04:34:18.882	\N
cmrsqcwnj006nf2sojg7ncvvy	CS202-20252-04	cmrsqcwlc005xf2sorg3eont1	cmrsqcw7m003jf2som6m8021h	cmrsqcwa4003yf2so2s1qkckz	A4.04	40	9	IN_PROGRESS	2026-07-20 04:34:18.319	2026-07-20 04:34:18.888	\N
cmrsqcwnr006rf2soua06gz0o	CS203-20252-05	cmrsqcwli005zf2socn3jj7k9	cmrsqcw7m003jf2som6m8021h	cmrsqcwal0041f2so14en68cx	A5.01	40	8	IN_PROGRESS	2026-07-20 04:34:18.327	2026-07-20 04:34:18.893	\N
cmrsqcwny006vf2sog9s15jny	BA101-20252-06	cmrsqcwlm0061f2soum0dyhan	cmrsqcw7m003jf2som6m8021h	cmrsqcw8g003pf2so25mxjau1	A6.02	40	7	IN_PROGRESS	2026-07-20 04:34:18.335	2026-07-20 04:34:18.899	\N
cmrsqcwo8006zf2sov676a89x	BA102-20252-07	cmrsqcwls0063f2som15yrmrp	cmrsqcw7m003jf2som6m8021h	cmrsqcw91003sf2so79pf1w9q	A7.03	40	6	IN_PROGRESS	2026-07-20 04:34:18.344	2026-07-20 04:34:18.904	\N
cmrsqcwog0073f2so6a3r98tm	BA201-20252-08	cmrsqcwlx0065f2sot10j0kzq	cmrsqcw7m003jf2som6m8021h	cmrsqcw9i003vf2sojjrnw611	A8.04	40	6	IN_PROGRESS	2026-07-20 04:34:18.353	2026-07-20 04:34:18.912	\N
\.


--
-- Data for Name: Course; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Course" (id, "courseCode", name, credits, "theoryPeriods", "practicePeriods", "tuitionFeePerCredit", "departmentId", status, "createdAt", "updatedAt", "deletedAt", description) FROM stdin;
cmrsqcwkv005rf2soa22bp66i	CS101	Nhập môn lập trình	3	30	10	650000	cmrsqcw7w003kf2soklf35dc0	ACTIVE	2026-07-20 04:34:18.223	2026-07-20 04:34:18.223	\N	\N
cmrsqcwl3005tf2soi2c42j6q	CS102	Cấu trúc dữ liệu và giải thuật	4	40	20	650000	cmrsqcw7w003kf2soklf35dc0	ACTIVE	2026-07-20 04:34:18.231	2026-07-20 04:34:18.231	\N	\N
cmrsqcwl8005vf2sorqu65ikb	CS201	Cơ sở dữ liệu	3	30	10	650000	cmrsqcw7w003kf2soklf35dc0	ACTIVE	2026-07-20 04:34:18.236	2026-07-20 04:34:18.236	\N	\N
cmrsqcwlc005xf2sorg3eont1	CS202	Kỹ thuật phần mềm	3	30	10	650000	cmrsqcw7w003kf2soklf35dc0	ACTIVE	2026-07-20 04:34:18.241	2026-07-20 04:34:18.241	\N	\N
cmrsqcwli005zf2socn3jj7k9	CS203	Mạng máy tính	3	30	10	650000	cmrsqcw7w003kf2soklf35dc0	ACTIVE	2026-07-20 04:34:18.246	2026-07-20 04:34:18.246	\N	\N
cmrsqcwlm0061f2soum0dyhan	BA101	Nguyên lý quản trị	3	30	10	650000	cmrsqcw7w003lf2sov68d73bz	ACTIVE	2026-07-20 04:34:18.251	2026-07-20 04:34:18.251	\N	\N
cmrsqcwls0063f2som15yrmrp	BA102	Kinh tế vi mô	3	30	10	650000	cmrsqcw7w003lf2sov68d73bz	ACTIVE	2026-07-20 04:34:18.257	2026-07-20 04:34:18.257	\N	\N
cmrsqcwlx0065f2sot10j0kzq	BA201	Marketing căn bản	3	30	10	650000	cmrsqcw7w003lf2sov68d73bz	ACTIVE	2026-07-20 04:34:18.261	2026-07-20 04:34:18.261	\N	\N
cmrsqcwm10067f2so8k5hv5it	EN101	Tiếng Anh học thuật 1	3	30	10	650000	cmrsqcw7w003mf2so217t058j	ACTIVE	2026-07-20 04:34:18.266	2026-07-20 04:34:18.266	\N	\N
cmrsqcwm70069f2so9z99zhhn	EN102	Tiếng Anh học thuật 2	3	30	10	650000	cmrsqcw7w003mf2so217t058j	ACTIVE	2026-07-20 04:34:18.271	2026-07-20 04:34:18.271	\N	\N
\.


--
-- Data for Name: Department; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Department" (id, code, name, description, "headLecturerId", status, "createdAt", "updatedAt", "deletedAt") FROM stdin;
cmrsqcw7w003kf2soklf35dc0	CNTT	Khoa Công nghệ thông tin	Đào tạo công nghệ và kỹ thuật phần mềm	cmrsqcw8g003pf2so25mxjau1	ACTIVE	2026-07-20 04:34:17.756	2026-07-20 04:34:17.859	\N
cmrsqcw7w003lf2sov68d73bz	QTKD	Khoa Quản trị kinh doanh	Đào tạo quản trị và kinh doanh số	cmrsqcw91003sf2so79pf1w9q	ACTIVE	2026-07-20 04:34:17.756	2026-07-20 04:34:17.865	\N
cmrsqcw7w003mf2so217t058j	NN	Khoa Ngoại ngữ	Đào tạo ngôn ngữ và giao tiếp quốc tế	cmrsqcw9i003vf2sojjrnw611	ACTIVE	2026-07-20 04:34:17.756	2026-07-20 04:34:17.869	\N
\.


--
-- Data for Name: Enrollment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Enrollment" (id, "studentId", "classSectionId", status, "enrolledAt", "droppedAt", "finalScore", "letterGrade", passed, "createdAt", "updatedAt", "finalGradePublishedAt", "finalGradePublishedByUserId") FROM stdin;
cmrsqcwoo0077f2soyqpvy1ox	cmrsqcwbj0044f2soug319lxa	cmrsqcwmo006bf2soo9bp627d	ENROLLED	2026-07-20 04:34:18.361	\N	\N	\N	\N	2026-07-20 04:34:18.361	2026-07-20 04:34:18.361	\N	\N
cmrsqcwp10079f2soziawbjtp	cmrsqcwbj0044f2soug319lxa	cmrsqcwn2006ff2soz4ylvv1j	ENROLLED	2026-07-20 04:34:18.373	\N	\N	\N	\N	2026-07-20 04:34:18.373	2026-07-20 04:34:18.373	\N	\N
cmrsqcwpa007bf2so01bn3i0l	cmrsqcwbj0044f2soug319lxa	cmrsqcwna006jf2sox594bt16	ENROLLED	2026-07-20 04:34:18.383	\N	\N	\N	\N	2026-07-20 04:34:18.383	2026-07-20 04:34:18.383	\N	\N
cmrsqcwpj007df2sop3vz6vft	cmrsqcwc60047f2so7vfe51gp	cmrsqcwn2006ff2soz4ylvv1j	ENROLLED	2026-07-20 04:34:18.391	\N	\N	\N	\N	2026-07-20 04:34:18.391	2026-07-20 04:34:18.391	\N	\N
cmrsqcwpr007ff2so20psjrek	cmrsqcwc60047f2so7vfe51gp	cmrsqcwna006jf2sox594bt16	ENROLLED	2026-07-20 04:34:18.4	\N	\N	\N	\N	2026-07-20 04:34:18.4	2026-07-20 04:34:18.4	\N	\N
cmrsqcwq1007hf2sovy2jp7ap	cmrsqcwc60047f2so7vfe51gp	cmrsqcwnj006nf2sojg7ncvvy	ENROLLED	2026-07-20 04:34:18.409	\N	\N	\N	\N	2026-07-20 04:34:18.409	2026-07-20 04:34:18.409	\N	\N
cmrsqcwqa007jf2so5a4lacus	cmrsqcwcp004af2so1x8mfaad	cmrsqcwna006jf2sox594bt16	ENROLLED	2026-07-20 04:34:18.419	\N	\N	\N	\N	2026-07-20 04:34:18.419	2026-07-20 04:34:18.419	\N	\N
cmrsqcwqj007lf2so1hr7uza5	cmrsqcwcp004af2so1x8mfaad	cmrsqcwnj006nf2sojg7ncvvy	ENROLLED	2026-07-20 04:34:18.427	\N	\N	\N	\N	2026-07-20 04:34:18.427	2026-07-20 04:34:18.427	\N	\N
cmrsqcwqu007nf2soj2pgiam0	cmrsqcwcp004af2so1x8mfaad	cmrsqcwnr006rf2soua06gz0o	ENROLLED	2026-07-20 04:34:18.438	\N	\N	\N	\N	2026-07-20 04:34:18.438	2026-07-20 04:34:18.438	\N	\N
cmrsqcwr4007pf2so6cecll7x	cmrsqcwd9004df2so4a3ua6ud	cmrsqcwnj006nf2sojg7ncvvy	ENROLLED	2026-07-20 04:34:18.448	\N	\N	\N	\N	2026-07-20 04:34:18.448	2026-07-20 04:34:18.448	\N	\N
cmrsqcwrd007rf2soc1q1f9d1	cmrsqcwd9004df2so4a3ua6ud	cmrsqcwnr006rf2soua06gz0o	ENROLLED	2026-07-20 04:34:18.457	\N	\N	\N	\N	2026-07-20 04:34:18.457	2026-07-20 04:34:18.457	\N	\N
cmrsqcwrl007tf2sobjiw0o74	cmrsqcwd9004df2so4a3ua6ud	cmrsqcwny006vf2sog9s15jny	ENROLLED	2026-07-20 04:34:18.465	\N	\N	\N	\N	2026-07-20 04:34:18.465	2026-07-20 04:34:18.465	\N	\N
cmrsqcwrv007vf2somt57w882	cmrsqcwds004gf2sosu6oxi81	cmrsqcwnr006rf2soua06gz0o	ENROLLED	2026-07-20 04:34:18.475	\N	\N	\N	\N	2026-07-20 04:34:18.475	2026-07-20 04:34:18.475	\N	\N
cmrsqcws3007xf2soegrd8ors	cmrsqcwds004gf2sosu6oxi81	cmrsqcwny006vf2sog9s15jny	ENROLLED	2026-07-20 04:34:18.483	\N	\N	\N	\N	2026-07-20 04:34:18.483	2026-07-20 04:34:18.483	\N	\N
cmrsqcwsb007zf2so2ycu2h3y	cmrsqcwds004gf2sosu6oxi81	cmrsqcwo8006zf2sov676a89x	ENROLLED	2026-07-20 04:34:18.491	\N	\N	\N	\N	2026-07-20 04:34:18.491	2026-07-20 04:34:18.491	\N	\N
cmrsqcwsl0081f2so0hzxqy95	cmrsqcwe8004jf2soclxsy1ls	cmrsqcwny006vf2sog9s15jny	ENROLLED	2026-07-20 04:34:18.502	\N	\N	\N	\N	2026-07-20 04:34:18.502	2026-07-20 04:34:18.502	\N	\N
cmrsqcwst0083f2so7rg09zt7	cmrsqcwe8004jf2soclxsy1ls	cmrsqcwo8006zf2sov676a89x	ENROLLED	2026-07-20 04:34:18.509	\N	\N	\N	\N	2026-07-20 04:34:18.509	2026-07-20 04:34:18.509	\N	\N
cmrsqcwt20085f2so6zax5gbz	cmrsqcwe8004jf2soclxsy1ls	cmrsqcwog0073f2so6a3r98tm	ENROLLED	2026-07-20 04:34:18.519	\N	\N	\N	\N	2026-07-20 04:34:18.519	2026-07-20 04:34:18.519	\N	\N
cmrsqcwtb0087f2sobhu3hmm8	cmrsqcweo004mf2so63kw8g4l	cmrsqcwo8006zf2sov676a89x	ENROLLED	2026-07-20 04:34:18.527	\N	\N	\N	\N	2026-07-20 04:34:18.527	2026-07-20 04:34:18.527	\N	\N
cmrsqcwti0089f2solarivpr5	cmrsqcweo004mf2so63kw8g4l	cmrsqcwog0073f2so6a3r98tm	ENROLLED	2026-07-20 04:34:18.534	\N	\N	\N	\N	2026-07-20 04:34:18.534	2026-07-20 04:34:18.534	\N	\N
cmrsqcwtr008bf2sobn6rk0io	cmrsqcweo004mf2so63kw8g4l	cmrsqcwmo006bf2soo9bp627d	ENROLLED	2026-07-20 04:34:18.543	\N	\N	\N	\N	2026-07-20 04:34:18.543	2026-07-20 04:34:18.543	\N	\N
cmrsqcwtz008df2so5hamuxxv	cmrsqcwf3004pf2socg42regd	cmrsqcwog0073f2so6a3r98tm	ENROLLED	2026-07-20 04:34:18.551	\N	\N	\N	\N	2026-07-20 04:34:18.551	2026-07-20 04:34:18.551	\N	\N
cmrsqcwu8008ff2sothfashh9	cmrsqcwf3004pf2socg42regd	cmrsqcwmo006bf2soo9bp627d	ENROLLED	2026-07-20 04:34:18.56	\N	\N	\N	\N	2026-07-20 04:34:18.56	2026-07-20 04:34:18.56	\N	\N
cmrsqcwug008hf2sovgs8iilv	cmrsqcwf3004pf2socg42regd	cmrsqcwn2006ff2soz4ylvv1j	ENROLLED	2026-07-20 04:34:18.569	\N	\N	\N	\N	2026-07-20 04:34:18.569	2026-07-20 04:34:18.569	\N	\N
cmrsqcwuo008jf2somabgf8d6	cmrsqcwfk004sf2so0azxg5b1	cmrsqcwmo006bf2soo9bp627d	ENROLLED	2026-07-20 04:34:18.576	\N	\N	\N	\N	2026-07-20 04:34:18.576	2026-07-20 04:34:18.576	\N	\N
cmrsqcwuw008lf2sova9dl0w0	cmrsqcwfk004sf2so0azxg5b1	cmrsqcwn2006ff2soz4ylvv1j	ENROLLED	2026-07-20 04:34:18.584	\N	\N	\N	\N	2026-07-20 04:34:18.584	2026-07-20 04:34:18.584	\N	\N
cmrsqcwv2008nf2soxdhnt75z	cmrsqcwfk004sf2so0azxg5b1	cmrsqcwna006jf2sox594bt16	ENROLLED	2026-07-20 04:34:18.59	\N	\N	\N	\N	2026-07-20 04:34:18.59	2026-07-20 04:34:18.59	\N	\N
cmrsqcwva008pf2so9m1t2bxs	cmrsqcwg0004vf2sojyym7evy	cmrsqcwn2006ff2soz4ylvv1j	ENROLLED	2026-07-20 04:34:18.598	\N	\N	\N	\N	2026-07-20 04:34:18.598	2026-07-20 04:34:18.598	\N	\N
cmrsqcwvi008rf2sohl43a63k	cmrsqcwg0004vf2sojyym7evy	cmrsqcwna006jf2sox594bt16	ENROLLED	2026-07-20 04:34:18.606	\N	\N	\N	\N	2026-07-20 04:34:18.606	2026-07-20 04:34:18.606	\N	\N
cmrsqcwvp008tf2soqo3oag2u	cmrsqcwg0004vf2sojyym7evy	cmrsqcwnj006nf2sojg7ncvvy	ENROLLED	2026-07-20 04:34:18.613	\N	\N	\N	\N	2026-07-20 04:34:18.613	2026-07-20 04:34:18.613	\N	\N
cmrsqcwvx008vf2sott8mywnz	cmrsqcwgi004yf2soqfr1565a	cmrsqcwna006jf2sox594bt16	ENROLLED	2026-07-20 04:34:18.621	\N	\N	\N	\N	2026-07-20 04:34:18.621	2026-07-20 04:34:18.621	\N	\N
cmrsqcww5008xf2sotxlrm7qf	cmrsqcwgi004yf2soqfr1565a	cmrsqcwnj006nf2sojg7ncvvy	ENROLLED	2026-07-20 04:34:18.629	\N	\N	\N	\N	2026-07-20 04:34:18.629	2026-07-20 04:34:18.629	\N	\N
cmrsqcwwe008zf2sorfa5ai3y	cmrsqcwgi004yf2soqfr1565a	cmrsqcwnr006rf2soua06gz0o	ENROLLED	2026-07-20 04:34:18.638	\N	\N	\N	\N	2026-07-20 04:34:18.638	2026-07-20 04:34:18.638	\N	\N
cmrsqcwwl0091f2sot0drt84d	cmrsqcwh00051f2somlg95o05	cmrsqcwnj006nf2sojg7ncvvy	ENROLLED	2026-07-20 04:34:18.645	\N	\N	\N	\N	2026-07-20 04:34:18.645	2026-07-20 04:34:18.645	\N	\N
cmrsqcwwt0093f2soxljv3mze	cmrsqcwh00051f2somlg95o05	cmrsqcwnr006rf2soua06gz0o	ENROLLED	2026-07-20 04:34:18.653	\N	\N	\N	\N	2026-07-20 04:34:18.653	2026-07-20 04:34:18.653	\N	\N
cmrsqcwx10095f2someh9zo0s	cmrsqcwh00051f2somlg95o05	cmrsqcwny006vf2sog9s15jny	ENROLLED	2026-07-20 04:34:18.661	\N	\N	\N	\N	2026-07-20 04:34:18.661	2026-07-20 04:34:18.661	\N	\N
cmrsqcwx80097f2so8udv6nlt	cmrsqcwhg0054f2so5oc0mqds	cmrsqcwnr006rf2soua06gz0o	ENROLLED	2026-07-20 04:34:18.668	\N	\N	\N	\N	2026-07-20 04:34:18.668	2026-07-20 04:34:18.668	\N	\N
cmrsqcwxf0099f2sorofhexs4	cmrsqcwhg0054f2so5oc0mqds	cmrsqcwny006vf2sog9s15jny	ENROLLED	2026-07-20 04:34:18.675	\N	\N	\N	\N	2026-07-20 04:34:18.675	2026-07-20 04:34:18.675	\N	\N
cmrsqcwxl009bf2soh8zeuxqf	cmrsqcwhg0054f2so5oc0mqds	cmrsqcwo8006zf2sov676a89x	ENROLLED	2026-07-20 04:34:18.682	\N	\N	\N	\N	2026-07-20 04:34:18.682	2026-07-20 04:34:18.682	\N	\N
cmrsqcwxu009df2soknxloe43	cmrsqcwhu0057f2soum8xc95j	cmrsqcwny006vf2sog9s15jny	ENROLLED	2026-07-20 04:34:18.69	\N	\N	\N	\N	2026-07-20 04:34:18.69	2026-07-20 04:34:18.69	\N	\N
cmrsqcwy1009ff2sostg3ci55	cmrsqcwhu0057f2soum8xc95j	cmrsqcwo8006zf2sov676a89x	ENROLLED	2026-07-20 04:34:18.697	\N	\N	\N	\N	2026-07-20 04:34:18.697	2026-07-20 04:34:18.697	\N	\N
cmrsqcwy9009hf2sofwfiyvd0	cmrsqcwhu0057f2soum8xc95j	cmrsqcwog0073f2so6a3r98tm	ENROLLED	2026-07-20 04:34:18.705	\N	\N	\N	\N	2026-07-20 04:34:18.705	2026-07-20 04:34:18.705	\N	\N
cmrsqcwyh009jf2sov3ao3ufr	cmrsqcwid005af2so684vefga	cmrsqcwo8006zf2sov676a89x	ENROLLED	2026-07-20 04:34:18.714	\N	\N	\N	\N	2026-07-20 04:34:18.714	2026-07-20 04:34:18.714	\N	\N
cmrsqcwyp009lf2soao3wf77c	cmrsqcwid005af2so684vefga	cmrsqcwog0073f2so6a3r98tm	ENROLLED	2026-07-20 04:34:18.721	\N	\N	\N	\N	2026-07-20 04:34:18.721	2026-07-20 04:34:18.721	\N	\N
cmrsqcwyx009nf2so1637bq16	cmrsqcwid005af2so684vefga	cmrsqcwmo006bf2soo9bp627d	ENROLLED	2026-07-20 04:34:18.73	\N	\N	\N	\N	2026-07-20 04:34:18.73	2026-07-20 04:34:18.73	\N	\N
cmrsqcwz7009pf2solxhcidwd	cmrsqcwit005df2so3is4ugjo	cmrsqcwog0073f2so6a3r98tm	ENROLLED	2026-07-20 04:34:18.739	\N	\N	\N	\N	2026-07-20 04:34:18.739	2026-07-20 04:34:18.739	\N	\N
cmrsqcwze009rf2so5ya222kq	cmrsqcwit005df2so3is4ugjo	cmrsqcwmo006bf2soo9bp627d	ENROLLED	2026-07-20 04:34:18.746	\N	\N	\N	\N	2026-07-20 04:34:18.746	2026-07-20 04:34:18.746	\N	\N
cmrsqcwzk009tf2sowdh995dp	cmrsqcwit005df2so3is4ugjo	cmrsqcwn2006ff2soz4ylvv1j	ENROLLED	2026-07-20 04:34:18.752	\N	\N	\N	\N	2026-07-20 04:34:18.752	2026-07-20 04:34:18.752	\N	\N
cmrsqcwzr009vf2sovv77ht8x	cmrsqcwjb005gf2so1t3i49s2	cmrsqcwmo006bf2soo9bp627d	ENROLLED	2026-07-20 04:34:18.759	\N	\N	\N	\N	2026-07-20 04:34:18.759	2026-07-20 04:34:18.759	\N	\N
cmrsqcwzx009xf2soqdn5d9c9	cmrsqcwjb005gf2so1t3i49s2	cmrsqcwn2006ff2soz4ylvv1j	ENROLLED	2026-07-20 04:34:18.766	\N	\N	\N	\N	2026-07-20 04:34:18.766	2026-07-20 04:34:18.766	\N	\N
cmrsqcx07009zf2solhskv5mx	cmrsqcwjb005gf2so1t3i49s2	cmrsqcwna006jf2sox594bt16	ENROLLED	2026-07-20 04:34:18.775	\N	\N	\N	\N	2026-07-20 04:34:18.775	2026-07-20 04:34:18.775	\N	\N
cmrsqcx0e00a1f2sopxy57g4z	cmrsqcwjr005jf2so956meaht	cmrsqcwn2006ff2soz4ylvv1j	ENROLLED	2026-07-20 04:34:18.782	\N	\N	\N	\N	2026-07-20 04:34:18.782	2026-07-20 04:34:18.782	\N	\N
cmrsqcx0m00a3f2soko2d41d3	cmrsqcwjr005jf2so956meaht	cmrsqcwna006jf2sox594bt16	ENROLLED	2026-07-20 04:34:18.79	\N	\N	\N	\N	2026-07-20 04:34:18.79	2026-07-20 04:34:18.79	\N	\N
cmrsqcx0v00a5f2soyy2qyzoq	cmrsqcwjr005jf2so956meaht	cmrsqcwnj006nf2sojg7ncvvy	ENROLLED	2026-07-20 04:34:18.799	\N	\N	\N	\N	2026-07-20 04:34:18.799	2026-07-20 04:34:18.799	\N	\N
cmrsqcx1200a7f2so3wmgo8ct	cmrsqcwk8005mf2sowzurxw9r	cmrsqcwna006jf2sox594bt16	ENROLLED	2026-07-20 04:34:18.806	\N	\N	\N	\N	2026-07-20 04:34:18.806	2026-07-20 04:34:18.806	\N	\N
cmrsqcx1900a9f2sothnulcc7	cmrsqcwk8005mf2sowzurxw9r	cmrsqcwnj006nf2sojg7ncvvy	ENROLLED	2026-07-20 04:34:18.813	\N	\N	\N	\N	2026-07-20 04:34:18.813	2026-07-20 04:34:18.813	\N	\N
cmrsqcx1h00abf2soqld7wc07	cmrsqcwk8005mf2sowzurxw9r	cmrsqcwnr006rf2soua06gz0o	ENROLLED	2026-07-20 04:34:18.821	\N	\N	\N	\N	2026-07-20 04:34:18.821	2026-07-20 04:34:18.821	\N	\N
cmrsqcx1p00adf2so5res4glh	cmrsqcwkp005pf2sogkc512r5	cmrsqcwnj006nf2sojg7ncvvy	ENROLLED	2026-07-20 04:34:18.829	\N	\N	\N	\N	2026-07-20 04:34:18.829	2026-07-20 04:34:18.829	\N	\N
cmrsqcx1x00aff2so2vfl2q8s	cmrsqcwkp005pf2sogkc512r5	cmrsqcwnr006rf2soua06gz0o	ENROLLED	2026-07-20 04:34:18.837	\N	\N	\N	\N	2026-07-20 04:34:18.837	2026-07-20 04:34:18.837	\N	\N
cmrsqcx2500ahf2socj22gozn	cmrsqcwkp005pf2sogkc512r5	cmrsqcwny006vf2sog9s15jny	ENROLLED	2026-07-20 04:34:18.845	\N	\N	\N	\N	2026-07-20 04:34:18.845	2026-07-20 04:34:18.845	\N	\N
\.


--
-- Data for Name: Exam; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Exam" (id, "examCode", name, "courseId", "classSectionId", "createdByUserId", "startsAt", "endsAt", "durationMinutes", "maxAttempts", "passScore", "questionCount", "shuffleQuestions", "shuffleOptions", "showResult", "answerPublishAt", status, "createdAt", "updatedAt", "deletedAt", "allowLateStart", "allowReview", "autoSubmit", description, "showResultMode") FROM stdin;
cmrsqcxlu00ivf2sojmw4eoc1	EXAM-20252-1	Kiểm tra mẫu 1	cmrsqcwkv005rf2soa22bp66i	cmrsqcwmo006bf2soo9bp627d	cmrsqcw84003nf2so8oq7apwm	2026-07-20 01:00:00	2026-07-20 04:00:00	60	1	5.00	10	t	t	t	\N	SCHEDULED	2026-07-20 04:34:19.554	2026-07-20 04:34:19.554	\N	t	f	t	\N	NEVER
cmrsqcxq600jhf2sob07f4x3n	EXAM-20252-2	Kiểm tra mẫu 2	cmrsqcwl3005tf2soi2c42j6q	cmrsqcwn2006ff2soz4ylvv1j	cmrsqcw8o003qf2soviwyfjye	2026-07-21 01:00:00	2026-07-21 04:00:00	60	1	5.00	10	t	t	t	\N	SCHEDULED	2026-07-20 04:34:19.71	2026-07-20 04:34:19.71	\N	t	f	t	\N	NEVER
\.


--
-- Data for Name: ExamAssignment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ExamAssignment" (id, "examId", "studentId", "assignedAt", "createdAt", "updatedAt") FROM stdin;
cmrsqcxn600ixf2so434i9kdj	cmrsqcxlu00ivf2sojmw4eoc1	cmrsqcwbj0044f2soug319lxa	2026-07-20 04:34:19.602	2026-07-20 04:34:19.602	2026-07-20 04:34:19.602
cmrsqcxni00izf2sow6imub21	cmrsqcxlu00ivf2sojmw4eoc1	cmrsqcwc60047f2so7vfe51gp	2026-07-20 04:34:19.614	2026-07-20 04:34:19.614	2026-07-20 04:34:19.614
cmrsqcxnp00j1f2sovto2cfsm	cmrsqcxlu00ivf2sojmw4eoc1	cmrsqcwcp004af2so1x8mfaad	2026-07-20 04:34:19.621	2026-07-20 04:34:19.621	2026-07-20 04:34:19.621
cmrsqcxnx00j3f2so06awjsdt	cmrsqcxlu00ivf2sojmw4eoc1	cmrsqcwd9004df2so4a3ua6ud	2026-07-20 04:34:19.629	2026-07-20 04:34:19.629	2026-07-20 04:34:19.629
cmrsqcxos00j5f2so109wlw9f	cmrsqcxlu00ivf2sojmw4eoc1	cmrsqcwds004gf2sosu6oxi81	2026-07-20 04:34:19.661	2026-07-20 04:34:19.661	2026-07-20 04:34:19.661
cmrsqcxp300j7f2soiydx968f	cmrsqcxlu00ivf2sojmw4eoc1	cmrsqcwe8004jf2soclxsy1ls	2026-07-20 04:34:19.672	2026-07-20 04:34:19.672	2026-07-20 04:34:19.672
cmrsqcxpc00j9f2sor3k9fehl	cmrsqcxlu00ivf2sojmw4eoc1	cmrsqcweo004mf2so63kw8g4l	2026-07-20 04:34:19.68	2026-07-20 04:34:19.68	2026-07-20 04:34:19.68
cmrsqcxpk00jbf2sos4kup9eu	cmrsqcxlu00ivf2sojmw4eoc1	cmrsqcwf3004pf2socg42regd	2026-07-20 04:34:19.688	2026-07-20 04:34:19.688	2026-07-20 04:34:19.688
cmrsqcxpr00jdf2sort2o7x7b	cmrsqcxlu00ivf2sojmw4eoc1	cmrsqcwfk004sf2so0azxg5b1	2026-07-20 04:34:19.695	2026-07-20 04:34:19.695	2026-07-20 04:34:19.695
cmrsqcxpy00jff2sonj83jama	cmrsqcxlu00ivf2sojmw4eoc1	cmrsqcwg0004vf2sojyym7evy	2026-07-20 04:34:19.702	2026-07-20 04:34:19.702	2026-07-20 04:34:19.702
cmrsqcxrb00jjf2sovg5bz9ot	cmrsqcxq600jhf2sob07f4x3n	cmrsqcwbj0044f2soug319lxa	2026-07-20 04:34:19.751	2026-07-20 04:34:19.751	2026-07-20 04:34:19.751
cmrsqcxrl00jlf2so84set7dk	cmrsqcxq600jhf2sob07f4x3n	cmrsqcwc60047f2so7vfe51gp	2026-07-20 04:34:19.761	2026-07-20 04:34:19.761	2026-07-20 04:34:19.761
cmrsqcxrt00jnf2sooxlv0vrx	cmrsqcxq600jhf2sob07f4x3n	cmrsqcwcp004af2so1x8mfaad	2026-07-20 04:34:19.77	2026-07-20 04:34:19.77	2026-07-20 04:34:19.77
cmrsqcxs000jpf2so85xgbx7h	cmrsqcxq600jhf2sob07f4x3n	cmrsqcwd9004df2so4a3ua6ud	2026-07-20 04:34:19.777	2026-07-20 04:34:19.777	2026-07-20 04:34:19.777
cmrsqcxs900jrf2soxze9u0vc	cmrsqcxq600jhf2sob07f4x3n	cmrsqcwds004gf2sosu6oxi81	2026-07-20 04:34:19.785	2026-07-20 04:34:19.785	2026-07-20 04:34:19.785
cmrsqcxsi00jtf2soa5tok92x	cmrsqcxq600jhf2sob07f4x3n	cmrsqcwe8004jf2soclxsy1ls	2026-07-20 04:34:19.794	2026-07-20 04:34:19.794	2026-07-20 04:34:19.794
cmrsqcxst00jvf2sozrykkoun	cmrsqcxq600jhf2sob07f4x3n	cmrsqcweo004mf2so63kw8g4l	2026-07-20 04:34:19.805	2026-07-20 04:34:19.805	2026-07-20 04:34:19.805
cmrsqcxt300jxf2sok7n5bx63	cmrsqcxq600jhf2sob07f4x3n	cmrsqcwf3004pf2socg42regd	2026-07-20 04:34:19.815	2026-07-20 04:34:19.815	2026-07-20 04:34:19.815
cmrsqcxtc00jzf2sogj9ydw6l	cmrsqcxq600jhf2sob07f4x3n	cmrsqcwfk004sf2so0azxg5b1	2026-07-20 04:34:19.824	2026-07-20 04:34:19.824	2026-07-20 04:34:19.824
cmrsqcxtl00k1f2soxb0n3awr	cmrsqcxq600jhf2sob07f4x3n	cmrsqcwg0004vf2sojyym7evy	2026-07-20 04:34:19.834	2026-07-20 04:34:19.834	2026-07-20 04:34:19.834
\.


--
-- Data for Name: ExamAttempt; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ExamAttempt" (id, "examId", "studentId", "attemptNumber", "startedAt", "expiresAt", "submittedAt", status, score, percentage, passed, "ipAddress", "userAgent", "tabSwitchCount", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ExamAttemptQuestion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ExamAttemptQuestion" (id, "examAttemptId", "questionId", "contentSnapshot", "typeSnapshot", "optionsSnapshot", "correctAnswerSnapshot", "explanationSnapshot", points, "displayOrder", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ExamQuestion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ExamQuestion" ("examId", "questionId", points, "displayOrder", "createdAt", "updatedAt") FROM stdin;
cmrsqcxlu00ivf2sojmw4eoc1	cmrsqcx4300ajf2so4jit6t9f	1.00	1	2026-07-20 04:34:19.561	2026-07-20 04:34:19.561
cmrsqcxlu00ivf2sojmw4eoc1	cmrsqcx4q00atf2soibx0yrhu	1.00	2	2026-07-20 04:34:19.568	2026-07-20 04:34:19.568
cmrsqcxlu00ivf2sojmw4eoc1	cmrsqcx5h00b3f2som7l8zzsd	1.00	3	2026-07-20 04:34:19.572	2026-07-20 04:34:19.572
cmrsqcxlu00ivf2sojmw4eoc1	cmrsqcx6400bdf2soicp7icne	1.00	4	2026-07-20 04:34:19.576	2026-07-20 04:34:19.576
cmrsqcxlu00ivf2sojmw4eoc1	cmrsqcx6n00bnf2sohyu9az09	1.00	5	2026-07-20 04:34:19.58	2026-07-20 04:34:19.58
cmrsqcxlu00ivf2sojmw4eoc1	cmrsqcx7700bxf2sorq97dnl0	1.00	6	2026-07-20 04:34:19.584	2026-07-20 04:34:19.584
cmrsqcxlu00ivf2sojmw4eoc1	cmrsqcx7q00c7f2so9er0zk1d	1.00	7	2026-07-20 04:34:19.587	2026-07-20 04:34:19.587
cmrsqcxlu00ivf2sojmw4eoc1	cmrsqcx8g00chf2soevtbaj1s	1.00	8	2026-07-20 04:34:19.591	2026-07-20 04:34:19.591
cmrsqcxlu00ivf2sojmw4eoc1	cmrsqcx9500crf2so701v4raj	1.00	9	2026-07-20 04:34:19.594	2026-07-20 04:34:19.594
cmrsqcxlu00ivf2sojmw4eoc1	cmrsqcx9r00d1f2so2r2agt8v	1.00	10	2026-07-20 04:34:19.598	2026-07-20 04:34:19.598
cmrsqcxq600jhf2sob07f4x3n	cmrsqcxac00dbf2sohvq8ibor	1.00	1	2026-07-20 04:34:19.715	2026-07-20 04:34:19.715
cmrsqcxq600jhf2sob07f4x3n	cmrsqcxax00dlf2soi5m72nte	1.00	2	2026-07-20 04:34:19.718	2026-07-20 04:34:19.718
cmrsqcxq600jhf2sob07f4x3n	cmrsqcxbq00dvf2so0em7nplb	1.00	3	2026-07-20 04:34:19.722	2026-07-20 04:34:19.722
cmrsqcxq600jhf2sob07f4x3n	cmrsqcxck00e5f2sov77af6ad	1.00	4	2026-07-20 04:34:19.726	2026-07-20 04:34:19.726
cmrsqcxq600jhf2sob07f4x3n	cmrsqcxd500eff2sogb6j0oee	1.00	5	2026-07-20 04:34:19.729	2026-07-20 04:34:19.729
cmrsqcxq600jhf2sob07f4x3n	cmrsqcxds00epf2sokc67pvql	1.00	6	2026-07-20 04:34:19.732	2026-07-20 04:34:19.732
cmrsqcxq600jhf2sob07f4x3n	cmrsqcxel00ezf2sonejjlmrh	1.00	7	2026-07-20 04:34:19.736	2026-07-20 04:34:19.736
cmrsqcxq600jhf2sob07f4x3n	cmrsqcxf300f9f2sougaad3vd	1.00	8	2026-07-20 04:34:19.74	2026-07-20 04:34:19.74
cmrsqcxq600jhf2sob07f4x3n	cmrsqcxfj00fjf2soflgu1d1s	1.00	9	2026-07-20 04:34:19.744	2026-07-20 04:34:19.744
cmrsqcxq600jhf2sob07f4x3n	cmrsqcxg300ftf2so0ot0oxuk	1.00	10	2026-07-20 04:34:19.747	2026-07-20 04:34:19.747
\.


--
-- Data for Name: FeeType; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FeeType" (id, code, name, description, category, "calculationMethod", "defaultAmount", "isMandatory", "isActive", "createdAt", "updatedAt") FROM stdin;
cmrsqcxui00k6f2so5ivjbk3o	TUITION	Học phí	\N	TUITION	PER_CREDIT	0	t	t	2026-07-20 04:34:19.867	2026-07-20 04:34:19.867
cmrsqcxuw00k7f2socjmrqfdb	REGISTRATION_FEE	Phí nhập học	\N	OTHER	FIXED	0	t	t	2026-07-20 04:34:19.88	2026-07-20 04:34:19.88
cmrsqcxv600k8f2so2x2sspde	EXAM_FEE	Phí thi lại	\N	EXAM	FIXED	0	f	t	2026-07-20 04:34:19.891	2026-07-20 04:34:19.891
\.


--
-- Data for Name: FinancialAdjustment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FinancialAdjustment" (id, "studentId", "invoiceId", type, amount, reason, "createdByUserId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: GradeComponent; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."GradeComponent" (id, "classSectionId", name, type, weight, "maxScore", "displayOrder", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Invoice; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Invoice" (id, "invoiceCode", "studentId", "semesterId", subtotal, "discountAmount", "scholarshipAmount", "previousDebt", "totalAmount", "paidAmount", "balanceAmount", "dueDate", status, "createdAt", "updatedAt", "adjustmentAmount", "cancelReason", "cancelledAt", "cancelledByUserId", "issueDate", "issuedAt", "issuedByUserId", notes) FROM stdin;
cmrsqcxx100khf2so3u5w2onw	INV-20252-0002	cmrsqcwc60047f2so7vfe51gp	cmrsqcw7m003jf2som6m8021h	7800000	0	0	0	8100000	0	8100000	2026-07-31	UNPAID	2026-07-20 04:34:19.957	2026-07-20 04:34:19.957	0	\N	\N	\N	\N	\N	\N	\N
cmrsqcxxj00klf2so9oipbg0f	INV-20252-0003	cmrsqcwcp004af2so1x8mfaad	cmrsqcw7m003jf2som6m8021h	7800000	0	0	0	8100000	0	8100000	2026-07-31	UNPAID	2026-07-20 04:34:19.975	2026-07-20 04:34:19.975	0	\N	\N	\N	\N	\N	\N	\N
cmrsqcxxx00kpf2so243ljayq	INV-20252-0004	cmrsqcwd9004df2so4a3ua6ud	cmrsqcw7m003jf2som6m8021h	7800000	0	0	0	8100000	0	8100000	2026-07-31	UNPAID	2026-07-20 04:34:19.989	2026-07-20 04:34:19.989	0	\N	\N	\N	\N	\N	\N	\N
cmrsqcxyb00ktf2soibewupm1	INV-20252-0005	cmrsqcwds004gf2sosu6oxi81	cmrsqcw7m003jf2som6m8021h	7800000	0	0	0	8100000	0	8100000	2026-07-31	UNPAID	2026-07-20 04:34:20.003	2026-07-20 04:34:20.003	0	\N	\N	\N	\N	\N	\N	\N
cmrsqcxw600kdf2solaykpwqw	INV-20252-0001	cmrsqcwbj0044f2soug319lxa	cmrsqcw7m003jf2som6m8021h	7800000	0	0	0	8100000	2000000	6100000	2026-07-31	PARTIALLY_PAID	2026-07-20 04:34:19.926	2026-07-20 04:34:20.038	0	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: InvoiceItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."InvoiceItem" (id, "invoiceId", "tuitionItemId", description, quantity, "unitAmount", "totalAmount", "createdAt", "updatedAt", "calculationSnapshot", "courseId", "discountAmount", "enrollmentId", "feeTypeId") FROM stdin;
cmrsqcxwr00kef2sos9ifaz4o	cmrsqcxw600kdf2solaykpwqw	\N	Học phí 12 tín chỉ	12	650000	7800000	2026-07-20 04:34:19.948	2026-07-20 04:34:19.948	\N	\N	0	\N	\N
cmrsqcxwr00kff2sonmilm9rl	cmrsqcxw600kdf2solaykpwqw	cmrsqcxuc00k5f2so7sooz4l7	Phí dịch vụ sinh viên	1	300000	300000	2026-07-20 04:34:19.948	2026-07-20 04:34:19.948	\N	\N	0	\N	\N
cmrsqcxxd00kif2so9tmh858e	cmrsqcxx100khf2so3u5w2onw	\N	Học phí 12 tín chỉ	12	650000	7800000	2026-07-20 04:34:19.969	2026-07-20 04:34:19.969	\N	\N	0	\N	\N
cmrsqcxxd00kjf2sof4c5z9s8	cmrsqcxx100khf2so3u5w2onw	cmrsqcxuc00k5f2so7sooz4l7	Phí dịch vụ sinh viên	1	300000	300000	2026-07-20 04:34:19.969	2026-07-20 04:34:19.969	\N	\N	0	\N	\N
cmrsqcxxs00kmf2sop98skk04	cmrsqcxxj00klf2so9oipbg0f	\N	Học phí 12 tín chỉ	12	650000	7800000	2026-07-20 04:34:19.984	2026-07-20 04:34:19.984	\N	\N	0	\N	\N
cmrsqcxxs00knf2sor0rx7ksg	cmrsqcxxj00klf2so9oipbg0f	cmrsqcxuc00k5f2so7sooz4l7	Phí dịch vụ sinh viên	1	300000	300000	2026-07-20 04:34:19.984	2026-07-20 04:34:19.984	\N	\N	0	\N	\N
cmrsqcxy600kqf2soyymkc0of	cmrsqcxxx00kpf2so243ljayq	\N	Học phí 12 tín chỉ	12	650000	7800000	2026-07-20 04:34:19.999	2026-07-20 04:34:19.999	\N	\N	0	\N	\N
cmrsqcxy600krf2sozi334kts	cmrsqcxxx00kpf2so243ljayq	cmrsqcxuc00k5f2so7sooz4l7	Phí dịch vụ sinh viên	1	300000	300000	2026-07-20 04:34:19.999	2026-07-20 04:34:19.999	\N	\N	0	\N	\N
cmrsqcxyl00kuf2sorc6qv74n	cmrsqcxyb00ktf2soibewupm1	\N	Học phí 12 tín chỉ	12	650000	7800000	2026-07-20 04:34:20.013	2026-07-20 04:34:20.013	\N	\N	0	\N	\N
cmrsqcxyl00kvf2sodjyegzn0	cmrsqcxyb00ktf2soibewupm1	cmrsqcxuc00k5f2so7sooz4l7	Phí dịch vụ sinh viên	1	300000	300000	2026-07-20 04:34:20.013	2026-07-20 04:34:20.013	\N	\N	0	\N	\N
\.


--
-- Data for Name: Lecturer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Lecturer" (id, "lecturerCode", "userId", "departmentId", "fullName", email, phone, "dateOfBirth", gender, "academicRank", specialization, status, "createdAt", "updatedAt", "deletedAt") FROM stdin;
cmrsqcw8g003pf2so25mxjau1	GV001	cmrsqcw84003nf2so8oq7apwm	cmrsqcw7w003kf2soklf35dc0	Nguyễn Minh Anh	lecturer@school.local	0901000001	1980-05-15	FEMALE	Tiến sĩ	Kỹ thuật phần mềm	ACTIVE	2026-07-20 04:34:17.777	2026-07-20 04:34:17.777	\N
cmrsqcw91003sf2so79pf1w9q	GV002	cmrsqcw8o003qf2soviwyfjye	cmrsqcw7w003lf2sov68d73bz	Trần Hoàng Long	lecturer2@school.local	0901000002	1981-05-15	MALE	Tiến sĩ	Hệ thống thông tin	ACTIVE	2026-07-20 04:34:17.797	2026-07-20 04:34:17.797	\N
cmrsqcw9i003vf2sojjrnw611	GV003	cmrsqcw95003tf2so449128zr	cmrsqcw7w003mf2so217t058j	Lê Thu Hà	lecturer3@school.local	0901000003	1982-05-15	FEMALE	Thạc sĩ	Marketing số	ACTIVE	2026-07-20 04:34:17.814	2026-07-20 04:34:17.814	\N
cmrsqcwa4003yf2so2s1qkckz	GV004	cmrsqcw9o003wf2so27wjijvs	cmrsqcw7w003kf2soklf35dc0	Phạm Quốc Bảo	lecturer4@school.local	0901000004	1983-05-15	MALE	Thạc sĩ	Quản trị học	ACTIVE	2026-07-20 04:34:17.836	2026-07-20 04:34:17.836	\N
cmrsqcwal0041f2so14en68cx	GV005	cmrsqcwa9003zf2so41fjejoj	cmrsqcw7w003lf2sov68d73bz	Võ Ngọc Linh	lecturer5@school.local	0901000005	1984-05-15	FEMALE	Thạc sĩ	Ngôn ngữ Anh	ACTIVE	2026-07-20 04:34:17.854	2026-07-20 04:34:17.854	\N
\.


--
-- Data for Name: LoginHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LoginHistory" (id, "userId", "emailAttempt", "ipAddress", "userAgent", successful, "failureReason", "createdAt", "updatedAt") FROM stdin;
cmrsqfp000001qh01fix5nytl	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	\N	t	\N	2026-07-20 04:36:28.368	2026-07-20 04:36:28.368
cmrsqintv0001qh01b1iug5u7	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	\N	t	\N	2026-07-20 04:38:46.819	2026-07-20 04:38:46.819
cmrsqj8uw0001o901koau3c10	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	\N	t	\N	2026-07-20 04:39:14.072	2026-07-20 04:39:14.072
cmrsqligt0001pk01xfe1ywxf	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	\N	t	\N	2026-07-20 04:40:59.836	2026-07-20 04:40:59.836
cmrsqmb5m0003pk0164nb1hfl	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:41:37.017	2026-07-20 04:41:37.017
cmrsqmce40005pk01u8tt0fbm	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:41:38.62	2026-07-20 04:41:38.62
cmrsqmdkq0007pk011jwjlhp3	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:41:40.154	2026-07-20 04:41:40.154
cmrsqmer30009pk0106jb4uja	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:41:41.679	2026-07-20 04:41:41.679
cmrsqmfyx000bpk01wppuoblj	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:41:43.256	2026-07-20 04:41:43.256
cmrsqmgxh000dpk01naw5kmt1	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:41:44.501	2026-07-20 04:41:44.501
cmrsqmhcf000fpk01km23qmj5	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:41:45.037	2026-07-20 04:41:45.037
cmrsqmibd000hpk01t984mipo	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:41:46.297	2026-07-20 04:41:46.297
cmrsqmiqp000jpk01tdknsxnd	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:41:46.847	2026-07-20 04:41:46.847
cmrsqmjq7000lpk019n2v4sk5	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:41:48.127	2026-07-20 04:41:48.127
cmrsqmk0c000npk01ipriskil	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:41:48.492	2026-07-20 04:41:48.492
cmrsqmlc1000ppk01wus5wl8s	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:41:50.209	2026-07-20 04:41:50.209
cmrsqmliw000rpk016t5czk51	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:41:50.455	2026-07-20 04:41:50.455
cmrsqmmvi000tpk01qssxirju	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:41:52.205	2026-07-20 04:41:52.205
cmrsqmn6x000vpk01ytfr1wsm	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:41:52.616	2026-07-20 04:41:52.616
cmrsqmn6x000xpk01usj3yrzy	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:41:52.617	2026-07-20 04:41:52.617
cmrsqmorh000zpk011douesls	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:41:54.653	2026-07-20 04:41:54.653
cmrsqmp3q0011pk01hxslbei8	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:41:55.091	2026-07-20 04:41:55.091
cmrsqmp3u0013pk01t0mwine1	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:41:55.096	2026-07-20 04:41:55.096
cmrsqmqor0015pk01hbz8q3ot	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:41:57.147	2026-07-20 04:41:57.147
cmrsqmr040017pk0158cujbpi	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:41:57.556	2026-07-20 04:41:57.556
cmrsqmr050019pk01jfex5zjh	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:41:57.557	2026-07-20 04:41:57.557
cmrsqmslu001bpk01uxy9hvhf	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:41:59.633	2026-07-20 04:41:59.633
cmrsqmt45001dpk01vq117ty8	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:00.293	2026-07-20 04:42:00.293
cmrsqmt46001fpk01v2ninjpf	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:00.293	2026-07-20 04:42:00.293
cmrsqmt8h001hpk019xih9q7s	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:00.448	2026-07-20 04:42:00.448
cmrsqmuo7001jpk01m4zjgk9r	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:02.307	2026-07-20 04:42:02.307
cmrsqmvfb001npk017htqkojt	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:03.286	2026-07-20 04:42:03.286
cmrsqmvfa001lpk012hz1if35	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:03.286	2026-07-20 04:42:03.286
cmrsqmvgo001ppk01b6aszvob	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:03.335	2026-07-20 04:42:03.335
cmrsqmwlq001rpk019m8g71pz	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:04.814	2026-07-20 04:42:04.814
cmrsqmxba001tpk01tmk96r5x	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:05.734	2026-07-20 04:42:05.734
cmrsqmxbb001vpk01u06t0ugh	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:05.734	2026-07-20 04:42:05.734
cmrsqmxlj001xpk010a980peu	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:06.102	2026-07-20 04:42:06.102
cmrsqmy6v001zpk013gh1ovhj	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:06.871	2026-07-20 04:42:06.871
cmrsqmyn10021pk01evwz65p0	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:07.453	2026-07-20 04:42:07.453
cmrsqmzg50023pk01x4t4fhf3	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:08.501	2026-07-20 04:42:08.501
cmrsqmzg60025pk01vzhfqhrt	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:08.501	2026-07-20 04:42:08.501
cmrsqmzsr0027pk01b1wrj7qv	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:08.955	2026-07-20 04:42:08.955
cmrsqn0df0029pk01r7znfkeo	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:09.699	2026-07-20 04:42:09.699
cmrsqn0hl002bpk013gikca2q	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:09.849	2026-07-20 04:42:09.849
cmrsqn1s0002dpk019vbhf4v1	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:11.52	2026-07-20 04:42:11.52
cmrsqn1s1002fpk01lo9xie4e	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:11.52	2026-07-20 04:42:11.52
cmrsqn256002hpk01odqbnaz5	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:11.994	2026-07-20 04:42:11.994
cmrsqn2t8002jpk01j7g53nyz	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:12.857	2026-07-20 04:42:12.857
cmrsqn2t9002lpk01jr02vsvb	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:12.858	2026-07-20 04:42:12.858
cmrsqn3vu002npk01fa52f5lz	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:14.249	2026-07-20 04:42:14.249
cmrsqn4h4002ppk01tk5a56jj	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:15.016	2026-07-20 04:42:15.016
cmrsqn4yb002rpk01ythc93kg	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:15.634	2026-07-20 04:42:15.634
cmrsqn7ck0031pk0132lwp3r9	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:18.74	2026-07-20 04:42:18.74
cmrsqn9y4003dpk01kut1vqf2	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:22.106	2026-07-20 04:42:22.106
cmrsqnafj003hpk01szhyblax	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:22.734	2026-07-20 04:42:22.734
cmrsqncn9003lpk01dz8oq63g	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:25.604	2026-07-20 04:42:25.604
cmrsqnf35003xpk01exrc8wtn	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:28.767	2026-07-20 04:42:28.767
cmrsqnfk90043pk01haipiv5b	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:29.384	2026-07-20 04:42:29.384
cmrsqn4yd002tpk01hw1ec2bw	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:15.636	2026-07-20 04:42:15.636
cmrsqn787002zpk01hkfosp72	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:18.583	2026-07-20 04:42:18.583
cmrsqn7cl0033pk01siye0ui7	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:18.74	2026-07-20 04:42:18.74
cmrsqn9fe0039pk019runa5f5	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:21.434	2026-07-20 04:42:21.434
cmrsqn9y2003bpk010ze8me0x	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:22.106	2026-07-20 04:42:22.106
cmrsqnbo9003jpk01dtdcxb6x	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:24.345	2026-07-20 04:42:24.345
cmrsqncnb003ppk01dq1pt2ix	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:25.606	2026-07-20 04:42:25.606
cmrsqncp7003rpk015rir5xo8	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:25.675	2026-07-20 04:42:25.675
cmrsqn4ye002vpk01lid1479d	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:15.637	2026-07-20 04:42:15.637
cmrsqn5xq002xpk01l9802h6g	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:16.909	2026-07-20 04:42:16.909
cmrsqn7cl0035pk01nojtuh7u	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:18.74	2026-07-20 04:42:18.74
cmrsqn8by0037pk013hivo3hm	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:20.013	2026-07-20 04:42:20.013
cmrsqn9y5003fpk011u0fbdqn	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:22.107	2026-07-20 04:42:22.107
cmrsqncna003npk018rem6r8i	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:25.605	2026-07-20 04:42:25.605
cmrsqnf34003vpk01i3v5k5bd	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:28.768	2026-07-20 04:42:28.768
cmrsqndoe003tpk01kxq2zcx0	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:26.941	2026-07-20 04:42:26.941
cmrsqnf36003zpk01nq9hrom5	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:28.768	2026-07-20 04:42:28.768
cmrsqnfk70041pk01ho99k2om	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:29.383	2026-07-20 04:42:29.383
cmrsqnhss0045pk01k1gk157y	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:32.284	2026-07-20 04:42:32.284
cmrsqnhst0047pk01zdd6b94w	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:32.284	2026-07-20 04:42:32.284
cmrsqnhsu0049pk011db9s34d	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:32.284	2026-07-20 04:42:32.284
cmrsqniag004bpk01zrzjdpf8	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:32.92	2026-07-20 04:42:32.92
cmrsqniah004dpk01x8l2s7mp	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:32.92	2026-07-20 04:42:32.92
cmrsqnkht004fpk01eddx22ks	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:35.777	2026-07-20 04:42:35.777
cmrsqnkhu004hpk010bgdxp0m	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:35.777	2026-07-20 04:42:35.777
cmrsqnkhv004jpk01setnq84i	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:35.777	2026-07-20 04:42:35.777
cmrsqnkym004lpk01b74zcpio	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:36.382	2026-07-20 04:42:36.382
cmrsqnkym004npk01m0y1ytbe	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:36.382	2026-07-20 04:42:36.382
cmrsqnn6j004ppk01mbkfhqhc	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:39.259	2026-07-20 04:42:39.259
cmrsqnn6k004rpk01g7vibwpn	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:39.259	2026-07-20 04:42:39.259
cmrsqnn6l004tpk01awai2mol	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:39.26	2026-07-20 04:42:39.26
cmrsqnnne004vpk01utsswjwr	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:39.866	2026-07-20 04:42:39.866
cmrsqnnnf004xpk01tyfm86cf	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:39.866	2026-07-20 04:42:39.866
cmrsqnpvv004zpk01l82jv0n6	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:42.763	2026-07-20 04:42:42.763
cmrsqnpvw0051pk013gdfa5kv	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:42.763	2026-07-20 04:42:42.763
cmrsqnpvx0053pk01ys7te82k	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:42.764	2026-07-20 04:42:42.764
cmrsqnqcu0055pk0123mkzeo6	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:43.374	2026-07-20 04:42:43.374
cmrsqnqcv0057pk01qzrdskhl	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:43.374	2026-07-20 04:42:43.374
cmrsqnsjv0059pk01giwxn5d0	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:46.219	2026-07-20 04:42:46.219
cmrsqnsjx005bpk01uavaj0x8	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:46.219	2026-07-20 04:42:46.219
cmrsqnsjx005dpk01iskhp89a	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:46.219	2026-07-20 04:42:46.219
cmrsqnt0q005fpk010btbde15	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:46.826	2026-07-20 04:42:46.826
cmrsqnt0q005hpk01gm6768lz	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:46.826	2026-07-20 04:42:46.826
cmrsqnzls005rpk01ft3dsqtj	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:55.258	2026-07-20 04:42:55.258
cmrsqnvjs005jpk01n2de18ez	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:50.104	2026-07-20 04:42:50.104
cmrsqnzlr005ppk01wbs0150f	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:50.107	2026-07-20 04:42:50.107
cmrsqnwpy005lpk01uqq7101w	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:50.104	2026-07-20 04:42:50.104
cmrsqnziz005npk01ujjce9nt	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:50.107	2026-07-20 04:42:50.107
cmrsqo33e005tpk01bwqjtewu	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:42:59.882	2026-07-20 04:42:59.882
cmrsqo395005vpk01zgoz57i5	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:00.089	2026-07-20 04:43:00.089
cmrsqo396005xpk012l3a5n3f	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:00.089	2026-07-20 04:43:00.089
cmrsqo397005zpk01uzbmrbuu	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:00.089	2026-07-20 04:43:00.089
cmrsqo3970061pk01vzk5g6u1	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:00.089	2026-07-20 04:43:00.089
cmrsqo61h0063pk01xrl1jfbk	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:03.7	2026-07-20 04:43:03.7
cmrsqo61i0065pk01zd5hboez	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:03.7	2026-07-20 04:43:03.7
cmrsqo61i0067pk016iw76qtv	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:03.7	2026-07-20 04:43:03.7
cmrsqo61j0069pk01gev9ufeu	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:03.701	2026-07-20 04:43:03.701
cmrsqo61k006bpk01yi30ytsw	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:03.702	2026-07-20 04:43:03.702
cmrsqo8tt006dpk01alg3k93p	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:07.313	2026-07-20 04:43:07.313
cmrsqo8tu006fpk01u31bucqw	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:07.312	2026-07-20 04:43:07.312
cmrsqo8tx006lpk01t2hzq1cj	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:07.313	2026-07-20 04:43:07.313
cmrsqo8tv006hpk01ztfi86ly	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:07.312	2026-07-20 04:43:07.312
cmrsqo8tw006jpk01c90su9i7	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:07.312	2026-07-20 04:43:07.312
cmrsqob7d006npk014j5baa6e	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:10.393	2026-07-20 04:43:10.393
cmrsqobqy006ppk01nptc9ebo	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:11.098	2026-07-20 04:43:11.098
cmrsqobqz006rpk018hvicwzg	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:11.098	2026-07-20 04:43:11.098
cmrsqobr1006vpk01an4wpu0s	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:11.099	2026-07-20 04:43:11.099
cmrsqobr0006tpk01oe1om3iu	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:11.098	2026-07-20 04:43:11.098
cmrsqoe7t0071pk01ln093t29	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:14.295	2026-07-20 04:43:14.295
cmrsqogpj007bpk01lnsihh9f	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:17.526	2026-07-20 04:43:17.526
cmrsqoe7s006xpk01ov780py5	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:14.296	2026-07-20 04:43:14.296
cmrsqoe7s006zpk01g25lazk4	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:14.295	2026-07-20 04:43:14.295
cmrsqogpi0077pk01uw1ehhby	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:17.526	2026-07-20 04:43:17.526
cmrsqoirf007hpk019fr32ckb	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:20.187	2026-07-20 04:43:20.187
cmrsqokcj007jpk01tjrf4bp5	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:22.243	2026-07-20 04:43:22.243
cmrsqoko1007lpk01xyc47vzu	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:22.657	2026-07-20 04:43:22.657
cmrsqomk5007tpk01qi2bo99h	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:25.109	2026-07-20 04:43:25.109
cmrsqood7007vpk01yixyxz4x	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:27.451	2026-07-20 04:43:27.451
cmrsqoe7u0073pk01o4ntmg05	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:14.296	2026-07-20 04:43:14.296
cmrsqog8g0075pk017lwq0w0d	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:16.912	2026-07-20 04:43:16.912
cmrsqogpj0079pk016zqkit3y	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:17.526	2026-07-20 04:43:17.526
cmrsqoig3007dpk0158nnqyg1	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:19.779	2026-07-20 04:43:19.779
cmrsqoirf007fpk01grn6ki8s	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:20.187	2026-07-20 04:43:20.187
cmrsqoko2007npk01x1q8ewsb	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:22.657	2026-07-20 04:43:22.657
cmrsqom8m007ppk013l0l5a5r	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:24.694	2026-07-20 04:43:24.694
cmrsqomk3007rpk01awtbmjaf	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:25.106	2026-07-20 04:43:25.106
cmrsqood7007xpk01lrm88ttw	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:27.451	2026-07-20 04:43:27.451
cmrsqopvh007zpk011pyjj7kh	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:29.404	2026-07-20 04:43:29.404
cmrsqoq320081pk01e2r1przn	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:29.678	2026-07-20 04:43:29.678
cmrsqorcf0083pk0108dqf16p	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:31.31	2026-07-20 04:43:31.31
cmrsqosis0085pk01erremluc	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:32.835	2026-07-20 04:43:32.835
cmrsqotpu0087pk01b74i4b0b	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:34.386	2026-07-20 04:43:34.386
cmrsqouy10089pk01q4b4cl58	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:35.977	2026-07-20 04:43:35.977
cmrsqp5fg008bpk01yf404hzv	cmrsqcw6n003df2so4sxlazfa	admin@school.local	172.18.0.1	Grafana k6/2.1.0	t	\N	2026-07-20 04:43:49.564	2026-07-20 04:43:49.564
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notification" (id, "userId", type, title, content, data, "readAt", "createdAt", "updatedAt") FROM stdin;
cmrsqcy0w00l7f2soxmpxl6kq	cmrsqcwb50042f2sod3a47h3n	PAYMENT_SUCCESS	Thanh toán thành công	Nhà trường đã ghi nhận khoản thanh toán 2.000.000 VND.	\N	\N	2026-07-20 04:34:20.097	2026-07-20 04:34:20.097
\.


--
-- Data for Name: NotificationPreference; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."NotificationPreference" (id, "userId", category, "inAppEnabled", "emailEnabled", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PaymentAllocation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PaymentAllocation" (id, "paymentTransactionId", "invoiceId", amount, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PaymentTransaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PaymentTransaction" (id, "transactionCode", "invoiceId", "studentId", provider, "externalTransactionId", "idempotencyKey", amount, currency, status, "failureReason", "initiatedAt", "completedAt", metadata, "createdAt", "updatedAt", "cancelReason", "cancelledAt", "cancelledByUserId", method, notes, "receivedByUserId", "verifiedAt", "verifiedByUserId") FROM stdin;
cmrsqcxyw00kxf2soqvkofw7p	PAY-SEED-0001	cmrsqcxw600kdf2solaykpwqw	cmrsqcwbj0044f2soug319lxa	MOCK	MOCK-SUCCESS-0001	seed-payment-success-001	2000000	VND	SUCCEEDED	\N	2026-07-20 04:34:20.024	2026-07-10 03:00:00	\N	2026-07-20 04:34:20.024	2026-07-20 04:34:20.024	\N	\N	\N	OTHER	\N	\N	\N	\N
cmrsqcy0500l3f2soc9xmvhyv	PAY-SEED-0002	cmrsqcxx100khf2so3u5w2onw	cmrsqcwc60047f2so7vfe51gp	MOCK	MOCK-FAILED-0001	seed-payment-failed-001	1000000	VND	FAILED	Giao dịch mô phỏng thất bại	2026-07-20 04:34:20.069	2026-07-11 03:00:00	\N	2026-07-20 04:34:20.069	2026-07-20 04:34:20.069	\N	\N	\N	OTHER	\N	\N	\N	\N
cmrsqcy0e00l5f2so87wv056f	PAY-SEED-0003	cmrsqcxxj00klf2so9oipbg0f	cmrsqcwcp004af2so1x8mfaad	MOCK	\N	seed-payment-pending-001	1500000	VND	PENDING	\N	2026-07-20 04:34:20.078	\N	\N	2026-07-20 04:34:20.078	2026-07-20 04:34:20.078	\N	\N	\N	OTHER	\N	\N	\N	\N
\.


--
-- Data for Name: PaymentWebhook; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PaymentWebhook" (id, "paymentTransactionId", provider, "eventId", signature, payload, status, "processedAt", "failureReason", "createdAt", "updatedAt") FROM stdin;
cmrsqcxzq00l1f2so7ss5j8h0	cmrsqcxyw00kxf2soqvkofw7p	MOCK	SEED-EVENT-0001	development-seed-signature	{"status": "success", "transactionCode": "PAY-SEED-0001"}	PROCESSED	2026-07-10 03:00:01	\N	2026-07-20 04:34:20.054	2026-07-20 04:34:20.054
\.


--
-- Data for Name: Permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Permission" (id, code, name, description, module, "createdAt", "updatedAt") FROM stdin;
cmrsqcumi0005f2sol1fwz7fm	user.read	Xem tài khoản	\N	user	2026-07-20 04:34:15.69	2026-07-20 04:34:15.69
cmrsqcumi0006f2so7k9kx755	user.create	Tạo tài khoản	\N	user	2026-07-20 04:34:15.69	2026-07-20 04:34:15.69
cmrsqcumi0008f2soox7gpaql	role.manage	Quản lý vai trò và quyền	\N	role	2026-07-20 04:34:15.69	2026-07-20 04:34:15.69
cmrsqcumi0007f2so693xoq9m	department.create	Tạo khoa	\N	department	2026-07-20 04:34:15.69	2026-07-20 04:34:15.69
cmrsqcumj0009f2sopjm40a3x	department.delete	Xóa mềm khoa	\N	department	2026-07-20 04:34:15.69	2026-07-20 04:34:15.69
cmrsqcumv000af2sos9k6c6yv	lecturer.delete	Xóa mềm giảng viên	\N	lecturer	2026-07-20 04:34:15.692	2026-07-20 04:34:15.692
cmrsqcumw000bf2sogydb06gq	academic-year.manage	Quản lý năm học	\N	academic-year	2026-07-20 04:34:15.692	2026-07-20 04:34:15.692
cmrsqcumz000cf2so35raqtlq	department.read	Xem khoa	\N	department	2026-07-20 04:34:15.692	2026-07-20 04:34:15.692
cmrsqcun0000df2sodhu06v99	semester.manage	Quản lý học kỳ	\N	semester	2026-07-20 04:34:15.692	2026-07-20 04:34:15.692
cmrsqcun0000ef2sotl3x0t1k	course.read	Xem môn học và lớp học phần	\N	course	2026-07-20 04:34:15.692	2026-07-20 04:34:15.692
cmrsqcun1000ff2soe5iq816l	course.manage	Quản lý môn học và lớp học phần	\N	course	2026-07-20 04:34:15.692	2026-07-20 04:34:15.692
cmrsqcun2000gf2sootyxoew5	course.update	Cập nhật môn học	\N	course	2026-07-20 04:34:15.692	2026-07-20 04:34:15.692
cmrsqcun5000hf2sop6kr4ngu	course.create	Tạo môn học	\N	course	2026-07-20 04:34:15.692	2026-07-20 04:34:15.692
cmrsqcun5000if2sokdn8mvwr	course.delete	Xóa mềm môn học	\N	course	2026-07-20 04:34:15.692	2026-07-20 04:34:15.692
cmrsqcun7000jf2som1nyv41z	student.read	Xem sinh viên	\N	student	2026-07-20 04:34:15.692	2026-07-20 04:34:15.692
cmrsqcun8000kf2so42dcrwt9	semester.read	Xem học kỳ	\N	semester	2026-07-20 04:34:15.692	2026-07-20 04:34:15.692
cmrsqcunc000vf2so4srgtf6i	role.read	Xem vai trò và quyền	\N	role	2026-07-20 04:34:15.693	2026-07-20 04:34:15.693
cmrsqcunb000qf2sot71w0w8e	student.export	Export sinh viên	\N	student	2026-07-20 04:34:15.692	2026-07-20 04:34:15.692
cmrsqcunc000wf2soyvdi5m6w	user.delete	Xóa tài khoản	\N	user	2026-07-20 04:34:15.692	2026-07-20 04:34:15.692
cmrsqcund0010f2sorqkahflm	exam.read	Xem kỳ thi	\N	exam	2026-07-20 04:34:15.693	2026-07-20 04:34:15.693
cmrsqcund000yf2sonj7fb6s4	course-prerequisite.manage	Quản lý môn tiên quyết	\N	course	2026-07-20 04:34:15.693	2026-07-20 04:34:15.693
cmrsqcun8000lf2so32fruw01	student.create	Tạo sinh viên	\N	student	2026-07-20 04:34:15.69	2026-07-20 04:34:15.69
cmrsqcuna000nf2soq7mtmj60	lecturer.read	Xem giảng viên	\N	lecturer	2026-07-20 04:34:15.691	2026-07-20 04:34:15.691
cmrsqcunb000of2so4u9e69en	user.update	Cập nhật tài khoản	\N	user	2026-07-20 04:34:15.69	2026-07-20 04:34:15.69
cmrsqcunc000sf2sohj398wqy	student.import	Import sinh viên	\N	student	2026-07-20 04:34:15.691	2026-07-20 04:34:15.691
cmrsqcund000zf2so7l5bkcou	lecturer.update	Cập nhật giảng viên	\N	lecturer	2026-07-20 04:34:15.691	2026-07-20 04:34:15.691
cmrsqcun8000mf2so4abwz2l8	student.manage	Quản lý sinh viên	\N	student	2026-07-20 04:34:15.69	2026-07-20 04:34:15.69
cmrsqcunc000tf2sowrhihmsd	student.update	Cập nhật sinh viên	\N	student	2026-07-20 04:34:15.691	2026-07-20 04:34:15.691
cmrsqcunf0011f2sopn4f9jlt	student.delete	Xóa mềm sinh viên	\N	student	2026-07-20 04:34:15.691	2026-07-20 04:34:15.691
cmrsqcupp0012f2so1whgpa99	exam.manage	Quản lý kỳ thi	\N	exam	2026-07-20 04:34:15.694	2026-07-20 04:34:15.694
cmrsqcunc000rf2sok9jbc7fr	lecturer.manage	Quản lý giảng viên	\N	lecturer	2026-07-20 04:34:15.691	2026-07-20 04:34:15.691
cmrsqcunc000uf2sohb6ylssd	academic-year.read	Xem năm học	\N	academic-year	2026-07-20 04:34:15.692	2026-07-20 04:34:15.692
cmrsqcund000xf2sov9ofcihn	lecturer.create	Tạo giảng viên	\N	lecturer	2026-07-20 04:34:15.691	2026-07-20 04:34:15.691
cmrsqcups0014f2soz41pj6bn	grade.manage	Quản lý điểm	\N	grade	2026-07-20 04:34:15.695	2026-07-20 04:34:15.695
cmrsqcupr0013f2sod8aib884	grade.read	Xem điểm	\N	grade	2026-07-20 04:34:15.694	2026-07-20 04:34:15.694
cmrsqcunb000pf2solwshmolz	department.update	Cập nhật và khôi phục khoa	\N	department	2026-07-20 04:34:15.691	2026-07-20 04:34:15.691
cmrsqcupt001df2so5uqyrzuc	enrollment.cancel	Hủy đăng ký học	\N	enrollment	2026-07-20 04:34:15.697	2026-07-20 04:34:15.697
cmrsqcupt001bf2solsrvcd1c	invoice.read	Xem hóa đơn học phí	\N	invoice	2026-07-20 04:34:15.695	2026-07-20 04:34:15.695
cmrsqcupt001af2soyx75hgd9	enrollment.create	Thực hiện đăng ký học	\N	enrollment	2026-07-20 04:34:15.696	2026-07-20 04:34:15.696
cmrsqcups0016f2sop06sg2wx	payment.manage	Quản lý giao dịch thanh toán	\N	payment	2026-07-20 04:34:15.696	2026-07-20 04:34:15.696
cmrsqcupt001ef2sohnfc7rmt	attendance.manage	Quản lý điểm danh	\N	attendance	2026-07-20 04:34:15.697	2026-07-20 04:34:15.697
cmrsqcups0019f2soz1alz241	enrollment.read	Xem đăng ký học	\N	enrollment	2026-07-20 04:34:15.696	2026-07-20 04:34:15.696
cmrsqcups0018f2sof7f9sa93	audit.read	Xem nhật ký kiểm toán	\N	audit	2026-07-20 04:34:15.696	2026-07-20 04:34:15.696
cmrsqcups0015f2socq6e2m2j	invoice.manage	Quản lý hóa đơn học phí	\N	invoice	2026-07-20 04:34:15.696	2026-07-20 04:34:15.696
cmrsqcups0017f2sot5msrevi	payment.read	Xem giao dịch thanh toán	\N	payment	2026-07-20 04:34:15.696	2026-07-20 04:34:15.696
cmrsqcupt001cf2so6t6dw22b	enrollment.manage	Quản lý đăng ký học	\N	enrollment	2026-07-20 04:34:15.697	2026-07-20 04:34:15.697
cmrsqcupv001ff2soosam2x4z	attendance.read	Xem điểm danh	\N	attendance	2026-07-20 04:34:15.697	2026-07-20 04:34:15.697
cmrsqcupx001gf2soliwe2hy0	grade.publish	Công bố điểm	\N	grade	2026-07-20 04:34:15.697	2026-07-20 04:34:15.697
cmrsqcupx001lf2sodzixe8tu	question.delete	Xóa câu hỏi	\N	question	2026-07-20 04:34:15.697	2026-07-20 04:34:15.697
cmrsqcupx001if2sofmoyjuxe	question.create	Tạo câu hỏi	\N	question	2026-07-20 04:34:15.697	2026-07-20 04:34:15.697
cmrsqcupx001kf2so8h1nab2h	question.update	Cập nhật câu hỏi	\N	question	2026-07-20 04:34:15.697	2026-07-20 04:34:15.697
cmrsqcupx001hf2so5otc4r47	grade.adjust	Điều chỉnh điểm sau công bố	\N	grade	2026-07-20 04:34:15.697	2026-07-20 04:34:15.697
cmrsqcupx001jf2sogakhaf8y	question.read	Xem câu hỏi	\N	question	2026-07-20 04:34:15.697	2026-07-20 04:34:15.697
cmrsqcupz001uf2so07ex7aku	attempt.submit	Nộp bài thi	\N	attempt	2026-07-20 04:34:15.698	2026-07-20 04:34:15.698
cmrsqcupz001of2so5zuabc57	exam.update	Cập nhật kỳ thi	\N	exam	2026-07-20 04:34:15.698	2026-07-20 04:34:15.698
cmrsqcuq0001wf2sosezc4uy6	result.manage	Quản lý kết quả thi	\N	result	2026-07-20 04:34:15.699	2026-07-20 04:34:15.699
cmrsqcupz001tf2sog0psfimj	question.import	Import câu hỏi	\N	question	2026-07-20 04:34:15.698	2026-07-20 04:34:15.698
cmrsqcupz001nf2somcspsxvc	exam.delete	Xóa kỳ thi	\N	exam	2026-07-20 04:34:15.698	2026-07-20 04:34:15.698
cmrsqcupz001qf2sork7763hj	attempt.read	Xem lượt thi	\N	attempt	2026-07-20 04:34:15.698	2026-07-20 04:34:15.698
cmrsqcupz001mf2so0h8eb51z	exam.create	Tạo kỳ thi	\N	exam	2026-07-20 04:34:15.698	2026-07-20 04:34:15.698
cmrsqcupz001sf2sotwdp6lib	attempt.start	Bắt đầu làm bài	\N	attempt	2026-07-20 04:34:15.698	2026-07-20 04:34:15.698
cmrsqcupz001pf2so73q3wz4m	exam.assign	Phân công kỳ thi	\N	exam	2026-07-20 04:34:15.698	2026-07-20 04:34:15.698
cmrsqcupz001vf2sobg7fahht	result.read	Xem kết quả thi	\N	result	2026-07-20 04:34:15.699	2026-07-20 04:34:15.699
cmrsqcupz001rf2som469qccr	exam.publish	Công bố kỳ thi	\N	exam	2026-07-20 04:34:15.698	2026-07-20 04:34:15.698
cmrsqcuq1001xf2so9byif85n	result.publish	Công bố kết quả thi	\N	result	2026-07-20 04:34:15.699	2026-07-20 04:34:15.699
cmrsqcuq10020f2so2p4233op	tuition-rate.read	Xem đơn giá học phí	\N	finance	2026-07-20 04:34:15.699	2026-07-20 04:34:15.699
cmrsqcuq10021f2sojunqcowh	tuition-rate.manage	Quản lý đơn giá học phí	\N	finance	2026-07-20 04:34:15.699	2026-07-20 04:34:15.699
cmrsqcuq1001zf2so2xqqcs0s	fee.read	Xem khoản thu	\N	finance	2026-07-20 04:34:15.699	2026-07-20 04:34:15.699
cmrsqcuq1001yf2sohvzy3n49	fee.manage	Quản lý khoản thu	\N	finance	2026-07-20 04:34:15.699	2026-07-20 04:34:15.699
cmrsqcuq10022f2sozwfxu2bl	invoice.update	Cập nhật hóa đơn	\N	finance	2026-07-20 04:34:15.699	2026-07-20 04:34:15.699
cmrsqcuq6002ff2soc2md1pd1	dashboard.admin.read	Xem dashboard admin	\N	dashboard	2026-07-20 04:34:15.7	2026-07-20 04:34:15.7
cmrsqcuqb002yf2soy1bp4a6m	announcement.manage-audience	Quản lý đối tượng thông báo	\N	announcement	2026-07-20 04:34:15.703	2026-07-20 04:34:15.703
cmrsqcuq30023f2so7iu5xhzp	invoice.create	Tạo hóa đơn	\N	finance	2026-07-20 04:34:15.699	2026-07-20 04:34:15.699
cmrsqcuq6002jf2sof5gk618w	analytics.academic.read	Xem thống kê học vụ	\N	analytics	2026-07-20 04:34:15.701	2026-07-20 04:34:15.701
cmrsqcuq9002pf2so9l8l2j4g	academic-risk.read	Xem cảnh báo học vụ	\N	academic-risk	2026-07-20 04:34:15.701	2026-07-20 04:34:15.701
cmrsqcuqd0034f2so0gq3mbrt	service-request.update	Cập nhật yêu cầu	\N	service-request	2026-07-20 04:34:15.704	2026-07-20 04:34:15.704
cmrsqcuq40028f2sob1x1izng	payment.cancel	Hủy thanh toán	\N	finance	2026-07-20 04:34:15.699	2026-07-20 04:34:15.699
cmrsqcuq9002lf2soi91q0jlb	dashboard.student.read	Xem dashboard sinh viên	\N	dashboard	2026-07-20 04:34:15.701	2026-07-20 04:34:15.701
cmrsqcuqc0032f2soi447c8y3	service-request.read	Xem yêu cầu dịch vụ	\N	service-request	2026-07-20 04:34:15.703	2026-07-20 04:34:15.703
cmrsqcuq5002df2sog1wb0e0f	adjustment.read	Xem điều chỉnh tài chính	\N	finance	2026-07-20 04:34:15.7	2026-07-20 04:34:15.7
cmrsqcuq40029f2sora5nke7t	receipt.read	Xem biên lai	\N	finance	2026-07-20 04:34:15.7	2026-07-20 04:34:15.7
cmrsqcuq9002mf2soo90d56gx	analytics.examination.read	Xem thống kê thi cử	\N	analytics	2026-07-20 04:34:15.701	2026-07-20 04:34:15.701
cmrsqcuqb002wf2soetbja7ia	announcement.publish	Phát hành thông báo	\N	announcement	2026-07-20 04:34:15.703	2026-07-20 04:34:15.703
cmrsqcuqd0036f2so0179evsp	service-request.resolve	Giải quyết yêu cầu	\N	service-request	2026-07-20 04:34:15.704	2026-07-20 04:34:15.704
cmrsqcuqe0038f2sod4c50ghz	service-request.internal-comment	Bình luận nội bộ	\N	service-request	2026-07-20 04:34:15.704	2026-07-20 04:34:15.704
cmrsqcuq4002af2soqtsrnebo	receipt.issue	Phát hành biên lai	\N	finance	2026-07-20 04:34:15.7	2026-07-20 04:34:15.7
cmrsqcuq40027f2so0uri93lc	invoice.issue	Phát hành hóa đơn	\N	finance	2026-07-20 04:34:15.699	2026-07-20 04:34:15.699
cmrsqcuq9002of2sobgod0mmj	analytics.finance.read	Xem thống kê tài chính	\N	analytics	2026-07-20 04:34:15.701	2026-07-20 04:34:15.701
cmrsqcuqb002uf2sobje0lkbo	announcement.update	Cập nhật thông báo	\N	announcement	2026-07-20 04:34:15.703	2026-07-20 04:34:15.703
cmrsqcuqd0035f2so8ux51a05	service-request.assign	Phân công yêu cầu	\N	service-request	2026-07-20 04:34:15.704	2026-07-20 04:34:15.704
cmrsqcuq6002kf2soezxaer23	dashboard.finance.read	Xem dashboard phòng tài chính	\N	dashboard	2026-07-20 04:34:15.7	2026-07-20 04:34:15.7
cmrsqcuq40025f2soz2mk1zej	payment.create	Tạo thanh toán	\N	finance	2026-07-20 04:34:15.699	2026-07-20 04:34:15.699
cmrsqcuqb002vf2soldyrzrf0	announcement.read	Xem thông báo	\N	announcement	2026-07-20 04:34:15.702	2026-07-20 04:34:15.702
cmrsqcuqb0030f2sox4akip6w	notification.manage	Quản lý thông báo in-app	\N	notification	2026-07-20 04:34:15.703	2026-07-20 04:34:15.703
cmrsqcuq6002ef2sovkhpk4c1	adjustment.manage	Quản lý điều chỉnh tài chính	\N	finance	2026-07-20 04:34:15.7	2026-07-20 04:34:15.7
cmrsqcuq40024f2sowh5faq2b	invoice.cancel	Hủy hóa đơn	\N	finance	2026-07-20 04:34:15.699	2026-07-20 04:34:15.699
cmrsqcuqb002sf2socipzfmpb	announcement.create	Tạo thông báo	\N	announcement	2026-07-20 04:34:15.702	2026-07-20 04:34:15.702
cmrsqcuqb0031f2sodgzbieje	notification-preference.manage	Quản lý cài đặt thông báo	\N	notification	2026-07-20 04:34:15.703	2026-07-20 04:34:15.703
cmrsqcuqe003bf2so6pi90n2v	service-request.export	Xuất dữ liệu yêu cầu	\N	service-request	2026-07-20 04:34:15.705	2026-07-20 04:34:15.705
cmrsqcuq6002gf2sojvkv30cj	finance-report.read	Xem báo cáo tài chính	\N	finance	2026-07-20 04:34:15.7	2026-07-20 04:34:15.7
cmrsqcuq40026f2soiyxwl77d	payment.verify	Xác nhận thanh toán	\N	finance	2026-07-20 04:34:15.699	2026-07-20 04:34:15.699
cmrsqcuq9002nf2soy1zjfoyo	analytics.attendance.read	Xem thống kê điểm danh	\N	analytics	2026-07-20 04:34:15.701	2026-07-20 04:34:15.701
cmrsqcuqb002zf2so1frlp0hw	notification.read	Xem thông báo in-app	\N	notification	2026-07-20 04:34:15.703	2026-07-20 04:34:15.703
cmrsqcuqd0033f2soz6ak6upe	service-request.create	Tạo yêu cầu dịch vụ	\N	service-request	2026-07-20 04:34:15.703	2026-07-20 04:34:15.703
cmrsqcuq6002hf2so6zig36ql	dashboard.lecturer.read	Xem dashboard giảng viên	\N	dashboard	2026-07-20 04:34:15.7	2026-07-20 04:34:15.7
cmrsqcuq5002bf2somjnqxpbx	scholarship.manage	Quản lý học bổng	\N	finance	2026-07-20 04:34:15.7	2026-07-20 04:34:15.7
cmrsqcuqb002tf2sogf0fijik	report.export	Xuất báo cáo	\N	report	2026-07-20 04:34:15.701	2026-07-20 04:34:15.701
cmrsqcuqb002rf2sokfoytj2i	academic-risk.resolve	Giải quyết cảnh báo học vụ	\N	academic-risk	2026-07-20 04:34:15.701	2026-07-20 04:34:15.701
cmrsqcuqe0039f2soh6qb72m1	service-request.comment	Bình luận yêu cầu	\N	service-request	2026-07-20 04:34:15.704	2026-07-20 04:34:15.704
cmrsqcuqe0037f2somcodj0wr	service-request.cancel	Hủy yêu cầu	\N	service-request	2026-07-20 04:34:15.704	2026-07-20 04:34:15.704
cmrsqcuq6002if2solaag31rj	dashboard.training.read	Xem dashboard phòng đào tạo	\N	dashboard	2026-07-20 04:34:15.7	2026-07-20 04:34:15.7
cmrsqcuqb002qf2so32ieo3cs	academic-risk.manage	Quản lý cảnh báo học vụ	\N	academic-risk	2026-07-20 04:34:15.701	2026-07-20 04:34:15.701
cmrsqcuqe003af2so9tl1svs0	service-request.report	Báo cáo yêu cầu	\N	service-request	2026-07-20 04:34:15.705	2026-07-20 04:34:15.705
cmrsqcuq5002cf2sotc5is1va	scholarship.read	Xem học bổng	\N	finance	2026-07-20 04:34:15.7	2026-07-20 04:34:15.7
cmrsqcuqb002xf2sommgh1shr	announcement.cancel	Hủy thông báo	\N	announcement	2026-07-20 04:34:15.703	2026-07-20 04:34:15.703
\.


--
-- Data for Name: Prerequisite; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Prerequisite" ("courseId", "prerequisiteCourseId", "minimumGrade", "createdAt", "updatedAt") FROM stdin;
cmrsqcwm70069f2so9z99zhhn	cmrsqcwm10067f2so8k5hv5it	5.00	2026-07-20 04:34:18.276	2026-07-20 04:34:18.276
cmrsqcwl3005tf2soi2c42j6q	cmrsqcwkv005rf2soa22bp66i	5.00	2026-07-20 04:34:18.276	2026-07-20 04:34:18.276
\.


--
-- Data for Name: Question; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Question" (id, "questionCode", "courseId", content, chapter, difficulty, type, explanation, "shuffleOptions", "createdByUserId", status, "createdAt", "updatedAt", "deletedAt", "defaultScore") FROM stdin;
cmrsqcx4300ajf2so4jit6t9f	Q001	cmrsqcwkv005rf2soa22bp66i	Câu hỏi mẫu 1 của môn Nhập môn lập trình: phương án nào sau đây đúng?	Chương 1	EASY	SINGLE_CHOICE	Phương án A là đáp án đúng trong dữ liệu phát triển.	t	cmrsqcw84003nf2so8oq7apwm	ACTIVE	2026-07-20 04:34:18.915	2026-07-20 04:34:18.915	\N	1.00
cmrsqcx4q00atf2soibx0yrhu	Q002	cmrsqcwl3005tf2soi2c42j6q	Câu hỏi mẫu 2 của môn Cấu trúc dữ liệu và giải thuật: phương án nào sau đây đúng?	Chương 2	MEDIUM	SINGLE_CHOICE	Phương án A là đáp án đúng trong dữ liệu phát triển.	t	cmrsqcw8o003qf2soviwyfjye	ACTIVE	2026-07-20 04:34:18.938	2026-07-20 04:34:18.938	\N	1.00
cmrsqcx5h00b3f2som7l8zzsd	Q003	cmrsqcwl8005vf2sorqu65ikb	Câu hỏi mẫu 3 của môn Cơ sở dữ liệu: phương án nào sau đây đúng?	Chương 3	HARD	SINGLE_CHOICE	Phương án A là đáp án đúng trong dữ liệu phát triển.	t	cmrsqcw95003tf2so449128zr	ACTIVE	2026-07-20 04:34:18.965	2026-07-20 04:34:18.965	\N	1.00
cmrsqcx6400bdf2soicp7icne	Q004	cmrsqcwlc005xf2sorg3eont1	Câu hỏi mẫu 4 của môn Kỹ thuật phần mềm: phương án nào sau đây đúng?	Chương 4	EASY	SINGLE_CHOICE	Phương án A là đáp án đúng trong dữ liệu phát triển.	t	cmrsqcw9o003wf2so27wjijvs	ACTIVE	2026-07-20 04:34:18.988	2026-07-20 04:34:18.988	\N	1.00
cmrsqcx6n00bnf2sohyu9az09	Q005	cmrsqcwli005zf2socn3jj7k9	Câu hỏi mẫu 5 của môn Mạng máy tính: phương án nào sau đây đúng?	Chương 5	MEDIUM	SINGLE_CHOICE	Phương án A là đáp án đúng trong dữ liệu phát triển.	t	cmrsqcwa9003zf2so41fjejoj	ACTIVE	2026-07-20 04:34:19.007	2026-07-20 04:34:19.007	\N	1.00
cmrsqcx7700bxf2sorq97dnl0	Q006	cmrsqcwlm0061f2soum0dyhan	Câu hỏi mẫu 6 của môn Nguyên lý quản trị: phương án nào sau đây đúng?	Chương 1	HARD	SINGLE_CHOICE	Phương án A là đáp án đúng trong dữ liệu phát triển.	t	cmrsqcw84003nf2so8oq7apwm	ACTIVE	2026-07-20 04:34:19.027	2026-07-20 04:34:19.027	\N	1.00
cmrsqcx7q00c7f2so9er0zk1d	Q007	cmrsqcwls0063f2som15yrmrp	Câu hỏi mẫu 7 của môn Kinh tế vi mô: phương án nào sau đây đúng?	Chương 2	EASY	SINGLE_CHOICE	Phương án A là đáp án đúng trong dữ liệu phát triển.	t	cmrsqcw8o003qf2soviwyfjye	ACTIVE	2026-07-20 04:34:19.046	2026-07-20 04:34:19.046	\N	1.00
cmrsqcx8g00chf2soevtbaj1s	Q008	cmrsqcwlx0065f2sot10j0kzq	Câu hỏi mẫu 8 của môn Marketing căn bản: phương án nào sau đây đúng?	Chương 3	MEDIUM	SINGLE_CHOICE	Phương án A là đáp án đúng trong dữ liệu phát triển.	t	cmrsqcw95003tf2so449128zr	ACTIVE	2026-07-20 04:34:19.071	2026-07-20 04:34:19.071	\N	1.00
cmrsqcx9500crf2so701v4raj	Q009	cmrsqcwm10067f2so8k5hv5it	Câu hỏi mẫu 9 của môn Tiếng Anh học thuật 1: phương án nào sau đây đúng?	Chương 4	HARD	SINGLE_CHOICE	Phương án A là đáp án đúng trong dữ liệu phát triển.	t	cmrsqcw9o003wf2so27wjijvs	ACTIVE	2026-07-20 04:34:19.097	2026-07-20 04:34:19.097	\N	1.00
cmrsqcx9r00d1f2so2r2agt8v	Q010	cmrsqcwm70069f2so9z99zhhn	Câu hỏi mẫu 10 của môn Tiếng Anh học thuật 2: phương án nào sau đây đúng?	Chương 5	EASY	SINGLE_CHOICE	Phương án A là đáp án đúng trong dữ liệu phát triển.	t	cmrsqcwa9003zf2so41fjejoj	ACTIVE	2026-07-20 04:34:19.119	2026-07-20 04:34:19.119	\N	1.00
cmrsqcxac00dbf2sohvq8ibor	Q011	cmrsqcwkv005rf2soa22bp66i	Câu hỏi mẫu 11 của môn Nhập môn lập trình: phương án nào sau đây đúng?	Chương 1	MEDIUM	SINGLE_CHOICE	Phương án A là đáp án đúng trong dữ liệu phát triển.	t	cmrsqcw84003nf2so8oq7apwm	ACTIVE	2026-07-20 04:34:19.14	2026-07-20 04:34:19.14	\N	1.00
cmrsqcxax00dlf2soi5m72nte	Q012	cmrsqcwl3005tf2soi2c42j6q	Câu hỏi mẫu 12 của môn Cấu trúc dữ liệu và giải thuật: phương án nào sau đây đúng?	Chương 2	HARD	SINGLE_CHOICE	Phương án A là đáp án đúng trong dữ liệu phát triển.	t	cmrsqcw8o003qf2soviwyfjye	ACTIVE	2026-07-20 04:34:19.161	2026-07-20 04:34:19.161	\N	1.00
cmrsqcxbq00dvf2so0em7nplb	Q013	cmrsqcwl8005vf2sorqu65ikb	Câu hỏi mẫu 13 của môn Cơ sở dữ liệu: phương án nào sau đây đúng?	Chương 3	EASY	SINGLE_CHOICE	Phương án A là đáp án đúng trong dữ liệu phát triển.	t	cmrsqcw95003tf2so449128zr	ACTIVE	2026-07-20 04:34:19.19	2026-07-20 04:34:19.19	\N	1.00
cmrsqcxck00e5f2sov77af6ad	Q014	cmrsqcwlc005xf2sorg3eont1	Câu hỏi mẫu 14 của môn Kỹ thuật phần mềm: phương án nào sau đây đúng?	Chương 4	MEDIUM	SINGLE_CHOICE	Phương án A là đáp án đúng trong dữ liệu phát triển.	t	cmrsqcw9o003wf2so27wjijvs	ACTIVE	2026-07-20 04:34:19.22	2026-07-20 04:34:19.22	\N	1.00
cmrsqcxd500eff2sogb6j0oee	Q015	cmrsqcwli005zf2socn3jj7k9	Câu hỏi mẫu 15 của môn Mạng máy tính: phương án nào sau đây đúng?	Chương 5	HARD	SINGLE_CHOICE	Phương án A là đáp án đúng trong dữ liệu phát triển.	t	cmrsqcwa9003zf2so41fjejoj	ACTIVE	2026-07-20 04:34:19.241	2026-07-20 04:34:19.241	\N	1.00
cmrsqcxds00epf2sokc67pvql	Q016	cmrsqcwlm0061f2soum0dyhan	Câu hỏi mẫu 16 của môn Nguyên lý quản trị: phương án nào sau đây đúng?	Chương 1	EASY	SINGLE_CHOICE	Phương án A là đáp án đúng trong dữ liệu phát triển.	t	cmrsqcw84003nf2so8oq7apwm	ACTIVE	2026-07-20 04:34:19.265	2026-07-20 04:34:19.265	\N	1.00
cmrsqcxel00ezf2sonejjlmrh	Q017	cmrsqcwls0063f2som15yrmrp	Câu hỏi mẫu 17 của môn Kinh tế vi mô: phương án nào sau đây đúng?	Chương 2	MEDIUM	SINGLE_CHOICE	Phương án A là đáp án đúng trong dữ liệu phát triển.	t	cmrsqcw8o003qf2soviwyfjye	ACTIVE	2026-07-20 04:34:19.293	2026-07-20 04:34:19.293	\N	1.00
cmrsqcxf300f9f2sougaad3vd	Q018	cmrsqcwlx0065f2sot10j0kzq	Câu hỏi mẫu 18 của môn Marketing căn bản: phương án nào sau đây đúng?	Chương 3	HARD	SINGLE_CHOICE	Phương án A là đáp án đúng trong dữ liệu phát triển.	t	cmrsqcw95003tf2so449128zr	ACTIVE	2026-07-20 04:34:19.311	2026-07-20 04:34:19.311	\N	1.00
cmrsqcxfj00fjf2soflgu1d1s	Q019	cmrsqcwm10067f2so8k5hv5it	Câu hỏi mẫu 19 của môn Tiếng Anh học thuật 1: phương án nào sau đây đúng?	Chương 4	EASY	SINGLE_CHOICE	Phương án A là đáp án đúng trong dữ liệu phát triển.	t	cmrsqcw9o003wf2so27wjijvs	ACTIVE	2026-07-20 04:34:19.327	2026-07-20 04:34:19.327	\N	1.00
cmrsqcxg300ftf2so0ot0oxuk	Q020	cmrsqcwm70069f2so9z99zhhn	Câu hỏi mẫu 20 của môn Tiếng Anh học thuật 2: phương án nào sau đây đúng?	Chương 5	MEDIUM	SINGLE_CHOICE	Phương án A là đáp án đúng trong dữ liệu phát triển.	t	cmrsqcwa9003zf2so41fjejoj	ACTIVE	2026-07-20 04:34:19.347	2026-07-20 04:34:19.347	\N	1.00
cmrsqcxgl00g3f2son9qssevc	Q021	cmrsqcwkv005rf2soa22bp66i	Câu hỏi mẫu 21 của môn Nhập môn lập trình: phương án nào sau đây đúng?	Chương 1	HARD	SINGLE_CHOICE	Phương án A là đáp án đúng trong dữ liệu phát triển.	t	cmrsqcw84003nf2so8oq7apwm	ACTIVE	2026-07-20 04:34:19.365	2026-07-20 04:34:19.365	\N	1.00
cmrsqcxh300gdf2soi6qzcr3l	Q022	cmrsqcwl3005tf2soi2c42j6q	Câu hỏi mẫu 22 của môn Cấu trúc dữ liệu và giải thuật: phương án nào sau đây đúng?	Chương 2	EASY	SINGLE_CHOICE	Phương án A là đáp án đúng trong dữ liệu phát triển.	t	cmrsqcw8o003qf2soviwyfjye	ACTIVE	2026-07-20 04:34:19.383	2026-07-20 04:34:19.383	\N	1.00
cmrsqcxho00gnf2sosvgt2d83	Q023	cmrsqcwl8005vf2sorqu65ikb	Câu hỏi mẫu 23 của môn Cơ sở dữ liệu: phương án nào sau đây đúng?	Chương 3	MEDIUM	SINGLE_CHOICE	Phương án A là đáp án đúng trong dữ liệu phát triển.	t	cmrsqcw95003tf2so449128zr	ACTIVE	2026-07-20 04:34:19.404	2026-07-20 04:34:19.404	\N	1.00
cmrsqcxi600gxf2so19c3pyxq	Q024	cmrsqcwlc005xf2sorg3eont1	Câu hỏi mẫu 24 của môn Kỹ thuật phần mềm: phương án nào sau đây đúng?	Chương 4	HARD	SINGLE_CHOICE	Phương án A là đáp án đúng trong dữ liệu phát triển.	t	cmrsqcw9o003wf2so27wjijvs	ACTIVE	2026-07-20 04:34:19.423	2026-07-20 04:34:19.423	\N	1.00
cmrsqcxip00h7f2soyotr1tnw	Q025	cmrsqcwli005zf2socn3jj7k9	Câu hỏi mẫu 25 của môn Mạng máy tính: phương án nào sau đây đúng?	Chương 5	EASY	SINGLE_CHOICE	Phương án A là đáp án đúng trong dữ liệu phát triển.	t	cmrsqcwa9003zf2so41fjejoj	ACTIVE	2026-07-20 04:34:19.441	2026-07-20 04:34:19.441	\N	1.00
cmrsqcxj700hhf2soqulfp2me	Q026	cmrsqcwlm0061f2soum0dyhan	Câu hỏi mẫu 26 của môn Nguyên lý quản trị: phương án nào sau đây đúng?	Chương 1	MEDIUM	SINGLE_CHOICE	Phương án A là đáp án đúng trong dữ liệu phát triển.	t	cmrsqcw84003nf2so8oq7apwm	ACTIVE	2026-07-20 04:34:19.459	2026-07-20 04:34:19.459	\N	1.00
cmrsqcxjo00hrf2soczyjaivb	Q027	cmrsqcwls0063f2som15yrmrp	Câu hỏi mẫu 27 của môn Kinh tế vi mô: phương án nào sau đây đúng?	Chương 2	HARD	SINGLE_CHOICE	Phương án A là đáp án đúng trong dữ liệu phát triển.	t	cmrsqcw8o003qf2soviwyfjye	ACTIVE	2026-07-20 04:34:19.476	2026-07-20 04:34:19.476	\N	1.00
cmrsqcxk800i1f2soedl20tyq	Q028	cmrsqcwlx0065f2sot10j0kzq	Câu hỏi mẫu 28 của môn Marketing căn bản: phương án nào sau đây đúng?	Chương 3	EASY	SINGLE_CHOICE	Phương án A là đáp án đúng trong dữ liệu phát triển.	t	cmrsqcw95003tf2so449128zr	ACTIVE	2026-07-20 04:34:19.496	2026-07-20 04:34:19.496	\N	1.00
cmrsqcxks00ibf2soqcn2jco5	Q029	cmrsqcwm10067f2so8k5hv5it	Câu hỏi mẫu 29 của môn Tiếng Anh học thuật 1: phương án nào sau đây đúng?	Chương 4	MEDIUM	SINGLE_CHOICE	Phương án A là đáp án đúng trong dữ liệu phát triển.	t	cmrsqcw9o003wf2so27wjijvs	ACTIVE	2026-07-20 04:34:19.516	2026-07-20 04:34:19.516	\N	1.00
cmrsqcxla00ilf2soajo8haty	Q030	cmrsqcwm70069f2so9z99zhhn	Câu hỏi mẫu 30 của môn Tiếng Anh học thuật 2: phương án nào sau đây đúng?	Chương 5	HARD	SINGLE_CHOICE	Phương án A là đáp án đúng trong dữ liệu phát triển.	t	cmrsqcwa9003zf2so41fjejoj	ACTIVE	2026-07-20 04:34:19.534	2026-07-20 04:34:19.534	\N	1.00
\.


--
-- Data for Name: QuestionOption; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."QuestionOption" (id, "questionId", content, "isCorrect", "displayOrder", "createdAt", "updatedAt") FROM stdin;
cmrsqcx4a00alf2soljzxrbb0	cmrsqcx4300ajf2so4jit6t9f	Phương án A	t	0	2026-07-20 04:34:18.922	2026-07-20 04:34:18.922
cmrsqcx4g00anf2sok9bxylne	cmrsqcx4300ajf2so4jit6t9f	Phương án B	f	1	2026-07-20 04:34:18.928	2026-07-20 04:34:18.928
cmrsqcx4j00apf2so3wc67068	cmrsqcx4300ajf2so4jit6t9f	Phương án C	f	2	2026-07-20 04:34:18.932	2026-07-20 04:34:18.932
cmrsqcx4m00arf2sobqhwth8d	cmrsqcx4300ajf2so4jit6t9f	Phương án D	f	3	2026-07-20 04:34:18.935	2026-07-20 04:34:18.935
cmrsqcx4w00avf2solm53gc8b	cmrsqcx4q00atf2soibx0yrhu	Phương án A	t	0	2026-07-20 04:34:18.945	2026-07-20 04:34:18.945
cmrsqcx5000axf2soz43f0iol	cmrsqcx4q00atf2soibx0yrhu	Phương án B	f	1	2026-07-20 04:34:18.949	2026-07-20 04:34:18.949
cmrsqcx5400azf2so8trov8h5	cmrsqcx4q00atf2soibx0yrhu	Phương án C	f	2	2026-07-20 04:34:18.952	2026-07-20 04:34:18.952
cmrsqcx5a00b1f2sokpbqeqvi	cmrsqcx4q00atf2soibx0yrhu	Phương án D	f	3	2026-07-20 04:34:18.958	2026-07-20 04:34:18.958
cmrsqcx5o00b5f2so6dgkwxtq	cmrsqcx5h00b3f2som7l8zzsd	Phương án A	t	0	2026-07-20 04:34:18.972	2026-07-20 04:34:18.972
cmrsqcx5s00b7f2sowfdx7ppo	cmrsqcx5h00b3f2som7l8zzsd	Phương án B	f	1	2026-07-20 04:34:18.977	2026-07-20 04:34:18.977
cmrsqcx5w00b9f2sov3qffkap	cmrsqcx5h00b3f2som7l8zzsd	Phương án C	f	2	2026-07-20 04:34:18.98	2026-07-20 04:34:18.98
cmrsqcx6000bbf2soh296b0md	cmrsqcx5h00b3f2som7l8zzsd	Phương án D	f	3	2026-07-20 04:34:18.984	2026-07-20 04:34:18.984
cmrsqcx6800bff2so7ok8d71r	cmrsqcx6400bdf2soicp7icne	Phương án A	t	0	2026-07-20 04:34:18.993	2026-07-20 04:34:18.993
cmrsqcx6c00bhf2soe7f87ex6	cmrsqcx6400bdf2soicp7icne	Phương án B	f	1	2026-07-20 04:34:18.997	2026-07-20 04:34:18.997
cmrsqcx6g00bjf2so6klkd1j5	cmrsqcx6400bdf2soicp7icne	Phương án C	f	2	2026-07-20 04:34:19	2026-07-20 04:34:19
cmrsqcx6k00blf2soh4vb3exo	cmrsqcx6400bdf2soicp7icne	Phương án D	f	3	2026-07-20 04:34:19.004	2026-07-20 04:34:19.004
cmrsqcx6r00bpf2soq24bq9fy	cmrsqcx6n00bnf2sohyu9az09	Phương án A	t	0	2026-07-20 04:34:19.012	2026-07-20 04:34:19.012
cmrsqcx6v00brf2soder6x0ri	cmrsqcx6n00bnf2sohyu9az09	Phương án B	f	1	2026-07-20 04:34:19.015	2026-07-20 04:34:19.015
cmrsqcx6z00btf2so5fujkaw7	cmrsqcx6n00bnf2sohyu9az09	Phương án C	f	2	2026-07-20 04:34:19.019	2026-07-20 04:34:19.019
cmrsqcx7300bvf2so78syi6hl	cmrsqcx6n00bnf2sohyu9az09	Phương án D	f	3	2026-07-20 04:34:19.023	2026-07-20 04:34:19.023
cmrsqcx7c00bzf2sowt04cim1	cmrsqcx7700bxf2sorq97dnl0	Phương án A	t	0	2026-07-20 04:34:19.032	2026-07-20 04:34:19.032
cmrsqcx7f00c1f2sohg12no1k	cmrsqcx7700bxf2sorq97dnl0	Phương án B	f	1	2026-07-20 04:34:19.035	2026-07-20 04:34:19.035
cmrsqcx7j00c3f2sohvbbeizm	cmrsqcx7700bxf2sorq97dnl0	Phương án C	f	2	2026-07-20 04:34:19.039	2026-07-20 04:34:19.039
cmrsqcx7m00c5f2soorw4hxwe	cmrsqcx7700bxf2sorq97dnl0	Phương án D	f	3	2026-07-20 04:34:19.042	2026-07-20 04:34:19.042
cmrsqcx7v00c9f2sogznxfan6	cmrsqcx7q00c7f2so9er0zk1d	Phương án A	t	0	2026-07-20 04:34:19.051	2026-07-20 04:34:19.051
cmrsqcx7y00cbf2soq7qi4b85	cmrsqcx7q00c7f2so9er0zk1d	Phương án B	f	1	2026-07-20 04:34:19.054	2026-07-20 04:34:19.054
cmrsqcx8300cdf2so2zykfhhd	cmrsqcx7q00c7f2so9er0zk1d	Phương án C	f	2	2026-07-20 04:34:19.059	2026-07-20 04:34:19.059
cmrsqcx8a00cff2soy3l1oot4	cmrsqcx7q00c7f2so9er0zk1d	Phương án D	f	3	2026-07-20 04:34:19.066	2026-07-20 04:34:19.066
cmrsqcx8l00cjf2soqmminjof	cmrsqcx8g00chf2soevtbaj1s	Phương án A	t	0	2026-07-20 04:34:19.078	2026-07-20 04:34:19.078
cmrsqcx8r00clf2so1p31ryuf	cmrsqcx8g00chf2soevtbaj1s	Phương án B	f	1	2026-07-20 04:34:19.083	2026-07-20 04:34:19.083
cmrsqcx8v00cnf2souu1j2ky2	cmrsqcx8g00chf2soevtbaj1s	Phương án C	f	2	2026-07-20 04:34:19.087	2026-07-20 04:34:19.087
cmrsqcx8z00cpf2sozz1ehkhe	cmrsqcx8g00chf2soevtbaj1s	Phương án D	f	3	2026-07-20 04:34:19.092	2026-07-20 04:34:19.092
cmrsqcx9a00ctf2soujmg8gbs	cmrsqcx9500crf2so701v4raj	Phương án A	t	0	2026-07-20 04:34:19.102	2026-07-20 04:34:19.102
cmrsqcx9g00cvf2so55i01az5	cmrsqcx9500crf2so701v4raj	Phương án B	f	1	2026-07-20 04:34:19.108	2026-07-20 04:34:19.108
cmrsqcx9j00cxf2sod9pjy9s5	cmrsqcx9500crf2so701v4raj	Phương án C	f	2	2026-07-20 04:34:19.111	2026-07-20 04:34:19.111
cmrsqcx9n00czf2sosufjcg2f	cmrsqcx9500crf2so701v4raj	Phương án D	f	3	2026-07-20 04:34:19.115	2026-07-20 04:34:19.115
cmrsqcx9w00d3f2sogrj8q8ty	cmrsqcx9r00d1f2so2r2agt8v	Phương án A	t	0	2026-07-20 04:34:19.124	2026-07-20 04:34:19.124
cmrsqcxa000d5f2sopelggvgg	cmrsqcx9r00d1f2so2r2agt8v	Phương án B	f	1	2026-07-20 04:34:19.128	2026-07-20 04:34:19.128
cmrsqcxa400d7f2so2hkmn3d6	cmrsqcx9r00d1f2so2r2agt8v	Phương án C	f	2	2026-07-20 04:34:19.132	2026-07-20 04:34:19.132
cmrsqcxa800d9f2soth88v6z8	cmrsqcx9r00d1f2so2r2agt8v	Phương án D	f	3	2026-07-20 04:34:19.136	2026-07-20 04:34:19.136
cmrsqcxag00ddf2sotn2w95ok	cmrsqcxac00dbf2sohvq8ibor	Phương án A	t	0	2026-07-20 04:34:19.144	2026-07-20 04:34:19.144
cmrsqcxal00dff2sorgif3bdp	cmrsqcxac00dbf2sohvq8ibor	Phương án B	f	1	2026-07-20 04:34:19.149	2026-07-20 04:34:19.149
cmrsqcxap00dhf2so6xnnejec	cmrsqcxac00dbf2sohvq8ibor	Phương án C	f	2	2026-07-20 04:34:19.153	2026-07-20 04:34:19.153
cmrsqcxat00djf2soglb3lify	cmrsqcxac00dbf2sohvq8ibor	Phương án D	f	3	2026-07-20 04:34:19.158	2026-07-20 04:34:19.158
cmrsqcxb200dnf2sojlumq038	cmrsqcxax00dlf2soi5m72nte	Phương án A	t	0	2026-07-20 04:34:19.166	2026-07-20 04:34:19.166
cmrsqcxb600dpf2sof4clpjs7	cmrsqcxax00dlf2soi5m72nte	Phương án B	f	1	2026-07-20 04:34:19.171	2026-07-20 04:34:19.171
cmrsqcxba00drf2soa3ognbyp	cmrsqcxax00dlf2soi5m72nte	Phương án C	f	2	2026-07-20 04:34:19.175	2026-07-20 04:34:19.175
cmrsqcxbh00dtf2sox3r3au9v	cmrsqcxax00dlf2soi5m72nte	Phương án D	f	3	2026-07-20 04:34:19.181	2026-07-20 04:34:19.181
cmrsqcxc300dxf2sor2wp79ka	cmrsqcxbq00dvf2so0em7nplb	Phương án A	t	0	2026-07-20 04:34:19.203	2026-07-20 04:34:19.203
cmrsqcxc700dzf2so7ncgbuk9	cmrsqcxbq00dvf2so0em7nplb	Phương án B	f	1	2026-07-20 04:34:19.208	2026-07-20 04:34:19.208
cmrsqcxcb00e1f2so1n0hu9wk	cmrsqcxbq00dvf2so0em7nplb	Phương án C	f	2	2026-07-20 04:34:19.212	2026-07-20 04:34:19.212
cmrsqcxcf00e3f2sosbjqmhoj	cmrsqcxbq00dvf2so0em7nplb	Phương án D	f	3	2026-07-20 04:34:19.216	2026-07-20 04:34:19.216
cmrsqcxcp00e7f2so7s4f2ld6	cmrsqcxck00e5f2sov77af6ad	Phương án A	t	0	2026-07-20 04:34:19.226	2026-07-20 04:34:19.226
cmrsqcxct00e9f2soz7cye3th	cmrsqcxck00e5f2sov77af6ad	Phương án B	f	1	2026-07-20 04:34:19.229	2026-07-20 04:34:19.229
cmrsqcxcw00ebf2sobf4lb0tc	cmrsqcxck00e5f2sov77af6ad	Phương án C	f	2	2026-07-20 04:34:19.233	2026-07-20 04:34:19.233
cmrsqcxd100edf2sog5ckomr3	cmrsqcxck00e5f2sov77af6ad	Phương án D	f	3	2026-07-20 04:34:19.237	2026-07-20 04:34:19.237
cmrsqcxd900ehf2solgwem0af	cmrsqcxd500eff2sogb6j0oee	Phương án A	t	0	2026-07-20 04:34:19.245	2026-07-20 04:34:19.245
cmrsqcxdd00ejf2soh9xi0x2i	cmrsqcxd500eff2sogb6j0oee	Phương án B	f	1	2026-07-20 04:34:19.25	2026-07-20 04:34:19.25
cmrsqcxdh00elf2sodqxp7gjl	cmrsqcxd500eff2sogb6j0oee	Phương án C	f	2	2026-07-20 04:34:19.254	2026-07-20 04:34:19.254
cmrsqcxdl00enf2sohauuat6s	cmrsqcxd500eff2sogb6j0oee	Phương án D	f	3	2026-07-20 04:34:19.257	2026-07-20 04:34:19.257
cmrsqcxe300erf2sopejgwifm	cmrsqcxds00epf2sokc67pvql	Phương án A	t	0	2026-07-20 04:34:19.275	2026-07-20 04:34:19.275
cmrsqcxe700etf2soe6fdt709	cmrsqcxds00epf2sokc67pvql	Phương án B	f	1	2026-07-20 04:34:19.28	2026-07-20 04:34:19.28
cmrsqcxec00evf2sovglv4f02	cmrsqcxds00epf2sokc67pvql	Phương án C	f	2	2026-07-20 04:34:19.284	2026-07-20 04:34:19.284
cmrsqcxeh00exf2sou6qpnmw6	cmrsqcxds00epf2sokc67pvql	Phương án D	f	3	2026-07-20 04:34:19.289	2026-07-20 04:34:19.289
cmrsqcxep00f1f2so5gjxes88	cmrsqcxel00ezf2sonejjlmrh	Phương án A	t	0	2026-07-20 04:34:19.297	2026-07-20 04:34:19.297
cmrsqcxes00f3f2sozobs0n8c	cmrsqcxel00ezf2sonejjlmrh	Phương án B	f	1	2026-07-20 04:34:19.301	2026-07-20 04:34:19.301
cmrsqcxew00f5f2so8yz7g8vd	cmrsqcxel00ezf2sonejjlmrh	Phương án C	f	2	2026-07-20 04:34:19.304	2026-07-20 04:34:19.304
cmrsqcxez00f7f2so84jfr3q7	cmrsqcxel00ezf2sonejjlmrh	Phương án D	f	3	2026-07-20 04:34:19.308	2026-07-20 04:34:19.308
cmrsqcxf600fbf2sos3u7r1p3	cmrsqcxf300f9f2sougaad3vd	Phương án A	t	0	2026-07-20 04:34:19.315	2026-07-20 04:34:19.315
cmrsqcxf900fdf2soy8eykzux	cmrsqcxf300f9f2sougaad3vd	Phương án B	f	1	2026-07-20 04:34:19.318	2026-07-20 04:34:19.318
cmrsqcxfd00fff2so7xu39jar	cmrsqcxf300f9f2sougaad3vd	Phương án C	f	2	2026-07-20 04:34:19.321	2026-07-20 04:34:19.321
cmrsqcxfg00fhf2so4drasv8u	cmrsqcxf300f9f2sougaad3vd	Phương án D	f	3	2026-07-20 04:34:19.324	2026-07-20 04:34:19.324
cmrsqcxfn00flf2sotmzbzwml	cmrsqcxfj00fjf2soflgu1d1s	Phương án A	t	0	2026-07-20 04:34:19.331	2026-07-20 04:34:19.331
cmrsqcxfq00fnf2som0akd256	cmrsqcxfj00fjf2soflgu1d1s	Phương án B	f	1	2026-07-20 04:34:19.335	2026-07-20 04:34:19.335
cmrsqcxfu00fpf2so78tnpjm5	cmrsqcxfj00fjf2soflgu1d1s	Phương án C	f	2	2026-07-20 04:34:19.339	2026-07-20 04:34:19.339
cmrsqcxfz00frf2soo745c76b	cmrsqcxfj00fjf2soflgu1d1s	Phương án D	f	3	2026-07-20 04:34:19.344	2026-07-20 04:34:19.344
cmrsqcxg700fvf2soox5xkrlp	cmrsqcxg300ftf2so0ot0oxuk	Phương án A	t	0	2026-07-20 04:34:19.351	2026-07-20 04:34:19.351
cmrsqcxgb00fxf2sonydpml2j	cmrsqcxg300ftf2so0ot0oxuk	Phương án B	f	1	2026-07-20 04:34:19.355	2026-07-20 04:34:19.355
cmrsqcxge00fzf2sokb2r8llf	cmrsqcxg300ftf2so0ot0oxuk	Phương án C	f	2	2026-07-20 04:34:19.358	2026-07-20 04:34:19.358
cmrsqcxgi00g1f2so3339jd7h	cmrsqcxg300ftf2so0ot0oxuk	Phương án D	f	3	2026-07-20 04:34:19.362	2026-07-20 04:34:19.362
cmrsqcxgp00g5f2so4xe2lfr2	cmrsqcxgl00g3f2son9qssevc	Phương án A	t	0	2026-07-20 04:34:19.369	2026-07-20 04:34:19.369
cmrsqcxgt00g7f2soa8msd55w	cmrsqcxgl00g3f2son9qssevc	Phương án B	f	1	2026-07-20 04:34:19.373	2026-07-20 04:34:19.373
cmrsqcxgw00g9f2so3uem98qq	cmrsqcxgl00g3f2son9qssevc	Phương án C	f	2	2026-07-20 04:34:19.377	2026-07-20 04:34:19.377
cmrsqcxh000gbf2soq6ubd9xk	cmrsqcxgl00g3f2son9qssevc	Phương án D	f	3	2026-07-20 04:34:19.38	2026-07-20 04:34:19.38
cmrsqcxh800gff2sowwalqkvv	cmrsqcxh300gdf2soi6qzcr3l	Phương án A	t	0	2026-07-20 04:34:19.388	2026-07-20 04:34:19.388
cmrsqcxhb00ghf2so707xv1sd	cmrsqcxh300gdf2soi6qzcr3l	Phương án B	f	1	2026-07-20 04:34:19.392	2026-07-20 04:34:19.392
cmrsqcxhf00gjf2sooccrr1q5	cmrsqcxh300gdf2soi6qzcr3l	Phương án C	f	2	2026-07-20 04:34:19.395	2026-07-20 04:34:19.395
cmrsqcxhk00glf2souq15hj5v	cmrsqcxh300gdf2soi6qzcr3l	Phương án D	f	3	2026-07-20 04:34:19.4	2026-07-20 04:34:19.4
cmrsqcxhs00gpf2so5xa2yf06	cmrsqcxho00gnf2sosvgt2d83	Phương án A	t	0	2026-07-20 04:34:19.408	2026-07-20 04:34:19.408
cmrsqcxhv00grf2sozy86ant5	cmrsqcxho00gnf2sosvgt2d83	Phương án B	f	1	2026-07-20 04:34:19.412	2026-07-20 04:34:19.412
cmrsqcxhz00gtf2somjd2x7lb	cmrsqcxho00gnf2sosvgt2d83	Phương án C	f	2	2026-07-20 04:34:19.415	2026-07-20 04:34:19.415
cmrsqcxi300gvf2sos8ab0cko	cmrsqcxho00gnf2sosvgt2d83	Phương án D	f	3	2026-07-20 04:34:19.419	2026-07-20 04:34:19.419
cmrsqcxib00gzf2som7y6xrxh	cmrsqcxi600gxf2so19c3pyxq	Phương án A	t	0	2026-07-20 04:34:19.427	2026-07-20 04:34:19.427
cmrsqcxie00h1f2sozun4k77r	cmrsqcxi600gxf2so19c3pyxq	Phương án B	f	1	2026-07-20 04:34:19.431	2026-07-20 04:34:19.431
cmrsqcxii00h3f2so2brcutm7	cmrsqcxi600gxf2so19c3pyxq	Phương án C	f	2	2026-07-20 04:34:19.434	2026-07-20 04:34:19.434
cmrsqcxim00h5f2so5zyxb9zk	cmrsqcxi600gxf2so19c3pyxq	Phương án D	f	3	2026-07-20 04:34:19.438	2026-07-20 04:34:19.438
cmrsqcxit00h9f2sotzu5dqcx	cmrsqcxip00h7f2soyotr1tnw	Phương án A	t	0	2026-07-20 04:34:19.445	2026-07-20 04:34:19.445
cmrsqcxix00hbf2soul2j0qbp	cmrsqcxip00h7f2soyotr1tnw	Phương án B	f	1	2026-07-20 04:34:19.449	2026-07-20 04:34:19.449
cmrsqcxj100hdf2sors9i19lk	cmrsqcxip00h7f2soyotr1tnw	Phương án C	f	2	2026-07-20 04:34:19.453	2026-07-20 04:34:19.453
cmrsqcxj400hff2so0f8gyape	cmrsqcxip00h7f2soyotr1tnw	Phương án D	f	3	2026-07-20 04:34:19.456	2026-07-20 04:34:19.456
cmrsqcxja00hjf2so2z8gb9eo	cmrsqcxj700hhf2soqulfp2me	Phương án A	t	0	2026-07-20 04:34:19.463	2026-07-20 04:34:19.463
cmrsqcxjd00hlf2so9yoeel9s	cmrsqcxj700hhf2soqulfp2me	Phương án B	f	1	2026-07-20 04:34:19.466	2026-07-20 04:34:19.466
cmrsqcxjg00hnf2soi63et5xs	cmrsqcxj700hhf2soqulfp2me	Phương án C	f	2	2026-07-20 04:34:19.469	2026-07-20 04:34:19.469
cmrsqcxjk00hpf2soychhjygn	cmrsqcxj700hhf2soqulfp2me	Phương án D	f	3	2026-07-20 04:34:19.473	2026-07-20 04:34:19.473
cmrsqcxjt00htf2sos7d7axzf	cmrsqcxjo00hrf2soczyjaivb	Phương án A	t	0	2026-07-20 04:34:19.481	2026-07-20 04:34:19.481
cmrsqcxjw00hvf2sookl2xzhh	cmrsqcxjo00hrf2soczyjaivb	Phương án B	f	1	2026-07-20 04:34:19.485	2026-07-20 04:34:19.485
cmrsqcxk000hxf2soqv06di95	cmrsqcxjo00hrf2soczyjaivb	Phương án C	f	2	2026-07-20 04:34:19.488	2026-07-20 04:34:19.488
cmrsqcxk300hzf2sov8kcc54a	cmrsqcxjo00hrf2soczyjaivb	Phương án D	f	3	2026-07-20 04:34:19.492	2026-07-20 04:34:19.492
cmrsqcxkc00i3f2somjovkfxj	cmrsqcxk800i1f2soedl20tyq	Phương án A	t	0	2026-07-20 04:34:19.501	2026-07-20 04:34:19.501
cmrsqcxkg00i5f2so89pmp7dh	cmrsqcxk800i1f2soedl20tyq	Phương án B	f	1	2026-07-20 04:34:19.505	2026-07-20 04:34:19.505
cmrsqcxkl00i7f2so8xp46rtc	cmrsqcxk800i1f2soedl20tyq	Phương án C	f	2	2026-07-20 04:34:19.509	2026-07-20 04:34:19.509
cmrsqcxko00i9f2sox5w6jej9	cmrsqcxk800i1f2soedl20tyq	Phương án D	f	3	2026-07-20 04:34:19.512	2026-07-20 04:34:19.512
cmrsqcxkw00idf2so8gjootc0	cmrsqcxks00ibf2soqcn2jco5	Phương án A	t	0	2026-07-20 04:34:19.52	2026-07-20 04:34:19.52
cmrsqcxl000iff2soyypvdbe2	cmrsqcxks00ibf2soqcn2jco5	Phương án B	f	1	2026-07-20 04:34:19.524	2026-07-20 04:34:19.524
cmrsqcxl300ihf2sot7k19dqt	cmrsqcxks00ibf2soqcn2jco5	Phương án C	f	2	2026-07-20 04:34:19.527	2026-07-20 04:34:19.527
cmrsqcxl600ijf2soi5qzluyt	cmrsqcxks00ibf2soqcn2jco5	Phương án D	f	3	2026-07-20 04:34:19.531	2026-07-20 04:34:19.531
cmrsqcxle00inf2sovctw6d6l	cmrsqcxla00ilf2soajo8haty	Phương án A	t	0	2026-07-20 04:34:19.538	2026-07-20 04:34:19.538
cmrsqcxli00ipf2souta197xp	cmrsqcxla00ilf2soajo8haty	Phương án B	f	1	2026-07-20 04:34:19.542	2026-07-20 04:34:19.542
cmrsqcxlm00irf2sojj3x1ur0	cmrsqcxla00ilf2soajo8haty	Phương án C	f	2	2026-07-20 04:34:19.547	2026-07-20 04:34:19.547
cmrsqcxlq00itf2so2nxcn66a	cmrsqcxla00ilf2soajo8haty	Phương án D	f	3	2026-07-20 04:34:19.55	2026-07-20 04:34:19.55
\.


--
-- Data for Name: Receipt; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Receipt" (id, "receiptNumber", "invoiceId", "paymentTransactionId", amount, "issuedAt", "createdAt", "updatedAt", "cancelReason", "cancelledAt", "issuedByUserId", status) FROM stdin;
cmrsqcxze00kzf2soskciik7d	RCPT-SEED-0001	cmrsqcxw600kdf2solaykpwqw	cmrsqcxyw00kxf2soqvkofw7p	2000000	2026-07-20 04:34:20.042	2026-07-20 04:34:20.042	2026-07-20 04:34:20.042	\N	\N	\N	ISSUED
\.


--
-- Data for Name: RefreshToken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RefreshToken" (id, "userId", "tokenHash", "familyId", "replacedByTokenHash", "expiresAt", "revokedAt", "createdByIp", "revokedByIp", "userAgent", "createdAt", "updatedAt") FROM stdin;
04cdd963-3ea0-4b1e-bcfd-841cab6a6ef2	cmrsqcw6n003df2so4sxlazfa	$2b$12$nRdLKfmkSnxinxkL67yC6eYFs6p6ZZPSX5pVBSWrVM2Co9l6q3Fb.	3981db73-c24c-4105-81c4-734e474d45ce	\N	2026-07-27 04:36:28.627	\N	172.18.0.1	\N	\N	2026-07-20 04:36:28.628	2026-07-20 04:36:28.628
9797111e-6e1d-4536-a98c-1dc3f5e00775	cmrsqcw6n003df2so4sxlazfa	$2b$12$Log0IS1BEQ/DDbxAiBqep.Bxylta/.5Gq.iWAz3kHjQRO9YH7WCV6	7f2f381e-7132-4a3f-ac01-925430780a46	\N	2026-07-27 04:38:47.075	\N	172.18.0.1	\N	\N	2026-07-20 04:38:47.076	2026-07-20 04:38:47.076
26a15853-bcd8-4c42-b2a1-555870a254a0	cmrsqcw6n003df2so4sxlazfa	$2b$12$VNIccHS2thGtZZNKUjHu0eze1iC6Miwkle.S1BmSm/yH0ExJjtQLi	b47aec3a-3ff2-4821-abd2-b6ead5045ac8	\N	2026-07-27 04:39:14.326	\N	172.18.0.1	\N	\N	2026-07-20 04:39:14.327	2026-07-20 04:39:14.327
f02cc44f-4876-441c-bada-e67e1297f20a	cmrsqcw6n003df2so4sxlazfa	$2b$12$Ia22zZyqeTcOgJvRehQMOuwzmN/heKo1rvXCODFgXTBSYUcxGfKOC	3f53905c-619d-4429-aefc-2a237e0a8cac	\N	2026-07-27 04:41:00.12	\N	172.18.0.1	\N	\N	2026-07-20 04:41:00.121	2026-07-20 04:41:00.121
177231b5-8b10-4159-9ea0-7e034bdc2ff0	cmrsqcw6n003df2so4sxlazfa	$2b$12$IHV5SwzL0dVZ.Ulc4/hZbeiY6zOOpz8Myg.dkRuelixch5bvOyGBC	48f4ec66-b1d6-47d1-94e7-d0a59403afed	\N	2026-07-27 04:41:37.293	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:41:37.294	2026-07-20 04:41:37.294
6a472d43-cedb-48f3-b4e3-325d1bd121aa	cmrsqcw6n003df2so4sxlazfa	$2b$12$eNU6G.VwafEIDMuU6C1f3.Oqa5P/ViWftJSFIeQnvy7YmzoCYY4Bi	c01171a4-96f5-4a61-970e-c3ec4f287658	\N	2026-07-27 04:41:38.88	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:41:38.881	2026-07-20 04:41:38.881
ac2caaaa-8d8f-4fe2-8637-1ae4ee5536f7	cmrsqcw6n003df2so4sxlazfa	$2b$12$NoGFVMcu0sObnweLkmUQYeouJrrxbht1LuLiIATtWnRxoc.oJMGDC	76104604-0ecd-4bc1-8c14-6b506db23d4a	\N	2026-07-27 04:41:40.415	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:41:40.416	2026-07-20 04:41:40.416
c01be88f-f2ef-4a42-b176-8a9e4fac5aba	cmrsqcw6n003df2so4sxlazfa	$2b$12$v7c8ru2PEtNCiHg8heh1BOXy9M6PW4/Z6CE2TwEnQS2sLac3UNcAG	d0fb451b-a8ad-4d70-9d45-0388d55f3aca	\N	2026-07-27 04:41:41.96	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:41:41.961	2026-07-20 04:41:41.961
44ea19c9-97fa-4a0e-a1eb-1ced315a334d	cmrsqcw6n003df2so4sxlazfa	$2b$12$wKs8wvrEXUp/Cldg6NnsBeb5AnP9Gt5N0Yvt0595w5L2Oyb3VadCG	f914d1d7-9569-4a6a-9a10-68eaff807b51	\N	2026-07-27 04:41:43.533	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:41:43.534	2026-07-20 04:41:43.534
e5041ece-5ecb-4e24-89fa-c704f7351506	cmrsqcw6n003df2so4sxlazfa	$2b$12$IugrJN0B5eae/P3jxxN.jeMB5aNmY2rBtE3x2RixpWVCLQfxhRyNC	ac66210d-b0cc-4ff4-9893-a3f0452cecd4	\N	2026-07-27 04:41:44.97	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:41:44.971	2026-07-20 04:41:44.971
c7547b2b-8f0c-4276-bc4e-4270b44497ce	cmrsqcw6n003df2so4sxlazfa	$2b$12$6xQjSrXFaEDVUyvZLiDuAOwgNENTbV0l4na1QmWzxtrzb7.vRn9CG	6cfa64a0-4146-415f-8bb4-c10553244937	\N	2026-07-27 04:41:45.303	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:41:45.303	2026-07-20 04:41:45.303
353f26a3-4ee8-490b-9fb0-7fc73b9f1f20	cmrsqcw6n003df2so4sxlazfa	$2b$12$r6dIPbQvUyVPNZCSbYQy1OJV/p02IyskNGCEWBFYCzWjexVI02Eoe	ff21b9ca-df25-42d5-ab0a-9bc0e7130a38	\N	2026-07-27 04:41:46.796	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:41:46.797	2026-07-20 04:41:46.797
c5c2ab4b-ac1a-4383-985e-aab1be118574	cmrsqcw6n003df2so4sxlazfa	$2b$12$Vqs2myZ63vahz1P440nB7O6KBKYxhkctbe4oIDSW1tQhlw1JZkaX2	c37d2482-2275-430d-8b2c-f48555a747a8	\N	2026-07-27 04:41:47.109	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:41:47.11	2026-07-20 04:41:47.11
cb94ea1d-e6f4-4501-8c1f-1fe2705b0693	cmrsqcw6n003df2so4sxlazfa	$2b$12$03sjppxYG/UrKbefajXPzesDhTb0RCrdQQgjB7LNyvw2LyzqNHO/C	d3a8a95d-2f68-4c9c-8e3f-11bab8e9d535	\N	2026-07-27 04:41:48.738	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:41:48.739	2026-07-20 04:41:48.739
66520098-c637-4131-98c9-393b72a514fc	cmrsqcw6n003df2so4sxlazfa	$2b$12$RrmBIXw3eqVv5i8UtyaWhegO2WVhwcfsuCUvtoRhUj1B.5.nCOo0m	fe7a09d9-3a95-47a3-a520-3597501d7ab6	\N	2026-07-27 04:41:48.884	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:41:48.885	2026-07-20 04:41:48.885
495408d0-4dbe-498e-8200-75b60306975a	cmrsqcw6n003df2so4sxlazfa	$2b$12$wR.tl3AGF8JVno23CbIHnOf0NTXJmQFzJJXTIW5MokmXeGnhvcYHK	493c339e-8e54-4f8f-b1d8-be6648eda5b9	\N	2026-07-27 04:41:50.719	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:41:50.72	2026-07-20 04:41:50.72
06513830-6d1a-4ebf-92c0-e00af7dfd584	cmrsqcw6n003df2so4sxlazfa	$2b$12$tD0yU5/RCnhyu6a3Hprn4OKqlvR1NCWo0d1XDEkANOT7NtTgEfhTK	698a122c-d9d3-408d-88d0-b9b2f897efac	\N	2026-07-27 04:41:50.88	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:41:50.881	2026-07-20 04:41:50.881
1a277865-ec4b-4988-92c1-f515a20b9b02	cmrsqcw6n003df2so4sxlazfa	$2b$12$GNKiNI0p/snkGqKrQoT0gepoPlKL1xetNoJ2brsNNVUcHqwh1PHKq	56366d6c-916f-4e94-8020-d0003f29121f	\N	2026-07-27 04:41:52.962	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:41:52.963	2026-07-20 04:41:52.963
6e8c9d4a-aa05-4095-b0bc-a1c984561141	cmrsqcw6n003df2so4sxlazfa	$2b$12$4TCTmKiqam/1URRhtUZwiOEVHVV3M4vYpqDM3ZDgxzyB5XZLDjljK	07d10a35-c211-4e31-a7af-b473c120a010	\N	2026-07-27 04:41:53.263	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:41:53.264	2026-07-20 04:41:53.264
750ad299-ffe9-4b77-8362-6262049d4e7f	cmrsqcw6n003df2so4sxlazfa	$2b$12$EnRzY60YalfpbwAX4zF2VeJOkAhp7dlEqRgoPX9pTmN91saBo4PPu	6e044ec2-939a-4198-96f2-4fed36f96153	\N	2026-07-27 04:41:53.263	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:41:53.264	2026-07-20 04:41:53.264
729a6e2b-d350-44b0-8015-bf61dfa286c7	cmrsqcw6n003df2so4sxlazfa	$2b$12$yntE2uWbM1fXSb6y2n/7uO.qIpPmRUQjaFlVvEdTiG2ZG7s81F4sW	8cdf3fe1-bc51-4ae1-8045-da06cc5067a1	\N	2026-07-27 04:41:55.473	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:41:55.474	2026-07-20 04:41:55.474
8a098950-81f6-46e4-87b4-b59f9af8edad	cmrsqcw6n003df2so4sxlazfa	$2b$12$Co8Bee3/eYiREBA1Vu4nKu2Pwl.KyaKkEsldaYuHd/84rAbns0tme	577b49ca-5e74-4574-a18e-c5fcf5acf9b1	\N	2026-07-27 04:41:55.784	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:41:55.785	2026-07-20 04:41:55.785
8eefbcc1-73bf-47ab-b011-7df43f77699b	cmrsqcw6n003df2so4sxlazfa	$2b$12$vtT/yZym2z6Z1qBX6d6Cm.Hhb9J7TKR021p5ppMpwXF/AyWwFVKym	d6257d8c-c72c-497e-be08-487c51641820	\N	2026-07-27 04:41:55.785	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:41:55.786	2026-07-20 04:41:55.786
c74a09dc-53d8-4a83-baac-3d96222a7181	cmrsqcw6n003df2so4sxlazfa	$2b$12$k0IR7wfxQjoDJWJqyZARcu.78F5tTozhft/TQE51MW8Jmux.BCCD.	72374225-3991-44ed-b263-127b1e17d31b	\N	2026-07-27 04:41:57.928	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:41:57.929	2026-07-20 04:41:57.929
d5d9b7de-25ae-4332-81d1-7c1c901d0a4c	cmrsqcw6n003df2so4sxlazfa	$2b$12$EqZBpJvs7d0G.x7gXFwLC.WFenB6kS0JAMdv4heyxGuwG.beLbXG.	9d00f156-1629-4e1c-8573-e98df4ecd517	\N	2026-07-27 04:41:58.222	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:41:58.223	2026-07-20 04:41:58.223
d2490767-b508-47d2-a7d3-41dcf77a0c15	cmrsqcw6n003df2so4sxlazfa	$2b$12$O0l23bViCtezOjTHOc.LzuUFdPEvpqTQGbulnbAJZbm7glNY99QSy	7a49e4fb-54f6-4eae-a990-d4797c77047d	\N	2026-07-27 04:41:58.222	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:41:58.223	2026-07-20 04:41:58.223
95be7cad-ac63-44b2-978c-05b766e68bd5	cmrsqcw6n003df2so4sxlazfa	$2b$12$8aGRSlnI9cGfXScnMqn4huJsdaXjOrxVHH.D/KjbUpgg.DaVYSdzi	b6ea902d-5e5d-4cda-84d4-1362e5f8cc64	\N	2026-07-27 04:42:00.72	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:00.721	2026-07-20 04:42:00.721
9c74b983-510a-4cb1-9848-c47f49b170b3	cmrsqcw6n003df2so4sxlazfa	$2b$12$JSYY1D2w2u/UdRIhV0E/beW.xkTDBmpqOwQNNrp3xlIZYLFlpwfLq	61c625ae-ba3f-4d25-b4e2-410f6041b21e	\N	2026-07-27 04:42:01.241	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:01.242	2026-07-20 04:42:01.242
679ba265-0cac-4d92-8295-0325acfffa47	cmrsqcw6n003df2so4sxlazfa	$2b$12$4FHWb2a5h33jFSOYidIFnO961IitBdSimXQPaqedTRpjjh70YNzom	e1e0cb31-4c10-4551-b825-6e6aeacd8bd8	\N	2026-07-27 04:42:01.241	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:01.242	2026-07-20 04:42:01.242
107320bb-b6c7-4ac7-9387-b14be9b06875	cmrsqcw6n003df2so4sxlazfa	$2b$12$cfAE3sNKEWKL2bFg//x1DecdutwI9ZQDrYwNGRg0sZNCGYKdgU3li	81c19909-cdcd-43b8-b425-667c1d32f227	\N	2026-07-27 04:42:01.289	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:01.29	2026-07-20 04:42:01.29
102003e6-c0df-4697-9f23-bf2a6ef44ef6	cmrsqcw6n003df2so4sxlazfa	$2b$12$3tgKBiRIMpsg3ObOfjeTfOAhAoXgvicPaR5LFVZshWP2P7zoAKrK6	4abf2afa-550c-4c0e-8958-57215adb3bb9	\N	2026-07-27 04:42:03.336	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:03.336	2026-07-20 04:42:03.336
31cb5b10-2f91-4648-8c1a-a562b9fa737c	cmrsqcw6n003df2so4sxlazfa	$2b$12$qjTvcaGqydsEgjAWrBglpO9ziqCDyGwgAKW53DHZ3q2MOh7gUSlGO	7c269326-c729-4880-b149-db49adfbcce9	\N	2026-07-27 04:42:04.059	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:04.06	2026-07-20 04:42:04.06
07af5593-11b3-43b1-8bfc-ffa231ae861e	cmrsqcw6n003df2so4sxlazfa	$2b$12$f4kaa43O557ZAya2AEXUVOj1SKWb47cPcZGCp4r4.ITRUMMQ3NhKu	e7bfc8fa-decc-4406-8ee9-4b6b34908b56	\N	2026-07-27 04:42:04.059	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:04.06	2026-07-20 04:42:04.06
986b1703-05e8-489e-b1d5-6494aaee413f	cmrsqcw6n003df2so4sxlazfa	$2b$12$O/fKWCERFm4u7EnXYl0PVuKzNvnFeJtR5e5bLve8jwPEnou1J8qIC	a328d53f-2565-4314-bfb0-fd99cf012f8b	\N	2026-07-27 04:42:04.106	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:04.107	2026-07-20 04:42:04.107
a87c3f83-00f7-498f-954e-404d83dbe45e	cmrsqcw6n003df2so4sxlazfa	$2b$12$VA1ipTWfm89l9nAO5BcY4emngUy8Fuj5ZmE0kSB1Tgulrx2EfL9TG	280ea7a6-f668-49b0-adc4-25a4d74e5c59	\N	2026-07-27 04:42:05.079	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:05.08	2026-07-20 04:42:05.08
f3508e94-5309-429a-a5b9-61df64e3a31e	cmrsqcw6n003df2so4sxlazfa	$2b$12$.2AqIg/p1abbzcbOCCx9aO.G2oXM.nfUNNQlGWcOS3YB83VZ5P6Ta	3865d998-32af-44a7-ba3f-3ca9376e99ca	\N	2026-07-27 04:42:06.71	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:06.711	2026-07-20 04:42:06.711
a5c97559-9af9-4d68-9ba8-f4a96f8dd0fa	cmrsqcw6n003df2so4sxlazfa	$2b$12$H7vBVnOoF4tyRHHRss/rae2.H39CZuwIMQuyJS9UPcjYxyuhKaUgi	31319cca-4dd9-4dea-9ff1-e90d921bba51	\N	2026-07-27 04:42:06.71	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:06.712	2026-07-20 04:42:06.712
b6d0f3c5-962a-493c-8b2d-cd824cef9364	cmrsqcw6n003df2so4sxlazfa	$2b$12$ObtxeeaMFyflT64qiHRWVOYPeG0WFfb6jhXlmp31ev8YFyf5Y/rDO	ae737358-250d-4736-871a-c5973da03bf2	\N	2026-07-27 04:42:06.938	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:06.939	2026-07-20 04:42:06.939
1a126575-937c-4ca4-8a40-1a2a54cce2d0	cmrsqcw6n003df2so4sxlazfa	$2b$12$Jz3gVEEy03ljbx9D5B56a.OCwFpj0xbGQau4xMXDh8okZv13ZGUcS	d932f60f-b731-4f17-a9be-d732225ff024	\N	2026-07-27 04:42:07.451	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:07.452	2026-07-20 04:42:07.452
f9e9953b-66c8-4544-b31b-a0e9ea5b3032	cmrsqcw6n003df2so4sxlazfa	$2b$12$F5PoA8J56hsUQFa8f5CapOQT6xcGgp.5tNvAdIXi8pwLOXIE22Q92	a9e54613-1cdc-4b66-8839-00f44c6a6536	\N	2026-07-27 04:42:07.735	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:07.736	2026-07-20 04:42:07.736
8e148a66-2e27-468f-bde7-17af7af6b2f8	cmrsqcw6n003df2so4sxlazfa	$2b$12$0oizGDLRh2BI3inkSaOK8eIRP9vVSYjeN2bKDt4VIHTxGf/xly8Ju	70c298fa-d4ce-44ab-80cf-abed64b4ede4	\N	2026-07-27 04:42:09.696	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:09.697	2026-07-20 04:42:09.697
d9ceb7f3-3426-4837-9604-9c0d0849cd9c	cmrsqcw6n003df2so4sxlazfa	$2b$12$x1twNXf0vgecTIZEyio.qeYTzCfrdLlJpi/sipPNzjhm32sUPeKp6	16517733-cff4-48ba-be6c-c45bd74a452d	\N	2026-07-27 04:42:09.697	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:09.698	2026-07-20 04:42:09.698
836ad09c-af6a-4add-90d3-e3b6d7112ebc	cmrsqcw6n003df2so4sxlazfa	$2b$12$50XJg71qX53fks0ZKvLasOSPgXe65FQSJxMoSuKqIFOni2LFyVRL.	5edad770-0bf6-4b23-9fbf-89a1dd78c353	\N	2026-07-27 04:42:12.965	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:12.966	2026-07-20 04:42:12.966
979b83ef-8741-4d07-8dc2-2cd4af07680a	cmrsqcw6n003df2so4sxlazfa	$2b$12$SXenfK1U6Ofeo2l.QnahyOlV7prMramb8LRkpLGdl/JikV//S8sOa	103187d6-a475-47a1-b3f2-f40a738e0f9e	\N	2026-07-27 04:42:13.227	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:13.228	2026-07-20 04:42:13.228
bdddd2ce-a879-41ee-819a-2066e09da30a	cmrsqcw6n003df2so4sxlazfa	$2b$12$hvWum12UmWM9PrdkGd7EZuQ/qU6pWMfBtAgBE14J1.fZj9JF/Alwi	8044036c-0575-48ba-ab6c-904d21bc359d	\N	2026-07-27 04:42:13.526	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:13.527	2026-07-20 04:42:13.527
38c03613-4c46-4d2c-afbc-017c88ef399e	cmrsqcw6n003df2so4sxlazfa	$2b$12$I6pHdThwuKXeoW72Km/Lj./oGZdUJKD6/9/hU5UKHxnvBvgRjNZ3W	af4bfb25-2824-4bfb-aa62-03d71aa7597a	\N	2026-07-27 04:42:15.384	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:15.385	2026-07-20 04:42:15.385
1462f6bb-26d2-46f1-866f-e7e33613ba96	cmrsqcw6n003df2so4sxlazfa	$2b$12$Gm5Ot0ZHR77pD1zfhaJqjOMbxHFhZawqFXfWegXEqSA9P9Dgow2yO	3157a51c-3a7f-499f-b2f2-cbbfdaf0ed9f	\N	2026-07-27 04:42:16.115	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:16.116	2026-07-20 04:42:16.116
b4803313-e05b-4b03-a439-419912adf599	cmrsqcw6n003df2so4sxlazfa	$2b$12$e8M0Wq68GjrNRvB4Ws3ameaeK.zdUq1SSo7sQ4cwX8UJOx2I5JEV6	c72b39c4-55a0-46dd-ba8f-12eed393bdff	\N	2026-07-27 04:42:16.571	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:16.572	2026-07-20 04:42:16.572
70431517-1ac3-4f3d-93f1-439c68dd9007	cmrsqcw6n003df2so4sxlazfa	$2b$12$A.WMF8RzRYvWuNHzCW02D.WG8XLlEKtidPsPziPPo6pr6fk6YV9b.	b9ce291b-e6af-4855-afde-598f3f92c191	\N	2026-07-27 04:42:16.572	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:16.574	2026-07-20 04:42:16.574
bba90a91-69f9-4aae-90e9-e2b71d25c7cd	cmrsqcw6n003df2so4sxlazfa	$2b$12$X/zOy5.OoolxbiIm4QBI9eqtodiG6hvpu0UlTi.gOUPFu2t32N8YW	e4de3a62-8301-40d5-a057-766b6fc71648	\N	2026-07-27 04:42:19.852	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:19.853	2026-07-20 04:42:19.853
36fb9918-732a-493c-b61b-f13efe7c6cc3	cmrsqcw6n003df2so4sxlazfa	$2b$12$Pk.dNI4muUwFoUw16nkphe2ydiESB6XyaZukTLMiIPYSwdwTvI1..	3ac515a9-ef6e-475e-a589-0faef8143eea	\N	2026-07-27 04:42:19.852	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:19.853	2026-07-20 04:42:19.853
dd57b881-5ec8-4348-97aa-f129ab5c4448	cmrsqcw6n003df2so4sxlazfa	$2b$12$fZSID6G9xAy2JvVXTHSXkOgnrisqXTL7qmmn1fbexXbFnptdv3Rie	d402402d-91b7-4551-8b8a-f64b92e2cf7b	\N	2026-07-27 04:42:20.28	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:20.281	2026-07-20 04:42:20.281
172d85a9-151f-436d-ae3b-f89ee18d7575	cmrsqcw6n003df2so4sxlazfa	$2b$12$MHnlyhOqhJF7BScjIkUiXus.auL7B4dBLgliN4rVyuii0/0DP1caa	b9449cc7-cc31-4f2d-b797-1c87e1e2c563	\N	2026-07-27 04:42:22.733	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:22.734	2026-07-20 04:42:22.734
3594aa17-fef3-4c27-8e67-8a2e38dc8a95	cmrsqcw6n003df2so4sxlazfa	$2b$12$NV/sX3x.tqXcHdWDZYnsjOj.Jp0ZL85TBJdza/CHzaegAE7gjy/9a	2ca78817-dbc3-4816-8bfc-35acccf8c6f9	\N	2026-07-27 04:42:23.328	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:23.329	2026-07-20 04:42:23.329
694666db-878f-4ca7-b62f-5126e1fa1728	cmrsqcw6n003df2so4sxlazfa	$2b$12$1ZuQf53l2C7sd3Y8jA4NK.1WHAh11vDnlNRYKAQ3u6UvADFXyipCa	706a0133-ff0a-4660-9a7c-4e78182746c5	\N	2026-07-27 04:42:23.329	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:23.33	2026-07-20 04:42:23.33
e0fd2387-e5b1-42a5-abae-6dede3fbf25c	cmrsqcw6n003df2so4sxlazfa	$2b$12$60CYQrj6whzXrBZJ.jSEdOLAxJf0m5vONfYuQOVpIZ./V7fmoCjEC	2073a33b-d096-4170-8c03-46d6fa12b9d2	\N	2026-07-27 04:42:25.356	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:25.357	2026-07-20 04:42:25.357
c5a6dd6a-95b0-4dd7-ad41-f726b893742c	cmrsqcw6n003df2so4sxlazfa	$2b$12$KL7tHolEX3zML2cHKktJceXcPW1jC4H2KrqgCfdgZzupx38e7l7J2	0891d2be-ad9a-43bf-a441-415fc2e74707	\N	2026-07-27 04:42:26.626	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:26.629	2026-07-20 04:42:26.629
9b2da24b-93ba-4981-93e8-ebdbdbd7dcec	cmrsqcw6n003df2so4sxlazfa	$2b$12$PVVisOo7/RtiEAnWC00jZOl6OtkCkHvA0XIr5O5jEQLiscGkKucZy	8afe0610-f6f0-4c4a-89c2-9cc05afdc74e	\N	2026-07-27 04:42:26.627	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:26.629	2026-07-20 04:42:26.629
a9fddacc-ab04-49aa-a148-3cd5c7b2168d	cmrsqcw6n003df2so4sxlazfa	$2b$12$YlAkwWisqQAQMVQUm5pF7eXE4KdujxhWh/7FDZAVFt/OliOpNIBia	60d2910d-b7af-49f6-b814-c4fefd595898	\N	2026-07-27 04:42:30.054	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:30.055	2026-07-20 04:42:30.055
93ebe43c-8b7a-4b64-837a-16e486b6833e	cmrsqcw6n003df2so4sxlazfa	$2b$12$bNvfQotiF4AQT7KaDYo5W.9Qstx8/sjfzEEjDR1l2AXsRnrB/Rvyu	48f84376-0b18-4974-a209-54ba385e0dd7	\N	2026-07-27 04:42:30.054	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:30.056	2026-07-20 04:42:30.056
ae668712-7471-4905-b7ad-462fb79012c0	cmrsqcw6n003df2so4sxlazfa	$2b$12$IjRCgchRYZXfJckusmxOFO4Lu54N.XW1zN6ixwdJhB2ANjn4tnWN2	3f3133bb-9726-4de9-86e7-25ad13fff124	\N	2026-07-27 04:42:30.355	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:30.356	2026-07-20 04:42:30.356
f1792a6d-5b15-43c8-9bcd-92b10ca28e50	cmrsqcw6n003df2so4sxlazfa	$2b$12$bPmt7iWXxuxm1h8PFNtfo.8TGahoJoNhemFdsMPrJh8lnNhVETLN6	24db34f3-2f0d-43cb-ba2c-ce4793fbd17e	\N	2026-07-27 04:42:10.016	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:10.017	2026-07-20 04:42:10.017
81884cb4-6e2e-4ccb-8cac-479196c41b8d	cmrsqcw6n003df2so4sxlazfa	$2b$12$rtD2xj1V5QUz.Qbl.wsaJeHZddP35R1L2E4Nws1bj8OObTCDvb6ee	0930e039-fb78-4658-b3ad-a0cb4773f2ec	\N	2026-07-27 04:42:10.368	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:10.369	2026-07-20 04:42:10.369
967f0256-a125-45d7-bc0d-32a445ba3c6c	cmrsqcw6n003df2so4sxlazfa	$2b$12$pprdvl7/PoAvKueGocgRZOqdgIImEXZfbp2pGas1qtjq.mphX8/J2	2e7b098c-aa2e-4540-a209-361068c75de0	\N	2026-07-27 04:42:10.424	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:10.425	2026-07-20 04:42:10.425
e4898288-d1f4-4f09-b3a8-6737bf3d529c	cmrsqcw6n003df2so4sxlazfa	$2b$12$Npf0E6jW/wkWPNJAT0ZfPeudiSGNKmvptYLH/bgpiDUaRf5k9d3Xm	d7b37ba2-62e8-479b-a20f-4cb773bdf4cd	\N	2026-07-27 04:42:12.817	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:12.818	2026-07-20 04:42:12.818
6fb1d8e2-9b65-4887-a985-77570b387012	cmrsqcw6n003df2so4sxlazfa	$2b$12$mXDmYsgYDI/yQOaOmK.PKeBaoDjgklgjvIrPLYjG08Gnm0cZQbhyW	db711c97-567e-49cd-a51f-375b31d0f8d1	\N	2026-07-27 04:42:13.526	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:13.527	2026-07-20 04:42:13.527
8d2ea635-4cef-40df-ba83-992f10a3eb3f	cmrsqcw6n003df2so4sxlazfa	$2b$12$80yU1QpkNAahFDqPprwsO.IzAq2PhNnRBHfhf5pnha4y5/KUu2iYq	3b0d91a6-e1d6-4ea5-993a-ea5da0e30b36	\N	2026-07-27 04:42:16.572	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:16.573	2026-07-20 04:42:16.573
bce95a0d-eb04-4f6f-a494-4a276015495e	cmrsqcw6n003df2so4sxlazfa	$2b$12$PpZ4d8GF6pMMBIj/PTEO4ecGgJoyY0y77KNd.9twkRihe7JCFIHzO	c2c12f16-7283-45b1-8643-c16e37ce5f4e	\N	2026-07-27 04:42:18.204	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:18.205	2026-07-20 04:42:18.205
0926c590-e691-4cf3-85a7-88b2e7a131d8	cmrsqcw6n003df2so4sxlazfa	$2b$12$hQBq3Xh4mzpKS90S7pp5YuKFIgo98nBVrq6biie/2BnLbYtThEfx6	98909e0e-5993-4483-a2fe-b1056dc8c51d	\N	2026-07-27 04:42:19.602	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:19.603	2026-07-20 04:42:19.603
7d2519cd-7189-4c01-adf1-6b483ef20a69	cmrsqcw6n003df2so4sxlazfa	$2b$12$YmfTdNicJ.FxdQY/GP6v0eXYjEpwvQJqTMoWcvDuzaXHfaDWtl8Mi	2132f9d6-43f1-489f-9c5e-f921c2abcf60	\N	2026-07-27 04:42:19.852	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:19.852	2026-07-20 04:42:19.852
f4378a49-13dd-4324-97ad-29f7bafe1ada	cmrsqcw6n003df2so4sxlazfa	$2b$12$ilBzLVrmpe0WjqmE5tIrk.UtBpZHSzf84Vj.UrSo1SHj2HIoYNofe	b907be16-e7bc-4033-8a10-4394a3eee7b7	\N	2026-07-27 04:42:23.329	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:23.331	2026-07-20 04:42:23.331
3ff5b5ff-e519-4bfa-a47c-e16ccc5a9b3c	cmrsqcw6n003df2so4sxlazfa	$2b$12$eRG0xRImF/S5vVk4Bn6gFekdFZTw/p6yPVE3ccdWRmqd3sTlAfR1m	7a4d839f-7bdd-4c82-8ff1-328a4f875ab0	\N	2026-07-27 04:42:23.481	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:23.482	2026-07-20 04:42:23.482
6e4e578b-7e69-4db8-9f95-91b14efe5db7	cmrsqcw6n003df2so4sxlazfa	$2b$12$9wlzYxb3IXV73YQnmfD/d.kUgVqVPblVkScnF.ad4xIRqvn35GwAi	d3108153-7280-457b-a0aa-e053a396c6ad	\N	2026-07-27 04:42:26.627	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:26.63	2026-07-20 04:42:26.63
b63a0331-f461-4b46-95c4-21eb65eb1e04	cmrsqcw6n003df2so4sxlazfa	$2b$12$NVrxVACIYCrjm7Xp9gEhiufMGjFZjQjQtqFUO.02KGyNV3yAt/WaW	806cebe8-4669-4b3c-bc64-1462ad668fd2	\N	2026-07-27 04:42:26.782	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:26.783	2026-07-20 04:42:26.783
47e051b2-fcc0-4cb3-bd69-f01671d8f590	cmrsqcw6n003df2so4sxlazfa	$2b$12$9vBOcSohLxcQJmLomtMJbeYyoif1Kg1nV9Xogo6ath.BRfPxVBpwS	5ffc11fd-e6e7-4112-bfbc-c7c7771e9ff8	\N	2026-07-27 04:42:27.202	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:27.203	2026-07-20 04:42:27.203
f2bf5d0f-879a-4fd2-8136-d92c16b60d5c	cmrsqcw6n003df2so4sxlazfa	$2b$12$HnCbGtTGdS4tu/39yl4h2OB8bjls6Wr3RpA6bhpb00wMhu5fLwiYu	0caac29d-3393-4750-9ce9-0998d8182468	\N	2026-07-27 04:42:30.054	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:30.055	2026-07-20 04:42:30.055
adc47a5e-3a17-4cc9-8df3-33bb91cca68e	cmrsqcw6n003df2so4sxlazfa	$2b$12$Fe7.Rlj675caUSXcxy8jtuFTRAjpgMdDyizw/R1KrNScMnzorHbIy	cd0819ce-0912-4202-b0cb-56d2a4cc03cb	\N	2026-07-27 04:42:30.355	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:30.356	2026-07-20 04:42:30.356
1fcfd49b-2cd9-438a-a5d1-1f9400125631	cmrsqcw6n003df2so4sxlazfa	$2b$12$GSbYLCoLcg/UW2jkyYdecuri8.A74E7XVN8V/YG1VmQkWvoPSXq1W	ca46b5e3-3a60-4920-a619-7abf36a83279	\N	2026-07-27 04:42:33.557	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:33.558	2026-07-20 04:42:33.558
08ab192c-892e-4472-a199-66b078a4865f	cmrsqcw6n003df2so4sxlazfa	$2b$12$0tH9Zl8HFzxjDKoEWI42eetvEAmVz17yMZZQHWduWZ4.KpJ1J7CNS	356bd272-624d-430b-9b4b-1d0e23af9f6e	\N	2026-07-27 04:42:33.557	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:33.558	2026-07-20 04:42:33.558
09f387dd-22ec-4b6d-829b-d9fe69a19420	cmrsqcw6n003df2so4sxlazfa	$2b$12$kTYGKX8Q16Cq6DVFpqNQbuscW/4vZFEzdQh0T5.5fD67junhcM0Ze	c68a83dc-bc54-4a03-bdfb-c76b1b75c515	\N	2026-07-27 04:42:33.557	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:33.559	2026-07-20 04:42:33.559
7ae2a43c-7e2f-443f-b47b-beb41669ff1e	cmrsqcw6n003df2so4sxlazfa	$2b$12$MUSI2ZdRNMAzaL.g6zc0Q.HftZD3Th2FPrZfUmA1XV.jykEFmEY3G	cb45dfe1-c232-4626-b5ef-f2d69abcf853	\N	2026-07-27 04:42:33.869	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:33.87	2026-07-20 04:42:33.87
cec88768-8147-45bf-beea-bf28f5ddf4ad	cmrsqcw6n003df2so4sxlazfa	$2b$12$1W8Hj/absjL7aO5CFPlvyO9QvjzToU/JgJ3P2lls7eqi2sYijfoiu	a5b91351-3b41-48d2-834d-ccfaf12bf715	\N	2026-07-27 04:42:33.869	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:33.87	2026-07-20 04:42:33.87
3fb64db2-6413-4b20-9fc0-efcdf56879eb	cmrsqcw6n003df2so4sxlazfa	$2b$12$uGnuOOOnYhzQcIGEhyu0X.JKGz51keJz9LZTzMaia8/N8Eskvsmai	5d6bdb06-8f32-44e6-99f5-420ba897cf33	\N	2026-07-27 04:42:37.06	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:37.061	2026-07-20 04:42:37.061
030ac29d-ecd6-40e6-8da4-d6216a049e9a	cmrsqcw6n003df2so4sxlazfa	$2b$12$lHdPldYMDcT9AJL86gDimeUZvUXWZ1eb36bQR84iYXOklLnbGVV5q	18e31434-597f-4376-ae27-95dc256ea458	\N	2026-07-27 04:42:37.06	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:37.061	2026-07-20 04:42:37.061
2f51e7d4-b17f-4598-a53f-9956a50ce18b	cmrsqcw6n003df2so4sxlazfa	$2b$12$KO0cr2pjkByWiqJEGxs56erF0jYwfLGVjvejdoBNj6pGFDMbkcRZ2	02943445-de70-4bd8-bd0f-e1ea1f3e1fd6	\N	2026-07-27 04:42:37.06	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:37.061	2026-07-20 04:42:37.061
f44585eb-7500-4144-add6-80574cd2bac0	cmrsqcw6n003df2so4sxlazfa	$2b$12$IuZOw0hoKlvcG/MLhOdAje7cYwguOQrSB6gw2a5TBPcWlb7IjpTY6	e6f64202-05e5-4676-a2e4-a39fd6598667	\N	2026-07-27 04:42:37.369	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:37.37	2026-07-20 04:42:37.37
66be4026-6a45-4f57-851d-9ac30586ca65	cmrsqcw6n003df2so4sxlazfa	$2b$12$ZOdxDH3NRfAPNrCcA1h3MuqSfbvMmMtZmWca2nGVvlJZT6xYbBkHS	fd6603a7-2173-4662-aed3-f5b8ec7d4d43	\N	2026-07-27 04:42:37.37	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:37.371	2026-07-20 04:42:37.371
4a7268ec-d1fe-4d75-948d-90363b46c7bb	cmrsqcw6n003df2so4sxlazfa	$2b$12$N3gcY/Cq8B0WeEd5NAfaQO1rh5DA7EGaxlS6zo4tSCO9rF1r8tAhS	54d63bc9-9bcf-44e9-9ff0-979cebc7e997	\N	2026-07-27 04:42:40.568	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:40.569	2026-07-20 04:42:40.569
2a1efede-a402-407c-9587-b51e82eefed3	cmrsqcw6n003df2so4sxlazfa	$2b$12$NtGpTVQTolEif6Wxfq5u..HHNERL6jLRV59KF/u0ZqkRh3XC.ZT/S	7bca8953-52cb-4b7d-9cc8-fdc28f0bc3e3	\N	2026-07-27 04:42:40.568	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:40.569	2026-07-20 04:42:40.569
28c6ada9-df39-4318-ad41-596da10c135b	cmrsqcw6n003df2so4sxlazfa	$2b$12$CoDPtpxST0vvcVCJeiKEbu8E0w54XfSCqPj5S6Qux/Bwe87AM1Zke	11fc089e-2709-4abb-9ff3-c300e924e926	\N	2026-07-27 04:42:40.568	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:40.57	2026-07-20 04:42:40.57
56926c21-651c-4a15-ba4c-dd76bd864369	cmrsqcw6n003df2so4sxlazfa	$2b$12$H6zhzFK48/K9AgnMQ1M8W.BG1QGAQmuo0G/f06LW3cAsSl9rCw8TK	82977d46-d837-46f5-994b-efae755d3206	\N	2026-07-27 04:42:40.943	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:40.944	2026-07-20 04:42:40.944
dc58b2fe-0763-4d9e-8131-5f28b318c72d	cmrsqcw6n003df2so4sxlazfa	$2b$12$s1PPWYzv8.f84dQt7d3TkeD/.Fz/qA0PFExRu1nBjHJt3w16VSXUC	7abc1532-3970-45d3-aba4-15171f9375f5	\N	2026-07-27 04:42:40.947	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:40.948	2026-07-20 04:42:40.948
62de1510-86a5-4db3-aa38-c80c40f1d453	cmrsqcw6n003df2so4sxlazfa	$2b$12$QFoE26xPvK8iHcNSQSi60..V604zKN86aBr8G7kf3z5nfOTMkx7D2	c0e0d47f-1366-4fbc-bff3-cbe419c90847	\N	2026-07-27 04:42:44.021	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:44.022	2026-07-20 04:42:44.022
b6b9234a-70f4-46ac-8bec-ba156c5a99e4	cmrsqcw6n003df2so4sxlazfa	$2b$12$ysktj4H3Co/D4cVU5tNE2umjqsL7o3h1BkB9Qrbb2ePxxQr/tBBaq	b9a8a535-f8e1-475f-8037-84f9ab112765	\N	2026-07-27 04:42:44.021	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:44.022	2026-07-20 04:42:44.022
52e9e8e5-2bf7-4d78-9409-9e47ee6fa974	cmrsqcw6n003df2so4sxlazfa	$2b$12$yj5sXIxlrbQLev04jfzpv.V8TpgrtgSOgghaB1geSZg0qhzkbh7Km	b6c1eb67-2f88-47a2-9d84-f2cc1f14d570	\N	2026-07-27 04:42:44.021	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:44.023	2026-07-20 04:42:44.023
f1a810fc-70fe-4cfb-8c83-7533ec3a1533	cmrsqcw6n003df2so4sxlazfa	$2b$12$UExQoyry/nkejYcuqYlpY.FqycvKrWLdyb766WaUt6ZEvkJuWuGJS	f988ef36-aa9b-481f-a822-eb888a781ffb	\N	2026-07-27 04:42:44.313	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:44.314	2026-07-20 04:42:44.314
8cd4eb53-aa47-4566-9509-dfcadd9fdd57	cmrsqcw6n003df2so4sxlazfa	$2b$12$ecKm8/aYRCX54gQEVfAHbugqyqqC3O1nTWR7mfUGtzGdDRypiUJAm	b5bbc70b-1e09-4dc9-8863-c60fa66943e4	\N	2026-07-27 04:42:44.313	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:44.315	2026-07-20 04:42:44.315
8d7cb8b1-2810-448e-b466-7de4aae2f8a4	cmrsqcw6n003df2so4sxlazfa	$2b$12$Vxxh1lnnO.NSh3UQU2SZq.ev8eeQ.tz7/VYUCbdTDWfN11LFgUxNu	43ff5d56-9ff8-472b-92f9-8f192d64a900	\N	2026-07-27 04:42:47.499	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:47.5	2026-07-20 04:42:47.5
17748586-eedf-4df9-a0eb-4601f5165297	cmrsqcw6n003df2so4sxlazfa	$2b$12$ANen6q/0oXQ2KpJT2nVF6.eDtmazWrqCxaLWUEwAECmLg4LfX6OC2	958894c7-9877-401a-85a4-10cc335aab1f	\N	2026-07-27 04:42:47.499	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:47.5	2026-07-20 04:42:47.5
9224ed58-14c6-4f04-ba9a-fce6db32c3fa	cmrsqcw6n003df2so4sxlazfa	$2b$12$fk7uNduzsXNSyf2X3qAR0.rMMSQEXeLXKaw.ZOFiEfjVP5SQpcNqe	ef7876b8-632e-4aab-985b-144287e55a0d	\N	2026-07-27 04:42:47.499	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:47.501	2026-07-20 04:42:47.501
64a6dea6-801b-4da7-9ceb-ee6d59a177c4	cmrsqcw6n003df2so4sxlazfa	$2b$12$a5heETVYVbcZs4GmAtQvpOvA5i0lahAwLBm2u5iuKIwvBfNfRYiK6	1a3a2618-5731-4d58-9710-63a4efe059dd	\N	2026-07-27 04:42:47.79	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:47.791	2026-07-20 04:42:47.791
658148d6-ba2b-497c-b105-f6ffd46b8498	cmrsqcw6n003df2so4sxlazfa	$2b$12$rBXmCa4EC91mGQKWAeGwMeC/IQTs/Ax/9WCWIkqoV1ouhDNw/UnhO	2b188c68-04c6-4a0d-ae0f-2010b2712fdb	\N	2026-07-27 04:42:47.79	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:47.791	2026-07-20 04:42:47.791
cb9106dd-a852-4cbd-858c-51de9ece00f0	cmrsqcw6n003df2so4sxlazfa	$2b$12$zianVU8JXkP2abqFW48KC.6OctF9XsrVfmRmq1S7Pz4T4nUekvekS	863f66fa-6b9e-4ba6-a551-0251f5f97917	\N	2026-07-27 04:42:57.461	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:57.463	2026-07-20 04:42:57.463
7334c5cb-be3d-47d5-9173-ace842126100	cmrsqcw6n003df2so4sxlazfa	$2b$12$Am1aCmqroOnPecGS4lDIEux3RNsDrXRMqB6U1e5NwyPhFuL5nkRYi	37c95b6f-7bd8-4bf9-939c-c1c3065a1147	\N	2026-07-27 04:42:57.745	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:57.746	2026-07-20 04:42:57.746
78c4963a-cf58-4b57-aeff-0e18779e68ad	cmrsqcw6n003df2so4sxlazfa	$2b$12$ABNUYOmBM4p4Rj.AAsY7auSG62g2yWFkhwIAngX.XFjeM9eyx.Zf6	4e8436ac-6c4b-4339-ba68-231b2c2e6112	\N	2026-07-27 04:43:01.385	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:01.387	2026-07-20 04:43:01.387
57fe716e-abb5-42c0-9ec0-bf3df1308e75	cmrsqcw6n003df2so4sxlazfa	$2b$12$a2MuX5JS5su0zJoV7mAOtO8oZ0PmkkM2gkMzQXZjquV1cNqD92/XO	ca3175c2-5ee5-45f4-9fe6-666592538e1f	\N	2026-07-27 04:43:04.964	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:04.965	2026-07-20 04:43:04.965
ce74b64b-46e3-4572-8a22-f2c37c7376e4	cmrsqcw6n003df2so4sxlazfa	$2b$12$NU89kv2TTPdEzSlBXVGkrOKfoe6PYJ1pLU7RG8qPsom/VNFHmcVn6	916012e3-fea9-4a1f-a13c-ffad4cb7cc93	\N	2026-07-27 04:43:08.679	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:08.68	2026-07-20 04:43:08.68
4d3d1ab7-2c07-4c06-b7a5-9d8aaad45aaa	cmrsqcw6n003df2so4sxlazfa	$2b$12$aXeA2xcXjvdK5FsTF4szIOQldpEP5B8et46.0JsNPUkp9c5kVkweS	120f8e3b-7207-4d40-9d31-fe9eeb450c00	\N	2026-07-27 04:43:12.26	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:12.262	2026-07-20 04:43:12.262
ad5a8fe9-57b8-4b8e-bbe1-78df33abeafa	cmrsqcw6n003df2so4sxlazfa	$2b$12$5rdnVqeNrQzBvpSHH/.SqeX9uvmgPQ60SrKGA3.AgmPVk70xNW3HO	46918536-a562-4260-a7f4-835f0d4a8c0b	\N	2026-07-27 04:43:15.338	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:15.34	2026-07-20 04:43:15.34
845355a1-a2dc-4d2e-9f83-6222cf66fcde	cmrsqcw6n003df2so4sxlazfa	$2b$12$sfi6jEIr89k5quOdv4Q1SOLn8bdoGOVPB5Koj4LeVHkrfx0gYRBYu	7c7cfc18-78db-458b-9f73-26fcb28c4ded	\N	2026-07-27 04:43:18.425	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:18.427	2026-07-20 04:43:18.427
3c4d71ce-2d87-4f30-a47b-49d87c7b3f37	cmrsqcw6n003df2so4sxlazfa	$2b$12$xu.q2mE8BDqeZrYsdcOuKuIQYZ53dOagPiocI1P5hrTXK6LH/LVmC	f95d0b0e-264b-47ad-9741-21d5dc270ad1	\N	2026-07-27 04:43:20.542	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:20.543	2026-07-20 04:43:20.543
78db04f7-f9c2-4660-be4e-67989c299726	cmrsqcw6n003df2so4sxlazfa	$2b$12$Ypv3iQvEbVDJaMKLwFzkbOVxmeY.6P/kR233rfOePOS0.l.r763K6	0208af05-60b9-4914-9edc-1bf7efc043ff	\N	2026-07-27 04:43:20.869	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:20.87	2026-07-20 04:43:20.87
45934e8c-a4d2-4d06-bdf9-a29da6a52113	cmrsqcw6n003df2so4sxlazfa	$2b$12$op.qSoW1OzapMWj3rKWG/eQSXe5GQ66ru1dx5FDtlm.R.L2ViL3cK	0553c403-1987-46c7-9184-d849fa28157f	\N	2026-07-27 04:43:23.347	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:23.348	2026-07-20 04:43:23.348
0779be62-7945-4cb8-9ec4-9de58fa91fae	cmrsqcw6n003df2so4sxlazfa	$2b$12$51ZoNqd.2Y0csrK0MjYUO.vdRHayEIizX5.YZU64DKhfaLFBHmj4C	65ea85d7-d752-42ea-b6db-f8bdd531ff68	\N	2026-07-27 04:43:25.489	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:25.49	2026-07-20 04:43:25.49
a1da7325-6e9a-43f7-9779-4c639f15ea9c	cmrsqcw6n003df2so4sxlazfa	$2b$12$D.JUR.M8dJ7mqzI9qs3TneUhFxNZYhn42K8w3wFkeoOxUtALaoVkW	638c52b7-d9da-4315-b7ee-ca82692e4f6d	\N	2026-07-27 04:43:25.85	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:25.851	2026-07-20 04:43:25.851
af982d5b-975f-4e77-83ed-9cc246f47188	cmrsqcw6n003df2so4sxlazfa	$2b$12$F9ICGoR//EsW9QJEGRwHNOTIZFjmwEG2T3DMQVY0ro2.FzKbPsyq6	3336ee9c-0546-44e7-bb3d-6747d25475b5	\N	2026-07-27 04:42:57.745	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:57.747	2026-07-20 04:42:57.747
c3357cbc-e0d8-49ad-86c3-9925a8d6031f	cmrsqcw6n003df2so4sxlazfa	$2b$12$D8Lp2dlDKg3Wg8AYet4p4uNFq/T/iNR55ofTV3DYPssiNHlhPUc1e	4a200e57-8b99-4cf2-9b7b-17470536e962	\N	2026-07-27 04:42:57.745	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:57.747	2026-07-20 04:42:57.747
ccad7e95-f999-4ec8-9367-b1a4f70d6e9c	cmrsqcw6n003df2so4sxlazfa	$2b$12$Z/sxAt90LpraUscjrsceHeiqQoBUIl5ueo2KZh9wR2tNlHQ.vt0vq	a6ae3439-ac6a-4223-ae83-2795f5fbd4eb	\N	2026-07-27 04:42:57.746	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:42:57.748	2026-07-20 04:42:57.748
6b7203f0-9193-49e7-92e4-52c07acfbff3	cmrsqcw6n003df2so4sxlazfa	$2b$12$Yam.nqu6/JErqmu02FD5IeUsHPS8tvFdHHN.da7Xt56E/zlx9JKui	63a8710c-1262-4d0b-9d38-9021e713ca86	\N	2026-07-27 04:43:01.17	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:01.171	2026-07-20 04:43:01.171
79905add-493a-474e-abcb-b6058663b7d4	cmrsqcw6n003df2so4sxlazfa	$2b$12$g1A1u/R7zzcsXmKQDHStpeqy50ERrr8q91GQ5L6STkjPU3fOWEv8q	1221ab63-075b-46c5-ab5a-27d0391a1576	\N	2026-07-27 04:43:01.384	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:01.385	2026-07-20 04:43:01.385
76a15488-bcef-4635-8460-3d17ae25a5c1	cmrsqcw6n003df2so4sxlazfa	$2b$12$Ytv3zw/RtSgwNCBzzrc4LuJN3GFEJ3AYTmD5EJkWAb7lV7oy7zH1.	c299f473-ca61-4537-b049-e1418df24aa1	\N	2026-07-27 04:43:01.385	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:01.386	2026-07-20 04:43:01.386
8cef6e56-59d7-439e-87ae-e8ca5baf8ede	cmrsqcw6n003df2so4sxlazfa	$2b$12$02xUZas2K8xMWGziax6T6.JPBeZG4Hk8vDVMeQWue4n8Jtl4kJ1dm	9de3773b-58cd-4968-8f62-b09f296befd0	\N	2026-07-27 04:43:01.385	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:01.387	2026-07-20 04:43:01.387
f24b8730-9f7e-496a-bb5e-8a577e4de671	cmrsqcw6n003df2so4sxlazfa	$2b$12$VqQ.O1m5sI/Mr/pf8AGKYOUq5AbGY8qYx1R8Yc8gxDV/oX6GyckiS	470391be-d401-4da7-a526-1b8e1ff18b2d	\N	2026-07-27 04:43:04.964	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:04.966	2026-07-20 04:43:04.966
22228194-8815-4eb1-8972-c4569da8af6d	cmrsqcw6n003df2so4sxlazfa	$2b$12$GbDNu/T8OP4kav5U/oixaO1WOpuNjzdYbWqcIz.dk9Qq8HeIN..RG	f6a2c602-edec-47ca-9dbc-99dd9f505156	\N	2026-07-27 04:43:04.964	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:04.966	2026-07-20 04:43:04.966
ea139824-fba1-4b31-ba7f-4043f78a414c	cmrsqcw6n003df2so4sxlazfa	$2b$12$tOQY6WjkmEZmiYXzaF0/ou7oB0nl7BnvoAowyiwCCr8CDjyZ75MFe	22bbddc0-d286-42a9-b8d4-2f519b3a311c	\N	2026-07-27 04:43:08.393	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:08.394	2026-07-20 04:43:08.394
77614a26-b51a-4eaa-b9b4-b5467e56e99a	cmrsqcw6n003df2so4sxlazfa	$2b$12$cKqmnBlSK/CFvwF2GQlUkO0ak5lCZAMyed.QsYCYovdPKa89ury8m	2f77391c-3cce-4253-821c-6a8f78548c87	\N	2026-07-27 04:43:08.678	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:08.679	2026-07-20 04:43:08.679
3322957e-d923-4eca-aae0-ecb6d2ba9407	cmrsqcw6n003df2so4sxlazfa	$2b$12$EpVbZCRNheeK0YnfeEvde.u1LTiwCpwpulI6QE75ZOVsWboHaQJBa	fda141d1-d5d2-4e80-8eda-367881dd0210	\N	2026-07-27 04:43:08.679	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:08.68	2026-07-20 04:43:08.68
a0c1fe99-e0ee-4984-b639-6ecc783458f0	cmrsqcw6n003df2so4sxlazfa	$2b$12$audb7GedNZUCiLrG7VPwpO.5c6Nj27OfaadVkI7eBsY10gYhD.WsO	f9c9919b-ec89-44d3-a714-825e841b323b	\N	2026-07-27 04:43:11.658	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:11.659	2026-07-20 04:43:11.659
6b5c5142-847b-43e6-bd3e-64dfa37986b2	cmrsqcw6n003df2so4sxlazfa	$2b$12$TOPcjZZKZIXyT0qJVsSbie8PbDCSOuhjJuVH1W8ZkPVFlAkwQ6ium	99c1cd6f-b9f5-4560-8069-38486a7e5acb	\N	2026-07-27 04:43:12.259	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:12.26	2026-07-20 04:43:12.26
9d387ccc-80a2-445b-b0b5-519c88d06103	cmrsqcw6n003df2so4sxlazfa	$2b$12$JAnB2LILVdS8hQvGXIEMWuhVlQtZaaV.b9fr/qeVrTdNudbPXvhJ6	ff4c4817-b1e4-4980-b346-72041ba2fe7a	\N	2026-07-27 04:43:12.259	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:12.261	2026-07-20 04:43:12.261
5973d08f-cb71-4a97-92d4-01ee39e2cd5a	cmrsqcw6n003df2so4sxlazfa	$2b$12$Ipi1n.Z27yD1bH1pQTkVweJyCX63TifXOFWMFTehGCdatl5nZyS42	41960026-a9e8-4d3c-b6bb-f7767c329ead	\N	2026-07-27 04:43:15.338	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:15.339	2026-07-20 04:43:15.339
b120a6ac-0540-4d8c-a8d4-e6e3b07d1c55	cmrsqcw6n003df2so4sxlazfa	$2b$12$SlQdstjsKa4/KGTG1PKi4.WqycFs503mlBQXz507lZk1JivRYIm8y	7dcc6220-4457-4be5-b1dc-aba415a7eb86	\N	2026-07-27 04:43:17.985	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:17.986	2026-07-20 04:43:17.986
1c68e58a-4c57-4b04-8efc-abb50397f31d	cmrsqcw6n003df2so4sxlazfa	$2b$12$BcjyKIPO8U8B5dMdTO3uruRdzrOk5rR3trjlmOY17PQPy4Ab9MqdK	a32fddaa-d00a-4f7c-9596-9104a45603b3	\N	2026-07-27 04:43:18.424	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:18.425	2026-07-20 04:43:18.425
d7c04c6a-764b-4166-8606-4dfb2a4f5357	cmrsqcw6n003df2so4sxlazfa	$2b$12$AyKZY7EFTBdGGCYK7EbZtO0LBMsUNgfhbQXAx3DM0Q.j2VKL3bPr2	9e7b32ab-3fad-41c7-9fe3-1b0092fc29a9	\N	2026-07-27 04:43:04.767	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:04.768	2026-07-20 04:43:04.768
f7ea117c-05bf-498a-984c-dbe94da84718	cmrsqcw6n003df2so4sxlazfa	$2b$12$qEUnH9TOnKD9odBhKkW7P.itK0RsmzKiFNqmMuvYoZFoQgI2NunIK	19250f27-6edc-42e3-a9b7-b161f905a7ce	\N	2026-07-27 04:43:04.964	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:04.964	2026-07-20 04:43:04.964
0f5ffabf-60f0-464c-9892-8206f975fd2f	cmrsqcw6n003df2so4sxlazfa	$2b$12$eT29nSoSJWZFg8Rc7sw./euAIcItk9cEEt0kGBnDAsU16vnjvrmjW	b5ba6483-5717-4aa3-bc69-8f1f2cf23cd6	\N	2026-07-27 04:43:08.679	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:08.681	2026-07-20 04:43:08.681
20447ef2-37da-4f21-9b58-0e46e71c589c	cmrsqcw6n003df2so4sxlazfa	$2b$12$h1WQSTlQGk3GJeoFk/MKuuATXKY6Xpb81EZ9l4jLttUnKSozZIbi6	2f235133-3399-459d-ad78-f26cebed1b6d	\N	2026-07-27 04:43:12.259	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:12.26	2026-07-20 04:43:12.26
4a3748ca-3644-4286-ba87-cc5e196d1dc3	cmrsqcw6n003df2so4sxlazfa	$2b$12$RM9xavMF6Teca/FTNrBQguwFcboxNuTeqOkBTPe0.oDpCsVnrT2fO	16b42daa-169e-4ba9-964f-a64bd06ebfce	\N	2026-07-27 04:43:15.166	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:15.166	2026-07-20 04:43:15.166
2278030a-52cd-46cc-85a5-30bd4169ec2a	cmrsqcw6n003df2so4sxlazfa	$2b$12$vGqiv0mv1EKxOoDyA2aZceBDgpk6hmI4tssvtYwo5HtGolHQVRj12	8631cccb-0980-416d-8cf8-e51565ddf378	\N	2026-07-27 04:43:15.338	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:15.339	2026-07-20 04:43:15.339
0e4662aa-a7ca-473b-9dc3-f96328e9509b	cmrsqcw6n003df2so4sxlazfa	$2b$12$2VRjlO3jJbUneu1oS4lMNOf4e4R8Wg5ryRVBSk.Mut1CE/ZNi5h9u	d1556337-40fd-41b5-bee5-e59a7f5d2068	\N	2026-07-27 04:43:18.425	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:18.426	2026-07-20 04:43:18.426
b06b77d4-62d0-4e3e-a77e-68ba7057f587	cmrsqcw6n003df2so4sxlazfa	$2b$12$bX2IHzKQ7clV01BFFlifVeYoOo1PNs0p813oxm40CN0WuS0LiqNE2	79bd2ac5-383b-4f1a-8a9e-219797b2b430	\N	2026-07-27 04:43:20.869	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:20.87	2026-07-20 04:43:20.87
ae56836f-4605-4e4b-88c5-cf3281a5ef4d	cmrsqcw6n003df2so4sxlazfa	$2b$12$IgKiT0Y/s.ncSbkXqoLcLe4Hmyy499GLAg/1/eXprarV0qTOsJBZ6	bae004d2-7592-46ef-95e1-0fcd870a49db	\N	2026-07-27 04:43:23.015	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:23.016	2026-07-20 04:43:23.016
d06dff13-f0a8-4a6a-8517-8b8ddab0186c	cmrsqcw6n003df2so4sxlazfa	$2b$12$ig/On8OECcYjfowx9leBN.d3Qv.pmN7oNNaboEyZWwqH2DU2lfdmi	465ec1e6-bcef-4b36-a7ed-ce12f68ce73b	\N	2026-07-27 04:43:23.347	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:23.348	2026-07-20 04:43:23.348
94cbc27c-ffc5-4ecf-bf06-ab0c775f1041	cmrsqcw6n003df2so4sxlazfa	$2b$12$x007V54hDCcIrdRZGAEPmuGxjdw2mMXaB7HR/0gEDr2iDXm06XnJW	a5d2b94d-8ee8-4c32-864d-1c2185b07b08	\N	2026-07-27 04:43:25.85	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:25.851	2026-07-20 04:43:25.851
dfc0e52b-6ce0-402c-bb69-4b0b9a109dcd	cmrsqcw6n003df2so4sxlazfa	$2b$12$JAhHbtGDKDdemgXTI3KsEOFyAUxeeTIi/ARUFh4HqoDgl/0gR1ixy	6db06fa3-1462-428c-aa2f-1b19832ece21	\N	2026-07-27 04:43:27.923	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:27.924	2026-07-20 04:43:27.924
e2ab492f-d3d1-4b97-866d-e861d15c4daf	cmrsqcw6n003df2so4sxlazfa	$2b$12$mi.5TMuZu89GblLr6lhbV.UR49MvsTqGhyH35qSP6T7yxCrOQEqcO	e7fc3959-dbe8-4255-ad3b-ed0a5fcbec0d	\N	2026-07-27 04:43:28.01	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:28.011	2026-07-20 04:43:28.011
31014ae0-72f0-4e1d-a0fc-cd7554a0701b	cmrsqcw6n003df2so4sxlazfa	$2b$12$YOiYNdF1iF0qYzSuiGqLteQcNjXCq6S7fel4r17uMdbfXQnFp4tDi	d7937402-5802-4b00-8980-79c4eaefd6af	\N	2026-07-27 04:43:29.933	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:29.934	2026-07-20 04:43:29.934
45ac6d8d-0df3-4859-893c-9019d375e63c	cmrsqcw6n003df2so4sxlazfa	$2b$12$A9OoPmLNs6EHPQ.6/V4Pj.peP4ukiXkvWp18NTy4xYhlm5EB6VjVi	90bfeecc-9b12-462d-be4f-bfcad52a15d8	\N	2026-07-27 04:43:30.076	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:30.077	2026-07-20 04:43:30.077
60885e62-62e9-43d3-a4a2-25c893d4db53	cmrsqcw6n003df2so4sxlazfa	$2b$12$0fcVey4PS.iW5UsnOHmYA.PtuIjUO3RKX8ucEBGYURWFR44lDYK6O	a0a805ec-aefb-47e3-a717-a7c8249d9072	\N	2026-07-27 04:43:31.563	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:31.564	2026-07-20 04:43:31.564
17a26f93-72d8-4d44-a7ca-35e892e47977	cmrsqcw6n003df2so4sxlazfa	$2b$12$Bjmji08IVqc3ZqpsbZgw/ervVwdYY0KXDsUeE/KdkmCA1aeWEBCIK	ce9a96ef-2252-4460-b11c-cf08bfa164da	\N	2026-07-27 04:43:33.09	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:33.091	2026-07-20 04:43:33.091
5fa01ca2-c838-4871-967e-391b7f501142	cmrsqcw6n003df2so4sxlazfa	$2b$12$KQ4LYbSXAgppqORYnYfDOeV/UNTz08FrhbRuwGWiRYZwiJfAsJTpG	04d3cf32-0ac3-4b6b-8ef4-f4428ef1cf0b	\N	2026-07-27 04:43:34.661	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:34.662	2026-07-20 04:43:34.662
5d967336-e7d8-45b7-9926-bd4eb6efe720	cmrsqcw6n003df2so4sxlazfa	$2b$12$bwrT0WOaWBSq3BLSjwVpTuxZapUtAfQYy0bp9iLrPk93xrwG/Fj9C	2cf943b8-60a9-45d8-8641-f695f24a4edf	\N	2026-07-27 04:43:36.286	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:36.287	2026-07-20 04:43:36.287
f4c8e8e7-5712-4208-bcc5-bc3b59dbfc06	cmrsqcw6n003df2so4sxlazfa	$2b$12$BB3Xa.m1zTdFarx1llvQq.D6l.Yf.CeX4aKcQA2Pyq40ts2WfnNm6	70c8a107-7428-4716-b082-646676a29131	\N	2026-07-27 04:43:49.834	\N	172.18.0.1	\N	Grafana k6/2.1.0	2026-07-20 04:43:49.835	2026-07-20 04:43:49.835
\.


--
-- Data for Name: Role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Role" (id, code, name, description, "isSystem", "createdAt", "updatedAt") FROM stdin;
cmrsqculs0001f2so2ei0bskn	ADMIN	Quản trị viên	\N	t	2026-07-20 04:34:15.643	2026-07-20 04:34:15.643
cmrsqculy0004f2sosncsgjsq	LECTURER	Giảng viên	\N	t	2026-07-20 04:34:15.643	2026-07-20 04:34:15.643
cmrsqculc0000f2so9jtilz0y	STUDENT	Sinh viên	\N	t	2026-07-20 04:34:15.643	2026-07-20 04:34:15.643
cmrsqculy0002f2soi04lllt2	FINANCE_STAFF	Phòng tài chính	\N	t	2026-07-20 04:34:15.643	2026-07-20 04:34:15.643
cmrsqculy0003f2solzyk3677	TRAINING_STAFF	Phòng đào tạo	\N	t	2026-07-20 04:34:15.643	2026-07-20 04:34:15.643
\.


--
-- Data for Name: RolePermission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RolePermission" ("roleId", "permissionId", "createdAt", "updatedAt") FROM stdin;
cmrsqculs0001f2so2ei0bskn	cmrsqcumi0005f2sol1fwz7fm	2026-07-20 04:34:15.846	2026-07-20 04:34:15.846
cmrsqculs0001f2so2ei0bskn	cmrsqcumi0006f2so7k9kx755	2026-07-20 04:34:15.872	2026-07-20 04:34:15.872
cmrsqculs0001f2so2ei0bskn	cmrsqcunb000of2so4u9e69en	2026-07-20 04:34:15.881	2026-07-20 04:34:15.881
cmrsqculs0001f2so2ei0bskn	cmrsqcunc000wf2soyvdi5m6w	2026-07-20 04:34:15.888	2026-07-20 04:34:15.888
cmrsqculs0001f2so2ei0bskn	cmrsqcunc000vf2so4srgtf6i	2026-07-20 04:34:15.894	2026-07-20 04:34:15.894
cmrsqculs0001f2so2ei0bskn	cmrsqcumi0008f2soox7gpaql	2026-07-20 04:34:15.903	2026-07-20 04:34:15.903
cmrsqculs0001f2so2ei0bskn	cmrsqcumz000cf2so35raqtlq	2026-07-20 04:34:15.91	2026-07-20 04:34:15.91
cmrsqculs0001f2so2ei0bskn	cmrsqcumi0007f2so693xoq9m	2026-07-20 04:34:15.916	2026-07-20 04:34:15.916
cmrsqculs0001f2so2ei0bskn	cmrsqcunb000pf2solwshmolz	2026-07-20 04:34:15.922	2026-07-20 04:34:15.922
cmrsqculs0001f2so2ei0bskn	cmrsqcumj0009f2sopjm40a3x	2026-07-20 04:34:15.927	2026-07-20 04:34:15.927
cmrsqculs0001f2so2ei0bskn	cmrsqcun7000jf2som1nyv41z	2026-07-20 04:34:15.934	2026-07-20 04:34:15.934
cmrsqculs0001f2so2ei0bskn	cmrsqcun8000mf2so4abwz2l8	2026-07-20 04:34:15.942	2026-07-20 04:34:15.942
cmrsqculs0001f2so2ei0bskn	cmrsqcun8000lf2so32fruw01	2026-07-20 04:34:15.949	2026-07-20 04:34:15.949
cmrsqculs0001f2so2ei0bskn	cmrsqcunc000tf2sowrhihmsd	2026-07-20 04:34:15.955	2026-07-20 04:34:15.955
cmrsqculs0001f2so2ei0bskn	cmrsqcunf0011f2sopn4f9jlt	2026-07-20 04:34:15.961	2026-07-20 04:34:15.961
cmrsqculs0001f2so2ei0bskn	cmrsqcunc000sf2sohj398wqy	2026-07-20 04:34:15.967	2026-07-20 04:34:15.967
cmrsqculs0001f2so2ei0bskn	cmrsqcunb000qf2sot71w0w8e	2026-07-20 04:34:15.976	2026-07-20 04:34:15.976
cmrsqculs0001f2so2ei0bskn	cmrsqcuna000nf2soq7mtmj60	2026-07-20 04:34:15.982	2026-07-20 04:34:15.982
cmrsqculs0001f2so2ei0bskn	cmrsqcunc000rf2sok9jbc7fr	2026-07-20 04:34:15.988	2026-07-20 04:34:15.988
cmrsqculs0001f2so2ei0bskn	cmrsqcund000xf2sov9ofcihn	2026-07-20 04:34:15.994	2026-07-20 04:34:15.994
cmrsqculs0001f2so2ei0bskn	cmrsqcund000zf2so7l5bkcou	2026-07-20 04:34:16.001	2026-07-20 04:34:16.001
cmrsqculs0001f2so2ei0bskn	cmrsqcumv000af2sos9k6c6yv	2026-07-20 04:34:16.007	2026-07-20 04:34:16.007
cmrsqculs0001f2so2ei0bskn	cmrsqcunc000uf2sohb6ylssd	2026-07-20 04:34:16.012	2026-07-20 04:34:16.012
cmrsqculs0001f2so2ei0bskn	cmrsqcumw000bf2sogydb06gq	2026-07-20 04:34:16.018	2026-07-20 04:34:16.018
cmrsqculs0001f2so2ei0bskn	cmrsqcun8000kf2so42dcrwt9	2026-07-20 04:34:16.024	2026-07-20 04:34:16.024
cmrsqculs0001f2so2ei0bskn	cmrsqcun0000df2sodhu06v99	2026-07-20 04:34:16.03	2026-07-20 04:34:16.03
cmrsqculs0001f2so2ei0bskn	cmrsqcun0000ef2sotl3x0t1k	2026-07-20 04:34:16.036	2026-07-20 04:34:16.036
cmrsqculs0001f2so2ei0bskn	cmrsqcun1000ff2soe5iq816l	2026-07-20 04:34:16.041	2026-07-20 04:34:16.041
cmrsqculs0001f2so2ei0bskn	cmrsqcun5000hf2sop6kr4ngu	2026-07-20 04:34:16.046	2026-07-20 04:34:16.046
cmrsqculs0001f2so2ei0bskn	cmrsqcun2000gf2sootyxoew5	2026-07-20 04:34:16.052	2026-07-20 04:34:16.052
cmrsqculs0001f2so2ei0bskn	cmrsqcun5000if2sokdn8mvwr	2026-07-20 04:34:16.065	2026-07-20 04:34:16.065
cmrsqculs0001f2so2ei0bskn	cmrsqcund000yf2sonj7fb6s4	2026-07-20 04:34:16.072	2026-07-20 04:34:16.072
cmrsqculs0001f2so2ei0bskn	cmrsqcund0010f2sorqkahflm	2026-07-20 04:34:16.078	2026-07-20 04:34:16.078
cmrsqculs0001f2so2ei0bskn	cmrsqcupp0012f2so1whgpa99	2026-07-20 04:34:16.084	2026-07-20 04:34:16.084
cmrsqculs0001f2so2ei0bskn	cmrsqcupr0013f2sod8aib884	2026-07-20 04:34:16.09	2026-07-20 04:34:16.09
cmrsqculs0001f2so2ei0bskn	cmrsqcups0014f2soz41pj6bn	2026-07-20 04:34:16.096	2026-07-20 04:34:16.096
cmrsqculs0001f2so2ei0bskn	cmrsqcupt001bf2solsrvcd1c	2026-07-20 04:34:16.102	2026-07-20 04:34:16.102
cmrsqculs0001f2so2ei0bskn	cmrsqcups0015f2socq6e2m2j	2026-07-20 04:34:16.107	2026-07-20 04:34:16.107
cmrsqculs0001f2so2ei0bskn	cmrsqcups0017f2sot5msrevi	2026-07-20 04:34:16.113	2026-07-20 04:34:16.113
cmrsqculs0001f2so2ei0bskn	cmrsqcups0016f2sop06sg2wx	2026-07-20 04:34:16.121	2026-07-20 04:34:16.121
cmrsqculs0001f2so2ei0bskn	cmrsqcups0018f2sof7f9sa93	2026-07-20 04:34:16.127	2026-07-20 04:34:16.127
cmrsqculs0001f2so2ei0bskn	cmrsqcups0019f2soz1alz241	2026-07-20 04:34:16.132	2026-07-20 04:34:16.132
cmrsqculs0001f2so2ei0bskn	cmrsqcupt001af2soyx75hgd9	2026-07-20 04:34:16.137	2026-07-20 04:34:16.137
cmrsqculs0001f2so2ei0bskn	cmrsqcupt001df2so5uqyrzuc	2026-07-20 04:34:16.142	2026-07-20 04:34:16.142
cmrsqculs0001f2so2ei0bskn	cmrsqcupt001cf2so6t6dw22b	2026-07-20 04:34:16.148	2026-07-20 04:34:16.148
cmrsqculs0001f2so2ei0bskn	cmrsqcupv001ff2soosam2x4z	2026-07-20 04:34:16.154	2026-07-20 04:34:16.154
cmrsqculs0001f2so2ei0bskn	cmrsqcupt001ef2sohnfc7rmt	2026-07-20 04:34:16.159	2026-07-20 04:34:16.159
cmrsqculs0001f2so2ei0bskn	cmrsqcupx001gf2soliwe2hy0	2026-07-20 04:34:16.164	2026-07-20 04:34:16.164
cmrsqculs0001f2so2ei0bskn	cmrsqcupx001hf2so5otc4r47	2026-07-20 04:34:16.17	2026-07-20 04:34:16.17
cmrsqculs0001f2so2ei0bskn	cmrsqcupx001jf2sogakhaf8y	2026-07-20 04:34:16.176	2026-07-20 04:34:16.176
cmrsqculs0001f2so2ei0bskn	cmrsqcupx001if2sofmoyjuxe	2026-07-20 04:34:16.181	2026-07-20 04:34:16.181
cmrsqculs0001f2so2ei0bskn	cmrsqcupx001kf2so8h1nab2h	2026-07-20 04:34:16.186	2026-07-20 04:34:16.186
cmrsqculs0001f2so2ei0bskn	cmrsqcupx001lf2sodzixe8tu	2026-07-20 04:34:16.191	2026-07-20 04:34:16.191
cmrsqculs0001f2so2ei0bskn	cmrsqcupz001tf2sog0psfimj	2026-07-20 04:34:16.198	2026-07-20 04:34:16.198
cmrsqculs0001f2so2ei0bskn	cmrsqcupz001mf2so0h8eb51z	2026-07-20 04:34:16.204	2026-07-20 04:34:16.204
cmrsqculs0001f2so2ei0bskn	cmrsqcupz001of2so5zuabc57	2026-07-20 04:34:16.212	2026-07-20 04:34:16.212
cmrsqculs0001f2so2ei0bskn	cmrsqcupz001nf2somcspsxvc	2026-07-20 04:34:16.217	2026-07-20 04:34:16.217
cmrsqculs0001f2so2ei0bskn	cmrsqcupz001pf2so73q3wz4m	2026-07-20 04:34:16.223	2026-07-20 04:34:16.223
cmrsqculs0001f2so2ei0bskn	cmrsqcupz001rf2som469qccr	2026-07-20 04:34:16.228	2026-07-20 04:34:16.228
cmrsqculs0001f2so2ei0bskn	cmrsqcupz001qf2sork7763hj	2026-07-20 04:34:16.235	2026-07-20 04:34:16.235
cmrsqculs0001f2so2ei0bskn	cmrsqcupz001sf2sotwdp6lib	2026-07-20 04:34:16.244	2026-07-20 04:34:16.244
cmrsqculs0001f2so2ei0bskn	cmrsqcupz001uf2so07ex7aku	2026-07-20 04:34:16.251	2026-07-20 04:34:16.251
cmrsqculs0001f2so2ei0bskn	cmrsqcupz001vf2sobg7fahht	2026-07-20 04:34:16.26	2026-07-20 04:34:16.26
cmrsqculs0001f2so2ei0bskn	cmrsqcuq0001wf2sosezc4uy6	2026-07-20 04:34:16.266	2026-07-20 04:34:16.266
cmrsqculs0001f2so2ei0bskn	cmrsqcuq1001xf2so9byif85n	2026-07-20 04:34:16.274	2026-07-20 04:34:16.274
cmrsqculs0001f2so2ei0bskn	cmrsqcuq1001zf2so2xqqcs0s	2026-07-20 04:34:16.282	2026-07-20 04:34:16.282
cmrsqculs0001f2so2ei0bskn	cmrsqcuq1001yf2sohvzy3n49	2026-07-20 04:34:16.29	2026-07-20 04:34:16.29
cmrsqculs0001f2so2ei0bskn	cmrsqcuq10020f2so2p4233op	2026-07-20 04:34:16.297	2026-07-20 04:34:16.297
cmrsqculs0001f2so2ei0bskn	cmrsqcuq10021f2sojunqcowh	2026-07-20 04:34:16.307	2026-07-20 04:34:16.307
cmrsqculs0001f2so2ei0bskn	cmrsqcuq30023f2so7iu5xhzp	2026-07-20 04:34:16.316	2026-07-20 04:34:16.316
cmrsqculs0001f2so2ei0bskn	cmrsqcuq10022f2sozwfxu2bl	2026-07-20 04:34:16.326	2026-07-20 04:34:16.326
cmrsqculs0001f2so2ei0bskn	cmrsqcuq40024f2sowh5faq2b	2026-07-20 04:34:16.337	2026-07-20 04:34:16.337
cmrsqculs0001f2so2ei0bskn	cmrsqcuq40027f2so0uri93lc	2026-07-20 04:34:16.348	2026-07-20 04:34:16.348
cmrsqculs0001f2so2ei0bskn	cmrsqcuq40025f2soz2mk1zej	2026-07-20 04:34:16.363	2026-07-20 04:34:16.363
cmrsqculs0001f2so2ei0bskn	cmrsqcuq40026f2soiyxwl77d	2026-07-20 04:34:16.37	2026-07-20 04:34:16.37
cmrsqculs0001f2so2ei0bskn	cmrsqcuq40028f2sob1x1izng	2026-07-20 04:34:16.378	2026-07-20 04:34:16.378
cmrsqculs0001f2so2ei0bskn	cmrsqcuq40029f2sora5nke7t	2026-07-20 04:34:16.386	2026-07-20 04:34:16.386
cmrsqculs0001f2so2ei0bskn	cmrsqcuq4002af2soqtsrnebo	2026-07-20 04:34:16.394	2026-07-20 04:34:16.394
cmrsqculs0001f2so2ei0bskn	cmrsqcuq5002cf2sotc5is1va	2026-07-20 04:34:16.401	2026-07-20 04:34:16.401
cmrsqculs0001f2so2ei0bskn	cmrsqcuq5002bf2somjnqxpbx	2026-07-20 04:34:16.408	2026-07-20 04:34:16.408
cmrsqculs0001f2so2ei0bskn	cmrsqcuq5002df2sog1wb0e0f	2026-07-20 04:34:16.416	2026-07-20 04:34:16.416
cmrsqculs0001f2so2ei0bskn	cmrsqcuq6002ef2sovkhpk4c1	2026-07-20 04:34:16.423	2026-07-20 04:34:16.423
cmrsqculs0001f2so2ei0bskn	cmrsqcuq6002gf2sojvkv30cj	2026-07-20 04:34:16.43	2026-07-20 04:34:16.43
cmrsqculs0001f2so2ei0bskn	cmrsqcuq6002ff2soc2md1pd1	2026-07-20 04:34:16.437	2026-07-20 04:34:16.437
cmrsqculs0001f2so2ei0bskn	cmrsqcuq6002if2solaag31rj	2026-07-20 04:34:16.445	2026-07-20 04:34:16.445
cmrsqculs0001f2so2ei0bskn	cmrsqcuq6002kf2soezxaer23	2026-07-20 04:34:16.452	2026-07-20 04:34:16.452
cmrsqculs0001f2so2ei0bskn	cmrsqcuq6002hf2so6zig36ql	2026-07-20 04:34:16.458	2026-07-20 04:34:16.458
cmrsqculs0001f2so2ei0bskn	cmrsqcuq9002lf2soi91q0jlb	2026-07-20 04:34:16.466	2026-07-20 04:34:16.466
cmrsqculs0001f2so2ei0bskn	cmrsqcuq6002jf2sof5gk618w	2026-07-20 04:34:16.474	2026-07-20 04:34:16.474
cmrsqculs0001f2so2ei0bskn	cmrsqcuq9002nf2soy1zjfoyo	2026-07-20 04:34:16.481	2026-07-20 04:34:16.481
cmrsqculs0001f2so2ei0bskn	cmrsqcuq9002mf2soo90d56gx	2026-07-20 04:34:16.487	2026-07-20 04:34:16.487
cmrsqculs0001f2so2ei0bskn	cmrsqcuq9002of2sobgod0mmj	2026-07-20 04:34:16.493	2026-07-20 04:34:16.493
cmrsqculs0001f2so2ei0bskn	cmrsqcuq9002pf2so9l8l2j4g	2026-07-20 04:34:16.499	2026-07-20 04:34:16.499
cmrsqculs0001f2so2ei0bskn	cmrsqcuqb002qf2so32ieo3cs	2026-07-20 04:34:16.505	2026-07-20 04:34:16.505
cmrsqculs0001f2so2ei0bskn	cmrsqcuqb002rf2sokfoytj2i	2026-07-20 04:34:16.511	2026-07-20 04:34:16.511
cmrsqculs0001f2so2ei0bskn	cmrsqcuqb002tf2sogf0fijik	2026-07-20 04:34:16.516	2026-07-20 04:34:16.516
cmrsqculs0001f2so2ei0bskn	cmrsqcuqb002vf2soldyrzrf0	2026-07-20 04:34:16.523	2026-07-20 04:34:16.523
cmrsqculs0001f2so2ei0bskn	cmrsqcuqb002sf2socipzfmpb	2026-07-20 04:34:16.528	2026-07-20 04:34:16.528
cmrsqculs0001f2so2ei0bskn	cmrsqcuqb002uf2sobje0lkbo	2026-07-20 04:34:16.534	2026-07-20 04:34:16.534
cmrsqculs0001f2so2ei0bskn	cmrsqcuqb002wf2soetbja7ia	2026-07-20 04:34:16.54	2026-07-20 04:34:16.54
cmrsqculs0001f2so2ei0bskn	cmrsqcuqb002xf2sommgh1shr	2026-07-20 04:34:16.546	2026-07-20 04:34:16.546
cmrsqculs0001f2so2ei0bskn	cmrsqcuqb002yf2soy1bp4a6m	2026-07-20 04:34:16.554	2026-07-20 04:34:16.554
cmrsqculs0001f2so2ei0bskn	cmrsqcuqb002zf2so1frlp0hw	2026-07-20 04:34:16.563	2026-07-20 04:34:16.563
cmrsqculs0001f2so2ei0bskn	cmrsqcuqb0030f2sox4akip6w	2026-07-20 04:34:16.573	2026-07-20 04:34:16.573
cmrsqculs0001f2so2ei0bskn	cmrsqcuqb0031f2sodgzbieje	2026-07-20 04:34:16.593	2026-07-20 04:34:16.593
cmrsqculs0001f2so2ei0bskn	cmrsqcuqc0032f2soi447c8y3	2026-07-20 04:34:16.602	2026-07-20 04:34:16.602
cmrsqculs0001f2so2ei0bskn	cmrsqcuqd0033f2soz6ak6upe	2026-07-20 04:34:16.609	2026-07-20 04:34:16.609
cmrsqculs0001f2so2ei0bskn	cmrsqcuqd0035f2so8ux51a05	2026-07-20 04:34:16.619	2026-07-20 04:34:16.619
cmrsqculs0001f2so2ei0bskn	cmrsqcuqd0034f2so0gq3mbrt	2026-07-20 04:34:16.627	2026-07-20 04:34:16.627
cmrsqculs0001f2so2ei0bskn	cmrsqcuqd0036f2so0179evsp	2026-07-20 04:34:16.635	2026-07-20 04:34:16.635
cmrsqculs0001f2so2ei0bskn	cmrsqcuqe0037f2somcodj0wr	2026-07-20 04:34:16.643	2026-07-20 04:34:16.643
cmrsqculs0001f2so2ei0bskn	cmrsqcuqe0039f2soh6qb72m1	2026-07-20 04:34:16.651	2026-07-20 04:34:16.651
cmrsqculs0001f2so2ei0bskn	cmrsqcuqe0038f2sod4c50ghz	2026-07-20 04:34:16.659	2026-07-20 04:34:16.659
cmrsqculs0001f2so2ei0bskn	cmrsqcuqe003af2so9tl1svs0	2026-07-20 04:34:16.666	2026-07-20 04:34:16.666
cmrsqculs0001f2so2ei0bskn	cmrsqcuqe003bf2so6pi90n2v	2026-07-20 04:34:16.674	2026-07-20 04:34:16.674
cmrsqculy0003f2solzyk3677	cmrsqcumi0005f2sol1fwz7fm	2026-07-20 04:34:16.684	2026-07-20 04:34:16.684
cmrsqculy0003f2solzyk3677	cmrsqcumz000cf2so35raqtlq	2026-07-20 04:34:16.691	2026-07-20 04:34:16.691
cmrsqculy0003f2solzyk3677	cmrsqcumi0007f2so693xoq9m	2026-07-20 04:34:16.698	2026-07-20 04:34:16.698
cmrsqculy0003f2solzyk3677	cmrsqcunb000pf2solwshmolz	2026-07-20 04:34:16.705	2026-07-20 04:34:16.705
cmrsqculy0003f2solzyk3677	cmrsqcumj0009f2sopjm40a3x	2026-07-20 04:34:16.711	2026-07-20 04:34:16.711
cmrsqculy0003f2solzyk3677	cmrsqcun7000jf2som1nyv41z	2026-07-20 04:34:16.717	2026-07-20 04:34:16.717
cmrsqculy0003f2solzyk3677	cmrsqcun8000mf2so4abwz2l8	2026-07-20 04:34:16.723	2026-07-20 04:34:16.723
cmrsqculy0003f2solzyk3677	cmrsqcun8000lf2so32fruw01	2026-07-20 04:34:16.729	2026-07-20 04:34:16.729
cmrsqculy0003f2solzyk3677	cmrsqcunc000tf2sowrhihmsd	2026-07-20 04:34:16.734	2026-07-20 04:34:16.734
cmrsqculy0003f2solzyk3677	cmrsqcunf0011f2sopn4f9jlt	2026-07-20 04:34:16.741	2026-07-20 04:34:16.741
cmrsqculy0003f2solzyk3677	cmrsqcunc000sf2sohj398wqy	2026-07-20 04:34:16.747	2026-07-20 04:34:16.747
cmrsqculy0003f2solzyk3677	cmrsqcunb000qf2sot71w0w8e	2026-07-20 04:34:16.753	2026-07-20 04:34:16.753
cmrsqculy0003f2solzyk3677	cmrsqcuna000nf2soq7mtmj60	2026-07-20 04:34:16.759	2026-07-20 04:34:16.759
cmrsqculy0003f2solzyk3677	cmrsqcunc000rf2sok9jbc7fr	2026-07-20 04:34:16.767	2026-07-20 04:34:16.767
cmrsqculy0003f2solzyk3677	cmrsqcund000xf2sov9ofcihn	2026-07-20 04:34:16.774	2026-07-20 04:34:16.774
cmrsqculy0003f2solzyk3677	cmrsqcund000zf2so7l5bkcou	2026-07-20 04:34:16.78	2026-07-20 04:34:16.78
cmrsqculy0003f2solzyk3677	cmrsqcumv000af2sos9k6c6yv	2026-07-20 04:34:16.786	2026-07-20 04:34:16.786
cmrsqculy0003f2solzyk3677	cmrsqcunc000uf2sohb6ylssd	2026-07-20 04:34:16.792	2026-07-20 04:34:16.792
cmrsqculy0003f2solzyk3677	cmrsqcumw000bf2sogydb06gq	2026-07-20 04:34:16.801	2026-07-20 04:34:16.801
cmrsqculy0003f2solzyk3677	cmrsqcun8000kf2so42dcrwt9	2026-07-20 04:34:16.808	2026-07-20 04:34:16.808
cmrsqculy0003f2solzyk3677	cmrsqcun0000df2sodhu06v99	2026-07-20 04:34:16.813	2026-07-20 04:34:16.813
cmrsqculy0003f2solzyk3677	cmrsqcun0000ef2sotl3x0t1k	2026-07-20 04:34:16.818	2026-07-20 04:34:16.818
cmrsqculy0003f2solzyk3677	cmrsqcun1000ff2soe5iq816l	2026-07-20 04:34:16.825	2026-07-20 04:34:16.825
cmrsqculy0003f2solzyk3677	cmrsqcun5000hf2sop6kr4ngu	2026-07-20 04:34:16.836	2026-07-20 04:34:16.836
cmrsqculy0003f2solzyk3677	cmrsqcun2000gf2sootyxoew5	2026-07-20 04:34:16.844	2026-07-20 04:34:16.844
cmrsqculy0003f2solzyk3677	cmrsqcun5000if2sokdn8mvwr	2026-07-20 04:34:16.851	2026-07-20 04:34:16.851
cmrsqculy0003f2solzyk3677	cmrsqcund000yf2sonj7fb6s4	2026-07-20 04:34:16.857	2026-07-20 04:34:16.857
cmrsqculy0003f2solzyk3677	cmrsqcund0010f2sorqkahflm	2026-07-20 04:34:16.863	2026-07-20 04:34:16.863
cmrsqculy0003f2solzyk3677	cmrsqcupr0013f2sod8aib884	2026-07-20 04:34:16.869	2026-07-20 04:34:16.869
cmrsqculy0003f2solzyk3677	cmrsqcups0014f2soz41pj6bn	2026-07-20 04:34:16.875	2026-07-20 04:34:16.875
cmrsqculy0003f2solzyk3677	cmrsqcups0019f2soz1alz241	2026-07-20 04:34:16.881	2026-07-20 04:34:16.881
cmrsqculy0003f2solzyk3677	cmrsqcupt001af2soyx75hgd9	2026-07-20 04:34:16.889	2026-07-20 04:34:16.889
cmrsqculy0003f2solzyk3677	cmrsqcupt001df2so5uqyrzuc	2026-07-20 04:34:16.898	2026-07-20 04:34:16.898
cmrsqculy0003f2solzyk3677	cmrsqcupt001cf2so6t6dw22b	2026-07-20 04:34:16.907	2026-07-20 04:34:16.907
cmrsqculy0003f2solzyk3677	cmrsqcupv001ff2soosam2x4z	2026-07-20 04:34:16.916	2026-07-20 04:34:16.916
cmrsqculy0003f2solzyk3677	cmrsqcupx001gf2soliwe2hy0	2026-07-20 04:34:16.925	2026-07-20 04:34:16.925
cmrsqculy0003f2solzyk3677	cmrsqcupx001hf2so5otc4r47	2026-07-20 04:34:16.933	2026-07-20 04:34:16.933
cmrsqculy0003f2solzyk3677	cmrsqcupx001jf2sogakhaf8y	2026-07-20 04:34:16.942	2026-07-20 04:34:16.942
cmrsqculy0003f2solzyk3677	cmrsqcupx001if2sofmoyjuxe	2026-07-20 04:34:16.954	2026-07-20 04:34:16.954
cmrsqculy0003f2solzyk3677	cmrsqcupx001kf2so8h1nab2h	2026-07-20 04:34:16.961	2026-07-20 04:34:16.961
cmrsqculy0003f2solzyk3677	cmrsqcupx001lf2sodzixe8tu	2026-07-20 04:34:16.971	2026-07-20 04:34:16.971
cmrsqculy0003f2solzyk3677	cmrsqcupz001tf2sog0psfimj	2026-07-20 04:34:16.978	2026-07-20 04:34:16.978
cmrsqculy0003f2solzyk3677	cmrsqcupz001mf2so0h8eb51z	2026-07-20 04:34:16.987	2026-07-20 04:34:16.987
cmrsqculy0003f2solzyk3677	cmrsqcupz001of2so5zuabc57	2026-07-20 04:34:16.996	2026-07-20 04:34:16.996
cmrsqculy0003f2solzyk3677	cmrsqcupz001nf2somcspsxvc	2026-07-20 04:34:17.004	2026-07-20 04:34:17.004
cmrsqculy0003f2solzyk3677	cmrsqcupz001pf2so73q3wz4m	2026-07-20 04:34:17.012	2026-07-20 04:34:17.012
cmrsqculy0003f2solzyk3677	cmrsqcupz001rf2som469qccr	2026-07-20 04:34:17.02	2026-07-20 04:34:17.02
cmrsqculy0003f2solzyk3677	cmrsqcupz001qf2sork7763hj	2026-07-20 04:34:17.027	2026-07-20 04:34:17.027
cmrsqculy0003f2solzyk3677	cmrsqcupz001vf2sobg7fahht	2026-07-20 04:34:17.034	2026-07-20 04:34:17.034
cmrsqculy0003f2solzyk3677	cmrsqcuq1001xf2so9byif85n	2026-07-20 04:34:17.041	2026-07-20 04:34:17.041
cmrsqculy0003f2solzyk3677	cmrsqcuq6002if2solaag31rj	2026-07-20 04:34:17.048	2026-07-20 04:34:17.048
cmrsqculy0003f2solzyk3677	cmrsqcuq6002jf2sof5gk618w	2026-07-20 04:34:17.056	2026-07-20 04:34:17.056
cmrsqculy0003f2solzyk3677	cmrsqcuq9002nf2soy1zjfoyo	2026-07-20 04:34:17.061	2026-07-20 04:34:17.061
cmrsqculy0003f2solzyk3677	cmrsqcuq9002mf2soo90d56gx	2026-07-20 04:34:17.067	2026-07-20 04:34:17.067
cmrsqculy0003f2solzyk3677	cmrsqcuq9002pf2so9l8l2j4g	2026-07-20 04:34:17.073	2026-07-20 04:34:17.073
cmrsqculy0003f2solzyk3677	cmrsqcuqb002qf2so32ieo3cs	2026-07-20 04:34:17.079	2026-07-20 04:34:17.079
cmrsqculy0003f2solzyk3677	cmrsqcuqb002rf2sokfoytj2i	2026-07-20 04:34:17.085	2026-07-20 04:34:17.085
cmrsqculy0003f2solzyk3677	cmrsqcuqb002tf2sogf0fijik	2026-07-20 04:34:17.093	2026-07-20 04:34:17.093
cmrsqculy0003f2solzyk3677	cmrsqcuqb002vf2soldyrzrf0	2026-07-20 04:34:17.099	2026-07-20 04:34:17.099
cmrsqculy0003f2solzyk3677	cmrsqcuqb002sf2socipzfmpb	2026-07-20 04:34:17.105	2026-07-20 04:34:17.105
cmrsqculy0003f2solzyk3677	cmrsqcuqb002uf2sobje0lkbo	2026-07-20 04:34:17.111	2026-07-20 04:34:17.111
cmrsqculy0003f2solzyk3677	cmrsqcuqb002wf2soetbja7ia	2026-07-20 04:34:17.117	2026-07-20 04:34:17.117
cmrsqculy0003f2solzyk3677	cmrsqcuqb002xf2sommgh1shr	2026-07-20 04:34:17.124	2026-07-20 04:34:17.124
cmrsqculy0003f2solzyk3677	cmrsqcuqb002yf2soy1bp4a6m	2026-07-20 04:34:17.13	2026-07-20 04:34:17.13
cmrsqculy0003f2solzyk3677	cmrsqcuqb002zf2so1frlp0hw	2026-07-20 04:34:17.137	2026-07-20 04:34:17.137
cmrsqculy0003f2solzyk3677	cmrsqcuqb0030f2sox4akip6w	2026-07-20 04:34:17.144	2026-07-20 04:34:17.144
cmrsqculy0003f2solzyk3677	cmrsqcuqb0031f2sodgzbieje	2026-07-20 04:34:17.15	2026-07-20 04:34:17.15
cmrsqculy0003f2solzyk3677	cmrsqcuqc0032f2soi447c8y3	2026-07-20 04:34:17.156	2026-07-20 04:34:17.156
cmrsqculy0003f2solzyk3677	cmrsqcuqd0035f2so8ux51a05	2026-07-20 04:34:17.162	2026-07-20 04:34:17.162
cmrsqculy0003f2solzyk3677	cmrsqcuqd0034f2so0gq3mbrt	2026-07-20 04:34:17.167	2026-07-20 04:34:17.167
cmrsqculy0003f2solzyk3677	cmrsqcuqd0036f2so0179evsp	2026-07-20 04:34:17.175	2026-07-20 04:34:17.175
cmrsqculy0003f2solzyk3677	cmrsqcuqe0037f2somcodj0wr	2026-07-20 04:34:17.181	2026-07-20 04:34:17.181
cmrsqculy0003f2solzyk3677	cmrsqcuqe0039f2soh6qb72m1	2026-07-20 04:34:17.188	2026-07-20 04:34:17.188
cmrsqculy0003f2solzyk3677	cmrsqcuqe0038f2sod4c50ghz	2026-07-20 04:34:17.194	2026-07-20 04:34:17.194
cmrsqculy0003f2solzyk3677	cmrsqcuqe003af2so9tl1svs0	2026-07-20 04:34:17.2	2026-07-20 04:34:17.2
cmrsqculy0003f2solzyk3677	cmrsqcuqe003bf2so6pi90n2v	2026-07-20 04:34:17.206	2026-07-20 04:34:17.206
cmrsqculy0002f2soi04lllt2	cmrsqcun7000jf2som1nyv41z	2026-07-20 04:34:17.216	2026-07-20 04:34:17.216
cmrsqculy0002f2soi04lllt2	cmrsqcupt001bf2solsrvcd1c	2026-07-20 04:34:17.222	2026-07-20 04:34:17.222
cmrsqculy0002f2soi04lllt2	cmrsqcups0015f2socq6e2m2j	2026-07-20 04:34:17.228	2026-07-20 04:34:17.228
cmrsqculy0002f2soi04lllt2	cmrsqcups0017f2sot5msrevi	2026-07-20 04:34:17.233	2026-07-20 04:34:17.233
cmrsqculy0002f2soi04lllt2	cmrsqcups0016f2sop06sg2wx	2026-07-20 04:34:17.24	2026-07-20 04:34:17.24
cmrsqculy0002f2soi04lllt2	cmrsqcuq1001zf2so2xqqcs0s	2026-07-20 04:34:17.246	2026-07-20 04:34:17.246
cmrsqculy0002f2soi04lllt2	cmrsqcuq1001yf2sohvzy3n49	2026-07-20 04:34:17.251	2026-07-20 04:34:17.251
cmrsqculy0002f2soi04lllt2	cmrsqcuq10020f2so2p4233op	2026-07-20 04:34:17.258	2026-07-20 04:34:17.258
cmrsqculy0002f2soi04lllt2	cmrsqcuq10021f2sojunqcowh	2026-07-20 04:34:17.264	2026-07-20 04:34:17.264
cmrsqculy0002f2soi04lllt2	cmrsqcuq30023f2so7iu5xhzp	2026-07-20 04:34:17.269	2026-07-20 04:34:17.269
cmrsqculy0002f2soi04lllt2	cmrsqcuq10022f2sozwfxu2bl	2026-07-20 04:34:17.275	2026-07-20 04:34:17.275
cmrsqculy0002f2soi04lllt2	cmrsqcuq40024f2sowh5faq2b	2026-07-20 04:34:17.281	2026-07-20 04:34:17.281
cmrsqculy0002f2soi04lllt2	cmrsqcuq40027f2so0uri93lc	2026-07-20 04:34:17.288	2026-07-20 04:34:17.288
cmrsqculy0002f2soi04lllt2	cmrsqcuq40025f2soz2mk1zej	2026-07-20 04:34:17.295	2026-07-20 04:34:17.295
cmrsqculy0002f2soi04lllt2	cmrsqcuq40026f2soiyxwl77d	2026-07-20 04:34:17.302	2026-07-20 04:34:17.302
cmrsqculy0002f2soi04lllt2	cmrsqcuq40028f2sob1x1izng	2026-07-20 04:34:17.308	2026-07-20 04:34:17.308
cmrsqculy0002f2soi04lllt2	cmrsqcuq40029f2sora5nke7t	2026-07-20 04:34:17.317	2026-07-20 04:34:17.317
cmrsqculy0002f2soi04lllt2	cmrsqcuq4002af2soqtsrnebo	2026-07-20 04:34:17.325	2026-07-20 04:34:17.325
cmrsqculy0002f2soi04lllt2	cmrsqcuq5002cf2sotc5is1va	2026-07-20 04:34:17.332	2026-07-20 04:34:17.332
cmrsqculy0002f2soi04lllt2	cmrsqcuq5002bf2somjnqxpbx	2026-07-20 04:34:17.341	2026-07-20 04:34:17.341
cmrsqculy0002f2soi04lllt2	cmrsqcuq5002df2sog1wb0e0f	2026-07-20 04:34:17.351	2026-07-20 04:34:17.351
cmrsqculy0002f2soi04lllt2	cmrsqcuq6002ef2sovkhpk4c1	2026-07-20 04:34:17.359	2026-07-20 04:34:17.359
cmrsqculy0002f2soi04lllt2	cmrsqcuq6002gf2sojvkv30cj	2026-07-20 04:34:17.368	2026-07-20 04:34:17.368
cmrsqculy0002f2soi04lllt2	cmrsqcuq6002kf2soezxaer23	2026-07-20 04:34:17.376	2026-07-20 04:34:17.376
cmrsqculy0002f2soi04lllt2	cmrsqcuq9002of2sobgod0mmj	2026-07-20 04:34:17.383	2026-07-20 04:34:17.383
cmrsqculy0002f2soi04lllt2	cmrsqcuqb002tf2sogf0fijik	2026-07-20 04:34:17.39	2026-07-20 04:34:17.39
cmrsqculy0004f2sosncsgjsq	cmrsqcun7000jf2som1nyv41z	2026-07-20 04:34:17.404	2026-07-20 04:34:17.404
cmrsqculy0004f2sosncsgjsq	cmrsqcuna000nf2soq7mtmj60	2026-07-20 04:34:17.419	2026-07-20 04:34:17.419
cmrsqculy0004f2sosncsgjsq	cmrsqcunc000uf2sohb6ylssd	2026-07-20 04:34:17.427	2026-07-20 04:34:17.427
cmrsqculy0004f2sosncsgjsq	cmrsqcun8000kf2so42dcrwt9	2026-07-20 04:34:17.436	2026-07-20 04:34:17.436
cmrsqculy0004f2sosncsgjsq	cmrsqcun0000ef2sotl3x0t1k	2026-07-20 04:34:17.443	2026-07-20 04:34:17.443
cmrsqculy0004f2sosncsgjsq	cmrsqcund0010f2sorqkahflm	2026-07-20 04:34:17.452	2026-07-20 04:34:17.452
cmrsqculy0004f2sosncsgjsq	cmrsqcupp0012f2so1whgpa99	2026-07-20 04:34:17.46	2026-07-20 04:34:17.46
cmrsqculy0004f2sosncsgjsq	cmrsqcupr0013f2sod8aib884	2026-07-20 04:34:17.466	2026-07-20 04:34:17.466
cmrsqculy0004f2sosncsgjsq	cmrsqcups0014f2soz41pj6bn	2026-07-20 04:34:17.475	2026-07-20 04:34:17.475
cmrsqculy0004f2sosncsgjsq	cmrsqcupv001ff2soosam2x4z	2026-07-20 04:34:17.482	2026-07-20 04:34:17.482
cmrsqculy0004f2sosncsgjsq	cmrsqcupt001ef2sohnfc7rmt	2026-07-20 04:34:17.488	2026-07-20 04:34:17.488
cmrsqculy0004f2sosncsgjsq	cmrsqcupx001gf2soliwe2hy0	2026-07-20 04:34:17.493	2026-07-20 04:34:17.493
cmrsqculy0004f2sosncsgjsq	cmrsqcupx001jf2sogakhaf8y	2026-07-20 04:34:17.499	2026-07-20 04:34:17.499
cmrsqculy0004f2sosncsgjsq	cmrsqcupx001if2sofmoyjuxe	2026-07-20 04:34:17.505	2026-07-20 04:34:17.505
cmrsqculy0004f2sosncsgjsq	cmrsqcupx001kf2so8h1nab2h	2026-07-20 04:34:17.51	2026-07-20 04:34:17.51
cmrsqculy0004f2sosncsgjsq	cmrsqcupx001lf2sodzixe8tu	2026-07-20 04:34:17.515	2026-07-20 04:34:17.515
cmrsqculy0004f2sosncsgjsq	cmrsqcupz001tf2sog0psfimj	2026-07-20 04:34:17.523	2026-07-20 04:34:17.523
cmrsqculy0004f2sosncsgjsq	cmrsqcupz001mf2so0h8eb51z	2026-07-20 04:34:17.528	2026-07-20 04:34:17.528
cmrsqculy0004f2sosncsgjsq	cmrsqcupz001of2so5zuabc57	2026-07-20 04:34:17.534	2026-07-20 04:34:17.534
cmrsqculy0004f2sosncsgjsq	cmrsqcupz001nf2somcspsxvc	2026-07-20 04:34:17.54	2026-07-20 04:34:17.54
cmrsqculy0004f2sosncsgjsq	cmrsqcupz001pf2so73q3wz4m	2026-07-20 04:34:17.546	2026-07-20 04:34:17.546
cmrsqculy0004f2sosncsgjsq	cmrsqcupz001rf2som469qccr	2026-07-20 04:34:17.552	2026-07-20 04:34:17.552
cmrsqculy0004f2sosncsgjsq	cmrsqcupz001qf2sork7763hj	2026-07-20 04:34:17.558	2026-07-20 04:34:17.558
cmrsqculy0004f2sosncsgjsq	cmrsqcupz001vf2sobg7fahht	2026-07-20 04:34:17.563	2026-07-20 04:34:17.563
cmrsqculy0004f2sosncsgjsq	cmrsqcuq0001wf2sosezc4uy6	2026-07-20 04:34:17.569	2026-07-20 04:34:17.569
cmrsqculy0004f2sosncsgjsq	cmrsqcuq1001xf2so9byif85n	2026-07-20 04:34:17.574	2026-07-20 04:34:17.574
cmrsqculy0004f2sosncsgjsq	cmrsqcuq6002hf2so6zig36ql	2026-07-20 04:34:17.58	2026-07-20 04:34:17.58
cmrsqculc0000f2so9jtilz0y	cmrsqcun7000jf2som1nyv41z	2026-07-20 04:34:17.588	2026-07-20 04:34:17.588
cmrsqculc0000f2so9jtilz0y	cmrsqcunc000uf2sohb6ylssd	2026-07-20 04:34:17.593	2026-07-20 04:34:17.593
cmrsqculc0000f2so9jtilz0y	cmrsqcun8000kf2so42dcrwt9	2026-07-20 04:34:17.599	2026-07-20 04:34:17.599
cmrsqculc0000f2so9jtilz0y	cmrsqcun0000ef2sotl3x0t1k	2026-07-20 04:34:17.605	2026-07-20 04:34:17.605
cmrsqculc0000f2so9jtilz0y	cmrsqcund0010f2sorqkahflm	2026-07-20 04:34:17.61	2026-07-20 04:34:17.61
cmrsqculc0000f2so9jtilz0y	cmrsqcupr0013f2sod8aib884	2026-07-20 04:34:17.617	2026-07-20 04:34:17.617
cmrsqculc0000f2so9jtilz0y	cmrsqcupt001bf2solsrvcd1c	2026-07-20 04:34:17.622	2026-07-20 04:34:17.622
cmrsqculc0000f2so9jtilz0y	cmrsqcups0017f2sot5msrevi	2026-07-20 04:34:17.628	2026-07-20 04:34:17.628
cmrsqculc0000f2so9jtilz0y	cmrsqcupv001ff2soosam2x4z	2026-07-20 04:34:17.634	2026-07-20 04:34:17.634
cmrsqculc0000f2so9jtilz0y	cmrsqcupz001qf2sork7763hj	2026-07-20 04:34:17.64	2026-07-20 04:34:17.64
cmrsqculc0000f2so9jtilz0y	cmrsqcupz001sf2sotwdp6lib	2026-07-20 04:34:17.647	2026-07-20 04:34:17.647
cmrsqculc0000f2so9jtilz0y	cmrsqcupz001uf2so07ex7aku	2026-07-20 04:34:17.652	2026-07-20 04:34:17.652
cmrsqculc0000f2so9jtilz0y	cmrsqcupz001vf2sobg7fahht	2026-07-20 04:34:17.659	2026-07-20 04:34:17.659
cmrsqculc0000f2so9jtilz0y	cmrsqcuq9002lf2soi91q0jlb	2026-07-20 04:34:17.664	2026-07-20 04:34:17.664
cmrsqculc0000f2so9jtilz0y	cmrsqcuqb002vf2soldyrzrf0	2026-07-20 04:34:17.67	2026-07-20 04:34:17.67
cmrsqculc0000f2so9jtilz0y	cmrsqcuqb002zf2so1frlp0hw	2026-07-20 04:34:17.676	2026-07-20 04:34:17.676
cmrsqculc0000f2so9jtilz0y	cmrsqcuqb0031f2sodgzbieje	2026-07-20 04:34:17.682	2026-07-20 04:34:17.682
cmrsqculc0000f2so9jtilz0y	cmrsqcuqc0032f2soi447c8y3	2026-07-20 04:34:17.688	2026-07-20 04:34:17.688
cmrsqculc0000f2so9jtilz0y	cmrsqcuqd0033f2soz6ak6upe	2026-07-20 04:34:17.693	2026-07-20 04:34:17.693
cmrsqculc0000f2so9jtilz0y	cmrsqcuqe0037f2somcodj0wr	2026-07-20 04:34:17.7	2026-07-20 04:34:17.7
cmrsqculc0000f2so9jtilz0y	cmrsqcuqe0039f2soh6qb72m1	2026-07-20 04:34:17.706	2026-07-20 04:34:17.706
\.


--
-- Data for Name: Schedule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Schedule" (id, "classSectionId", "dayOfWeek", "startTime", "endTime", room, "validFrom", "validTo", "createdAt", "updatedAt") FROM stdin;
cmrsqcwmw006df2so3inro5mr	cmrsqcwmo006bf2soo9bp627d	2	07:00:00	09:00:00	A1.01	\N	\N	2026-07-20 04:34:18.296	2026-07-20 04:34:18.296
cmrsqcwn7006hf2sozgysaa7a	cmrsqcwn2006ff2soz4ylvv1j	3	09:00:00	11:00:00	A2.02	\N	\N	2026-07-20 04:34:18.307	2026-07-20 04:34:18.307
cmrsqcwne006lf2sophc67be1	cmrsqcwna006jf2sox594bt16	4	11:00:00	13:00:00	A3.03	\N	\N	2026-07-20 04:34:18.314	2026-07-20 04:34:18.314
cmrsqcwnn006pf2sotolv0ir6	cmrsqcwnj006nf2sojg7ncvvy	5	07:00:00	09:00:00	A4.04	\N	\N	2026-07-20 04:34:18.323	2026-07-20 04:34:18.323
cmrsqcwnv006tf2sojem58i36	cmrsqcwnr006rf2soua06gz0o	6	09:00:00	11:00:00	A5.01	\N	\N	2026-07-20 04:34:18.331	2026-07-20 04:34:18.331
cmrsqcwo3006xf2sohfip6is1	cmrsqcwny006vf2sog9s15jny	7	11:00:00	13:00:00	A6.02	\N	\N	2026-07-20 04:34:18.339	2026-07-20 04:34:18.339
cmrsqcwoc0071f2sogiyuxde9	cmrsqcwo8006zf2sov676a89x	2	07:00:00	09:00:00	A7.03	\N	\N	2026-07-20 04:34:18.348	2026-07-20 04:34:18.348
cmrsqcwok0075f2so8j1y08pz	cmrsqcwog0073f2so6a3r98tm	3	09:00:00	11:00:00	A8.04	\N	\N	2026-07-20 04:34:18.356	2026-07-20 04:34:18.356
\.


--
-- Data for Name: Scholarship; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Scholarship" (id, code, name, description, "discountType", "discountValue", "maximumAmount", "applicableFeeTypeId", "effectiveFrom", "effectiveTo", "isActive", "createdAt", "updatedAt") FROM stdin;
cmrsqcxvr00kbf2sochen6sn7	SCH-100	Học bổng toàn phần	\N	PERCENTAGE	100.00	\N	\N	2025-08-01	\N	t	2026-07-20 04:34:19.912	2026-07-20 04:34:19.912
\.


--
-- Data for Name: Semester; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Semester" (id, "academicYearId", code, name, term, "startDate", "endDate", "registrationStartDate", "registrationEndDate", "maxCredits", status, "createdAt", "updatedAt") FROM stdin;
cmrsqcw7m003jf2som6m8021h	cmrsqcw7f003ff2souurq2vsj	2025-2026-HK2	Học kỳ 2 - Năm học 2025-2026	SECOND	2026-02-01	2026-07-31	2026-01-10 00:00:00	2026-01-25 23:59:59	24	IN_PROGRESS	2026-07-20 04:34:17.746	2026-07-20 04:34:17.746
cmrsqcw7m003if2soow1p44ox	cmrsqcw7f003ff2souurq2vsj	2025-2026-HK1	Học kỳ 1 - Năm học 2025-2026	FIRST	2025-09-01	2026-01-15	2025-08-01 00:00:00	2025-08-20 23:59:59	24	COMPLETED	2026-07-20 04:34:17.746	2026-07-20 04:34:17.746
\.


--
-- Data for Name: ServiceRequest; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ServiceRequest" (id, "requestNumber", "studentId", "categoryId", subject, description, priority, status, "assignedToUserId", "assignedByUserId", "assignedAt", "dueAt", "firstResponseAt", "resolvedAt", "resolvedByUserId", "resolutionSummary", "cancelledAt", "cancelledByUserId", "cancelReason", "closedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ServiceRequestAttachment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ServiceRequestAttachment" (id, "serviceRequestId", "commentId", "uploadedByUserId", "originalName", "storageKey", "mimeType", "sizeBytes", checksum, "createdAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: ServiceRequestCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ServiceRequestCategory" (id, code, name, description, "owningDepartmentId", "defaultPriority", "defaultAssigneeRoleId", "slaHours", "requiresAttachment", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ServiceRequestComment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ServiceRequestComment" (id, "serviceRequestId", "authorUserId", content, visibility, "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: Student; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Student" (id, "studentCode", "userId", "departmentId", "admissionAcademicYearId", "fullName", email, phone, "dateOfBirth", gender, address, "cohortClass", cohort, "enrollmentDate", "academicStatus", "createdAt", "updatedAt", "deletedAt") FROM stdin;
cmrsqcwbj0044f2soug319lxa	SV2025001	cmrsqcwb50042f2sod3a47h3n	cmrsqcw7w003kf2soklf35dc0	cmrsqcw7f003ff2souurq2vsj	Sinh viên Mẫu 01	student@school.local	0912000001	2000-01-15	MALE	Thành phố Hồ Chí Minh	CNTT2025A	K2025	2025-09-01	STUDYING	2026-07-20 04:34:17.888	2026-07-20 04:34:17.888	\N
cmrsqcwc60047f2so7vfe51gp	SV2025002	cmrsqcwbu0045f2so0yy0g6gg	cmrsqcw7w003lf2sov68d73bz	cmrsqcw7f003ff2souurq2vsj	Sinh viên Mẫu 02	student2@school.local	0912000002	2001-02-15	FEMALE	Thành phố Hồ Chí Minh	QTKD2025A	K2025	2025-09-01	STUDYING	2026-07-20 04:34:17.91	2026-07-20 04:34:17.91	\N
cmrsqcwcp004af2so1x8mfaad	SV2025003	cmrsqcwcb0048f2so17319ea8	cmrsqcw7w003mf2so217t058j	cmrsqcw7f003ff2souurq2vsj	Sinh viên Mẫu 03	student3@school.local	0912000003	2002-03-15	MALE	Thành phố Hồ Chí Minh	NN2025A	K2025	2025-09-01	STUDYING	2026-07-20 04:34:17.929	2026-07-20 04:34:17.929	\N
cmrsqcwd9004df2so4a3ua6ud	SV2025004	cmrsqcwcw004bf2sok64g8rkz	cmrsqcw7w003kf2soklf35dc0	cmrsqcw7f003ff2souurq2vsj	Sinh viên Mẫu 04	student4@school.local	0912000004	2003-04-15	FEMALE	Thành phố Hồ Chí Minh	CNTT2025A	K2025	2025-09-01	STUDYING	2026-07-20 04:34:17.949	2026-07-20 04:34:17.949	\N
cmrsqcwds004gf2sosu6oxi81	SV2025005	cmrsqcwdf004ef2soy08r06ol	cmrsqcw7w003lf2sov68d73bz	cmrsqcw7f003ff2souurq2vsj	Sinh viên Mẫu 05	student5@school.local	0912000005	2004-05-15	MALE	Thành phố Hồ Chí Minh	QTKD2025A	K2025	2025-09-01	STUDYING	2026-07-20 04:34:17.968	2026-07-20 04:34:17.968	\N
cmrsqcwe8004jf2soclxsy1ls	SV2025006	cmrsqcwdw004hf2so1ydb83hh	cmrsqcw7w003mf2so217t058j	cmrsqcw7f003ff2souurq2vsj	Sinh viên Mẫu 06	student6@school.local	0912000006	2000-06-15	FEMALE	Thành phố Hồ Chí Minh	NN2025A	K2025	2025-09-01	STUDYING	2026-07-20 04:34:17.984	2026-07-20 04:34:17.984	\N
cmrsqcweo004mf2so63kw8g4l	SV2025007	cmrsqcwec004kf2so1mb0vp8e	cmrsqcw7w003kf2soklf35dc0	cmrsqcw7f003ff2souurq2vsj	Sinh viên Mẫu 07	student7@school.local	0912000007	2001-07-15	MALE	Thành phố Hồ Chí Minh	CNTT2025A	K2025	2025-09-01	STUDYING	2026-07-20 04:34:18	2026-07-20 04:34:18	\N
cmrsqcwf3004pf2socg42regd	SV2025008	cmrsqcwes004nf2so1dk2i0re	cmrsqcw7w003lf2sov68d73bz	cmrsqcw7f003ff2souurq2vsj	Sinh viên Mẫu 08	student8@school.local	0912000008	2002-08-15	FEMALE	Thành phố Hồ Chí Minh	QTKD2025A	K2025	2025-09-01	STUDYING	2026-07-20 04:34:18.015	2026-07-20 04:34:18.015	\N
cmrsqcwfk004sf2so0azxg5b1	SV2025009	cmrsqcwf8004qf2sopnmdc5oe	cmrsqcw7w003mf2so217t058j	cmrsqcw7f003ff2souurq2vsj	Sinh viên Mẫu 09	student9@school.local	0912000009	2003-01-15	MALE	Thành phố Hồ Chí Minh	NN2025A	K2025	2025-09-01	STUDYING	2026-07-20 04:34:18.032	2026-07-20 04:34:18.032	\N
cmrsqcwg0004vf2sojyym7evy	SV2025010	cmrsqcwfp004tf2somt790964	cmrsqcw7w003kf2soklf35dc0	cmrsqcw7f003ff2souurq2vsj	Sinh viên Mẫu 10	student10@school.local	0912000010	2004-02-15	FEMALE	Thành phố Hồ Chí Minh	CNTT2025A	K2025	2025-09-01	STUDYING	2026-07-20 04:34:18.049	2026-07-20 04:34:18.049	\N
cmrsqcwgi004yf2soqfr1565a	SV2025011	cmrsqcwg5004wf2sohp3x0qtr	cmrsqcw7w003lf2sov68d73bz	cmrsqcw7f003ff2souurq2vsj	Sinh viên Mẫu 11	student11@school.local	0912000011	2000-03-15	MALE	Thành phố Hồ Chí Minh	QTKD2025A	K2025	2025-09-01	STUDYING	2026-07-20 04:34:18.066	2026-07-20 04:34:18.066	\N
cmrsqcwh00051f2somlg95o05	SV2025012	cmrsqcwgn004zf2soss9ytxud	cmrsqcw7w003mf2so217t058j	cmrsqcw7f003ff2souurq2vsj	Sinh viên Mẫu 12	student12@school.local	0912000012	2001-04-15	FEMALE	Thành phố Hồ Chí Minh	NN2025A	K2025	2025-09-01	STUDYING	2026-07-20 04:34:18.084	2026-07-20 04:34:18.084	\N
cmrsqcwhg0054f2so5oc0mqds	SV2025013	cmrsqcwh40052f2sop7205pid	cmrsqcw7w003kf2soklf35dc0	cmrsqcw7f003ff2souurq2vsj	Sinh viên Mẫu 13	student13@school.local	0912000013	2002-05-15	MALE	Thành phố Hồ Chí Minh	CNTT2025A	K2025	2025-09-01	STUDYING	2026-07-20 04:34:18.1	2026-07-20 04:34:18.1	\N
cmrsqcwhu0057f2soum8xc95j	SV2025014	cmrsqcwhk0055f2soolfnz4wp	cmrsqcw7w003lf2sov68d73bz	cmrsqcw7f003ff2souurq2vsj	Sinh viên Mẫu 14	student14@school.local	0912000014	2003-06-15	FEMALE	Thành phố Hồ Chí Minh	QTKD2025A	K2025	2025-09-01	STUDYING	2026-07-20 04:34:18.114	2026-07-20 04:34:18.114	\N
cmrsqcwid005af2so684vefga	SV2025015	cmrsqcwhy0058f2soaxfocs2v	cmrsqcw7w003mf2so217t058j	cmrsqcw7f003ff2souurq2vsj	Sinh viên Mẫu 15	student15@school.local	0912000015	2004-07-15	MALE	Thành phố Hồ Chí Minh	NN2025A	K2025	2025-09-01	STUDYING	2026-07-20 04:34:18.133	2026-07-20 04:34:18.133	\N
cmrsqcwit005df2so3is4ugjo	SV2025016	cmrsqcwij005bf2soi8usi7r6	cmrsqcw7w003kf2soklf35dc0	cmrsqcw7f003ff2souurq2vsj	Sinh viên Mẫu 16	student16@school.local	0912000016	2000-08-15	FEMALE	Thành phố Hồ Chí Minh	CNTT2025A	K2025	2025-09-01	STUDYING	2026-07-20 04:34:18.15	2026-07-20 04:34:18.15	\N
cmrsqcwjb005gf2so1t3i49s2	SV2025017	cmrsqcwiz005ef2soouzpnaqn	cmrsqcw7w003lf2sov68d73bz	cmrsqcw7f003ff2souurq2vsj	Sinh viên Mẫu 17	student17@school.local	0912000017	2001-01-15	MALE	Thành phố Hồ Chí Minh	QTKD2025A	K2025	2025-09-01	STUDYING	2026-07-20 04:34:18.167	2026-07-20 04:34:18.167	\N
cmrsqcwjr005jf2so956meaht	SV2025018	cmrsqcwjg005hf2so8t6h27md	cmrsqcw7w003mf2so217t058j	cmrsqcw7f003ff2souurq2vsj	Sinh viên Mẫu 18	student18@school.local	0912000018	2002-02-15	FEMALE	Thành phố Hồ Chí Minh	NN2025A	K2025	2025-09-01	STUDYING	2026-07-20 04:34:18.183	2026-07-20 04:34:18.183	\N
cmrsqcwk8005mf2sowzurxw9r	SV2025019	cmrsqcwjw005kf2solh8t1yv6	cmrsqcw7w003kf2soklf35dc0	cmrsqcw7f003ff2souurq2vsj	Sinh viên Mẫu 19	student19@school.local	0912000019	2003-03-15	MALE	Thành phố Hồ Chí Minh	CNTT2025A	K2025	2025-09-01	STUDYING	2026-07-20 04:34:18.2	2026-07-20 04:34:18.2	\N
cmrsqcwkp005pf2sogkc512r5	SV2025020	cmrsqcwkc005nf2sotuv00ets	cmrsqcw7w003lf2sov68d73bz	cmrsqcw7f003ff2souurq2vsj	Sinh viên Mẫu 20	student20@school.local	0912000020	2004-04-15	FEMALE	Thành phố Hồ Chí Minh	QTKD2025A	K2025	2025-09-01	STUDYING	2026-07-20 04:34:18.218	2026-07-20 04:34:18.218	\N
\.


--
-- Data for Name: StudentAnswer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StudentAnswer" (id, "examAttemptId", "examAttemptQuestionId", "selectedOptionIds", "isCorrect", "earnedPoints", "answeredAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: StudentGrade; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StudentGrade" (id, "gradeComponentId", "studentId", score, "gradedByUserId", feedback, "gradedAt", "createdAt", "updatedAt", "publishedAt") FROM stdin;
\.


--
-- Data for Name: StudentScholarship; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StudentScholarship" (id, "studentId", "scholarshipId", "semesterId", status, notes, "approvedByUserId", "approvedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: TuitionItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TuitionItem" (id, "tuitionPolicyId", "courseId", name, type, amount, description, "createdAt", "updatedAt") FROM stdin;
cmrsqcxuc00k5f2so7sooz4l7	cmrsqcxu200k3f2soqyb3izvv	\N	Phí dịch vụ sinh viên	ADDITIONAL_FEE	300000	\N	2026-07-20 04:34:19.86	2026-07-20 04:34:19.86
\.


--
-- Data for Name: TuitionPolicy; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TuitionPolicy" (id, "semesterId", name, description, "creditFee", "effectiveFrom", "effectiveTo", "isActive", "createdAt", "updatedAt") FROM stdin;
cmrsqcxu200k3f2soqyb3izvv	cmrsqcw7m003jf2som6m8021h	Chính sách học phí chuẩn 2025-2026	Tính theo tín chỉ đăng ký trong học kỳ	650000	2026-01-01	\N	t	2026-07-20 04:34:19.85	2026-07-20 04:34:19.85
\.


--
-- Data for Name: TuitionRate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TuitionRate" (id, "academicYearId", "semesterId", "departmentId", "courseId", "feeTypeId", "amountPerCredit", "fixedAmount", "effectiveFrom", "effectiveTo", "isActive", "createdAt", "updatedAt") FROM stdin;
cmrsqcxvm00kaf2sop7bcwcun	cmrsqcw7f003ff2souurq2vsj	\N	\N	\N	cmrsqcxui00k6f2so5ivjbk3o	650000	\N	2025-08-01	\N	t	2026-07-20 04:34:19.906	2026-07-20 04:34:19.906
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, "passwordHash", "fullName", phone, "avatarUrl", status, "failedLoginAttempts", "lockedUntil", "lastLoginAt", "passwordChangedAt", "createdAt", "updatedAt", "deletedAt") FROM stdin;
cmrsqcw6n003cf2sogm8vfim5	training@school.local	$2b$12$q96N.aQSTr2AeUuvPFxoV.MI8qhmTmqk4jZNONCBIBIcXCnmwgcb.	Nhân viên phòng đào tạo	\N	\N	ACTIVE	0	\N	\N	\N	2026-07-20 04:34:17.712	2026-07-20 04:34:17.712	\N
cmrsqcw6n003ef2soj4m3osej	finance@school.local	$2b$12$q96N.aQSTr2AeUuvPFxoV.MI8qhmTmqk4jZNONCBIBIcXCnmwgcb.	Nhân viên phòng tài chính	\N	\N	ACTIVE	0	\N	\N	\N	2026-07-20 04:34:17.712	2026-07-20 04:34:17.712	\N
cmrsqcw84003nf2so8oq7apwm	lecturer@school.local	$2b$12$q96N.aQSTr2AeUuvPFxoV.MI8qhmTmqk4jZNONCBIBIcXCnmwgcb.	Nguyễn Minh Anh	\N	\N	ACTIVE	0	\N	\N	\N	2026-07-20 04:34:17.764	2026-07-20 04:34:17.764	\N
cmrsqcw8o003qf2soviwyfjye	lecturer2@school.local	$2b$12$q96N.aQSTr2AeUuvPFxoV.MI8qhmTmqk4jZNONCBIBIcXCnmwgcb.	Trần Hoàng Long	\N	\N	ACTIVE	0	\N	\N	\N	2026-07-20 04:34:17.784	2026-07-20 04:34:17.784	\N
cmrsqcw95003tf2so449128zr	lecturer3@school.local	$2b$12$q96N.aQSTr2AeUuvPFxoV.MI8qhmTmqk4jZNONCBIBIcXCnmwgcb.	Lê Thu Hà	\N	\N	ACTIVE	0	\N	\N	\N	2026-07-20 04:34:17.802	2026-07-20 04:34:17.802	\N
cmrsqcw9o003wf2so27wjijvs	lecturer4@school.local	$2b$12$q96N.aQSTr2AeUuvPFxoV.MI8qhmTmqk4jZNONCBIBIcXCnmwgcb.	Phạm Quốc Bảo	\N	\N	ACTIVE	0	\N	\N	\N	2026-07-20 04:34:17.82	2026-07-20 04:34:17.82	\N
cmrsqcwa9003zf2so41fjejoj	lecturer5@school.local	$2b$12$q96N.aQSTr2AeUuvPFxoV.MI8qhmTmqk4jZNONCBIBIcXCnmwgcb.	Võ Ngọc Linh	\N	\N	ACTIVE	0	\N	\N	\N	2026-07-20 04:34:17.841	2026-07-20 04:34:17.841	\N
cmrsqcwb50042f2sod3a47h3n	student@school.local	$2b$12$q96N.aQSTr2AeUuvPFxoV.MI8qhmTmqk4jZNONCBIBIcXCnmwgcb.	Sinh viên Mẫu 01	\N	\N	ACTIVE	0	\N	\N	\N	2026-07-20 04:34:17.873	2026-07-20 04:34:17.873	\N
cmrsqcwbu0045f2so0yy0g6gg	student2@school.local	$2b$12$q96N.aQSTr2AeUuvPFxoV.MI8qhmTmqk4jZNONCBIBIcXCnmwgcb.	Sinh viên Mẫu 02	\N	\N	ACTIVE	0	\N	\N	\N	2026-07-20 04:34:17.898	2026-07-20 04:34:17.898	\N
cmrsqcwcb0048f2so17319ea8	student3@school.local	$2b$12$q96N.aQSTr2AeUuvPFxoV.MI8qhmTmqk4jZNONCBIBIcXCnmwgcb.	Sinh viên Mẫu 03	\N	\N	ACTIVE	0	\N	\N	\N	2026-07-20 04:34:17.916	2026-07-20 04:34:17.916	\N
cmrsqcwcw004bf2sok64g8rkz	student4@school.local	$2b$12$q96N.aQSTr2AeUuvPFxoV.MI8qhmTmqk4jZNONCBIBIcXCnmwgcb.	Sinh viên Mẫu 04	\N	\N	ACTIVE	0	\N	\N	\N	2026-07-20 04:34:17.937	2026-07-20 04:34:17.937	\N
cmrsqcwdf004ef2soy08r06ol	student5@school.local	$2b$12$q96N.aQSTr2AeUuvPFxoV.MI8qhmTmqk4jZNONCBIBIcXCnmwgcb.	Sinh viên Mẫu 05	\N	\N	ACTIVE	0	\N	\N	\N	2026-07-20 04:34:17.955	2026-07-20 04:34:17.955	\N
cmrsqcwdw004hf2so1ydb83hh	student6@school.local	$2b$12$q96N.aQSTr2AeUuvPFxoV.MI8qhmTmqk4jZNONCBIBIcXCnmwgcb.	Sinh viên Mẫu 06	\N	\N	ACTIVE	0	\N	\N	\N	2026-07-20 04:34:17.973	2026-07-20 04:34:17.973	\N
cmrsqcwec004kf2so1mb0vp8e	student7@school.local	$2b$12$q96N.aQSTr2AeUuvPFxoV.MI8qhmTmqk4jZNONCBIBIcXCnmwgcb.	Sinh viên Mẫu 07	\N	\N	ACTIVE	0	\N	\N	\N	2026-07-20 04:34:17.989	2026-07-20 04:34:17.989	\N
cmrsqcwes004nf2so1dk2i0re	student8@school.local	$2b$12$q96N.aQSTr2AeUuvPFxoV.MI8qhmTmqk4jZNONCBIBIcXCnmwgcb.	Sinh viên Mẫu 08	\N	\N	ACTIVE	0	\N	\N	\N	2026-07-20 04:34:18.004	2026-07-20 04:34:18.004	\N
cmrsqcwf8004qf2sopnmdc5oe	student9@school.local	$2b$12$q96N.aQSTr2AeUuvPFxoV.MI8qhmTmqk4jZNONCBIBIcXCnmwgcb.	Sinh viên Mẫu 09	\N	\N	ACTIVE	0	\N	\N	\N	2026-07-20 04:34:18.02	2026-07-20 04:34:18.02	\N
cmrsqcwfp004tf2somt790964	student10@school.local	$2b$12$q96N.aQSTr2AeUuvPFxoV.MI8qhmTmqk4jZNONCBIBIcXCnmwgcb.	Sinh viên Mẫu 10	\N	\N	ACTIVE	0	\N	\N	\N	2026-07-20 04:34:18.037	2026-07-20 04:34:18.037	\N
cmrsqcwg5004wf2sohp3x0qtr	student11@school.local	$2b$12$q96N.aQSTr2AeUuvPFxoV.MI8qhmTmqk4jZNONCBIBIcXCnmwgcb.	Sinh viên Mẫu 11	\N	\N	ACTIVE	0	\N	\N	\N	2026-07-20 04:34:18.053	2026-07-20 04:34:18.053	\N
cmrsqcwgn004zf2soss9ytxud	student12@school.local	$2b$12$q96N.aQSTr2AeUuvPFxoV.MI8qhmTmqk4jZNONCBIBIcXCnmwgcb.	Sinh viên Mẫu 12	\N	\N	ACTIVE	0	\N	\N	\N	2026-07-20 04:34:18.072	2026-07-20 04:34:18.072	\N
cmrsqcwh40052f2sop7205pid	student13@school.local	$2b$12$q96N.aQSTr2AeUuvPFxoV.MI8qhmTmqk4jZNONCBIBIcXCnmwgcb.	Sinh viên Mẫu 13	\N	\N	ACTIVE	0	\N	\N	\N	2026-07-20 04:34:18.088	2026-07-20 04:34:18.088	\N
cmrsqcwhk0055f2soolfnz4wp	student14@school.local	$2b$12$q96N.aQSTr2AeUuvPFxoV.MI8qhmTmqk4jZNONCBIBIcXCnmwgcb.	Sinh viên Mẫu 14	\N	\N	ACTIVE	0	\N	\N	\N	2026-07-20 04:34:18.104	2026-07-20 04:34:18.104	\N
cmrsqcwhy0058f2soaxfocs2v	student15@school.local	$2b$12$q96N.aQSTr2AeUuvPFxoV.MI8qhmTmqk4jZNONCBIBIcXCnmwgcb.	Sinh viên Mẫu 15	\N	\N	ACTIVE	0	\N	\N	\N	2026-07-20 04:34:18.118	2026-07-20 04:34:18.118	\N
cmrsqcwij005bf2soi8usi7r6	student16@school.local	$2b$12$q96N.aQSTr2AeUuvPFxoV.MI8qhmTmqk4jZNONCBIBIcXCnmwgcb.	Sinh viên Mẫu 16	\N	\N	ACTIVE	0	\N	\N	\N	2026-07-20 04:34:18.139	2026-07-20 04:34:18.139	\N
cmrsqcwiz005ef2soouzpnaqn	student17@school.local	$2b$12$q96N.aQSTr2AeUuvPFxoV.MI8qhmTmqk4jZNONCBIBIcXCnmwgcb.	Sinh viên Mẫu 17	\N	\N	ACTIVE	0	\N	\N	\N	2026-07-20 04:34:18.155	2026-07-20 04:34:18.155	\N
cmrsqcwjg005hf2so8t6h27md	student18@school.local	$2b$12$q96N.aQSTr2AeUuvPFxoV.MI8qhmTmqk4jZNONCBIBIcXCnmwgcb.	Sinh viên Mẫu 18	\N	\N	ACTIVE	0	\N	\N	\N	2026-07-20 04:34:18.172	2026-07-20 04:34:18.172	\N
cmrsqcwjw005kf2solh8t1yv6	student19@school.local	$2b$12$q96N.aQSTr2AeUuvPFxoV.MI8qhmTmqk4jZNONCBIBIcXCnmwgcb.	Sinh viên Mẫu 19	\N	\N	ACTIVE	0	\N	\N	\N	2026-07-20 04:34:18.188	2026-07-20 04:34:18.188	\N
cmrsqcwkc005nf2sotuv00ets	student20@school.local	$2b$12$q96N.aQSTr2AeUuvPFxoV.MI8qhmTmqk4jZNONCBIBIcXCnmwgcb.	Sinh viên Mẫu 20	\N	\N	ACTIVE	0	\N	\N	\N	2026-07-20 04:34:18.205	2026-07-20 04:34:18.205	\N
cmrsqcw6n003df2so4sxlazfa	admin@school.local	$2b$12$q96N.aQSTr2AeUuvPFxoV.MI8qhmTmqk4jZNONCBIBIcXCnmwgcb.	Quản trị hệ thống	\N	\N	ACTIVE	0	\N	2026-07-20 04:43:49.562	\N	2026-07-20 04:34:17.712	2026-07-20 04:43:49.564	\N
\.


--
-- Data for Name: UserRole; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserRole" ("userId", "roleId", "createdAt", "updatedAt") FROM stdin;
cmrsqcw6n003cf2sogm8vfim5	cmrsqculy0003f2solzyk3677	2026-07-20 04:34:17.718	2026-07-20 04:34:17.718
cmrsqcw6n003df2so4sxlazfa	cmrsqculs0001f2so2ei0bskn	2026-07-20 04:34:17.717	2026-07-20 04:34:17.717
cmrsqcw6n003ef2soj4m3osej	cmrsqculy0002f2soi04lllt2	2026-07-20 04:34:17.718	2026-07-20 04:34:17.718
cmrsqcw84003nf2so8oq7apwm	cmrsqculy0004f2sosncsgjsq	2026-07-20 04:34:17.769	2026-07-20 04:34:17.769
cmrsqcw8o003qf2soviwyfjye	cmrsqculy0004f2sosncsgjsq	2026-07-20 04:34:17.789	2026-07-20 04:34:17.789
cmrsqcw95003tf2so449128zr	cmrsqculy0004f2sosncsgjsq	2026-07-20 04:34:17.806	2026-07-20 04:34:17.806
cmrsqcw9o003wf2so27wjijvs	cmrsqculy0004f2sosncsgjsq	2026-07-20 04:34:17.824	2026-07-20 04:34:17.824
cmrsqcwa9003zf2so41fjejoj	cmrsqculy0004f2sosncsgjsq	2026-07-20 04:34:17.846	2026-07-20 04:34:17.846
cmrsqcwb50042f2sod3a47h3n	cmrsqculc0000f2so9jtilz0y	2026-07-20 04:34:17.879	2026-07-20 04:34:17.879
cmrsqcwbu0045f2so0yy0g6gg	cmrsqculc0000f2so9jtilz0y	2026-07-20 04:34:17.903	2026-07-20 04:34:17.903
cmrsqcwcb0048f2so17319ea8	cmrsqculc0000f2so9jtilz0y	2026-07-20 04:34:17.92	2026-07-20 04:34:17.92
cmrsqcwcw004bf2sok64g8rkz	cmrsqculc0000f2so9jtilz0y	2026-07-20 04:34:17.941	2026-07-20 04:34:17.941
cmrsqcwdf004ef2soy08r06ol	cmrsqculc0000f2so9jtilz0y	2026-07-20 04:34:17.96	2026-07-20 04:34:17.96
cmrsqcwdw004hf2so1ydb83hh	cmrsqculc0000f2so9jtilz0y	2026-07-20 04:34:17.977	2026-07-20 04:34:17.977
cmrsqcwec004kf2so1mb0vp8e	cmrsqculc0000f2so9jtilz0y	2026-07-20 04:34:17.993	2026-07-20 04:34:17.993
cmrsqcwes004nf2so1dk2i0re	cmrsqculc0000f2so9jtilz0y	2026-07-20 04:34:18.008	2026-07-20 04:34:18.008
cmrsqcwf8004qf2sopnmdc5oe	cmrsqculc0000f2so9jtilz0y	2026-07-20 04:34:18.024	2026-07-20 04:34:18.024
cmrsqcwfp004tf2somt790964	cmrsqculc0000f2so9jtilz0y	2026-07-20 04:34:18.041	2026-07-20 04:34:18.041
cmrsqcwg5004wf2sohp3x0qtr	cmrsqculc0000f2so9jtilz0y	2026-07-20 04:34:18.058	2026-07-20 04:34:18.058
cmrsqcwgn004zf2soss9ytxud	cmrsqculc0000f2so9jtilz0y	2026-07-20 04:34:18.075	2026-07-20 04:34:18.075
cmrsqcwh40052f2sop7205pid	cmrsqculc0000f2so9jtilz0y	2026-07-20 04:34:18.092	2026-07-20 04:34:18.092
cmrsqcwhk0055f2soolfnz4wp	cmrsqculc0000f2so9jtilz0y	2026-07-20 04:34:18.107	2026-07-20 04:34:18.107
cmrsqcwhy0058f2soaxfocs2v	cmrsqculc0000f2so9jtilz0y	2026-07-20 04:34:18.125	2026-07-20 04:34:18.125
cmrsqcwij005bf2soi8usi7r6	cmrsqculc0000f2so9jtilz0y	2026-07-20 04:34:18.143	2026-07-20 04:34:18.143
cmrsqcwiz005ef2soouzpnaqn	cmrsqculc0000f2so9jtilz0y	2026-07-20 04:34:18.159	2026-07-20 04:34:18.159
cmrsqcwjg005hf2so8t6h27md	cmrsqculc0000f2so9jtilz0y	2026-07-20 04:34:18.176	2026-07-20 04:34:18.176
cmrsqcwjw005kf2solh8t1yv6	cmrsqculc0000f2so9jtilz0y	2026-07-20 04:34:18.192	2026-07-20 04:34:18.192
cmrsqcwkc005nf2sotuv00ets	cmrsqculc0000f2so9jtilz0y	2026-07-20 04:34:18.209	2026-07-20 04:34:18.209
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
12d95cae-5d5b-4687-a0cb-b594291e143e	d3475fa78dedf92c662584ee8368b8c105277bb0cec36ba3159c3ba7b3db1286	2026-07-20 11:33:38.02196+07	20260718000000_init	\N	\N	2026-07-20 11:33:37.341833+07	1
818bb7d9-1d92-4780-9bad-6ee39f9646db	45720f7d6618a729b49068ca0c1049466221483245b2c8864238fa16bf80193d	2026-07-20 11:33:38.032225+07	20260718194000_repair_schedule_index_prerequisite	\N	\N	2026-07-20 11:33:38.02339+07	1
225e6b8e-c8b5-4632-90a0-f3ef722da41a	539db7d2d0d0efa7b019ef65d8bd236dda4eeacf1f0148e90c4884587b3dddc7	2026-07-20 11:33:38.039652+07	20260718195254_dummy_drift	\N	\N	2026-07-20 11:33:38.033482+07	1
5f2a7738-c04c-47de-a58b-11ee6283a8af	5e8416efd80fe116b1d98c62949716a4f58477dafb703d72836b3f353da027fe	2026-07-20 11:33:38.057763+07	20260719010000_phase3a_academic_management	\N	\N	2026-07-20 11:33:38.041184+07	1
b1bb7d7b-de86-4630-b8dd-866b3ac0160a	1bf3f79421a487eaac880c20531360eba97526c65403f5b803764e12070df132	2026-07-20 11:33:38.068033+07	20260719020000_phase3b_class_section_constraints	\N	\N	2026-07-20 11:33:38.059158+07	1
39a96441-7133-4d7a-ba92-de6824810fc7	09a902beb62c10ede1469d2a75d52af2a51b994e26cada37ddeecadb4e817722	2026-07-20 11:33:38.086245+07	20260719111000_phase3d_attendance_grades	\N	\N	2026-07-20 11:33:38.069526+07	1
8c8c9ec2-0863-409e-a8a3-86a9f684faeb	0221f9d869d1bc298673e5f8e1210ce46577facbc96a6584edc005d82ec1a683	2026-07-20 11:33:38.096102+07	20260719125500_phase4_online_examination	\N	\N	2026-07-20 11:33:38.087786+07	1
3db608af-bdcf-4eee-896f-3879b3f4d439	982efa8b5c6af5ab881be25e007076f162485bd58f51076b8fa3f38238658074	2026-07-20 11:33:38.151905+07	20260719161917_phase6_analytics_academic_risk	\N	\N	2026-07-20 11:33:38.097786+07	1
75c283d8-1f22-4d26-addd-a6b47b4b50e4	727836a531baea3f7cf20ad0fb454a52677590a5bf5ee5a277c83c4c4190cf82	2026-07-20 11:33:38.290188+07	20260719211325_phase5_tuition_billing_payments	\N	\N	2026-07-20 11:33:38.153244+07	1
0494fb6a-70dc-47cb-abf6-741f01366ca8	6872236d342cc6a192bd4b21c1862312167160343bb11d9c07ca22fd8ad9eec9	2026-07-20 11:33:38.4783+07	20260720003648_phase7_announcements_student_services	\N	\N	2026-07-20 11:33:38.292391+07	1
\.


--
-- Name: AcademicRiskAlert AcademicRiskAlert_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AcademicRiskAlert"
    ADD CONSTRAINT "AcademicRiskAlert_pkey" PRIMARY KEY (id);


--
-- Name: AcademicRiskRule AcademicRiskRule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AcademicRiskRule"
    ADD CONSTRAINT "AcademicRiskRule_pkey" PRIMARY KEY (id);


--
-- Name: AcademicYear AcademicYear_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AcademicYear"
    ADD CONSTRAINT "AcademicYear_pkey" PRIMARY KEY (id);


--
-- Name: AnnouncementAudience AnnouncementAudience_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AnnouncementAudience"
    ADD CONSTRAINT "AnnouncementAudience_pkey" PRIMARY KEY (id);


--
-- Name: Announcement Announcement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Announcement"
    ADD CONSTRAINT "Announcement_pkey" PRIMARY KEY (id);


--
-- Name: AttendanceRecord AttendanceRecord_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AttendanceRecord"
    ADD CONSTRAINT "AttendanceRecord_pkey" PRIMARY KEY (id);


--
-- Name: AttendanceSession AttendanceSession_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AttendanceSession"
    ADD CONSTRAINT "AttendanceSession_pkey" PRIMARY KEY (id);


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id);


--
-- Name: ClassSection ClassSection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ClassSection"
    ADD CONSTRAINT "ClassSection_pkey" PRIMARY KEY (id);


--
-- Name: Course Course_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_pkey" PRIMARY KEY (id);


--
-- Name: Department Department_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Department"
    ADD CONSTRAINT "Department_pkey" PRIMARY KEY (id);


--
-- Name: Enrollment Enrollment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_pkey" PRIMARY KEY (id);


--
-- Name: ExamAssignment ExamAssignment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExamAssignment"
    ADD CONSTRAINT "ExamAssignment_pkey" PRIMARY KEY (id);


--
-- Name: ExamAttemptQuestion ExamAttemptQuestion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExamAttemptQuestion"
    ADD CONSTRAINT "ExamAttemptQuestion_pkey" PRIMARY KEY (id);


--
-- Name: ExamAttempt ExamAttempt_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExamAttempt"
    ADD CONSTRAINT "ExamAttempt_pkey" PRIMARY KEY (id);


--
-- Name: ExamQuestion ExamQuestion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExamQuestion"
    ADD CONSTRAINT "ExamQuestion_pkey" PRIMARY KEY ("examId", "questionId");


--
-- Name: Exam Exam_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Exam"
    ADD CONSTRAINT "Exam_pkey" PRIMARY KEY (id);


--
-- Name: FeeType FeeType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FeeType"
    ADD CONSTRAINT "FeeType_pkey" PRIMARY KEY (id);


--
-- Name: FinancialAdjustment FinancialAdjustment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FinancialAdjustment"
    ADD CONSTRAINT "FinancialAdjustment_pkey" PRIMARY KEY (id);


--
-- Name: GradeComponent GradeComponent_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GradeComponent"
    ADD CONSTRAINT "GradeComponent_pkey" PRIMARY KEY (id);


--
-- Name: InvoiceItem InvoiceItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InvoiceItem"
    ADD CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY (id);


--
-- Name: Invoice Invoice_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_pkey" PRIMARY KEY (id);


--
-- Name: Lecturer Lecturer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Lecturer"
    ADD CONSTRAINT "Lecturer_pkey" PRIMARY KEY (id);


--
-- Name: LoginHistory LoginHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LoginHistory"
    ADD CONSTRAINT "LoginHistory_pkey" PRIMARY KEY (id);


--
-- Name: NotificationPreference NotificationPreference_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NotificationPreference"
    ADD CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: PaymentAllocation PaymentAllocation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentAllocation"
    ADD CONSTRAINT "PaymentAllocation_pkey" PRIMARY KEY (id);


--
-- Name: PaymentTransaction PaymentTransaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentTransaction"
    ADD CONSTRAINT "PaymentTransaction_pkey" PRIMARY KEY (id);


--
-- Name: PaymentWebhook PaymentWebhook_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentWebhook"
    ADD CONSTRAINT "PaymentWebhook_pkey" PRIMARY KEY (id);


--
-- Name: Permission Permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_pkey" PRIMARY KEY (id);


--
-- Name: Prerequisite Prerequisite_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Prerequisite"
    ADD CONSTRAINT "Prerequisite_pkey" PRIMARY KEY ("courseId", "prerequisiteCourseId");


--
-- Name: QuestionOption QuestionOption_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuestionOption"
    ADD CONSTRAINT "QuestionOption_pkey" PRIMARY KEY (id);


--
-- Name: Question Question_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_pkey" PRIMARY KEY (id);


--
-- Name: Receipt Receipt_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Receipt"
    ADD CONSTRAINT "Receipt_pkey" PRIMARY KEY (id);


--
-- Name: RefreshToken RefreshToken_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RefreshToken"
    ADD CONSTRAINT "RefreshToken_pkey" PRIMARY KEY (id);


--
-- Name: RolePermission RolePermission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId", "permissionId");


--
-- Name: Role Role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (id);


--
-- Name: Schedule Schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Schedule"
    ADD CONSTRAINT "Schedule_pkey" PRIMARY KEY (id);


--
-- Name: Scholarship Scholarship_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Scholarship"
    ADD CONSTRAINT "Scholarship_pkey" PRIMARY KEY (id);


--
-- Name: Semester Semester_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Semester"
    ADD CONSTRAINT "Semester_pkey" PRIMARY KEY (id);


--
-- Name: ServiceRequestAttachment ServiceRequestAttachment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceRequestAttachment"
    ADD CONSTRAINT "ServiceRequestAttachment_pkey" PRIMARY KEY (id);


--
-- Name: ServiceRequestCategory ServiceRequestCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceRequestCategory"
    ADD CONSTRAINT "ServiceRequestCategory_pkey" PRIMARY KEY (id);


--
-- Name: ServiceRequestComment ServiceRequestComment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceRequestComment"
    ADD CONSTRAINT "ServiceRequestComment_pkey" PRIMARY KEY (id);


--
-- Name: ServiceRequest ServiceRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceRequest"
    ADD CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY (id);


--
-- Name: StudentAnswer StudentAnswer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudentAnswer"
    ADD CONSTRAINT "StudentAnswer_pkey" PRIMARY KEY (id);


--
-- Name: StudentGrade StudentGrade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudentGrade"
    ADD CONSTRAINT "StudentGrade_pkey" PRIMARY KEY (id);


--
-- Name: StudentScholarship StudentScholarship_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudentScholarship"
    ADD CONSTRAINT "StudentScholarship_pkey" PRIMARY KEY (id);


--
-- Name: Student Student_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_pkey" PRIMARY KEY (id);


--
-- Name: TuitionItem TuitionItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TuitionItem"
    ADD CONSTRAINT "TuitionItem_pkey" PRIMARY KEY (id);


--
-- Name: TuitionPolicy TuitionPolicy_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TuitionPolicy"
    ADD CONSTRAINT "TuitionPolicy_pkey" PRIMARY KEY (id);


--
-- Name: TuitionRate TuitionRate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TuitionRate"
    ADD CONSTRAINT "TuitionRate_pkey" PRIMARY KEY (id);


--
-- Name: UserRole UserRole_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserRole"
    ADD CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userId", "roleId");


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: AcademicRiskAlert_detectedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AcademicRiskAlert_detectedAt_idx" ON public."AcademicRiskAlert" USING btree ("detectedAt");


--
-- Name: AcademicRiskAlert_evaluationPeriod_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AcademicRiskAlert_evaluationPeriod_idx" ON public."AcademicRiskAlert" USING btree ("evaluationPeriod");


--
-- Name: AcademicRiskAlert_semesterId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AcademicRiskAlert_semesterId_idx" ON public."AcademicRiskAlert" USING btree ("semesterId");


--
-- Name: AcademicRiskAlert_severity_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AcademicRiskAlert_severity_idx" ON public."AcademicRiskAlert" USING btree (severity);


--
-- Name: AcademicRiskAlert_studentId_semesterId_ruleCode_evaluationP_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AcademicRiskAlert_studentId_semesterId_ruleCode_evaluationP_key" ON public."AcademicRiskAlert" USING btree ("studentId", "semesterId", "ruleCode", "evaluationPeriod");


--
-- Name: AcademicRiskAlert_studentId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AcademicRiskAlert_studentId_status_idx" ON public."AcademicRiskAlert" USING btree ("studentId", status);


--
-- Name: AcademicRiskAlert_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AcademicRiskAlert_type_idx" ON public."AcademicRiskAlert" USING btree (type);


--
-- Name: AcademicRiskRule_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AcademicRiskRule_code_key" ON public."AcademicRiskRule" USING btree (code);


--
-- Name: AcademicRiskRule_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AcademicRiskRule_isActive_idx" ON public."AcademicRiskRule" USING btree ("isActive");


--
-- Name: AcademicRiskRule_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AcademicRiskRule_type_idx" ON public."AcademicRiskRule" USING btree (type);


--
-- Name: AcademicYear_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AcademicYear_code_key" ON public."AcademicYear" USING btree (code);


--
-- Name: AcademicYear_isCurrent_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AcademicYear_isCurrent_idx" ON public."AcademicYear" USING btree ("isCurrent");


--
-- Name: AcademicYear_single_current_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AcademicYear_single_current_idx" ON public."AcademicYear" USING btree ("isCurrent") WHERE ("isCurrent" = true);


--
-- Name: AcademicYear_startDate_endDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AcademicYear_startDate_endDate_idx" ON public."AcademicYear" USING btree ("startDate", "endDate");


--
-- Name: AnnouncementAudience_announcementId_audienceType_roleId_dep_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AnnouncementAudience_announcementId_audienceType_roleId_dep_key" ON public."AnnouncementAudience" USING btree ("announcementId", "audienceType", "roleId", "departmentId", "classSectionId", "studentId", "lecturerId");


--
-- Name: AnnouncementAudience_announcementId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AnnouncementAudience_announcementId_idx" ON public."AnnouncementAudience" USING btree ("announcementId");


--
-- Name: AnnouncementAudience_audienceType_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AnnouncementAudience_audienceType_idx" ON public."AnnouncementAudience" USING btree ("audienceType");


--
-- Name: AnnouncementAudience_classSectionId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AnnouncementAudience_classSectionId_idx" ON public."AnnouncementAudience" USING btree ("classSectionId");


--
-- Name: AnnouncementAudience_departmentId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AnnouncementAudience_departmentId_idx" ON public."AnnouncementAudience" USING btree ("departmentId");


--
-- Name: AnnouncementAudience_lecturerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AnnouncementAudience_lecturerId_idx" ON public."AnnouncementAudience" USING btree ("lecturerId");


--
-- Name: AnnouncementAudience_roleId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AnnouncementAudience_roleId_idx" ON public."AnnouncementAudience" USING btree ("roleId");


--
-- Name: AnnouncementAudience_studentId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AnnouncementAudience_studentId_idx" ON public."AnnouncementAudience" USING btree ("studentId");


--
-- Name: AnnouncementReadReceipt_announcementId_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AnnouncementReadReceipt_announcementId_userId_key" ON public."AnnouncementReadReceipt" USING btree ("announcementId", "userId");


--
-- Name: Announcement_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Announcement_category_idx" ON public."Announcement" USING btree (category);


--
-- Name: Announcement_expiresAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Announcement_expiresAt_idx" ON public."Announcement" USING btree ("expiresAt");


--
-- Name: Announcement_priority_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Announcement_priority_idx" ON public."Announcement" USING btree (priority);


--
-- Name: Announcement_publishAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Announcement_publishAt_idx" ON public."Announcement" USING btree ("publishAt");


--
-- Name: Announcement_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Announcement_status_idx" ON public."Announcement" USING btree (status);


--
-- Name: AttendanceRecord_attendanceSessionId_studentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AttendanceRecord_attendanceSessionId_studentId_key" ON public."AttendanceRecord" USING btree ("attendanceSessionId", "studentId");


--
-- Name: AttendanceRecord_studentId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AttendanceRecord_studentId_status_idx" ON public."AttendanceRecord" USING btree ("studentId", status);


--
-- Name: AttendanceSession_classSectionId_sessionDate_startTime_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AttendanceSession_classSectionId_sessionDate_startTime_key" ON public."AttendanceSession" USING btree ("classSectionId", "sessionDate", "startTime");


--
-- Name: AttendanceSession_createdById_sessionDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AttendanceSession_createdById_sessionDate_idx" ON public."AttendanceSession" USING btree ("createdById", "sessionDate");


--
-- Name: AuditLog_action_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AuditLog_action_createdAt_idx" ON public."AuditLog" USING btree (action, "createdAt");


--
-- Name: AuditLog_actorUserId_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AuditLog_actorUserId_createdAt_idx" ON public."AuditLog" USING btree ("actorUserId", "createdAt");


--
-- Name: AuditLog_entityType_entityId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AuditLog_entityType_entityId_idx" ON public."AuditLog" USING btree ("entityType", "entityId");


--
-- Name: ClassSection_courseId_semesterId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ClassSection_courseId_semesterId_idx" ON public."ClassSection" USING btree ("courseId", "semesterId");


--
-- Name: ClassSection_courseId_semesterId_sectionCode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ClassSection_courseId_semesterId_sectionCode_key" ON public."ClassSection" USING btree ("courseId", "semesterId", "sectionCode");


--
-- Name: ClassSection_deletedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ClassSection_deletedAt_idx" ON public."ClassSection" USING btree ("deletedAt");


--
-- Name: ClassSection_lecturerId_semesterId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ClassSection_lecturerId_semesterId_idx" ON public."ClassSection" USING btree ("lecturerId", "semesterId");


--
-- Name: ClassSection_sectionCode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ClassSection_sectionCode_key" ON public."ClassSection" USING btree ("sectionCode");


--
-- Name: ClassSection_semesterId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ClassSection_semesterId_status_idx" ON public."ClassSection" USING btree ("semesterId", status);


--
-- Name: Course_courseCode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Course_courseCode_key" ON public."Course" USING btree ("courseCode");


--
-- Name: Course_deletedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Course_deletedAt_idx" ON public."Course" USING btree ("deletedAt");


--
-- Name: Course_departmentId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Course_departmentId_status_idx" ON public."Course" USING btree ("departmentId", status);


--
-- Name: Course_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Course_name_idx" ON public."Course" USING btree (name);


--
-- Name: Department_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Department_code_key" ON public."Department" USING btree (code);


--
-- Name: Department_deletedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Department_deletedAt_idx" ON public."Department" USING btree ("deletedAt");


--
-- Name: Department_headLecturerId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Department_headLecturerId_key" ON public."Department" USING btree ("headLecturerId");


--
-- Name: Department_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Department_name_idx" ON public."Department" USING btree (name);


--
-- Name: Department_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Department_name_key" ON public."Department" USING btree (name);


--
-- Name: Department_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Department_status_idx" ON public."Department" USING btree (status);


--
-- Name: Enrollment_classSectionId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Enrollment_classSectionId_status_idx" ON public."Enrollment" USING btree ("classSectionId", status);


--
-- Name: Enrollment_studentId_classSectionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Enrollment_studentId_classSectionId_key" ON public."Enrollment" USING btree ("studentId", "classSectionId");


--
-- Name: Enrollment_studentId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Enrollment_studentId_status_idx" ON public."Enrollment" USING btree ("studentId", status);


--
-- Name: ExamAssignment_examId_studentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ExamAssignment_examId_studentId_key" ON public."ExamAssignment" USING btree ("examId", "studentId");


--
-- Name: ExamAssignment_studentId_assignedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ExamAssignment_studentId_assignedAt_idx" ON public."ExamAssignment" USING btree ("studentId", "assignedAt");


--
-- Name: ExamAttemptQuestion_examAttemptId_displayOrder_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ExamAttemptQuestion_examAttemptId_displayOrder_key" ON public."ExamAttemptQuestion" USING btree ("examAttemptId", "displayOrder");


--
-- Name: ExamAttemptQuestion_questionId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ExamAttemptQuestion_questionId_idx" ON public."ExamAttemptQuestion" USING btree ("questionId");


--
-- Name: ExamAttempt_examId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ExamAttempt_examId_status_idx" ON public."ExamAttempt" USING btree ("examId", status);


--
-- Name: ExamAttempt_examId_studentId_attemptNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ExamAttempt_examId_studentId_attemptNumber_key" ON public."ExamAttempt" USING btree ("examId", "studentId", "attemptNumber");


--
-- Name: ExamAttempt_expiresAt_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ExamAttempt_expiresAt_status_idx" ON public."ExamAttempt" USING btree ("expiresAt", status);


--
-- Name: ExamAttempt_studentId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ExamAttempt_studentId_status_idx" ON public."ExamAttempt" USING btree ("studentId", status);


--
-- Name: ExamQuestion_examId_displayOrder_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ExamQuestion_examId_displayOrder_key" ON public."ExamQuestion" USING btree ("examId", "displayOrder");


--
-- Name: ExamQuestion_questionId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ExamQuestion_questionId_idx" ON public."ExamQuestion" USING btree ("questionId");


--
-- Name: Exam_classSectionId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Exam_classSectionId_status_idx" ON public."Exam" USING btree ("classSectionId", status);


--
-- Name: Exam_courseId_startsAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Exam_courseId_startsAt_idx" ON public."Exam" USING btree ("courseId", "startsAt");


--
-- Name: Exam_deletedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Exam_deletedAt_idx" ON public."Exam" USING btree ("deletedAt");


--
-- Name: Exam_examCode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Exam_examCode_key" ON public."Exam" USING btree ("examCode");


--
-- Name: Exam_startsAt_endsAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Exam_startsAt_endsAt_idx" ON public."Exam" USING btree ("startsAt", "endsAt");


--
-- Name: FeeType_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "FeeType_code_key" ON public."FeeType" USING btree (code);


--
-- Name: FeeType_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "FeeType_isActive_idx" ON public."FeeType" USING btree ("isActive");


--
-- Name: FinancialAdjustment_invoiceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "FinancialAdjustment_invoiceId_idx" ON public."FinancialAdjustment" USING btree ("invoiceId");


--
-- Name: FinancialAdjustment_studentId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "FinancialAdjustment_studentId_idx" ON public."FinancialAdjustment" USING btree ("studentId");


--
-- Name: GradeComponent_classSectionId_displayOrder_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "GradeComponent_classSectionId_displayOrder_idx" ON public."GradeComponent" USING btree ("classSectionId", "displayOrder");


--
-- Name: GradeComponent_classSectionId_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "GradeComponent_classSectionId_name_key" ON public."GradeComponent" USING btree ("classSectionId", name);


--
-- Name: InvoiceItem_invoiceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "InvoiceItem_invoiceId_idx" ON public."InvoiceItem" USING btree ("invoiceId");


--
-- Name: InvoiceItem_tuitionItemId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "InvoiceItem_tuitionItemId_idx" ON public."InvoiceItem" USING btree ("tuitionItemId");


--
-- Name: Invoice_dueDate_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Invoice_dueDate_status_idx" ON public."Invoice" USING btree ("dueDate", status);


--
-- Name: Invoice_invoiceCode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Invoice_invoiceCode_key" ON public."Invoice" USING btree ("invoiceCode");


--
-- Name: Invoice_semesterId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Invoice_semesterId_status_idx" ON public."Invoice" USING btree ("semesterId", status);


--
-- Name: Invoice_studentId_semesterId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Invoice_studentId_semesterId_key" ON public."Invoice" USING btree ("studentId", "semesterId");


--
-- Name: Invoice_studentId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Invoice_studentId_status_idx" ON public."Invoice" USING btree ("studentId", status);


--
-- Name: Lecturer_deletedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Lecturer_deletedAt_idx" ON public."Lecturer" USING btree ("deletedAt");


--
-- Name: Lecturer_departmentId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Lecturer_departmentId_status_idx" ON public."Lecturer" USING btree ("departmentId", status);


--
-- Name: Lecturer_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Lecturer_email_key" ON public."Lecturer" USING btree (email);


--
-- Name: Lecturer_fullName_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Lecturer_fullName_idx" ON public."Lecturer" USING btree ("fullName");


--
-- Name: Lecturer_lecturerCode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Lecturer_lecturerCode_key" ON public."Lecturer" USING btree ("lecturerCode");


--
-- Name: Lecturer_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Lecturer_userId_key" ON public."Lecturer" USING btree ("userId");


--
-- Name: LoginHistory_emailAttempt_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "LoginHistory_emailAttempt_createdAt_idx" ON public."LoginHistory" USING btree ("emailAttempt", "createdAt");


--
-- Name: LoginHistory_ipAddress_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "LoginHistory_ipAddress_createdAt_idx" ON public."LoginHistory" USING btree ("ipAddress", "createdAt");


--
-- Name: LoginHistory_userId_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "LoginHistory_userId_createdAt_idx" ON public."LoginHistory" USING btree ("userId", "createdAt");


--
-- Name: NotificationPreference_userId_category_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "NotificationPreference_userId_category_key" ON public."NotificationPreference" USING btree ("userId", category);


--
-- Name: Notification_type_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Notification_type_createdAt_idx" ON public."Notification" USING btree (type, "createdAt");


--
-- Name: Notification_userId_readAt_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Notification_userId_readAt_createdAt_idx" ON public."Notification" USING btree ("userId", "readAt", "createdAt");


--
-- Name: PaymentAllocation_invoiceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PaymentAllocation_invoiceId_idx" ON public."PaymentAllocation" USING btree ("invoiceId");


--
-- Name: PaymentAllocation_paymentTransactionId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PaymentAllocation_paymentTransactionId_idx" ON public."PaymentAllocation" USING btree ("paymentTransactionId");


--
-- Name: PaymentAllocation_paymentTransactionId_invoiceId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PaymentAllocation_paymentTransactionId_invoiceId_key" ON public."PaymentAllocation" USING btree ("paymentTransactionId", "invoiceId");


--
-- Name: PaymentTransaction_externalTransactionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PaymentTransaction_externalTransactionId_key" ON public."PaymentTransaction" USING btree ("externalTransactionId");


--
-- Name: PaymentTransaction_idempotencyKey_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PaymentTransaction_idempotencyKey_key" ON public."PaymentTransaction" USING btree ("idempotencyKey");


--
-- Name: PaymentTransaction_invoiceId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PaymentTransaction_invoiceId_status_idx" ON public."PaymentTransaction" USING btree ("invoiceId", status);


--
-- Name: PaymentTransaction_provider_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PaymentTransaction_provider_status_idx" ON public."PaymentTransaction" USING btree (provider, status);


--
-- Name: PaymentTransaction_studentId_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PaymentTransaction_studentId_createdAt_idx" ON public."PaymentTransaction" USING btree ("studentId", "createdAt");


--
-- Name: PaymentTransaction_transactionCode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PaymentTransaction_transactionCode_key" ON public."PaymentTransaction" USING btree ("transactionCode");


--
-- Name: PaymentWebhook_paymentTransactionId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PaymentWebhook_paymentTransactionId_idx" ON public."PaymentWebhook" USING btree ("paymentTransactionId");


--
-- Name: PaymentWebhook_provider_eventId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PaymentWebhook_provider_eventId_key" ON public."PaymentWebhook" USING btree (provider, "eventId");


--
-- Name: PaymentWebhook_status_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PaymentWebhook_status_createdAt_idx" ON public."PaymentWebhook" USING btree (status, "createdAt");


--
-- Name: Permission_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Permission_code_key" ON public."Permission" USING btree (code);


--
-- Name: Permission_module_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Permission_module_idx" ON public."Permission" USING btree (module);


--
-- Name: Permission_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Permission_name_idx" ON public."Permission" USING btree (name);


--
-- Name: Prerequisite_prerequisiteCourseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Prerequisite_prerequisiteCourseId_idx" ON public."Prerequisite" USING btree ("prerequisiteCourseId");


--
-- Name: QuestionOption_questionId_displayOrder_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "QuestionOption_questionId_displayOrder_key" ON public."QuestionOption" USING btree ("questionId", "displayOrder");


--
-- Name: QuestionOption_questionId_isCorrect_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "QuestionOption_questionId_isCorrect_idx" ON public."QuestionOption" USING btree ("questionId", "isCorrect");


--
-- Name: Question_chapter_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Question_chapter_idx" ON public."Question" USING btree (chapter);


--
-- Name: Question_courseId_difficulty_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Question_courseId_difficulty_status_idx" ON public."Question" USING btree ("courseId", difficulty, status);


--
-- Name: Question_createdByUserId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Question_createdByUserId_idx" ON public."Question" USING btree ("createdByUserId");


--
-- Name: Question_deletedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Question_deletedAt_idx" ON public."Question" USING btree ("deletedAt");


--
-- Name: Question_questionCode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Question_questionCode_key" ON public."Question" USING btree ("questionCode");


--
-- Name: Receipt_invoiceId_issuedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Receipt_invoiceId_issuedAt_idx" ON public."Receipt" USING btree ("invoiceId", "issuedAt");


--
-- Name: Receipt_paymentTransactionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Receipt_paymentTransactionId_key" ON public."Receipt" USING btree ("paymentTransactionId");


--
-- Name: Receipt_receiptNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Receipt_receiptNumber_key" ON public."Receipt" USING btree ("receiptNumber");


--
-- Name: RefreshToken_expiresAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RefreshToken_expiresAt_idx" ON public."RefreshToken" USING btree ("expiresAt");


--
-- Name: RefreshToken_familyId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RefreshToken_familyId_idx" ON public."RefreshToken" USING btree ("familyId");


--
-- Name: RefreshToken_tokenHash_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON public."RefreshToken" USING btree ("tokenHash");


--
-- Name: RefreshToken_userId_revokedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RefreshToken_userId_revokedAt_idx" ON public."RefreshToken" USING btree ("userId", "revokedAt");


--
-- Name: RolePermission_permissionId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RolePermission_permissionId_idx" ON public."RolePermission" USING btree ("permissionId");


--
-- Name: Role_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Role_code_key" ON public."Role" USING btree (code);


--
-- Name: Role_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Role_name_idx" ON public."Role" USING btree (name);


--
-- Name: Schedule_classSectionId_dayOfWeek_startTime_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Schedule_classSectionId_dayOfWeek_startTime_key" ON public."Schedule" USING btree ("classSectionId", "dayOfWeek", "startTime");


--
-- Name: Schedule_dayOfWeek_startTime_endTime_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Schedule_dayOfWeek_startTime_endTime_idx" ON public."Schedule" USING btree ("dayOfWeek", "startTime", "endTime");


--
-- Name: Scholarship_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Scholarship_code_key" ON public."Scholarship" USING btree (code);


--
-- Name: Scholarship_effectiveFrom_effectiveTo_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Scholarship_effectiveFrom_effectiveTo_idx" ON public."Scholarship" USING btree ("effectiveFrom", "effectiveTo");


--
-- Name: Scholarship_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Scholarship_isActive_idx" ON public."Scholarship" USING btree ("isActive");


--
-- Name: Semester_academicYearId_term_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Semester_academicYearId_term_key" ON public."Semester" USING btree ("academicYearId", term);


--
-- Name: Semester_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Semester_code_key" ON public."Semester" USING btree (code);


--
-- Name: Semester_single_registration_open_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Semester_single_registration_open_idx" ON public."Semester" USING btree (status) WHERE (status = 'REGISTRATION_OPEN'::public."SemesterStatus");


--
-- Name: Semester_status_registrationStartDate_registrationEndDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Semester_status_registrationStartDate_registrationEndDate_idx" ON public."Semester" USING btree (status, "registrationStartDate", "registrationEndDate");


--
-- Name: ServiceRequestCategory_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ServiceRequestCategory_code_key" ON public."ServiceRequestCategory" USING btree (code);


--
-- Name: ServiceRequestComment_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ServiceRequestComment_createdAt_idx" ON public."ServiceRequestComment" USING btree ("createdAt");


--
-- Name: ServiceRequestComment_serviceRequestId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ServiceRequestComment_serviceRequestId_idx" ON public."ServiceRequestComment" USING btree ("serviceRequestId");


--
-- Name: ServiceRequestComment_visibility_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ServiceRequestComment_visibility_idx" ON public."ServiceRequestComment" USING btree (visibility);


--
-- Name: ServiceRequest_assignedToUserId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ServiceRequest_assignedToUserId_idx" ON public."ServiceRequest" USING btree ("assignedToUserId");


--
-- Name: ServiceRequest_categoryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ServiceRequest_categoryId_idx" ON public."ServiceRequest" USING btree ("categoryId");


--
-- Name: ServiceRequest_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ServiceRequest_createdAt_idx" ON public."ServiceRequest" USING btree ("createdAt");


--
-- Name: ServiceRequest_dueAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ServiceRequest_dueAt_idx" ON public."ServiceRequest" USING btree ("dueAt");


--
-- Name: ServiceRequest_priority_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ServiceRequest_priority_idx" ON public."ServiceRequest" USING btree (priority);


--
-- Name: ServiceRequest_requestNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ServiceRequest_requestNumber_key" ON public."ServiceRequest" USING btree ("requestNumber");


--
-- Name: ServiceRequest_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ServiceRequest_status_idx" ON public."ServiceRequest" USING btree (status);


--
-- Name: ServiceRequest_studentId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ServiceRequest_studentId_idx" ON public."ServiceRequest" USING btree ("studentId");


--
-- Name: StudentAnswer_examAttemptId_answeredAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "StudentAnswer_examAttemptId_answeredAt_idx" ON public."StudentAnswer" USING btree ("examAttemptId", "answeredAt");


--
-- Name: StudentAnswer_examAttemptQuestionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "StudentAnswer_examAttemptQuestionId_key" ON public."StudentAnswer" USING btree ("examAttemptQuestionId");


--
-- Name: StudentGrade_gradeComponentId_studentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "StudentGrade_gradeComponentId_studentId_key" ON public."StudentGrade" USING btree ("gradeComponentId", "studentId");


--
-- Name: StudentGrade_gradedByUserId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "StudentGrade_gradedByUserId_idx" ON public."StudentGrade" USING btree ("gradedByUserId");


--
-- Name: StudentGrade_studentId_gradedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "StudentGrade_studentId_gradedAt_idx" ON public."StudentGrade" USING btree ("studentId", "gradedAt");


--
-- Name: StudentScholarship_studentId_scholarshipId_semesterId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "StudentScholarship_studentId_scholarshipId_semesterId_key" ON public."StudentScholarship" USING btree ("studentId", "scholarshipId", "semesterId");


--
-- Name: StudentScholarship_studentId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "StudentScholarship_studentId_status_idx" ON public."StudentScholarship" USING btree ("studentId", status);


--
-- Name: Student_admissionAcademicYearId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Student_admissionAcademicYearId_idx" ON public."Student" USING btree ("admissionAcademicYearId");


--
-- Name: Student_cohort_academicStatus_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Student_cohort_academicStatus_idx" ON public."Student" USING btree (cohort, "academicStatus");


--
-- Name: Student_deletedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Student_deletedAt_idx" ON public."Student" USING btree ("deletedAt");


--
-- Name: Student_departmentId_cohortClass_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Student_departmentId_cohortClass_idx" ON public."Student" USING btree ("departmentId", "cohortClass");


--
-- Name: Student_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Student_email_key" ON public."Student" USING btree (email);


--
-- Name: Student_fullName_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Student_fullName_idx" ON public."Student" USING btree ("fullName");


--
-- Name: Student_studentCode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Student_studentCode_key" ON public."Student" USING btree ("studentCode");


--
-- Name: Student_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Student_userId_key" ON public."Student" USING btree ("userId");


--
-- Name: TuitionItem_courseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TuitionItem_courseId_idx" ON public."TuitionItem" USING btree ("courseId");


--
-- Name: TuitionItem_tuitionPolicyId_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TuitionItem_tuitionPolicyId_type_idx" ON public."TuitionItem" USING btree ("tuitionPolicyId", type);


--
-- Name: TuitionPolicy_effectiveFrom_effectiveTo_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TuitionPolicy_effectiveFrom_effectiveTo_idx" ON public."TuitionPolicy" USING btree ("effectiveFrom", "effectiveTo");


--
-- Name: TuitionPolicy_semesterId_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TuitionPolicy_semesterId_isActive_idx" ON public."TuitionPolicy" USING btree ("semesterId", "isActive");


--
-- Name: TuitionRate_academicYearId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TuitionRate_academicYearId_idx" ON public."TuitionRate" USING btree ("academicYearId");


--
-- Name: TuitionRate_courseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TuitionRate_courseId_idx" ON public."TuitionRate" USING btree ("courseId");


--
-- Name: TuitionRate_effectiveFrom_effectiveTo_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TuitionRate_effectiveFrom_effectiveTo_idx" ON public."TuitionRate" USING btree ("effectiveFrom", "effectiveTo");


--
-- Name: TuitionRate_feeTypeId_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TuitionRate_feeTypeId_isActive_idx" ON public."TuitionRate" USING btree ("feeTypeId", "isActive");


--
-- Name: TuitionRate_semesterId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TuitionRate_semesterId_idx" ON public."TuitionRate" USING btree ("semesterId");


--
-- Name: UserRole_roleId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "UserRole_roleId_idx" ON public."UserRole" USING btree ("roleId");


--
-- Name: User_deletedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_deletedAt_idx" ON public."User" USING btree ("deletedAt");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_fullName_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_fullName_idx" ON public."User" USING btree ("fullName");


--
-- Name: User_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_status_idx" ON public."User" USING btree (status);


--
-- Name: AcademicRiskAlert AcademicRiskAlert_acknowledgedByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AcademicRiskAlert"
    ADD CONSTRAINT "AcademicRiskAlert_acknowledgedByUserId_fkey" FOREIGN KEY ("acknowledgedByUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: AcademicRiskAlert AcademicRiskAlert_dismissedByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AcademicRiskAlert"
    ADD CONSTRAINT "AcademicRiskAlert_dismissedByUserId_fkey" FOREIGN KEY ("dismissedByUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: AcademicRiskAlert AcademicRiskAlert_resolvedByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AcademicRiskAlert"
    ADD CONSTRAINT "AcademicRiskAlert_resolvedByUserId_fkey" FOREIGN KEY ("resolvedByUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: AcademicRiskAlert AcademicRiskAlert_semesterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AcademicRiskAlert"
    ADD CONSTRAINT "AcademicRiskAlert_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES public."Semester"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AcademicRiskAlert AcademicRiskAlert_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AcademicRiskAlert"
    ADD CONSTRAINT "AcademicRiskAlert_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AnnouncementAudience AnnouncementAudience_announcementId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AnnouncementAudience"
    ADD CONSTRAINT "AnnouncementAudience_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES public."Announcement"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AnnouncementAudience AnnouncementAudience_classSectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AnnouncementAudience"
    ADD CONSTRAINT "AnnouncementAudience_classSectionId_fkey" FOREIGN KEY ("classSectionId") REFERENCES public."ClassSection"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AnnouncementAudience AnnouncementAudience_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AnnouncementAudience"
    ADD CONSTRAINT "AnnouncementAudience_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public."Department"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AnnouncementAudience AnnouncementAudience_lecturerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AnnouncementAudience"
    ADD CONSTRAINT "AnnouncementAudience_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES public."Lecturer"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AnnouncementAudience AnnouncementAudience_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AnnouncementAudience"
    ADD CONSTRAINT "AnnouncementAudience_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AnnouncementAudience AnnouncementAudience_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AnnouncementAudience"
    ADD CONSTRAINT "AnnouncementAudience_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AnnouncementReadReceipt AnnouncementReadReceipt_announcementId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AnnouncementReadReceipt"
    ADD CONSTRAINT "AnnouncementReadReceipt_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES public."Announcement"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AnnouncementReadReceipt AnnouncementReadReceipt_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AnnouncementReadReceipt"
    ADD CONSTRAINT "AnnouncementReadReceipt_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Announcement Announcement_cancelledByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Announcement"
    ADD CONSTRAINT "Announcement_cancelledByUserId_fkey" FOREIGN KEY ("cancelledByUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Announcement Announcement_createdByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Announcement"
    ADD CONSTRAINT "Announcement_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Announcement Announcement_publishedByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Announcement"
    ADD CONSTRAINT "Announcement_publishedByUserId_fkey" FOREIGN KEY ("publishedByUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: AttendanceRecord AttendanceRecord_attendanceSessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AttendanceRecord"
    ADD CONSTRAINT "AttendanceRecord_attendanceSessionId_fkey" FOREIGN KEY ("attendanceSessionId") REFERENCES public."AttendanceSession"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AttendanceRecord AttendanceRecord_markedByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AttendanceRecord"
    ADD CONSTRAINT "AttendanceRecord_markedByUserId_fkey" FOREIGN KEY ("markedByUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: AttendanceRecord AttendanceRecord_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AttendanceRecord"
    ADD CONSTRAINT "AttendanceRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AttendanceSession AttendanceSession_classSectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AttendanceSession"
    ADD CONSTRAINT "AttendanceSession_classSectionId_fkey" FOREIGN KEY ("classSectionId") REFERENCES public."ClassSection"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AttendanceSession AttendanceSession_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AttendanceSession"
    ADD CONSTRAINT "AttendanceSession_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."Lecturer"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AuditLog AuditLog_actorUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ClassSection ClassSection_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ClassSection"
    ADD CONSTRAINT "ClassSection_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ClassSection ClassSection_lecturerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ClassSection"
    ADD CONSTRAINT "ClassSection_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES public."Lecturer"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ClassSection ClassSection_semesterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ClassSection"
    ADD CONSTRAINT "ClassSection_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES public."Semester"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Course Course_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public."Department"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Department Department_headLecturerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Department"
    ADD CONSTRAINT "Department_headLecturerId_fkey" FOREIGN KEY ("headLecturerId") REFERENCES public."Lecturer"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Enrollment Enrollment_classSectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_classSectionId_fkey" FOREIGN KEY ("classSectionId") REFERENCES public."ClassSection"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Enrollment Enrollment_finalGradePublishedByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_finalGradePublishedByUserId_fkey" FOREIGN KEY ("finalGradePublishedByUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Enrollment Enrollment_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ExamAssignment ExamAssignment_examId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExamAssignment"
    ADD CONSTRAINT "ExamAssignment_examId_fkey" FOREIGN KEY ("examId") REFERENCES public."Exam"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ExamAssignment ExamAssignment_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExamAssignment"
    ADD CONSTRAINT "ExamAssignment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ExamAttemptQuestion ExamAttemptQuestion_examAttemptId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExamAttemptQuestion"
    ADD CONSTRAINT "ExamAttemptQuestion_examAttemptId_fkey" FOREIGN KEY ("examAttemptId") REFERENCES public."ExamAttempt"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ExamAttemptQuestion ExamAttemptQuestion_questionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExamAttemptQuestion"
    ADD CONSTRAINT "ExamAttemptQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public."Question"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ExamAttempt ExamAttempt_examId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExamAttempt"
    ADD CONSTRAINT "ExamAttempt_examId_fkey" FOREIGN KEY ("examId") REFERENCES public."Exam"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ExamAttempt ExamAttempt_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExamAttempt"
    ADD CONSTRAINT "ExamAttempt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ExamQuestion ExamQuestion_examId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExamQuestion"
    ADD CONSTRAINT "ExamQuestion_examId_fkey" FOREIGN KEY ("examId") REFERENCES public."Exam"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ExamQuestion ExamQuestion_questionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExamQuestion"
    ADD CONSTRAINT "ExamQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public."Question"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Exam Exam_classSectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Exam"
    ADD CONSTRAINT "Exam_classSectionId_fkey" FOREIGN KEY ("classSectionId") REFERENCES public."ClassSection"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Exam Exam_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Exam"
    ADD CONSTRAINT "Exam_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Exam Exam_createdByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Exam"
    ADD CONSTRAINT "Exam_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: FinancialAdjustment FinancialAdjustment_createdByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FinancialAdjustment"
    ADD CONSTRAINT "FinancialAdjustment_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: FinancialAdjustment FinancialAdjustment_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FinancialAdjustment"
    ADD CONSTRAINT "FinancialAdjustment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."Invoice"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FinancialAdjustment FinancialAdjustment_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FinancialAdjustment"
    ADD CONSTRAINT "FinancialAdjustment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GradeComponent GradeComponent_classSectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GradeComponent"
    ADD CONSTRAINT "GradeComponent_classSectionId_fkey" FOREIGN KEY ("classSectionId") REFERENCES public."ClassSection"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: InvoiceItem InvoiceItem_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InvoiceItem"
    ADD CONSTRAINT "InvoiceItem_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: InvoiceItem InvoiceItem_feeTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InvoiceItem"
    ADD CONSTRAINT "InvoiceItem_feeTypeId_fkey" FOREIGN KEY ("feeTypeId") REFERENCES public."FeeType"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: InvoiceItem InvoiceItem_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InvoiceItem"
    ADD CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."Invoice"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: InvoiceItem InvoiceItem_tuitionItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InvoiceItem"
    ADD CONSTRAINT "InvoiceItem_tuitionItemId_fkey" FOREIGN KEY ("tuitionItemId") REFERENCES public."TuitionItem"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Invoice Invoice_cancelledByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_cancelledByUserId_fkey" FOREIGN KEY ("cancelledByUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Invoice Invoice_issuedByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_issuedByUserId_fkey" FOREIGN KEY ("issuedByUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Invoice Invoice_semesterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES public."Semester"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Invoice Invoice_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Lecturer Lecturer_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Lecturer"
    ADD CONSTRAINT "Lecturer_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public."Department"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Lecturer Lecturer_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Lecturer"
    ADD CONSTRAINT "Lecturer_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LoginHistory LoginHistory_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LoginHistory"
    ADD CONSTRAINT "LoginHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: NotificationPreference NotificationPreference_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NotificationPreference"
    ADD CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Notification Notification_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PaymentAllocation PaymentAllocation_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentAllocation"
    ADD CONSTRAINT "PaymentAllocation_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."Invoice"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PaymentAllocation PaymentAllocation_paymentTransactionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentAllocation"
    ADD CONSTRAINT "PaymentAllocation_paymentTransactionId_fkey" FOREIGN KEY ("paymentTransactionId") REFERENCES public."PaymentTransaction"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PaymentTransaction PaymentTransaction_cancelledByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentTransaction"
    ADD CONSTRAINT "PaymentTransaction_cancelledByUserId_fkey" FOREIGN KEY ("cancelledByUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PaymentTransaction PaymentTransaction_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentTransaction"
    ADD CONSTRAINT "PaymentTransaction_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."Invoice"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PaymentTransaction PaymentTransaction_receivedByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentTransaction"
    ADD CONSTRAINT "PaymentTransaction_receivedByUserId_fkey" FOREIGN KEY ("receivedByUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PaymentTransaction PaymentTransaction_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentTransaction"
    ADD CONSTRAINT "PaymentTransaction_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PaymentTransaction PaymentTransaction_verifiedByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentTransaction"
    ADD CONSTRAINT "PaymentTransaction_verifiedByUserId_fkey" FOREIGN KEY ("verifiedByUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PaymentWebhook PaymentWebhook_paymentTransactionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentWebhook"
    ADD CONSTRAINT "PaymentWebhook_paymentTransactionId_fkey" FOREIGN KEY ("paymentTransactionId") REFERENCES public."PaymentTransaction"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Prerequisite Prerequisite_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Prerequisite"
    ADD CONSTRAINT "Prerequisite_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Prerequisite Prerequisite_prerequisiteCourseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Prerequisite"
    ADD CONSTRAINT "Prerequisite_prerequisiteCourseId_fkey" FOREIGN KEY ("prerequisiteCourseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: QuestionOption QuestionOption_questionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuestionOption"
    ADD CONSTRAINT "QuestionOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public."Question"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Question Question_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Question Question_createdByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Receipt Receipt_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Receipt"
    ADD CONSTRAINT "Receipt_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."Invoice"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Receipt Receipt_issuedByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Receipt"
    ADD CONSTRAINT "Receipt_issuedByUserId_fkey" FOREIGN KEY ("issuedByUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Receipt Receipt_paymentTransactionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Receipt"
    ADD CONSTRAINT "Receipt_paymentTransactionId_fkey" FOREIGN KEY ("paymentTransactionId") REFERENCES public."PaymentTransaction"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RefreshToken RefreshToken_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RefreshToken"
    ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RolePermission RolePermission_permissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES public."Permission"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RolePermission RolePermission_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Schedule Schedule_classSectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Schedule"
    ADD CONSTRAINT "Schedule_classSectionId_fkey" FOREIGN KEY ("classSectionId") REFERENCES public."ClassSection"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Scholarship Scholarship_applicableFeeTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Scholarship"
    ADD CONSTRAINT "Scholarship_applicableFeeTypeId_fkey" FOREIGN KEY ("applicableFeeTypeId") REFERENCES public."FeeType"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Semester Semester_academicYearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Semester"
    ADD CONSTRAINT "Semester_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES public."AcademicYear"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ServiceRequestAttachment ServiceRequestAttachment_commentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceRequestAttachment"
    ADD CONSTRAINT "ServiceRequestAttachment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES public."ServiceRequestComment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ServiceRequestAttachment ServiceRequestAttachment_serviceRequestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceRequestAttachment"
    ADD CONSTRAINT "ServiceRequestAttachment_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES public."ServiceRequest"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ServiceRequestAttachment ServiceRequestAttachment_uploadedByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceRequestAttachment"
    ADD CONSTRAINT "ServiceRequestAttachment_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ServiceRequestCategory ServiceRequestCategory_defaultAssigneeRoleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceRequestCategory"
    ADD CONSTRAINT "ServiceRequestCategory_defaultAssigneeRoleId_fkey" FOREIGN KEY ("defaultAssigneeRoleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ServiceRequestCategory ServiceRequestCategory_owningDepartmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceRequestCategory"
    ADD CONSTRAINT "ServiceRequestCategory_owningDepartmentId_fkey" FOREIGN KEY ("owningDepartmentId") REFERENCES public."Department"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ServiceRequestComment ServiceRequestComment_authorUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceRequestComment"
    ADD CONSTRAINT "ServiceRequestComment_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ServiceRequestComment ServiceRequestComment_serviceRequestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceRequestComment"
    ADD CONSTRAINT "ServiceRequestComment_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES public."ServiceRequest"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ServiceRequest ServiceRequest_assignedByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceRequest"
    ADD CONSTRAINT "ServiceRequest_assignedByUserId_fkey" FOREIGN KEY ("assignedByUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ServiceRequest ServiceRequest_assignedToUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceRequest"
    ADD CONSTRAINT "ServiceRequest_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ServiceRequest ServiceRequest_cancelledByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceRequest"
    ADD CONSTRAINT "ServiceRequest_cancelledByUserId_fkey" FOREIGN KEY ("cancelledByUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ServiceRequest ServiceRequest_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceRequest"
    ADD CONSTRAINT "ServiceRequest_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."ServiceRequestCategory"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ServiceRequest ServiceRequest_resolvedByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceRequest"
    ADD CONSTRAINT "ServiceRequest_resolvedByUserId_fkey" FOREIGN KEY ("resolvedByUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ServiceRequest ServiceRequest_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceRequest"
    ADD CONSTRAINT "ServiceRequest_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StudentAnswer StudentAnswer_examAttemptId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudentAnswer"
    ADD CONSTRAINT "StudentAnswer_examAttemptId_fkey" FOREIGN KEY ("examAttemptId") REFERENCES public."ExamAttempt"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentAnswer StudentAnswer_examAttemptQuestionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudentAnswer"
    ADD CONSTRAINT "StudentAnswer_examAttemptQuestionId_fkey" FOREIGN KEY ("examAttemptQuestionId") REFERENCES public."ExamAttemptQuestion"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentGrade StudentGrade_gradeComponentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudentGrade"
    ADD CONSTRAINT "StudentGrade_gradeComponentId_fkey" FOREIGN KEY ("gradeComponentId") REFERENCES public."GradeComponent"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentGrade StudentGrade_gradedByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudentGrade"
    ADD CONSTRAINT "StudentGrade_gradedByUserId_fkey" FOREIGN KEY ("gradedByUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StudentGrade StudentGrade_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudentGrade"
    ADD CONSTRAINT "StudentGrade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StudentScholarship StudentScholarship_approvedByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudentScholarship"
    ADD CONSTRAINT "StudentScholarship_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: StudentScholarship StudentScholarship_scholarshipId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudentScholarship"
    ADD CONSTRAINT "StudentScholarship_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES public."Scholarship"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StudentScholarship StudentScholarship_semesterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudentScholarship"
    ADD CONSTRAINT "StudentScholarship_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES public."Semester"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: StudentScholarship StudentScholarship_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudentScholarship"
    ADD CONSTRAINT "StudentScholarship_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Student Student_admissionAcademicYearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_admissionAcademicYearId_fkey" FOREIGN KEY ("admissionAcademicYearId") REFERENCES public."AcademicYear"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Student Student_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public."Department"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Student Student_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TuitionItem TuitionItem_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TuitionItem"
    ADD CONSTRAINT "TuitionItem_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TuitionItem TuitionItem_tuitionPolicyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TuitionItem"
    ADD CONSTRAINT "TuitionItem_tuitionPolicyId_fkey" FOREIGN KEY ("tuitionPolicyId") REFERENCES public."TuitionPolicy"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TuitionPolicy TuitionPolicy_semesterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TuitionPolicy"
    ADD CONSTRAINT "TuitionPolicy_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES public."Semester"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TuitionRate TuitionRate_academicYearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TuitionRate"
    ADD CONSTRAINT "TuitionRate_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES public."AcademicYear"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TuitionRate TuitionRate_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TuitionRate"
    ADD CONSTRAINT "TuitionRate_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TuitionRate TuitionRate_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TuitionRate"
    ADD CONSTRAINT "TuitionRate_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public."Department"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TuitionRate TuitionRate_feeTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TuitionRate"
    ADD CONSTRAINT "TuitionRate_feeTypeId_fkey" FOREIGN KEY ("feeTypeId") REFERENCES public."FeeType"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TuitionRate TuitionRate_semesterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TuitionRate"
    ADD CONSTRAINT "TuitionRate_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES public."Semester"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: UserRole UserRole_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserRole"
    ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserRole UserRole_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserRole"
    ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict hMAfc0jlPyGXlz0DEWAZbH6Hbh70dzZkd0sfW5GYV0CJYc3FQQh2aIOQcqEqp1F

