-- Two reports from shroomp (site chat, 2026-10-28), confirmed by Ryan 2026-11-17.
--
-- 1. "green and pink rangers are in 9th anniversary banner."
--    Green Nyanko Ranger (#834) and Pink Nyanko Ranger (#835) carried the
--    "9th Anniversary Special Capsules" set/banner (searching "ranger" under
--    that filter returned exactly these two). The wiki's Cat Release Order
--    (Ryan's screenshot) gives their real obtaining methods:
--      #831 Red    - Event Cat Capsule - Nyanko Rangers
--      #832 Blue   - Gamatoto Expedition
--      #833 Yellow - Catnip Challenges - 13th Anniversary
--      #834 Green  - Cat Guide - 13th Anniversary
--      #835 Pink   - Event Poster - 13th Anniversary
--    i.e. 13th Anniversary rewards (added v15.4 in EN), nothing to do with
--    the 9th anniversary gacha. Remove the wrong set/banner and fill in the
--    real sources. (scripts/sync-bcdata.ts now also enforces this via
--    BANNER_EXCLUSIONS, in case a sync step re-derives the tag.)
--
-- 2. NEO Best of the Best showed the entire base Rare/Super Rare capsule pool
--    (25 Rare + 25 Super Rare). Ryan's rule, used for every other banner:
--    Super Rares/Rares that aren't exclusive to the banner don't belong in
--    its filter. Remove the NEO tag from the base "Rare Cat Capsule" pool
--    units, except the specific named units the NEO wiki page features
--    (NEO_BEST_OF_THE_BEST_UNIT_NAMES in the sync), which keep it. The sync no
--    longer adds the base pool.
UPDATE "Unit"
SET "banners" = array_remove(COALESCE("banners", ARRAY[]::TEXT[]), '9th Anniversary Special Capsules'),
    "setName" = CASE WHEN "setName" = '9th Anniversary Special Capsules' THEN NULL ELSE "setName" END
WHERE "unitNumber" IN (834, 835);

UPDATE "Unit" SET "source" = 'GAMATOTO_EXPEDITION' WHERE "unitNumber" = 832 AND "source" IS DISTINCT FROM 'GAMATOTO_EXPEDITION';
UPDATE "Unit" SET "source" = 'CATNIP_CHALLENGES'   WHERE "unitNumber" = 833 AND "source" IS DISTINCT FROM 'CATNIP_CHALLENGES';
UPDATE "Unit" SET "source" = 'CAT_GUIDE_UNLOCK'    WHERE "unitNumber" = 834 AND "source" IS DISTINCT FROM 'CAT_GUIDE_UNLOCK';
UPDATE "Unit" SET "source" = 'EVENT_POSTER'        WHERE "unitNumber" = 835 AND "source" IS DISTINCT FROM 'EVENT_POSTER';

UPDATE "Unit"
SET "banners" = array_remove("banners", 'NEO Best of the Best')
WHERE "setName" = 'Rare Cat Capsule'
  AND 'NEO Best of the Best' = ANY("banners")
  AND "name" NOT IN (
    'Li''l Valkyrie Dark', 'Agent Staal', 'Sodom', 'Uesugi Kenshin', 'Togeluga',
    'Twinstars', 'Empress Chronos', 'Kintaro', 'Mighty Aethur Ltd.',
    'Summoner Satoru', 'White Knight Cyclops', 'Bliza', 'Raclesa', 'Good-Luck Ebisu'
  );
