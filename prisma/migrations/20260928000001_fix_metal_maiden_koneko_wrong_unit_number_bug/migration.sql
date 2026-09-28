-- Self-inflicted bug found while investigating this run's "no source
-- classification" warning for Metal Maiden Koneko (#873): migration
-- 20260831000002 (fixing Jungle Gourmet Tomoe into Gals of Summer Blue
-- Ocean) targeted unitNumber = 873 based on three fan-tracker sites that
-- all agreed on that number. 20260901000001 later corrected the target to
-- 872 after finding those sites were off-by-one from the real in-game
-- unit number -- but never rolled back the original write to 873, which
-- is a completely different, real unit: Metal Maiden Koneko, a Version
-- 15.6 Uber Rare from the unrelated "Best of the Best Milestone Edition"
-- Rare Capsule event (confirmed via her own wiki page), now incorrectly
-- carrying a 'Gals of Summer Blue Ocean' setName/banner tag she has
-- nothing to do with.
--
-- This both undoes that mistake and fills in her real classification
-- (source, setName, banners), which is also what this run's own coverage
-- check was already flagging as missing.
UPDATE "Unit"
SET "source" = 'RARE_CAPSULE',
    "setName" = 'Best of the Best Milestone Edition',
    "banners" = array_remove(COALESCE("banners", ARRAY[]::TEXT[]), 'Gals of Summer Blue Ocean')
      || ARRAY['Best of the Best Milestone Edition']
WHERE "unitNumber" = 873
AND NOT ('Best of the Best Milestone Edition' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));
