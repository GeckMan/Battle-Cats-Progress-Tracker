import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

/**
 * POST /api/social/remove { friendshipId }
 * Unfriend (accepted) or cancel an outgoing request (pending). Either side of the
 * friendship may remove it. Added 2026-11-17: before this there was no way to
 * revoke a friendship once accepted, so a friend could see your progress forever
 * unless you set everything to private.
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user.id as string;

    const rl = await checkRateLimit(`social-remove:${userId}`, 20, 60 * 1000);
    if (rl.limited) return rateLimitResponse(rl.retryAfterMs);

    const body = await req.json().catch(() => ({}));
    const friendshipId = (body as any)?.friendshipId;
    if (typeof friendshipId !== "string") return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

    const row = await prisma.friendship.findFirst({
      where: { id: friendshipId, OR: [{ requesterId: userId }, { addresseeId: userId }] },
      select: { id: true },
    });
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.friendship.delete({ where: { id: row.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
