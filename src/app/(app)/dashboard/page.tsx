import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

import { legendSubchapterPercent, storyChapterPercent } from "@/lib/progress";
import { ensureStoryProgress, ensureMedalProgress, ensureMilestoneProgress } from "@/lib/ensure-progress";
import { ensureMilestoneCatalog, CATEGORY_META } from "@/lib/milestone-catalog";

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
    return { id: ch.id, name: ch.displayName, pct };
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
    return { id: s.id, name: s.displayName, pct };
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
  const unitTotal = await (prisma as any).unit.count({
    where: { source: { not: "UNOBTAINABLE" } },
  });
  const unitObtained = await (prisma as any).userUnitProgress.count({
    where: {
      userId,
      formLevel: { gte: 1 },
      unit: { source: { not: "UNOBTAINABLE" } },
    },
  });
  const unitsOverall = unitTotal === 0 ? 0 : Math.round((unitObtained / unitTotal) * 100);

  // ── Overall ──────────────────────────────────────────────────────────────
  const overall = Math.round((storyOverall + legendOverall + medalsOverall + milestonesOverall + unitsOverall) / 5);

  return (
    <div className="p-4 pt-16 md:p-8 space-y-6 w-full">
      <h1 className="text-2xl font-semibold text-gray-100">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 md:gap-3">
        <StatCard title="Overall"     pct={overall}           highlight />
        <StatCard title="Story"       pct={storyOverall} />
        <StatCard title="Legend"      pct={legendOverall} />
        <StatCard title="Medals"      pct={medalsOverall} />
        <StatCard title="Milestones"  pct={milestonesOverall} />
        <StatCard title="Units"       pct={unitsOverall} sub={`${unitObtained}/${unitTotal}`} />
      </div>

      {/* Story + Legend side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section title="Story Chapters">
          <div className="space-y-1.5">
            {storyRows.map((r) => (
              <CompactRow key={r.id} label={r.name} pct={r.pct} />
            ))}
          </div>
        </Section>

        <Section title="Legend Stages">
          <div className="space-y-1.5">
            {legendRows.map((r) => (
              <CompactRow key={r.id} label={r.name} pct={r.pct} />
            ))}
          </div>
        </Section>
      </div>

      {/* Medals + Milestones side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section title={`Meow Medals — ${medalEarned}/${medalTotal}`}>
          <div className="space-y-1.5">
            {medalCategoryRows.map((r) => (
              <CompactRow key={r.category} label={r.category} pct={r.pct} sub={`${r.earned}/${r.total}`} />
            ))}
          </div>
        </Section>

        <Section title={`Milestone Stages — ${milestoneCleared}/${milestoneTotal}`}>
          <div className="space-y-1.5">
            {milestoneCategoryRows.map((r) => (
              <CompactRow key={r.label} label={r.label} pct={r.pct} sub={`${r.cleared}/${r.total}`} />
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

/* ── Helpers ───────────────────────────────────────────────────────────────── */

function pctColor(pct: number) {
  if (pct >= 80) return "#fbbf24"; // amber-400
  if (pct >= 40) return "#d97706"; // amber-600
  if (pct > 0)   return "#92400e"; // amber-800
  return "#4b5563"; // gray-600
}

function barFill(pct: number) {
  if (pct >= 80) return "bg-amber-400";
  if (pct >= 40) return "bg-amber-600";
  if (pct > 0)   return "bg-amber-800";
  return "bg-gray-700";
}

function StatCard({ title, pct, highlight = false, sub }: { title: string; pct: number; highlight?: boolean; sub?: string }) {
  return (
    <div className={`border rounded-lg p-3 md:p-4 bg-black ${highlight ? "border-amber-800" : "border-gray-700"}`}>
      <div className="text-xs md:text-sm text-gray-400 mb-1">{title}</div>
      <div className="text-2xl md:text-3xl font-semibold" style={{ color: pctColor(pct) }}>{pct}%</div>
      {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
      <div className="mt-3 h-2 rounded bg-gray-800 overflow-hidden">
        <div className={`h-2 ${barFill(pct)}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-gray-700 rounded-lg p-5 bg-black h-full">
      <h2 className="text-sm font-semibold text-gray-300 mb-3 pb-2 border-b border-gray-800">{title}</h2>
      {children}
    </div>
  );
}

function CompactRow({ label, pct, sub }: { label: string; pct: number; sub?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-[30%] text-sm text-gray-300 truncate flex-shrink-0">{label}</div>
      <div className="flex-1 h-2 rounded bg-gray-800 overflow-hidden">
        <div className={`h-2 ${barFill(pct)}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="w-16 text-right text-sm flex-shrink-0" style={{ color: pctColor(pct) }}>
        {sub ?? `${pct}%`}
      </div>
    </div>
  );
}
