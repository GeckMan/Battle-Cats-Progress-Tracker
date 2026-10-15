-- shroomp reported in site chat (2026-10-03) that Burgle Boss Cat (Retired,
-- #504) is missing from the Units grid. Migration 20260929000001 had marked
-- him UNOBTAINABLE based on a wiki page snapshot saying his only unlock was
-- League 2 of "The Burgle Cats" mini-event, which no longer runs.
--
-- Ryan re-checked the wiki (page modified ~1 week before 2026-10-15): the
-- current page says he "can be obtained from the Download Celebration!
-- Event Gacha" (added in Version 8.9). The earlier snapshot was stale or
-- incomplete, and Ryan confirms he is obtainable right now. Revert to a
-- real obtain method so he shows in the default grid again.
--
-- Guarded on source = 'UNOBTAINABLE' so this never overwrites a value
-- anyone has since set differently. setName is left untouched (unconfirmed).
UPDATE "Unit"
SET "source" = 'EVENT_CAPSULE'
WHERE "unitNumber" = 504 AND "source" = 'UNOBTAINABLE';
