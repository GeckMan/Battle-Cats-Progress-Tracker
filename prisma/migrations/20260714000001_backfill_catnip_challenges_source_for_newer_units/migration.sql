-- Found via the 2026-07-14 sync run's new checkUnitClassificationCoverage()
-- output (source-alone check, added the day before): Helmet Cat (#833) and
-- Giga-Nyan Rex (#836) still showed source = NULL, which would render
-- "How to Obtain: Unknown" in the app.
--
-- These aren't actually unclassified -- migration 20260303000004 already
-- set source = 'CATNIP_CHALLENGES' for a verified list of 19 units
-- (352, 383, 637, 658, 659, 663, 664, 675, 676, 697, 706, 707, 716, 717,
-- 724, 740, 776, 833, 836), and 833/836 are right there in that list. The
-- other 17 units in the list currently have source set correctly per this
-- run's coverage check (they weren't flagged), which means 833 and 836 in
-- particular simply didn't exist as rows in the Unit table yet back when
-- that March migration's UPDATE ran (BCData added them to the DB some time
-- after) -- the UPDATE ... WHERE "unitNumber" IN (...) matched 0 rows for
-- them at the time, and a one-time migration never gets a second chance to
-- backfill units that show up later. The new syncSourceFromReleaseOrder()
-- step (added 2026-07-13) confirms this from the wiki itself: both units'
-- Cat Release Order row literally says "Catnip Challenges - 13th
-- Anniversary" as their obtaining method, it just wasn't in that script's
-- prefix map yet (fixed in the same commit as this migration) so it
-- correctly declined to guess rather than silently misclassifying them.
--
-- Scoped to WHERE "source" IS NULL so this is a no-op if these ever get
-- backfilled some other way before this migration runs.
UPDATE "Unit"
SET "source" = 'CATNIP_CHALLENGES'
WHERE "unitNumber" IN (833, 836)
  AND "source" IS NULL;
