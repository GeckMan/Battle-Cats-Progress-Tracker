-- bvg_tbc reported (Discord, 2026-09-29): "the game has 127 medals, but
-- this site shows 128 with Newton medal twice."
--
-- MeowMedal.name has a DB-level UNIQUE constraint, so this can't be a
-- byte-for-byte exact duplicate -- it's two rows whose names are similar
-- enough to clearly be the same real medal but differ by more than the
-- star-glyph/whitespace consolidateDuplicateMedals() already normalizes
-- away (see that function's big comment in scripts/sync-bcdata.ts). The
-- likely culprit: the enemy this medal is awarded for is inconsistently
-- spelled "Newton" vs "Newtone" across sources (confirmed real -- unit
-- #802's own name override is literally "Spirit of Master of Logic
-- Newtone"; the Battle Cats Wiki has separate pages for "Sage of Logic
-- Newton" and "Sage of Logic Newtone"), and BCData's medalname.tsv vs the
-- legacy Miraheze-scraped import apparently disagree on it the same way.
--
-- Rather than guess the exact two strings from here (no live DB access in
-- this sandbox to check), this merges generically: any MeowMedal rows
-- whose name contains "newton" (case-insensitive) are the same real medal,
-- keeping whichever row has an autoKey (hand-curated, hard to reconstruct)
-- or failing that an imageFile, migrating any earned progress across, and
-- deleting the rest -- the exact same preference order
-- consolidateDuplicateMedals() already uses for its glyph/whitespace case.
DO $$
DECLARE
  keeper_id TEXT;
  dupe RECORD;
BEGIN
  SELECT id INTO keeper_id
  FROM "MeowMedal"
  WHERE "name" ILIKE '%newton%'
  ORDER BY
    ("autoKey" IS NOT NULL) DESC,
    ("imageFile" IS NOT NULL) DESC,
    "id" ASC
  LIMIT 1;

  IF keeper_id IS NULL THEN
    RETURN;
  END IF;

  FOR dupe IN
    SELECT id FROM "MeowMedal" WHERE "name" ILIKE '%newton%' AND id != keeper_id
  LOOP
    -- Carry over earned progress so nobody loses a medal they'd already earned.
    UPDATE "UserMeowMedal" AS target
    SET "earned" = true,
        "earnedAt" = COALESCE(target."earnedAt", src."earnedAt")
    FROM "UserMeowMedal" AS src
    WHERE src."meowMedalId" = dupe.id
      AND src."earned" = true
      AND target."userId" = src."userId"
      AND target."meowMedalId" = keeper_id;

    INSERT INTO "UserMeowMedal" ("id", "userId", "meowMedalId", "earned", "earnedAt", "updatedAt")
    SELECT gen_random_uuid()::text, src."userId", keeper_id, src."earned", src."earnedAt", now()
    FROM "UserMeowMedal" AS src
    WHERE src."meowMedalId" = dupe.id
      AND src."earned" = true
      AND NOT EXISTS (
        SELECT 1 FROM "UserMeowMedal" t
        WHERE t."userId" = src."userId" AND t."meowMedalId" = keeper_id
      );

    DELETE FROM "UserMeowMedal" WHERE "meowMedalId" = dupe.id;
    DELETE FROM "MeowMedal" WHERE id = dupe.id;
  END LOOP;
END $$;
