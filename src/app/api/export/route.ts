import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/export — Download all user progress as JSON.
 *
 * Uses stable identifiers (unitNumber, arc+chapterNumber, saga+subchapter name,
 * medal name, milestone name) instead of internal cuid IDs so exports are
 * portable across database resets.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id as string;

  // Fetch user info
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { username: true, displayName: true },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Fetch all progress in parallel
  const [storyRows, legendRows, unitRows, medalRows, milestoneRows, catclawRow] =
    await Promise.all([
      // Story progress with chapter details
      (prisma as any).userStoryProgress.findMany({
        where: { userId },
        include: { chapter: { select: { arc: true, chapterNumber: true, displayName: true } } },
      }),
      // Legend progress with subchapter + saga details
      (prisma as any).userLegendProgress.findMany({
        where: { userId },
        include: {
          subchapter: {
            select: {
              displayName: true,
              saga: { select: { displayName: true } },
            },
          },
        },
      }),
      // Unit progress with unit number
      (prisma as any).userUnitProgress.findMany({
        where: { userId },
        include: { unit: { select: { unitNumber: true, name: true } } },
      }),
      // Medal progress with medal name
      (prisma as any).userMeowMedal.findMany({
        where: { userId },
        include: { meowMedal: { select: { name: true } } },
      }),
      // Milestone progress with milestone details
      (prisma as any).userMilestoneProgress.findMany({
        where: { userId },
        include: { milestone: { select: { displayName: true, category: true } } },
      }),
      // Catclaw progress
      (prisma as any).userCatclawProgress.findFirst({ where: { userId } }),
    ]);

  const exportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    username: user.username,
    displayName: user.displayName,

    story: storyRows.map((r: any) => ({
      arc: r.chapter.arc,
      chapterNumber: r.chapter.chapterNumber,
      chapterName: r.chapter.displayName,
      cleared: r.cleared,
      treasures: r.treasures,
      zombies: r.zombies,
    })),

    legend: legendRows.map((r: any) => ({
      saga: r.subchapter.saga.displayName,
      subchapter: r.subchapter.displayName,
      status: r.status,
      crownMax: r.crownMax,
      notes: r.notes,
    })),

    units: unitRows
      .filter((r: any) => r.formLevel > 0)
      .map((r: any) => ({
        unitNumber: r.unit.unitNumber,
        unitName: r.unit.name,
        formLevel: r.formLevel,
      })),

    medals: medalRows
      .filter((r: any) => r.earned)
      .map((r: any) => ({
        name: r.meowMedal.name,
        earned: r.earned,
        earnedAt: r.earnedAt?.toISOString() ?? null,
      })),

    milestones: milestoneRows
      .filter((r: any) => r.cleared)
      .map((r: any) => ({
        name: r.milestone.displayName,
        category: r.milestone.category,
        cleared: r.cleared,
        notes: r.notes,
      })),

    catclaw: catclawRow
      ? {
          currentRank: catclawRow.currentRank,
          bestRank: catclawRow.bestRank,
          notes: catclawRow.notes,
        }
      : null,
  };

  const filename = `battlecats-progress-${user.username}-${new Date().toISOString().slice(0, 10)}.json`;

  return new Response(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
