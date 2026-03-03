import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

// Units are seeded via Prisma migration 20260303000001_seed_units.
// No runtime seeding needed.

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id as string;

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") ?? undefined; // NORMAL | SPECIAL | …
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const perPage = 60;

  const where = category ? { category } : {};

  // @ts-ignore
  const [units, total] = await Promise.all([
    (prisma as any).unit.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }],
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    // @ts-ignore
    (prisma as any).unit.count({ where }),
  ]);

  // Fetch progress for this user on these specific units
  const unitIds = (units as any[]).map((u: any) => u.id);
  // @ts-ignore
  const progressRows: any[] = await (prisma as any).userUnitProgress.findMany({
    where: { userId, unitId: { in: unitIds } },
    select: { unitId: true, formLevel: true },
  });

  const progressMap = new Map<string, number>(
    progressRows.map((p: any) => [p.unitId, p.formLevel])
  );

  const result = (units as any[]).map((u: any) => ({
    id: u.id,
    unitNumber: u.unitNumber,
    name: u.name,
    category: u.category,
    formCount: u.formCount,
    sortOrder: u.sortOrder,
    formLevel: progressMap.get(u.id) ?? 0,
  }));

  return NextResponse.json({ units: result, total, page, perPage });
}
