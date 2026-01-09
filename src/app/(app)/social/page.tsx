import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { legendSubchapterPercent, storyChapterPercent } from "@/lib/progress";

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

  const overall = Math.round((storyOverall + legendOverall + medalsOverall) / 3);

  return {
    overall,
    storyOverall,
    legendOverall,
    medalsOverall,
    medalsEarned,
    medalsTotal,
    sagas: sagaBreakdown,
    solSubchapters,
  };
}

export default async function SocialPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  // @ts-expect-error
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
    <div className="p-8 space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-100">Social</h1>
          <p className="text-sm text-gray-400 mt-1">Compare your progress with friends.</p>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-100">You</h2>
        <UserProgressCard
          username={me?.username ?? "you"}
          displayName={me?.displayName ?? null}
          summary={mySummary}
          compareHref={null}
          showSolDetail
        />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-100">Friends</h2>
          <div className="text-sm text-gray-400">{friendSummaries.length} friends</div>
        </div>

        {friendSummaries.length === 0 ? (
          <div className="text-sm text-gray-400">
            No accepted friends yet. (Friend adding UI comes next.)
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {friendSummaries.map(({ user, summary }) => (
              <UserProgressCard
                key={user.id}
                username={user.username}
                displayName={user.displayName ?? null}
                summary={summary}
                compareHref={`/social/compare/${encodeURIComponent(user.username)}`}
                showSolDetail={false}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function UserProgressCard({
  username,
  displayName,
  summary,
  compareHref,
  showSolDetail,
}: {
  username: string;
  displayName: string | null;
  summary: ProgressSummary;
  compareHref: string | null;
  showSolDetail: boolean;
}) {
  return (
    <div className="border border-gray-700 rounded-lg p-4 bg-black space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-gray-100 font-semibold">
            {displayName ? `${displayName} (${username})` : username}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            Medals: {summary.medalsEarned}/{summary.medalsTotal}
          </div>
        </div>

        {compareHref ? (
          <Link
            href={compareHref}
            className="text-sm text-gray-200 border border-gray-700 rounded px-3 py-1 hover:bg-gray-900"
          >
            Compare
          </Link>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <MiniStat title="Overall" value={`${summary.overall}%`} />
        <MiniStat title="Story" value={`${summary.storyOverall}%`} />
        <MiniStat title="Legend" value={`${summary.legendOverall}%`} />
        <MiniStat title="Medals" value={`${summary.medalsOverall}%`} />
      </div>

      {/* Legend breakdown: sagas + (optional) SoL subchapters */}
      <details className="border border-gray-800 rounded-md p-3">
        <summary className="cursor-pointer text-sm text-gray-200 select-none">
          Legend breakdown
        </summary>

        <div className="mt-3 space-y-3">
          <div className="space-y-2">
            {summary.sagas.map((s) => (
              <div key={s.sagaId} className="flex items-center justify-between text-sm">
                <div className="text-gray-200">{s.sagaName}</div>
                <div className="text-gray-400">
                  {s.completed}/{s.total} • {s.pct}%
                </div>
              </div>
            ))}
          </div>

          {showSolDetail && summary.solSubchapters.length > 0 ? (
            <div className="border-t border-gray-800 pt-3">
              <div className="text-sm text-gray-200 font-semibold">Stories of Legend</div>
              <div className="mt-2 max-h-64 overflow-auto space-y-1">
                {summary.solSubchapters.map((sc) => (
                  <div key={sc.subchapterId} className="flex items-center justify-between text-xs">
                    <div className="text-gray-300 truncate pr-2">
                      {sc.sortOrder}. {sc.subchapterName}
                    </div>
                    <div className="text-gray-500 whitespace-nowrap">
                      {formatStatus(sc.status)} • crown {sc.crownMax}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </details>
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
