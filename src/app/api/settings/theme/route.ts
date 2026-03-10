import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

const VALID_THEMES = ["default", "nerv"] as const;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id as string },
    select: { theme: true },
  });

  return NextResponse.json({ theme: user?.theme ?? "default" });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
}
