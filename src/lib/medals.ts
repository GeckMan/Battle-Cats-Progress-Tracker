import { prisma } from "@/lib/prisma";

type MedalDef = {
  name: string;
  earned: (args: { arc: string; chapterNumber: number; treasures: string; zombies: string }) => boolean;
};

const STORY_MEDALS: MedalDef[] = [
  {
    name: "Builder of Empires",
    earned: ({ arc, chapterNumber, treasures }) => arc === "EoC" && chapterNumber === 1 && treasures === "ALL",
  },
  {
    name: "Builder of Empires 2",
    earned: ({ arc, chapterNumber, treasures }) => arc === "EoC" && chapterNumber === 2 && treasures === "ALL",
  },
  {
    name: "Builder of Empires 3",
    earned: ({ arc, chapterNumber, treasures }) => arc === "EoC" && chapterNumber === 3 && treasures === "ALL",
  },
  {
    name: "Undead Slayer",
    earned: ({ arc, chapterNumber, zombies }) => arc === "EoC" && chapterNumber === 1 && zombies === "ALL",
  },
  {
    name: "Undead Slayer 2",
    earned: ({ arc, chapterNumber, zombies }) => arc === "EoC" && chapterNumber === 2 && zombies === "ALL",
  },
  {
    name: "Undead Slayer 3",
    earned: ({ arc, chapterNumber, zombies }) => arc === "EoC" && chapterNumber === 3 && zombies === "ALL",
  },
];

export async function recomputeStoryMedalsForUser(userId: string) {
  // Fetch medal ids
  const medals = await prisma.meowMedal.findMany({
    where: { name: { in: STORY_MEDALS.map((m) => m.name) } },
    select: { id: true, name: true },
  });

  const medalIdByName = new Map(medals.map((m) => [m.name, m.id]));

  // Ensure UserMeowMedal rows exist
  const existing = await prisma.userMeowMedal.findMany({
    where: { userId, meowMedalId: { in: medals.map((m) => m.id) } },
    select: { meowMedalId: true },
  });
  const existingSet = new Set(existing.map((e) => e.meowMedalId));

  const missing = medals
    .filter((m) => !existingSet.has(m.id))
    .map((m) => ({ userId, meowMedalId: m.id }));

  if (missing.length) {
    await prisma.userMeowMedal.createMany({ data: missing });
  }

  // Load story progress
  const story = await prisma.storyChapter.findMany({
    where: { arc: "EoC", chapterNumber: { in: [1, 2, 3] } },
    select: {
      arc: true,
      chapterNumber: true,
      progress: {
        where: { userId },
        take: 1,
        select: { treasures: true, zombies: true },
      },
    },
  });

  const byKey = new Map<string, { treasures: string; zombies: string }>();
  for (const ch of story) {
    const p = ch.progress[0];
    byKey.set(`${ch.arc}:${ch.chapterNumber}`, {
      treasures: p?.treasures ?? "NONE",
      zombies: p?.zombies ?? "NONE",
    });
  }

  // Compute + persist
  for (const def of STORY_MEDALS) {
    const medalId = medalIdByName.get(def.name);
    if (!medalId) continue;

    // find matching chapter record
    const target =
      def.name.includes("Empires 2") || def.name.includes("Slayer 2")
        ? byKey.get("EoC:2")
        : def.name.includes("Empires 3") || def.name.includes("Slayer 3")
        ? byKey.get("EoC:3")
        : byKey.get("EoC:1");

    const earned = target
      ? def.earned({
          arc: "EoC",
          chapterNumber:
            def.name.includes(" 2") ? 2 : def.name.includes(" 3") ? 3 : 1,
          treasures: target.treasures,
          zombies: target.zombies,
        })
      : false;

    await prisma.userMeowMedal.updateMany({
      where: { userId, meowMedalId: medalId },
      data: {
        earned,
        earnedAt: earned ? new Date() : null,
      },
    });
  }
}
