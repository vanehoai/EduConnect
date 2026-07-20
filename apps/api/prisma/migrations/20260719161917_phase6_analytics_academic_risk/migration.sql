-- CreateEnum
CREATE TYPE "RiskType" AS ENUM ('LOW_GPA', 'GPA_DECLINE', 'HIGH_ABSENCE', 'CONSECUTIVE_ABSENCE', 'FAILED_COURSES', 'LOW_CREDIT_COMPLETION', 'EXAM_INCOMPLETE', 'FINANCIAL_HOLD', 'OTHER');

-- CreateEnum
CREATE TYPE "RiskSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "RiskStatus" AS ENUM ('OPEN', 'ACKNOWLEDGED', 'RESOLVED', 'DISMISSED');



-- CreateTable
CREATE TABLE "AcademicRiskRule" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "type" "RiskType" NOT NULL,
    "defaultSeverity" "RiskSeverity" NOT NULL,
    "thresholdConfig" JSONB NOT NULL,
    "evaluationPeriodType" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "effectiveFrom" DATE,
    "effectiveTo" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicRiskRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicRiskAlert" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "type" "RiskType" NOT NULL,
    "severity" "RiskSeverity" NOT NULL,
    "status" "RiskStatus" NOT NULL DEFAULT 'OPEN',
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "ruleCode" VARCHAR(50) NOT NULL,
    "ruleSnapshot" JSONB,
    "evaluationPeriod" VARCHAR(50) NOT NULL,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledgedAt" TIMESTAMP(3),
    "acknowledgedByUserId" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "resolvedByUserId" TEXT,
    "resolutionNote" TEXT,
    "dismissedAt" TIMESTAMP(3),
    "dismissedByUserId" TEXT,
    "dismissReason" TEXT,
    "notificationSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicRiskAlert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AcademicRiskRule_code_key" ON "AcademicRiskRule"("code");

-- CreateIndex
CREATE INDEX "AcademicRiskRule_type_idx" ON "AcademicRiskRule"("type");

-- CreateIndex
CREATE INDEX "AcademicRiskRule_isActive_idx" ON "AcademicRiskRule"("isActive");

-- CreateIndex
CREATE INDEX "AcademicRiskAlert_studentId_status_idx" ON "AcademicRiskAlert"("studentId", "status");

-- CreateIndex
CREATE INDEX "AcademicRiskAlert_semesterId_idx" ON "AcademicRiskAlert"("semesterId");

-- CreateIndex
CREATE INDEX "AcademicRiskAlert_type_idx" ON "AcademicRiskAlert"("type");

-- CreateIndex
CREATE INDEX "AcademicRiskAlert_severity_idx" ON "AcademicRiskAlert"("severity");

-- CreateIndex
CREATE INDEX "AcademicRiskAlert_detectedAt_idx" ON "AcademicRiskAlert"("detectedAt");

-- CreateIndex
CREATE INDEX "AcademicRiskAlert_evaluationPeriod_idx" ON "AcademicRiskAlert"("evaluationPeriod");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicRiskAlert_studentId_semesterId_ruleCode_evaluationP_key" ON "AcademicRiskAlert"("studentId", "semesterId", "ruleCode", "evaluationPeriod");

-- AddForeignKey
ALTER TABLE "AcademicRiskAlert" ADD CONSTRAINT "AcademicRiskAlert_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicRiskAlert" ADD CONSTRAINT "AcademicRiskAlert_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicRiskAlert" ADD CONSTRAINT "AcademicRiskAlert_acknowledgedByUserId_fkey" FOREIGN KEY ("acknowledgedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicRiskAlert" ADD CONSTRAINT "AcademicRiskAlert_resolvedByUserId_fkey" FOREIGN KEY ("resolvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicRiskAlert" ADD CONSTRAINT "AcademicRiskAlert_dismissedByUserId_fkey" FOREIGN KEY ("dismissedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
