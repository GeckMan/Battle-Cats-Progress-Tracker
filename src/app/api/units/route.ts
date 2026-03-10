import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

// Units are seeded via Prisma migration 20260303000001_seed_units.
// No runtime seeding needed.

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const viewerId = session.user.id as string;

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") ?? undefined; // NORMAL | SPECIAL | …
  const hideCollab = searchParams.get("hideCollab") === "true";
  const source = searchParams.get("source") ?? undefined;
  const setName = searchParams.get("setName") ?? undefined;

  // Optional: view another user's units (read-only)
  const targetUserId = searchParams.get("userId") ?? undefined;
  let progressUserId = viewerId;

  if (targetUserId && targetUserId !== viewerId) {
    // Verify friendship
    const friendship = await prisma.friendship.findFirst({
      where: {
        status: "ACCEPTED",
        OR: [
          { requesterId: viewerId, addresseeId: targetUserId },
          { requesterId: targetUserId, addresseeId: viewerId },
        ],
      },
      select: { id: true },
    });
    if (!friendship) {
      return NextResponse.json({ error: "Not friends" }, { status: 403 });
    }

    // Check privacy
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { privacy: { select: { progressVisibility: true } } },
    });
    if (targetUser?.privacy?.progressVisibility === "PRIVATE") {
      return NextResponse.json({ error: "Progress is private" }, { status: 403 });
    }

    progressUserId = targetUserId;
  }

  // Build where clause — no pagination, load all units for the current view
  const where: Record<string, unknown> = {};
  if (category) where.category = category;
  if (hideCollab) where.isCollab = false;
  if (source) {
    where.source = source;
  } else {
    // Hide unobtainable units by default — only show when explicitly filtered
    // Use OR to include units with NULL source (e.g. Li'l cats)
    where.OR = [
      { source: null },
      { source: { not: "UNOBTAINABLE" } },
    ];
  }
  if (setName) where.banners = { has: setName };

  // @ts-ignore
  const allUnits: any[] = await (prisma as any).unit.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }],
    select: {
      id: true,
      unitNumber: true,
      name: true,
      evolvedName: true,
      trueName: true,
      ultraName: true,
      category: true,
      formCount: true,
      sortOrder: true,
      isCollab: true,
      source: true,
      setName: true,
      evolutionData: true,
    },
  });

  // Filter out placeholder/test units from BCData that have no real names.
  // These have names like "817-1", "733_1", "801-1" (unit number + form index).
  // Real unit names always contain at least one letter character.
  const PLACEHOLDER_RE = /^[\d_\-.\s]+$/;
  const units = allUnits.filter((u: any) => !PLACEHOLDER_RE.test(u.name));

  // Fetch progress for the target user on these specific units in one query
  const unitIds = units.map((u: any) => u.id);
  // @ts-ignore
  const progressRows: any[] = await (prisma as any).userUnitProgress.findMany({
    where: { userId: progressUserId, unitId: { in: unitIds } },
    select: { unitId: true, formLevel: true },
  });

  const progressMap = new Map<string, number>(
    progressRows.map((p: any) => [p.unitId, p.formLevel])
  );

  const result = units.map((u: any) => ({
    id: u.id,
    unitNumber: u.unitNumber,
    name: u.name,
    evolvedName: u.evolvedName ?? null,
    trueName: u.trueName ?? null,
    ultraName: u.ultraName ?? null,
    category: u.category,
    formCount: u.formCount,
    sortOrder: u.sortOrder,
    isCollab: u.isCollab,
    source: u.source,
    setName: u.setName,
    evolutionData: u.evolutionData ?? null,
    formLevel: progressMap.get(u.id) ?? 0,
  }));

  // Also return distinct sources and sets for filter dropdowns
  // @ts-ignore
  const allSources: any[] = await (prisma as any).$queryRaw`
    SELECT DISTINCT "source" FROM "Unit" WHERE "source" IS NOT NULL ORDER BY "source"
  `;
  // Get all unique banner names from the banners array column
  // @ts-ignore
  const allSets: any[] = await (prisma as any).$queryRaw`
    SELECT DISTINCT unnest("banners") AS "setName" FROM "Unit" ORDER BY "setName"
  `;

  // Split banner names into regular sets and collab sets
  const sets: string[] = [];
  const collabSets: string[] = [];
  for (const r of allSets) {
    const name = r.setName as string;
    if (name.endsWith(" Collaboration")) {
      collabSets.push(name);
    } else {
      sets.push(name);
    }
  }

  return NextResponse.json({
    units: result,
    total: result.length,
    sources: allSources.map((r: any) => r.source),
    sets,
    collabSets,
  });
}
