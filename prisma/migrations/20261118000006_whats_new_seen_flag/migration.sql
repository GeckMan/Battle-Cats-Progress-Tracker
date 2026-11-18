-- One-time "What's new" announcement: id of the last announcement each user
-- dismissed. NULL = hasn't seen any (they get the current one once).
ALTER TABLE "User" ADD COLUMN "seenUpdateId" TEXT;
