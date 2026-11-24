-- shroomp (site chat, 2026-11-23): "Nekoluga wrongly appear in 4 banners ...
-- Dynamites, Sengoku Wargods, Ultra Soul, Dragon Emperors ... also in Galaxy Gals".
-- Cause: the wiki-driven banner step read the wiki's "<banner> (Gacha Event)/3DS
-- Version" sub-pages, i.e. the old 3DS game's lineups, which include Nekoluga.
-- The step now only reads current-lineup pages (isCurrentGachaPage in
-- scripts/wiki-banner-sync.ts). A check of every unit against those sub-pages found
-- Nekoluga (#34) was the only one affected. He keeps Tales of the Nekoluga, Super
-- Fest and Best of the Best Milestone Edition.
UPDATE "Unit"
SET "banners" = (
  SELECT COALESCE(array_agg(b), ARRAY[]::TEXT[])
  FROM unnest("banners") AS b
  WHERE b NOT IN ('The Dynamites', 'Sengoku Wargods Vajiras', 'Ancient Heroes Ultra Souls',
                  'Lords of Destruction Dragon Emperors', 'Cyber Academy Galaxy Gals')
)
WHERE "unitNumber" = 34;
