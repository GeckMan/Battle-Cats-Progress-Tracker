import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ meowMedalId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // @ts-expect-error
  const userId = session.user.id as string;

  const { meowMedalId } = await ctx.params;

  if (!meowMedalId) {
    return NextResponse.json({ error: "Missing meowMedalId" }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const earned = Boolean(body.earned);

  const updated = await prisma.userMeowMedal.upsert({
    where: { userId_meowMedalId: { userId, meowMedalId } },
    create: {
      userId,
      meowMedalId,
      earned,
      earnedAt: earned ? new Date() : null,
    },
    update: {
      earned,
      earnedAt: earned ? new Date() : null,
    },
    select: { meowMedalId: true, earned: true, earnedAt: true },
  });

  return NextResponse.json(updated);
}
