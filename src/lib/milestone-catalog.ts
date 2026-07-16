import type { MilestoneCategory } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type MilestoneDef = {
  displayName: string;
  category: MilestoneCategory;
  sortOrder: number;
};

// NOTE: Stage names are based on in-game naming; edit sortOrder to reorder within a category.
//
// CRAZED and MANIC each correspond 1:1 to the 9 basic Normal Cats you start
// the game with (Cat, Tank, Axe, Gross, Cow, Bird, Fish, Lizard, Titan).
// Crazed Cats are Super Rare versions of each line's BASE name; Manic Cats
// are that Crazed cat's Awakening (true-form) evolution, which for several
// lines has a wholly different name from the base line (e.g. the Cat
// line's true form is "Mohawk Cat", not "Macho Cat" — Macho is only the
// EVOLVED form in between). Bug report from HexagonForce, 2026-07-16,
// confirmed against the wiki's own "Crazed Cat Stages"/"Manic Cats" stage
// navbox (which lists all 9 real Manic names together) and several
// individual stage pages (Deathhawk, Vulcanizer, Unjust War, Muscle Party,
// Lots O' Lion all directly confirm their boss's exact name):
//   - CRAZED was missing Crazed Tank Cat entirely (a nonexistent "Crazed
//     Macho Cat" was standing in its place), and had "The Crazed Cats"
//     pluralized inconsistently with every other entry in the category.
//   - MANIC had "Manic Mohawk Cat" AND "Manic Macho Cat" as if they were
//     two different milestones — they're the same cat's true form vs.
//     evolved form, and only the true form ("Mohawk") is the actual
//     milestone. Same duplication bug for the Axe line ("Manic Axe Cat"
//     alongside "Manic Dark Cat", its real true-form name). "Manic Swimmer
//     Cat" isn't a real unit at all. Net result: the Tank, Gross, Cow, and
//     Fish lines' real Manic units (Eraser, Macho Legs, Lion, Island) were
//     completely absent from the list.
export const MILESTONE_CATALOG: MilestoneDef[] = [
  // ── CRAZED ──────────────────────────────────────────────────────────────────
  { displayName: "The Crazed Cat",        category: "CRAZED", sortOrder: 1 },
  { displayName: "The Crazed Tank Cat",   category: "CRAZED", sortOrder: 2 },
  { displayName: "The Crazed Axe Cat",    category: "CRAZED", sortOrder: 3 },
  { displayName: "The Crazed Gross Cat",  category: "CRAZED", sortOrder: 4 },
  { displayName: "The Crazed Cow Cat",    category: "CRAZED", sortOrder: 5 },
  { displayName: "The Crazed Bird Cat",   category: "CRAZED", sortOrder: 6 },
  { displayName: "The Crazed Fish Cat",   category: "CRAZED", sortOrder: 7 },
  { displayName: "The Crazed Lizard Cat", category: "CRAZED", sortOrder: 8 },
  { displayName: "The Crazed Titan Cat",  category: "CRAZED", sortOrder: 9 },

  // ── MANIC ───────────────────────────────────────────────────────────────────
  { displayName: "Manic Mohawk Cat",      category: "MANIC", sortOrder: 1 },
  { displayName: "Manic Eraser Cat",      category: "MANIC", sortOrder: 2 },
  { displayName: "Manic Dark Cat",        category: "MANIC", sortOrder: 3 },
  { displayName: "Manic Macho Legs Cat",  category: "MANIC", sortOrder: 4 },
  { displayName: "Manic Lion Cat",        category: "MANIC", sortOrder: 5 },
  { displayName: "Manic Flying Cat",      category: "MANIC", sortOrder: 6 },
  { displayName: "Manic Island Cat",      category: "MANIC", sortOrder: 7 },
  { displayName: "Manic King Dragon Cat", category: "MANIC", sortOrder: 8 },
  { displayName: "Manic Jamiera Cat",     category: "MANIC", sortOrder: 9 },

  // ── ADVENT (Standard Tier 1) ──────────────────────────────────────────────
  { displayName: "Clionel Ascendant",     category: "ADVENT", sortOrder: 1 },
  { displayName: "River Styx",            category: "ADVENT", sortOrder: 2 },
  { displayName: "Queen's Coronation",    category: "ADVENT", sortOrder: 3 },
  { displayName: "Dead on Debut",         category: "ADVENT", sortOrder: 4 },
  { displayName: "King Wahwah's Revenge", category: "ADVENT", sortOrder: 5 },
  { displayName: "Deeply Dreaming",       category: "ADVENT", sortOrder: 6 },
  { displayName: "Blue Impact",           category: "ADVENT", sortOrder: 7 },
  { displayName: "Bottom of the Swamp",   category: "ADVENT", sortOrder: 8 },
  { displayName: "Prelude to Ruin",       category: "ADVENT", sortOrder: 9 },
  { displayName: "Temptation's Symphony", category: "ADVENT", sortOrder: 10 },
  { displayName: "Rashomon",              category: "ADVENT", sortOrder: 11 },

  // ── ADVENT (Standard Tier 2) ──────────────────────────────────────────────
  { displayName: "Courts of Torment",     category: "ADVENT", sortOrder: 12 },
  { displayName: "Papuu's Paradise",      category: "ADVENT", sortOrder: 13 },
  { displayName: "The Old Queen",         category: "ADVENT", sortOrder: 14 },
  { displayName: "Wanwan's Glory",        category: "ADVENT", sortOrder: 15 },
  { displayName: "Z-Onel Rises!",         category: "ADVENT", sortOrder: 16 },
  { displayName: "First Errand",          category: "ADVENT", sortOrder: 17 },

  // ── GREAT ADVENT ──────────────────────────────────────────────────────────
  { displayName: "Reign of the Tyrant",       category: "ADVENT", sortOrder: 18 },
  { displayName: "Invasion of the Swamplord", category: "ADVENT", sortOrder: 19 },
  { displayName: "Hunt for the Xenobeast",    category: "ADVENT", sortOrder: 20 },
  { displayName: "Jumbo Invasion",            category: "ADVENT", sortOrder: 21 },
  { displayName: "Invasion of Poultrio",      category: "ADVENT", sortOrder: 22 },

  // ── CATCLAW ─────────────────────────────────────────────────────────────────
  { displayName: "Championship Rank 1",  category: "CATCLAW", sortOrder: 1 },
  { displayName: "Championship Rank 2",  category: "CATCLAW", sortOrder: 2 },
  { displayName: "Championship Rank 3",  category: "CATCLAW", sortOrder: 3 },
  { displayName: "Championship Rank 4",  category: "CATCLAW", sortOrder: 4 },
  { displayName: "Championship Rank 5",  category: "CATCLAW", sortOrder: 5 },
  { displayName: "Championship Rank 6",  category: "CATCLAW", sortOrder: 6 },
  { displayName: "Championship Rank 7",  category: "CATCLAW", sortOrder: 7 },
  { displayName: "Championship Rank 8",  category: "CATCLAW", sortOrder: 8 },
  { displayName: "Championship Rank 9",  category: "CATCLAW", sortOrder: 9 },
  { displayName: "Championship Rank 10", category: "CATCLAW", sortOrder: 10 },
  { displayName: "Championship Rank 11", category: "CATCLAW", sortOrder: 11 },
  { displayName: "Championship Rank 12", category: "CATCLAW", sortOrder: 12 },

  // ── AWAKENING ─────────────────────────────────────────────────────────────
  // Requested by HexagonForce (2026-07-16). These are the harder "Awakening"
  // tier for specific Advent bosses -- a further, separately-unlocked map
  // beyond that boss's regular ADVENT-category stages above (e.g. Clionel
  // Dominant unlocks after clearing Clionel Ascendant). Confirmed against
  // the wiki's own "Advent Cats" stage navbox, which lists all 6 real names
  // together. Not every Advent boss has one of these yet -- PONOS adds new
  // ones over time, same as Zero Legends sub-chapters, so this list may
  // need extending later.
  { displayName: "Clionel Dominant",     category: "AWAKENING", sortOrder: 1 },
  { displayName: "River Acheron",        category: "AWAKENING", sortOrder: 2 },
  { displayName: "Queen's Condemnation", category: "AWAKENING", sortOrder: 3 },
  { displayName: "Dead by Encore",       category: "AWAKENING", sortOrder: 4 },
  { displayName: "King Wahwah's Return", category: "AWAKENING", sortOrder: 5 },
  { displayName: "A Deeper Dream",       category: "AWAKENING", sortOrder: 6 },

];

