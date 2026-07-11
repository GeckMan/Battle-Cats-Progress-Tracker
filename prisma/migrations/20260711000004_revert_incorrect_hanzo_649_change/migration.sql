-- Reverts 20260711000003_fix_hanzo_june_bride, which was a mistake.
--
-- That migration assumed unit 649 (Hattori Hanzo / Wargod Hanzo / Immortal
-- Hanzo) was the "Hanzo the Betrothed" unit referenced in the original bug
-- report, based on the shared name alone -- without confirming the actual
-- unit number. A follow-up screenshot showed the real "Hanzo the
-- Betrothed" is unit #862, an entirely separate character (base/evolved
-- forms only: "Hanzo the Betrothed" / "Hanzo the Groom", no relation to
-- unit 649's Sengoku/samurai-themed forms). There is no actual evidence
-- unit 649's original setName was ever wrong -- Hattori Hanzo is a real
-- historical ninja and a plausible genuine member of the Sengoku-themed
-- "Sengoku Wargods Vajiras" set. Restoring the original value.

UPDATE "Unit"
SET "setName" = 'Sengoku Wargods Vajiras',
    "banners" = (
      SELECT array_agg(DISTINCT b)
      FROM unnest(array_remove("banners", 'June Bride') || ARRAY['Sengoku Wargods Vajiras']) AS b
    )
WHERE "unitNumber" = 649;
