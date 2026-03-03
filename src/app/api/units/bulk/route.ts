import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { logBulkActivities } from "@/lib/activity-logger";

const FORM_LABELS: Record<number, string> = {
  1: "Form 1",
  2: "Form 2",
  3: "True Form",
  4: "Ultra Form",
};

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
    const allUnitIds = updates.map((u) => u.unitId);

    // Fetch previous form levels for activity comparison
    // @ts-ignore
    const existingProgress: { unitId: string; formLevel: number }[] = await (prisma as any).userUnitProgress.findMany({
      where: { userId, unitId: { in: allUnitIds } },
      select: { unitId: true, formLevel: true },
    });
    const prevLevels = new Map(existingProgress.map((p) => [p.unitId, p.formLevel]));

    // Fetch unit names
    // @ts-ignore
    const units: { id: string; name: string }[] = await (prisma as any).unit.findMany({
      where: { id: { in: allUnitIds } },
      select: { id: true, name: true },
    });
    const nameMap = new Map(units.map((u) => [u.id, u.name]));

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

    // Build activity entries by comparing old vs new
    const entries: { type: string; itemName: string; detail?: string }[] = [];
    for (const u of updates) {
      const prev = prevLevels.get(u.unitId) ?? 0;
      const name = nameMap.get(u.unitId) ?? "Unknown unit";
      if (prev === u.formLevel) continue; // no change

      if (prev === 0 && u.formLevel > 0) {
        // Newly obtained
        entries.push({ type: "UNIT_OBTAINED", itemName: name, detail: FORM_LABELS[u.formLevel] });
      } else if (u.formLevel === 0) {
        // Removed
        entries.push({ type: "UNIT_REMOVED", itemName: name });
      } else if (u.formLevel > prev) {
        // Evolved to higher form
        entries.push({ type: "UNIT_EVOLVED", itemName: name, detail: FORM_LABELS[u.formLevel] });
      }
    }
    await logBulkActivities(userId, entries);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
