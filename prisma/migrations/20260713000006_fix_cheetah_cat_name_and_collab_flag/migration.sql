-- Fixes unit #673, which had two separate problems surfaced by the user's
-- own wiki screenshot (2026-07-13):
--
--   1. Its `name` was literal untranslated Japanese ("ネコチーター") instead
--      of its real English name "Cheetah Cat" -- BCData's own EN
--      Unit_Explanation file has no real entry for this unit (it's an
--      intentionally unobtainable-without-hacking Uber Rare added in
--      Version 11.7, "the worst cat in the game"). This is also why the
--      new fetch-collab-verification-pages.ts script's wiki page fetch for
--      this unit 404'd -- it was guessing a page title from the wrong
--      name, not because the unit itself lacks a wiki page.
--   2. It was still flagged isCollab=true from the same original flawed
--      SOURCE-based heuristic as the other 89 false positives fixed in
--      migration ...000005 -- its own wiki page confirms zero real-world
--      franchise mention anywhere (setName here is "Epic Fest", a generic
--      in-game fest banner type, not a collab).
--
-- The name fix is also applied as EXTRA_NAME_OVERRIDES in sync-bcdata.ts so
-- a future sync's unconditional `name: u.name` upsert doesn't revert it.
UPDATE "Unit" SET "name" = 'Cheetah Cat'
WHERE "unitNumber" = 673 AND "name" = 'ネコチーター';

UPDATE "Unit" SET "isCollab" = false
WHERE "unitNumber" = 673 AND "isCollab" = true;
