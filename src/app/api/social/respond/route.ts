import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id as string;

    const rl = await checkRateLimit(`social-resp:${userId}`, 20, 60 * 1000);
    if (rl.limited) return rateLimitResponse(rl.retryAfterMs);

    const { requestId, action } = await req.json();

    if (typeof requestId !== "string" || (action !== "accept" && action !== "reject")) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Must be addressee of that pending request
    const reqRow = await prisma.friendship.findFirst({
      where: { id: requestId, addresseeId: userId, status: "PENDING" },
      select: { id: true },
    });

    if (!reqRow) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (action === "accept") {
      await prisma.friendship.update({
        where: { id: requestId },
        data: { status: "ACCEPTED" },
      });
    } else {
      // reject = delete row (keeps schema simple)
      await prisma.friendship.delete({ where: { id: requestId } });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
