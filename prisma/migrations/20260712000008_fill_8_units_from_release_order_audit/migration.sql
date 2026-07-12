-- Fills 8 units flagged by the new "Audit Obtain Methods" workflow
-- (scripts/audit-obtain-methods.ts) as having no source/setName at all,
-- each with exactly one unambiguous "Obtaining method" line on the Battle
-- Cats Wiki's Cat Release Order page. None of these are collabs -- just
-- ordinary gaps in classification (regular gacha fests, stage drops, and
-- event capsules).
--
-- Two of the eight (EPICFEST, DRAGON EMPERORS) are re-cased to match this
-- project's own existing BCU_CATEGORY_ALIAS convention (sync-bcdata.ts)
-- rather than the wiki's all-caps franchise styling, so they group with
-- whatever their sibling capsule units already use as setName instead of
-- creating a second, differently-cased entry for the same real set:
--   "EPICFEST" -> "Epic Fest" (matches BCU_CATEGORY_ALIAS["Epicfest"])
--   "Lords of Destruction DRAGON EMPERORS" -> "Lords of Destruction Dragon
--     Emperors" (matches BCU_CATEGORY_ALIAS["Dragon Emperors"])
-- The other six had no existing alias precedent to check against, so the
-- wiki's own phrasing is used as-is.
UPDATE "Unit" SET "source" = 'EVENT_CAPSULE', "setName" = 'Nyanko Rangers',
  "banners" = ARRAY['Nyanko Rangers']
WHERE "unitNumber" = 831 AND "source" IS NULL AND "setName" IS NULL;

UPDATE "Unit" SET "source" = 'STAGE_DROP', "setName" = 'Invasion of Poultrio',
  "banners" = ARRAY['Invasion of Poultrio']
WHERE "unitNumber" = 851 AND "source" IS NULL AND "setName" IS NULL;

UPDATE "Unit" SET "source" = 'STAGE_DROP', "setName" = 'Horde of Cats',
  "banners" = ARRAY['Horde of Cats']
WHERE "unitNumber" = 852 AND "source" IS NULL AND "setName" IS NULL;

UPDATE "Unit" SET "source" = 'EVENT_CAPSULE', "setName" = 'Heartbeat Catcademy',
  "banners" = ARRAY['Heartbeat Catcademy']
WHERE "unitNumber" = 853 AND "source" IS NULL AND "setName" IS NULL;

UPDATE "Unit" SET "source" = 'STAGE_DROP', "setName" = 'Endless Forms Most Beautiful',
  "banners" = ARRAY['Endless Forms Most Beautiful']
WHERE "unitNumber" = 854 AND "source" IS NULL AND "setName" IS NULL;

UPDATE "Unit" SET "source" = 'RARE_CAPSULE', "setName" = 'Epic Fest',
  "banners" = ARRAY['Epic Fest']
WHERE "unitNumber" = 859 AND "source" IS NULL AND "setName" IS NULL;

UPDATE "Unit" SET "source" = 'RARE_CAPSULE', "setName" = 'Lords of Destruction Dragon Emperors',
  "banners" = ARRAY['Lords of Destruction Dragon Emperors']
WHERE "unitNumber" = 861 AND "source" IS NULL AND "setName" IS NULL;

UPDATE "Unit" SET "source" = 'EVENT_CAPSULE', "setName" = 'June Bride of the Devil',
  "banners" = ARRAY['June Bride of the Devil']
WHERE "unitNumber" = 863 AND "source" IS NULL AND "setName" IS NULL;
