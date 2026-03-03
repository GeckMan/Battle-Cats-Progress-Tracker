import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { recomputeStoryMedalsForUser } from "@/lib/medals";
import { logBulkActivities } from "@/lib/activity-logger";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  const userId = session.user.id as string;

  const { ids, patch } = await req.json();

  if (!Array.isArray(ids) || ids.length === 0 || typeof patch !== "object" || !patch) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Only allow updating safe fields
  const allowed: Record<string, boolean> = { cleared: true, treasures: true, zombies: true };
  for (const key of Object.keys(patch)) {
    if (!allowed[key]) {
      return NextResponse.json({ error: `Field not allowed: ${key}` }, { status: 400 });
    }
  }

  // Fetch chapter names for activity logging
  const chapters = await prisma.userStoryProgress.findMany({
    where: { id: { in: ids }, userId },
    select: { chapter: { select: { displayName: true } } },
  });

  await prisma.userStoryProgress.updateMany({
    where: { id: { in: ids }, userId },
    data: patch,
  });
  await recomputeStoryMedalsForUser(userId);

  // Log activities
  const entries: { type: string; itemName: string; detail?: string }[] = [];
  for (const ch of chapters) {
    const name = ch.chapter?.displayName ?? "Unknown chapter";
    if (patch.cleared === true) entries.push({ type: "STORY_CLEARED", itemName: name });
    if (patch.treasures && patch.treasures !== "NONE") entries.push({ type: "STORY_CLEARED", itemName: name, detail: `treasures → ${patch.treasures}` });
    if (patch.zombies && patch.zombies !== "NONE") entries.push({ type: "STORY_CLEARED", itemName: name, detail: `zombies → ${patch.zombies}` });
  }
  await logBulkActivities(userId, entries);

  return NextResponse.json({ ok: true });
}
