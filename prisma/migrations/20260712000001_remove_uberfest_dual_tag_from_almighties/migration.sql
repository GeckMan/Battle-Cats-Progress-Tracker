-- Removes the 'Uber Fest' banner tag that 20260711000009 kept alongside the
-- 12 real Almighties units, on the unverified assumption that they were
-- "also currently offered in Uber Fest." A live screenshot of the app's
-- Uber Fest filter (2026-07-12) disproved this directly: every one of the
-- 12 "Almighty X" units (The Majestic Zeus, Almighty Anubis, Almighty
-- Aphrodite, Almighty Amaterasu, Almighty Ganesha, Almighty Poseidon,
-- Almighty Chronos, Almighty Hades, Almighty Lucifer, Almighty Aset,
-- Victorious Skanda, Gaia the Supreme) was showing up mixed in with genuine
-- Uber Fest exclusives -- exactly the "UBERFEST filter shows Uber Fest AND
-- Almighties together" bug this whole investigation started from. setName
-- stays 'The Almighties'; only the extra banners[] entry is removed.
UPDATE "Unit"
SET "banners" = array_remove("banners", 'Uber Fest')
WHERE "unitNumber" IN (257, 258, 259, 271, 272, 316, 439, 493, 534, 642, 723, 811);
