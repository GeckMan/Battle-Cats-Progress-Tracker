-- Li'l Normal cats are permanent special stage drops, not seasonal events
UPDATE "Unit" SET "source" = 'STAGE_DROP'
WHERE "unitNumber" IN (209, 210, 211, 245, 246, 247, 311, 312, 313);
