-- CreateEnum
CREATE TYPE "FeeCategory" AS ENUM ('TUITION', 'REGISTRATION', 'FACILITY', 'LAB', 'LIBRARY', 'EXAM', 'OTHER');

-- CreateEnum
CREATE TYPE "FeeCalculationMethod" AS ENUM ('FIXED', 'PER_CREDIT', 'PER_COURSE', 'PER_SEMESTER');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');

-- CreateEnum
CREATE TYPE "ScholarshipStatus" AS ENUM ('APPROVED', 'REJECTED', 'PENDING', 'REVOKED');

-- CreateEnum
CREATE TYPE "FinancialAdjustmentType" AS ENUM ('CREDIT', 'DEBIT');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'BANK_TRANSFER', 'INTERNAL_TRANSFER', 'OTHER');

-- CreateEnum
CREATE TYPE "ReceiptStatus" AS ENUM ('ISSUED', 'CANCELLED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "InvoiceStatus" ADD VALUE 'VOID';
ALTER TYPE "InvoiceStatus" ADD VALUE 'DRAFT';
ALTER TYPE "InvoiceStatus" ADD VALUE 'ISSUED';

-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'VERIFIED';

-- DropForeignKey
ALTER TABLE "PaymentTransaction" DROP CONSTRAINT "PaymentTransaction_invoiceId_fkey";

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "adjustmentAmount" DECIMAL(18,0) NOT NULL DEFAULT 0,
ADD COLUMN     "cancelReason" VARCHAR(500),
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "cancelledByUserId" TEXT,
ADD COLUMN     "issueDate" DATE,
ADD COLUMN     "issuedAt" TIMESTAMP(3),
ADD COLUMN     "issuedByUserId" TEXT,
ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "InvoiceItem" ADD COLUMN     "calculationSnapshot" JSONB,
ADD COLUMN     "courseId" TEXT,
ADD COLUMN     "discountAmount" DECIMAL(18,0) NOT NULL DEFAULT 0,
ADD COLUMN     "enrollmentId" TEXT,
ADD COLUMN     "feeTypeId" TEXT;

-- AlterTable
ALTER TABLE "PaymentTransaction" ADD COLUMN     "cancelReason" VARCHAR(500),
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "cancelledByUserId" TEXT,
ADD COLUMN     "method" "PaymentMethod" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "receivedByUserId" TEXT,
ADD COLUMN     "verifiedAt" TIMESTAMP(3),
ADD COLUMN     "verifiedByUserId" TEXT;

-- AlterTable
ALTER TABLE "Receipt" ADD COLUMN     "cancelReason" VARCHAR(500),
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "issuedByUserId" TEXT,
ADD COLUMN     "status" "ReceiptStatus" NOT NULL DEFAULT 'ISSUED';

-- CreateTable
CREATE TABLE "FeeType" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "category" "FeeCategory" NOT NULL DEFAULT 'OTHER',
    "calculationMethod" "FeeCalculationMethod" NOT NULL DEFAULT 'FIXED',
    "defaultAmount" DECIMAL(18,0) NOT NULL DEFAULT 0,
    "isMandatory" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeeType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TuitionRate" (
    "id" TEXT NOT NULL,
    "academicYearId" TEXT,
    "semesterId" TEXT,
    "departmentId" TEXT,
    "courseId" TEXT,
    "feeTypeId" TEXT NOT NULL,
    "amountPerCredit" DECIMAL(18,0),
    "fixedAmount" DECIMAL(18,0),
    "effectiveFrom" DATE NOT NULL,
    "effectiveTo" DATE,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TuitionRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scholarship" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "discountType" "DiscountType" NOT NULL,
    "discountValue" DECIMAL(18,2) NOT NULL,
    "maximumAmount" DECIMAL(18,0),
    "applicableFeeTypeId" TEXT,
    "effectiveFrom" DATE NOT NULL,
    "effectiveTo" DATE,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scholarship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentScholarship" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "scholarshipId" TEXT NOT NULL,
    "semesterId" TEXT,
    "status" "ScholarshipStatus" NOT NULL DEFAULT 'APPROVED',
    "notes" TEXT,
    "approvedByUserId" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentScholarship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentAllocation" (
    "id" TEXT NOT NULL,
    "paymentTransactionId" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "amount" DECIMAL(18,0) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialAdjustment" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "invoiceId" TEXT,
    "type" "FinancialAdjustmentType" NOT NULL,
    "amount" DECIMAL(18,0) NOT NULL,
    "reason" VARCHAR(500) NOT NULL,
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialAdjustment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeeType_code_key" ON "FeeType"("code");

-- CreateIndex
CREATE INDEX "FeeType_isActive_idx" ON "FeeType"("isActive");

-- CreateIndex
CREATE INDEX "TuitionRate_feeTypeId_isActive_idx" ON "TuitionRate"("feeTypeId", "isActive");

-- CreateIndex
CREATE INDEX "TuitionRate_academicYearId_idx" ON "TuitionRate"("academicYearId");

-- CreateIndex
CREATE INDEX "TuitionRate_semesterId_idx" ON "TuitionRate"("semesterId");

-- CreateIndex
CREATE INDEX "TuitionRate_courseId_idx" ON "TuitionRate"("courseId");

-- CreateIndex
CREATE INDEX "TuitionRate_effectiveFrom_effectiveTo_idx" ON "TuitionRate"("effectiveFrom", "effectiveTo");

-- CreateIndex
CREATE UNIQUE INDEX "Scholarship_code_key" ON "Scholarship"("code");

-- CreateIndex
CREATE INDEX "Scholarship_isActive_idx" ON "Scholarship"("isActive");

-- CreateIndex
CREATE INDEX "Scholarship_effectiveFrom_effectiveTo_idx" ON "Scholarship"("effectiveFrom", "effectiveTo");

-- CreateIndex
CREATE INDEX "StudentScholarship_studentId_status_idx" ON "StudentScholarship"("studentId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "StudentScholarship_studentId_scholarshipId_semesterId_key" ON "StudentScholarship"("studentId", "scholarshipId", "semesterId");

-- CreateIndex
CREATE INDEX "PaymentAllocation_invoiceId_idx" ON "PaymentAllocation"("invoiceId");

-- CreateIndex
CREATE INDEX "PaymentAllocation_paymentTransactionId_idx" ON "PaymentAllocation"("paymentTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentAllocation_paymentTransactionId_invoiceId_key" ON "PaymentAllocation"("paymentTransactionId", "invoiceId");

-- CreateIndex
CREATE INDEX "FinancialAdjustment_studentId_idx" ON "FinancialAdjustment"("studentId");

-- CreateIndex
CREATE INDEX "FinancialAdjustment_invoiceId_idx" ON "FinancialAdjustment"("invoiceId");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_issuedByUserId_fkey" FOREIGN KEY ("issuedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_cancelledByUserId_fkey" FOREIGN KEY ("cancelledByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_feeTypeId_fkey" FOREIGN KEY ("feeTypeId") REFERENCES "FeeType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_receivedByUserId_fkey" FOREIGN KEY ("receivedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_verifiedByUserId_fkey" FOREIGN KEY ("verifiedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_cancelledByUserId_fkey" FOREIGN KEY ("cancelledByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_issuedByUserId_fkey" FOREIGN KEY ("issuedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TuitionRate" ADD CONSTRAINT "TuitionRate_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TuitionRate" ADD CONSTRAINT "TuitionRate_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TuitionRate" ADD CONSTRAINT "TuitionRate_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TuitionRate" ADD CONSTRAINT "TuitionRate_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TuitionRate" ADD CONSTRAINT "TuitionRate_feeTypeId_fkey" FOREIGN KEY ("feeTypeId") REFERENCES "FeeType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scholarship" ADD CONSTRAINT "Scholarship_applicableFeeTypeId_fkey" FOREIGN KEY ("applicableFeeTypeId") REFERENCES "FeeType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentScholarship" ADD CONSTRAINT "StudentScholarship_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentScholarship" ADD CONSTRAINT "StudentScholarship_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "Scholarship"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentScholarship" ADD CONSTRAINT "StudentScholarship_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentScholarship" ADD CONSTRAINT "StudentScholarship_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentAllocation" ADD CONSTRAINT "PaymentAllocation_paymentTransactionId_fkey" FOREIGN KEY ("paymentTransactionId") REFERENCES "PaymentTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentAllocation" ADD CONSTRAINT "PaymentAllocation_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialAdjustment" ADD CONSTRAINT "FinancialAdjustment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialAdjustment" ADD CONSTRAINT "FinancialAdjustment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialAdjustment" ADD CONSTRAINT "FinancialAdjustment_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

