-- Direct, ID-based fixes sourced straight from the wiki's "Cat Release
-- Order" page (2026-07-11), which lists every unit's real obtaining
-- method verbatim. Used instead of relying on BCData's debut-clustering,
-- since that data source no longer carries banner labels at all (see
-- sync-bcdata.ts) and can't resolve these on its own anymore.
--
-- #850 Fuma Kotaro (evolved: Wargod Kotaro): "Rare Cat Capsule -
-- Sengoku Wargods Vajiras" -- confirms the original Reddit report was
-- right that he's simply missing from that set, not wrongly filed
-- elsewhere. Matches the set's existing live name exactly.
--
-- #862 Hanzo the Betrothed (evolved: Hanzo the Groom): "Rare Cat Capsule
-- - June Bride" -- confirms the very first correction from this session
-- ("hanzo is under the June Bride gacha event"), now applied to the
-- correct unit number (649 was a different, unrelated character that a
-- previous migration incorrectly targeted and has since been reverted).
--
-- Both gated on setName IS NULL so this can't clobber anything.

UPDATE "Unit"
SET "setName" = 'Sengoku Wargods Vajiras',
    "banners" = (
      SELECT array_agg(DISTINCT b)
      FROM unnest(COALESCE("banners", ARRAY[]::TEXT[]) || ARRAY['Sengoku Wargods Vajiras']) AS b
    )
WHERE "unitNumber" = 850
AND "setName" IS NULL;

UPDATE "Unit"
SET "setName" = 'June Bride',
    "banners" = (
      SELECT array_agg(DISTINCT b)
      FROM unnest(COALESCE("banners", ARRAY[]::TEXT[]) || ARRAY['June Bride']) AS b
    )
WHERE "unitNumber" = 862
AND "setName" IS NULL;
