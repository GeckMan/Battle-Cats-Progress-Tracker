-- Ryan flagged (2026-09-28, live site screenshot) that "Koneko Takes the
-- Stage" -- added by this week's sync as a new Zero Legends subchapter
-- (sortOrder 35) -- is not actually a real Legend Stage.
--
-- Root cause: the forward-scan for new ZL entries walks Map_Name.csv from
-- the last known ZL index to end-of-file, treating anything that isn't a
-- recognized SoL/UL/ZL name and doesn't match the isNonLegendName() filter
-- as a new ZL subchapter. "Koneko Takes the Stage" sits at idx 1289, a
-- 41-entry gap after the last genuinely-new ZL entry ("Yandere Chemistry"
-- at idx 1247) -- and has no parentheses/VS/Rank/Ch. marker to trip any
-- existing filter, so it read as a plain title-case name indistinguishable
-- from a real one. It's likely some other kind of Map_Name.csv row (e.g. a
-- one-off Catnip Challenge/introductory stage tied to Metal Maiden
-- Koneko's Version 15.6 debut) rather than a Legend Stage.
--
-- scripts/sync-bcdata.ts now excludes this exact name going forward (see
-- NON_LEGEND_EXACT); this migration removes the row this run already
-- wrote. onDelete: Cascade on UserLegendProgress.subchapter handles any
-- per-user progress rows tied to it automatically.
DELETE FROM "LegendSubchapter"
WHERE "displayName" = 'Koneko Takes the Stage'
AND "sagaId" IN (SELECT "id" FROM "LegendSaga" WHERE "displayName" = 'Zero Legends');
