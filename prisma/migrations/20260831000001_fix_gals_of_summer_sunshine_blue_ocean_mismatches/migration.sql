-- Ryan uploaded print-to-PDF captures of the LIVE, current
-- Gals_of_Summer_Sunshine_(Gacha_Event) and Gals_of_Summer_Blue_Ocean_(Gacha_Event)
-- pages from the primary Battle Cats Wiki (battlecats.miraheze.org) on 2026-08-31,
-- confirming bvg_tbc's Discord report: "Gals of Summer 'Blue Ocean' and 'Sunshine'
-- are mixed and do not match what we have in game right now."
--
-- Cross-referencing both capsule tables directly (not just event-page prose) against
-- our DB found the real mismatch:
--
--   Squirtgun Saki (#563) and Night Beach Lilin (#666) are currently tagged
--   'Gals of Summer Blue Ocean' in this DB (from the original 20260712000003 split
--   migration), but neither appears anywhere in the current Blue Ocean capsule table.
--   Both appear explicitly in the current SUNSHINE capsule table instead. This is
--   the exact swap bvg flagged.
--
--   Midsummer Rabbit (#275) appears, verbatim, in BOTH capsule tables (same
--   flavor text on both pages) -- a genuine dual-membership unit, not an error.
--   It already carries the Blue Ocean tag; it was just missing the Sunshine one.
--
--   Coastal Explorer Kanna (#714) and Summerluga (#564) each appear on one event's
--   capsule table with unique per-event flavor text AND are independently confirmed
--   by their own dedicated wiki pages to be tied to the OTHER event too -- both are
--   genuine dual-membership units, just missing one of their two banner tags.
--
--   Seabreeze Coppermine (#494) does NOT appear on either current capsule table, but
--   her own dedicated wiki page unambiguously ties her only to Sunshine (no Blue
--   Ocean mention at all) -- left untouched, matching the Seaside Pegasa precedent
--   (20260829000001) where a unit absent from the current banner snapshot but
--   confirmed via its own page was kept, not stripped.
--
-- Also adds the two Sunshine-exclusive and three Blue-Ocean-exclusive Brainwashed
-- Cat variants confirmed (this session, from the current wiki's bolded/featured SR
-- lists) to round out each event's Rare-tier pool: Brainwashed Axe Cat (#645) and
-- Brainwashed Fish Cat (#684) for Sunshine; Brainwashed Gross Cat (#654),
-- Brainwashed Lizard Cat (#688), and Brainwashed Titan Cat (#694) for Blue Ocean.
-- Additive/idempotent only -- no existing tag is removed by this block.

-- Squirtgun Saki: Blue Ocean -> Sunshine (wrong event entirely)
UPDATE "Unit"
SET "setName" = 'Gals of Summer Sunshine',
    "banners" = array_remove("banners", 'Gals of Summer Blue Ocean') || ARRAY['Gals of Summer Sunshine']
WHERE "unitNumber" = 563
AND NOT ('Gals of Summer Sunshine' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));

-- Night Beach Lilin: Blue Ocean -> Sunshine (wrong event entirely)
UPDATE "Unit"
SET "setName" = 'Gals of Summer Sunshine',
    "banners" = array_remove("banners", 'Gals of Summer Blue Ocean') || ARRAY['Gals of Summer Sunshine']
WHERE "unitNumber" = 666
AND NOT ('Gals of Summer Sunshine' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));

-- Midsummer Rabbit: genuinely dual -- add the missing Sunshine tag
UPDATE "Unit"
SET "banners" = "banners" || ARRAY['Gals of Summer Sunshine']
WHERE "unitNumber" = 275
AND NOT ('Gals of Summer Sunshine' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));

-- Coastal Explorer Kanna: genuinely dual -- add the missing Blue Ocean tag
UPDATE "Unit"
SET "banners" = "banners" || ARRAY['Gals of Summer Blue Ocean']
WHERE "unitNumber" = 714
AND NOT ('Gals of Summer Blue Ocean' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));

-- Summerluga: genuinely dual -- add the missing Blue Ocean tag
UPDATE "Unit"
SET "banners" = "banners" || ARRAY['Gals of Summer Blue Ocean']
WHERE "unitNumber" = 564
AND NOT ('Gals of Summer Blue Ocean' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));

-- Sunshine-exclusive Brainwashed variants (safety-net, additive only)
UPDATE "Unit"
SET "banners" = "banners" || ARRAY['Gals of Summer Sunshine']
WHERE "unitNumber" IN (645, 684)
AND NOT ('Gals of Summer Sunshine' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));

-- Blue-Ocean-exclusive Brainwashed variants (safety-net, additive only)
UPDATE "Unit"
SET "banners" = "banners" || ARRAY['Gals of Summer Blue Ocean']
WHERE "unitNumber" IN (654, 688, 694)
AND NOT ('Gals of Summer Blue Ocean' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));
