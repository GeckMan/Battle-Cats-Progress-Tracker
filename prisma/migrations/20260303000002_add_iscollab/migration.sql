-- Add isCollab flag to Unit table
ALTER TABLE "Unit" ADD COLUMN "isCollab" BOOLEAN NOT NULL DEFAULT false;

-- Mark 82 collab units (Event Capsule, Serial Code, Campaign, External App sources)
UPDATE "Unit" SET "isCollab" = true
WHERE "unitNumber" IN (28, 29, 45, 53, 62, 82, 101, 102, 133, 140, 141, 142, 157, 162, 163, 164, 165, 166, 178, 182, 184, 192, 193, 204, 205, 206, 207, 208, 209, 210, 211, 245, 246, 247, 248, 262, 263, 264, 265, 266, 311, 312, 313, 342, 375, 381, 453, 454, 474, 475, 476, 477, 504, 557, 615, 616, 626, 627, 628, 635, 646, 650, 651, 652, 665, 670, 689, 696, 713, 726, 730, 757, 765, 766, 767, 796, 797, 798, 813, 822, 831, 849);
