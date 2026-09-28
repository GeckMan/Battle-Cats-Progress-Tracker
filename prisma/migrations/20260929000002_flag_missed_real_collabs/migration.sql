-- mingq reported via Discord (2026-09-14) that ticking "Hide Collab" on
-- the Units page still shows a batch of real-world tie-in collab units.
-- Investigating the screenshot: 4 of the 14 units shown (Cat Chief,
-- Barrel Cat, Farmboy Cat, Cat Egg Pod) are NOT collabs at all -- they're
-- Ancient Egg reward units from repeat Behemoth Culling clears, correctly
-- not flagged -- but the other 10 are genuine real-world collaborations
-- that had simply never been classified, because every one of them is a
-- small one-off tie-in obtained outside any gacha banner (serial code /
-- external app), which is structurally invisible to the gacha-banner-
-- history-based auto-detector (documented in CLAUDE.md's Collab
-- classification section) and had never been manually added to the
-- confirmed-collab list either:
--
--   Neo Mushroom Garden: Funghi (#277), Tanky (#278), White Cat (#279),
--     Fortressy (#280)
--   Mentori: Mentori (#399), Imoto (#400)
--   Pikotaro: PIKOTARO (#315), CPAC (#317)
--   LINE Pokopang!: Pokota (#419), Ovis (#420), Coco (#421)
--   Betakkuma: Betakkuma (#432), Nekokkuma (#433)
--   Godzilla: Godzilla Cat (#611)
--   World Trigger: Osamu Mikumo & Cat (#677), Yuma Kuga & Cat (#678),
--     Chika Amatori & Cat (#679) -- this last one wasn't in mingq's
--     screenshot but is the same franchise's third unit, so included for
--     consistency.
--
-- All confirmed via the Battle Cats Wiki's own "Collaboration Cats (BCJP
-- only)"/general collab navbox groupings (same source used throughout
-- this project's other collab-classification fixes). setName follows the
-- existing "<Franchise> Collaboration" convention used for every other
-- real collab in this table (Bikkuriman Collaboration, Demon Slayer
-- Collaboration, etc). Source is intentionally left untouched -- it's a
-- separate, unconfirmed question (most likely SERIAL_CODE or
-- EXTERNAL_APP for units like these, but that needs its own wiki
-- confirmation per unit, same conservative bar as everywhere else in this
-- project) and isn't what "Hide Collab" filters on anyway.
UPDATE "Unit" SET "isCollab" = true, "setName" = 'Neo Mushroom Garden Collaboration'
WHERE "unitNumber" IN (277, 278, 279, 280) AND "isCollab" = false;

UPDATE "Unit" SET "isCollab" = true, "setName" = 'Mentori Collaboration'
WHERE "unitNumber" IN (399, 400) AND "isCollab" = false;

UPDATE "Unit" SET "isCollab" = true, "setName" = 'Pikotaro Collaboration'
WHERE "unitNumber" IN (315, 317) AND "isCollab" = false;

UPDATE "Unit" SET "isCollab" = true, "setName" = 'LINE Pokopang! Collaboration'
WHERE "unitNumber" IN (419, 420, 421) AND "isCollab" = false;

UPDATE "Unit" SET "isCollab" = true, "setName" = 'Betakkuma Collaboration'
WHERE "unitNumber" IN (432, 433) AND "isCollab" = false;

UPDATE "Unit" SET "isCollab" = true, "setName" = 'Godzilla Collaboration'
WHERE "unitNumber" IN (611) AND "isCollab" = false;

UPDATE "Unit" SET "isCollab" = true, "setName" = 'World Trigger Collaboration'
WHERE "unitNumber" IN (677, 678, 679) AND "isCollab" = false;

-- Add each unit number to MANUALLY_VERIFIED-style tracking isn't needed
-- here since these were never false-flagged by the gacha-banner detector
-- in the first place (that's a different list, for suppressing false
-- positives) -- this migration IS the manual confirmation.
