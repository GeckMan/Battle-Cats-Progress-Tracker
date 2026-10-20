-- shroomp reported in site chat (2026-10-17): "Jungle Gourmet Tomoe appear
-- in the Super Fest incorrectly" and "Royal Fest supposed to include all
-- seasonal cats but I can't find Jungle Gourmet Tomoe in there."
--
-- Both are stale/missing banner tags, not a wrong setName:
--
-- 1. Super Fest: scripts/sync-bcdata.ts's syncSetMembershipBanner() tags
--    every unit whose setName is in SUPERFEST_INCLUDED_SETNAMES, which
--    includes "Cyber Academy Galaxy Gals". Tomoe (#872) carried that
--    generic setName until migration 20260901000001 moved her to "Gals of
--    Summer Blue Ocean", but the sync only ever ADDS the tag, so the old
--    "Super Fest" entry stayed. Gals of Summer is not on the Superfest
--    allowlist (wiki's closed list of 10 Uber sets), so strip it from every
--    unit currently in a "Gals of Summer*" set.
--
-- 2. RoyalFest: the wiki's RoyalFest page includes every seasonal Uber, but
--    this project only ever seeded that banner from a static unit-number
--    list (20260304000027, ends at #820) and nothing has maintained it
--    since -- so the seasonal Ubers released after that, including every
--    unit of the current Gals of Summer Sunshine/Blue Ocean reruns that
--    isn't in the old list, are missing. Add it to every Uber Rare in a
--    "Gals of Summer*" set. Other seasonal sets released after #820 likely
--    have the same gap; the sync now logs those for review
--    (checkSeasonalFestMembership) rather than guessing here.
UPDATE "Unit"
SET "banners" = array_remove("banners", 'Super Fest')
WHERE "setName" ILIKE 'Gals of Summer%'
  AND 'Super Fest' = ANY("banners");

UPDATE "Unit"
SET "banners" = "banners" || ARRAY['RoyalFest']
WHERE "setName" ILIKE 'Gals of Summer%'
  AND "category" = 'UBER_RARE'
  AND NOT ('RoyalFest' = ANY("banners"));

-- Tomoe specifically (#872): her setName could be stale in some states, so
-- guarantee both fixes directly on her row as well.
UPDATE "Unit"
SET "banners" = array_remove("banners", 'Super Fest')
WHERE "unitNumber" = 872 AND 'Super Fest' = ANY("banners");

UPDATE "Unit"
SET "banners" = "banners" || ARRAY['RoyalFest']
WHERE "unitNumber" = 872 AND NOT ('RoyalFest' = ANY("banners"));
