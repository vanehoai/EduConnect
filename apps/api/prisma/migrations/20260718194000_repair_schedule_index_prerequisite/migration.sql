CREATE INDEX IF NOT EXISTS "Schedule_valid_dates_idx"
ON "Schedule" ("validFrom", "validTo");
