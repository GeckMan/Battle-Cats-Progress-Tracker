-- Adds 4 new Milestones categories, requested by Ryan (2026-07-16) after
-- uploading wiki pages for "Li'l Cat's Trial" and "Super Smash Families"
-- and asking whether all the major "one-time-clear special stage set"
-- milestones (the same genre as the existing CRAZED/MANIC/ADVENT/
-- AWAKENING/CATCLAW categories) were covered. Research against the
-- wiki's own category pages found 4 real, structurally-identical stage
-- sets that were missing entirely:
--
-- LIL_STAGES: 9 stages (one per basic Normal Cat line), each rewarding
-- the True Form of the corresponding Li'l Cat -- the exact same
-- structure as CRAZED, just for the "Li'l" roster instead.
--
-- LIL_TRIAL: 4 stages ("Path to +45/+50/+55/+60"), unlocked after
-- clearing all 9 LIL_STAGES, each raising the Li'l Cat unit + caps by 5
-- levels -- this is the set from the user's uploaded "Li'l Cat's Trial"
-- wiki PDF.
--
-- MALEVOLENT: 9 stages (one per basic Normal Cat line again), unlocked
-- after clearing Mount Aku/Mount Fuji in The Aku Realms, each rewarding
-- the True Form of the corresponding Brainwashed unit -- the "evil"
-- structural counterpart to CRAZED.
--
-- SUPER_SMASH: 2 stages ("Treacherous Road (Brutal)", "Heinous Road
-- (Brutal)"), unlocked after clearing all 9 MALEVOLENT stages -- the
-- wiki describes this explicitly as "the Malevolent equivalent of Clan
-- of the Maniacs" (i.e. the MANIC category's structural counterpart).
-- This is the set from the user's uploaded "Super Smash Families" wiki
-- PDF.
--
-- The actual catalog rows are inserted by ensureMilestoneCatalog() from
-- MILESTONE_CATALOG in src/lib/milestone-catalog.ts (called on every
-- page load), so this migration only needs to add the new enum values.
ALTER TYPE "MilestoneCategory" ADD VALUE 'LIL_STAGES';
ALTER TYPE "MilestoneCategory" ADD VALUE 'LIL_TRIAL';
ALTER TYPE "MilestoneCategory" ADD VALUE 'MALEVOLENT';
ALTER TYPE "MilestoneCategory" ADD VALUE 'SUPER_SMASH';
