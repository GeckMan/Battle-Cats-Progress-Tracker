import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { legendSubchapterPercent, storyChapterPercent } from "@/lib/progress";
import SocialClient from "./SocialClient";


type SagaBreakdown = {
  sagaId: string;
  sagaName: string;
  completed: number;
  total: number;
  pct: number;
};

type SubchapterStatus = {
  subchapterId: string;
  sagaName: string;
  subchapterName: string;
  sortOrder: number;
  status: string; // NOT_STARTED | IN_PROGRESS | COMPLETED
  crownMax: number;
};

type ProgressSummary = {
  overall: number;
  storyOverall: number;
  legendOverall: number;
  medalsOverall: number;
  medalsEarned: number;
  medalsTotal: number;
  unitsOverall: number;
  unitsObtained: number;
  unitsTotal: number;

  // NEW: legend breakdown
  sagas: SagaBreakdown[];
  // NEW: SoL subchapter detail (so you can “see which ones”)
  solSubchapters: SubchapterStatus[];
};

async function ensureStoryRows(userId: string) {
  const storyChapterIds = (await prisma.storyChapter.findMany({ select: { id: true } })).map(
    (c) => c.id
  );
  if (!storyChapterIds.length) return;

  const existing = await prisma.userStoryProgress.findMany({
    where: { userId, storyChapterId: { in: storyChapterIds } },
    select: { storyChapterId: true },
  });

  const have = new Set(existing.map((e) => e.storyChapterId));
  const missing = storyChapterIds.filter((id) => !have.has(id)).map((storyChapterId) => ({
    userId,
    storyChapterId,
  }));

  if (missing.length) await prisma.userStoryProgress.createMany({ data: missing });
}

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

async function ensureMedalRows(userId: string) {
  const medalIds = (await prisma.meowMedal.findMany({ select: { id: true } })).map((m) => m.id);
  if (!medalIds.length) return;

  const existing = await prisma.userMeowMedal.findMany({
    where: { userId, meowMedalId: { in: medalIds } },
    select: { meowMedalId: true },
  });

  const have = new Set(existing.map((e) => e.meowMedalId));
  const missing = medalIds.filter((id) => !have.has(id)).map((meowMedalId) => ({
    userId,
    meowMedalId,
  }));

  if (missing.length) await prisma.userMeowMedal.createMany({ data: missing });
}

async function computeProgressSummary(userId: string): Promise<ProgressSummary> {
  await ensureStoryRows(userId);
  await ensureLegendRows(userId);
  await ensureMedalRows(userId);

  // ----- Story overall
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

  // ----- Legend overall + breakdown + SoL details
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

  const sagaBreakdown: SagaBreakdown[] = sagas.map((s) => {
    const total = s.subchapters.length;
    const completed = s.subchapters.filter((sc) => sc.progress[0]?.status === "COMPLETED").length;

    const sub = s.subchapters.map((sc) =>
      legendSubchapterPercent({
        sagaName: s.displayName,
        subchapterSortOrder: sc.sortOrder,
        crownMax: sc.progress[0]?.crownMax ?? null,
      })
    );
    const pct = sub.length ? Math.round(sub.reduce((a, b) => a + b, 0) / sub.length) : 0;

    return { sagaId: s.id, sagaName: s.displayName, completed, total, pct };
  });

  const sol = sagas.find((s) => s.displayName === "Stories of Legend");
  const solSubchapters: SubchapterStatus[] =
    sol?.subchapters.map((sc) => ({
      subchapterId: sc.id,
      sagaName: "Stories of Legend",
      subchapterName: sc.displayName,
      sortOrder: sc.sortOrder,
      status: sc.progress[0]?.status ?? "NOT_STARTED",
      crownMax: sc.progress[0]?.crownMax ?? 0,
    })) ?? [];

  // ----- Medals overall
  const medalsTotal = await prisma.meowMedal.count();
  const medalsEarned = await prisma.userMeowMedal.count({ where: { userId, earned: true } });
  const medalsOverall = medalsTotal === 0 ? 0 : Math.round((medalsEarned / medalsTotal) * 100);

  // ----- Units overall
  // @ts-ignore – Unit model added in new migration
  const unitsTotal = await (prisma as any).unit.count({
    where: { source: { not: "UNOBTAINABLE" } },
  });
  // @ts-ignore
  const unitsObtained = await (prisma as any).userUnitProgress.count({
    where: {
      userId,
      formLevel: { gte: 1 },
      unit: { source: { not: "UNOBTAINABLE" } },
    },
  });
  const unitsOverall = unitsTotal === 0 ? 0 : Math.round((unitsObtained / unitsTotal) * 100);

  const overall = Math.round((storyOverall + legendOverall + medalsOverall + unitsOverall) / 4);

  return {
    overall,
    storyOverall,
    legendOverall,
    medalsOverall,
    medalsEarned,
    medalsTotal,
    unitsOverall,
    unitsObtained,
    unitsTotal,
    sagas: sagaBreakdown,
    solSubchapters,
  };
}

