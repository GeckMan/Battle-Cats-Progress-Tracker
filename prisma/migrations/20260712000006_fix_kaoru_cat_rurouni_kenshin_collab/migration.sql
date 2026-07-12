-- User flagged (2026-07-12): "Kaoru Cat #753 · Special is a collab unit"
-- but our "Hide Collab" filter wasn't catching it, even after today's two
-- collab-detection backstops (bcu-assets R1/E1 cross-check, and
-- syncCollabFlagsFromCuratedNames() reading resolved setName/banners text).
--
-- Root cause is structurally different from everything fixed earlier
-- today: Kaoru Cat is NOT pulled from a gacha capsule at all. Per the
-- user-supplied "Rurouni Kenshin Collaboration Event" wiki page, "Li'l
-- Kaoru" (this project's BCData-derived name: "Kaoru Cat") is unlocked by
-- collecting login stamps during the collab period and redeeming it from
-- the "Special Cats" section of the Upgrade menu -- it never appears as a
-- row in GatyaDataSetR1/E1/N1.csv, which is the ONLY data every collab/set
-- detection layer in sync-bcdata.ts scans (detectCollabUnitIds(),
-- detectEventFamilies(), syncCollabFlagsFromCuratedNames()). A unit that
-- structurally never appears in any of those 3 files is invisible to the
-- entire pipeline no matter how many backstops are layered on top -- this
-- is why it still fell into the "38 units with no source, set, or collab
-- classification" bucket the coverage check has been logging all session.
--
-- This is likely the same root cause behind other still-unclassified units
-- in that 38-count bucket tied to other collabs (Baki, Evangelion, Street
-- Fighter, etc.) -- each needs the same kind of one-off wiki confirmation,
-- there's no single automatable fix for this category the way there was
-- for the gacha-file-based gaps closed earlier today.
--
-- setName uses the same "Rurouni Kenshin Gacha" string bcu-assets' -2030
-- category resolves to (already relied on elsewhere in this codebase via
-- BCU_KNOWN_COLLAB_CATEGORIES / COLLAB_NAME_PATTERN for the main capsule
-- roster), so Kaoru Cat groups with its collab siblings for filtering even
-- though it wasn't obtained the same way they were. source='DAILY_LOGIN'
-- already has a dedicated label in both UnitsClient.tsx and
-- FriendUnitsClient.tsx's sourceLabels map ("Daily Login") -- that label
-- was defined but nothing in the sync pipeline ever actually assigned it
-- until now.
UPDATE "Unit"
SET "isCollab" = true,
    "source" = 'DAILY_LOGIN',
    "setName" = 'Rurouni Kenshin Gacha',
    "banners" = (
      SELECT array_agg(DISTINCT b)
      FROM unnest(COALESCE("banners", ARRAY[]::TEXT[]) || ARRAY['Rurouni Kenshin Gacha']) AS b
    )
WHERE "unitNumber" = 753
AND "name" = 'Kaoru Cat'
AND "isCollab" = false;
