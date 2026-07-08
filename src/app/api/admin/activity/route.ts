import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/activity
 *
 * Same shape as GET /api/activity, but site-wide instead of scoped to the
 * requester's friends — admin only. Used by the "Global" tab in the
 * Activity & Chat panel.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if ((session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const offset = Math.max(0, Number(searchParams.get("offset") ?? 0));
    const limit = Math.min(200, Math.max(1, Number(searchParams.get("limit") ?? 100)));

    // @ts-ignore – Activity model
    const activities = await (prisma as any).activity.findMany({
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
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
