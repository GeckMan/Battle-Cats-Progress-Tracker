-- Fix remaining unit names where Form 2 name was concatenated onto Form 1 name
-- These are the ~277 units not covered by the Black Catculator spreadsheet
-- Verified against Battle Cats Wiki (Fandom & Miraheze)

-- Collab/special units with concatenated form 2 names
UPDATE "Unit" SET "name" = 'Kerihime' WHERE "unitNumber" = 26;
UPDATE "Unit" SET "name" = 'PPT48' WHERE "unitNumber" = 66;
UPDATE "Unit" SET "name" = 'Nimue' WHERE "unitNumber" = 89;
UPDATE "Unit" SET "name" = 'Monkey King' WHERE "unitNumber" = 90;
UPDATE "Unit" SET "name" = 'Nubobo' WHERE "unitNumber" = 157;
UPDATE "Unit" SET "name" = 'Yurinchi' WHERE "unitNumber" = 160;
UPDATE "Unit" SET "name" = 'Cuckoo Crew' WHERE "unitNumber" = 182;

-- Castle & Dragon collab units
UPDATE "Unit" SET "name" = 'Castle Horseman' WHERE "unitNumber" = 250;
UPDATE "Unit" SET "name" = 'Battle Balloon' WHERE "unitNumber" = 252;
UPDATE "Unit" SET "name" = 'Dragon Rider' WHERE "unitNumber" = 253;

-- Misc collab units
UPDATE "Unit" SET "name" = 'Futenyan' WHERE "unitNumber" = 281;
UPDATE "Unit" SET "name" = 'Nora' WHERE "unitNumber" = 356;
UPDATE "Unit" SET "name" = 'Medama-Oyaji' WHERE "unitNumber" = 454;

-- Uber Rare / Legend units with form 2 concatenated
UPDATE "Unit" SET "name" = 'Issun Boshi' WHERE "unitNumber" = 692;
UPDATE "Unit" SET "name" = 'Tekachi' WHERE "unitNumber" = 719;
UPDATE "Unit" SET "name" = 'Ninja Girl Tomoe' WHERE "unitNumber" = 725;
UPDATE "Unit" SET "name" = 'Cake Machine' WHERE "unitNumber" = 756;
UPDATE "Unit" SET "name" = 'Pumpkin Sodom' WHERE "unitNumber" = 772;
UPDATE "Unit" SET "name" = 'Koneko' WHERE "unitNumber" = 783;
UPDATE "Unit" SET "name" = 'Choco Capsule' WHERE "unitNumber" = 784;
UPDATE "Unit" SET "name" = 'Mamoluga' WHERE "unitNumber" = 781;
UPDATE "Unit" SET "name" = 'The Amazing Catman' WHERE "unitNumber" = 786;
UPDATE "Unit" SET "name" = 'Heavenly God Super Zeus' WHERE "unitNumber" = 762;
UPDATE "Unit" SET "name" = 'Netherworld Nymph Lunacia' WHERE "unitNumber" = 787;
UPDATE "Unit" SET "name" = 'Komori' WHERE "unitNumber" = 817;
