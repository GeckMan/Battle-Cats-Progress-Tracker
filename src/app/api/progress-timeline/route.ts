import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/progress-timeline
 *
 * Returns daily cumulative progress counts over the last 30 days,
 * broken down by category, plus the max possible totals for each.
 *
 * The waveform uses totals to scale each series as a percentage
 * (e.g. 120/125 medals = 96% = near the top of the chart).
 *
 * Response shape:
 * {
 *   days: string[],
 *   series: { units: number[], medals: number[], ... },
 *   totals: { units: number, medals: number, milestones: number, story: number, legend: number }
 * }
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id as string;

  const { searchParams } = new URL(req.url);
  const daysBack = Math.min(365, Math.max(7, Number(searchParams.get("days") ?? 30)));

  const since = new Date();
  since.setDate(since.getDate() - daysBack);
  since.setHours(0, 0, 0, 0);

  // ── 1. Fetch activity events ───────────────────────────────────────────
  // @ts-ignore – Activity model
  const activities: { type: string; createdAt: Date }[] = await (prisma as any).activity.findMany({
    where: { userId, createdAt: { gte: since } },
    orderBy: { createdAt: "asc" },
    select: { type: true, createdAt: true },
  });

  // @ts-ignore
  const baselineCounts = await (prisma as any).activity.groupBy({
    by: ["type"],
    where: { userId, createdAt: { lt: since } },
    _count: { id: true },
  });

  const baseline: Record<string, number> = {};
  for (const row of baselineCounts) {
    baseline[row.type] = row._count.id;
  }

  // ── 2. Query actual current counts AND max totals ──────────────────────
  const [
    realMedals, totalMedals,
    realLegend, totalLegend,
    realMilestones, totalMilestones,
    realUnits, totalUnits,
    storyProgress, totalStoryChapters,
  ] = await Promise.all([
    // Medals earned / total
    (prisma as any).userMeowMedal.count({ where: { userId, earned: true } }),
    (prisma as any).meowMedal.count(),
    // Legend completed / total subchapters
    (prisma as any).userLegendProgress.count({ where: { userId, status: "COMPLETED" } }),
    (prisma as any).legendSubchapter.count(),
    // Milestones cleared / total
    (prisma as any).userMilestoneProgress.count({ where: { userId, cleared: true } }),
    (prisma as any).milestone.count(),
    // Units obtained / total obtainable
    (prisma as any).userUnitProgress.count({
      where: {
        userId,
        formLevel: { gte: 1 },
        unit: { OR: [{ source: null }, { source: { not: "UNOBTAINABLE" } }] },
      },
    }),
    (prisma as any).unit.count({
      where: { OR: [{ source: null }, { source: { not: "UNOBTAINABLE" } }] },
    }),
    // Story progress — fetch all records to compute granular score
    (prisma as any).userStoryProgress.findMany({
      where: { userId },
      select: { cleared: true, treasures: true, zombies: true },
    }) as Promise<{ cleared: boolean; treasures: string; zombies: string }[]>,
    (prisma as any).storyChapter.count(),
  ]);

  // Story scoring: 1pt cleared + 1pt ALL treasures + 1pt ALL zombies per chapter
  // Partial progress (SOME) doesn't count — only fully completed milestones.
  let realStory = 0;
  for (const sp of storyProgress) {
    if (sp.cleared) realStory++;
    if (sp.treasures === "ALL") realStory++;
    if (sp.zombies === "ALL") realStory++;
  }
  const totalStory = totalStoryChapters * 3;

  const categoryMap: Record<string, string> = {
    UNIT_OBTAINED: "units",
    UNIT_EVOLVED: "units",
    MEDAL_EARNED: "medals",
    MILESTONE_CLEARED: "milestones",
    STORY_CLEARED: "story",
    LEGEND_COMPLETED: "legend",
  };

  const categories = ["units", "medals", "milestones", "story", "legend"] as const;

  // Build day-by-day buckets
  const days: string[] = [];
  const dailyCounts: Record<string, number[]> = {};
  for (const cat of categories) dailyCounts[cat] = [];

  const now = new Date();
  const cursor = new Date(since);
  while (cursor <= now) {
    days.push(cursor.toISOString().slice(0, 10));
    for (const cat of categories) dailyCounts[cat].push(0);
    cursor.setDate(cursor.getDate() + 1);
  }

  for (const a of activities) {
    const dayStr = a.createdAt.toISOString().slice(0, 10);
    const dayIdx = days.indexOf(dayStr);
    if (dayIdx === -1) continue;
    const cat = categoryMap[a.type];
    if (cat) dailyCounts[cat][dayIdx]++;
  }

  // Convert daily counts to cumulative
  const series: Record<string, number[]> = {};
  for (const cat of categories) {
    let cumulative = 0;
    if (cat === "units") cumulative = (baseline["UNIT_OBTAINED"] ?? 0) + (baseline["UNIT_EVOLVED"] ?? 0);
    else if (cat === "medals") cumulative = baseline["MEDAL_EARNED"] ?? 0;
    else if (cat === "milestones") cumulative = baseline["MILESTONE_CLEARED"] ?? 0;
    else if (cat === "story") cumulative = baseline["STORY_CLEARED"] ?? 0;
    else if (cat === "legend") cumulative = baseline["LEGEND_COMPLETED"] ?? 0;

    series[cat] = dailyCounts[cat].map((count) => {
      cumulative += count;
      return cumulative;
    });
  }

  // ── 3. Reconcile with real DB counts ───────────────────────────────────
  const realCounts: Record<string, number> = {
    units: realUnits,
    medals: realMedals,
    milestones: realMilestones,
    story: realStory,
    legend: realLegend,
  };

  for (const cat of categories) {
    const vals = series[cat];
    if (!vals || vals.length === 0) continue;
    const activityTotal = vals[vals.length - 1];
    const realTotal = realCounts[cat];
    const maxTotals: Record<string, number> = {
      units: totalUnits, medals: totalMedals, milestones: totalMilestones,
      story: totalStory, legend: totalLegend,
    };
    const maxTotal = maxTotals[cat] ?? Infinity;

    if (realTotal > activityTotal) {
      // Activity log undershot the real count — shift entire series up
      const deficit = realTotal - activityTotal;
      for (let i = 0; i < vals.length; i++) {
        vals[i] += deficit;
      }
    } else if (activityTotal > realTotal) {
      // Activity log overshot the real count (e.g. story logs multiple events
      // per chapter for cleared + treasures + zombies). Scale the series down
      // so the final value matches the real DB count.
      const scale = activityTotal > 0 ? realTotal / activityTotal : 1;
      for (let i = 0; i < vals.length; i++) {
        vals[i] = Math.round(vals[i] * scale);
      }
    }

    // Clamp all values to the max possible total (can't exceed 100%)
    for (let i = 0; i < vals.length; i++) {
      if (vals[i] > maxTotal) vals[i] = maxTotal;
    }
  }

  // ── 4. Return with totals for percentage scaling ───────────────────────
  const totals = {
    units: totalUnits,
    medals: totalMedals,
    milestones: totalMilestones,
    story: totalStory,
    legend: totalLegend,
  };

  return NextResponse.json({ days, series, totals });
}
