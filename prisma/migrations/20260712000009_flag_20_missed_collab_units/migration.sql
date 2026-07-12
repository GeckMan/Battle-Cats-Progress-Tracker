-- Flags 20 units the new "Audit Obtain Methods" workflow surfaced as
-- isCollab=false even though the Battle Cats Wiki's Cat Release Order
-- page explicitly lists a collaboration in their "Obtaining method" --
-- exactly the Kaoru Cat pattern (units obtained via Daily Login/Stamp
-- Reward/Special Sale rather than a gacha capsule pull, so they never
-- appear in GatyaDataSetR1/E1/N1.csv and are invisible to every
-- collab-detection layer that scans those files).
--
-- Deliberately setName/banners are NOT touched here. Several of these
-- collabs (Evangelion, Fate/Stay Night, Baki, Street Fighter, Tower of
-- Saviors, Sonic the Hedgehog) already have real capsule-roster sibling
-- units in this database with an established setName that may not
-- literally match the wiki's own phrasing for this specific bonus unit
-- (e.g. Baki's real established name is "Baki Hanma Capsules" per
-- BCU_KNOWN_COLLAB_CATEGORIES, not the wiki's "Baki Hanma Collaboration
-- Event"). Assigning setName here risked creating a second, differently
-- labeled entry for a collab that's already correctly named elsewhere,
-- which would actively hurt the unified collab-filtering the user asked
-- for rather than help it. isCollab + source are independent of that
-- naming-precision question and are safe to apply immediately from wiki
-- evidence alone; setName is deferred to a follow-up migration once
-- sibling setNames can be looked up and cross-checked (audit script
-- extended for this, see next commit).
UPDATE "Unit" SET "isCollab" = true, "source" = 'DAILY_LOGIN'
WHERE "unitNumber" = 26 AND "name" = 'Kerihime' AND "isCollab" = false;

UPDATE "Unit" SET "isCollab" = true, "source" = 'DAILY_LOGIN'
WHERE "unitNumber" = 121 AND "name" = 'Merc' AND "isCollab" = false;

UPDATE "Unit" SET "isCollab" = true, "source" = 'DAILY_LOGIN'
WHERE "unitNumber" = 181 AND "name" = 'Yuki Cat' AND "isCollab" = false;

UPDATE "Unit" SET "isCollab" = true, "source" = 'DAILY_LOGIN'
WHERE "unitNumber" = 278 AND "name" = 'Tanky' AND "isCollab" = false;

UPDATE "Unit" SET "isCollab" = true, "source" = 'DAILY_LOGIN'
WHERE "unitNumber" = 279 AND "name" = 'White Cat' AND "isCollab" = false;

UPDATE "Unit" SET "isCollab" = true, "source" = 'DAILY_LOGIN'
WHERE "unitNumber" = 280 AND "name" = 'Fortressy' AND "isCollab" = false;

UPDATE "Unit" SET "isCollab" = true, "source" = 'DAILY_LOGIN'
WHERE "unitNumber" = 328 AND "name" = 'Happy 100' AND "isCollab" = false;

UPDATE "Unit" SET "isCollab" = true, "source" = 'DAILY_LOGIN'
WHERE "unitNumber" = 369 AND "name" = 'Saber the Cat' AND "isCollab" = false;

UPDATE "Unit" SET "isCollab" = true, "source" = 'DAILY_LOGIN'
WHERE "unitNumber" = 403 AND "name" = 'Gendo & Fuyutsuki Cats' AND "isCollab" = false;

UPDATE "Unit" SET "isCollab" = true, "source" = 'DAILY_LOGIN'
WHERE "unitNumber" = 457 AND "name" = 'Shirou the Cat' AND "isCollab" = false;

UPDATE "Unit" SET "isCollab" = true, "source" = 'DAILY_LOGIN'
WHERE "unitNumber" = 497 AND "name" = 'Shakurel Cat' AND "isCollab" = false;

UPDATE "Unit" SET "isCollab" = true, "source" = 'SPECIAL_SALE'
WHERE "unitNumber" = 498 AND "name" = 'Shakurel Lion' AND "isCollab" = false;

UPDATE "Unit" SET "isCollab" = true, "source" = 'SPECIAL_SALE'
WHERE "unitNumber" = 499 AND "name" = 'Shakurel Tiger' AND "isCollab" = false;

UPDATE "Unit" SET "isCollab" = true, "source" = 'SPECIAL_SALE'
WHERE "unitNumber" = 500 AND "name" = 'Shakurel Panda' AND "isCollab" = false;

UPDATE "Unit" SET "isCollab" = true, "source" = 'DAILY_LOGIN'
WHERE "unitNumber" = 509 AND "name" = 'Chun-Li Cat' AND "isCollab" = false;

UPDATE "Unit" SET "isCollab" = true, "source" = 'DAILY_LOGIN'
WHERE "unitNumber" = 679 AND "name" = 'Chika Amatori & Cat' AND "isCollab" = false;

UPDATE "Unit" SET "isCollab" = true, "source" = 'STAMP_REWARD'
WHERE "unitNumber" = 744 AND "name" = 'Felix the Cat Duke Cat' AND "isCollab" = false;

UPDATE "Unit" SET "isCollab" = true, "source" = 'SPECIAL_SALE'
WHERE "unitNumber" = 745 AND "name" = 'Dotty Cat' AND "isCollab" = false;

UPDATE "Unit" SET "isCollab" = true, "source" = 'STAMP_REWARD'
WHERE "unitNumber" = 795 AND "name" = 'Li''l Baki' AND "isCollab" = false;

UPDATE "Unit" SET "isCollab" = true, "source" = 'STAMP_REWARD'
WHERE "unitNumber" = 808 AND "name" = 'Tails Cat' AND "isCollab" = false;
