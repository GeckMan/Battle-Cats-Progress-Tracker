import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

const MAX_MESSAGE_LENGTH = 500;

/** GET /api/chat — fetch recent messages */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const before = searchParams.get("before"); // cursor-based pagination
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 50)));

  const where = before ? { createdAt: { lt: new Date(before) } } : {};

  // @ts-ignore – ChatMessage model added in new migration
  const messages = await (prisma as any).chatMessage.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    include: {
      user: {
        select: { id: true, username: true, displayName: true },
      },
    },
  });

  const hasMore = messages.length > limit;
  const items = hasMore ? messages.slice(0, limit) : messages;

  return NextResponse.json({
    messages: items.map((m: any) => ({
      id: m.id,
      userId: m.userId,
      username: m.user.username,
      displayName: m.user.displayName,
      content: m.content,
      createdAt: m.createdAt,
    })),
    hasMore,
  });
}

/** POST /api/chat — send a message */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id as string;

  const body = await req.json();
  const content = typeof body.content === "string" ? body.content.trim() : "";

  if (!content || content.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message must be 1-${MAX_MESSAGE_LENGTH} characters` },
      { status: 400 }
    );
  }

  // @ts-ignore
  const msg = await (prisma as any).chatMessage.create({
    data: { userId, content },
    include: {
      user: {
        select: { id: true, username: true, displayName: true },
      },
    },
  });

  return NextResponse.json({
    id: msg.id,
    userId: msg.userId,
    username: msg.user.username,
    displayName: msg.user.displayName,
    content: msg.content,
    createdAt: msg.createdAt,
  });
}
