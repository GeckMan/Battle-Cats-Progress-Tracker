import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { recomputeStoryMedalsForUser } from "@/lib/medals";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  // @ts-expect-error
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

  await prisma.userStoryProgress.updateMany({
    where: { id: { in: ids }, userId },
    data: patch,
  });
  await recomputeStoryMedalsForUser(userId);

  return NextResponse.json({ ok: true });
}