export default async function SocialPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const userId = session.user.id as string;

  // Accepted friends (both directions)
  const friends = await prisma.friendship.findMany({
    where: {
      status: "ACCEPTED",
      OR: [{ requesterId: userId }, { addresseeId: userId }],
    },
    select: {
      requester: { select: { id: true, username: true, displayName: true } },
      addressee: { select: { id: true, username: true, displayName: true } },
    },
  });

  const friendUsers = friends.map((f) => {
    const other = f.requester.id === userId ? f.addressee : f.requester;
    return other;
  });

  const me = await prisma.user.findUnique({
    where: { id: userId },
    select: { username: true, displayName: true },
  });

  const mySummary = await computeProgressSummary(userId);

  const friendSummaries = await Promise.all(
    friendUsers.map(async (u) => ({
      user: u,
      summary: await computeProgressSummary(u.id),
    }))
  );

  // Helpful: sort friends by overall descending
  friendSummaries.sort((a, b) => b.summary.overall - a.summary.overall);

return (
  <div className="p-4 pt-16 md:p-8 space-y-6">
    <div className="flex items-end justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-100">Social</h1>
        <p className="text-sm text-gray-400 mt-1">Compare your progress with friends.</p>
      </div>
    </div>

    {/* ✅ RESTORED FRIEND UI */}
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-100">Friends</h2>
      <SocialClient userId={userId} />
    </section>

    {/* Your existing server-rendered progress sections can stay below */}
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-100">You</h2>
      <UserProgressCard
        username={me?.username ?? "you"}
        displayName={me?.displayName ?? null}
        summary={mySummary}
        compareHref={null}
        unitsHref={null}
        medalsHref={null}
        showSolDetail
      />
    </section>

    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-100">Friends (Progress)</h2>
        <div className="text-sm text-gray-400">{friendSummaries.length} friends</div>
      </div>

      {friendSummaries.length === 0 ? (
        <div className="text-sm text-gray-400">No accepted friends yet.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {friendSummaries.map(({ user, summary }) => (
            <UserProgressCard
              key={user.id}
              username={user.username}
              displayName={user.displayName ?? null}
              summary={summary}
              compareHref={`/social/compare/${encodeURIComponent(user.username)}`}
              unitsHref={`/social/${encodeURIComponent(user.username)}/units`}
              medalsHref={`/social/${encodeURIComponent(user.username)}/medals`}
              showSolDetail={false}
            />
          ))}
        </div>
      )}
    </section>
  </div>
);

}

/* ── Helpers ──────────────────────────────────────────────────────────────── */

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

