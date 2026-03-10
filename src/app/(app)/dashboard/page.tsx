import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

import { legendSubchapterPercent, storyChapterPercent } from "@/lib/progress";
import { ensureStoryProgress, ensureMedalProgress, ensureMilestoneProgress } from "@/lib/ensure-progress";
import { ensureMilestoneCatalog, CATEGORY_META } from "@/lib/milestone-catalog";
import DashboardShell from "@/components/DashboardShell";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const userId = session.user.id as string;

  await ensureMilestoneCatalog();
  await Promise.all([
    ensureStoryProgress(userId),
    ensureMedalProgress(userId),
    ensureMilestoneProgress(userId),
  ]);

  // ── Story ────────────────────────────────────────────────────────────────
  const storyChapters = await prisma.storyChapter.findMany({
    orderBy: { sortOrder: "asc" },
    include: { progress: { where: { userId }, take: 1 } },
  });

  const storyRows = storyChapters.map((ch) => {
    const p = ch.progress[0];
    const pct = p
      ? storyChapterPercent({ cleared: p.cleared, treasures: p.treasures, zombies: p.zombies })
      : 0;
    return { label: ch.displayName, pct };
  });

  const storyOverall =
    storyRows.length === 0
      ? 0
      : Math.round(storyRows.reduce((s, r) => s + r.pct, 0) / storyRows.length);

  // ── Legend ───────────────────────────────────────────────────────────────
  const sagas = await prisma.legendSaga.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      subchapters: {
        orderBy: { sortOrder: "asc" },
        include: { progress: { where: { userId }, take: 1 } },
      },
    },
  });

  const legendRows = sagas.map((s) => {
    const percents = s.subchapters.map((sc) =>
      legendSubchapterPercent({
        sagaName: s.displayName,
        subchapterSortOrder: sc.sortOrder,
        crownMax: sc.progress[0]?.crownMax ?? null,
      })
    );
    const pct = percents.length ? Math.round(percents.reduce((a, b) => a + b, 0) / percents.length) : 0;
    return { label: s.displayName, pct };
  });

  const legendOverall =
    legendRows.length === 0
      ? 0
      : Math.round(legendRows.reduce((s, r) => s + r.pct, 0) / legendRows.length);

  // ── Medals ───────────────────────────────────────────────────────────────
  const medalsWithProgress = await prisma.meowMedal.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
    include: {
      earnedBy: { where: { userId }, select: { earned: true }, take: 1 },
    },
  });

  const medalTotal = medalsWithProgress.length;
  const medalEarned = medalsWithProgress.filter((m) => m.earnedBy[0]?.earned).length;
  const medalsOverall = medalTotal === 0 ? 0 : Math.round((medalEarned / medalTotal) * 100);

  const medalsByCategory = new Map<string, { total: number; earned: number }>();
  for (const m of medalsWithProgress) {
    const cat = m.category ?? "Other";
    const earned = Boolean(m.earnedBy[0]?.earned);
    const cur = medalsByCategory.get(cat) ?? { total: 0, earned: 0 };
    cur.total += 1;
    if (earned) cur.earned += 1;
    medalsByCategory.set(cat, cur);
  }
  const medalCategoryRows = Array.from(medalsByCategory.entries())
    .map(([category, v]) => ({
      category,
      label: category,
      ...v,
      pct: v.total === 0 ? 0 : Math.round((v.earned / v.total) * 100),
    }))
    .sort((a, b) => a.category.localeCompare(b.category));

  // ── Milestones ───────────────────────────────────────────────────────────
  const milestones = await prisma.milestone.findMany({
    include: { progress: { where: { userId }, take: 1 } },
  });

  const milestoneTotal = milestones.length;
  const milestoneCleared = milestones.filter((m) => m.progress[0]?.cleared).length;
  const milestonesOverall = milestoneTotal === 0 ? 0 : Math.round((milestoneCleared / milestoneTotal) * 100);

  const milestonesByCategory = new Map<string, { total: number; cleared: number; label: string; order: number }>();
  for (const m of milestones) {
    const meta = CATEGORY_META[m.category];
    const existing = milestonesByCategory.get(m.category) ?? { total: 0, cleared: 0, label: meta.label, order: meta.order };
    existing.total += 1;
    if (m.progress[0]?.cleared) existing.cleared += 1;
    milestonesByCategory.set(m.category, existing);
  }
  const milestoneCategoryRows = Array.from(milestonesByCategory.entries())
    .map(([, v]) => ({ ...v, pct: v.total === 0 ? 0 : Math.round((v.cleared / v.total) * 100) }))
    .sort((a, b) => a.order - b.order);

  // ── Units ────────────────────────────────────────────────────────────────
  const [unitTotal, unitObtained] = await Promise.all([
    (prisma as any).unit.count({
      where: { OR: [{ source: null }, { source: { not: "UNOBTAINABLE" } }] },
    }),
    (prisma as any).userUnitProgress.count({
      where: {
        userId,
        formLevel: { gte: 1 },
        unit: { OR: [{ source: null }, { source: { not: "UNOBTAINABLE" } }] },
      },
    }),
  ]);
  const unitsOverall = unitTotal === 0 ? 0 : Math.round((unitObtained / unitTotal) * 100);

  // ── Overall ──────────────────────────────────────────────────────────────
  const overall = Math.round((storyOverall + legendOverall + medalsOverall + milestonesOverall + unitsOverall) / 5);

  return (
    <DashboardShell
      data={{
        overall,
        storyOverall,
        legendOverall,
        medalsOverall,
        milestonesOverall,
        unitsOverall,
        unitObtained,
        unitTotal,
        storyRows,
        legendRows,
        medalCategoryRows,
        milestoneCategoryRows,
        medalEarned,
        medalTotal,
        milestoneCleared,
        milestoneTotal,
      }}
    />
  );
}
