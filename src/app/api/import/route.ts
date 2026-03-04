import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/import — Restore user progress from an exported JSON file.
 *
 * Validates all referenced entities exist, then upserts all progress
 * within a single transaction for atomicity.
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id as string;

  let data: any;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // ---- Basic validation ----
  if (!data || data.version !== 1) {
    return NextResponse.json(
      { error: "Unsupported export format. Expected version 1." },
      { status: 400 },
    );
  }

  const errors: string[] = [];

  // ---- Build lookup maps for all catalog entities ----
  const [allChapters, allSubchapters, allUnits, allMedals, allMilestones] = await Promise.all([
    (prisma as any).storyChapter.findMany({
      select: { id: true, arc: true, chapterNumber: true },
    }),
    (prisma as any).legendSubchapter.findMany({
      include: { saga: { select: { displayName: true } } },
      select: { id: true, displayName: true, saga: { select: { displayName: true } } },
    }),
    (prisma as any).unit.findMany({ select: { id: true, unitNumber: true } }),
    (prisma as any).meowMedal.findMany({ select: { id: true, name: true } }),
    (prisma as any).milestone.findMany({ select: { id: true, displayName: true, category: true } }),
  ]);

  // Chapter lookup: "arc:chapterNumber" → id
  const chapterMap = new Map<string, string>();
  for (const ch of allChapters) {
    chapterMap.set(`${ch.arc}:${ch.chapterNumber}`, ch.id);
  }

  // Subchapter lookup: "saga:subchapter" → id
  const subchapterMap = new Map<string, string>();
  for (const sc of allSubchapters) {
    subchapterMap.set(`${sc.saga.displayName}:${sc.displayName}`, sc.id);
  }

  // Unit lookup: unitNumber → id
  const unitMap = new Map<number, string>();
  for (const u of allUnits) {
    unitMap.set(u.unitNumber, u.id);
  }

  // Medal lookup: name → id
  const medalMap = new Map<string, string>();
  for (const m of allMedals) {
    medalMap.set(m.name, m.id);
  }

  // Milestone lookup: "category:displayName" → id
  const milestoneMap = new Map<string, string>();
  for (const ms of allMilestones) {
    milestoneMap.set(`${ms.category}:${ms.displayName}`, ms.id);
  }

  // ---- Validate & prepare story upserts ----
  const storyOps: any[] = [];
  if (Array.isArray(data.story)) {
    for (const s of data.story) {
      const key = `${s.arc}:${s.chapterNumber}`;
      const chapterId = chapterMap.get(key);
      if (!chapterId) {
        errors.push(`Story chapter not found: ${s.chapterName ?? key}`);
        continue;
      }
      storyOps.push({
        where: { userId_storyChapterId: { userId, storyChapterId: chapterId } },
        create: {
          userId,
          storyChapterId: chapterId,
          cleared: s.cleared ?? false,
          treasures: s.treasures ?? "NONE",
          zombies: s.zombies ?? "NONE",
        },
        update: {
          cleared: s.cleared ?? false,
          treasures: s.treasures ?? "NONE",
          zombies: s.zombies ?? "NONE",
        },
      });
    }
  }

  // ---- Validate & prepare legend upserts ----
  const legendOps: any[] = [];
  if (Array.isArray(data.legend)) {
    for (const l of data.legend) {
      const key = `${l.saga}:${l.subchapter}`;
      const subId = subchapterMap.get(key);
      if (!subId) {
        errors.push(`Legend subchapter not found: ${l.subchapter} in ${l.saga}`);
        continue;
      }
      legendOps.push({
        where: { userId_subchapterId: { userId, subchapterId: subId } },
        create: {
          userId,
          subchapterId: subId,
          status: l.status ?? "NOT_STARTED",
          crownMax: l.crownMax ?? null,
          notes: l.notes ?? null,
        },
        update: {
          status: l.status ?? "NOT_STARTED",
          crownMax: l.crownMax ?? null,
          notes: l.notes ?? null,
        },
      });
    }
  }

  // ---- Validate & prepare unit upserts ----
  const unitOps: any[] = [];
  if (Array.isArray(data.units)) {
    for (const u of data.units) {
      const unitId = unitMap.get(u.unitNumber);
      if (!unitId) {
        errors.push(`Unit not found: #${u.unitNumber} (${u.unitName ?? "unknown"})`);
        continue;
      }
      const formLevel = Math.max(0, Math.min(4, Number(u.formLevel) || 0));
      unitOps.push({
        where: { userId_unitId: { userId, unitId } },
        create: { userId, unitId, formLevel },
        update: { formLevel },
      });
    }
  }

  // ---- Validate & prepare medal upserts ----
  const medalOps: any[] = [];
  if (Array.isArray(data.medals)) {
    for (const m of data.medals) {
      const medalId = medalMap.get(m.name);
      if (!medalId) {
        errors.push(`Medal not found: ${m.name}`);
        continue;
      }
      medalOps.push({
        where: { userId_meowMedalId: { userId, meowMedalId: medalId } },
        create: {
          userId,
          meowMedalId: medalId,
          earned: m.earned ?? true,
          earnedAt: m.earnedAt ? new Date(m.earnedAt) : new Date(),
        },
        update: {
          earned: m.earned ?? true,
          earnedAt: m.earnedAt ? new Date(m.earnedAt) : new Date(),
        },
      });
    }
  }

  // ---- Validate & prepare milestone upserts ----
  const milestoneOps: any[] = [];
  if (Array.isArray(data.milestones)) {
    for (const ms of data.milestones) {
      const key = `${ms.category}:${ms.name}`;
      const msId = milestoneMap.get(key);
      if (!msId) {
        errors.push(`Milestone not found: ${ms.name} (${ms.category})`);
        continue;
      }
      milestoneOps.push({
        where: { userId_milestoneId: { userId, milestoneId: msId } },
        create: {
          userId,
          milestoneId: msId,
          cleared: ms.cleared ?? true,
          notes: ms.notes ?? null,
        },
        update: {
          cleared: ms.cleared ?? true,
          notes: ms.notes ?? null,
        },
      });
    }
  }

  // ---- Catclaw ----
  const catclawOp = data.catclaw
    ? {
        where: { userId },
        create: {
          userId,
          currentRank: data.catclaw.currentRank ?? null,
          bestRank: data.catclaw.bestRank ?? null,
          notes: data.catclaw.notes ?? null,
        },
        update: {
          currentRank: data.catclaw.currentRank ?? null,
          bestRank: data.catclaw.bestRank ?? null,
          notes: data.catclaw.notes ?? null,
        },
      }
    : null;

  // If there are critical errors (too many missing refs), bail out
  if (errors.length > 20) {
    return NextResponse.json(
      { error: "Too many validation errors. Is this the right export file?", details: errors.slice(0, 20) },
      { status: 400 },
    );
  }

  // ---- Execute all upserts in a transaction ----
  try {
    await (prisma as any).$transaction(async (tx: any) => {
      // Story
      for (const op of storyOps) {
        await tx.userStoryProgress.upsert(op);
      }
      // Legend
      for (const op of legendOps) {
        await tx.userLegendProgress.upsert(op);
      }
      // Units
      for (const op of unitOps) {
        await tx.userUnitProgress.upsert(op);
      }
      // Medals
      for (const op of medalOps) {
        await tx.userMeowMedal.upsert(op);
      }
      // Milestones
      for (const op of milestoneOps) {
        await tx.userMilestoneProgress.upsert(op);
      }
      // Catclaw
      if (catclawOp) {
        await tx.userCatclawProgress.upsert(catclawOp);
      }
    });
  } catch (err) {
    console.error("Import transaction error:", err);
    return NextResponse.json({ error: "Import failed. No changes were made." }, { status: 500 });
  }

  const imported = {
    story: storyOps.length,
    legend: legendOps.length,
    units: unitOps.length,
    medals: medalOps.length,
    milestones: milestoneOps.length,
    catclaw: catclawOp ? 1 : 0,
  };

  return NextResponse.json({
    ok: true,
    imported,
    warnings: errors.length > 0 ? errors : undefined,
  });
}
