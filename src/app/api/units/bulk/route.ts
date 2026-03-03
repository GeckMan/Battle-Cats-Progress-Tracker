import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

/** PATCH /api/units/bulk — set formLevel for multiple units at once */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id as string;

  const body = await req.json();
  const updates: { unitId: string; formLevel: number }[] = body.updates ?? [];

  if (!Array.isArray(updates) || updates.length === 0) {
    return NextResponse.json({ error: "No updates provided" }, { status: 400 });
  }

  try {
    const toDelete = updates.filter((u) => u.formLevel === 0).map((u) => u.unitId);
    const toUpsert = updates.filter((u) => u.formLevel > 0);

    await prisma.$transaction([
      ...(toDelete.length > 0
        ? [
            // @ts-ignore
            (prisma as any).userUnitProgress.deleteMany({
              where: { userId, unitId: { in: toDelete } },
            }),
          ]
        : []),
      ...toUpsert.map((u) =>
        // @ts-ignore
        (prisma as any).userUnitProgress.upsert({
          where: { userId_unitId: { userId, unitId: u.unitId } },
          create: { userId, unitId: u.unitId, formLevel: u.formLevel },
          update: { formLevel: u.formLevel },
        })
      ),
    ]);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
