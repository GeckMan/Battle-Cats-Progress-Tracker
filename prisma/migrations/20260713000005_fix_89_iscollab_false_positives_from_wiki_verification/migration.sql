-- Fixes 89 isCollab false positives, found by the first real run of the new
-- "Fetch Collab Verification Pages" GitHub Action (scripts/fetch-collab-
-- verification-pages.ts), which fetches each flagged unit's OWN Battle Cats
-- Wiki page and prints its intro paragraph(s) for direct human/AI reading --
-- replacing the manual screenshot-the-wiki-page process used earlier this
-- session. Same root cause as every other fix today: the original March
-- 2026 migrations set isCollab=true from a unit's SOURCE type (Event
-- Capsule/etc.), not from verified real-world collaboration status.
--
-- 90 units needed a wiki check this run; 89 pages fetched successfully and
-- EVERY ONE confirmed non-collab -- none of their own wiki intro text
-- mentions any real-world anime, game, movie, or brand, only in-house
-- Battle Cats version numbers and in-game event names. They fall into
-- three evidence groups:
--
--   1. Plain "Rare Cat Capsule" units (49) -- wiki text is just "added in
--      Version X.X, obtained by playing the Rare Capsule", no event name
--      or franchise mentioned at all. The most basic possible case.
--   2. Named in-house gacha events (27) -- Sengoku Wargods Vajiras, Lords
--      of Destruction Dragon Emperors, Cyber Academy Galaxy Gals, Ancient
--      Heroes Ultra Souls, The Almighties (mythological, public domain),
--      Nature's Guardians Elemental Pixies, Justice Strikes Back! Dark
--      Heroes, Tales of the Nekoluga (already an established permanent
--      gacha set, see migration ...26 from March), Frontline Assault Iron
--      Legion, Gals of Summer, Girls & Monsters: Angels of Terror (same
--      family as the already-fixed Spectral Goth Vega), The Dynamites --
--      all purely original Battle Cats lore/event names, never a real
--      external license.
--   3. Seasonal/anniversary capsules (13) -- 10th Anniversary Memorial
--      Capsules, New Moon Capsules (Lunar New Year), Love Letter Capsules
--      (Heartbeat Catcademy), June Bride of Devil Capsules, Heartbeat
--      Catcademy, Medal King's Palace (Nyanko Rangers, already established
--      non-collab), Lunar New Year, Summer Break Survival Capsules -- same
--      class of generic seasonal/anniversary event already confirmed
--      non-collab for their sibling units earlier this session.
--
-- NOTE: unit #665 (Ancient Egg: N201) shares the exact "June Bride of Devil
-- Capsules" setName already fixed for #713/#757/#863 in migration
-- ...000004, but was missed from that batch -- included here to close the
-- gap.
--
-- NOT included: ネコチーター (#673, setName "Epic Fest") -- its wiki page
-- fetch failed with "The page you specified doesn't exist", and its `name`
-- field is still literal untranslated Japanese in our database (a separate,
-- pre-existing name-localization bug, not something to guess a collab
-- verdict for). Left as isCollab=true and flagged for manual follow-up.

-- Group 1: plain "Rare Cat Capsule" pool (49 units)
UPDATE "Unit" SET "isCollab" = false
WHERE "unitNumber" IN (
  30, 31, 32, 33, 35, 36, 37, 38, 39, 40, 41, 46, 47, 48, 49, 50, 51, 52, 55, 56,
  58, 61, 129, 131, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153,
  197, 198, 199, 200, 237, 238, 239, 307, 308, 325, 376, 377, 495, 522, 523
) AND "isCollab" = true AND "setName" = 'Rare Cat Capsule';

-- Group 2: named in-house gacha events (27 units), one UPDATE per setName
UPDATE "Unit" SET "isCollab" = false
WHERE "unitNumber" IN (72, 338, 618) AND "isCollab" = true AND "setName" = 'Sengoku Wargods Vajiras';

UPDATE "Unit" SET "isCollab" = false
WHERE "unitNumber" IN (83, 87, 177) AND "isCollab" = true AND "setName" = 'Lords of Destruction Dragon Emperors';

UPDATE "Unit" SET "isCollab" = false
WHERE "unitNumber" IN (105, 107, 619) AND "isCollab" = true AND "setName" = 'Cyber Academy Galaxy Gals';

UPDATE "Unit" SET "isCollab" = false
WHERE "unitNumber" IN (136, 137, 203, 525) AND "isCollab" = true AND "setName" = 'Ancient Heroes Ultra Souls';

UPDATE "Unit" SET "isCollab" = false
WHERE "unitNumber" IN (170, 625) AND "isCollab" = true AND "setName" = 'Tales of the Nekoluga';

UPDATE "Unit" SET "isCollab" = false
WHERE "unitNumber" IN (194, 212) AND "isCollab" = true AND "setName" = 'Justice Strikes Back! Dark Heroes';

UPDATE "Unit" SET "isCollab" = false
WHERE "unitNumber" IN (257, 271, 316) AND "isCollab" = true AND "setName" = 'The Almighties';

UPDATE "Unit" SET "isCollab" = false
WHERE "unitNumber" IN (359, 401) AND "isCollab" = true AND "setName" = 'Nature''s Guardians Elemental Pixies';

UPDATE "Unit" SET "isCollab" = false
WHERE "unitNumber" IN (417) AND "isCollab" = true AND "setName" = 'Frontline Assault Iron Legion';

UPDATE "Unit" SET "isCollab" = false
WHERE "unitNumber" IN (438) AND "isCollab" = true AND "setName" = 'Gals of Summer';

UPDATE "Unit" SET "isCollab" = false
WHERE "unitNumber" IN (607) AND "isCollab" = true AND "setName" = 'Girls & Monsters: Angels of Terror';

UPDATE "Unit" SET "isCollab" = false
WHERE "unitNumber" IN (617, 668) AND "isCollab" = true AND "setName" = 'The Dynamites';

-- Group 3: seasonal/anniversary capsules (13 units)
UPDATE "Unit" SET "isCollab" = false
WHERE "unitNumber" IN (635, 689) AND "isCollab" = true AND "setName" = '10th Anniversary Memorial Capsules';

UPDATE "Unit" SET "isCollab" = false
WHERE "unitNumber" IN (646) AND "isCollab" = true AND "setName" = 'New Moon Capsules';

UPDATE "Unit" SET "isCollab" = false
WHERE "unitNumber" IN (650, 651, 652) AND "isCollab" = true AND "setName" = 'Love Letter Capsules';

UPDATE "Unit" SET "isCollab" = false
WHERE "unitNumber" IN (665) AND "isCollab" = true AND "setName" = 'June Bride of Devil Capsules';

UPDATE "Unit" SET "isCollab" = false
WHERE "unitNumber" IN (696) AND "isCollab" = true AND "setName" = 'Heartbeat Catcademy';

UPDATE "Unit" SET "isCollab" = false
WHERE "unitNumber" IN (726) AND "isCollab" = true AND "setName" = 'Medal King''s Palace';

UPDATE "Unit" SET "isCollab" = false
WHERE "unitNumber" IN (730) AND "isCollab" = true AND "setName" = 'Lunar New Year';

UPDATE "Unit" SET "isCollab" = false
WHERE "unitNumber" IN (765, 766, 767) AND "isCollab" = true AND "setName" = 'Summer Break Survival Capsules';
