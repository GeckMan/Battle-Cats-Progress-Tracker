-- Reverts a bad setName auto-assignment confirmed live via a user-provided
-- screenshot on 2026-07-16: Jagando Jr. (#622) showed up as one of only 2
-- units under the "Invasion of Poultrio" Sets filter (the other being
-- Bargain Cat, which genuinely belongs there).
--
-- Root cause: today's earlier fix classified Jagando Jr.'s obtaining method
-- ("The Aku Realms - Mount Aku Invasion") via a new INVASION_CLEAR_RE regex
-- in sync-bcdata.ts, mapping it to source=STAGE_DROP. That regex's `detail`
-- is the full raw wiki line (kept untouched for log readability), which was
-- then fed into findExistingSetNameMatch()'s word-overlap heuristic — which
-- found the word "invasion" shared with the completely unrelated real gacha
-- set "Invasion of Poultrio" and wrongly adopted it. Jagando Jr. is a
-- 100%-chance stage-clear reward from beating the Mount Aku/Mount Fuji
-- Invasion special stage, not a member of any gacha-poolable "set" at all.
--
-- Fixed at the source in the same commit as this migration:
-- classifyObtainMethodLine now tags regex-classified lines as
-- non-`matchable`, so syncSourceFromReleaseOrder() skips the setName-match
-- step entirely for STORY_CHAPTER_CLEAR/Invasion-stage units going forward.
-- A new checkStoryProgressionUnitsHaveNoSetName() coverage check also runs
-- every sync now as a backstop, in case this or a future bug reintroduces
-- a stray setName on a story/stage-progression unit.
UPDATE "Unit"
SET "setName" = NULL,
    "banners" = array_remove(COALESCE("banners", ARRAY[]::TEXT[]), 'Invasion of Poultrio')
WHERE "unitNumber" = 622
  AND "setName" = 'Invasion of Poultrio';
