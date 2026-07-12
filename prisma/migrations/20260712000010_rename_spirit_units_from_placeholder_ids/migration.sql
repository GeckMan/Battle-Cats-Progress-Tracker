-- Fixes 21 units stuck with a garbled placeholder name (e.g. "730_1",
-- "771-1") instead of a real display name -- confirmed NOT a bug in this
-- project's own syncUnits() parsing: BCData's Unit_Explanation*_en.csv
-- files literally contain that placeholder text as the name field itself
-- for these unit IDs (see the "First field (pipe-delimited) = name"
-- comment in sync-bcdata.ts's syncUnits()). These are Arena of Honor
-- "Spirit" fusion-material tokens tied to a specific Uber Rare (used to
-- power them up via dojo ranking rewards) that apparently never got a
-- real in-game localized name from BCData's source, so there's no future
-- weekly sync that would ever self-correct this on its own.
--
-- The user searched the app for "spirit" after I mentioned these as
-- "Spirit of X" units (from the Cat Release Order audit's Obtaining
-- method text) and found nothing -- because the stored name really is
-- the placeholder, not "Spirit of X". The wiki's Obtaining method column
-- is the only human-readable identifier available for any of these, and
-- was already independently captured for all 21 by the 2026-07-12 "Audit
-- Obtain Methods" workflow run, so it's used directly here as the real
-- display name.
--
-- Guarded by a regex on the CURRENT name (rather than each unit's exact
-- historical placeholder text) so this only ever touches a row that's
-- still sitting on that raw numeric-ID pattern -- if a future BCData sync
-- ever supplies a real name for one of these first, this migration
-- becomes a no-op for that row instead of clobbering it.
UPDATE "Unit" SET "name" = 'Spirit of Master of Mind Soractes' WHERE "unitNumber" = 729 AND "name" ~ '^[0-9]+[-_]1$';
UPDATE "Unit" SET "name" = 'Spirit of Daybreaker Izanagi' WHERE "unitNumber" = 732 AND "name" ~ '^[0-9]+[-_]1$';
UPDATE "Unit" SET "name" = 'Spirit of Pegasa' WHERE "unitNumber" = 734 AND "name" ~ '^[0-9]+[-_]1$';
UPDATE "Unit" SET "name" = 'Spirit of Izanami of Dusk' WHERE "unitNumber" = 739 AND "name" ~ '^[0-9]+[-_]1$';
UPDATE "Unit" SET "name" = 'Spirit of Akechi Mitsuhide' WHERE "unitNumber" = 755 AND "name" ~ '^[0-9]+[-_]1$';
UPDATE "Unit" SET "name" = 'Spirit of Gunduros' WHERE "unitNumber" = 761 AND "name" ~ '^[0-9]+[-_]1$';
UPDATE "Unit" SET "name" = 'Spirit of Dynasaurus Cat' WHERE "unitNumber" = 764 AND "name" ~ '^[0-9]+[-_]1$';
UPDATE "Unit" SET "name" = 'Spirit of Hanasaka Cat' WHERE "unitNumber" = 770 AND "name" ~ '^[0-9]+[-_]1$';
UPDATE "Unit" SET "name" = 'Spirit of Mech Patrol Axel' WHERE "unitNumber" = 775 AND "name" ~ '^[0-9]+[-_]1$';
UPDATE "Unit" SET "name" = 'Spirit of Mamoluga' WHERE "unitNumber" = 782 AND "name" ~ '^[0-9]+[-_]1$';
UPDATE "Unit" SET "name" = 'Spirit of Mighty Morta-Loncha' WHERE "unitNumber" = 800 AND "name" ~ '^[0-9]+[-_]1$';
UPDATE "Unit" SET "name" = 'Spirit of Master of Logic Newtone' WHERE "unitNumber" = 802 AND "name" ~ '^[0-9]+[-_]1$';
UPDATE "Unit" SET "name" = 'Spirit of Victorious Skanda' WHERE "unitNumber" = 812 AND "name" ~ '^[0-9]+[-_]1$';
UPDATE "Unit" SET "name" = 'Spirit of Moonshade Kaworu' WHERE "unitNumber" = 816 AND "name" ~ '^[0-9]+[-_]1$';
UPDATE "Unit" SET "name" = 'Spirit of Komori' WHERE "unitNumber" = 818 AND "name" ~ '^[0-9]+[-_]1$';
UPDATE "Unit" SET "name" = 'Spirit of Seaside Pegasa' WHERE "unitNumber" = 821 AND "name" ~ '^[0-9]+[-_]1$';
UPDATE "Unit" SET "name" = 'Spirit of Sorceress Sidmi' WHERE "unitNumber" = 825 AND "name" ~ '^[0-9]+[-_]1$';
UPDATE "Unit" SET "name" = 'Spirit of Squire Luno' WHERE "unitNumber" = 838 AND "name" ~ '^[0-9]+[-_]1$';
UPDATE "Unit" SET "name" = 'Spirit of Lunos the Luminous' WHERE "unitNumber" = 839 AND "name" ~ '^[0-9]+[-_]1$';
UPDATE "Unit" SET "name" = 'Spirit of Master of Selection Darvin' WHERE "unitNumber" = 855 AND "name" ~ '^[0-9]+[-_]1$';
UPDATE "Unit" SET "name" = 'Spirit of Lone Moon Lunos' WHERE "unitNumber" = 860 AND "name" ~ '^[0-9]+[-_]1$';
