import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { CURRENT_UPDATE } from "@/lib/whats-new";

/** POST /api/whats-new { id } — marks the current "What's new" announcement as seen. */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = (await req.json().catch(() => ({}))) as { id?: string };
    if (body.id !== CURRENT_UPDATE.id) return NextResponse.json({ error: "Unknown update" }, { status: 400 });
    await (prisma as any).user.update({ where: { id: session.user.id as string }, data: { seenUpdateId: body.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
