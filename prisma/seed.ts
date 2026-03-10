import "dotenv/config";
import { seedPrisma as prisma, seedDisconnect } from "./seed-client.ts";

async function main() {
  /* ---------- Story Chapters ---------- */
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

  /* ---------- Legend Sagas + Subchapters ---------- */
  async function upsertLegendSaga(displayName: string, sortOrder: number) {
    const existing = await prisma.legendSaga.findFirst({
      where: { displayName },
      select: { id: true },
    });

    if (existing) {
      return prisma.legendSaga.update({
        where: { id: existing.id },
        data: { sortOrder },
      });
    }

    return prisma.legendSaga.create({
      data: { displayName, sortOrder },
    });
  }

  async function upsertLegendSubchapter(sagaId: string, displayName: string, sortOrder: number) {
    const existing = await prisma.legendSubchapter.findFirst({
      where: { sagaId, displayName },
      select: { id: true },
    });

    if (existing) {
      await prisma.legendSubchapter.update({
        where: { id: existing.id },
        data: { sortOrder },
      });
      return;
    }

    await prisma.legendSubchapter.create({
      data: { sagaId, displayName, sortOrder },
    });
  }

  const SOL = [
    "The Legend Begins",
    "Passion Land",
    "Glucosamine Desert",
    "Swimming Cats",
    "Risqué Terrain",
    "Western Street",
    "Sea of Tuna",
    "Bamboo Island",
    "Squishy Cave",
    "Volkanos Volcano",
    "Neverending Cat Story",
    "Castle of Fish",
    "Sushi Island",
    "The Scratching Post",
    "Parthenon",
    "Low Tide Beach",
    "Alcatraz",
    "Jail Break Tunnel",
    "Capone’s Jail",
    "Silk Road",
    "Stairway to Darkness",
    "Prince of Darkness",
    "Dead End Night",
    "Battle Royale",
    "Scars of War",
    "Sea Polluter",
    "Body & Soul",
    "Weak & Mildly Acidic",
    "Intrepid Cats",
    "Shadow Cosmopolis",
    "Galapa-Goth",
    "Kombu Cape",
    "Axis of Evil",
    "Suburbs of the Dead",
    "Quarantine Isles",
    "Mouseyland",
    "Walk of Fame",
    "Cutpurse Coast",
    "Above & Below",
    "Windless Island",
    "IT Catacombs",
    "Grotesque Gallery",
    "Area 22",
    "Beyond the Savannah",
    "Blizzard Boulevard",
    "Singularityville",
    "Ends of the Earth",
    "The Legend Ends",
    "Laboratory of Relics",
  ];

  const UL = [
    "A New Legend",
    "Here Be Dragons",
    "The Endless Wood",
    "Primeval Currents",
    "Barking Bay",
    "Abyss Gazers",
    "Neo-Necropolis",
    "Law of the Wildlands",
    "Pararila Peninsula",
    "Coup de Chat",
    "Cherry Isles",
    "Depths of My Heart",
    "Ghost Sea",
    "Exile’s Resort",
    "Roads of Torment",
    "Heaven’s Back Alley",
    "Battle in the Bath",
    "Ancient Mountains",
    "Marine Ministry",
    "The Devils’ Academy",
    "The Gelatin Mines",
    "Drunken Foundry",
    "Unearthed Artifacts",
    "Realm of Whyworry",
    "Pumping Titanium",
    "Morningstar Isle",
    "In the Sleeping Forest",
    "Laboratory Island",
    "Forgotten Graves",
    "Dawn of the Beginning",
    "The Happy Lucky Temple",
    "Theatre of Fear",
    "Diver’s City",
    "Nasi-Go-Round",
    "DNA Plantation",
    "Ancient Forest Labyrinth",
    "Castle of the Sentinels",
    "Spacetime Distortion",
    "Imminent Disaster",
    "Bikura, Harbor of Evil",
    "Dead Heat Land",
    "Rose-Colored Road",
    "Behemoth’s Peak",
    "Moodist Beach",
    "Cat-Chasing Village",
    "Bazaar of the Pirate King",
    "Between Truth and Lies",
    "Humanity Catified",
    "Sacred Forest",
  ];

  const ZL = [
    "Zero Field",
    "The Edge of Spacetime",
    "Cats Cradle Basin",
    "The Ururuvu Journals",
    "New World Ehen",
    "Cats of a Common Sea",
    "Truth in Extremes",
    "Demon of Deciliter Bay",
    "Garden of Wilted Thoughts",
    "Stratospheric Pathway",
    "Konjac Valley",
    "Candy Paradise",
    "Secluded Cavy Island",
    "Resort De La Cospa",
    "Restricted Area",
    "Cruise Ship Panic",
    "En Garde Shrine",
    "Forest Playground",
    "Newtown Trench",
    "Truth’s Devouring Maw",
    "A Journey of Moments",
    "Patisserie Parklands",
    "Reverse Royal Grave",
    "Sleeping Chasm",
    "Forgotten Republic",
    "Booklet Islands",
    "Vanity Company",
  ];

  const solSaga = await upsertLegendSaga("Stories of Legend", 1);
  for (let i = 0; i < SOL.length; i++) {
    await upsertLegendSubchapter(solSaga.id, SOL[i], i + 1);
  }

  const ulSaga = await upsertLegendSaga("Uncanny Legends", 2);
  for (let i = 0; i < UL.length; i++) {
    await upsertLegendSubchapter(ulSaga.id, UL[i], i + 1);
  }

  const zlSaga = await upsertLegendSaga("Zero Legends", 3);
  for (let i = 0; i < ZL.length; i++) {
    await upsertLegendSubchapter(zlSaga.id, ZL[i], i + 1);
  }

  /* ---------- Meow Medals (Story v1) ---------- */
  function medalFileFromSortOrder(sortOrder?: number | null) {
  if (!sortOrder || sortOrder <= 0) return null;
  const n = sortOrder - 1; // zero-based index
  return `Medal_${String(n).padStart(3, "0")}.png`;
}

    const medals = [
    {
      name: "Builder of Empires",
      category: "Story",
      sortOrder: 1,
      description: "Collect all Gold Treasures from Empire of Cats Ch. 1",
      requirementText: "Treasures: EoC Ch. 1 = ALL",
      sourceUrl: "https://battle-cats.fandom.com/wiki/Meow_Medals",
    },
    {
      name: "Builder of Empires 2",
      category: "Story",
      sortOrder: 2,
      description: "Collect all Gold Treasures from Empire of Cats Ch. 2",
      requirementText: "Treasures: EoC Ch. 2 = ALL",
      sourceUrl: "https://battle-cats.fandom.com/wiki/Meow_Medals",
    },
    {
      name: "Builder of Empires 3",
      category: "Story",
      sortOrder: 3,
      description: "Collect all Gold Treasures from Empire of Cats Ch. 3",
      requirementText: "Treasures: EoC Ch. 3 = ALL",
      sourceUrl: "https://battle-cats.fandom.com/wiki/Meow_Medals",
    },
    {
      name: "Undead Slayer",
      category: "Story",
      sortOrder: 10,
      description: "Clear all Empire of Cats Ch. 1 Zombie Outbreak Stages",
      requirementText: "Zombies: EoC Ch. 1 = ALL",
      sourceUrl: "https://battle-cats.fandom.com/wiki/Meow_Medals",
    },
    {
      name: "Undead Slayer 2",
      category: "Story",
      sortOrder: 11,
      description: "Clear all Empire of Cats Ch. 2 Zombie Outbreak Stages",
      requirementText: "Zombies: EoC Ch. 2 = ALL",
      sourceUrl: "https://battle-cats.fandom.com/wiki/Meow_Medals",
    },
    {
      name: "Undead Slayer 3",
      category: "Story",
      sortOrder: 12,
      description: "Clear all Empire of Cats Ch. 3 Zombie Outbreak Stages",
      requirementText: "Zombies: EoC Ch. 3 = ALL",
      sourceUrl: "https://battle-cats.fandom.com/wiki/Meow_Medals",
    },
  ].map((m) => ({
    ...m,
    imageFile: medalFileFromSortOrder(m.sortOrder),
  }));


  for (const m of medals) {
    const existing = await prisma.meowMedal.findFirst({
      where: { name: m.name },
      select: { id: true },
    });

    if (existing) {
      await prisma.meowMedal.update({
        where: { id: existing.id },
                data: {
          requirementText: m.requirementText,
          description: m.description,
          category: m.category,
          sortOrder: m.sortOrder,
          sourceUrl: m.sourceUrl,
          imageFile: m.imageFile,
        },

      });
    } else {
      await prisma.meowMedal.create({ data: m });
    }
  }

  /* ---------- Ensure UserMeowMedal rows exist ---------- */
  const allUsers = await prisma.user.findMany({ select: { id: true } });
  const allMedals = await prisma.meowMedal.findMany({ select: { id: true } });

  for (const u of allUsers) {
    // existing earned rows for this user
    const existing = await prisma.userMeowMedal.findMany({
      where: { userId: u.id },
      select: { meowMedalId: true },
    });
    const have = new Set(existing.map((x) => x.meowMedalId));

    const missing = allMedals
      .filter((m) => !have.has(m.id))
      .map((m) => ({
        userId: u.id,
        meowMedalId: m.id,
        earned: false,
      }));

    if (missing.length > 0) {
      await prisma.userMeowMedal.createMany({ data: missing });
    }
  }

  console.log(`Legend seed complete: SoL=${SOL.length}, UL=${UL.length}, ZL=${ZL.length}`);
  console.log(`Medals seed complete: medals=${medals.length}`);
  console.log("Seed complete (Story + Legend + Medals).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await seedDisconnect();
  });
