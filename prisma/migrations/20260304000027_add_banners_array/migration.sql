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

-- Step 4: Add UBERFEST membership for all ubers available in UBERFEST (row 1007)
-- This includes all permanent set ubers + UBERFEST exclusives
UPDATE "Unit" SET "banners" = "banners" || ARRAY['UBERFEST']
WHERE "unitNumber" IN (
  -- Permanent set ubers available in UBERFEST
  34, 42, 43, 44, 57, 59, 71, 72, 73, 75, 76, 83, 84, 85, 86, 87,
  105, 106, 107, 124, 125, 134, 135, 136, 137, 138, 143, 158, 159,
  168, 169, 170, 171, 177, 194, 195, 196, 203, 212, 226, 240, 257, 258, 259, 261,
  -- Fest exclusives + newer permanent set ubers
  269, 271, 272, 304, 305, 306, 316, 318, 322, 338, 351, 355, 359, 360, 361,
  380, 396, 401, 417, 427, 431, 436, 439, 448, 449, 450, 451, 455, 461, 463, 478,
  496, 502, 505, 519, 525, 529, 533, 534, 546, 569, 585, 594, 617, 618, 619, 620,
  625, 631, 632, 633, 634, 641, 642, 647, 649, 655, 660, 668, 674, 690, 692, 698,
  712, 715, 719, 723, 733, 754, 760, 769, 774, 779, 781, 799, 811, 817
)
AND NOT ('UBERFEST' = ANY("banners"));

-- Step 5: Add EPICFEST membership for all ubers available in EPICFEST (row 1008)
UPDATE "Unit" SET "banners" = "banners" || ARRAY['EPICFEST']
WHERE "unitNumber" IN (
  34, 42, 43, 44, 57, 59, 71, 72, 73, 75, 76, 83, 84, 85, 86, 87,
  105, 106, 107, 124, 125, 134, 135, 136, 137, 138, 143, 158, 159,
  168, 169, 170, 171, 177, 194, 195, 196, 203, 212, 226, 240, 257, 258, 259, 261,
  272, 271, 304, 305, 306, 316, 322, 333, 338, 351, 355, 359, 360, 361,
  378, 396, 401, 417, 427, 431, 436, 439, 441, 448, 449, 450, 451, 455, 461, 463, 478,
  496, 502, 505, 519, 525, 533, 534, 543, 546, 569, 594, 609, 617, 618, 619, 620,
  625, 631, 632, 633, 634, 642, 647, 649, 655, 657, 660, 668, 674, 692, 698, 705,
  712, 715, 719, 723, 733, 738, 754, 760, 769, 774, 781, 787, 799, 811, 817
)
AND NOT ('EPICFEST' = ANY("banners"));

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
