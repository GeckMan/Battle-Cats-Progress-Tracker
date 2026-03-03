import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { legendSubchapterPercent, storyChapterPercent } from "@/lib/progress";

export default async function FriendProfilePage(props: {
  params: Promise<{ username?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const viewerId = session.user.id as string;

  const { username: raw } = await props.params;
  const username = decodeURIComponent(raw ?? "").trim();
  if (!username) notFound();

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, username: true, displayName: true, privacy: true },
  });
  if (!user) notFound();

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
        <Link href="/social" className="text-xs text-amber-600 hover:text-amber-400 transition-colors">← Back to Social</Link>
        <h1 className="text-2xl font-semibold text-gray-100">{user.displayName ?? user.username}</h1>
        <div className="text-sm text-gray-400">You must be friends to view this profile.</div>
      </div>
    );
  }

  const progressVis = user.privacy?.progressVisibility ?? "FRIENDS";
  if (!isSelf && progressVis === "PRIVATE") {
    return (
      <div className="p-8 space-y-4">
        <Link href="/social" className="text-xs text-amber-600 hover:text-amber-400 transition-colors">← Back to Social</Link>
        <h1 className="text-2xl font-semibold text-gray-100">{user.displayName ?? user.username}</h1>
        <div className="text-sm text-gray-400">This user's progress is private.</div>
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
    const pct = p ? storyChapterPercent({ cleared: p.cleared, treasures: p.treasures, zombies: p.zombies }) : 0;
    return { id: ch.id, name: ch.displayName, pct };
  });
  const storyOverall = storyRows.length
    ? Math.round(storyRows.reduce((s, r) => s + r.pct, 0) / storyRows.length)
    : 0;

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
  const legendRows = sagas.map((s) => {
    const percents = s.subchapters.map((sc) =>
      legendSubchapterPercent({ sagaName: s.displayName, subchapterSortOrder: sc.sortOrder, crownMax: sc.progress[0]?.crownMax ?? null })
    );
    const pct = percents.length ? Math.round(percents.reduce((a, b) => a + b, 0) / percents.length) : 0;
    return { id: s.id, name: s.displayName, pct };
  });
  const legendOverall = legendRows.length
    ? Math.round(legendRows.reduce((s, r) => s + r.pct, 0) / legendRows.length)
    : 0;

  // Medals
  const medalsTotal  = await prisma.meowMedal.count();
  const medalsEarned = await prisma.userMeowMedal.count({ where: { userId: user.id, earned: true } });
  const medalsOverall = medalsTotal === 0 ? 0 : Math.round((medalsEarned / medalsTotal) * 100);

  // Units
  // @ts-ignore
  const unitTotal = await (prisma as any).unit.count({ where: { source: { not: "UNOBTAINABLE" } } });
  // @ts-ignore
  const unitObtained = await (prisma as any).userUnitProgress.count({
    where: { userId: user.id, formLevel: { gte: 1 }, unit: { source: { not: "UNOBTAINABLE" } } },
  });
  const unitsOverall = unitTotal === 0 ? 0 : Math.round((unitObtained / unitTotal) * 100);

  const overall = Math.round((storyOverall + legendOverall + medalsOverall + unitsOverall) / 4);

  const displayLabel = user.displayName ?? user.username;

  return (
    <div className="p-4 pt-16 md:p-8 space-y-6 w-full">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/social" className="text-xs text-amber-600 hover:text-amber-400 transition-colors mb-2 inline-block">
            ← Back to Social
          </Link>
          <h1 className="text-2xl font-semibold text-gray-100">{displayLabel}</h1>
          {user.displayName && <div className="text-sm text-gray-500 mt-0.5">@{user.username}</div>}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/social/${encodeURIComponent(user.username)}/units`}
            className="text-xs px-3 py-1.5 rounded border border-gray-700 bg-gray-900/50 text-gray-300 hover:bg-gray-800 hover:text-gray-100 transition-colors whitespace-nowrap"
          >
            View Units →
          </Link>
          {!isSelf && (
            <Link
              href={`/social/compare/${encodeURIComponent(user.username)}`}
              className="text-xs px-3 py-1.5 rounded border border-amber-800 bg-amber-950/30 text-amber-300 hover:bg-amber-950/60 transition-colors whitespace-nowrap"
            >
              Compare →
            </Link>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 md:gap-3">
        {[
          { title: "Overall", pct: overall, highlight: true },
          { title: "Story",   pct: storyOverall },
          { title: "Legend",  pct: legendOverall },
          { title: "Medals",  pct: medalsOverall },
          { title: "Units",   pct: unitsOverall },
        ].map(({ title, pct, highlight }) => (
          <StatCard key={title} title={title} pct={pct} highlight={highlight} />
        ))}
      </div>

      {/* Story + Legend side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section title="Story Chapters">
          <div className="space-y-2">
            {storyRows.map((r) => (
              <CompactRow key={r.id} label={r.name} pct={r.pct} />
            ))}
          </div>
        </Section>

        <Section title="Legend Stages">
          <div className="space-y-2">
            {legendRows.map((r) => (
              <CompactRow key={r.id} label={r.name} pct={r.pct} />
            ))}
          </div>
        </Section>
      </div>

      {/* Medals + Units side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section title={`Meow Medals — ${medalsEarned}/${medalsTotal}`}>
          <CompactRow label="All medals" pct={medalsOverall} sub={`${medalsEarned}/${medalsTotal}`} />
        </Section>

        <Section title={`Units — ${unitObtained}/${unitTotal}`}>
          <CompactRow label="All units" pct={unitsOverall} sub={`${unitObtained}/${unitTotal}`} />
        </Section>
      </div>
    </div>
  );
}

/* ── Helpers ────────────────────────────────────────────────────────────── */

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

function StatCard({ title, pct, highlight = false }: { title: string; pct: number; highlight?: boolean }) {
  return (
    <div className={`border rounded-lg p-4 bg-black ${highlight ? "border-amber-800" : "border-gray-700"}`}>
      <div className="text-sm text-gray-400 mb-1">{title}</div>
      <div className="text-3xl font-semibold" style={{ color: pctColor(pct) }}>{pct}%</div>
      <div className="mt-3 h-2 rounded bg-gray-800 overflow-hidden">
        <div className={`h-2 ${barFill(pct)}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-gray-700 rounded-lg p-4 bg-black">
      <h2 className="text-sm font-semibold text-gray-300 mb-3 pb-2 border-b border-gray-800">{title}</h2>
      {children}
    </div>
  );
}

function CompactRow({ label, pct, sub }: { label: string; pct: number; sub?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-[35%] text-sm text-gray-300 truncate flex-shrink-0">{label}</div>
      <div className="flex-1 h-2 rounded bg-gray-800 overflow-hidden">
        <div className={`h-2 ${barFill(pct)}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="w-16 text-right text-sm flex-shrink-0" style={{ color: pctColor(pct) }}>
        {sub ?? `${pct}%`}
      </div>
    </div>
  );
}
