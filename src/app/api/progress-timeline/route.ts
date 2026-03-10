import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/progress-timeline
 *
 * Returns daily cumulative progress counts over the last 90 days,
 * broken down by category. Used for the NERV Progress Waveform chart.
 *
 * Combines Activity event logs with actual progress table counts to
 * ensure the waveform reflects real progress even when activity events
 * were not logged (e.g. medals earned before activity tracking existed).
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id as string;

  const { searchParams } = new URL(req.url);
  const daysBack = Math.min(365, Math.max(7, Number(searchParams.get("days") ?? 90)));

  const since = new Date();
  since.setDate(since.getDate() - daysBack);
  since.setHours(0, 0, 0, 0);

  // ── 1. Fetch activity events (existing logic) ──────────────────────────
  // @ts-ignore – Activity model
  const activities: { type: string; createdAt: Date }[] = await (prisma as any).activity.findMany({
    where: {
      userId,
      createdAt: { gte: since },
    },
    orderBy: { createdAt: "asc" },
    select: { type: true, createdAt: true },
  });

  // Baseline from before the window
  // @ts-ignore
  const baselineCounts = await (prisma as any).activity.groupBy({
    by: ["type"],
    where: {
      userId,
      createdAt: { lt: since },
    },
    _count: { id: true },
  });

  const baseline: Record<string, number> = {};
  for (const row of baselineCounts) {
    baseline[row.type] = row._count.id;
  }

  // ── 2. Query actual progress tables for real current totals ────────────
  const [realMedals, realLegend, realMilestones, realUnits] = await Promise.all([
    // Medals: count UserMeowMedal where earned = true
    (prisma as any).userMeowMedal.count({
      where: { userId, earned: true },
    }),
    // Legend: count UserLegendProgress where status = COMPLETED
    (prisma as any).userLegendProgress.count({
      where: { userId, status: "COMPLETED" },
    }),
    // Milestones: count cleared milestones
    (prisma as any).userMilestoneProgress.count({
      where: { userId, cleared: true },
    }),
    // Units: count obtained units (formLevel >= 1)
    (prisma as any).userUnitProgress.count({
      where: {
        userId,
        formLevel: { gte: 1 },
        unit: { OR: [{ source: null }, { source: { not: "UNOBTAINABLE" } }] },
      },
    }),
  ]);

  // Category mapping
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

  // Tally activities into daily buckets
  for (const a of activities) {
    const dayStr = a.createdAt.toISOString().slice(0, 10);
    const dayIdx = days.indexOf(dayStr);
    if (dayIdx === -1) continue;
    const cat = categoryMap[a.type];
    if (cat) dailyCounts[cat][dayIdx]++;
  }

  // Convert daily counts to cumulative, starting from baseline
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

  // ── 3. Reconcile: ensure final values match real DB counts ─────────────
  // If activity logs under-count (e.g. medals earned before tracking),
  // adjust the series so the last value equals the real count.
  // We add the deficit evenly across all days so the line still shows
  // growth shape from activities, but anchored to the correct total.
  const realCounts: Record<string, number> = {
    units: realUnits,
    medals: realMedals,
    milestones: realMilestones,
    legend: realLegend,
    // story doesn't have a simple "count" equivalent — leave activity-based
  };

  for (const cat of ["units", "medals", "milestones", "legend"] as const) {
    const vals = series[cat];
    if (!vals || vals.length === 0) continue;

    const activityTotal = vals[vals.length - 1];
    const realTotal = realCounts[cat];

    if (realTotal > activityTotal) {
      // The activity log is missing entries. Boost the entire series
      // so that the final day matches the real count.
      // Strategy: flat offset — add the deficit to every day.
      // This means the line starts at the correct baseline and ends at
      // the correct total. If there are activity events they still show
      // as bumps relative to the base.
      const deficit = realTotal - activityTotal;
      for (let i = 0; i < vals.length; i++) {
        vals[i] += deficit;
      }
    }
  }

  return NextResponse.json({ days, series });
}
