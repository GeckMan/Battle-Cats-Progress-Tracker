import { prisma } from "@/lib/prisma";
import { privateProgressUserIds } from "@/lib/access";

const legacyMarker = (v: string | null | undefined): Date | null => {
  if (!v) return null;
  const d = new Date(v);
  // epoch / garbage = "never seen" placeholder from old clients, not a real marker
  return isNaN(d.getTime()) || d.getTime() <= 0 ? null : d;
};

/**
 * Unread chat / friend-activity counts for the right-panel badges, using the
 * per-account "last read" markers (see /api/unread-counts for the history).
 * Shared by /api/unread-counts and /api/heartbeat.
 */
export async function computeUnread(userId: string, legacyChatSince?: string | null, legacyActivitySince?: string | null) {
  const user = (await (prisma as any).user.findUnique({
    where: { id: userId },
    select: { chatLastSeenAt: true, activityLastSeenAt: true },
  })) as { chatLastSeenAt: Date | null; activityLastSeenAt: Date | null } | null;

  const now = new Date();
  const chatSince: Date = user?.chatLastSeenAt ?? legacyMarker(legacyChatSince) ?? now;
  const activitySince: Date = user?.activityLastSeenAt ?? legacyMarker(legacyActivitySince) ?? now;

  const init: Record<string, Date> = {};
  if (!user?.chatLastSeenAt) init.chatLastSeenAt = chatSince;
  if (!user?.activityLastSeenAt) init.activityLastSeenAt = activitySince;

  const friendships = await prisma.friendship.findMany({
    where: { status: "ACCEPTED", OR: [{ requesterId: userId }, { addresseeId: userId }] },
    select: { requesterId: true, addresseeId: true },
  });
  const allFriendIds = friendships.map((f) => (f.requesterId === userId ? f.addresseeId : f.requesterId));
  const hidden = await privateProgressUserIds(allFriendIds); // same rule as /api/activity
  const friendIds = allFriendIds.filter((id) => !hidden.has(id));

  const [unreadActivity, unreadChat] = await Promise.all([
    // One per friend per day, not one per row: a single sitting can log dozens of
    // entries (BVG's 16 unit/legend changes showed as "16"), but the feed groups
    // them, so the badge should count updates the way people read them (2026-11-18).
    friendIds.length === 0
      ? Promise.resolve(0)
      : prisma
          .$queryRaw<{ n: bigint }[]>`
            SELECT COUNT(*) AS n FROM (
              SELECT DISTINCT "userId", date_trunc('day', "createdAt")
              FROM "Activity"
              WHERE "userId" = ANY(${friendIds}) AND "createdAt" > ${activitySince}
            ) t`
          .then((rows) => Number(rows[0]?.n ?? 0)),
    (prisma as any).chatMessage.count({
      where: { userId: { not: userId }, createdAt: { gt: chatSince }, deletedAt: null },
    }),
    Object.keys(init).length
      ? (prisma as any).user.update({ where: { id: userId }, data: init }).catch(() => {})
      : Promise.resolve(),
  ]);
  return { unreadActivity: unreadActivity as number, unreadChat: unreadChat as number };
}
