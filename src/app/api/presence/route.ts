import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

// A user counts as "online" if we've heard a heartbeat from them within this
// window. Client pings every 60s (see RightPanelWrapper), so this gives a
// couple of missed/delayed pings worth of slack before someone drops off the
// count.
const ONLINE_WINDOW_MS = 5 * 60 * 1000;

/** GET /api/presence — site-wide count of users active in the last 5 minutes. */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const threshold = new Date(Date.now() - ONLINE_WINDOW_MS);
    const onlineCount = await (prisma as any).user.count({
      where: { lastActiveAt: { gte: threshold } },
    });

    return NextResponse.json({ onlineCount });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/** POST /api/presence — heartbeat ping marking the current user as active now. */
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user.id as string;

    const rl = await checkRateLimit(`presence:${userId}`, 6, 60 * 1000);
    if (rl.limited) return rateLimitResponse(rl.retryAfterMs);

    await (prisma as any).user.update({
      where: { id: userId },
      data: { lastActiveAt: new Date() },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
