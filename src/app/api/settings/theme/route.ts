import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

const VALID_THEMES = ["default", "nerv"] as const;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: { theme: true },
    });

    return NextResponse.json({ theme: user?.theme ?? "default" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user.id as string;

    const rl = await checkRateLimit(`theme:${userId}`, 10, 60 * 1000);
    if (rl.limited) return rateLimitResponse(rl.retryAfterMs);

    const body = await req.json();
    const theme = body.theme;

    if (!VALID_THEMES.includes(theme)) {
      return NextResponse.json({ error: "Invalid theme" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.user.id as string },
      data: { theme },
    });

    return NextResponse.json({ theme });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
