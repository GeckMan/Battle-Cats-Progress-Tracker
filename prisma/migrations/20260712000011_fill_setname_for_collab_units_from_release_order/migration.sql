-- Fills setName for units already flagged isCollab=true (some by earlier
-- migrations this session, most pre-existing from the original hardcoded
-- isCollab list this project started with) that never got a real setName
-- at all. Sourced from the 2026-07-12 "Audit Obtain Methods" workflow run,
-- which cross-references the Battle Cats Wiki's Cat Release Order page
-- against this database and also proposes any EXISTING setName that
-- shares a significant word with the collab, specifically so this
-- migration doesn't invent a second, differently-labeled entry for a
-- collab that's already correctly named on its capsule-roster siblings.
--
-- Three tiers below, each reviewed by hand rather than applied blindly:
--
-- 1. Single, unambiguous existing sibling match -- applied as-is.
-- 2. No existing sibling shares a word with this collab at all (i.e. this
--    project apparently has no other unit correctly tagged for it yet
--    either) -- the wiki's own phrasing is used directly since there's
--    nothing established to conflict with.
-- 3. Ancient Egg: N203 (#713) and Ancient Egg: N205 (#757) had THREE
--    candidates ("June Bride of Devil Capsules", "June Bride", "June
--    Bride of the Devil"). Cross-checked against this session's own
--    bcu-assets bot-GachaName.txt fetch, which has literal per-row
--    English names "June Bride of Devil Capsules" for this exact capsule
--    (rows E19/E24/E29/E50) -- the authoritative BCData-derived name, not
--    the wiki's own "June Bride of the Devil" phrasing. This also means
--    The Invisible Cat (#863, fixed in 20260712000008 using the wiki's
--    "June Bride of the Devil" phrasing before this cross-check was
--    available) was itself slightly off -- corrected here too, to the
--    same canonical "June Bride of Devil Capsules" its actual siblings use.
--
-- Deliberately NOT touched here (left for a closer look, listed for
-- context rather than guessed):
--   - Capsule Cat (#28), Blue Shinobi (#82), Squish Ball Cat (#140), God
--     (#141): each has TWO unrelated obtaining methods (an often-removed
--     serial code promo AND a separate campaign/capsule/login method) --
--     genuinely ambiguous which one setName should represent.
--   - Masked Cat (#29), Maiko Cat (#45), Toy Machine Cat (#62): the
--     audit's sibling-matcher proposed "Nyanko Rangers" for these, but
--     that's a false positive from matching on the generic shared word
--     "Nyanko" alone -- each is actually its own distinct serial-code
--     merchandise promo (a lottery prize, an "Ecology Report" tie-in, a
--     strap), not the same "Nyanko Rangers" line as Scarf Cat (#831).
--     These look like they may deserve their own "serial code merch
--     tie-in" classification separate from real franchise collabs
--     entirely -- a bigger question than a setName guess can resolve.
--   - Heavenly Jack (#557): two real, already-existing but DIFFERENT
--     candidates ("Bikkuriman Collaboration" vs "Bikkuriman Chocolate
--     Capsules") already sit in this database for the same franchise --
--     worth investigating why there are two before picking one.
--   - Li'l Baki (#795): same issue -- "Baki Hanma Collaboration" vs
--     "Baki Hanma Capsules" both already exist as setNames in this DB.
--   - Ancient Egg: N202 (#670), Tasmanian Giant Crab (#813), Consultant
--     Cat (#822): "Summer Break Cats" / "... Castaway" / "... Paradise"
--     are three distinct sub-events, and the sibling-matcher's broad word
--     overlap ("Summer", "Cats") returned too many unrelated candidates
--     to pick from confidently.
UPDATE "Unit" SET "setName" = 'Princess Punt Sweets Collaboration', "banners" = ARRAY['Princess Punt Sweets Collaboration']
WHERE "unitNumber" = 26 AND "isCollab" = true AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Merc Storia Collaboration', "banners" = ARRAY['Merc Storia Collaboration']
WHERE "unitNumber" = 121 AND "isCollab" = true AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Shoumetsu Toshi Collaboration', "banners" = ARRAY['Shoumetsu Toshi Collaboration']
WHERE "unitNumber" = 181 AND "isCollab" = true AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Neo Mushroom Garden Collaboration', "banners" = ARRAY['Neo Mushroom Garden Collaboration']
WHERE "unitNumber" = 278 AND "isCollab" = true AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Neo Mushroom Garden Collaboration', "banners" = ARRAY['Neo Mushroom Garden Collaboration']
WHERE "unitNumber" = 279 AND "isCollab" = true AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Neo Mushroom Garden Collaboration', "banners" = ARRAY['Neo Mushroom Garden Collaboration']
WHERE "unitNumber" = 280 AND "isCollab" = true AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Puella Magi Madoka Magica Collaboration', "banners" = ARRAY['Puella Magi Madoka Magica Collaboration']
WHERE "unitNumber" = 300 AND "isCollab" = true AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Pikotaro Collaboration', "banners" = ARRAY['Pikotaro Collaboration']
WHERE "unitNumber" = 317 AND "isCollab" = true AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Crash Fever Collaboration', "banners" = ARRAY['Crash Fever Collaboration']
WHERE "unitNumber" = 328 AND "isCollab" = true AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Fate/Stay Night Collaboration', "banners" = ARRAY['Fate/Stay Night Collaboration']
WHERE "unitNumber" = 369 AND "isCollab" = true AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Fate/Stay Night Collaboration', "banners" = ARRAY['Fate/Stay Night Collaboration']
WHERE "unitNumber" = 374 AND "isCollab" = true AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Power Pro Baseball Collaboration', "banners" = ARRAY['Power Pro Baseball Collaboration']
WHERE "unitNumber" = 384 AND "isCollab" = true AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Mentori Collaboration', "banners" = ARRAY['Mentori Collaboration']
WHERE "unitNumber" = 400 AND "isCollab" = true AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Neon Genesis Evangelion Collaboration', "banners" = ARRAY['Neon Genesis Evangelion Collaboration']
WHERE "unitNumber" = 403 AND "isCollab" = true AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Neon Genesis Evangelion Collaboration', "banners" = ARRAY['Neon Genesis Evangelion Collaboration']
WHERE "unitNumber" = 405 AND "isCollab" = true AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Betakkuma Collaboration', "banners" = ARRAY['Betakkuma Collaboration']
WHERE "unitNumber" = 433 AND "isCollab" = true AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Fate/Stay Night Collaboration', "banners" = ARRAY['Fate/Stay Night Collaboration']
WHERE "unitNumber" = 457 AND "isCollab" = true AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Shakurel Planet Collaboration Event', "banners" = ARRAY['Shakurel Planet Collaboration Event']
WHERE "unitNumber" = 497 AND "isCollab" = true AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Shakurel Planet Collaboration Event', "banners" = ARRAY['Shakurel Planet Collaboration Event']
WHERE "unitNumber" = 498 AND "isCollab" = true AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Shakurel Planet Collaboration Event', "banners" = ARRAY['Shakurel Planet Collaboration Event']
WHERE "unitNumber" = 499 AND "isCollab" = true AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Shakurel Planet Collaboration Event', "banners" = ARRAY['Shakurel Planet Collaboration Event']
WHERE "unitNumber" = 500 AND "isCollab" = true AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Street Fighter Collaboration', "banners" = ARRAY['Street Fighter Collaboration']
WHERE "unitNumber" = 509 AND "isCollab" = true AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Ranma 1/2 Collaboration', "banners" = ARRAY['Ranma 1/2 Collaboration']
WHERE "unitNumber" = 606 AND "isCollab" = true AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'World Trigger 1/2 Collaboration', "banners" = ARRAY['World Trigger 1/2 Collaboration']
WHERE "unitNumber" = 679 AND "isCollab" = true AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Heartbeat Catcademy', "banners" = ARRAY['Heartbeat Catcademy']
WHERE "unitNumber" = 696 AND "isCollab" = true AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'June Bride of Devil Capsules', "banners" = ARRAY['June Bride of Devil Capsules']
WHERE "unitNumber" = 713 AND "isCollab" = true AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Medal King''s Palace', "banners" = ARRAY['Medal King''s Palace']
WHERE "unitNumber" = 726 AND "isCollab" = true AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Lunar New Year', "banners" = ARRAY['Lunar New Year']
WHERE "unitNumber" = 730 AND "isCollab" = true AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Tower of Saviors Collaboration', "banners" = ARRAY['Tower of Saviors Collaboration']
WHERE "unitNumber" = 744 AND "isCollab" = true AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Tower of Saviors Collaboration', "banners" = ARRAY['Tower of Saviors Collaboration']
WHERE "unitNumber" = 745 AND "isCollab" = true AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'June Bride of Devil Capsules', "banners" = ARRAY['June Bride of Devil Capsules']
WHERE "unitNumber" = 757 AND "isCollab" = true AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Sonic the Hedgehog Collaboration', "banners" = ARRAY['Sonic the Hedgehog Collaboration']
WHERE "unitNumber" = 808 AND "isCollab" = true AND "setName" IS NULL;

-- Retroactive correction: fixed 2026-07-12 in 20260712000008 using the
-- wiki's own "June Bride of the Devil" phrasing, before this session's
-- bcu-assets cross-check revealed the real established name for this
-- exact capsule ("June Bride of Devil Capsules", per bot-GachaName.txt
-- rows E19/E24/E29/E50) is spelled slightly differently.
UPDATE "Unit" SET "setName" = 'June Bride of Devil Capsules',
  "banners" = ARRAY['June Bride of Devil Capsules']
WHERE "unitNumber" = 863 AND "setName" = 'June Bride of the Devil';
