import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { recomputeStoryMedalsForUser } from "@/lib/medals";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  const userId = session.user.id as string;

  const { id, patch } = await req.json();

  if (typeof id !== "string" || !patch || typeof patch !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Only allow updating safe fields (prevent arbitrary DB field writes)
  const allowed: Record<string, boolean> = { cleared: true, treasures: true, zombies: true };
  for (const key of Object.keys(patch)) {
    if (!allowed[key]) {
      return NextResponse.json({ error: `Field not allowed: ${key}` }, { status: 400 });
    }
  }

  if (patch.cleared !== undefined && typeof patch.cleared !== "boolean") {
    return NextResponse.json({ error: "Invalid cleared value" }, { status: 400 });
  }

  if (patch.treasures !== undefined) {
    const v = String(patch.treasures);
    if (v !== "NONE" && v !== "PARTIAL" && v !== "ALL") {
      return NextResponse.json({ error: "Invalid treasures value" }, { status: 400 });
    }
  }

  if (patch.zombies !== undefined) {
    const v = String(patch.zombies);
    if (v !== "NONE" && v !== "PARTIAL" && v !== "ALL") {
      return NextResponse.json({ error: "Invalid zombies value" }, { status: 400 });
    }
  }

  await prisma.userStoryProgress.updateMany({
    where: { id, userId },
    data: patch,
  });

  await recomputeStoryMedalsForUser(userId);

  return NextResponse.json({ ok: true });
}
