-- 1) Restores 'Brainwashed Cats' to banners[] for the 4 units corrected in
--    20260712000002_fix_brainwashed_cats_real_seasonal_events. That
--    migration removed it on the assumption it wasn't a real distinct
--    banner worth filtering by -- user feedback (2026-07-12) was that
--    players may still want to check how many Brainwashed Cats they've
--    unlocked as a collection, so it's worth keeping as a secondary tag
--    even though setName correctly points at the real specific seasonal
--    event (June Bride / Gals of Summer Sunshine / Halloween Capsules /
--    Xmas Gals respectively -- see below for the Gals of Summer Sunshine
--    correction). This mirrors the existing dual-banner pattern used
--    elsewhere (e.g. unit 642's 'Best of the Best' addition, or the
--    Almighties/Uber Fest case before it was disproven) -- setName is the
--    unit's one true "home" event, banners[] is every real, worthwhile-to-
--    filter-by pool it's ever offered from.
UPDATE "Unit"
SET "banners" = array_remove("banners", 'Brainwashed Cats') || ARRAY['Brainwashed Cats']
WHERE "unitNumber" IN (662, 667, 684, 688)
AND NOT ('Brainwashed Cats' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));

-- 2) Corrects the "Gals of Summer" vs "Seasonal Capsules" conflict (item #3
--    from the 2026-07-12 unit-level conflict log) using wiki evidence the
--    user supplied: "Gals of Summer (Removed Gacha Event)" confirms the
--    original event was split into "Gals of Summer Sunshine" and "Gals of
--    Summer Blue Ocean" in Version 13.5. The "Gals of Summer Sunshine" page
--    explicitly lists (highlighted as exclusive additions) Suntan Cat and
--    Lifeguard Cats in its Super Rare roster -- direct confirmation these
--    2 units (previously mislabeled "Seasonal Capsules", a generic
--    placeholder) really belong to the Sunshine variant specifically, not
--    a vague catch-all.
--
--    Squirtgun Saki and Summerluga (previously "Gals of Summer", the
--    retired parent name) are also updated to the more precise "Gals of
--    Summer Sunshine" -- they're confirmed via the original removed-event
--    page to be persistent Uber Rares reused across every rerun of this
--    family of events, and per BCData's own historical banner data they
--    share their ACTUAL debut row directly with Suntan Cat and Lifeguard
--    Cats, meaning that specific historical appearance is itself a
--    Sunshine-branded rerun, not the pre-split original. "Gals of Summer"
--    (unqualified) wasn't wrong, just less precise than what's now
--    directly confirmed.
--
--    Caveat for a future reviewer: Gals of Summer Blue Ocean's own unit
--    list could only be partially read (a cookie-consent banner baked into
--    the source PDF obscured the tail end of its Super Rare roster), so
--    this couldn't be triple-checked against Blue Ocean's exclusions the
--    same way it was against Sunshine's. Confidence is still high given
--    the direct textual match on Sunshine's page combined with the real
--    debut co-occurrence, but flagging the gap in evidence for completeness.
UPDATE "Unit"
SET "setName" = 'Gals of Summer Sunshine',
    "banners" = array_remove("banners", 'Gals of Summer') || ARRAY['Gals of Summer Sunshine']
WHERE "unitNumber" IN (563, 564)
AND NOT ('Gals of Summer Sunshine' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));

UPDATE "Unit"
SET "setName" = 'Gals of Summer Sunshine',
    "banners" = array_remove("banners", 'Seasonal Capsules') || ARRAY['Gals of Summer Sunshine']
WHERE "unitNumber" IN (565, 566)
AND NOT ('Gals of Summer Sunshine' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));
