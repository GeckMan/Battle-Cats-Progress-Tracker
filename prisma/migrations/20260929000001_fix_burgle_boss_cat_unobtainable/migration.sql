-- Burgle Boss Cat (Retired) (#504) has shown "How to Obtain: Unknown"
-- since source has always been null for him (flagged again by this week's
-- sync run's "no source classification" coverage check). Per his own wiki
-- page (Ryan-supplied PDF, 2026-09-28): his real and only unlock mechanic
-- was reaching League 2 in "The Burgle Cats", a since-shut-down separate
-- mini-game/event -- "With the shutdown of The Burgle Cats, this was no
-- longer possible." Same shape of bug as God (#141) and Droid Cat (#77)
-- fixed 2026-08-20: a real, structured historical obtain mechanic that no
-- longer works, so UNOBTAINABLE is the correct classification, not a gap
-- to leave blank.
UPDATE "Unit"
SET "source" = 'UNOBTAINABLE'
WHERE "unitNumber" = 504 AND "source" IS NULL;
