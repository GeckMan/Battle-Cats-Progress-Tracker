-- Superfeline (#643) confirmed 2026-07-14 directly from its own wiki page
-- (user-provided screenshot): "Superfeline is the 10th Normal Cat... It can
-- be unlocked by playing the Cat Capsule+ after completing Cats of the
-- Cosmos Chapter 3." The Cat Release Order table's own Method column for
-- this unit only says "Cat Capsule - Cat Capsule+" -- it never mentions
-- the Chapter 3 gate at all, which is exactly why syncSourceFromRelease
-- Order() couldn't resolve it automatically (no single prefix match, and
-- the individual-page fallback added in the same commit only LOGS the
-- intro paragraph for a human to read, it doesn't auto-write from it).
--
-- The real gate is "clear a specific story chapter" -- the same mechanic
-- STORY_CHAPTER_CLEAR was just added for (Cat God the Great, Filibuster
-- Cat X) -- Superfeline just delivers the unit via a capsule roll after
-- that gate instead of as an instant stage-clear reward. Since the
-- gate is the actionable "how do I get this" information a player needs,
-- and this project already treats STORY_CHAPTER_CLEAR as "unlocked via a
-- specific story chapter" rather than narrowly "instant reward only",
-- this reuses it here too rather than inventing a third bespoke category
-- for a single unit.
UPDATE "Unit"
SET "source" = 'STORY_CHAPTER_CLEAR'
WHERE "unitNumber" = 643
  AND "source" IS NULL;
