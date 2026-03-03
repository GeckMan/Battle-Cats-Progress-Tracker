-- Fix unit names cross-referenced against BCU (Battle Cats Ultimate) game data
-- Source: bcu-assets/lang/en-UnitName.txt from battlecatsultimate GitHub
-- 30 fixes for remaining mismatches after previous migrations

-- Concatenated form 2 names still in DB
UPDATE "Unit" SET "name" = 'Swordsman' WHERE "unitNumber" = 64;
UPDATE "Unit" SET "name" = 'Kasa Jizo' WHERE "unitNumber" = 137;
UPDATE "Unit" SET "name" = 'God' WHERE "unitNumber" = 141;
UPDATE "Unit" SET "name" = 'Li''l Nyandam' WHERE "unitNumber" = 172;
UPDATE "Unit" SET "name" = 'D''artanyan' WHERE "unitNumber" = 380;
UPDATE "Unit" SET "name" = 'Li''l Valkyrie' WHERE "unitNumber" = 435;
UPDATE "Unit" SET "name" = 'D''arktanyan' WHERE "unitNumber" = 441;
UPDATE "Unit" SET "name" = 'Li''l Valkyrie Dark' WHERE "unitNumber" = 484;
UPDATE "Unit" SET "name" = 'Hina' WHERE "unitNumber" = 486;

-- EVA capitalization fixes (Eva → EVA to match in-game)
UPDATE "Unit" SET "name" = 'EVA Unit-00' WHERE "unitNumber" = 412;
UPDATE "Unit" SET "name" = 'EVA Unit-01' WHERE "unitNumber" = 413;
UPDATE "Unit" SET "name" = 'EVA Unit-02' WHERE "unitNumber" = 414;
UPDATE "Unit" SET "name" = 'EVA Unit-08' WHERE "unitNumber" = 487;

-- Other capitalization/formatting fixes
UPDATE "Unit" SET "name" = 'KAITO & Cat' WHERE "unitNumber" = 591;
UPDATE "Unit" SET "name" = 'Voluptuous Peony - Daji' WHERE "unitNumber" = 741;
UPDATE "Unit" SET "name" = 'Madoka Cat & Homura' WHERE "unitNumber" = 778;

-- Ancient Egg colon formatting (N001 → N001 with colon separator)
UPDATE "Unit" SET "name" = 'Ancient Egg: N001' WHERE "unitNumber" = 656;
UPDATE "Unit" SET "name" = 'Ancient Egg: N000' WHERE "unitNumber" = 691;
UPDATE "Unit" SET "name" = 'Ancient Egg: N107' WHERE "unitNumber" = 697;
UPDATE "Unit" SET "name" = 'Ancient Egg: N005' WHERE "unitNumber" = 700;
UPDATE "Unit" SET "name" = 'Ancient Egg: N108' WHERE "unitNumber" = 706;
UPDATE "Unit" SET "name" = 'Ancient Egg: N109' WHERE "unitNumber" = 707;
UPDATE "Unit" SET "name" = 'Ancient Egg: N203' WHERE "unitNumber" = 713;
UPDATE "Unit" SET "name" = 'Ancient Egg: N111' WHERE "unitNumber" = 716;
UPDATE "Unit" SET "name" = 'Ancient Egg: N110' WHERE "unitNumber" = 717;
UPDATE "Unit" SET "name" = 'Ancient Egg: N006' WHERE "unitNumber" = 720;
UPDATE "Unit" SET "name" = 'Ancient Egg: N112' WHERE "unitNumber" = 724;
UPDATE "Unit" SET "name" = 'Ancient Egg: N204' WHERE "unitNumber" = 730;
UPDATE "Unit" SET "name" = 'Ancient Egg: N205' WHERE "unitNumber" = 757;
UPDATE "Unit" SET "name" = 'Ancient Egg: N206' WHERE "unitNumber" = 765;
