import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // @ts-ignore – chatMutedUntil added in new migration
  const users = await (prisma as any).user.findMany({
    select: {
      id: true,
      username: true,
      displayName: true,
      role: true,
      chatMutedUntil: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const now = new Date();
  return NextResponse.json({
    users: users.map((u: any) => ({
      ...u,
      isMuted: u.chatMutedUntil ? u.chatMutedUntil > now : false,
    })),
  });
}
