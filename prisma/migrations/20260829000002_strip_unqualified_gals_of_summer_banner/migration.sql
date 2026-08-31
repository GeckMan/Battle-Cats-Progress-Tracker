-- Ryan spotted (2026-08-29, screenshot of the Units page Sets dropdown) a
-- third, unqualified "Gals of Summer" entry still selectable alongside
-- "Gals of Summer Sunshine" and "Gals of Summer Blue Ocean" -- showing 2
-- units: Sunny Neneko (#276, displayed by its evolved name "Seaside
-- Neneko") and Brainwashed Bird Cat (#667).
--
-- The previous two fixes (20260820000001, 20260829000001) only ever
-- touched setName plus re-adding the two QUALIFIED banner strings; neither
-- one stripped the literal unqualified 'Gals of Summer' string that had
-- separately accumulated in banners[] for these two units:
--
--   #667 (Brainwashed Bird Cat): the July 2026 migration
--   (20260712000002_fix_brainwashed_cats_real_seasonal_events) explicitly
--   set both setName AND banners to the unqualified 'Gals of Summer',
--   mirroring its debut-row sibling Night Beach Lilin's setName AT THE
--   TIME -- before the Sunshine/Blue Ocean split fix existed. Once Night
--   Beach Lilin got corrected to Blue Ocean later, #667 was never
--   revisited. Directly confirmed via the current live wiki page: Brainwashed
--   Bird Cat is explicitly listed in Gals of Summer SUNSHINE's Rare-tier
--   drop pool (not Blue Ocean's, which lists Gross/Lizard/Titan instead).
--
--   #276 (Sunny Neneko): never touched by any migration for this event at
--   all -- its unqualified 'Gals of Summer' banner tag was added at some
--   point by the live weekly sync's syncBannerMembership(), which reads
--   BCData's raw historical gacha CSV rows and can tag a persistent
--   shared-pool unit like this from an OLD, pre-split rerun's row in
--   addition to whatever the current qualified tags are. Not visible in
--   migration history since that's runtime sync logic, not a SQL
--   migration -- but the effect (a stale unqualified tag sitting alongside
--   the correct qualified ones) is the same as #667's case.
--
-- Fix: correct #667's setName/banners to Sunshine (it was never actually
-- fixed before), then strip the literal unqualified 'Gals of Summer'
-- string from EVERY unit's banners[] globally -- it's not a real,
-- current, selectable gacha banner (the event has been split since
-- Version 13.5), so no unit should carry it going forward. Both units'
-- correct qualified tags (already present or added here) are preserved;
-- only the stale unqualified string is removed.
UPDATE "Unit"
SET "setName" = 'Gals of Summer Sunshine',
    "banners" = array_remove("banners", 'Gals of Summer') || ARRAY['Gals of Summer Sunshine']
WHERE "unitNumber" = 667
AND NOT ('Gals of Summer Sunshine' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));

UPDATE "Unit"
SET "banners" = array_remove("banners", 'Gals of Summer')
WHERE 'Gals of Summer' = ANY(COALESCE("banners", ARRAY[]::TEXT[]));
