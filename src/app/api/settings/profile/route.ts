import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id as string;

  const body = await req.json();
  const { displayName, email } = body as { displayName?: unknown; email?: unknown };

  const patch: Record<string, string | null> = {};

  if (displayName !== undefined) {
    if (typeof displayName !== "string") {
      return NextResponse.json({ error: "displayName must be a string" }, { status: 400 });
    }
    const trimmed = displayName.trim();
    if (trimmed.length > 40) {
      return NextResponse.json({ error: "Display name must be 40 characters or fewer" }, { status: 400 });
    }
    patch.displayName = trimmed || null; // empty string clears it
  }

  if (email !== undefined) {
    if (typeof email !== "string") {
      return NextResponse.json({ error: "email must be a string" }, { status: 400 });
    }
    const trimmed = email.trim().toLowerCase();
    if (trimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }
    // Check uniqueness if non-empty
    if (trimmed) {
      const conflict = await prisma.user.findFirst({
        where: { email: trimmed, NOT: { id: userId } },
        select: { id: true },
      });
      if (conflict) {
        return NextResponse.json({ error: "Email is already in use" }, { status: 409 });
      }
    }
    patch.email = trimmed || null;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: patch,
    select: { displayName: true, email: true },
  });

  return NextResponse.json({ ok: true, ...updated });
}
