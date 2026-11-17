-- First run of the wiki-driven unit add (2026-11-17 sync) created five units
-- BCData lacked. Two corrections:
--
-- 1) #877 Hare of Inaba is an Ancient Heroes Ultra Souls gacha unit, NOT a
--    collab -- the first version of the step inferred isCollab from "another
--    unit in this set is flagged", which was wrong (fixed in wiki-unit-sync.ts).
-- 2) #866 PAC-MAN, #867 Blinky Cat, #868 Inky Cat: the wiki's PAC-MAN
--    Collaboration Event page says "INT: TBA" / "English Version: ?" -- the event
--    hasn't run in EN even though the units are in the EN game files, so they
--    must not show in the app yet. Hide them (excludeFromCollection). The sync's
--    hideUnreleasedEventUnits() keeps them hidden until the wiki shows an EN
--    date; syncUnits() resets the flag each run, so they unhide on their own.
UPDATE "Unit" SET "isCollab" = false WHERE "unitNumber" = 877;
UPDATE "Unit" SET "excludeFromCollection" = true WHERE "unitNumber" IN (866, 867, 868);
