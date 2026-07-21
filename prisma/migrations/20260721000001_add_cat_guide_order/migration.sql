-- Adds Unit.catGuideOrder, the real in-game "Cat Guide" screen's display
-- position, scraped from the wiki's Cat_Guide page (see
-- scripts/sync-bcdata.ts's syncCatGuideOrder()). Kept separate from the
-- existing `sortOrder` column (release/ID order within rarity, computed
-- locally) rather than replacing it -- a user pointed out the two orders
-- genuinely differ and BCData's own CSVs have no column that reproduces
-- the in-game order (see scripts/audit-cat-guide-order.ts, a prior dead
-- end). Nullable: any unit the wiki's Cat Guide template doesn't cover yet
-- (e.g. a brand-new unit) simply has no value until a later sync fills it
-- in, and the Units page falls back to `sortOrder` for those.
ALTER TABLE "Unit" ADD COLUMN "catGuideOrder" INTEGER;

CREATE INDEX "Unit_catGuideOrder_idx" ON "Unit"("catGuideOrder");
