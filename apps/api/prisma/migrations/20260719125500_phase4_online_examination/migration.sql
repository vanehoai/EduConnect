-- CreateEnum
CREATE TYPE "ShowResultMode" AS ENUM ('IMMEDIATELY', 'AFTER_EXAM_END', 'AFTER_PUBLISH', 'NEVER');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ExamAttemptStatus" ADD VALUE 'EXPIRED';
ALTER TYPE "ExamAttemptStatus" ADD VALUE 'CANCELLED';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ExamStatus" ADD VALUE 'OPEN';
ALTER TYPE "ExamStatus" ADD VALUE 'CLOSED';
ALTER TYPE "ExamStatus" ADD VALUE 'PUBLISHED';

-- AlterEnum
ALTER TYPE "QuestionType" ADD VALUE 'TRUE_FALSE';

-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "allowLateStart" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "allowReview" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "autoSubmit" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "showResultMode" "ShowResultMode" NOT NULL DEFAULT 'NEVER';

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "defaultScore" DECIMAL(5,2) NOT NULL DEFAULT 1;

