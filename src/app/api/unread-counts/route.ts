import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/unread-counts — combined, count-only replacement for the old
 * RightPanelWrapper pattern of polling /api/activity?limit=1 and
 * /api/chat?limit=1 every 60s, then re-fetching ?limit=200 of either one
 * whenever anything new showed up. That pattern cost up to 4 separate
 * function invocations (each with its own DB round trip) just to answer
 * "how many unread?" — a question a single COUNT query answers directly.
 * This endpoint does it in one invocation, contributing to fixing Vercel
 * Fluid Active CPU quota exhaustion (site repeatedly shut down, Oct 2026).
 *
 * Query params: activitySince, chatSince — ISO timestamps (the client's
 * "last seen" markers, same localStorage keys RightPanelWrapper already
 * tracked). Missing/invalid values default to "count everything."
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user.id as string;

    const { searchParams } = new URL(req.url);
    const parseDate = (v: string | null) => {
      if (!v) return new Date(0);
      const d = new Date(v);
      return isNaN(d.getTime()) ? new Date(0) : d;
    };
    const activitySince = parseDate(searchParams.get("activitySince"));
    const chatSince = parseDate(searchParams.get("chatSince"));

    const friendships = await prisma.friendship.findMany({
      where: {
        status: "ACCEPTED",
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      select: { requesterId: true, addresseeId: true },
    });
    const friendIds = friendships.map((f) =>
      f.requesterId === userId ? f.addresseeId : f.requesterId
    );
    const userIds = [userId, ...friendIds];

    const [unreadActivity, unreadChat] = await Promise.all([
      // @ts-ignore – Activity model added in new migration
      (prisma as any).activity.count({
        where: {
          userId: { in: userIds, not: userId },
          createdAt: { gt: activitySince },
        },
      }),
      // @ts-ignore – ChatMessage model added in new migration
      (prisma as any).chatMessage.count({
        where: {
          userId: { not: userId },
          createdAt: { gt: chatSince },
          deletedAt: null,
        },
      }),
    ]);

    return NextResponse.json({ unreadActivity, unreadChat });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
