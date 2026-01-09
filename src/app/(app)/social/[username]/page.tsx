import { getServerSession } from "next-auth/next";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { legendSubchapterPercent, storyChapterPercent } from "@/lib/progress";

export default async function FriendProfilePage(props: {
  params: Promise<{ username?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  // @ts-expect-error
  const viewerId = session.user.id as string;

  const { username: raw } = await props.params;

  const username = decodeURIComponent(raw ?? "").trim();
  if (!username) notFound();

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, username: true, displayName: true, privacy: true },
  });

  if (!user) notFound();

  // Must be friends (or self)
  const isSelf = user.id === viewerId;
  const friendship = isSelf
    ? true
    : await prisma.friendship.findFirst({
        where: {
          status: "ACCEPTED",
          OR: [
            { requesterId: viewerId, addresseeId: user.id },
            { requesterId: user.id, addresseeId: viewerId },
          ],
        },
        select: { id: true },
      });

  if (!friendship) {
    return (
      <div className="p-8 space-y-4">
        <h1 className="text-2xl font-semibold text-gray-100">
          {user.displayName ?? user.username}
        </h1>
        <div className="text-sm text-gray-400">
          You must be friends to view progress.
        </div>
      </div>
    );
  }

  // Privacy check (default FRIENDS if no settings)
  const progressVis = user.privacy?.progressVisibility ?? "FRIENDS";
  if (!isSelf && progressVis === "PRIVATE") {
    return (
      <div className="p-8 space-y-4">
        <h1 className="text-2xl font-semibold text-gray-100">
          {user.displayName ?? user.username}
        </h1>
        <div className="text-sm text-gray-400">This user’s progress is private.</div>
      </div>
    );
  }

  // Story progress
  const storyChapters = await prisma.storyChapter.findMany({
    orderBy: { sortOrder: "asc" },
    include: { progress: { where: { userId: user.id }, take: 1 } },
  });

  const storyRows = storyChapters.map((ch) => {
    const p = ch.progress[0];
    const pct = p
      ? storyChapterPercent({ cleared: p.cleared, treasures: p.treasures, zombies: p.zombies })
      : 0;
    return { id: ch.id, name: ch.displayName, pct };
  });

  const storyOverall = storyRows.length ? Math.round(storyRows.reduce((s, r) => s + r.pct, 0) / storyRows.length) : 0;

  // Legend progress
  const sagas = await prisma.legendSaga.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      subchapters: {
        orderBy: { sortOrder: "asc" },
        include: { progress: { where: { userId: user.id }, take: 1 } },
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

  const legendOverall = legendPercents.length ? Math.round(legendPercents.reduce((a, b) => a + b, 0) / legendPercents.length) : 0;

  const overall = Math.round((storyOverall + legendOverall) / 2);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-100">
          {user.displayName ?? user.username}
        </h1>
        <div className="text-sm text-gray-500">@{user.username}</div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Overall" value={`${overall}%`} />
        <Card title="Story" value={`${storyOverall}%`} />
        <Card title="Legend" value={`${legendOverall}%`} />
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-100">Story Chapters</h2>
        <div className="space-y-2">
          {storyRows.map((r) => (
            <Row key={r.id} label={r.name} pct={r.pct} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-100">Legend Sagas</h2>
        <div className="space-y-4">
          {sagas.map((s) => {
            const sub = s.subchapters.map((sc) =>
              legendSubchapterPercent({
                sagaName: s.displayName,
                subchapterSortOrder: sc.sortOrder,
                crownMax: sc.progress[0]?.crownMax ?? null,
              })
            );
            const sagaPct = sub.length ? Math.round(sub.reduce((a, b) => a + b, 0) / sub.length) : 0;

            return (
              <div key={s.id} className="border border-gray-700 rounded-lg p-4 bg-black">
                <div className="flex items-center justify-between">
                  <div className="text-gray-100 font-semibold">{s.displayName}</div>
                  <div className="text-gray-300 text-sm">{sagaPct}%</div>
                </div>
                <div className="mt-2">
                  <Bar pct={sagaPct} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="border border-gray-700 rounded-lg p-4 bg-black">
      <div className="text-sm text-gray-400">{title}</div>
      <div className="text-2xl font-semibold text-gray-100 mt-1">{value}</div>
    </div>
  );
}

function Row({ label, pct }: { label: string; pct: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-64 text-sm text-gray-200 truncate">{label}</div>
      <div className="flex-1">
        <Bar pct={pct} />
      </div>
      <div className="w-12 text-right text-sm text-gray-300">{pct}%</div>
    </div>
  );
}

function Bar({ pct }: { pct: number }) {
  return (
    <div className="h-2 rounded bg-gray-800 overflow-hidden">
      <div className="h-2 bg-gray-200" style={{ width: `${pct}%` }} />
    </div>
  );
}
