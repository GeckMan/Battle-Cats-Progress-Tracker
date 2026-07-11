-- Remove the "Cyclone/Advent Drops" set tag entirely, per user request
-- (2026-07-11): it only ever covered 5 units and was reported as
-- incomplete/inconsistent (only showing Super Rares) on Reddit. Rather
-- than try to reconstruct the full correct roster for this niche
-- stage-drop mechanic (not represented in BCData at all), just drop the
-- grouping so it stops appearing as a confusing/incomplete filter option.
-- Does not touch `source` or any other classification for these units.

UPDATE "Unit" SET "setName" = NULL
WHERE "setName" = 'Cyclone/Advent Drops';

UPDATE "Unit" SET "banners" = array_remove("banners", 'Cyclone/Advent Drops')
WHERE 'Cyclone/Advent Drops' = ANY("banners");
