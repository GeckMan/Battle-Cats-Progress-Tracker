import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { legendSubchapterPercent, storyChapterPercent } from "@/lib/progress";

type ProgressSummary = {
  overall: number;
  storyOverall: number;
  legendOverall: number;
  medalsOverall: number;
  medalsEarned: number;
  medalsTotal: number;
};

type SubchapterCompareRow = {
  sortOrder: number;
  name: string;
  myStatus: string;
  myCrown: number;
  theirStatus: string;
  theirCrown: number;
};

/* ── DB helpers ─────────────────────────────────────────────────────────── */

async function ensureLegendRows(userId: string) {
  const subIds = (await prisma.legendSubchapter.findMany({ select: { id: true } })).map((s) => s.id);
  if (!subIds.length) return;
  const existing = await prisma.userLegendProgress.findMany({
    where: { userId, subchapterId: { in: subIds } },
    select: { subchapterId: true },
  });
  const have = new Set(existing.map((e) => e.subchapterId));
  const missing = subIds.filter((id) => !have.has(id)).map((subchapterId) => ({ userId, subchapterId }));
  if (missing.length) await prisma.userLegendProgress.createMany({ data: missing });
}

async function computeProgressSummary(userId: string): Promise<ProgressSummary> {
  await ensureLegendRows(userId);

  const storyChapters = await prisma.storyChapter.findMany({
    orderBy: { sortOrder: "asc" },
    include: { progress: { where: { userId }, take: 1 } },
  });
  const storyPcts = storyChapters.map((ch) => {
    const p = ch.progress[0];
    return p ? storyChapterPercent({ cleared: p.cleared, treasures: p.treasures, zombies: p.zombies }) : 0;
  });
  const storyOverall = storyPcts.length ? Math.round(storyPcts.reduce((s, p) => s + p, 0) / storyPcts.length) : 0;

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
      legendSubchapterPercent({ sagaName: s.displayName, subchapterSortOrder: sc.sortOrder, crownMax: sc.progress[0]?.crownMax ?? null })
    )
  );
  const legendOverall = legendPercents.length ? Math.round(legendPercents.reduce((a, b) => a + b, 0) / legendPercents.length) : 0;

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

/* ── Page ───────────────────────────────────────────────────────────────── */

