import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { computeUnread } from "@/lib/unread";

/**
 * POST /api/heartbeat — the app shell's single background request (2026-11-18).
 * Replaces three separate timers per open tab: the presence ping (every 60s),
 * the unread-counts poll (120s) and the sidebar's friend-request poll (180s),
 * i.e. ~110 function calls an hour per tab down to ~30. In one call it:
 *   • marks the user online (skipped if already marked within 45s),
 *   • returns unread chat / friend-activity counts,
 *   • returns the number of incoming friend requests.
 * Body (optional): { chatSince, activitySince } — legacy localStorage markers,
 * only used the first time for accounts without a stored marker.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user.id as string;
    const body = (await req.json().catch(() => ({}))) as { chatSince?: string; activitySince?: string };

    const now = new Date();
    const [, unread, pendingRequests] = await Promise.all([
      (prisma as any).user.updateMany({
        where: {
          id: userId,
          OR: [{ lastActiveAt: null }, { lastActiveAt: { lt: new Date(now.getTime() - 45 * 1000) } }],
        },
        data: { lastActiveAt: now },
      }),
      computeUnread(userId, body.chatSince, body.activitySince),
      prisma.friendship.count({ where: { addresseeId: userId, status: "PENDING" } }),
    ]);

    return NextResponse.json({ ...unread, pendingRequests });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
