import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import CompareUnitsClient from "./CompareUnitsClient";

/* ── Types shared with client ──────────────────────────────────────────── */

export type CompareUnit = {
  id: string;
  unitNumber: number;
  name: string;
  evolvedName: string | null;
  trueName: string | null;
  ultraName: string | null;
  category: string;
  formCount: number;
  sortOrder: number;
  isCollab: boolean;
  source: string | null;
  setName: string | null;
  myForm: number;    // 0-4
  theirForm: number; // 0-4
};

/* ── Helpers ────────────────────────────────────────────────────────────── */

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

export default async function CompareUnitsPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
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
        <h1 className="text-2xl font-semibold text-gray-100">Compare Units</h1>
        <div className="text-sm text-gray-400">
          You can only compare units with accepted friends.
        </div>
        <Link
          href="/social"
          className="text-sm text-amber-400 hover:underline"
        >
          ← Back to Social
        </Link>
      </div>
    );
  }

  const me = await prisma.user.findUnique({
    where: { id: viewerId },
    select: { username: true, displayName: true },
  });

  // Fetch all units + both users' progress in parallel
  // @ts-ignore — Prisma generated types may lag behind schema
  const [allUnits, myProgress, theirProgress] = await Promise.all([
    (prisma as any).unit.findMany({
      where: {
        OR: [{ source: null }, { source: { not: "UNOBTAINABLE" } }],
      },
      orderBy: [{ sortOrder: "asc" }],
      select: {
        id: true,
        unitNumber: true,
        name: true,
        evolvedName: true,
        trueName: true,
        ultraName: true,
        category: true,
        formCount: true,
        sortOrder: true,
        isCollab: true,
        source: true,
        setName: true,
      },
    }),
    (prisma as any).userUnitProgress.findMany({
      where: { userId: viewerId },
      select: { unitId: true, formLevel: true },
    }),
    (prisma as any).userUnitProgress.findMany({
      where: { userId: other.id },
      select: { unitId: true, formLevel: true },
    }),
  ]);

  const myMap = new Map<string, number>(
    (myProgress as any[]).map((p) => [p.unitId, p.formLevel])
  );
  const theirMap = new Map<string, number>(
    (theirProgress as any[]).map((p) => [p.unitId, p.formLevel])
  );

  const units: CompareUnit[] = (allUnits as any[]).map((u) => ({
    id: u.id,
    unitNumber: u.unitNumber,
    name: u.name,
    evolvedName: u.evolvedName ?? null,
    trueName: u.trueName ?? null,
    ultraName: u.ultraName ?? null,
    category: u.category,
    formCount: u.formCount,
    sortOrder: u.sortOrder,
    isCollab: u.isCollab,
    source: u.source,
    setName: u.setName,
    myForm: myMap.get(u.id) ?? 0,
    theirForm: theirMap.get(u.id) ?? 0,
  }));

  const myLabel = me?.displayName ?? me?.username ?? "You";
  const theirLabel = other.displayName ?? other.username;

  return (
    <CompareUnitsClient
      units={units}
      myLabel={myLabel}
      theirLabel={theirLabel}
      friendUsername={other.username}
    />
  );
}
