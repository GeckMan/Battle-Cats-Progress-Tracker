-- Ryan (2026-11-17): "remove super rares/rares from the special gachas, like
-- the Air Busters filter. The only ones that should be there should be special
-- like seasonal units such as Gloomy Neneko" (checked against the wiki's Cat
-- Release Order).
--
-- 1. The base "Rare Cat Capsule" Super Rare/Rare pool (the Release Order lists
--    ~58 such units with a plain "Rare Cat Capsule" obtain method) was tagged
--    into special gacha filters (Super Fest by the sync's allowlist, NEO Best
--    of the Best, festival rows from raw gacha data). Reduce every such unit
--    (setName = 'Rare Cat Capsule', RARE/SUPER_RARE, non-collab) to just the
--    'Rare Cat Capsule' banner. Exclusive SR/Rares keep their own banners
--    because they have their own setName (Gloomy Neneko #228 Halloween
--    Capsules, Suntan Cat #565 Gals of Summer, Good-Luck Ebisu #520 NEO, ...).
--    Supersedes the narrower NEO-only cleanup in 20261117000002.
UPDATE "Unit"
SET "banners" = ARRAY['Rare Cat Capsule']
WHERE "setName" = 'Rare Cat Capsule'
  AND "category" IN ('RARE', 'SUPER_RARE')
  AND "isCollab" = false;

-- 2. "9th Anniversary Special Capsules" isn't an obtain method on the wiki's
--    Cat Release Order at all (Ryan checked; nothing there says "9th
--    Anniversary"). The three units that carried it as setName are listed
--    there under their real events:
--      #184 Mr. Ninja  - Event Cat Capsule - What's in the Box
--      #342 Maneki Cat - Event Capsule - Medal King's Palace
--      #375 Coin Cat   - Event Capsule - Medal King's Palace
--    (Green/Pink Nyanko Ranger #834/#835 also carried it; fixed in
--    20261117000002.) Move the three to their real set names.
UPDATE "Unit"
SET "setName" = 'What''s in the Box',
    "banners" = (SELECT array_agg(DISTINCT b) FROM unnest(array_remove(COALESCE("banners", ARRAY[]::TEXT[]), '9th Anniversary Special Capsules') || ARRAY['What''s in the Box']) AS b)
WHERE "unitNumber" = 184;

UPDATE "Unit"
SET "setName" = 'Medal King''s Palace',
    "banners" = (SELECT array_agg(DISTINCT b) FROM unnest(array_remove(COALESCE("banners", ARRAY[]::TEXT[]), '9th Anniversary Special Capsules') || ARRAY['Medal King''s Palace']) AS b)
WHERE "unitNumber" IN (342, 375);

-- Anything else still carrying the retired name loses it (the sync's new
-- checkRetiredSetNames() reports any that reappear).
UPDATE "Unit"
SET "banners" = array_remove(COALESCE("banners", ARRAY[]::TEXT[]), '9th Anniversary Special Capsules'),
    "setName" = CASE WHEN "setName" = '9th Anniversary Special Capsules' THEN NULL ELSE "setName" END
WHERE "setName" = '9th Anniversary Special Capsules' OR '9th Anniversary Special Capsules' = ANY(COALESCE("banners", ARRAY[]::TEXT[]));
