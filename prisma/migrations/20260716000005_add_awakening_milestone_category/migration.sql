-- New Milestones category, requested by HexagonForce (2026-07-16): track
-- the harder "Awakening" tier of Advent boss stages (Clionel Dominant,
-- River Acheron, Queen's Condemnation, Dead by Encore, King Wahwah's
-- Return, A Deeper Dream), distinct from the existing ADVENT category's
-- Standard Tier 1/2 and Great Advent stages. The actual catalog rows are
-- inserted by ensureMilestoneCatalog() from MILESTONE_CATALOG in
-- src/lib/milestone-catalog.ts (called on every page load), so this
-- migration only needs to add the new enum value itself.
ALTER TYPE "MilestoneCategory" ADD VALUE 'AWAKENING';
