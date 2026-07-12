-- Corrects Kaoru Cat's (#753) source from 'DAILY_LOGIN' (set in
-- 20260712000006) to 'STAMP_REWARD'. Both UnitsClient.tsx and
-- FriendUnitsClient.tsx's SOURCE_LABELS map define these as two distinct
-- categories ("Daily Login" vs "Stamp Reward"), and the Battle Cats Wiki's
-- "Cat Release Order" page -- confirmed 2026-07-12 to use the exact same
-- 0-based unit ID as this project's Unit.unitNumber (cross-checked against
-- Brainwashed Cat #629, Brainwashed Tank Cat #636, and Kaoru Cat #753
-- itself, all exact matches) -- lists Kaoru Cat's own "Obtaining method" as
-- literally "Stamp Reward - Rurouni Kenshin Collaboration", not "Daily
-- Login". STAMP_REWARD is specifically for collab-period login-stamp
-- collection rewards (a distinct in-game mechanic from the general
-- anniversary-style "Daily Login" rewards like Gold Brick Cat's "Daily
-- Login - 1/2 Anniversary"), which is the more precise, wiki-confirmed
-- category for this unit.
UPDATE "Unit"
SET "source" = 'STAMP_REWARD'
WHERE "unitNumber" = 753
AND "name" = 'Kaoru Cat'
AND "source" = 'DAILY_LOGIN';
