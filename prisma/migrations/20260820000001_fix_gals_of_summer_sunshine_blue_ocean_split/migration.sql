-- Corrects the "Gals of Summer Sunshine" / "Gals of Summer Blue Ocean" gacha
-- rosters after a bug report from BVG (Discord, 2026-08-20): "the list of
-- ubers in the current seasonal banner 'Gals of Summer Sunshine' is not the
-- same as on this website. Ponos has changed both 'Gals of Summer Sunshine/
-- Blue Ocean' banners recently."
--
-- Our BCData snapshot behind syncBannerMembership() (scripts/sync-bcdata.ts)
-- predates this banner refresh, and that sync path is fill-only (never
-- overwrites an existing setName), so most of these units were still sitting
-- on the old unqualified "Gals of Summer" label from before the event was
-- ever split into Sunshine/Blue Ocean (see 20260303000026), or in one case
-- (#563) on the Sunshine label from the July 2026 correction, which is now
-- stale because Ponos moved that unit to Blue Ocean in the same refresh.
--
-- Live rosters confirmed directly from the current wiki gacha-event pages
-- (battlecats.miraheze.org / battle-cats.fandom.com mirror) on 2026-08-20:
--
--   Gals of Summer Sunshine — Uber Rare: Seashore Kai (#354), Waverider Kuu
--   (#438), Seabreeze Coppermine (#494), Summerluga (#564), Coastal Explorer
--   Kanna (#714). Super Rare: Sunny Neneko (#276), Suntan Cat (#565),
--   Lifeguard Cats (#566) — shared with Blue Ocean below.
--
--   Gals of Summer Blue Ocean — Uber Rare: Tropical Kalisa (#274), Midsummer
--   Rabbit (#275), Squirtgun Saki (#563) [MOVED from Sunshine], Kaguya of the
--   Coast (#614), Night Beach Lilin (#666), Music Fest Thundia (#759). Super
--   Rare: Sunny Neneko (#276), Suntan Cat (#565), Lifeguard Cats (#566) —
--   same shared SR trio as Sunshine.
--
-- #820 (Seaside Pegasa), previously tagged unqualified "Gals of Summer", does
-- not appear on either current live banner page -- it looks like a past
-- rerun's rotated-out exclusive rather than a current-roster member, and we
-- have no "retired banner" concept to file it under, so it's deliberately
-- left untouched here rather than guessed at.

-- 1) Gals of Summer Sunshine Uber Rares
UPDATE "Unit"
SET "setName" = 'Gals of Summer Sunshine',
    "banners" = array_remove("banners", 'Gals of Summer') || ARRAY['Gals of Summer Sunshine']
WHERE "unitNumber" IN (354, 438, 494, 714)
AND NOT ('Gals of Summer Sunshine' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));

-- #564 (Summerluga) already correctly set to Sunshine in July; just make sure
-- banners[] is consistent in case it was ever touched by the older unqualified
-- migration on a re-run.
UPDATE "Unit"
SET "banners" = array_remove("banners", 'Gals of Summer') || ARRAY['Gals of Summer Sunshine']
WHERE "unitNumber" = 564
AND NOT ('Gals of Summer Sunshine' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));

-- 2) Gals of Summer Blue Ocean Uber Rares (new setName, was unqualified
--    "Gals of Summer" for all of these)
UPDATE "Unit"
SET "setName" = 'Gals of Summer Blue Ocean',
    "banners" = array_remove("banners", 'Gals of Summer') || ARRAY['Gals of Summer Blue Ocean']
WHERE "unitNumber" IN (274, 275, 614, 666, 759)
AND NOT ('Gals of Summer Blue Ocean' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));

-- 3) #563 (Squirtgun Saki) moved FROM Sunshine TO Blue Ocean in Ponos's
--    refresh -- this is the one true "changed" unit BVG's report is about,
--    not just a stale/never-corrected label like the others above.
UPDATE "Unit"
SET "setName" = 'Gals of Summer Blue Ocean',
    "banners" = array_remove(array_remove("banners", 'Gals of Summer'), 'Gals of Summer Sunshine') || ARRAY['Gals of Summer Blue Ocean']
WHERE "unitNumber" = 563;

-- 4) Shared Super Rare pool (Sunny Neneko, Suntan Cat, Lifeguard Cats) drops
--    from both banners in every rerun of this event family. #565/#566 are
--    already tagged "Gals of Summer Sunshine" from the July fix; add Blue
--    Ocean too since both currently draw from the same SR trio. #276 (Sunny
--    Neneko) was mislabeled generic "Rare Cat Capsule" and needs both tags
--    added fresh.
UPDATE "Unit"
SET "banners" = array_remove("banners", 'Gals of Summer Blue Ocean') || ARRAY['Gals of Summer Blue Ocean']
WHERE "unitNumber" IN (565, 566)
AND NOT ('Gals of Summer Blue Ocean' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));

UPDATE "Unit"
SET "setName" = 'Gals of Summer Sunshine',
    "banners" = (array_remove(array_remove(COALESCE("banners", ARRAY[]::TEXT[]), 'Gals of Summer Sunshine'), 'Gals of Summer Blue Ocean'))
                || ARRAY['Gals of Summer Sunshine', 'Gals of Summer Blue Ocean']
WHERE "unitNumber" = 276;
