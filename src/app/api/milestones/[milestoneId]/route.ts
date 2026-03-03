import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ milestoneId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id as string;

  const { milestoneId } = await params;

  const body = await req.json();
  const { cleared, notes } = body as { cleared?: unknown; notes?: unknown };

  const patch: Record<string, unknown> = {};
  if (typeof cleared === "boolean") patch.cleared = cleared;
  if (typeof notes === "string") patch.notes = notes;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
  }

  try {
    const updated = await prisma.userMilestoneProgress.update({
      where: { userId_milestoneId: { userId, milestoneId } },
      data: patch,
      select: { cleared: true, notes: true, milestone: { select: { displayName: true } } },
    });

    // Log activity when a milestone is cleared
    if (cleared === true) {
      await logActivity(userId, "MILESTONE_CLEARED", (updated as any).milestone?.displayName ?? "Unknown milestone");
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Record not found" }, { status: 404 });
  }
}
