import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if ((session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // @ts-ignore – chatMutedUntil added in new migration
    const users = await (prisma as any).user.findMany({
      select: {
        id: true,
        username: true,
        displayName: true,
        role: true,
        chatMutedUntil: true,
        createdAt: true,
        lastActiveAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const now = new Date();
    // Same 5-minute heartbeat window used by /api/presence for the
    // site-wide online count, applied per-user here.
    const onlineThreshold = new Date(now.getTime() - 5 * 60 * 1000);
    const withStatus = users.map((u: any) => ({
      ...u,
      isMuted: u.chatMutedUntil ? u.chatMutedUntil > now : false,
      isOnline: u.lastActiveAt ? new Date(u.lastActiveAt) >= onlineThreshold : false,
    }));

    return NextResponse.json({
      users: withStatus,
      onlineCount: withStatus.filter((u: any) => u.isOnline).length,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
