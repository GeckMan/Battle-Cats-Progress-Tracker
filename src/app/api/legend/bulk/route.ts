import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({}, { status: 401 });

    const userId = session.user.id as string;

    // Rate limit: 30 per minute per user
    const rl = await checkRateLimit(`legend-bulk:${userId}`, 30, 60 * 1000);
    if (rl.limited) return rateLimitResponse(rl.retryAfterMs);

    const { ids, crownLevel } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const level = Number(crownLevel);
    if (!Number.isFinite(level) || level < 0 || level > 4) {
      return NextResponse.json(
        { error: "Invalid crownLevel (must be 0–4)" },
        { status: 400 }
      );
    }

    // The saga-level bulk buttons (4/3/2/1/0) set the SAME requested level
    // across every subchapter in the saga, but not every subchapter supports
    // every crown level — e.g. in Zero Legends, stages after "Garden of
    // Wilted Thoughts" only go up to crown 1 (maxCrowns=1), while earlier
    // ones go up to crown 2. Previously this endpoint wrote the raw
    // requested value verbatim to every row's crownMax, producing an
    // out-of-range value (e.g. crownMax=2 on a maxCrowns=1 row) that the
    // CrownPicker UI couldn't render a matching selected button for —
    // reported by the user as the bulk buttons "hiding" progress on later
    // stages instead of maxing them out. Fix: look up each row's own
    // subchapter.maxCrowns and clamp the applied value to it, so clicking
    // "2" sets crown 2 where that's the max and crown 1 (its own max)
    // where 2 isn't supported — mirroring the "jump to max" behavior used
    // elsewhere in the app rather than ever writing an invalid value.
    // @ts-ignore — src/generated/prisma checked into the repo lags behind
    // prisma/schema.prisma locally (regenerated fresh on every Vercel
    // build, per CLAUDE.md); `subchapter`/`maxCrowns` are real columns
    // already used elsewhere (e.g. legend/Sections.tsx), same workaround
    // pattern as the `as any` casts in src/app/api/units/route.ts.
    const rows: any[] = await (prisma as any).userLegendProgress.findMany({
      where: { id: { in: ids }, userId },
      select: { id: true, subchapter: { select: { maxCrowns: true } } },
    });

    const groups = new Map<string, { crownMax: number | null; status: string; ids: string[] }>();
    for (const row of rows) {
      const mc = row.subchapter?.maxCrowns ?? 4;
      const crownMax = level === 0 ? null : Math.min(level, mc);
      const status = crownMax === null ? "NOT_STARTED" : crownMax >= mc ? "COMPLETED" : "IN_PROGRESS";
      const key = `${crownMax}|${status}`;
      if (!groups.has(key)) groups.set(key, { crownMax, status, ids: [] });
      groups.get(key)!.ids.push(row.id);
    }

    // @ts-ignore — same generated-client lag as above
    await (prisma as any).$transaction(
      Array.from(groups.values()).map((g) =>
        (prisma as any).userLegendProgress.updateMany({
          where: { id: { in: g.ids }, userId },
          data: { crownMax: g.crownMax, status: g.status },
        })
      )
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
