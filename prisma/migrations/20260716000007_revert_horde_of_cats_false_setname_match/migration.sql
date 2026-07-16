-- Reverts a second confirmed instance of the same word-overlap
-- false-match bug that hit Jagando Jr. (#622, see migration
-- 20260716000006). Confirmed live via the GitHub Actions sync log from
-- 2026-07-16 (logs_79921648695.zip), whose new
-- checkStoryProgressionUnitsHaveNoSetName() coverage check flagged:
--
--   Cat God the Great (#437): source=STORY_CHAPTER_CLEAR, setName="Horde of Cats"
--   Filibuster Cat X (#462): source=STORY_CHAPTER_CLEAR, setName="Horde of Cats"
--
-- Both units are unlocked by clearing a specific story chapter (Cats of
-- the Cosmos Chapter 2 and a later chapter respectively) via
-- STORY_CHAPTER_CLEAR_RE, added 2026-07-14 — predating today's
-- `matchable` gate fix. Their obtain-method wiki lines shared the
-- generic word "cats" with the unrelated real gacha set "Horde of Cats",
-- which findExistingSetNameMatch()'s word-overlap heuristic wrongly
-- adopted as a setName. Neither unit is actually part of any gacha-
-- poolable "Horde of Cats" set — this is a instant story-progression
-- reward, not a set membership.
--
-- Already fixed at the source in the same commit as this migration:
-- classifyObtainMethodLine tags STORY_CHAPTER_CLEAR_RE-classified lines
-- as non-`matchable`, so syncSourceFromReleaseOrder() has skipped the
-- setName-match step for these units since 2026-07-16's earlier commit.
-- This migration just cleans up the two units that got the bad value
-- written before that fix landed. checkStoryProgressionUnitsHaveNoSetName()
-- is now narrowed to only check STORY_CHAPTER_CLEAR (not STAGE_DROP, which
-- produced 37 unrelated false positives for legitimate collab bonus-drop
-- units) so it stays a precise backstop going forward.
UPDATE "Unit"
SET "setName" = NULL,
    "banners" = array_remove(COALESCE("banners", ARRAY[]::TEXT[]), 'Horde of Cats')
WHERE "unitNumber" IN (437, 462)
  AND "setName" = 'Horde of Cats';
