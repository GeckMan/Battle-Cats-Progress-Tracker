-- shroomp (site chat, 2026-10-26): "both Konekos should be in Milestone".
-- Evidence: wiki page for Koneko (Cat Unit #783, Uber Rare, added v14.2) says she
-- is obtained from the Rare Capsule during the Best of the Best Milestone Edition
-- gacha event. She is not on the regular Best of the Best roster. Her setName and
-- banner were left as 'Best of the Best' by 20260303000025/26 and 20260304000027.
UPDATE "Unit"
SET "setName" = 'Best of the Best Milestone Edition',
    "banners" = array_remove(COALESCE("banners", ARRAY[]::TEXT[]), 'Best of the Best')
      || ARRAY['Best of the Best Milestone Edition']
WHERE "unitNumber" = 783
AND NOT ('Best of the Best Milestone Edition' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));
