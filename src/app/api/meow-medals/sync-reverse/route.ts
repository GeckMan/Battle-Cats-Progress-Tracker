import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { parseStoryAutoKey, parseLegendAutoKey } from "@/lib/meow-medal-autokey";

/**
 * The mirror image of /api/meow-medals/sync (which derives medal `earned`
 * status FROM Legend/Story progress). Requested by Setredid on Discord,
 * 2026-07-19: "sync medals and stages ... they are syncable 1 to 1" —
 * they'd already marked medals earned but hadn't gone back through every
 * individual Legend subchapter to re-enter the matching crown level, which
 * is tedious busywork for information the app already has via the medal.
 *
 * This is a one-directional BACKFILL, not a live two-way sync: it only
 * ever raises Legend crownMax / Story treasures-or-zombies up to whatever
 * an earned medal's autoKey implies as a floor, never lowers anything the
 * user already entered more precisely by hand. That avoids the two
 * directions fighting each other (e.g. someone who earned a medal for
 * 2-crowning a stage but has since gone back and 4-crowned it shouldn't
 * have this route knock them back down to 2).
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user.id as string;

    // Rate limit: 10 per minute per user (matches /api/meow-medals/sync)
    const rl = await checkRateLimit(`medals-sync-reverse:${userId}`, 10, 60 * 1000);
    if (rl.limited) return rateLimitResponse(rl.retryAfterMs);

    // 1) Which auto-linked medals does this user actually have earned?
    const medals = await prisma.meowMedal.findMany({
      where: { autoKey: { not: null } },
      select: { id: true, autoKey: true },
    });
    if (medals.length === 0) {
      return NextResponse.json({ storyRowsUpdated: 0, legendRowsUpdated: 0, evaluated: 0 });
    }

    const earnedRows = await prisma.userMeowMedal.findMany({
      where: { userId, meowMedalId: { in: medals.map((m) => m.id) }, earned: true },
      select: { meowMedalId: true },
    });
    const earnedSet = new Set(earnedRows.map((r) => r.meowMedalId));
    const earnedMedals = medals.filter((m) => earnedSet.has(m.id));
    if (earnedMedals.length === 0) {
      return NextResponse.json({ storyRowsUpdated: 0, legendRowsUpdated: 0, evaluated: 0 });
    }

    // 2) Load the catalog + existing progress needed to resolve each
    // autoKey to a real row and know whether it'd actually be an upgrade.
    const [chapters, subchapters, sagaRows, existingStory, existingLegend] = await Promise.all([
      prisma.storyChapter.findMany({ select: { id: true, arc: true, chapterNumber: true } }),
      // @ts-ignore — src/generated/prisma checked into the repo lags behind
      // prisma/schema.prisma locally (regenerated fresh on every Vercel
      // build, per CLAUDE.md); `maxCrowns` is a real column already used
      // elsewhere (legend/Sections.tsx, api/legend/bulk/route.ts).
      (prisma as any).legendSubchapter.findMany({ select: { id: true, sagaId: true, maxCrowns: true } }),
      prisma.legendSaga.findMany({
        where: { displayName: { in: ["Stories of Legend", "Uncanny Legends", "Zero Legends"] } },
        select: { id: true, displayName: true },
      }),
      prisma.userStoryProgress.findMany({
        where: { userId },
        select: { storyChapterId: true, cleared: true, treasures: true, zombies: true },
      }),
      prisma.userLegendProgress.findMany({ where: { userId }, select: { subchapterId: true, crownMax: true } }),
    ]);

    const chapterIdByArcCh = new Map(chapters.map((c) => [`${c.arc}.${c.chapterNumber}`, c.id]));
    const subById = new Map((subchapters as any[]).map((s) => [s.id as string, s]));

    const sagaIdByKey = new Map<string, string>();
    for (const s of sagaRows) {
      if (s.displayName === "Stories of Legend") sagaIdByKey.set("SOL", s.id);
      if (s.displayName === "Uncanny Legends") sagaIdByKey.set("UL", s.id);
      if (s.displayName === "Zero Legends") sagaIdByKey.set("ZL", s.id);
    }
    const subIdsBySagaId = new Map<string, string[]>();
    for (const sc of subchapters as any[]) {
      if (!subIdsBySagaId.has(sc.sagaId)) subIdsBySagaId.set(sc.sagaId, []);
      subIdsBySagaId.get(sc.sagaId)!.push(sc.id);
    }

    const storyByChapterId = new Map(existingStory.map((r) => [r.storyChapterId, r]));
    const legendBySubId = new Map(existingLegend.map((r) => [r.subchapterId, r]));

    // 3) Compute the minimum floor implied by each earned medal. Ratchet
    // only — bumpLegend keeps the highest crown requirement seen for a
    // given subchapter across all of the user's earned medals.
    const storyTargets = new Map<string, { treasuresAll?: boolean; zombiesAll?: boolean }>();
    const legendFloors = new Map<string, number>();

    function bumpLegend(subchapterId: string, crown: number) {
      const cur = legendFloors.get(subchapterId) ?? 0;
      if (crown > cur) legendFloors.set(subchapterId, crown);
    }

    for (const m of earnedMedals) {
      const ak = m.autoKey!;

      const s = parseStoryAutoKey(ak);
      if (s) {
        const chapterId = chapterIdByArcCh.get(`${s.arc}.${s.chapterNumber}`);
        if (!chapterId) continue;
        const t = storyTargets.get(chapterId) ?? {};
        if (s.kind === "treasures") t.treasuresAll = true;
        else t.zombiesAll = true;
        storyTargets.set(chapterId, t);
        continue;
      }

      const l = parseLegendAutoKey(ak);
      if (!l) continue;

      if (l.type === "LEGEND_SUBCHAPTER_CLEAR") {
        const sub = subById.get(l.subchapterId) as any;
        bumpLegend(l.subchapterId, sub?.maxCrowns ?? 4);
      } else if (l.type === "LEGEND_SUBCHAPTER_CROWN") {
        bumpLegend(l.subchapterId, l.crown);
      } else if (l.type === "LEGEND_SAGA_CROWN") {
        const sagaId = sagaIdByKey.get(l.sagaKey);
        if (!sagaId) continue;
        for (const subId of subIdsBySagaId.get(sagaId) ?? []) bumpLegend(subId, l.crown);
      }
    }

    // 4) Build upserts, skipping anything that's already at or past the
    // implied floor so the response counts (and updatedAt timestamps)
    // only reflect real changes.
    const storyOps: any[] = [];
    for (const [chapterId, target] of storyTargets) {
      const existing = storyByChapterId.get(chapterId);
      const nextTreasures = target.treasuresAll ? "ALL" : existing?.treasures ?? "NONE";
      const nextZombies = target.zombiesAll ? "ALL" : existing?.zombies ?? "NONE";
      const nextCleared = Boolean(existing?.cleared) || Boolean(target.treasuresAll || target.zombiesAll);

      const changed =
        !existing ||
        (target.treasuresAll && existing.treasures !== "ALL") ||
        (target.zombiesAll && existing.zombies !== "ALL") ||
        (nextCleared && !existing.cleared);
      if (!changed) continue;

      storyOps.push(
        prisma.userStoryProgress.upsert({
          where: { userId_storyChapterId: { userId, storyChapterId: chapterId } },
          create: { userId, storyChapterId: chapterId, cleared: nextCleared, treasures: nextTreasures, zombies: nextZombies },
          update: { cleared: nextCleared, treasures: nextTreasures, zombies: nextZombies },
          select: { id: true },
        })
      );
    }

    const legendOps: any[] = [];
    for (const [subchapterId, floorCrown] of legendFloors) {
      const existing = legendBySubId.get(subchapterId);
      const curCrown = existing?.crownMax ?? 0;
      if (curCrown >= floorCrown) continue;

      const sub = subById.get(subchapterId) as any;
      const maxCrowns = sub?.maxCrowns ?? 4;
      const nextCrown = Math.min(floorCrown, maxCrowns);
      const status = nextCrown >= maxCrowns ? "COMPLETED" : "IN_PROGRESS";

      legendOps.push(
        prisma.userLegendProgress.upsert({
          where: { userId_subchapterId: { userId, subchapterId } },
          create: { userId, subchapterId, crownMax: nextCrown, status },
          update: { crownMax: nextCrown, status },
          select: { id: true },
        })
      );
    }

    if (storyOps.length + legendOps.length > 0) {
      // @ts-ignore — mixed-model transaction array, same pattern used
      // elsewhere (e.g. api/legend/bulk/route.ts)
      await prisma.$transaction([...storyOps, ...legendOps]);
    }

    return NextResponse.json({
      storyRowsUpdated: storyOps.length,
      legendRowsUpdated: legendOps.length,
      evaluated: earnedMedals.length,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
