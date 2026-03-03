-- Re-add former serial-code units as UNOBTAINABLE
INSERT INTO "Unit" ("id", "unitNumber", "name", "category", "formCount", "sortOrder", "isCollab", "source", "setName")
VALUES
  ('unit-28',  28,  'Capsule Cat',               'SPECIAL'::"UnitCategory", 2, 10028, true,  'UNOBTAINABLE', NULL),
  ('unit-29',  29,  'Masked Cat',                 'SPECIAL'::"UnitCategory", 2, 10029, true,  'UNOBTAINABLE', NULL),
  ('unit-45',  45,  'Maiko Cat',                  'SPECIAL'::"UnitCategory", 2, 10045, true,  'UNOBTAINABLE', NULL),
  ('unit-53',  53,  'Evangelist Cat',             'UBER_RARE'::"UnitCategory", 2, 40053, true, 'UNOBTAINABLE', NULL),
  ('unit-62',  62,  'Toy Machine Cat',            'SPECIAL'::"UnitCategory", 2, 10062, true,  'UNOBTAINABLE', NULL),
  ('unit-82',  82,  'Blue Shinobi',               'SPECIAL'::"UnitCategory", 2, 10082, true,  'UNOBTAINABLE', NULL),
  ('unit-133', 133, 'Hikakin',                    'SPECIAL'::"UnitCategory", 3, 10133, true,  'UNOBTAINABLE', NULL),
  ('unit-140', 140, 'Squish Ball Cat',            'SPECIAL'::"UnitCategory", 2, 10140, true,  'UNOBTAINABLE', NULL),
  ('unit-141', 141, 'God Secret',                 'SPECIAL'::"UnitCategory", 2, 10141, true,  'UNOBTAINABLE', NULL),
  ('unit-142', 142, 'Tutorial Cat',               'SPECIAL'::"UnitCategory", 2, 10142, true,  'UNOBTAINABLE', NULL),
  ('unit-162', 162, 'Sho Ayanokoji',              'SPECIAL'::"UnitCategory", 2, 10162, true,  'UNOBTAINABLE', NULL),
  ('unit-163', 163, 'Hikaru Saotome',             'SPECIAL'::"UnitCategory", 2, 10163, true,  'UNOBTAINABLE', NULL),
  ('unit-164', 164, 'Hitomi Saionji',             'SPECIAL'::"UnitCategory", 2, 10164, true,  'UNOBTAINABLE', NULL),
  ('unit-165', 165, 'Hoshi Grandmarnier',         'SPECIAL'::"UnitCategory", 2, 10165, true,  'UNOBTAINABLE', NULL),
  ('unit-166', 166, 'Shouchikubai Shiratori',     'SPECIAL'::"UnitCategory", 2, 10166, true,  'UNOBTAINABLE', NULL),
  ('unit-178', 178, 'Mob Cat',                    'SPECIAL'::"UnitCategory", 2, 10178, true,  'UNOBTAINABLE', NULL),
  ('unit-182', 182, 'Cuckoo Crew 12',             'SPECIAL'::"UnitCategory", 2, 10182, true,  'UNOBTAINABLE', NULL),
  ('unit-192', 192, 'Yamaoka Minori',             'SPECIAL'::"UnitCategory", 2, 10192, true,  'UNOBTAINABLE', NULL),
  ('unit-193', 193, 'Nakamura Kanae',             'SPECIAL'::"UnitCategory", 2, 10193, true,  'UNOBTAINABLE', NULL)
ON CONFLICT ("unitNumber") DO UPDATE SET
  "source" = 'UNOBTAINABLE',
  "isCollab" = true;

-- Also mark the existing unobtainable unit (673) consistently
UPDATE "Unit" SET "isCollab" = true WHERE "source" = 'UNOBTAINABLE';
