-- Reconcile regular "Best of the Best" banner tags with BCData's latest
-- GatyaDataSetR1 "Best of the Best Gacha" row (row 1052, 56 ids), as reported
-- by the drift check in sync-bcdata.ts (reportEvergreenBannerRosterDrift,
-- Actions run 2026-10-28). Independently confirmed against the wiki's
-- "Best of the Best (Gacha Event)" page: the 11 units added below plus
-- Li'l Valkyrie (#435) and Trixi (#758), already tagged, are exactly the
-- wiki's 13 Uber-tier roster entries. NEO Best of the Best already matched.
-- The 22 removed units were tagged by hand in 20260304000027 step 6 (or a
-- previous rerun) and are not in the current roster. Milestone Edition tags
-- (migration 20261028000002) are a separate banner and untouched.

-- Remove stale tags
UPDATE "Unit"
SET "banners" = array_remove(COALESCE("banners", ARRAY[]::TEXT[]), 'Best of the Best')
WHERE "unitNumber" IN (359,168,334,698,143,76,87,34,159,125,496,43,336,674,569,642,633,692,774,272,396,715);

-- Add missing roster members (Baby Cat, Mizli, Mighty Bomburr, Lightmother Aset,
-- Kamukura, Warlock and Pierre, Myrcia, Date Masamune, Adventurer Kanna,
-- Sarukani, Furiluga)
UPDATE "Unit"
SET "banners" = COALESCE("banners", ARRAY[]::TEXT[]) || ARRAY['Best of the Best']
WHERE "unitNumber" IN (59,360,306,723,86,226,502,124,607,322,625)
AND NOT ('Best of the Best' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));
