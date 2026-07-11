-- The sync log's "no label in source data" families for "Li'l Cat" (6
-- units) and "Li'l Fish Cat" (3 units) are exactly the two historical
-- debut rows already independently confirmed this session as the Lucky
-- Capsule roster (via the wiki's "Lucky Capsule" page: Li'l Cat, Li'l
-- Tank/Axe/Gross/Cow/Bird/Fish/Lizard/Titan Cat = 9 units total). They can
-- no longer be resolved automatically going forward because
-- GACHA_EVENT_NAMES is keyed by the original Japanese banner label, and
-- BCData EN 15.4.0 no longer includes any label at all in the source
-- files (see sync-bcdata.ts). Matching by exact unit name here instead of
-- unitNumber, since these units were added via ordinary weekly syncs
-- after the original seed migration and their numeric IDs aren't recorded
-- anywhere in this codebase.
--
-- Scoped tightly: only touches units with these exact names AND a
-- currently-null setName, so it can't clobber anything already classified.

UPDATE "Unit"
SET "setName" = 'Lucky Capsule',
    "banners" = (
      SELECT array_agg(DISTINCT b)
      FROM unnest(COALESCE("banners", ARRAY[]::TEXT[]) || ARRAY['Lucky Capsule']) AS b
    )
WHERE "name" IN (
  'Li''l Cat', 'Li''l Tank Cat', 'Li''l Axe Cat', 'Li''l Gross Cat',
  'Li''l Cow Cat', 'Li''l Bird Cat', 'Li''l Fish Cat', 'Li''l Lizard Cat',
  'Li''l Titan Cat'
)
AND "setName" IS NULL;
