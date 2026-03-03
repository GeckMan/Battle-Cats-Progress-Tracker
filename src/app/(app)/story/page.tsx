import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import ArcSections from "./ArcSections";


export default async function StoryPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = session.user.id as string;

  const chapters = await prisma.storyChapter.findMany({
    orderBy: { sortOrder: "asc" },
  });

  // Ensure progress rows exist
  const existing = await prisma.userStoryProgress.findMany({
    where: { userId },
    select: { storyChapterId: true },
  });
  const existingSet = new Set(existing.map((p) => p.storyChapterId));

  const missing = chapters
    .filter((c) => !existingSet.has(c.id))
    .map((c) => ({
      userId,
      storyChapterId: c.id,
    }));

  if (missing.length > 0) {
    await prisma.userStoryProgress.createMany({ data: missing });
  }

  const progress = await prisma.userStoryProgress.findMany({
    where: { userId },
    include: { chapter: true },
    orderBy: { chapter: { sortOrder: "asc" } },
  });

  // Make it client-serializable and grouped
  const rows = progress.map((p) => ({
    id: p.id,
    cleared: p.cleared,
    treasures: p.treasures,
    zombies: p.zombies,
    chapter: {
      id: p.chapter.id,
      arc: p.chapter.arc,
      chapterNumber: p.chapter.chapterNumber,
      displayName: p.chapter.displayName,
      sortOrder: p.chapter.sortOrder,
    },
  }));

  const arcsInOrder = ["EoC", "ItF", "CotC"] as const;

  const groups = arcsInOrder
    .map((arc) => ({
      arc,
      rows: rows.filter((r) => r.chapter.arc === arc),
    }))
    .filter((g) => g.rows.length > 0);

  return (
    <div className="p-4 pt-16 md:p-8 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-100">Story Progress</h1>
      <ArcSections groups={groups} />
    </div>
  );
}
