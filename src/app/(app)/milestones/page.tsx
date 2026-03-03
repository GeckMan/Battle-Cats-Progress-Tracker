import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { ensureMilestoneProgress } from "@/lib/ensure-progress";
import { ensureMilestoneCatalog, CATEGORY_META } from "@/lib/milestone-catalog";
import MilestonesClient from "./MilestonesClient";
import type { MilestoneCategory } from "@/generated/prisma/client";

export default async function MilestonesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const userId = session.user.id as string;

  // Ensure catalog rows exist (auto-seeds on first visit), then user progress rows
  await ensureMilestoneCatalog();
  await ensureMilestoneProgress(userId);

  // Fetch all milestones with this user's progress
  const milestones = await prisma.milestone.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    include: {
      progress: {
        where: { userId },
        select: { cleared: true, notes: true },
        take: 1,
      },
    },
  });

  // Group by category, sorted by CATEGORY_META order
  const groupMap = new Map<
    MilestoneCategory,
    { id: string; displayName: string; category: MilestoneCategory; sortOrder: number; cleared: boolean; notes: string | null }[]
  >();

  for (const m of milestones) {
    const p = m.progress[0];
    const row = {
      id: m.id,
      displayName: m.displayName,
      category: m.category,
      sortOrder: m.sortOrder,
      cleared: p?.cleared ?? false,
      notes: p?.notes ?? null,
    };
    const arr = groupMap.get(m.category) ?? [];
    arr.push(row);
    groupMap.set(m.category, arr);
  }

  const groups = Array.from(groupMap.entries())
    .sort(([a], [b]) => (CATEGORY_META[a]?.order ?? 99) - (CATEGORY_META[b]?.order ?? 99))
    .map(([category, rows]) => ({
      category,
      label: CATEGORY_META[category]?.label ?? category,
      rows,
    }));

  return (
    <div className="p-4 pt-16 md:p-8 max-w-2xl">
      <MilestonesClient groups={groups} />
    </div>
  );
}
