import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { legendSubchapterPercent, storyChapterPercent } from "@/lib/progress";

type SubchapterCompareRow = {
  sortOrder: number;
  name: string;
  myStatus: string;
  myCrown: number;
  theirStatus: string;
  theirCrown: number;
};

type ProgressSummary = {
  overall: number;
  storyOverall: number;
  legendOverall: number;
  medalsOverall: number;
  medalsEarned: number;
  medalsTotal: number;
};

async function ensureLegendRows(userId: string) {
  const subIds = (await prisma.legendSubchapter.findMany({ select: { id: true } })).map((s) => s.id);
  if (!subIds.length) return;

  const existing = await prisma.userLegendProgress.findMany({
    where: { userId, subchapterId: { in: subIds } },
    select: { subchapterId: true },
  });

  const have = new Set(existing.map((e) => e.subchapterId));
  const missing = subIds.filter((id) => !have.has(id)).map((subchapterId) => ({
    userId,
    subchapterId,
  }));

  if (missing.length) await prisma.userLegendProgress.createMany({ data: missing });
}

async function computeProgressSummary(userId: string): Promise<ProgressSummary> {
  // keep this page lighter: we only ensure legend rows (subchapter compare needs them)
  await ensureLegendRows(userId);

  // Story overall
  const storyChapters = await prisma.storyChapter.findMany({
    orderBy: { sortOrder: "asc" },
    include: { progress: { where: { userId }, take: 1 } },
  });

  const storyPcts = storyChapters.map((ch) => {
    const p = ch.progress[0];
    return p
      ? storyChapterPercent({ cleared: p.cleared, treasures: p.treasures, zombies: p.zombies })
      : 0;
  });

  const storyOverall =
    storyPcts.length === 0 ? 0 : Math.round(storyPcts.reduce((s, p) => s + p, 0) / storyPcts.length);

  // Legend overall
  const sagas = await prisma.legendSaga.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      subchapters: {
        orderBy: { sortOrder: "asc" },
        include: { progress: { where: { userId }, take: 1 } },
      },
    },
  });

  const legendPercents = sagas.flatMap((s) =>
    s.subchapters.map((sc) =>
      legendSubchapterPercent({
        sagaName: s.displayName,
        subchapterSortOrder: sc.sortOrder,
        crownMax: sc.progress[0]?.crownMax ?? null,
      })
    )
  );

  const legendOverall =
    legendPercents.length === 0
      ? 0
      : Math.round(legendPercents.reduce((a, b) => a + b, 0) / legendPercents.length);

  // Medals overall
  const medalsTotal = await prisma.meowMedal.count();
  const medalsEarned = await prisma.userMeowMedal.count({ where: { userId, earned: true } });
  const medalsOverall = medalsTotal === 0 ? 0 : Math.round((medalsEarned / medalsTotal) * 100);

  const overall = Math.round((storyOverall + legendOverall + medalsOverall) / 3);

  return { overall, storyOverall, legendOverall, medalsOverall, medalsEarned, medalsTotal };
}

