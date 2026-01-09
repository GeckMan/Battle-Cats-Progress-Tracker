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
  const { id, patch } = await req.json();

  await prisma.userStoryProgress.updateMany({
    where: { id, userId },
    data: patch,
  });
await recomputeStoryMedalsForUser(userId);


  return NextResponse.json({ ok: true });
}
