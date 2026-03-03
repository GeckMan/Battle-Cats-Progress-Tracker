-- Li'l Normal cats come from event capsules but aren't seasonal or stage drops
-- Clear their source so they don't appear under any specific filter
UPDATE "Unit" SET "source" = NULL
WHERE "unitNumber" IN (209, 210, 211, 245, 246, 247, 311, 312, 313);
