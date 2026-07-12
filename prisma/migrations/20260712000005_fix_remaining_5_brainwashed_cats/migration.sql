-- Fixes the last 5 of the 9 Brainwashed Cats surfaced by
-- checkBrainwashedCatsCoverage() as still sitting on the generic
-- "Brainwashed Cats" placeholder: Cat (#629), Tank Cat (#636), Axe Cat
-- (#645), Gross Cat (#654), Titan Cat (#694).
--
-- These 5 all debuted completely alone in BCData (no co-occurring sibling
-- to borrow a name from -- confirmed by the 2026-07-12 sync log), so the
-- debut-clustering method that solved the first 4 didn't apply. bcu-assets'
-- bot-GachaName.txt had a category lead for each of these rows (Halloween
-- Gacha / Christmas Gacha / Valentine Gacha / Valentine Gacha respectively
-- for Cat/Tank/Axe/Titan; no entry for Gross Cat's row), but those leads
-- were NOT used directly -- they're generic bcu category buckets, and two
-- of them (Tank Cat's "Christmas Gacha", and implicitly Cat's "Halloween
-- Gacha" being the current run vs. some other historical one) didn't match
-- what direct wiki evidence actually shows. Confirmed instead via 3
-- current Battle Cats Wiki gacha-roster pages the user supplied
-- (2026-07-12), each of which bold/red-highlights its 3 currently-rotating
-- Brainwashed picks:
--   - "Halloween Capsules (Gacha Event)": Brainwashed Cat, Brainwashed Tank
--     Cat, Brainwashed Cow Cat (Cow Cat already fixed -> June Bride in
--     20260712000002; also added as a second banner here since this page
--     directly confirms it's offered from Halloween Capsules too, same
--     multi-banner precedent as unit 642's "Best of the Best" addition).
--   - "Xmas Gals (Gacha Event)": Brainwashed Gross Cat, Brainwashed Lizard
--     Cat (already fixed -> Xmas Gals in 20260712000002, consistent/
--     cross-validated by this independent page), Brainwashed Titan Cat.
--   - "Valentine Gals (Gacha Event)": Brainwashed Axe Cat, Brainwashed Bird
--     Cat (already fixed -> Gals of Summer previously? no -- Bird Cat was
--     fixed to "Gals of Summer" in 20260712000002; this page shows Bird
--     Cat also rotates through Valentine Gals, added as a second banner
--     for the same reason as Cow Cat above), Brainwashed Titan Cat.
--
-- Titan Cat appears on BOTH the Xmas Gals and Valentine Gals pages (a
-- direct, wiki-confirmed example of the "3 selected per event, rotating on
-- each rerun" mechanic from Category:Brainwashed_Cats applying to the same
-- unit across different seasons). Its bcu-assets debut row (785, category
-- -113 "Valentine Gacha") points at Valentine Gals as its actual original
-- debut, so that's used as the primary setName; Xmas Gals is kept as a
-- second banner since it's independently confirmed too.
UPDATE "Unit"
SET "setName" = 'Halloween Capsules',
    "banners" = (
      SELECT array_agg(DISTINCT b)
      FROM unnest(COALESCE("banners", ARRAY[]::TEXT[]) || ARRAY['Brainwashed Cats', 'Halloween Capsules']) AS b
    )
WHERE "unitNumber" = 629
AND NOT ('Halloween Capsules' = ANY(COALESCE("banners", ARRAY[]::TEXT[])) AND "setName" = 'Halloween Capsules');

UPDATE "Unit"
SET "setName" = 'Halloween Capsules',
    "banners" = (
      SELECT array_agg(DISTINCT b)
      FROM unnest(COALESCE("banners", ARRAY[]::TEXT[]) || ARRAY['Brainwashed Cats', 'Halloween Capsules']) AS b
    )
WHERE "unitNumber" = 636
AND NOT ('Halloween Capsules' = ANY(COALESCE("banners", ARRAY[]::TEXT[])) AND "setName" = 'Halloween Capsules');

UPDATE "Unit"
SET "setName" = 'Valentine Gals',
    "banners" = (
      SELECT array_agg(DISTINCT b)
      FROM unnest(COALESCE("banners", ARRAY[]::TEXT[]) || ARRAY['Brainwashed Cats', 'Valentine Gals']) AS b
    )
WHERE "unitNumber" = 645
AND NOT ('Valentine Gals' = ANY(COALESCE("banners", ARRAY[]::TEXT[])) AND "setName" = 'Valentine Gals');

UPDATE "Unit"
SET "setName" = 'Xmas Gals',
    "banners" = (
      SELECT array_agg(DISTINCT b)
      FROM unnest(COALESCE("banners", ARRAY[]::TEXT[]) || ARRAY['Brainwashed Cats', 'Xmas Gals']) AS b
    )
WHERE "unitNumber" = 654
AND NOT ('Xmas Gals' = ANY(COALESCE("banners", ARRAY[]::TEXT[])) AND "setName" = 'Xmas Gals');

UPDATE "Unit"
SET "setName" = 'Valentine Gals',
    "banners" = (
      SELECT array_agg(DISTINCT b)
      FROM unnest(COALESCE("banners", ARRAY[]::TEXT[]) || ARRAY['Brainwashed Cats', 'Valentine Gals', 'Xmas Gals']) AS b
    )
WHERE "unitNumber" = 694
AND NOT ('Valentine Gals' = ANY(COALESCE("banners", ARRAY[]::TEXT[])) AND "setName" = 'Valentine Gals');

-- Cross-check confirmed by the wiki: Brainwashed Cow Cat (#662, setName
-- "June Bride" since 20260712000002) also appears in the current
-- Halloween Capsules roster -- add it as a second banner, same reasoning
-- as above.
UPDATE "Unit"
SET "banners" = (
      SELECT array_agg(DISTINCT b)
      FROM unnest(COALESCE("banners", ARRAY[]::TEXT[]) || ARRAY['Halloween Capsules']) AS b
    )
WHERE "unitNumber" = 662
AND NOT ('Halloween Capsules' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));

-- Cross-check confirmed by the wiki: Brainwashed Bird Cat (#667, setName
-- "Gals of Summer" since 20260712000002) also appears in the current
-- Valentine Gals roster -- add it as a second banner, same reasoning.
UPDATE "Unit"
SET "banners" = (
      SELECT array_agg(DISTINCT b)
      FROM unnest(COALESCE("banners", ARRAY[]::TEXT[]) || ARRAY['Valentine Gals']) AS b
    )
WHERE "unitNumber" = 667
AND NOT ('Valentine Gals' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));
