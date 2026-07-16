-- Backfills UserLegendProgress.status wherever it's drifted out of sync
-- with the actual crownMax/maxCrowns values.
--
-- Root cause, reported by user bvg_tbc (2026-07-16) via the in-app
-- Activity & Chat feature: they used the saga-level bulk crown buttons
-- (the header "4/3/2/1/0" buttons on the Legend Stages page) to mark all
-- of "Stories of Legend" as maxed out. Their own dashboard showed the
-- right percentage (legendSubchapterPercent() there always derives from
-- crownMax + maxCrowns directly), but the Compare page's dedicated
-- "Stories of Legend — Subchapters" table reads the separately-stored
-- `status` column verbatim -- and the OLD (pre-fix) /api/legend/bulk
-- endpoint always wrote `status: crownMax === null ? "NOT_STARTED" :
-- "IN_PROGRESS"`, i.e. it NEVER wrote "COMPLETED", no matter how high the
-- requested crown level was. Individually clicking a subchapter's own
-- crown buttons went through /api/legend (POST), which always computed
-- status correctly (crownMax >= maxCrowns ? COMPLETED : IN_PROGRESS) --
-- explaining exactly why bvg's one manually-clicked subchapter showed
-- "completed" while everything else set via the bulk buttons stayed
-- stuck on "in progress" despite being fully crowned.
--
-- /api/legend/bulk now computes status correctly per-row (same commit as
-- this migration), and src/app/(app)/social/compare/[username]/page.tsx
-- now derives the badge from crownMax/maxCrowns directly instead of
-- trusting the stored column at all -- but the column itself is still
-- read elsewhere and worth keeping honest, so this repairs every
-- already-affected row for every user who used the bulk buttons before
-- today's fix, not just bvg's.
UPDATE "UserLegendProgress" ulp
SET "status" = (CASE
  WHEN ulp."crownMax" IS NULL THEN 'NOT_STARTED'
  WHEN ulp."crownMax" >= ls."maxCrowns" THEN 'COMPLETED'
  ELSE 'IN_PROGRESS'
END)::"LegendProgressStatus"
FROM "LegendSubchapter" ls
WHERE ulp."subchapterId" = ls."id"
  AND ulp."status" IS DISTINCT FROM (CASE
    WHEN ulp."crownMax" IS NULL THEN 'NOT_STARTED'
    WHEN ulp."crownMax" >= ls."maxCrowns" THEN 'COMPLETED'
    ELSE 'IN_PROGRESS'
  END)::"LegendProgressStatus";
