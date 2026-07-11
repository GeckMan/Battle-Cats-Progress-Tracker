-- Normalize the legacy raw capsule-type codes 'UBERFEST'/'EPICFEST' to
-- clean, human-readable names matching the rest of the setName catalog
-- (Title Case, e.g. "Best of the Best", "NEO Best of the Best") instead of
-- shouting internal codes.
--
-- This is part of the fix for a Reddit-reported bug: "the UBERFEST filter
-- shows Uber Fest AND Almighties together" / "the Almighties filter is very
-- strange". Left as raw ALL-CAPS codes, these would also have started
-- diverging from the newer sync's clean "Uber Fest"/"Epic Fest" values
-- (added via scripts/data/gacha-event-names.ts), silently splitting each
-- fest into two different setName/banners strings for old vs newly-synced
-- units. Renaming the legacy value in place keeps everything on one name
-- going forward. The actual Uber Fest/Almighties overlap membership itself
-- is fixed separately by syncBannerMembership() in sync-bcdata.ts, which
-- reads real BCData banner history instead of guessing.

UPDATE "Unit" SET "setName" = 'Uber Fest' WHERE "setName" = 'UBERFEST';
UPDATE "Unit" SET "setName" = 'Epic Fest' WHERE "setName" = 'EPICFEST';

UPDATE "Unit" SET "banners" = array_replace("banners", 'UBERFEST', 'Uber Fest')
WHERE 'UBERFEST' = ANY("banners");

UPDATE "Unit" SET "banners" = array_replace("banners", 'EPICFEST', 'Epic Fest')
WHERE 'EPICFEST' = ANY("banners");
