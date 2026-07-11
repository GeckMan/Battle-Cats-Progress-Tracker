-- Fix a specific wrong hardcoded setName that predates all of this
-- session's gacha-set work, and which the new additive-only sync will
-- never self-correct (by design — it only fills nulls, never overwrites
-- an existing value, so it can't be used to fix this).
--
-- Unit 649 (Hattori Hanzo / Wargod Hanzo, shown in-game as "Hanzo the
-- Betrothed") was hardcoded to setName='Sengoku Wargods Vajiras' since the
-- very first seed migration — apparently guessed from his samurai-themed
-- name rather than his real gacha debut. Per direct user confirmation
-- (this is the very first bug reported this whole session): "hanzo is not
-- a collab unit, he is under the June Bride gacha event". Independently
-- confirmed via BCData's real debut-clustering: his actual debut banner
-- label cleans to "悪魔のジューンブライド", which resolves to "June Bride"
-- in scripts/data/gacha-event-names.ts.
--
-- Scoped to just unit 649 — the other 10 units sharing the
-- 'Sengoku Wargods Vajiras' tag aren't touched, since there's no evidence
-- (yet) that any of them are similarly mislabeled.

UPDATE "Unit"
SET "setName" = 'June Bride',
    "banners" = (
      SELECT array_agg(DISTINCT b)
      FROM unnest(array_remove("banners", 'Sengoku Wargods Vajiras') || ARRAY['June Bride']) AS b
    )
WHERE "unitNumber" = 649;
