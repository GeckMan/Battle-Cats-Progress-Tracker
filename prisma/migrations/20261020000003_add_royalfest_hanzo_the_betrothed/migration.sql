-- Flagged by the new checkSeasonalFestMembership() sync check (first run,
-- 2026-10-20): Hanzo the Betrothed (#862), the June Bride seasonal Uber Rare
-- added in Version 15.4, lacks the "RoyalFest" banner. That banner was only
-- ever seeded from a static unit-number list ending at #820 (migration
-- 20260304000027), and the wiki's RoyalFest page covers every seasonal Uber
-- -- same gap as Jungle Gourmet Tomoe (20261020000001). He was the only
-- seasonal Uber the check found missing.
UPDATE "Unit"
SET "banners" = "banners" || ARRAY['RoyalFest']
WHERE "unitNumber" = 862 AND NOT ('RoyalFest' = ANY("banners"));
