-- Per-account "last read" markers for the chat / activity unread badges.
-- Before this, the marker lived only in the browser's localStorage, so a new
-- account, new browser/device, cleared storage or private window counted every
-- chat message ever posted and the badge always showed "99+" (Ryan, 2026-11-17).
ALTER TABLE "User" ADD COLUMN "chatLastSeenAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "activityLastSeenAt" TIMESTAMP(3);
