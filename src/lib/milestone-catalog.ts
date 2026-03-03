import type { MilestoneCategory } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type MilestoneDef = {
  displayName: string;
  category: MilestoneCategory;
  sortOrder: number;
};

// NOTE: Stage names are based on in-game naming; edit sortOrder to reorder within a category.
export const MILESTONE_CATALOG: MilestoneDef[] = [
  // ── CRAZED ──────────────────────────────────────────────────────────────────
  { displayName: "The Crazed Cats",       category: "CRAZED", sortOrder: 1 },
  { displayName: "The Crazed Macho Cat",  category: "CRAZED", sortOrder: 2 },
  { displayName: "The Crazed Axe Cat",    category: "CRAZED", sortOrder: 3 },
  { displayName: "The Crazed Gross Cat",  category: "CRAZED", sortOrder: 4 },
  { displayName: "The Crazed Cow Cat",    category: "CRAZED", sortOrder: 5 },
  { displayName: "The Crazed Bird Cat",   category: "CRAZED", sortOrder: 6 },
  { displayName: "The Crazed Fish Cat",   category: "CRAZED", sortOrder: 7 },
  { displayName: "The Crazed Lizard Cat", category: "CRAZED", sortOrder: 8 },
  { displayName: "The Crazed Titan Cat",  category: "CRAZED", sortOrder: 9 },
  { displayName: "Crazed Bahamut Cat",    category: "CRAZED", sortOrder: 10 },

  // ── MANIC ───────────────────────────────────────────────────────────────────
  { displayName: "Manic Mohawk Cat",   category: "MANIC", sortOrder: 1 },
  { displayName: "Manic Macho Cat",    category: "MANIC", sortOrder: 2 },
  { displayName: "Manic Axe Cat",      category: "MANIC", sortOrder: 3 },
  { displayName: "Manic Gross Cat",    category: "MANIC", sortOrder: 4 },
  { displayName: "Manic Dark Cat",     category: "MANIC", sortOrder: 5 },
  { displayName: "Manic Flying Cat",   category: "MANIC", sortOrder: 6 },
  { displayName: "Manic Swimmer Cat",  category: "MANIC", sortOrder: 7 },
  { displayName: "Manic Lizard Cat",   category: "MANIC", sortOrder: 8 },
  { displayName: "Manic Titan Cat",    category: "MANIC", sortOrder: 9 },
  { displayName: "Awakened Bahamut Cat", category: "MANIC", sortOrder: 10 },

  // ── ADVENT ──────────────────────────────────────────────────────────────────
  { displayName: "Wrath of Bun-Bun",             category: "ADVENT", sortOrder: 1 },
  { displayName: "Attack on Titanium",            category: "ADVENT", sortOrder: 2 },
  { displayName: "Parade of the Dead",            category: "ADVENT", sortOrder: 3 },
  { displayName: "Night of the Doktor",           category: "ADVENT", sortOrder: 4 },
  { displayName: "River Styx",                    category: "ADVENT", sortOrder: 5 },
  { displayName: "Fall of Ogre Island",           category: "ADVENT", sortOrder: 6 },
  { displayName: "Conspiracy of the Universe",    category: "ADVENT", sortOrder: 7 },
  { displayName: "Dimensional Interference",      category: "ADVENT", sortOrder: 8 },
  { displayName: "Day of Judgment",               category: "ADVENT", sortOrder: 9 },
  { displayName: "The Pale Wind",                 category: "ADVENT", sortOrder: 10 },
  { displayName: "Cats in a Pinch",               category: "ADVENT", sortOrder: 11 },
  { displayName: "Honey Trap",                    category: "ADVENT", sortOrder: 12 },

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

  // ── OTHER ───────────────────────────────────────────────────────────────────
  { displayName: "Complete Stories of Legend", category: "OTHER", sortOrder: 1 },
  { displayName: "Complete Uncanny Legends",   category: "OTHER", sortOrder: 2 },
  { displayName: "Complete Zero Legends",      category: "OTHER", sortOrder: 3 },
  { displayName: "All Crazed Cats Obtained",   category: "OTHER", sortOrder: 4 },
  { displayName: "All Manic Cats Obtained",    category: "OTHER", sortOrder: 5 },
  { displayName: "All Advent Stages Cleared",  category: "OTHER", sortOrder: 6 },
];

/** Human-readable labels and display order for categories */
export const CATEGORY_META: Record<
  MilestoneCategory,
  { label: string; order: number }
> = {
  CRAZED:  { label: "Crazed Cats",            order: 0 },
  MANIC:   { label: "Manic Cats",             order: 1 },
  ADVENT:  { label: "Advent Stages",          order: 2 },
  CATCLAW: { label: "Catclaw Championships",  order: 3 },
  OTHER:   { label: "Other",                  order: 4 },
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
