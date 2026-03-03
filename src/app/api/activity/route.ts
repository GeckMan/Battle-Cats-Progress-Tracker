import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id as string;

  const { searchParams } = new URL(req.url);
  const offset = Math.max(0, Number(searchParams.get("offset") ?? 0));
  const limit = Math.min(200, Math.max(1, Number(searchParams.get("limit") ?? 100)));

  // Get accepted friend IDs (both directions)
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

  // Include self + all accepted friends
  const userIds = [userId, ...friendIds];

  // @ts-ignore – Activity model added in new migration
  const activities = await (prisma as any).activity.findMany({
    where: { userId: { in: userIds } },
    orderBy: { createdAt: "desc" },
    skip: offset,
    take: limit + 1, // fetch one extra to determine if there's more
    include: {
      user: {
        select: { id: true, username: true, displayName: true },
      },
    },
  });

  const hasMore = activities.length > limit;
  const items = hasMore ? activities.slice(0, limit) : activities;

  return NextResponse.json({
    activities: items.map((a: any) => ({
      id: a.id,
      userId: a.userId,
      username: a.user.username,
      displayName: a.user.displayName,
      type: a.type,
      itemName: a.itemName,
      detail: a.detail,
      createdAt: a.createdAt,
    })),
    nextOffset: hasMore ? offset + limit : null,
  });
}
