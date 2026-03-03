import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id as string;

  const body = await req.json();
  const { ids, cleared } = body as { ids: string[]; cleared: boolean };

  if (!Array.isArray(ids) || ids.length === 0 || typeof cleared !== "boolean") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

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

  return NextResponse.json({ ok: true });
}