async function areFriendsOrSelf(viewerId: string, otherId: string) {
  if (viewerId === otherId) return true;

  const rel = await prisma.friendship.findFirst({
    where: {
      status: "ACCEPTED",
      OR: [
        { requesterId: viewerId, addresseeId: otherId },
        { requesterId: otherId, addresseeId: viewerId },
      ],
    },
    select: { id: true },
  });

  return Boolean(rel);
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  // @ts-expect-error
  const viewerId = session.user.id as string;

  const { username } = await params;

  const other = await prisma.user.findUnique({
    where: { username },
    select: { id: true, username: true, displayName: true },
  });
  if (!other) notFound();

  const ok = await areFriendsOrSelf(viewerId, other.id);
  if (!ok) {
    return (
      <div className="p-8 space-y-4">
        <h1 className="text-2xl font-semibold text-gray-100">Compare</h1>
        <div className="text-sm text-gray-400">You can only compare with accepted friends.</div>
        <Link href="/social" className="text-sm text-gray-200 underline">
          Back to Social
        </Link>
      </div>
    );
  }

  const me = await prisma.user.findUnique({
    where: { id: viewerId },
    select: { username: true, displayName: true },
  });

  // Summaries (top cards)
  const [mySummary, theirSummary] = await Promise.all([
    computeProgressSummary(viewerId),
    computeProgressSummary(other.id),
  ]);

  // Subchapter comparison for Stories of Legend
  const solSaga = await prisma.legendSaga.findFirst({
    where: { displayName: "Stories of Legend" },
    select: { id: true },
  });

  const solSubchapters = solSaga
    ? await prisma.legendSubchapter.findMany({
        where: { sagaId: solSaga.id },
        orderBy: { sortOrder: "asc" },
        select: { id: true, displayName: true, sortOrder: true },
      })
    : [];

  const [myLegend, theirLegend] = await Promise.all([
    prisma.userLegendProgress.findMany({
      where: { userId: viewerId, subchapterId: { in: solSubchapters.map((s) => s.id) } },
      select: { subchapterId: true, status: true, crownMax: true },
    }),
    prisma.userLegendProgress.findMany({
      where: { userId: other.id, subchapterId: { in: solSubchapters.map((s) => s.id) } },
      select: { subchapterId: true, status: true, crownMax: true },
    }),
  ]);

  const myMap = new Map(myLegend.map((r) => [r.subchapterId, r]));
  const theirMap = new Map(theirLegend.map((r) => [r.subchapterId, r]));

  const compareRows: SubchapterCompareRow[] = solSubchapters.map((sc) => {
    const a = myMap.get(sc.id);
    const b = theirMap.get(sc.id);

    return {
      sortOrder: sc.sortOrder,
      name: sc.displayName,
      myStatus: a?.status ?? "NOT_STARTED",
      myCrown: a?.crownMax ?? 0,
      theirStatus: b?.status ?? "NOT_STARTED",
      theirCrown: b?.crownMax ?? 0,
    };
  });

  const meLabel = me?.displayName ? `${me.displayName} (${me.username})` : me?.username ?? "You";
  const otherLabel = other.displayName ? `${other.displayName} (${other.username})` : other.username;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-100">Compare</h1>
          <div className="text-sm text-gray-400 mt-1">
            {meLabel} vs {otherLabel}
          </div>
        </div>

        <Link
          href="/social"
          className="text-sm text-gray-200 border border-gray-700 rounded px-3 py-1 hover:bg-gray-900"
        >
          Back
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <CompareCard title={meLabel} summary={mySummary} />
        <CompareCard title={otherLabel} summary={theirSummary} />
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-100">Stories of Legend — Subchapters</h2>

        {compareRows.length === 0 ? (
          <div className="text-sm text-gray-400">No Stories of Legend subchapters found.</div>
        ) : (
          <div className="border border-gray-700 rounded-lg bg-black overflow-hidden">
            <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-gray-800 text-xs text-gray-400">
              <div className="col-span-5">Subchapter</div>
              <div className="col-span-3">{me?.username ?? "You"}</div>
              <div className="col-span-3">{other.username}</div>
              <div className="col-span-1 text-right">#</div>
            </div>

            <div className="max-h-[60vh] overflow-auto">
              {compareRows.map((r) => (
                <div
                  key={r.sortOrder}
                  className="grid grid-cols-12 gap-2 px-4 py-2 border-b border-gray-900 text-sm"
                >
                  <div className="col-span-5 text-gray-200 truncate">
                    {r.sortOrder}. {r.name}
                  </div>

                  <div className="col-span-3 text-gray-300">
                    {formatStatus(r.myStatus)} <span className="text-gray-500">•</span>{" "}
                    <span className="text-gray-400">crown {r.myCrown}</span>
                  </div>

                  <div className="col-span-3 text-gray-300">
                    {formatStatus(r.theirStatus)} <span className="text-gray-500">•</span>{" "}
                    <span className="text-gray-400">crown {r.theirCrown}</span>
                  </div>

                  <div className="col-span-1 text-right text-gray-500">{r.sortOrder}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function CompareCard({ title, summary }: { title: string; summary: ProgressSummary }) {
  return (
    <div className="border border-gray-700 rounded-lg p-5 bg-black space-y-4">
      <div className="text-gray-100 font-semibold">{title}</div>

      <div className="grid gap-3 md:grid-cols-4">
        <MiniStat title="Overall" value={`${summary.overall}%`} />
        <MiniStat title="Story" value={`${summary.storyOverall}%`} />
        <MiniStat title="Legend" value={`${summary.legendOverall}%`} />
        <MiniStat title="Medals" value={`${summary.medalsOverall}%`} />
      </div>

      <div className="text-sm text-gray-400">
        Medals: {summary.medalsEarned}/{summary.medalsTotal}
      </div>
    </div>
  );
}

function MiniStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="border border-gray-800 rounded-md p-3 bg-black">
      <div className="text-xs text-gray-400">{title}</div>
      <div className="text-lg font-semibold text-gray-100 mt-1">{value}</div>
    </div>
  );
}

function formatStatus(s: string) {
  if (s === "COMPLETED") return "Completed";
  if (s === "IN_PROGRESS") return "In Progress";
  return "Not Started";
}
