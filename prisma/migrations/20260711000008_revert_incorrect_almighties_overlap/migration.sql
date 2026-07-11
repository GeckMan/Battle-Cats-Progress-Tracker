-- Reverts migration 20260711000007_almighties_uberfest_overlap, which was a
-- mistake: it added a 'The Almighties' banners[] entry to 12 Uber Fest units
-- (257, 258, 259, 271, 272, 316, 439, 493, 534, 642, 723, 811), based on the
-- incorrect assumption that an old migration comment implied dual banner
-- membership that got silently dropped.
--
-- On closer inspection of the actual migration history:
--   - 20260303000026 deliberately defined "The Almighties" as a separate,
--     disjoint 5-unit set (466, 731, 738, 830, 837 — Black Zeus, Daybreaker
--     Izanagi, Izanami of Dusk, Raclesa the Lioness, Squire Luno), verified
--     from real banner row data, explicitly as a "Corrected version" that
--     superseded an earlier, less reliable cat-guide-sourced classification
--     that HAD included these 12 units under "Almighties" in error.
--   - 20260304000027, which built the banners[] multi-membership system,
--     explicitly says: "No additional units needed since UBERFEST exclusives
--     already get it from setName in Step 1" -- i.e. the overlap was
--     considered and deliberately rejected at the time, not lost by accident.
--
-- So the 12 Uber Fest units never belonged under Almighties; removing the
-- incorrectly-added tag. Real "Almighties" membership (the 5 units above,
-- via setName) is untouched.

UPDATE "Unit"
SET "banners" = array_remove("banners", 'The Almighties')
WHERE "unitNumber" IN (257, 258, 259, 271, 272, 316, 439, 493, 534, 642, 723, 811);
