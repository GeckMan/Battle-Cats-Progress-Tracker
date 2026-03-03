-- Remove serial-code-only units (method no longer available)
-- Also clean up any user progress referencing these units
DELETE FROM "UserUnitProgress"
WHERE "unitId" IN (
  SELECT "id" FROM "Unit" WHERE "source" = 'SERIAL_CODE'
);

DELETE FROM "Unit"
WHERE "source" = 'SERIAL_CODE';
