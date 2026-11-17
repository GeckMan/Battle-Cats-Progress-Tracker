-- The first run of the wiki-driven banner step (2026-11-17 sync) tagged 38 units
-- "Super Fest" because its label vote counted units that already carried that
-- cross-cutting tag (Best of the Best / Good Riddance / BusterFest roster pages).
-- Super Fest membership is a closed allowlist taken from the wiki's Superfest page
-- (SUPERFEST_INCLUDED_SETNAMES in scripts/sync-bcdata.ts). Remove the tag from any
-- unit whose setName isn't on it. Earlier syncs reported no stale tags, so every
-- such unit got it from that run. Idempotent; the sync re-adds it for eligible units.
UPDATE "Unit"
SET "banners" = array_remove("banners", 'Super Fest')
WHERE 'Super Fest' = ANY("banners")
  AND ("setName" IS NOT NULL AND "setName" NOT IN (
    'Tales of the Nekoluga', 'The Dynamites', 'Sengoku Wargods Vajiras', 'Cyber Academy Galaxy Gals',
    'Lords of Destruction Dragon Emperors', 'Ancient Heroes Ultra Souls', 'Justice Strikes Back! Dark Heroes',
    'The Almighties', 'Frontline Assault Iron Legion', 'Nature''s Guardians Elemental Pixies', 'Uber Fest', 'Epic Fest'
  ));
