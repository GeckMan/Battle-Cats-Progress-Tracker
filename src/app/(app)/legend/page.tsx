import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import Sections from "./Sections";


export default async function LegendPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // @ts-expect-error
  const userId = session.user.id as string;

  const sagas = await prisma.legendSaga.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      subchapters: { orderBy: { sortOrder: "asc" } },
    },
  });

  const allSubchapterIds = sagas.flatMap((s) => s.subchapters.map((sc) => sc.id));

  const existing = await prisma.userLegendProgress.findMany({
  where: { userId, subchapterId: { in: allSubchapterIds } },
  select: { subchapterId: true },
});
const existingSet = new Set(existing.map((e) => e.subchapterId));


  const missing = allSubchapterIds
  .filter((id) => !existingSet.has(id))
  .map((subchapterId) => ({
    userId,
    subchapterId,
    status: "NOT_STARTED" as const,
    crownMax: null as number | null,
  }));


  if (missing.length > 0) {
    await prisma.userLegendProgress.createMany({ data: missing });
  }

  const progress = await prisma.userLegendProgress.findMany({
  where: { userId, subchapterId: { in: allSubchapterIds } },
  include: {
    subchapter: { include: { saga: true } },
  },
  orderBy: [
    { subchapter: { saga: { sortOrder: "asc" } } },
    { subchapter: { sortOrder: "asc" } },
  ],
});


  const rows = progress.map((p) => ({
  id: p.id,
  crownMax: p.crownMax,
  status: p.status,
  subchapter: {
    id: p.subchapter.id,
    displayName: p.subchapter.displayName,
    sortOrder: p.subchapter.sortOrder,
    saga: {
      id: p.subchapter.saga.id,
      displayName: p.subchapter.saga.displayName,
      sortOrder: p.subchapter.saga.sortOrder,
    },
  },
}));


  const groups = sagas.map((s) => ({
    sagaId: s.id,
    sagaName: s.displayName,
    sortOrder: s.sortOrder,
    rows: rows.filter((r) => r.subchapter.saga.id === s.id),
  }));

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-100">Legend Stages</h1>
      <p className="text-sm text-gray-400">
        Track legend progress by subchapter. Crown = highest crown completed (0–4).
      </p>
      <Sections groups={groups} />
    </div>
  );
}
