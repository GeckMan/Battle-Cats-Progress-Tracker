-- Remove non-acquirable summon/spirit units
DELETE FROM "Unit"
WHERE "unitNumber" IN (
  729, 732, 734, 739, 755, 761, 764, 770, 775, 782,
  800, 802, 812, 816, 818, 821, 825, 838, 839
);
