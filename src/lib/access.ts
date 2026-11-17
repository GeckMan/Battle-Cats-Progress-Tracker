import { prisma } from "@/lib/prisma";

/**
 * Shared access rules for viewing another player's data (2026-11-17 audit).
 * Before this, every page/route re-implemented "are they friends?" and several
 * forgot the privacy setting: the Compare pages, /api/meow-medals?userId= and the
 * friends activity feed all showed progress of users who set it to PRIVATE.
 * Admin status is read from the DATABASE, not the session token (a token keeps
 * its role for up to 30 days after a demotion).
 */

export async function getDbRole(userId: string): Promise<string | null> {
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  return u?.role ?? null;
}

export async function isDbAdmin(userId: string | undefined | null): Promise<boolean> {
  if (!userId) return false;
  return (await getDbRole(userId)) === "ADMIN";
}

export async function areFriends(a: string, b: string): Promise<boolean> {
  const rel = await prisma.friendship.findFirst({
    where: {
      status: "ACCEPTED",
      OR: [
        { requesterId: a, addresseeId: b },
        { requesterId: b, addresseeId: a },
      ],
    },
    select: { id: true },
  });
  return Boolean(rel);
}

export type ViewDecision = { ok: true } | { ok: false; reason: "not_friends" | "private" };

/** Can `viewerId` see `targetId`'s progress (units, story, legend, medals, milestones, activity)? */
export async function canViewProgress(viewerId: string, targetId: string): Promise<ViewDecision> {
  if (viewerId === targetId) return { ok: true };
  if (await isDbAdmin(viewerId)) return { ok: true };
  if (!(await areFriends(viewerId, targetId))) return { ok: false, reason: "not_friends" };
  const privacy = await prisma.privacySettings.findUnique({
    where: { userId: targetId },
    select: { progressVisibility: true },
  });
  if (privacy?.progressVisibility === "PRIVATE") return { ok: false, reason: "private" };
  return { ok: true };
}

/** Of these user ids, the ones whose progress is PRIVATE (to drop from friend feeds). */
export async function privateProgressUserIds(userIds: string[]): Promise<Set<string>> {
  if (!userIds.length) return new Set();
  const rows = await prisma.privacySettings.findMany({
    where: { userId: { in: userIds }, progressVisibility: "PRIVATE" },
    select: { userId: true },
  });
  return new Set(rows.map((r) => r.userId));
}
