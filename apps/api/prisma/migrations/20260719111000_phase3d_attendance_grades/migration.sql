-- DropIndex
DROP INDEX "AttendanceSession_classSectionId_sessionDate_key";

-- AlterTable
ALTER TABLE "AttendanceRecord" ADD COLUMN     "markedAt" TIMESTAMP(3),
ADD COLUMN     "markedByUserId" TEXT;

-- AlterTable
ALTER TABLE "AttendanceSession" ADD COLUMN     "endTime" TIME(0) NOT NULL,
ADD COLUMN     "startTime" TIME(0) NOT NULL;

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "finalGradePublishedAt" TIMESTAMP(3),
ADD COLUMN     "finalGradePublishedByUserId" TEXT;

-- AlterTable
ALTER TABLE "StudentGrade" ADD COLUMN     "publishedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceSession_classSectionId_sessionDate_startTime_key" ON "AttendanceSession"("classSectionId", "sessionDate", "startTime");

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_finalGradePublishedByUserId_fkey" FOREIGN KEY ("finalGradePublishedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_markedByUserId_fkey" FOREIGN KEY ("markedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Add CHECK Constraints
ALTER TABLE "AttendanceSession" ADD CONSTRAINT "AttendanceSession_time_check" CHECK ("startTime" < "endTime");
ALTER TABLE "GradeComponent" ADD CONSTRAINT "GradeComponent_weight_check" CHECK ("weight" > 0 AND "weight" <= 100);
ALTER TABLE "GradeComponent" ADD CONSTRAINT "GradeComponent_maxScore_check" CHECK ("maxScore" > 0);
ALTER TABLE "StudentGrade" ADD CONSTRAINT "StudentGrade_score_check" CHECK ("score" >= 0);
