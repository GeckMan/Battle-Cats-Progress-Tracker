-- Split seasonal event capsule units out from EVENT_CAPSULE (collab)
-- These are in-game seasonal events like Summer Break Cats, Medal King's Palace, etc.
UPDATE "Unit" SET "source" = 'SEASONAL_EVENT'
WHERE "unitNumber" IN (
  184, 202, 209, 210, 211, 245, 246, 247, 248, 311, 312, 313,
  342, 375, 381, 615, 616, 635, 646, 650, 651, 652, 665, 670,
  689, 696, 713, 726, 730, 757, 765, 766, 767, 813, 822, 831
);
