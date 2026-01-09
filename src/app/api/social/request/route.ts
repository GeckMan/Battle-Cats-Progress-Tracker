import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // @ts-expect-error
  const userId = session.user.id as string;

  const { toUserId } = await req.json();

  if (typeof toUserId !== "string" || !toUserId) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  if (toUserId === userId) {
    return NextResponse.json({ error: "Cannot friend yourself" }, { status: 400 });
  }

  // If there is an incoming pending request from them -> accept it
  const reversePending = await prisma.friendship.findFirst({
    where: {
      requesterId: toUserId,
      addresseeId: userId,
      status: "PENDING",
    },
    select: { id: true },
  });

  if (reversePending) {
    await prisma.friendship.update({
      where: { id: reversePending.id },
      data: { status: "ACCEPTED" },
    });
    return NextResponse.json({ ok: true, autoAccepted: true });
  }

  // Otherwise create our outgoing pending request if it doesn't exist
  const existing = await prisma.friendship.findFirst({
    where: {
      requesterId: userId,
      addresseeId: toUserId,
    },
    select: { id: true, status: true },
  });

  if (existing) {
    // already exists (pending/accepted/blocked)
    return NextResponse.json({ ok: true, status: existing.status });
  }

  await prisma.friendship.create({
    data: { requesterId: userId, addresseeId: toUserId, status: "PENDING" },
  });

  return NextResponse.json({ ok: true });
}
