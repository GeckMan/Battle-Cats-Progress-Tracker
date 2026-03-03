import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/meow-medals?userId=xxx
 * Returns all medals with earned status for the given user.
 * If no userId is provided, returns for the requesting user.
 * Requires friendship (or self) to view another user's medals.
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const viewerId = session.user.id as string;

  const { searchParams } = new URL(req.url);
  const targetUserId = searchParams.get("userId") ?? viewerId;
  const isSelf = targetUserId === viewerId;

  // If viewing someone else, verify friendship
  if (!isSelf) {
    const friendship = await prisma.friendship.findFirst({
      where: {
        status: "ACCEPTED",
        OR: [
          { requesterId: viewerId, addresseeId: targetUserId },
          { requesterId: targetUserId, addresseeId: viewerId },
        ],
      },
      select: { id: true },
    });
    if (!friendship) {
      return NextResponse.json({ error: "Not friends" }, { status: 403 });
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
}
