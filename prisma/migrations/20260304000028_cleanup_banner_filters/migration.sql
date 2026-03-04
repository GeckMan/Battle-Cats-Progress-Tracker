-- Migration 28: Clean up banner filters
-- 1. Remove "Li'l Cats" from banners (not a real gacha banner)
-- 2. Rename "Crazed Cats" → "Crazed & Manic Cats" in banners

-- Step 1: Remove "Li'l Cats" from banners arrays and clear setName
UPDATE "Unit"
SET "banners" = array_remove("banners", 'Li''l Cats'),
    "setName" = NULL
WHERE 'Li''l Cats' = ANY("banners");

-- Step 2: Replace "Crazed Cats" with "Crazed & Manic Cats" in banners and setName
UPDATE "Unit"
SET "banners" = array_replace("banners", 'Crazed Cats', 'Crazed & Manic Cats'),
    "setName" = 'Crazed & Manic Cats'
WHERE 'Crazed Cats' = ANY("banners");