/** Human-readable labels and display order for categories */
export const CATEGORY_META: Record<
  MilestoneCategory,
  { label: string; order: number }
> = {
  CRAZED:     { label: "Crazed Cats",            order: 0 },
  MANIC:      { label: "Manic Cats",             order: 1 },
  ADVENT:     { label: "Advent Stages",          order: 2 },
  AWAKENING:  { label: "Awakening Stages",       order: 3 },
  CATCLAW:    { label: "Catclaw Championships",  order: 4 },
  OTHER:      { label: "Other",                  order: 5 },
};

/**
 * Ensures the Milestone catalog rows in the DB exactly match MILESTONE_CATALOG.
 * Adds missing entries and removes stale ones (e.g. when catalog entries are renamed/removed).
 * Safe to call on every page load.
 */
export async function ensureMilestoneCatalog() {
  const existing = await prisma.milestone.findMany({
    select: { id: true, category: true, displayName: true },
  });

  const catalogSet = new Set(
    MILESTONE_CATALOG.map((m) => `${m.category}||${m.displayName}`)
  );
  const haveSet = new Set(
    existing.map((m) => `${m.category}||${m.displayName}`)
  );

  // Add missing entries
  const missing = MILESTONE_CATALOG.filter(
    (m) => !haveSet.has(`${m.category}||${m.displayName}`)
  );
  if (missing.length > 0) {
    await prisma.milestone.createMany({ data: missing });
  }

  // Remove stale entries (no longer in catalog)
  const staleIds = existing
    .filter((m) => !catalogSet.has(`${m.category}||${m.displayName}`))
    .map((m) => m.id);
  if (staleIds.length > 0) {
    await prisma.milestone.deleteMany({ where: { id: { in: staleIds } } });
  }
}
