-- shroomp (site chat, 2026-10-26) reported regular "Best of the Best" wrongly
-- shows D'arktanyan, Li'l Valkyrie Dark and Agent Staal.
-- Evidence: wiki "Best of the Best (Gacha Event)" (Cho Senbatsusai, v14.6) full
-- roster has Li'l Valkyrie (#435) + Trixi (#758) as the limited Ubers and no
-- D'arktanyan (#441), Li'l Valkyrie Dark (#484) or Agent Staal (#810).
-- Root cause: 20260303000025/26 set setName='Best of the Best' for 484/810, and
-- 20260304000027 step 6 hand-added the banner to 441/484/810.
-- 484/810 belong to NEO Best of the Best (also tagged by sync-bcdata.ts).
-- D'arktanyan (#441) keeps setName EPICFEST. Koneko #783 is deliberately NOT
-- touched: she is on neither the regular nor the Milestone wiki roster and her
-- real home is still unconfirmed.
UPDATE "Unit"
SET "banners" = array_remove(COALESCE("banners", ARRAY[]::TEXT[]), 'Best of the Best')
WHERE "unitNumber" IN (441, 484, 810);

UPDATE "Unit" SET "setName" = 'NEO Best of the Best' WHERE "unitNumber" IN (484, 810);

UPDATE "Unit"
SET "banners" = COALESCE("banners", ARRAY[]::TEXT[]) || ARRAY['NEO Best of the Best']
WHERE "unitNumber" IN (484, 810)
AND NOT ('NEO Best of the Best' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));
