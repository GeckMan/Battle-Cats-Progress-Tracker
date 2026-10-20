-- Unit #875 has shown up as the raw BCData placeholder "735_1" (and as "no
-- source classification") in every weekly sync log since v15.6, failing the
-- sync job each week. Per the Version 15.6 wiki update page it's a summoned
-- ability entry -- Divine Pegasa ν's conjure now points to #875 instead of
-- #734 ("Spirit of Pegasa") -- not an independently obtainable unit, so it
-- gets the same treatment as the other "Spirit of X" entries
-- (UNIT_NAME_OVERRIDES in scripts/sync-bcdata.ts): real name, hidden from
-- the collection. The sync applies this on its own next run too; this just
-- makes it effective immediately.
UPDATE "Unit"
SET "name" = 'Spirit of Divine Pegasa ν', "excludeFromCollection" = true
WHERE "unitNumber" = 875 AND "name" = '735_1';
