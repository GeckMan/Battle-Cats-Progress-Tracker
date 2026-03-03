import { prisma } from "@/lib/prisma";

/**
 * Activity types:
 *   STORY_CLEARED     – cleared a story chapter (or updated treasures/zombies)
 *   LEGEND_COMPLETED  – completed a legend subchapter or reached a new crown
 *   MEDAL_EARNED      – earned a meow medal
 *   MILESTONE_CLEARED – cleared a milestone
 *   UNIT_OBTAINED     – obtained a new unit (formLevel went from 0 to 1+)
 *   UNIT_EVOLVED      – evolved an existing unit to a higher form
 *   UNIT_REMOVED      – removed a unit (formLevel went to 0)
 */

export async function logActivity(
  userId: string,
  type: string,
  itemName?: string | null,
  detail?: string | null
) {
  try {
    // @ts-ignore – Activity model added in new migration
    await (prisma as any).activity.create({
      data: {
        userId,
        type,
        itemName: itemName ?? null,
        detail: detail ?? null,
      },
    });
  } catch (e) {
    // Don't let activity logging failures break the main operation
    console.error("Failed to log activity:", e);
  }
}

export async function logBulkActivities(
  userId: string,
  entries: { type: string; itemName?: string | null; detail?: string | null }[]
) {
  if (entries.length === 0) return;
  try {
    // @ts-ignore
    await (prisma as any).activity.createMany({
      data: entries.map((e) => ({
        userId,
        type: e.type,
        itemName: e.itemName ?? null,
        detail: e.detail ?? null,
      })),
    });
  } catch (e) {
    console.error("Failed to log bulk activities:", e);
  }
}
