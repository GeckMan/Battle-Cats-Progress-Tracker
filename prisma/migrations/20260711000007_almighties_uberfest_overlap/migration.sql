-- Fixes the Reddit-reported "Almighties filter is very strange" /
-- "UBERFEST filter shows Uber Fest and Almighties together" bug directly,
-- since syncBannerMembership() in sync-bcdata.ts can no longer detect this
-- from BCData at all now that its banner labels are gone entirely (see
-- that migration's sibling commits from earlier today).
--
-- Provenance: migration 20260303000025_fix_set_names_from_cat_guide first
-- set setName='The Almighties' for 14 units, including these 12. Migration
-- 20260303000026_fix_set_names_from_gacha_data later overwrote setName to
-- 'UBERFEST' (since renamed to 'Uber Fest') for a broader list that
-- includes all 12 of these same units, per its own comment: "UBERFEST:
-- units in both fests (Gigant Zeus pool) + UBERFEST-only exclusives" --
-- i.e. these 12 were always intended to belong to BOTH banners, but the
-- single-value setName column could only hold one, so the Almighties tag
-- got silently dropped when banners[] (which supports multiple entries)
-- didn't exist yet. Restoring it now as an additional banners[] entry
-- without changing setName, which stays 'Uber Fest' as their primary home.

UPDATE "Unit"
SET "banners" = (
  SELECT array_agg(DISTINCT b)
  FROM unnest(COALESCE("banners", ARRAY[]::TEXT[]) || ARRAY['The Almighties']) AS b
)
WHERE "unitNumber" IN (257, 258, 259, 271, 272, 316, 439, 493, 534, 642, 723, 811);
