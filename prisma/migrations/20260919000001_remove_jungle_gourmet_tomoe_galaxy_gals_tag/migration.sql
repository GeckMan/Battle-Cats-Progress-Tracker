-- bvg_tbc followed up (Discord, 2026-09-19) after 20260901000001 fixed
-- Jungle Gourmet Tomoe's unit number (872, not 873) and added the Blue
-- Ocean tag: she now correctly appears in Gals of Summer Blue Ocean, but
-- that migration was purely additive and left her pre-existing generic
-- "Cyber Academy Galaxy Gals" tag in place, so she still shows in BOTH
-- banners. Per bvg: "It appears in two banners, but should be only in
-- one -- Gals of Summer Blue Ocean." Unlike Coastal Explorer Kanna/
-- Seabreeze Coppermine/etc. (real historical multi-membership across
-- Gals of Summer reruns), she's a brand-new 15.5.1 unit with no other
-- banner history, so the generic franchise tag was just an artifact of
-- how she got auto-classified before her specific capsule was known.
UPDATE "Unit"
SET "banners" = array_remove("banners", 'Cyber Academy Galaxy Gals')
WHERE "unitNumber" = 872
AND 'Cyber Academy Galaxy Gals' = ANY(COALESCE("banners", ARRAY[]::TEXT[]));
