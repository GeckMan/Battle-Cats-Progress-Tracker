import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { canViewProgress } from "@/lib/access";

/**
 * GET /api/meow-medals?userId=xxx
 * Returns all medals with earned status for the given user.
 * If no userId is provided, returns for the requesting user.
 * Viewing another user requires friendship and that their progress isn't PRIVATE.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const viewerId = session.user.id as string;

    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get("userId") ?? viewerId;
    const isSelf = targetUserId === viewerId;

    // Viewing someone else: friendship AND their privacy setting (admins via DB).
    if (!isSelf) {
      const access = await canViewProgress(viewerId, targetUserId);
      if (!access.ok) {
        return NextResponse.json({ error: access.reason === "private" ? "Progress is private" : "Not friends" }, { status: 403 });
      }
    }

    const medals = await prisma.meowMedal.findMany({
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
    });

    const userRows = await prisma.userMeowMedal.findMany({
      where: { userId: targetUserId, meowMedalId: { in: medals.map((m) => m.id) } },
      select: { meowMedalId: true, earned: true },
    });

    const earnedById = new Map(userRows.map((r) => [r.meowMedalId, r.earned]));

    const rows = medals.map((m) => ({
      id: m.id,
      name: m.name,
      description: m.description ?? "",
      category: m.category ?? null,
      earned: earnedById.get(m.id) ?? false,
      imageFile: m.imageFile ?? null,
    }));

    const total = rows.length;
    const earned = rows.filter((r) => r.earned).length;

    return NextResponse.json({ medals: rows, total, earned });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
