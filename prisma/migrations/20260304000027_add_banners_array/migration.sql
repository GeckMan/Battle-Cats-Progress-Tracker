-- Add banners array column for multi-banner filtering
-- Units can appear in multiple banners (e.g., a Dynamites uber also appears in Air Busters and UBERFEST)

ALTER TABLE "Unit" ADD COLUMN "banners" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Step 1: Initialize banners from setName (home set)
UPDATE "Unit" SET "banners" = ARRAY["setName"] WHERE "setName" IS NOT NULL;

-- Step 2: Clean up Rare Cat Capsule — remove non-gacha units
-- Only keep units that actually appear in the gacha shared pool (verified from GatyaDataSetR1.csv)
-- Remove setName from units not in any gacha pool
UPDATE "Unit" SET "setName" = NULL, "banners" = ARRAY[]::TEXT[]
WHERE "setName" = 'Rare Cat Capsule'
AND "unitNumber" NOT IN (
  -- Verified shared pool rares from permanent banner rows
  30, 31, 32, 33, 35, 36, 37, 38, 39, 40, 41, 46, 47, 48, 49, 50, 51, 52, 55, 56, 58, 61,
  -- Verified shared pool super rares
  129, 131, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153,
  197, 198, 199, 200,
  237, 238, 239,
  307, 308, 325,
  376, 377,
  495, 522, 523
);

-- Step 3: Add Buster banner memberships (from combined Busters Festival row 940)
-- Air Busters: anti-floating uber rares
UPDATE "Unit" SET "banners" = "banners" || ARRAY['Air Busters']
WHERE "unitNumber" IN (59, 75, 83, 84, 106, 107, 135, 143, 196, 286)
AND NOT ('Air Busters' = ANY("banners"));

-- Wave Busters: anti-wave uber rares
UPDATE "Unit" SET "banners" = "banners" || ARRAY['Wave Busters']
WHERE "unitNumber" IN (43, 72, 194, 240, 258, 436, 519, 559)
AND NOT ('Wave Busters' = ANY("banners"));

-- Red Busters: anti-red uber rares
UPDATE "Unit" SET "banners" = "banners" || ARRAY['Red Busters']
WHERE "unitNumber" IN (42, 76, 86, 87, 105, 124, 136, 212, 283, 305, 533, 620)
AND NOT ('Red Busters' = ANY("banners"));

-- Metal Busters: anti-metal uber rares
UPDATE "Unit" SET "banners" = "banners" || ARRAY['Metal Busters']
WHERE "unitNumber" IN (57, 138, 170, 261, 316, 358, 397, 715)
AND NOT ('Metal Busters' = ANY("banners"));

-- Colossus Busters: anti-colossus uber rares
UPDATE "Unit" SET "banners" = "banners" || ARRAY['Colossus Busters']
WHERE "unitNumber" IN (647, 649, 655, 660, 668, 674, 682, 686)
AND NOT ('Colossus Busters' = ANY("banners"));

-- Step 4: Add UBERFEST banner — exclusives only (units whose home set IS UBERFEST already have it;
-- this adds it for the "both-fest" exclusives from Gigant Zeus pool that have setName='UBERFEST')
-- No additional units needed since UBERFEST exclusives already get it from setName in Step 1.

-- Step 5: Add EPICFEST banner — exclusives only (same logic)
-- No additional units needed since EPICFEST exclusives already get it from setName in Step 1.

-- Step 6: Add Best of the Best membership for ubers featured in selection festivals (rows 976-977)
UPDATE "Unit" SET "banners" = "banners" || ARRAY['Best of the Best']
WHERE "unitNumber" IN (
  34, 43, 76, 87, 125, 143, 159, 168, 272, 334, 336, 359, 396, 435, 441,
  484, 496, 520, 569, 633, 642, 674, 692, 698, 715, 758, 774, 783, 810
)
AND NOT ('Best of the Best' = ANY("banners"));

-- Step 7: Add RoyalFest membership for all seasonal ubers (row 1013)
UPDATE "Unit" SET "banners" = "banners" || ARRAY['RoyalFest']
WHERE "unitNumber" IN (
  228, 229, 230, 241, 242, 243, 274, 275, 276, 302, 310, 314, 330, 331, 332,
  354, 438, 494, 526, 563, 564, 565, 566, 570, 584, 586, 587, 588, 589, 595,
  614, 644, 648, 661, 666, 683, 687, 693, 699, 711, 714, 736, 737, 756, 759,
  772, 773, 777, 786, 820
)
AND NOT ('RoyalFest' = ANY("banners"));

-- Step 8: Add GIN index for efficient array queries
CREATE INDEX "Unit_banners_idx" ON "Unit" USING GIN ("banners");
