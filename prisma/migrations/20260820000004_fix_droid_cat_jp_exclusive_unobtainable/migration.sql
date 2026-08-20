-- Fixes Droid Cat (Rare Cat, #77) showing up in the default Units grid.
-- Reported by Ryan (2026-08-20) via a wiki screenshot: Droid Cat's page
-- carries a "JAPANESE EXCLUSIVE" banner ("This feature is exclusive to the
-- Japanese version of The Battle Cats") -- its Google Android Collaboration
-- Event item drop never ran in EN. Same underlying bug class as God (#141,
-- fixed in 20260820000003): a real, structured historical obtain mechanism
-- (here, source=STAGE_DROP) that's nonetheless unreachable for an EN player
-- because the specific event that granted it was Japan-only.
--
-- This is the second, immediate, wiki-confirmed instance of a pattern now
-- also handled going forward by scripts/sync-bcdata.ts's new
-- syncJapaneseExclusiveFlag(), which cross-references the wiki's own
-- "Category:Japanese Exclusive Content" listing on every sync run. That
-- function requires live network access to run (this sandbox doesn't have
-- it), so this migration applies the same correction directly for Droid
-- Cat now rather than waiting on the next scheduled sync.
UPDATE "Unit"
SET "source" = 'UNOBTAINABLE'
WHERE "unitNumber" = 77 AND "name" = 'Droid Cat' AND "source" != 'UNOBTAINABLE';
