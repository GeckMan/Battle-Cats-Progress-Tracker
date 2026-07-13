-- Fixes 19 more isCollab false positives, this time surfaced automatically
-- by the new checkExistingCollabFlagsAgainstEvidence() check (added
-- 20260713, ran for the first time 2026-07-13 in a manually-triggered
-- "Sync BCData" run) rather than by manual screenshot review. Same root
-- cause as the 25 fixed earlier today: the original March 2026 migrations
-- set isCollab=true from a unit's SOURCE type, not from verified real-world
-- collaboration status.
--
-- All four groups below share a telling pattern: their setName is a plain,
-- generic-sounding capsule/anniversary/seasonal name with no franchise
-- attached, and every single one of their gacha banner rows came back with
-- NO コラボ label and NO bcu-assets "Collab" category tag -- a strong,
-- automated signal, not a guess.
--
--   - "Lucky Capsule" (9 units): a generic recurring capsule type, not a
--     franchise tie-in of any kind.
--   - "9th Anniversary Special Capsules" (3 units): an anniversary
--     celebration capsule, same category as "9th Anniversary" itself.
--   - "Summer Break Capsules" (3 units): the exact same seasonal event
--     already confirmed non-collab this session for Ancient Egg: N202
--     (#670), Tasmanian Giant Crab (#813), and Consultant Cat (#822) --
--     these are simply more units from that same event that the earlier
--     fix missed.
--   - "June Bride of Devil Capsules" (4 units): thematically identical to
--     the already-confirmed-non-collab Halloween Capsules/Xmas Gals/
--     Valentine Gals seasonal events (no franchise name in the title at
--     all), and Undead Cat (#248)'s own row independently confirms no
--     bcu-assets collab signal for this exact set -- extended here to its
--     3 known siblings (Ancient Egg: N203 #713, Ancient Egg: N205 #757,
--     The Invisible Cat #863) on the strength of that same evidence, since
--     all four share the identical setName and event.
UPDATE "Unit" SET "isCollab" = false
WHERE "unitNumber" IN (209, 210, 211, 245, 246, 247, 311, 312, 313)
  AND "isCollab" = true AND "setName" = 'Lucky Capsule';

UPDATE "Unit" SET "isCollab" = false
WHERE "unitNumber" IN (184, 342, 375)
  AND "isCollab" = true AND "setName" = '9th Anniversary Special Capsules';

UPDATE "Unit" SET "isCollab" = false
WHERE "unitNumber" IN (381, 615, 616)
  AND "isCollab" = true AND "setName" = 'Summer Break Capsules';

UPDATE "Unit" SET "isCollab" = false
WHERE "unitNumber" IN (248, 713, 757, 863)
  AND "isCollab" = true AND "setName" = 'June Bride of Devil Capsules';
