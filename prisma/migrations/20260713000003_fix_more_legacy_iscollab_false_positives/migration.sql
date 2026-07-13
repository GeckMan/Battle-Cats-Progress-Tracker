-- Fixes more isCollab false positives inherited from three flawed March
-- 2026 migrations that predate this project's wiki/bcu-assets-driven
-- approach, root-caused 2026-07-13 after the user's screenshot of the
-- "Collabs" Sets filter showed dozens of clearly non-collab units (the
-- entire "Li'l Cats" permanent set, several Summer Break Cats units, etc.)
-- mixed in with real ones:
--
--   1. 20260303000002_add_iscollab hardcoded 82 unit IDs as isCollab=true
--      based on the unit's SOURCE type ("Event Capsule, Serial Code,
--      Campaign, External App"), not on whether it's an actual real-world
--      franchise collaboration. Plenty of units obtained via those same
--      generic mechanisms are original in-game content with no licensed
--      IP behind them at all.
--   2. 20260303000007_readd_serial_as_unobtainable ran
--      `UPDATE "Unit" SET "isCollab" = true WHERE "source" = 'UNOBTAINABLE'`
--      unconditionally -- "hard to get" was conflated with "collab."
--   3. 20260303000008_merge_campaign_into_event_capsule ran
--      `UPDATE "Unit" SET ... "isCollab" = true WHERE "source" = 'CAMPAIGN'`
--      on the stated (false) premise that "all [CAMPAIGN units] are
--      collab/limited units."
--
-- This migration only touches units this project has ALREADY gathered
-- direct evidence for within this session -- it does not attempt to
-- guess at the many other still-unreviewed units the Collabs filter
-- surfaced (Kerihime, Shakurel Cat/Lion/Tiger/Panda, Golden Kabuto Cat,
-- and dozens more) -- those need the systematic "Audit Obtain Methods"
-- workflow run, not another one-by-one guess.
--
-- Li'l Cats (21 units): an original, permanent in-game gacha set (see
-- migration 20260303000026_fix_set_names_from_gacha_data's own
-- "Special/Drop Units" grouping for it, separate from that same
-- migration's "Collaboration Events" section) -- no real-world franchise
-- tie-in of any kind.
UPDATE "Unit" SET "isCollab" = false
WHERE "unitNumber" IN (63, 70, 74, 79, 80, 81, 100, 104, 109, 122, 128, 132, 176, 183, 227, 244, 282, 303, 329, 343, 501)
  AND "isCollab" = true;

-- Ancient Egg: N202 (#670), Tasmanian Giant Crab (#813), Consultant Cat
-- (#822): confirmed via each unit's own wiki page this session (migration
-- 20260712000013) to be plain seasonal "Summer Break Cats" capsule units
-- with no franchise tie-in -- setName/source were fixed at the time but
-- isCollab was overlooked, leaving it stuck at the original migration's
-- wrong value.
UPDATE "Unit" SET "isCollab" = false
WHERE "unitNumber" IN (670, 813, 822) AND "isCollab" = true;

-- Scarf Cat (#831): confirmed this session (migration 20260712000008) to
-- be its own distinct "Nyanko Rangers" serial-code merch line, unrelated
-- to any real franchise -- same oversight as above, isCollab was never
-- revisited when setName was filled.
UPDATE "Unit" SET "isCollab" = false
WHERE "unitNumber" = 831 AND "isCollab" = true;
