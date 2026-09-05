-- bvg_tbc reported (Discord, 2026-09-01) that Jungle Gourmet Tomoe was
-- STILL showing under the generic "Cyber Academy Galaxy Gals" banner
-- instead of "Gals of Summer Blue Ocean", even after 20260831000002.
--
-- Root cause: that migration targeted unitNumber = 873, sourced from
-- three fan sites (battlecatsstats.com/unit/873, bc.godfat.org/cats/873,
-- mygamatoto.com/catinfo/873) that all agreed on "873" -- but their own
-- extracted game asset filenames for that exact page reference
-- "uni872_f00.png"/"uni872_c00.png", and a fourth independent source
-- (貓咪大戰爭中文資訊網, battlecatsinfo.github.io/unit.html?id=872) and the
-- wiki's own page-title fallback ("872 (Uber Rare Cat)") both use 872.
-- This project's own asset naming has already been confirmed elsewhere
-- to match the true in-game Cat Unit # exactly (e.g. Seabreeze
-- Coppermine, unitNumber 494, uses "Uni494_f00.png") -- so "873" was a
-- shifted/off-by-one index specific to those three fan sites' own
-- internal catalogs, not the real unit number. This corrects the target
-- to unitNumber = 872 and re-applies the same fix.
UPDATE "Unit"
SET "setName" = 'Gals of Summer Blue Ocean',
    "banners" = COALESCE("banners", ARRAY[]::TEXT[]) || ARRAY['Gals of Summer Blue Ocean']
WHERE "unitNumber" = 872
AND NOT ('Gals of Summer Blue Ocean' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));
