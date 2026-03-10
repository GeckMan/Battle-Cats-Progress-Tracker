const { prisma, disconnect } = require("./seed-client.cts");

async function main() {
  const storyChapters = [
    { arc: "EoC", chapterNumber: 1, displayName: "Empire of Cats Ch. 1", sortOrder: 1 },
    { arc: "EoC", chapterNumber: 2, displayName: "Empire of Cats Ch. 2", sortOrder: 2 },
    { arc: "EoC", chapterNumber: 3, displayName: "Empire of Cats Ch. 3", sortOrder: 3 },

    { arc: "ItF", chapterNumber: 1, displayName: "Into the Future Ch. 1", sortOrder: 101 },
    { arc: "ItF", chapterNumber: 2, displayName: "Into the Future Ch. 2", sortOrder: 102 },
    { arc: "ItF", chapterNumber: 3, displayName: "Into the Future Ch. 3", sortOrder: 103 },

    { arc: "CotC", chapterNumber: 1, displayName: "Cats of the Cosmos Ch. 1", sortOrder: 201 },
    { arc: "CotC", chapterNumber: 2, displayName: "Cats of the Cosmos Ch. 2", sortOrder: 202 },
    { arc: "CotC", chapterNumber: 3, displayName: "Cats of the Cosmos Ch. 3", sortOrder: 203 },
  ];

  for (const c of storyChapters) {
    await prisma.storyChapter.upsert({
      where: { arc_chapterNumber: { arc: c.arc, chapterNumber: c.chapterNumber } },
      update: { displayName: c.displayName, sortOrder: c.sortOrder },
      create: c,
    });
  }

  console.log("Seed complete (Neon).");
}

main()
  .catch((e: any) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await disconnect();
  });
