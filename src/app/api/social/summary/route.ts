import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id as string;

  // Run all three queries in parallel — no dependency between them
  const [incoming, outgoing, friendships] = await Promise.all([
    prisma.friendship.findMany({
      where: { addresseeId: userId, status: "PENDING" },
      select: {
        id: true,
        requester: { select: { id: true, username: true, displayName: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.friendship.findMany({
      where: { requesterId: userId, status: "PENDING" },
      select: {
        id: true,
        addressee: { select: { id: true, username: true, displayName: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.friendship.findMany({
      where: {
        status: "ACCEPTED",
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      select: {
        id: true,
        requesterId: true,
        addresseeId: true,
        requester: { select: { id: true, username: true, displayName: true } },
        addressee: { select: { id: true, username: true, displayName: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const friends = friendships.map((f) => {
    const other = f.requesterId === userId ? f.addressee : f.requester;
    return { id: f.id, user: other };
  });

  return NextResponse.json({
    incoming: incoming.map((r) => ({ id: r.id, from: r.requester })),
    outgoing: outgoing.map((r) => ({ id: r.id, to: r.addressee })),
    friends,
  });
}
