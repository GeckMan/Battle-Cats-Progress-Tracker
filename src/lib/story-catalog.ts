import { prisma } from "@/lib/prisma";

/**
 * StoryChapter catalog rows aren't seeded by a migration or by BCData sync
 * (unlike Unit/LegendSubchapter/MeowMedal) — the original 9 rows (Empire of
 * Cats/Into the Future/Cats of the Cosmos, 3 chapters each) were inserted
 * once via prisma/seed.ts early in the project and the Story page has just
 * read them ever since. Adding a new arc here follows the same
 * "ensure*Catalog(), safe to call on every page load" pattern already used
 * for Milestones (see ensureMilestoneCatalog() in milestone-catalog.ts) —
 * except this one only ADDS missing rows and never deletes, since deleting
 * a StoryChapter cascades to every user's UserStoryProgress on it, and this
 * project doesn't have live DB read access from the assistant's sandbox to
 * double-check the existing 9 rows' exact displayName text before writing
 * a diff-and-delete version safely.
 *
 * The Aku Realms (requested by Ryan, 2026-07-21, from the wiki page) is a
 * bonus 49-stage chapter unlocked after Unleashing the Cats, but the wiki
 * itself says it's "officially considered as their own story chapter" — a
 * single pass/fail unit, not broken into sub-chapters like the other three
 * arcs are. It also has no new Treasures to collect and no Zombie Outbreak
 * stages of its own, so it's tracked as a single "cleared" toggle only —
 * see the AkuRealms special-casing in ArcSections.tsx and
 * storyChapterPercent() in progress.ts.
 */
export const STORY_CHAPTER_CATALOG: {
  arc: string;
  chapterNumber: number;
  displayName: string;
  sortOrder: number;
}[] = [
  { arc: "AkuRealms", chapterNumber: 1, displayName: "The Aku Realms", sortOrder: 301 },
];

export async function ensureStoryChapterCatalog() {
  await prisma.storyChapter.createMany({
    data: STORY_CHAPTER_CATALOG,
    skipDuplicates: true,
  });
}
