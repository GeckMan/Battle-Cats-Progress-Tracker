-- Two real collab franchises are split across two setName strings each in the
-- Collabs dropdown (same class of bug as 20260713000007):
--
-- 1. Fate: bvg_tbc (2026-09-28): "there is 'Fate Collab Gacha' and
--    'Fate/Stay Night'. It would be better if it was one list." The original
--    roster is 'Fate/Stay Night Collaboration' (shown as "Fate/Stay Night" --
--    the UI strips " Collaboration"); the Version 15.6 units were labelled
--    with BCU's own category name 'Fate Collab Gacha'. Merge into the
--    existing name; sync-bcdata.ts's BCU_CATEGORY_ALIAS now maps it too so
--    future Fate units don't re-split.
--
-- 2. World Trigger (my own doing): migration 20260929000002 labelled
--    #677/#678 'World Trigger Collaboration' while #679 already carried the
--    wiki's real event name 'World Trigger 1/2 Collaboration' (Cat Release
--    Order, printed 2026-10-20: #679 "Daily Login - World Trigger 1/2
--    Collaboration"; #677/#678 drops from the same collab's Tamakoma
--    stages). Move all three to the wiki's name.
UPDATE "Unit"
SET "setName" = CASE WHEN "setName" = 'Fate Collab Gacha' THEN 'Fate/Stay Night Collaboration' ELSE "setName" END,
    "banners" = (
      SELECT array_agg(DISTINCT b)
      FROM unnest(array_replace(COALESCE("banners", ARRAY[]::TEXT[]), 'Fate Collab Gacha', 'Fate/Stay Night Collaboration')) AS b
    )
WHERE "setName" = 'Fate Collab Gacha' OR 'Fate Collab Gacha' = ANY(COALESCE("banners", ARRAY[]::TEXT[]));

UPDATE "Unit"
SET "setName" = CASE WHEN "setName" = 'World Trigger Collaboration' THEN 'World Trigger 1/2 Collaboration' ELSE "setName" END,
    "banners" = (
      SELECT array_agg(DISTINCT b)
      FROM unnest(array_replace(COALESCE("banners", ARRAY[]::TEXT[]), 'World Trigger Collaboration', 'World Trigger 1/2 Collaboration')) AS b
    )
WHERE "setName" = 'World Trigger Collaboration' OR 'World Trigger Collaboration' = ANY(COALESCE("banners", ARRAY[]::TEXT[]));
