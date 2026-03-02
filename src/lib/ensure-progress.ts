import { prisma } from "@/lib/prisma";

/**
 * Ensures that a progress row exists for every catalog item for the given user.
 * Uses createMany with skipDuplicates so it's safe to call on every page load
 * without racing or creating duplicate rows.
 */
export async function ensureStoryProgress(userId: string) {
  const chapters = await prisma.storyChapter.findMany({ select: { id: true } });
  if (!chapters.length) return;

  await prisma.userStoryProgress.createMany({
    data: chapters.map((c) => ({ userId, storyChapterId: c.id })),
    skipDuplicates: true,
  });
}

export async function ensureMedalProgress(userId: string) {
  const medals = await prisma.meowMedal.findMany({ select: { id: true } });
  if (!medals.length) return;

  await prisma.userMeowMedal.createMany({
    data: medals.map((m) => ({ userId, meowMedalId: m.id })),
    skipDuplicates: true,
  });
}

export async function ensureLegendProgress(userId: string) {
  const subchapters = await prisma.legendSubchapter.findMany({ select: { id: true } });
  if (!subchapters.length) return;

  await prisma.userLegendProgress.createMany({
    data: subchapters.map((s) => ({ userId, subchapterId: s.id })),
    skipDuplicates: true,
  });
}
