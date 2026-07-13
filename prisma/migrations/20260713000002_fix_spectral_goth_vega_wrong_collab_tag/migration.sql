-- Fixes Spectral Goth Vega (#682): a "Girls & Monsters: Angels of Terror"
-- unit that a March 2026 migration (20260303000026_fix_set_names_from_gacha_data,
-- a hand-built "comprehensive" reset of every unit's setName that pre-dates
-- this project's later wiki/bcu-assets-driven approach) swept into the
-- Street Fighter Collaboration list instead -- almost certainly a copy-
-- paste/off-by-one slip, since #682 sits immediately after the two real
-- Street Fighter units (#680, #681) in that migration's hand-typed unit-ID
-- list. No later migration ever touched #682's setName again.
--
-- Confirmed wrong by THREE independent sources:
--   1. Two OTHER migrations from the same March 2026 era
--      (20260303000004_add_source_and_set and
--      20260303000025_fix_set_names_from_cat_guide) both separately list
--      #682 under Girls & Monsters, not Street Fighter.
--   2. sync-bcdata.ts's own comment on syncBannerMembership() already flags
--      "Vega vs the Street Fighter banner" as a known, previously-seen
--      mislabeling case that its conservative family-conflict detection
--      deliberately does NOT auto-resolve (logs for manual review instead).
--   3. The user's friend, playing the actual game, reported directly via
--      the app's chat (2026-07-13): "Spectral Goth Vega should be in the
--      Girls & Monsters banner, but it appears under Street Fighter Collab."
--
-- Also corrects the downstream isCollab=true false positive this caused:
-- Girls & Monsters is an original in-game event with no real-world
-- franchise tie-in (unlike Street Fighter), so the wrong "...Collaboration"
-- setName text had this unit incorrectly swept up by
-- syncCollabFlagsFromCuratedNames() (which flags isCollab=true for any unit
-- whose resolved setName/banners text matches /collab/i) -- a symptom of
-- the same root mistake, not a separate bug.
UPDATE "Unit"
SET
  "setName" = 'Girls & Monsters: Angels of Terror',
  "isCollab" = false,
  "banners" = (
    SELECT array_agg(DISTINCT b)
    FROM unnest(
      array_remove(COALESCE("banners", ARRAY[]::TEXT[]), 'Street Fighter Collaboration')
      || ARRAY['Girls & Monsters: Angels of Terror']
    ) AS b
  )
WHERE "unitNumber" = 682 AND "name" = 'Spectral Goth Vega' AND "setName" = 'Street Fighter Collaboration';
