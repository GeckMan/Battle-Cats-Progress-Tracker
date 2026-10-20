-- Reverts the RoyalFest half of 20261020000001 and all of 20261020000003.
-- Those added "RoyalFest" to every Gals of Summer Uber Rare (incl. Jungle
-- Gourmet Tomoe #872) and to Hanzo the Betrothed (#862), on the assumption
-- (from shroomp's chat report and this project's old migration comment
-- "all seasonal ubers") that RoyalFest contains every seasonal Uber.
--
-- Ryan then supplied the wiki's actual RoyalFest page (printed 2026-10-20):
-- it says RoyalFest features "a random selection of Uber Rares" and lists a
-- specific lineup -- of the Gals of Summer units only Coastal Explorer
-- Kanna (#714) appears; Tomoe and Hanzo do not. The wiki shows only the
-- current lineup, so older reruns can't be checked from it, but nothing
-- supports adding the tag to units we have no evidence were ever in it.
--
-- Restores the pre-2026-10-20 state: removes RoyalFest from Gals of Summer
-- units and #862/#872 EXCEPT units in the original static list seeded by
-- 20260304000027 (which includes Gals of Summer's #275, #494, #563, #564,
-- #666, #714 -- left untouched).
--
-- (The Super Fest removal in 20261020000001 stays: Gals of Summer isn't on
-- the Superfest page's closed allowlist, verified earlier from its PDF.)
UPDATE "Unit"
SET "banners" = array_remove("banners", 'RoyalFest')
WHERE ("setName" ILIKE 'Gals of Summer%' OR "unitNumber" IN (862, 872))
  AND 'RoyalFest' = ANY("banners")
  AND "unitNumber" NOT IN (
    228, 229, 230, 241, 242, 243, 274, 275, 276, 302, 310, 314, 330, 331, 332,
    354, 438, 494, 526, 563, 564, 565, 566, 570, 584, 586, 587, 588, 589, 595,
    614, 644, 648, 661, 666, 683, 687, 693, 699, 711, 714, 736, 737, 756, 759,
    772, 773, 777, 786, 820
  );
