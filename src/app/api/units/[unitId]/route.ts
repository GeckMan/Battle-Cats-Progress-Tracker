import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";

const FORM_LABELS: Record<number, string> = {
  1: "Form 1",
  2: "Form 2",
  3: "True Form",
  4: "Ultra Form",
};

export async function PATCH(
  req: Request,
  props: { params: Promise<{ unitId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id as string;

  const { unitId } = await props.params;
  const body = await req.json();
  const formLevel = typeof body.formLevel === "number" ? body.formLevel : 0;

  if (formLevel < 0 || formLevel > 4) {
    return NextResponse.json({ error: "Invalid formLevel" }, { status: 400 });
  }

  try {
    // Get previous state for activity logging
    // @ts-ignore
    const prev = await (prisma as any).userUnitProgress.findUnique({
      where: { userId_unitId: { userId, unitId } },
      select: { formLevel: true },
    });
    const prevLevel = prev?.formLevel ?? 0;

    if (formLevel === 0) {
      // @ts-ignore – UserUnitProgress added in new migration
      await (prisma as any).userUnitProgress.deleteMany({
        where: { userId, unitId },
      });
    } else {
      // @ts-ignore
      await (prisma as any).userUnitProgress.upsert({
        where: { userId_unitId: { userId, unitId } },
        create: { userId, unitId, formLevel },
        update: { formLevel },
      });
    }

    // Log activity if something changed
    if (prevLevel !== formLevel) {
      // @ts-ignore
      const unit = await (prisma as any).unit.findUnique({
        where: { id: unitId },
        select: { name: true },
      });
      const name = unit?.name ?? "Unknown unit";

      if (prevLevel === 0 && formLevel > 0) {
        await logActivity(userId, "UNIT_OBTAINED", name, FORM_LABELS[formLevel]);
      } else if (formLevel === 0) {
        await logActivity(userId, "UNIT_REMOVED", name);
      } else if (formLevel > prevLevel) {
        await logActivity(userId, "UNIT_EVOLVED", name, FORM_LABELS[formLevel]);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
