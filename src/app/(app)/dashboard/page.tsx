import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

import { legendSubchapterPercent, storyChapterPercent } from "@/lib/progress";
import { ensureStoryProgress, ensureMedalProgress } from "@/lib/ensure-progress";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const userId = session.user.id as string;

  await Promise.all([ensureStoryProgress(userId), ensureMedalProgress(userId)]);

  const storyChapters = await prisma.storyChapter.findMany({
    orderBy: { sortOrder: "asc" },
    include: { progress: { where: { userId }, take: 1 } },
  });

  const storyRows = storyChapters.map((ch) => {
    const p = ch.progress[0];
    const pct = p
      ? storyChapterPercent({
          cleared: p.cleared,
          treasures: p.treasures,
          zombies: p.zombies,
        })
      : 0;
    return { id: ch.id, name: ch.displayName, pct };
  });

  const storyOverall =
    storyRows.length === 0
      ? 0
      : Math.round(storyRows.reduce((s, r) => s + r.pct, 0) / storyRows.length);

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

  const medalsWithProgress = await prisma.meowMedal.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
    include: {
      earnedBy: {
        where: { userId },
        select: { earned: true },
        take: 1,
      },
    },
  });

  const medalTotal = medalsWithProgress.length;
  const medalEarned = medalsWithProgress.filter((m) => m.earnedBy[0]?.earned).length;
  const medalsOverall = medalTotal === 0 ? 0 : Math.round((medalEarned / medalTotal) * 100);

  const medalsByCategory = new Map<string, { total: number; earned: number }>();
  for (const m of medalsWithProgress) {
    const cat = m.category ?? "Other";
    const earned = Boolean(m.earnedBy[0]?.earned);
    const cur = medalsByCategory.get(cat) ?? { total: 0, earned: 0 };
    cur.total += 1;
    if (earned) cur.earned += 1;
    medalsByCategory.set(cat, cur);
  }

  const medalCategoryRows = Array.from(medalsByCategory.entries())
    .map(([category, v]) => {
      const pct = v.total === 0 ? 0 : Math.round((v.earned / v.total) * 100);
      return { category, ...v, pct };
    })
    .sort((a, b) => a.category.localeCompare(b.category));

  const overall = Math.round((storyOverall + legendOverall + medalsOverall) / 3);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-100">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card title="Overall" value={`${overall}%`} pct={overall} highlight />
        <Card title="Story" value={`${storyOverall}%`} pct={storyOverall} />
        <Card title="Legend" value={`${legendOverall}%`} pct={legendOverall} />
        <Card title="Medals" value={`${medalsOverall}%`} pct={medalsOverall} />
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
                <div>
                  <div className="text-gray-100 font-semibold">{s.displayName}</div>
                  <div className="text-sm" style={{ color: pctColor(sagaPct) }}>{sagaPct}%</div>
                </div>
                <div className="mt-2">
                  <Bar pct={sagaPct} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold text-gray-100">Meow Medals</h2>
          <div className="text-sm text-gray-400">
            {medalEarned}/{medalTotal} earned
          </div>
        </div>

        {medalCategoryRows.length === 0 ? (
          <div className="text-sm text-gray-400">No medals found.</div>
        ) : (
          <div className="space-y-4">
            {medalCategoryRows.map((r) => (
              <div key={r.category} className="border border-gray-700 rounded-lg p-4 bg-black">
                <div>
                  <div className="text-gray-100 font-semibold">{r.category}</div>
                  <div className="text-sm" style={{ color: pctColor(r.pct) }}>
                    {r.earned}/{r.total} ({r.pct}%)
                  </div>
                </div>
                <div className="mt-2">
                  <Bar pct={r.pct} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function pctColor(pct: number) {
  if (pct >= 80) return "#fbbf24"; // amber-400
  if (pct >= 40) return "#d97706"; // amber-600
  if (pct > 0)   return "#92400e"; // amber-800
  return "#4b5563"; // gray-600
}

function barFill(pct: number) {
  if (pct >= 80) return "bg-amber-400";
  if (pct >= 40) return "bg-amber-600";
  if (pct > 0)   return "bg-amber-800";
  return "bg-gray-700";
}

function Card({ title, value, pct, highlight = false }: { title: string; value: string; pct: number; highlight?: boolean }) {
  return (
    <div className={`border rounded-lg p-4 bg-black ${highlight ? "border-amber-800" : "border-gray-700"}`}>
      <div className="text-sm text-gray-400">{title}</div>
      <div className="text-2xl font-semibold mt-1" style={{ color: pctColor(pct) }}>{value}</div>
      <div className="mt-2">
        <Bar pct={pct} />
      </div>
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
      <div className="w-12 text-right text-sm" style={{ color: pctColor(pct) }}>{pct}%</div>
    </div>
  );
}

function Bar({ pct }: { pct: number }) {
  return (
    <div className="h-2 rounded bg-gray-800 overflow-hidden">
      <div className={`h-2 transition-all duration-300 ${barFill(pct)}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
