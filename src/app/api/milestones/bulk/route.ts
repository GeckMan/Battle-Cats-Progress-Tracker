import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { logBulkActivities } from "@/lib/activity-logger";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user.id as string;

    // Rate limit: 30 per minute per user
    const rl = await checkRateLimit(`milestones-bulk:${userId}`, 30, 60 * 1000);
    if (rl.limited) return rateLimitResponse(rl.retryAfterMs);

    const body = await req.json();
    const { ids, cleared } = body as { ids: string[]; cleared: boolean };

    if (!Array.isArray(ids) || ids.length === 0 || typeof cleared !== "boolean") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    // Fetch milestone names for activity logging
    const milestones = cleared
      ? await prisma.milestone.findMany({
          where: { id: { in: ids } },
          select: { id: true, displayName: true },
        })
      : [];

    // Upsert each milestone progress row
    await prisma.$transaction(
      ids.map((milestoneId) =>
        prisma.userMilestoneProgress.upsert({
          where: { userId_milestoneId: { userId, milestoneId } },
          update: { cleared },
          create: { userId, milestoneId, cleared },
        })
      )
    );

    // Log activities for cleared milestones
    if (cleared && milestones.length > 0) {
      const nameMap = new Map(milestones.map((m) => [m.id, m.displayName]));
      await logBulkActivities(
        userId,
        ids.map((id) => ({
          type: "MILESTONE_CLEARED",
          itemName: nameMap.get(id) ?? "Unknown milestone",
        }))
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
