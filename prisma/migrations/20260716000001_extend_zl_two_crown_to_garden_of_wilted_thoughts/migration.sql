-- Bug report from bvg_tbc (2026-07-16): "in the list of Zero Legends stages
-- 2* should be available up to Garden of Wilted Thoughts, but here it ends
-- on New World Area." Confirmed against the wiki (individual subchapter
-- page checks): Cats of a Common Sea, Truth in Extremes, Demon of Deciliter
-- Bay, and Garden of Wilted Thoughts (Zero Legends sub-chapters 6-9) are all
-- now listed as "Available up to 2♛ difficulty", while sub-chapter 10,
-- Stratospheric Pathway, is still 1♛ only -- confirming Garden of Wilted
-- Thoughts is exactly where the 2-crown range currently ends, matching
-- bvg_tbc's report precisely.
--
-- scripts/sync-bcdata.ts's ZL_TWO_CROWN_NAMES set had never been updated
-- past its original 5-name list (Zero Field through New World Area: Ehen)
-- since PONOS keeps raising this ceiling over time and nothing was re-
-- checking it. This migration corrects the CURRENT database state; the
-- same commit also adds fetchZlCrownMap() to scrape the wiki's own
-- "Available up to N♛ difficulty" note per sub-chapter going forward, so
-- this doesn't silently drift out of date again.
UPDATE "LegendSubchapter"
SET "maxCrowns" = 2
WHERE "displayName" IN ('Cats of a Common Sea', 'Truth in Extremes', 'Demon of Deciliter Bay', 'Garden of Wilted Thoughts')
  AND "sagaId" = (SELECT "id" FROM "LegendSaga" WHERE "displayName" = 'Zero Legends')
  AND "maxCrowns" < 2;
