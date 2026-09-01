-- bvg_tbc followed up (Discord, 2026-08-31) after the previous fix
-- (20260831000001) still left units in the wrong banner, and posted the
-- exact rosters straight from the CURRENTLY LIVE rerun (Summer Break Cats,
-- 8/28-9/18):
--
--   Gals of Summer Blue Ocean: Tropical Kalisa, Seabreeze Coppermine,
--   Summerluga, Kaguya of the Coast, Coastal Explorer Kanna, Music Fest
--   Thundia, Jungle Gourmet Tomoe.
--
--   Gals of Summer Sunshine: Seashore Kai, Midsummer Rabbit, Waverider Kuu,
--   Squirtgun Saki, Night Beach Lilin, Seaside Pegasa.
--
-- Two things this reveals that the previous migration got wrong:
--
--   1. The wiki event-page PDFs Ryan had supplied were captured 2026-07-12
--      (per their own printed timestamp) -- an OLDER rerun than the one
--      live right now. The live rosters have since shifted: Summerluga,
--      Coastal Explorer Kanna, and Seabreeze Coppermine are Blue Ocean in
--      THIS rerun (not Sunshine, and not dual as previously assumed), and
--      Midsummer Rabbit is Sunshine-only (not dual either). There is no
--      overlap between the two lists in the current rerun.
--
--   2. Jungle Gourmet Tomoe (#873, evolves into Canopy Queen Tomoe) is a
--      brand-new Uber Rare added in Version 15.5.1, specifically for this
--      Blue Ocean rerun. Our weekly BCData sync already picked her up
--      (she's on the site, per bvg), but only under the generic evergreen
--      "Cyber Academy Galaxy Gals" franchise banner, since her sync ran
--      without a specific-capsule classification. This corrects her
--      setName to reflect this event and adds the specific banner tag
--      (leaves her existing banner tags alone -- additive only).
--
-- Each block below is written to be fully idempotent: it both strips the
-- now-wrong tag and adds the correct one in a single CASE expression, so
-- it's safe regardless of which of the two tags (if either) the unit
-- currently carries.

-- Summerluga: Sunshine -> Blue Ocean only
UPDATE "Unit"
SET "setName" = 'Gals of Summer Blue Ocean',
    "banners" = CASE
      WHEN 'Gals of Summer Blue Ocean' = ANY(array_remove(COALESCE("banners", ARRAY[]::TEXT[]), 'Gals of Summer Sunshine'))
      THEN array_remove(COALESCE("banners", ARRAY[]::TEXT[]), 'Gals of Summer Sunshine')
      ELSE array_remove(COALESCE("banners", ARRAY[]::TEXT[]), 'Gals of Summer Sunshine') || ARRAY['Gals of Summer Blue Ocean']
    END
WHERE "unitNumber" = 564;

-- Coastal Explorer Kanna: Sunshine -> Blue Ocean only
UPDATE "Unit"
SET "setName" = 'Gals of Summer Blue Ocean',
    "banners" = CASE
      WHEN 'Gals of Summer Blue Ocean' = ANY(array_remove(COALESCE("banners", ARRAY[]::TEXT[]), 'Gals of Summer Sunshine'))
      THEN array_remove(COALESCE("banners", ARRAY[]::TEXT[]), 'Gals of Summer Sunshine')
      ELSE array_remove(COALESCE("banners", ARRAY[]::TEXT[]), 'Gals of Summer Sunshine') || ARRAY['Gals of Summer Blue Ocean']
    END
WHERE "unitNumber" = 714;

-- Midsummer Rabbit: Blue Ocean -> Sunshine only
UPDATE "Unit"
SET "setName" = 'Gals of Summer Sunshine',
    "banners" = CASE
      WHEN 'Gals of Summer Sunshine' = ANY(array_remove(COALESCE("banners", ARRAY[]::TEXT[]), 'Gals of Summer Blue Ocean'))
      THEN array_remove(COALESCE("banners", ARRAY[]::TEXT[]), 'Gals of Summer Blue Ocean')
      ELSE array_remove(COALESCE("banners", ARRAY[]::TEXT[]), 'Gals of Summer Blue Ocean') || ARRAY['Gals of Summer Sunshine']
    END
WHERE "unitNumber" = 275;

-- Seabreeze Coppermine: Sunshine -> Blue Ocean only
UPDATE "Unit"
SET "setName" = 'Gals of Summer Blue Ocean',
    "banners" = CASE
      WHEN 'Gals of Summer Blue Ocean' = ANY(array_remove(COALESCE("banners", ARRAY[]::TEXT[]), 'Gals of Summer Sunshine'))
      THEN array_remove(COALESCE("banners", ARRAY[]::TEXT[]), 'Gals of Summer Sunshine')
      ELSE array_remove(COALESCE("banners", ARRAY[]::TEXT[]), 'Gals of Summer Sunshine') || ARRAY['Gals of Summer Blue Ocean']
    END
WHERE "unitNumber" = 494;

-- Jungle Gourmet Tomoe: new unit, backfill Blue Ocean (no-ops if the row
-- doesn't exist yet in this environment's DB; additive only, doesn't
-- touch her existing "Cyber Academy Galaxy Gals" franchise tag)
UPDATE "Unit"
SET "setName" = 'Gals of Summer Blue Ocean',
    "banners" = COALESCE("banners", ARRAY[]::TEXT[]) || ARRAY['Gals of Summer Blue Ocean']
WHERE "unitNumber" = 873
AND NOT ('Gals of Summer Blue Ocean' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));
