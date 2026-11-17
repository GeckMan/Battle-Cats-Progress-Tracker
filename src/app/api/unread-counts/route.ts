import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { privateProgressUserIds } from "@/lib/access";

/**
 * GET /api/unread-counts — count-only unread badges for the right panel (one
 * invocation; see the CPU-quota history in git log for why this is count-only).
 *
 * "Last read" markers are stored PER ACCOUNT on the User row (chatLastSeenAt /
 * activityLastSeenAt). They used to live only in localStorage, so a new account,
 * new browser/device, cleared storage or private window counted every message
 * ever posted and the badge was stuck at "99+" (2026-11-17). Resolution order:
 *   1. the account's stored marker;
 *   2. else the browser's legacy localStorage marker (activitySince/chatSince
 *      params) if it's a real value, so existing users keep their unread state;
 *   3. else "now" — a fresh account/device starts at 0, not at the whole history.
 * A marker resolved from 2/3 is saved to the account so it sticks everywhere.
 *
 * POST /api/unread-counts  { tab: "chat" | "activity" } — marks that tab read now.
 */
const FIELD = { chat: "chatLastSeenAt", activity: "activityLastSeenAt" } as const;

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user.id as string;

    const { searchParams } = new URL(req.url);
    const legacy = (v: string | null) => {
      if (!v) return null;
      const d = new Date(v);
      // epoch / garbage = "never seen" placeholder from old clients, not a real marker
      return isNaN(d.getTime()) || d.getTime() <= 0 ? null : d;
    };

    const user = (await (prisma as any).user.findUnique({
      where: { id: userId },
      select: { chatLastSeenAt: true, activityLastSeenAt: true },
    })) as { chatLastSeenAt: Date | null; activityLastSeenAt: Date | null } | null;

    const now = new Date();
    const chatSince: Date = user?.chatLastSeenAt ?? legacy(searchParams.get("chatSince")) ?? now;
    const activitySince: Date = user?.activityLastSeenAt ?? legacy(searchParams.get("activitySince")) ?? now;

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
      (prisma as any).activity.count({
        where: { userId: { in: friendIds }, createdAt: { gt: activitySince } },
      }),
      (prisma as any).chatMessage.count({
        where: { userId: { not: userId }, createdAt: { gt: chatSince }, deletedAt: null },
      }),
      Object.keys(init).length
        ? (prisma as any).user.update({ where: { id: userId }, data: init }).catch(() => {})
        : Promise.resolve(),
    ]);

    return NextResponse.json({ unreadActivity, unreadChat });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json().catch(() => ({}));
    const field = FIELD[body?.tab as keyof typeof FIELD];
    if (!field) return NextResponse.json({ error: "Bad tab" }, { status: 400 });
    await (prisma as any).user.update({ where: { id: session.user.id as string }, data: { [field]: new Date() } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
