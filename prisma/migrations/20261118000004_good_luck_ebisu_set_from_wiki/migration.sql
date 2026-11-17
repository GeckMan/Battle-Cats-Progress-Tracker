-- Full-site pass (2026-11-17, live site-data snapshot vs wiki mirror):
-- #520 Good-Luck Ebisu's home set was "Seasonal Capsules" (a one-unit label).
-- The wiki agrees in two places that he comes from Best of the Best / NEO Best of
-- the Best: the Cat Release Order ("Rare Cat Capsule - Best of the Best & NEO Best
-- of the Best") and his own page. He already carries both of those banner tags.
UPDATE "Unit"
SET "setName" = 'Best of the Best',
    "banners" = (SELECT array_agg(DISTINCT b) FROM unnest(array_remove("banners", 'Seasonal Capsules') || ARRAY['Best of the Best']) AS b)
WHERE "unitNumber" = 520 AND "setName" = 'Seasonal Capsules';
