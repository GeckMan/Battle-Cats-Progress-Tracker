import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

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
    if (formLevel === 0) {
      // Remove progress record (treat as "not obtained")
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
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
