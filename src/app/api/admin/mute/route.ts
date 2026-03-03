import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { userId, minutes, unmute } = body as {
    userId?: string;
    minutes?: number;
    unmute?: boolean;
  };

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  // Look up the target user
  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, role: true },
  });

  if (!target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (target.role === "ADMIN") {
    return NextResponse.json({ error: "Cannot mute an admin" }, { status: 400 });
  }

  if (unmute) {
    // @ts-ignore – chatMutedUntil added in new migration
    await (prisma as any).user.update({
      where: { id: userId },
      data: { chatMutedUntil: null },
    });
    return NextResponse.json({ success: true, message: `${target.username} has been unmuted` });
  }

  if (!minutes || minutes <= 0) {
    return NextResponse.json({ error: "minutes must be a positive number" }, { status: 400 });
  }

  const mutedUntil = new Date(Date.now() + minutes * 60 * 1000);
  // @ts-ignore – chatMutedUntil added in new migration
  await (prisma as any).user.update({
    where: { id: userId },
    data: { chatMutedUntil: mutedUntil },
  });

  return NextResponse.json({
    success: true,
    message: `${target.username} muted until ${mutedUntil.toISOString()}`,
    mutedUntil: mutedUntil.toISOString(),
  });
}
