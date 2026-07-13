-- Resolves 9 of the 12 units deferred in 20260712000011, using individual
-- Battle Cats Wiki unit pages the user supplied (2026-07-12) -- each of
-- these has much more specific context than the terse Cat Release Order
-- table row, which is what made them ambiguous in the first place.
--
-- Three (Blue Shinobi #82, Squish Ball Cat #140, God #141) turned out to
-- have NO franchise collab tie-in at all -- Lunar New Year event gacha,
-- a stage-clear/easter-egg unlock, and a JP anniversary daily bonus,
-- respectively. Their own wiki pages describe no crossover with any
-- external property. Combined with Masked Cat/Maiko Cat/Toy Machine Cat
-- below, that's 6 of these 9 where isCollab=true was itself wrong, not
-- just missing a setName -- an even bigger legacy-data problem than the
-- setName gap this whole audit effort started out chasing.
--
-- Masked Cat (#29), Maiko Cat (#45), and Toy Machine Cat (#62) confirm
-- the "Nyanko Rangers" sibling match from the previous migration's
-- comment was a false positive from the crude word-overlap heuristic
-- (matching on the generic word "Nyanko" alone) -- each is its own
-- distinct real-world serial-code/gashapon merchandise promo, unrelated
-- to the "Nyanko Rangers" line (Scarf Cat, #831) or to any franchise
-- collaboration.
--
-- Capsule Cat (#28) IS a real collab (MattShea, a YouTuber) -- kept
-- isCollab=true, source=DAILY_LOGIN (matches its "Daily Bonus" wiki
-- description, same treatment as God's Daily Bonus rather than the
-- less-informative generic UNOBTAINABLE this migration initially
-- considered).
--
-- Heavenly Jack (#557) and Li'l Baki (#795) are both real collabs where
-- TWO different setNames already existed in this DB for the same
-- franchise. Resolved by having the user check the app's live set-filter
-- dropdown directly: "Baki Hanma Capsules" and "Bikkuriman Chocolate
-- Capsules" are the only entries that actually appear there -- "Baki
-- Hanma Collaboration" and "Bikkuriman Collaboration" are not, confirming
-- which of each pair is the real, currently-used canonical name.
UPDATE "Unit" SET "setName" = 'MattShea Collaboration', "source" = 'DAILY_LOGIN',
  "banners" = ARRAY['MattShea Collaboration']
WHERE "unitNumber" = 28 AND "name" = 'Capsule Cat' AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Lunar New Year', "source" = 'EVENT_CAPSULE', "isCollab" = false,
  "banners" = ARRAY['Lunar New Year']
WHERE "unitNumber" = 82 AND "name" = 'Blue Shinobi' AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'None More Squishy', "source" = 'STAGE_DROP', "isCollab" = false,
  "banners" = ARRAY['None More Squishy']
WHERE "unitNumber" = 140 AND "name" = 'Squish Ball Cat' AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = '11 1/2 Year Anniversary', "source" = 'DAILY_LOGIN', "isCollab" = false,
  "banners" = ARRAY['11 1/2 Year Anniversary']
WHERE "unitNumber" = 141 AND "name" = 'God' AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Nyanko Daisensou Lottery Double Chance Campaign', "source" = 'UNOBTAINABLE', "isCollab" = false,
  "banners" = ARRAY['Nyanko Daisensou Lottery Double Chance Campaign']
WHERE "unitNumber" = 29 AND "name" = 'Masked Cat' AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Nyanko Ecology Report', "source" = 'UNOBTAINABLE', "isCollab" = false,
  "banners" = ARRAY['Nyanko Ecology Report']
WHERE "unitNumber" = 45 AND "name" = 'Maiko Cat' AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Battle Cats Gashapon', "source" = 'UNOBTAINABLE', "isCollab" = false,
  "banners" = ARRAY['Battle Cats Gashapon']
WHERE "unitNumber" = 62 AND "name" = 'Toy Machine Cat' AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Bikkuriman Chocolate Capsules',
  "banners" = (
    SELECT array_agg(DISTINCT b)
    FROM unnest(COALESCE("banners", ARRAY[]::TEXT[]) || ARRAY['Bikkuriman Chocolate Capsules']) AS b
  )
WHERE "unitNumber" = 557 AND "name" = 'Heavenly Jack' AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Baki Hanma Capsules',
  "banners" = (
    SELECT array_agg(DISTINCT b)
    FROM unnest(COALESCE("banners", ARRAY[]::TEXT[]) || ARRAY['Baki Hanma Capsules']) AS b
  )
WHERE "unitNumber" = 795 AND "name" = 'Li''l Baki' AND "setName" IS NULL;
