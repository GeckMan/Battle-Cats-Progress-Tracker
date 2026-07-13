-- Full-audit find (2026-07-13, prompted by "do a full audit... any glaring
-- issues?"): three real collab families are split across TWO different
-- setName strings each, fragmenting a single real-world collaboration into
-- two separate entries in the app's Sets dropdown -- the exact same class
-- of bug as the already-fixed "Gals of Summer Sunshine" conflict earlier
-- this session, just never caught for these three.
--
-- All three were introduced by the original March 2026 migrations
-- (20260303000004/25/26), which used one label consistently for the bulk
-- gacha-capsule roster, while a LATER migration (resolving a single
-- stamp-reward/login unit that never appears in the gacha capsule data at
-- all) independently picked a DIFFERENT label for the same real franchise
-- -- without ever going back to reconcile the bulk roster to match.
--
--   - Bikkuriman: units 466,467,468,469,470,471,472,473,544,555,556,762
--     have been sitting at 'Bikkuriman Collaboration' since March. Migration
--     20260712000012 confirmed 'Bikkuriman Chocolate Capsules' is the real
--     canonical name (verified directly against the live app's Sets
--     dropdown, which the user checked) but only applied it to Heavenly
--     Jack (#557), which had a NULL setName at the time -- never
--     back-filled to the other 12.
--   - Baki: units 789-794 have been sitting at 'Baki Hanma Collaboration'
--     since March, while Li'l Baki (#795, fixed in the same migration
--     20260712000012) correctly got 'Baki Hanma Capsules' -- the name this
--     project's own code already treats as canonical everywhere else
--     (BCU_KNOWN_COLLAB_CATEGORIES in both sync-bcdata.ts and
--     fetch-collab-verification-pages.ts, plus the wiki-navbox comment on
--     COLLAB_NAME_PATTERN).
--   - Rurouni Kenshin: units 746-752 have been sitting at 'Rurouni Kenshin
--     Collaboration' since March, while Kaoru Cat (#753, fixed in migration
--     20260712000006) got 'Rurouni Kenshin Gacha' -- again the name this
--     project's own code treats as canonical (same BCU_KNOWN_COLLAB_
--     CATEGORIES lists, and bcu-assets' own -2030 category name). Migration
--     20260712000006's own comment mistakenly claimed "Gacha" was "already
--     relied on elsewhere... for the main capsule roster" -- it wasn't; the
--     roster was still on the old "Collaboration" label the whole time,
--     which is exactly the fragmentation this migration now closes.
--
-- Each UPDATE also merges the new setName into that unit's `banners` array
-- (same array_agg(DISTINCT ...) pattern as migration 20260712000012) so a
-- unit that's ever separately picked up a "Collaboration"-labeled banner
-- entry doesn't end up with a stale duplicate sitting alongside the fixed
-- one.
UPDATE "Unit"
SET "setName" = 'Bikkuriman Chocolate Capsules',
    "banners" = (
      SELECT array_agg(DISTINCT b)
      FROM unnest(
        array_remove(COALESCE("banners", ARRAY[]::TEXT[]), 'Bikkuriman Collaboration')
        || ARRAY['Bikkuriman Chocolate Capsules']
      ) AS b
    )
WHERE "unitNumber" IN (466, 467, 468, 469, 470, 471, 472, 473, 544, 555, 556, 762)
  AND "setName" = 'Bikkuriman Collaboration';

UPDATE "Unit"
SET "setName" = 'Baki Hanma Capsules',
    "banners" = (
      SELECT array_agg(DISTINCT b)
      FROM unnest(
        array_remove(COALESCE("banners", ARRAY[]::TEXT[]), 'Baki Hanma Collaboration')
        || ARRAY['Baki Hanma Capsules']
      ) AS b
    )
WHERE "unitNumber" IN (789, 790, 791, 792, 793, 794)
  AND "setName" = 'Baki Hanma Collaboration';

UPDATE "Unit"
SET "setName" = 'Rurouni Kenshin Gacha',
    "banners" = (
      SELECT array_agg(DISTINCT b)
      FROM unnest(
        array_remove(COALESCE("banners", ARRAY[]::TEXT[]), 'Rurouni Kenshin Collaboration')
        || ARRAY['Rurouni Kenshin Gacha']
      ) AS b
    )
WHERE "unitNumber" IN (746, 747, 748, 749, 750, 751, 752)
  AND "setName" = 'Rurouni Kenshin Collaboration';
