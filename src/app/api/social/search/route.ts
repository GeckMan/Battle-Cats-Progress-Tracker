import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id as string;

  // Rate limit: 30 searches per minute per user
  const rl = await checkRateLimit(`search:${userId}`, 30, 60 * 1000);
  if (rl.limited) return rateLimitResponse(rl.retryAfterMs);

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim().slice(0, 100);

  if (!q || q.length < 1) return NextResponse.json({ users: [] });

  const users = await prisma.user.findMany({
    where: {
      AND: [
        { id: { not: userId } },
        {
          OR: [
            { username: { contains: q, mode: "insensitive" } },
            { displayName: { contains: q, mode: "insensitive" } },
          ],
        },
      ],
    },
    select: { id: true, username: true, displayName: true },
    take: 10,
    orderBy: { username: "asc" },
  });

  return NextResponse.json({ users });
}
