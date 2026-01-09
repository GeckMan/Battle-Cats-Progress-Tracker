import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  // @ts-expect-error
  const userId = session.user.id as string;

  const { id, patch } = await req.json();

  if (typeof id !== "string" || !patch || typeof patch !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const allowed: Record<string, boolean> = { crownMax: true, status: true };
for (const key of Object.keys(patch)) {
  if (!allowed[key]) {
    return NextResponse.json({ error: `Field not allowed: ${key}` }, { status: 400 });
  }
}

// crownMax: null or 1..4 (client uses null for 0)
if (patch.crownMax !== undefined && patch.crownMax !== null) {
  const c = Number(patch.crownMax);
  if (!Number.isFinite(c) || c < 1 || c > 4) {
    return NextResponse.json(
      { error: "Invalid crownMax (must be 1–4 or null)" },
      { status: 400 }
    );
  }
}

if (patch.status !== undefined) {
  const s = String(patch.status);
  if (s !== "NOT_STARTED" && s !== "IN_PROGRESS" && s !== "COMPLETED") {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
}


  await prisma.userLegendProgress.updateMany({
    where: { id, userId },
    data: patch,
  });

  return NextResponse.json({ ok: true });
}
