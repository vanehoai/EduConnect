-- Phase 3B: ClassSection and Schedule constraints

ALTER TABLE "ClassSection"
ADD CONSTRAINT "ClassSection_positive_capacity_check"
CHECK ("maxCapacity" > 0);

ALTER TABLE "Schedule"
ADD CONSTRAINT "Schedule_valid_times_check"
CHECK ("startTime" < "endTime");

ALTER TABLE "Schedule"
ADD CONSTRAINT "Schedule_valid_dates_check"
CHECK ("validFrom" IS NULL OR "validTo" IS NULL OR "validFrom" <= "validTo");

CREATE INDEX "Schedule_valid_dates_idx"
ON "Schedule" ("validFrom", "validTo");