export default async function ComparePage({ params }: { params: Promise<{ username: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
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
        <Link href="/social" className="text-sm text-amber-400 hover:underline">← Back to Social</Link>
      </div>
    );
  }

  const me = await prisma.user.findUnique({
    where: { id: viewerId },
    select: { username: true, displayName: true },
  });

  const [mySummary, theirSummary] = await Promise.all([
    computeProgressSummary(viewerId),
    computeProgressSummary(other.id),
  ]);

  // SoL subchapter compare
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

  const myLabel    = me?.displayName ?? me?.username ?? "You";
  const theirLabel = other.displayName ?? other.username;

  const stats: { title: string; mine: number; theirs: number }[] = [
    { title: "Overall", mine: mySummary.overall,       theirs: theirSummary.overall },
    { title: "Story",   mine: mySummary.storyOverall,  theirs: theirSummary.storyOverall },
    { title: "Legend",  mine: mySummary.legendOverall, theirs: theirSummary.legendOverall },
    { title: "Medals",  mine: mySummary.medalsOverall, theirs: theirSummary.medalsOverall },
  ];

  // Summary counts
  const myAhead    = stats.filter((s) => s.mine > s.theirs).length;
  const theirAhead = stats.filter((s) => s.theirs > s.mine).length;

  return (
    <div className="p-8 space-y-8 w-full">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/social" className="text-xs text-amber-600 hover:text-amber-400 transition-colors mb-2 inline-block">
            ← Back to Social
          </Link>
          <h1 className="text-2xl font-semibold text-gray-100">
            {myLabel} <span className="text-gray-600 font-normal">vs</span> {theirLabel}
          </h1>
          <div className="mt-1.5 flex gap-3 text-xs">
            <span className={myAhead > theirAhead ? "text-amber-400 font-semibold" : "text-gray-500"}>
              {myLabel}: leading in {myAhead}/4
            </span>
            <span className="text-gray-700">·</span>
            <span className={theirAhead > myAhead ? "text-amber-400 font-semibold" : "text-gray-500"}>
              {theirLabel}: leading in {theirAhead}/4
            </span>
          </div>
        </div>
      </div>

      {/* Head-to-head stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(({ title, mine, theirs }) => {
          const delta = mine - theirs;
          return (
            <HeadToHeadCard
              key={title}
              title={title}
              myLabel={myLabel}
              theirLabel={theirLabel}
              mine={mine}
              theirs={theirs}
              delta={delta}
            />
          );
        })}
      </div>

      {/* Medal count row */}
      <div className="grid grid-cols-2 gap-3">
        <MedalCard label={myLabel}    earned={mySummary.medalsEarned}    total={mySummary.medalsTotal} />
        <MedalCard label={theirLabel} earned={theirSummary.medalsEarned} total={theirSummary.medalsTotal} />
      </div>

      {/* Compare units link */}
      <Link
        href={`/social/compare/${encodeURIComponent(other.username)}/units`}
        className="flex items-center justify-between rounded-lg border border-gray-700 bg-black px-4 py-3 hover:border-amber-800 hover:bg-amber-950/10 transition-colors group"
      >
        <div>
          <div className="text-sm font-semibold text-gray-200 group-hover:text-amber-300 transition-colors">
            Compare Units →
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            See what units they have that you don't, and vice versa
          </div>
        </div>
      </Link>

      {/* SoL subchapter table */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-100">Stories of Legend — Subchapters</h2>
          <div className="flex gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-amber-900/60 border border-amber-700" /> You ahead</span>
            <span className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-blue-900/40 border border-blue-800" /> They ahead</span>
          </div>
        </div>

        {compareRows.length === 0 ? (
          <div className="text-sm text-gray-400">No Stories of Legend subchapters found.</div>
        ) : (
          <div className="border border-gray-700 rounded-lg bg-black overflow-hidden">
            {/* Column headers */}
            <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-gray-800 bg-gray-950 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="col-span-1">#</div>
              <div className="col-span-4">Subchapter</div>
              <div className="col-span-3 text-center">{myLabel}</div>
              <div className="col-span-1 text-center text-gray-700">vs</div>
              <div className="col-span-3 text-center">{theirLabel}</div>
            </div>

            <div className="max-h-[60vh] overflow-auto divide-y divide-gray-900">
              {compareRows.map((r) => {
                const iAhead   = r.myCrown > r.theirCrown;
                const theyAhead = r.theirCrown > r.myCrown;
                const tied     = r.myCrown === r.theirCrown;

                return (
                  <div
                    key={r.sortOrder}
                    className={`grid grid-cols-12 gap-2 px-4 py-2.5 text-sm transition-colors
                      ${iAhead    ? "bg-amber-950/20 hover:bg-amber-950/30" :
                        theyAhead ? "bg-blue-950/20  hover:bg-blue-950/30"  :
                                    "hover:bg-gray-950"}`}
                  >
                    <div className="col-span-1 text-gray-600 text-xs">{r.sortOrder}</div>
                    <div className="col-span-4 text-gray-300 truncate">{r.name}</div>

                    {/* My side */}
                    <div className="col-span-3 flex flex-col items-center gap-0.5">
                      <StatusBadge status={r.myStatus} />
                      {r.myCrown > 0 && (
                        <span className={`text-xs ${iAhead ? "text-amber-400" : "text-gray-500"}`}>
                          👑 {r.myCrown}
                        </span>
                      )}
                    </div>

                    {/* Delta */}
                    <div className="col-span-1 flex items-center justify-center">
                      {iAhead    && <span className="text-xs text-amber-500 font-semibold">▲{r.myCrown - r.theirCrown}</span>}
                      {theyAhead && <span className="text-xs text-blue-400  font-semibold">▼{r.theirCrown - r.myCrown}</span>}
                      {tied      && <span className="text-xs text-gray-700">=</span>}
                    </div>

                    {/* Their side */}
                    <div className="col-span-3 flex flex-col items-center gap-0.5">
                      <StatusBadge status={r.theirStatus} />
                      {r.theirCrown > 0 && (
                        <span className={`text-xs ${theyAhead ? "text-blue-400" : "text-gray-500"}`}>
                          👑 {r.theirCrown}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────── */

function pctColor(pct: number) {
  if (pct >= 80) return "#fbbf24";
  if (pct >= 40) return "#d97706";
  if (pct > 0)   return "#92400e";
  return "#4b5563";
}

function barFill(pct: number) {
  if (pct >= 80) return "bg-amber-400";
  if (pct >= 40) return "bg-amber-600";
  if (pct > 0)   return "bg-amber-800";
  return "bg-gray-700";
}

function HeadToHeadCard({
  title, myLabel, theirLabel, mine, theirs, delta,
}: {
  title: string; myLabel: string; theirLabel: string;
  mine: number; theirs: number; delta: number;
}) {
  const iWin   = delta > 0;
  const theyWin = delta < 0;

  return (
    <div className={`border rounded-lg p-4 bg-black space-y-3 ${iWin ? "border-amber-800" : theyWin ? "border-blue-900" : "border-gray-700"}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</span>
        {delta !== 0 && (
          <span className={`text-xs font-semibold ${iWin ? "text-amber-400" : "text-blue-400"}`}>
            {iWin ? `▲ +${delta}%` : `▼ ${delta}%`}
          </span>
        )}
        {delta === 0 && <span className="text-xs text-gray-600">Tied</span>}
      </div>

      {/* My bar */}
      <div>
        <div className="flex justify-between mb-1">
          <span className={`text-xs truncate max-w-[70%] ${iWin ? "text-amber-300" : "text-gray-400"}`}>{myLabel}</span>
          <span className="text-xs font-semibold" style={{ color: pctColor(mine) }}>{mine}%</span>
        </div>
        <div className="h-2 rounded bg-gray-800 overflow-hidden">
          <div className={`h-2 ${barFill(mine)}`} style={{ width: `${mine}%` }} />
        </div>
      </div>

      {/* Their bar */}
      <div>
        <div className="flex justify-between mb-1">
          <span className={`text-xs truncate max-w-[70%] ${theyWin ? "text-blue-300" : "text-gray-400"}`}>{theirLabel}</span>
          <span className="text-xs font-semibold" style={{ color: pctColor(theirs) }}>{theirs}%</span>
        </div>
        <div className="h-2 rounded bg-gray-800 overflow-hidden">
          <div className={`h-2 ${theyWin ? "bg-blue-600" : barFill(theirs)}`} style={{ width: `${theirs}%` }} />
        </div>
      </div>
    </div>
  );
}

function MedalCard({ label, earned, total }: { label: string; earned: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((earned / total) * 100);
  return (
    <div className="border border-gray-700 rounded-lg p-3 bg-black flex items-center gap-4">
      <div className="text-xs text-gray-500 w-24 truncate">{label}</div>
      <div className="flex-1 h-1.5 rounded bg-gray-800 overflow-hidden">
        <div className={`h-1.5 ${barFill(pct)}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="text-xs font-semibold" style={{ color: pctColor(pct) }}>
        {earned}/{total} medals
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "COMPLETED")
    return <span className="text-xs rounded-full px-2 py-0.5 bg-amber-500/20 border border-amber-700 text-amber-300 whitespace-nowrap">Completed</span>;
  if (status === "IN_PROGRESS")
    return <span className="text-xs rounded-full px-2 py-0.5 bg-amber-950/50 border border-amber-900 text-amber-600 whitespace-nowrap">In progress</span>;
  return <span className="text-xs rounded-full px-2 py-0.5 bg-gray-900 border border-gray-800 text-gray-600 whitespace-nowrap">Not started</span>;
}