function MiniBar({ pct }: { pct: number }) {
  return (
    <div className="mt-1.5 h-1.5 rounded bg-gray-800 overflow-hidden">
      <div className={`h-1.5 ${barFill(pct)}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "COMPLETED")
    return <span className="text-xs rounded-full px-2 py-0.5 bg-amber-500/20 border border-amber-700 text-amber-300">Completed</span>;
  if (status === "IN_PROGRESS")
    return <span className="text-xs rounded-full px-2 py-0.5 bg-amber-950/50 border border-amber-900 text-amber-600">In progress</span>;
  return <span className="text-xs rounded-full px-2 py-0.5 bg-gray-900 border border-gray-700 text-gray-500">Not started</span>;
}

/* ── UserProgressCard ─────────────────────────────────────────────────────── */

function UserProgressCard({
  username,
  displayName,
  summary,
  compareHref,
  unitsHref,
  medalsHref,
  showSolDetail,
}: {
  username: string;
  displayName: string | null;
  summary: ProgressSummary;
  compareHref: string | null;
  unitsHref: string | null;
  medalsHref: string | null;
  showSolDetail: boolean;
}) {
  return (
    <div className="border border-gray-700 rounded-lg p-4 bg-black space-y-4">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-gray-100 font-semibold">
            {displayName ?? username}
            {displayName && <span className="text-gray-500 text-sm ml-2">@{username}</span>}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            {summary.medalsEarned}/{summary.medalsTotal} medals · {summary.unitsObtained}/{summary.unitsTotal} units
          </div>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          {unitsHref && (
            <Link
              href={unitsHref}
              className="text-xs px-3 py-1.5 rounded border border-gray-700 bg-gray-900/50 text-gray-300 hover:bg-gray-800/60 transition-colors whitespace-nowrap"
            >
              View Units →
            </Link>
          )}
          {medalsHref && (
            <Link
              href={medalsHref}
              className="text-xs px-3 py-1.5 rounded border border-gray-700 bg-gray-900/50 text-gray-300 hover:bg-gray-800/60 transition-colors whitespace-nowrap"
            >
              View Medals →
            </Link>
          )}
          {compareHref && (
            <Link
              href={compareHref}
              className="text-xs px-3 py-1.5 rounded border border-amber-800 bg-amber-950/30 text-amber-300 hover:bg-amber-950/60 transition-colors whitespace-nowrap"
            >
              Compare →
            </Link>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {[
          { title: "Overall", pct: summary.overall, highlight: true },
          { title: "Story",   pct: summary.storyOverall },
          { title: "Legend",  pct: summary.legendOverall },
          { title: "Medals",  pct: summary.medalsOverall },
          { title: "Units",   pct: summary.unitsOverall },
        ].map(({ title, pct, highlight }) => (
          <div key={title} className={`border rounded-md p-2.5 bg-black ${highlight ? "border-amber-800" : "border-gray-800"}`}>
            <div className="text-xs text-gray-500">{title}</div>
            <div className="text-xl font-semibold mt-0.5" style={{ color: pctColor(pct) }}>{pct}%</div>
            <MiniBar pct={pct} />
          </div>
        ))}
      </div>

      {/* Legend breakdown */}
      <details className="border border-gray-800 rounded-md overflow-hidden">
        <summary className="cursor-pointer select-none px-3 py-2.5 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-900 transition-colors flex items-center justify-between">
          <span>Legend breakdown</span>
          <span className="text-gray-600 text-xs">▾</span>
        </summary>

        <div className="px-3 pb-3 pt-2 space-y-4 bg-gray-950">
          {/* Saga bars */}
          <div className="space-y-2">
            {summary.sagas.map((s) => (
              <div key={s.sagaId}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-300">{s.sagaName}</span>
                  <span className="text-xs" style={{ color: pctColor(s.pct) }}>{s.pct}%</span>
                </div>
                <div className="h-1.5 rounded bg-gray-800 overflow-hidden">
                  <div className={`h-1.5 ${barFill(s.pct)}`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* SoL subchapter detail */}
          {showSolDetail && summary.solSubchapters.length > 0 && (
            <div className="border-t border-gray-800 pt-3">
              <div className="text-xs font-semibold text-gray-400 mb-2">Stories of Legend — subchapters</div>
              <div className="max-h-64 overflow-auto space-y-1.5 pr-1">
                {summary.solSubchapters.map((sc) => (
                  <div key={sc.subchapterId} className="flex items-center justify-between gap-2">
                    <div className="text-xs text-gray-400 truncate">
                      <span className="text-gray-600 mr-1">{sc.sortOrder}.</span>
                      {sc.subchapterName}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <StatusBadge status={sc.status} />
                      {sc.crownMax > 0 && (
                        <span className="text-xs text-amber-600">👑 {sc.crownMax}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </details>
    </div>
  );
}
