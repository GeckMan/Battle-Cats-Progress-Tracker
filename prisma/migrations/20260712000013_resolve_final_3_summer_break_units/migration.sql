-- Resolves the final 3 of the 12 units deferred in 20260712000011, using the
-- individual Battle Cats Wiki unit pages the user supplied (2026-07-12).
--
-- These three all trace back to the recurring "Summer Break Cats" seasonal
-- event line, but each unit's own wiki page confirms they're from three
-- DIFFERENT yearly iterations of that event, not the same capsule:
--
-- - Ancient Egg: N202 (#670): its wiki page says only "obtained from the
--   Summer Break Cats event," added in Version 11.7, with no sub-event
--   qualifier at all -- the original/base iteration of the event.
-- - Tasmanian Giant Crab (#813): "obtained from the Summer Break Cats
--   Castaway Event Cat Capsule using Legend Traps," added in Version 14.5.
-- - Consultant Cat (#822): "obtained from the Summer Break Cats Paradise
--   Event Gacha," added in Version 14.6 -- one version after Castaway,
--   confirming these are sequential yearly variants, not the same set.
--
-- setName conventions:
--   #670 -> 'Summer Break Capsules' (the base/original, no sub-name -- also
--            matches this session's earlier bcu-assets bot-GachaName.txt
--            cross-check, which uses this exact phrasing for the version
--            11.7 row of this event line).
--   #813 -> 'Summer Break Survival Capsules' (Castaway's survive-on-an-
--            island theme matches this bcu-assets convention seen earlier
--            this session; it's also the only one of the two 14.x rows
--            left once Paradise is accounted for below).
--   #822 -> 'Summer Break Capsules Paradise' (matches the wiki's own
--            "Paradise" naming exactly).
UPDATE "Unit" SET "setName" = 'Summer Break Capsules', "source" = 'EVENT_CAPSULE',
  "banners" = ARRAY['Summer Break Capsules']
WHERE "unitNumber" = 670 AND "name" = 'Ancient Egg: N202' AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Summer Break Survival Capsules', "source" = 'EVENT_CAPSULE',
  "banners" = ARRAY['Summer Break Survival Capsules']
WHERE "unitNumber" = 813 AND "name" = 'Tasmanian Giant Crab' AND "setName" IS NULL;

UPDATE "Unit" SET "setName" = 'Summer Break Capsules Paradise', "source" = 'EVENT_CAPSULE',
  "banners" = ARRAY['Summer Break Capsules Paradise']
WHERE "unitNumber" = 822 AND "name" = 'Consultant Cat' AND "setName" IS NULL;
