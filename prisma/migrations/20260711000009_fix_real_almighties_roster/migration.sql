-- Corrects "The Almighties" classification, which turned out to be wrong in
-- BOTH directions after 20260303000026:
--
-- 1) The 12 units below ARE the real "The Almighties" gacha-event exclusives
--    (wiki page: "The Almighties: The Majestic Zeus (Gacha Event)"), confirmed
--    beyond doubt because their own THIRD form names (see
--    20260303000022_add_form_names) are literally "Almighty Zeus", "Almighty
--    Anubis", "Almighty Amaterasu", "Almighty Ganesha", "Almighty Poseidon",
--    "Almighty Hades", "Almighty Lucifer", "Almighty Aset" -- every base/
--    evolved name pair also matches the wiki page's roster exactly (Thunder
--    God Zeus/The Majestic Zeus, Anubis the Protector/Unblemished, Radiant
--    Aphrodite/Megaphrodite, Shining/Glorious Amaterasu, Splendid/Exalted
--    Ganesha, Wrathful/Valiant Poseidon, Empress Chronos/Chronos the
--    Infinite, Hades the Punisher/Deathdealer, Lucifer the Fallen/Grand
--    Lucifer, Lightmother/Nefer Aset, Victorious/Zeta Skanda, Gaia the
--    Creator/Supreme). 20260303000026 had reclassified this whole group to
--    plain 'Uber Fest' (per its "Gigant Zeus pool" comment, since they're
--    also currently drawn from that evergreen capsule) -- restoring their
--    true home as setName, keeping 'Uber Fest' as a secondary banners[] tag
--    since that additional membership is real, matching the existing
--    dual-banner pattern used elsewhere (e.g. unit 642 already getting a
--    'Best of the Best' banner addition in 20260304000027).
UPDATE "Unit"
SET "setName" = 'The Almighties',
    "banners" = (
      SELECT array_agg(DISTINCT b)
      FROM unnest(COALESCE("banners", ARRAY[]::TEXT[]) || ARRAY['The Almighties']) AS b
    )
WHERE "unitNumber" IN (257, 258, 259, 271, 272, 316, 439, 493, 534, 642, 723, 811);

-- 2) Conversely, a single OTHER statement in 20260303000026 had invented a
--    bogus second "Almighties" bucket for 5 completely unrelated units, none
--    of which appear anywhere on the real Almighties wiki page and whose own
--    evolved-form names (Dark Lord Zeus, Dawnbringer Izanagi, Izanami of
--    Eventide, Raclesa Sigma, Lunos the Luminous) have nothing "Almighty"
--    about them. Two were independently confirmed wrong directly from their
--    own Battle Cats Wiki pages: Black Zeus is obtained from the Bikkuriman
--    Collaboration Event, and Raclesa from the Cyber Academy Galaxy Gals
--    event -- both exactly matching their classification from BEFORE
--    20260303000026 (in 20260303000004 and/or 20260303000025). Restoring all
--    5 units from that same erroneous statement to their last known-good,
--    evidence-backed classification (731 Daybreaker Izanagi and 837 Squire
--    Luno match 20260303000004's UBERFEST list; 738 Izanami of Dusk matches
--    both 20260303000004 and 20260303000025's EPICFEST list).
UPDATE "Unit"
SET "setName" = 'Bikkuriman Collaboration',
    "banners" = array_remove("banners", 'The Almighties') || ARRAY['Bikkuriman Collaboration']
WHERE "unitNumber" = 466
AND NOT ('Bikkuriman Collaboration' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));

UPDATE "Unit"
SET "setName" = 'Cyber Academy Galaxy Gals',
    "banners" = array_remove("banners", 'The Almighties') || ARRAY['Cyber Academy Galaxy Gals']
WHERE "unitNumber" = 830
AND NOT ('Cyber Academy Galaxy Gals' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));

UPDATE "Unit"
SET "setName" = 'Uber Fest',
    "banners" = array_remove("banners", 'The Almighties') || ARRAY['Uber Fest']
WHERE "unitNumber" IN (731, 837)
AND NOT ('Uber Fest' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));

UPDATE "Unit"
SET "setName" = 'Epic Fest',
    "banners" = array_remove("banners", 'The Almighties') || ARRAY['Epic Fest']
WHERE "unitNumber" = 738
AND NOT ('Epic Fest' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));
