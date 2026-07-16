-- Bug report from HexagonForce (2026-07-16): several real gacha/event sets
-- (Dragon Emperors, Pixies, Superfest, NEO Best of the Best, Dark Heroes,
-- and others) don't show up at all in the Units page's Sets filter.
--
-- Root cause: the Sets dropdown is populated from
-- `SELECT DISTINCT unnest("banners") FROM "Unit" ...` (src/app/api/units/
-- route.ts), but three of this project's biggest historical migrations --
-- 20260303000004_add_source_and_set, 20260303000025_fix_set_names_from_cat_
-- guide, and 20260303000026_fix_set_names_from_gacha_data -- set hundreds
-- of units' `setName` column directly via one-off UPDATEs and never once
-- touched the separate `banners` array column (confirmed by grepping every
-- migration for `SET "setName"` without a matching `"banners"` reference).
-- Any unit whose set was assigned this way has always shown the correct
-- set name on its own card, but is completely invisible to the Sets
-- filter, since that filter only ever reads from `banners`.
--
-- This is a general, one-time backfill rather than a narrow patch for just
-- the handful of set names HexagonForce happened to notice: it adds every
-- unit's current `setName` into its `banners` array wherever it's missing,
-- for every unit in the table, regardless of collab status. Going forward,
-- syncEventSets()/the various setName-assigning helpers in sync-bcdata.ts
-- already write to `banners` at the same time as `setName` for anything
-- touched by the normal weekly sync, so this gap should only affect units
-- last modified by the three older migrations above.
UPDATE "Unit"
SET "banners" = array_append(COALESCE("banners", ARRAY[]::TEXT[]), "setName")
WHERE "setName" IS NOT NULL
  AND NOT ("setName" = ANY(COALESCE("banners", ARRAY[]::TEXT[])));
