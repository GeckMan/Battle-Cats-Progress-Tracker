-- Adds Unit.excludeFromCollection: true = not a real collectible cat, so it
-- should never appear in the Unit Collection view, never count toward
-- "total units"/"units obtained" percentages anywhere in the app, and never
-- appear in the Sets/Sources filter dropdowns.
--
-- Immediate use case (reported by the user's friend 2026-07-13, via the
-- app's in-game chat): the 21 Arena of Honor "Spirit of X" fusion-material
-- tokens (dojo-rank rewards used to power up a specific Uber Rare -- see
-- UNIT_NAME_OVERRIDES in scripts/sync-bcdata.ts) used to be invisible in the
-- app entirely, but only as an accidental SIDE EFFECT: BCData's own source
-- data has raw placeholder text (e.g. "730_1") as their name field, and
-- src/app/api/units/route.ts's PLACEHOLDER_RE filter happened to strip
-- anything that looked like that out of the collection view. Migration
-- 20260712000010 gave these units real display names (fixing a real,
-- separate bug -- the app's search couldn't find them at all under their
-- placeholder names), which incidentally made them pass the placeholder
-- filter and start appearing as ordinary standalone units, inflating the
-- Legend Rare category list and the account-wide "total units" count. The
-- friend confirmed this was a regression, not a fix: "They were not in the
-- list before and I think it was correct. This skews the total number of
-- units."
--
-- Rather than relying on an accidental regex side effect again, this adds
-- an explicit, purpose-built flag so the exclusion is intentional and
-- durable regardless of what these units happen to be named.
ALTER TABLE "Unit" ADD COLUMN "excludeFromCollection" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "Unit_excludeFromCollection_idx" ON "Unit"("excludeFromCollection");

UPDATE "Unit" SET "excludeFromCollection" = true WHERE "unitNumber" IN (
  729, 732, 734, 739, 755, 761, 764, 770, 775, 782,
  800, 802, 812, 816, 818, 821, 825, 838, 839, 855, 860
);
