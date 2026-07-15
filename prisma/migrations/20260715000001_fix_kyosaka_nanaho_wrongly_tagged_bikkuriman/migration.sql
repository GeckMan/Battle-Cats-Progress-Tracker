-- Bug report from bvg_tbc (2026-07-15): "Legend Rare Kyosaka Nanaho appears
-- in the Bikkuriman Collab" in the Sets filter. Confirmed via WebSearch
-- (direct web_fetch to the wiki page and its MediaWiki API endpoint both
-- returned empty this time): Kyosaka Nanaho (#544, Legend Rare, added
-- Version 9.5) is unlockable via a very-low-chance Rare Capsule pull during
-- the "Girls & Monsters: Angels of Terror" event. That event is an in-house
-- PONOS crossover with their own now-discontinued game "Kyoutou Project" --
-- not a real external collaboration, and has no connection to Bikkuriman
-- whatsoever.
--
-- "Girls & Monsters: Angels of Terror" is already an established,
-- correctly-recognized non-collab setName elsewhere in this codebase (see
-- GACHA_EVENT_NAMES in scripts/sync-bcdata.ts and migration
-- 20260713000002_fix_spectral_goth_vega_wrong_collab_tag's comment: "an
-- original in-game event with no real-world tie-in").
--
-- Root cause traced through migration history: the ORIGINAL migration
-- 20260303000004_add_source_and_set correctly set unit 544's setName to
-- 'Girls & Monsters: Angels of Terror' (source='RARE_CAPSULE', which is
-- still correct and untouched by this migration). But a later wholesale
-- re-derivation migration, 20260303000026_fix_set_names_from_gacha_data,
-- wiped every setName and re-derived them from gacha banner-row data --
-- correctly re-assigning "Girls & Monsters: Angels of Terror" to units 334,
-- 335, 336, 357, 358, 607, 725, 824, but conspicuously omitting 544 from
-- that list, then separately (and wrongly) folding 544 into the Bikkuriman
-- Collaboration group instead. My own migration 20260713000007
-- (unify_fragmented_collab_setnames), which fixed a real but unrelated
-- fragmentation bug, inadvertently further entrenched this pre-existing
-- error by renaming 544's already-wrong "Bikkuriman Collaboration" label to
-- the canonical "Bikkuriman Chocolate Capsules" alongside the 11 units that
-- genuinely do belong to that set.
--
-- Note: "Bikkuriman Chocolate Capsules" is listed in
-- BCU_KNOWN_COLLAB_CATEGORIES (scripts/sync-bcdata.ts), which is exactly why
-- no automated coverage check ever flagged this unit as a false positive --
-- that list exists specifically to recognize genuine collab names that
-- don't contain the word "collab", so it never looked twice at 544 once its
-- setName matched. Fixing the setName below removes it from that bucket
-- entirely; isCollab=false means it will no longer appear in the
-- isCollab:true query that feeds checkExistingCollabFlagsAgainstEvidence()
-- either, so no code change to MANUALLY_VERIFIED_NOT_COLLAB is needed.
UPDATE "Unit"
SET "setName" = 'Girls & Monsters: Angels of Terror',
    "isCollab" = false,
    "banners" = (
      SELECT array_agg(DISTINCT b)
      FROM unnest(
        array_remove(
          array_remove(COALESCE("banners", ARRAY[]::TEXT[]), 'Bikkuriman Collaboration'),
          'Bikkuriman Chocolate Capsules'
        )
        || ARRAY['Girls & Monsters: Angels of Terror']
      ) AS b
    )
WHERE "unitNumber" = 544
  AND "setName" IN ('Bikkuriman Collaboration', 'Bikkuriman Chocolate Capsules');
