import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

/**
 * story.treasures.EoC.1
 * story.zombies.ItF.2
 */
function parseStoryAutoKey(key: string) {
  const parts = key.split(".");
  if (parts.length !== 4) return null;

  const [scope, kind, arc, chStr] = parts;
  if (scope !== "story") return null;
  if (kind !== "treasures" && kind !== "zombies") return null;

  const chapterNumber = Number(chStr);
  if (!Number.isFinite(chapterNumber)) return null;

  return { kind, arc, chapterNumber };
}

/**
 * legend.subchapter.<subchapterId>.clear
 * legend.subchapter.<subchapterId>.crown.<N>
 * legend.saga.SOL.crown.<N>
 */
function parseLegendAutoKey(key: string) {
  const parts = key.split(".");
  if (parts.length < 4) return null;
  if (parts[0] !== "legend") return null;

  // legend.subchapter.<id>.clear OR legend.subchapter.<id>.crown.<N>
  if (parts[1] === "subchapter") {
    const subchapterId = parts[2];
    const kind = parts[3];

    if (kind === "clear" && parts.length === 4) {
      return { type: "LEGEND_SUBCHAPTER_CLEAR" as const, subchapterId };
    }

    if (kind === "crown" && parts.length === 5) {
      const crown = Number(parts[4]);
      if (!Number.isFinite(crown)) return null;
      return { type: "LEGEND_SUBCHAPTER_CROWN" as const, subchapterId, crown };
    }

    return null;
  }

  // legend.saga.SOL.crown.<N>
  if (parts[1] === "saga") {
    const sagaKey = parts[2]; // SOL | UL | ZL
    const kind = parts[3];

    if (kind === "crown" && parts.length === 5) {
      const crown = Number(parts[4]);
      if (!Number.isFinite(crown)) return null;
      return { type: "LEGEND_SAGA_CROWN" as const, sagaKey, crown };
    }

    return null;
  }

  return null;
}

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id as string;

  // 1) Load all medals that have an autoKey
  const medals = await prisma.meowMedal.findMany({
    where: { autoKey: { not: null } },
    select: { id: true, autoKey: true },
  });

  if (medals.length === 0) {
    return NextResponse.json({ updated: 0, medals: 0, evaluated: 0 });
  }

  // 2–4) Fetch all required data in parallel to reduce total DB round-trips
  const [story, legend, sagaRows, sagaSubs] = await Promise.all([
    prisma.userStoryProgress.findMany({
      where: { userId },
      select: {
        chapter: { select: { arc: true, chapterNumber: true } },
        treasures: true,
        zombies: true,
      },
    }),
    prisma.userLegendProgress.findMany({
      where: { userId },
      select: { subchapterId: true, status: true, crownMax: true },
    }),
    prisma.legendSaga.findMany({
      where: { displayName: { in: ["Stories of Legend", "Uncanny Legends", "Zero Legends"] } },
      select: { id: true, displayName: true },
    }),
    prisma.legendSubchapter.findMany({
      select: { id: true, sagaId: true },
    }),
  ]);

  const storyByKey = new Map<string, { treasures: string; zombies: string }>();
  for (const r of story) {
    const k = `${r.chapter.arc}.${r.chapter.chapterNumber}`;
    storyByKey.set(k, { treasures: r.treasures, zombies: r.zombies });
  }

  // legendBySub: subchapterId -> { status, crownMax }
  const legendBySub = new Map(
    legend.map((r) => [
      r.subchapterId,
      { status: r.status, crownMax: r.crownMax ?? 0 },
    ])
  );

  const sagaIdByKey = new Map<string, string>();
  for (const s of sagaRows) {
    if (s.displayName === "Stories of Legend") sagaIdByKey.set("SOL", s.id);
    if (s.displayName === "Uncanny Legends") sagaIdByKey.set("UL", s.id);
    if (s.displayName === "Zero Legends") sagaIdByKey.set("ZL", s.id);
  }

  const subIdsBySagaId = new Map<string, string[]>();
  for (const sc of sagaSubs) {
    if (!subIdsBySagaId.has(sc.sagaId)) subIdsBySagaId.set(sc.sagaId, []);
    subIdsBySagaId.get(sc.sagaId)!.push(sc.id);
  }

  function sagaHasCrown(sagaKey: string, crown: number) {
    const sagaId = sagaIdByKey.get(sagaKey);
    if (!sagaId) return false;

    const subIds = subIdsBySagaId.get(sagaId) ?? [];
    if (subIds.length === 0) return false;

    // Require crownMax >= N for EVERY subchapter in the saga.
    for (const subId of subIds) {
      const p = legendBySub.get(subId);
      const cm = p?.crownMax ?? 0;
      if (cm < crown) return false;
    }

    return true;
  }

  // 5) Compute desired earned state for each auto medal
  const desired = new Map<string, boolean>(); // meowMedalId -> earned

  for (const m of medals) {
    const ak = m.autoKey!;
    // Story medals
    const s = parseStoryAutoKey(ak);
    if (s) {
      const k = `${s.arc}.${s.chapterNumber}`;
      const prog = storyByKey.get(k);

      const earned =
        s.kind === "treasures"
          ? prog?.treasures === "ALL"
          : prog?.zombies === "ALL";

      desired.set(m.id, Boolean(earned));
      continue;
    }

    // Legend medals
    const l = parseLegendAutoKey(ak);

    if (l?.type === "LEGEND_SUBCHAPTER_CLEAR") {
      const p = legendBySub.get(l.subchapterId);
      desired.set(m.id, p?.status === "COMPLETED");
      continue;
    }

    if (l?.type === "LEGEND_SUBCHAPTER_CROWN") {
      const p = legendBySub.get(l.subchapterId);
      desired.set(m.id, (p?.crownMax ?? 0) >= l.crown);
      continue;
    }

    if (l?.type === "LEGEND_SAGA_CROWN") {
      desired.set(m.id, sagaHasCrown(l.sagaKey, l.crown));
      continue;
    }
  }

  // 6) Load existing rows to preserve original earnedAt timestamps
  const existingRows = await prisma.userMeowMedal.findMany({
    where: { userId, meowMedalId: { in: Array.from(desired.keys()) } },
    select: { meowMedalId: true, earned: true, earnedAt: true },
  });
  const existingByMedal = new Map(existingRows.map((r) => [r.meowMedalId, r]));

  // 7) Batch all upserts in a single transaction instead of N sequential awaits
  const now = new Date();
  const ops = Array.from(desired.entries()).map(([meowMedalId, earned]) => {
    const existing = existingByMedal.get(meowMedalId);
    // Preserve original earnedAt — only stamp it the first time earned becomes true
    const earnedAt = earned ? (existing?.earnedAt ?? now) : null;

    return prisma.userMeowMedal.upsert({
      where: { userId_meowMedalId: { userId, meowMedalId } },
      create: { userId, meowMedalId, earned, earnedAt },
      update: { earned, earnedAt },
      select: { meowMedalId: true },
    });
  });

  await prisma.$transaction(ops);

  return NextResponse.json({
    updated: ops.length,
    medals: medals.length,
    evaluated: desired.size,
  });
}
