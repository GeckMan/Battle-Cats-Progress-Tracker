-- Remove Iron Wall Cat (unit 339) — deployable cannon entity, not an obtainable unit
DELETE FROM "UserUnitProgress"
WHERE "unitId" IN (SELECT "id" FROM "Unit" WHERE "unitNumber" = 339);

DELETE FROM "Unit" WHERE "unitNumber" = 339;
