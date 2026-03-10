import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/progress-timeline
 *
 * Returns daily cumulative activity counts over the last 90 days,
 * broken down by category. Used for the NERV Progress Waveform chart.
 *
 * Response shape:
 * {
 *   days: string[],              // ISO date strings ["2026-01-10", ...]
 *   series: {
 *     units:      number[],      // cumulative units obtained per day
 *     medals:     number[],      // cumulative medals earned per day
 *     milestones: number[],      // cumulative milestones cleared per day
 *     story:      number[],      // cumulative story events per day
 *     legend:     number[],      // cumulative legend events per day
 *   }
 * }
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

  // Fetch all user activities since cutoff, ordered chronologically
  // @ts-ignore – Activity model
  const activities: { type: string; createdAt: Date }[] = await (prisma as any).activity.findMany({
    where: {
      userId,
      createdAt: { gte: since },
    },
    orderBy: { createdAt: "asc" },
    select: { type: true, createdAt: true },
  });

  // Also get total counts BEFORE the window to establish baseline
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
    // Baseline: sum all matching types before the window
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

  return NextResponse.json({ days, series });
}
