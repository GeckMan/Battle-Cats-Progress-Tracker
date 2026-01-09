import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { legendSubchapterPercent } from "@/lib/progress";

export default async function CompareLegendSagaPage(props: {
  params: Promise<{ username?: string; sagaId?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  // @ts-expect-error
  const viewerId = session.user.id as string;

  const { username: rawUsername, sagaId } = await props.params;

  const friendUsername = decodeURIComponent(rawUsername ?? "").trim();
  if (!friendUsername) notFound();
  if (!sagaId) notFound();

  const friend = await prisma.user.findUnique({
    where: { username: friendUsername },
    select: { id: true, username: true, displayName: true, privacy: true },
  });
  if (!friend) notFound();

  const isSelf = friend.id === viewerId;

  const friendship = isSelf
    ? true
    : await prisma.friendship.findFirst({
        where: {
          status: "ACCEPTED",
          OR: [
            { requesterId: viewerId, addresseeId: friend.id },
            { requesterId: friend.id, addresseeId: viewerId },
          ],
        },
        select: { id: true },
      });

  if (!friendship) {
    return (
      <div className="p-8 space-y-4">
        <h1 className="text-2xl font-semibold text-gray-100">Legend Comparison</h1>
        <div className="text-sm text-gray-400">You must be friends to compare progress.</div>
      </div>
    );
  }

  const progressVis = friend.privacy?.progressVisibility ?? "FRIENDS";
  if (!isSelf && progressVis === "PRIVATE") {
    return (
      <div className="p-8 space-y-4">
        <h1 className="text-2xl font-semibold text-gray-100">Legend Comparison</h1>
        <div className="text-sm text-gray-400">This user’s progress is private.</div>
      </div>
    );
  }

  const saga = await prisma.legendSaga.findUnique({
    where: { id: sagaId },
    select: { id: true, displayName: true, sortOrder: true },
  });
  if (!saga) notFound();

  const subchapters = await prisma.legendSubchapter.findMany({
    where: { sagaId },
    orderBy: { sortOrder: "asc" },
    include: {
      progress: {
        where: { userId: { in: [viewerId, friend.id] } },
        select: { userId: true, crownMax: true },
      },
    },
  });

  const rows = subchapters.map((sc) => {
    const vp = sc.progress.find((p) => p.userId === viewerId);
    const fp = sc.progress.find((p) => p.userId === friend.id);

    const you = legendSubchapterPercent({
      sagaName: saga.displayName,
      subchapterSortOrder: sc.sortOrder,
      crownMax: vp?.crownMax ?? null,
    });

    const them = legendSubchapterPercent({
      sagaName: saga.displayName,
      subchapterSortOrder: sc.sortOrder,
      crownMax: fp?.crownMax ?? null,
    });

    return {
      id: sc.id,
      label: sc.displayName,
      you,
      them,
      youCrown: vp?.crownMax ?? null,
      themCrown: fp?.crownMax ?? null,
    };
  });

  const youAvg = rows.length ? Math.round(rows.reduce((s, r) => s + r.you, 0) / rows.length) : 0;
  const themAvg = rows.length ? Math.round(rows.reduce((s, r) => s + r.them, 0) / rows.length) : 0;

  return (
    <div className="p-8 space-y-6">
      <div className="space-y-2">
        <Link
          className="text-sm text-gray-400 hover:underline"
          href={`/social/compare/${encodeURIComponent(friend.username)}`}
        >
          ← Back to compare
        </Link>

        <div>
          <h1 className="text-2xl font-semibold text-gray-100">{saga.displayName}</h1>
          <div className="text-sm text-gray-500">
            You vs{" "}
            <span className="text-gray-200 font-medium">
              {friend.displayName ?? friend.username}
            </span>{" "}
            <span className="text-gray-500">@{friend.username}</span>
          </div>
        </div>
      </div>

      <div className="border border-gray-700 rounded-lg p-4 bg-black">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">Saga average</div>
          <div className="text-sm text-gray-300">
            You: <span className="text-gray-100 font-semibold">{youAvg}%</span> • Them:{" "}
            <span className="text-gray-100 font-semibold">{themAvg}%</span>
          </div>
        </div>
        <div className="mt-3 grid gap-2">
          <MiniRow label="You" pct={youAvg} />
          <MiniRow label="Them" pct={themAvg} />
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-100">Subchapters</h2>

        <div className="space-y-2">
          {rows.map((r) => (
            <div key={r.id} className="flex items-center gap-3">
              <div className="w-64 text-sm text-gray-200 truncate">{r.label}</div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-14 text-xs text-gray-500">You</div>
                  <div className="flex-1">
                    <Bar pct={r.you} />
                  </div>
                  <div className="w-16 text-right text-xs text-gray-500">
                    {r.you}% {crownBadge(r.youCrown)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-14 text-xs text-gray-500">Them</div>
                  <div className="flex-1">
                    <Bar pct={r.them} />
                  </div>
                  <div className="w-16 text-right text-xs text-gray-500">
                    {r.them}% {crownBadge(r.themCrown)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function crownBadge(crownMax: number | null) {
  const c = crownMax ?? 0;
  if (c <= 0) return "";
  return `(${c}c)`;
}

function MiniRow({ label, pct }: { label: string; pct: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-14 text-xs text-gray-500">{label}</div>
      <div className="flex-1">
        <Bar pct={pct} />
      </div>
      <div className="w-12 text-right text-xs text-gray-500">{pct}%</div>
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
