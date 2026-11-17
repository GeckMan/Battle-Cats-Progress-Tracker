-- First check of the live site data (site-data snapshot, 2026-11-17) against the
-- wiki's Cat Release Order "Obtaining method" column: 699 of 734 matched units
-- agree. These four are plain errors (collab units defaulted to EVENT_CAPSULE):
--   #848 Tanjiro Cat   "Drop - Demon Slayer Corps Final Selection"           -> STAGE_DROP
--   #849 Nezuko Cat    "Stamp Reward - Demon Slayer: Kimetsu no Yaiba Collab" -> STAMP_REWARD
--   #864 Shirou Emiya  "Rare Cat Capsule - Fate/Stay Night: Heaven's Feel"   -> RARE_CAPSULE
--   #865 True Assassin "Rare Cat Capsule - Fate/Stay Night: Heaven's Feel"   -> RARE_CAPSULE
-- Guarded on the current value so a later hand-fix is never overwritten.
UPDATE "Unit" SET "source" = 'STAGE_DROP'   WHERE "unitNumber" = 848 AND "source" = 'EVENT_CAPSULE';
UPDATE "Unit" SET "source" = 'STAMP_REWARD' WHERE "unitNumber" = 849 AND "source" = 'EVENT_CAPSULE';
UPDATE "Unit" SET "source" = 'RARE_CAPSULE' WHERE "unitNumber" IN (864, 865) AND "source" = 'EVENT_CAPSULE';
