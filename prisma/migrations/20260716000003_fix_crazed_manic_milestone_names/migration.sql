-- Bug report from HexagonForce (2026-07-16): several issues with the
-- Crazed Cats and Manic Cats milestone lists. Verified against the wiki
-- (the "Manic Cats" stage navbox, which lists all 9 real Manic names
-- together, plus direct confirmation from the Deathhawk, Vulcanizer,
-- Unjust War, Muscle Party, and Lots O' Lion stage pages) rather than
-- guessed from memory. See the big comment on MILESTONE_CATALOG in
-- src/lib/milestone-catalog.ts for the full writeup.
--
-- CRAZED and MANIC both correspond 1:1 to the 9 basic Normal Cats (Cat,
-- Tank, Axe, Gross, Cow, Bird, Fish, Lizard, Titan). CRAZED uses each
-- line's base name; MANIC uses each line's true-form name, which for
-- several lines differs entirely from the base name (e.g. Cat's true form
-- is "Mohawk Cat", not "Macho Cat" -- Macho is only the evolved form).
--
-- UPDATEs (not delete+recreate) are used throughout so existing users who
-- already marked a milestone complete keep that progress under its
-- corrected name, instead of silently losing it to
-- ensureMilestoneCatalog()'s exact-string-match add/remove logic.

-- ── CRAZED ───────────────────────────────────────────────────────────────
-- "The Crazed Cats" was pluralized inconsistently with every other entry
-- in the category (e.g. "The Crazed Axe Cat").
UPDATE "Milestone" SET "displayName" = 'The Crazed Cat', "sortOrder" = 1
WHERE "category" = 'CRAZED' AND "displayName" = 'The Crazed Cats';

-- "The Crazed Macho Cat" isn't a real unit -- Crazed Tank Cat (confirmed
-- via the Vulcanizer stage page: "has 1.5x more HP and damage than Crazed
-- Tank Cat") was missing entirely.
UPDATE "Milestone" SET "displayName" = 'The Crazed Tank Cat', "sortOrder" = 2
WHERE "category" = 'CRAZED' AND "displayName" = 'The Crazed Macho Cat';

-- ── MANIC ────────────────────────────────────────────────────────────────
-- "Manic Macho Cat" duplicated "Manic Mohawk Cat" (same cat, Macho is just
-- the evolved form) -- repurposed into the confirmed-missing Tank line
-- (Manic Eraser Cat, confirmed via the Vulcanizer stage page boss name).
UPDATE "Milestone" SET "displayName" = 'Manic Eraser Cat', "sortOrder" = 2
WHERE "category" = 'MANIC' AND "displayName" = 'Manic Macho Cat';

-- "Manic Axe Cat" duplicated "Manic Dark Cat" (Dark Cat is Axe's real true
-- form, confirmed via the Unjust War stage page boss name) -- repurposed
-- into the confirmed-missing Fish line (Manic Island Cat).
UPDATE "Milestone" SET "displayName" = 'Manic Island Cat', "sortOrder" = 7
WHERE "category" = 'MANIC' AND "displayName" = 'Manic Axe Cat';

-- "Manic Gross Cat" used the base-line name instead of Gross's real true
-- form (confirmed via the Muscle Party stage page: "instead of Crazed
-- Gross Cats, there are Manic Macho Legs Cats").
UPDATE "Milestone" SET "displayName" = 'Manic Macho Legs Cat', "sortOrder" = 4
WHERE "category" = 'MANIC' AND "displayName" = 'Manic Gross Cat';

-- "Manic Swimmer Cat" isn't a real unit -- per HexagonForce's own report,
-- this should become Manic Lion Cat (confirmed via the Lots O' Lion stage
-- page: "Completing this stage unlocks the True Form of Crazed Cow Cat,
-- the Manic Lion Cat").
UPDATE "Milestone" SET "displayName" = 'Manic Lion Cat', "sortOrder" = 5
WHERE "category" = 'MANIC' AND "displayName" = 'Manic Swimmer Cat';

-- "Manic Lizard Cat" and "Manic Titan Cat" used base-line names instead of
-- their real true forms (both confirmed via the wiki's Manic Cats stage
-- navbox, which lists all 9 real names together).
UPDATE "Milestone" SET "displayName" = 'Manic King Dragon Cat', "sortOrder" = 8
WHERE "category" = 'MANIC' AND "displayName" = 'Manic Lizard Cat';

UPDATE "Milestone" SET "displayName" = 'Manic Jamiera Cat', "sortOrder" = 9
WHERE "category" = 'MANIC' AND "displayName" = 'Manic Titan Cat';

-- Already-correct rows just get their sortOrder aligned to the new order.
UPDATE "Milestone" SET "sortOrder" = 1 WHERE "category" = 'MANIC' AND "displayName" = 'Manic Mohawk Cat';
UPDATE "Milestone" SET "sortOrder" = 3 WHERE "category" = 'MANIC' AND "displayName" = 'Manic Dark Cat';
UPDATE "Milestone" SET "sortOrder" = 6 WHERE "category" = 'MANIC' AND "displayName" = 'Manic Flying Cat';
