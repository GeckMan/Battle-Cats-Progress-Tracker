-- Fixes the last remaining "possible mislabeling" conflict from the
-- 2026-07-12 unit-level conflict log: "Seasonal Capsules": Mummy Sumo
-- (#773) vs "Halloween Capsules": Pumpkin Sodom (#772).
--
-- Confirmed directly via the user-supplied "Halloween Capsules (Gacha
-- Event) - The Battle Cats Wiki" PDF: both Pumpkin Sodom (Uber Super Rare)
-- and Mummy Sumo (Super Rare) are listed in this exact gacha's roster.
-- Pumpkin Sodom's existing "Halloween Capsules" setName was already
-- correct; Mummy Sumo just needed the same real name instead of the
-- generic "Seasonal Capsules" placeholder it shared its actual BCData
-- debut row with him under.
UPDATE "Unit"
SET "setName" = 'Halloween Capsules',
    "banners" = array_remove("banners", 'Seasonal Capsules') || ARRAY['Halloween Capsules']
WHERE "unitNumber" = 773
AND NOT ('Halloween Capsules' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));
