-- Fixes 4 of the 8 "possible mislabeling" conflicts surfaced by
-- syncEventSets()'s diagnostic (now unit-level, see sync-bcdata.ts commit
-- "diag: surface unit numbers in gacha set naming conflict log"). Full
-- conflict list from that log, for context on why only 4 of 8 are touched
-- here:
--
--   1. "Rare Cat Capsule" (31 units, e.g. Delinquent Cat #31, Bath Cat #40,
--      ...) vs "Tales of the Nekoluga" (Nekoluga #34 only) -- NOT fixed
--      here. A 31-vs-1 split like this is a debut-clustering artifact, not
--      a data error: those 31 are genuinely the base Special Cat capsule
--      roster, and Nekoluga's own existing "Tales of the Nekoluga" setName
--      (a real, well-known gacha set) is independently correct -- it just
--      got swept into the same detected "family" as those 31 by
--      incidentally co-occurring with them in one historical banner row.
--      Changing either existing value here would make things WORSE, not
--      better -- left as expected, harmless log noise.
--   2. "Rare Cat Capsule" (Rover Cat #376, Fencer Cat #377) vs "Fate/Stay
--      Night Collaboration" (10 units, Lancer #366, Saber #362, etc.) --
--      NOT fixed, same reasoning as #1 (10-vs-2 split, the 2 are plain
--      filler units that happened to share the Fate collab's debut row).
--   3. "Seasonal Capsules" (Lifeguard Cats #566, Suntan Cat #565) vs "Gals
--      of Summer" (Squirtgun Saki #563, Summerluga #564) -- NOT fixed. An
--      even 2-vs-2 split with no independent evidence (no wiki page
--      checked yet) pointing either way -- genuinely ambiguous, left for a
--      future pass once that evidence exists.
--   8. "Seasonal Capsules" (Mummy Sumo #773) vs "Halloween Capsules"
--      (Pumpkin Sodom #772) -- NOT fixed, same reasoning as #3.
--
--   4-7. The four "Brainwashed Cats" vs a specific seasonal name conflicts
--        ARE fixed below. Confirmed via the Battle Cats Wiki's own
--        Category:Brainwashed_Cats page and the individual "Brainwashed
--        Titan Cat" page (user-supplied, 2026-07-12): Brainwashed Cats
--        aren't a single real gacha banner at all -- they're a pool of 9
--        base units where only 3 are featured in any given historical
--        appearance of a Seasonal Gacha Event, rotating every rerun,
--        spread across Xmas Gals, White Day Capsules, Gals of Summer,
--        Miracle 4 Selection, and others. Storing "Brainwashed Cats" as a
--        setName was a modeling mistake from an old pre-BCData-automation
--        migration (20260303000025 or 20260303000026) that conflated the
--        character's theme/type with which banner it's actually sold in.
--        Each of the 4 units below shares its ACTUAL historical debut row
--        with exactly one other, already-correctly-named unit -- direct
--        evidence (not a guess) that this specific rerun's real identity is
--        that seasonal event, exactly matching the wiki's "3 selected per
--        event" mechanic:
--          - Brainwashed Cow Cat (#662) debuted alongside Chronos the
--            Bride (#661, setName "June Bride")
--          - Brainwashed Bird Cat (#667) debuted alongside Night Beach
--            Lilin (#666, setName "Gals of Summer")
--          - Brainwashed Fish Cat (#684) debuted alongside Count Yukimura
--            (#683, setName "Halloween Capsules")
--          - Brainwashed Lizard Cat (#688) debuted alongside Reindeer
--            Terun (#687, setName "Xmas Gals")
--        "Brainwashed Cats" isn't a real selectable gacha banner (there's
--        no such distinct pull you can make in-game), so it's removed from
--        banners[] rather than kept as a secondary tag -- unlike the
--        Almighties/Uber Fest dual-tag case, this isn't a real second
--        membership, it was never accurate to begin with.
UPDATE "Unit"
SET "setName" = 'June Bride',
    "banners" = array_remove("banners", 'Brainwashed Cats') || ARRAY['June Bride']
WHERE "unitNumber" = 662
AND NOT ('June Bride' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));

UPDATE "Unit"
SET "setName" = 'Gals of Summer',
    "banners" = array_remove("banners", 'Brainwashed Cats') || ARRAY['Gals of Summer']
WHERE "unitNumber" = 667
AND NOT ('Gals of Summer' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));

UPDATE "Unit"
SET "setName" = 'Halloween Capsules',
    "banners" = array_remove("banners", 'Brainwashed Cats') || ARRAY['Halloween Capsules']
WHERE "unitNumber" = 684
AND NOT ('Halloween Capsules' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));

UPDATE "Unit"
SET "setName" = 'Xmas Gals',
    "banners" = array_remove("banners", 'Brainwashed Cats') || ARRAY['Xmas Gals']
WHERE "unitNumber" = 688
AND NOT ('Xmas Gals' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));
