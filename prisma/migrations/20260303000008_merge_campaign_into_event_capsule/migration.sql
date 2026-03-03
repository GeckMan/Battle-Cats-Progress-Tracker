-- Merge CAMPAIGN units into EVENT_CAPSULE (all are collab/limited units)
UPDATE "Unit" SET "source" = 'EVENT_CAPSULE', "isCollab" = true
WHERE "source" = 'CAMPAIGN';
