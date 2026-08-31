-- Fixes Seaside Pegasa (#820) still carrying the unqualified, pre-split
-- "Gals of Summer" label. Reported by bvg_tbc (Discord, 2026-08-29): "There
-- should be no 'Gals of Summer' banner. Pegasa should be in 'Sunshine'."
--
-- Confirmed via her own wiki page (Seaside_Pegasa_(Uber_Rare_Cat)), which
-- directly ties her to the Gals of Summer Sunshine gacha event specifically
-- -- same pattern as Squirtgun Saki/Summerluga in the original July 2026
-- Sunshine/Blue Ocean fix (20260712000003), which were also stuck on the
-- unqualified pre-split name from the same root cause.
--
-- Root cause, confirmed from this project's own migration history: #820's
-- setName was CORRECTLY 'Gals of Summer Sunshine' as far back as the March
-- seed data (20260303000004), then silently overwritten to the unqualified
-- 'Gals of Summer' by 20260303000026_fix_set_names_from_gacha_data, which
-- pulled from BCData's raw historical debut-row label -- the same
-- pre-split label the event used before Version 13.5 split it into
-- Sunshine/Blue Ocean. That overwrite is exactly what the 2026-08-20
-- migration (20260820000001) already fixed for every OTHER unit still
-- stuck on it; #820 was the one straggler left over specifically because
-- it didn't appear on either gacha event's CURRENT live wiki page at the
-- time (noted explicitly in that migration's own comment as a "past
-- rerun's rotated-out exclusive"). Her own dedicated wiki page has the
-- missing context that the current-run gacha event page doesn't carry.
--
-- After this migration, no unit in the DB carries the unqualified
-- "Gals of Summer" setName anymore.
UPDATE "Unit"
SET "setName" = 'Gals of Summer Sunshine',
    "banners" = array_remove("banners", 'Gals of Summer') || ARRAY['Gals of Summer Sunshine']
WHERE "unitNumber" = 820
AND NOT ('Gals of Summer Sunshine' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));
