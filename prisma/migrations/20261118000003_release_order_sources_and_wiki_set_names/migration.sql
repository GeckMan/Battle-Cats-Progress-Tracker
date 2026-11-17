-- Ryan (2026-11-17): follow the wiki. First comparison of the LIVE site data
-- (site-data snapshot) with the wiki's Cat Release Order "Obtaining method":
--
-- 1) Source wording. The Release Order calls recurring event-gacha units
--    "Event (Cat) Capsule" (we had SEASONAL_EVENT for 22 of them) and collab
--    campaign rewards "Campaign" (= SEASONAL_EVENT; we had EVENT_CAPSULE for 7).
--    Each update is guarded on the current value. Units deliberately set by
--    hand are untouched (Burgle Boss Cat #504, Droid Cat #77, Baozi Cat #202,
--    Cheetah Cat #673, and every UNOBTAINABLE unit).

UPDATE "Unit" SET "source" = 'EVENT_CAPSULE' WHERE "unitNumber" IN (184, 248, 342, 375, 381, 615, 616, 635, 646, 650, 651, 652, 665, 689, 696, 713, 726, 730, 757, 765, 766, 767) AND "source" = 'SEASONAL_EVENT';
UPDATE "Unit" SET "source" = 'SEASONAL_EVENT' WHERE "unitNumber" IN (300, 317, 374, 384, 400, 433, 606) AND "source" = 'EVENT_CAPSULE';

-- 2) Set names -> the wiki's event names, whole set at a time, only where every
--    unit in the set maps to the same wiki event. Several were the SAME event
--    split under two names ("Love Letter Capsules" + "Heartbeat Catcademy",
--    "New Moon Capsules" + "Lunar New Year"); these merge them. Banner tags are
--    renamed the same way (deduplicated). The new Summer Break names match the
--    ones scripts/data/gacha-event-names.ts already uses for those events.
--    NOT renamed (the Release Order is wrong or generic there): Gals of Summer
--    Sunshine/Blue Ocean (verified against the live rerun), Brainwashed cats
--    ("Seasonal Gacha Banners"), RoyalFest, The Almighties, Easter/Halloween.

UPDATE "Unit" SET "setName" = 'Medal King''s Palace' WHERE "setName" = '10th Anniversary Memorial Capsules';
UPDATE "Unit" SET "banners" = (SELECT array_agg(DISTINCT b) FROM unnest(array_replace("banners", '10th Anniversary Memorial Capsules', 'Medal King''s Palace')) AS b) WHERE '10th Anniversary Memorial Capsules' = ANY("banners");
UPDATE "Unit" SET "setName" = 'June Bride of the Devil' WHERE "setName" = 'June Bride of Devil Capsules';
UPDATE "Unit" SET "banners" = (SELECT array_agg(DISTINCT b) FROM unnest(array_replace("banners", 'June Bride of Devil Capsules', 'June Bride of the Devil')) AS b) WHERE 'June Bride of Devil Capsules' = ANY("banners");
UPDATE "Unit" SET "setName" = 'Heartbeat Catcademy' WHERE "setName" = 'Love Letter Capsules';
UPDATE "Unit" SET "banners" = (SELECT array_agg(DISTINCT b) FROM unnest(array_replace("banners", 'Love Letter Capsules', 'Heartbeat Catcademy')) AS b) WHERE 'Love Letter Capsules' = ANY("banners");
UPDATE "Unit" SET "setName" = 'Lunar New Year' WHERE "setName" = 'New Moon Capsules';
UPDATE "Unit" SET "banners" = (SELECT array_agg(DISTINCT b) FROM unnest(array_replace("banners", 'New Moon Capsules', 'Lunar New Year')) AS b) WHERE 'New Moon Capsules' = ANY("banners");
UPDATE "Unit" SET "setName" = 'Summer Break Cats Paradise' WHERE "setName" = 'Summer Break Capsules Paradise';
UPDATE "Unit" SET "banners" = (SELECT array_agg(DISTINCT b) FROM unnest(array_replace("banners", 'Summer Break Capsules Paradise', 'Summer Break Cats Paradise')) AS b) WHERE 'Summer Break Capsules Paradise' = ANY("banners");
UPDATE "Unit" SET "setName" = 'Summer Break Cats Castaway' WHERE "setName" = 'Summer Break Survival Capsules';
UPDATE "Unit" SET "banners" = (SELECT array_agg(DISTINCT b) FROM unnest(array_replace("banners", 'Summer Break Survival Capsules', 'Summer Break Cats Castaway')) AS b) WHERE 'Summer Break Survival Capsules' = ANY("banners");

-- "Summer Break Capsules" mixed two wiki events, plus #7 Lizard Cat (an Empire of
-- Cats normal unit that never belonged to any gacha set).
UPDATE "Unit" SET "setName" = 'Summer Break Cats Paradise', "banners" = (SELECT array_agg(DISTINCT b) FROM unnest(array_replace("banners", 'Summer Break Capsules', 'Summer Break Cats Paradise')) AS b) WHERE "unitNumber" = 870 AND "setName" = 'Summer Break Capsules';
UPDATE "Unit" SET "setName" = 'Summer Break Cats', "banners" = (SELECT array_agg(DISTINCT b) FROM unnest(array_replace("banners", 'Summer Break Capsules', 'Summer Break Cats')) AS b) WHERE "unitNumber" IN (381, 615, 616, 670, 871) AND "setName" = 'Summer Break Capsules';
UPDATE "Unit" SET "setName" = NULL, "banners" = array_remove("banners", 'Summer Break Capsules') WHERE "unitNumber" = 7 AND "setName" = 'Summer Break Capsules';
