-- warhammer775ig (site chat, 2026-11-09): "the new river city collab uber
-- hasn't been put in yet."
--
-- Evidence (wiki pages Ryan supplied 2026-11-17): Cat Release Order lists
-- #874 Ryuichi (Ryuichi & Ryuji), Uber Rare, "Rare Cat Capsules - River City
-- Clash Capsules Dark Team"; the "River City Clash Capsules Dark Team" page
-- says Ryuichi is the bonus 12th capsule on an 11-capsule draw. This is the
-- third River City Clash team after Red Team (#624 Kunio-kun) and White Team
-- (#721 Riki), both already under setName 'Kunio-kun Collaboration' (shown
-- in the app's Collabs dropdown as "Kunio-kun").
--
-- #874 already exists in the unit data (BCData ships unit rows ahead of the
-- EN release) but the EN gacha banner CSVs don't have the River City Dark
-- Team banner yet, so the sync's gacha-history-based collab detection has no
-- signal for him -- the structural blind spot documented in CLAUDE.md. Classify
-- him directly, same way as every other hand-confirmed collab here. Idempotent;
-- a no-op if the row doesn't exist yet (the weekly sync creates it and
-- 'kunio-kun' is already in CONFIRMED_REAL_COLLAB_FRANCHISES).
UPDATE "Unit"
SET "isCollab" = true,
    "setName" = 'Kunio-kun Collaboration',
    "banners" = (
      SELECT array_agg(DISTINCT b)
      FROM unnest(COALESCE("banners", ARRAY[]::TEXT[]) || ARRAY['Kunio-kun Collaboration']) AS b
    ),
    "source" = COALESCE("source", 'RARE_CAPSULE'),
    "excludeFromCollection" = false,
    "name" = CASE WHEN "name" ~ '^[0-9]+[_-][0-9]+$' THEN 'Ryuichi' ELSE "name" END
WHERE "unitNumber" = 874;
