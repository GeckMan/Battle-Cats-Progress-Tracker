import type { MilestoneCategory as GeneratedMilestoneCategory } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

// src/generated/prisma checked into the repo lags behind prisma/schema.prisma
// locally (regenerated fresh on every Vercel build, per CLAUDE.md).
// LIL_STAGES/LIL_TRIAL/MALEVOLENT/SUPER_SMASH are real enum members already
// in schema.prisma (see migration 20260716000009_add_lil_and_malevolent_
// milestone_categories) but the stale local client doesn't know about them
// yet. Widening the type here — rather than `as any`-ing every call site —
// keeps every consumer of MilestoneCategory (this file, MilestonesClient.tsx,
// milestones/page.tsx, which all import it from here) type-safe against the
// real, current set of values instead of the stale generated one.
export type MilestoneCategory =
  | GeneratedMilestoneCategory
  | "LIL_STAGES"
  | "LIL_TRIAL"
  | "MALEVOLENT"
  | "SUPER_SMASH"
  | "MONTHLY_AWAKENING";

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
  //
  // Extended 2026-07-16 (Ryan): the wiki's own "Advent Cats Awakened
  // Stages" listing (under its "Special Events" master page) actually has
  // a 7th Tier 1 entry -- "Top of the Bog" -- that was missed the first
  // time, plus an entire Tier 2 (Courts of Agony, NEO Wanwan's Glory, NEO
  // First Errand) that wasn't tracked at all. Both tiers are the same
  // AWAKENING mechanic (a harder map for a specific Advent boss), just a
  // second wave added later, so they stay in this one category rather
  // than splitting into a separate Tier 2 category.
  { displayName: "Clionel Dominant",     category: "AWAKENING", sortOrder: 1 },
  { displayName: "River Acheron",        category: "AWAKENING", sortOrder: 2 },
  { displayName: "Queen's Condemnation", category: "AWAKENING", sortOrder: 3 },
  { displayName: "Dead by Encore",       category: "AWAKENING", sortOrder: 4 },
  { displayName: "King Wahwah's Return", category: "AWAKENING", sortOrder: 5 },
  { displayName: "A Deeper Dream",       category: "AWAKENING", sortOrder: 6 },
  { displayName: "Top of the Bog",       category: "AWAKENING", sortOrder: 7 },

  // Tier 2
  { displayName: "Courts of Agony",      category: "AWAKENING", sortOrder: 8 },
  { displayName: "NEO Wanwan's Glory",   category: "AWAKENING", sortOrder: 9 },
  { displayName: "NEO First Errand",     category: "AWAKENING", sortOrder: 10 },

  // ── LI'L STAGES ───────────────────────────────────────────────────────────
  // Requested by Ryan (2026-07-16), prompted by the uploaded "Li'l Cat's
  // Trial" wiki page, which referenced these as its prerequisite. Confirmed
  // against the wiki's own "Category:Li'l Stages" listing (9 items) -- the
  // exact same 9-basic-Normal-Cat-line structure as CRAZED, just unlocking
  // the True Form of each Li'l Cat instead of a Crazed unit.
  { displayName: "Li'l Cat Awakens!",    category: "LIL_STAGES", sortOrder: 1 },
  { displayName: "Li'l Tank Awakens!",   category: "LIL_STAGES", sortOrder: 2 },
  { displayName: "Li'l Axe Awakens!",    category: "LIL_STAGES", sortOrder: 3 },
  { displayName: "Li'l Gross Awakens!",  category: "LIL_STAGES", sortOrder: 4 },
  { displayName: "Li'l Cow Awakens!",    category: "LIL_STAGES", sortOrder: 5 },
  { displayName: "Li'l Bird Awakens!",   category: "LIL_STAGES", sortOrder: 6 },
  { displayName: "Li'l Fish Awakens!",   category: "LIL_STAGES", sortOrder: 7 },
  { displayName: "Li'l Lizard Awakens!", category: "LIL_STAGES", sortOrder: 8 },
  { displayName: "Li'l Titan Awakens!",  category: "LIL_STAGES", sortOrder: 9 },

  // ── LI'L CAT'S TRIAL ──────────────────────────────────────────────────────
  // From the user's uploaded "Li'l Cat's Trial" wiki page: unlocked after
  // clearing all 9 LIL_STAGES above. Each stage cleared raises the Li'l Cat
  // unit + caps by 5 levels (Path to +45 → +50 → +55 → +60).
  { displayName: "Path to +45", category: "LIL_TRIAL", sortOrder: 1 },
  { displayName: "Path to +50", category: "LIL_TRIAL", sortOrder: 2 },
  { displayName: "Path to +55", category: "LIL_TRIAL", sortOrder: 3 },
  { displayName: "Path to +60", category: "LIL_TRIAL", sortOrder: 4 },

  // ── MALEVOLENT STAGES ─────────────────────────────────────────────────────
  // Requested by Ryan (2026-07-16). Confirmed against the wiki's own
  // "Category:Malevolent Stages" listing (9 items) -- the "evil" structural
  // counterpart to CRAZED: unlocked after clearing Mount Aku/Mount Fuji in
  // The Aku Realms, one stage per basic Normal Cat line, each rewarding the
  // True Form of the corresponding Brainwashed unit.
  { displayName: "The Malevolent Cat",    category: "MALEVOLENT", sortOrder: 1 },
  { displayName: "The Malevolent Tank",   category: "MALEVOLENT", sortOrder: 2 },
  { displayName: "The Malevolent Axe",    category: "MALEVOLENT", sortOrder: 3 },
  { displayName: "The Malevolent Gross",  category: "MALEVOLENT", sortOrder: 4 },
  { displayName: "The Malevolent Cow",    category: "MALEVOLENT", sortOrder: 5 },
  { displayName: "The Malevolent Bird",   category: "MALEVOLENT", sortOrder: 6 },
  { displayName: "The Malevolent Fish",   category: "MALEVOLENT", sortOrder: 7 },
  { displayName: "The Malevolent Lizard", category: "MALEVOLENT", sortOrder: 8 },
  { displayName: "The Malevolent Titan",  category: "MALEVOLENT", sortOrder: 9 },

  // ── SUPER SMASH FAMILIES ──────────────────────────────────────────────────
  // From the user's uploaded "Super Smash Families" wiki page: unlocked
  // after clearing all 9 MALEVOLENT stages above -- the wiki describes this
  // explicitly as "the Malevolent equivalent of Clan of the Maniacs" (i.e.
  // this category's relationship to MALEVOLENT mirrors MANIC's relationship
  // to CRAZED). Rewards Rare Tickets on first clear rather than a unit.
  { displayName: "Treacherous Road (Brutal)", category: "SUPER_SMASH", sortOrder: 1 },
  { displayName: "Heinous Road (Brutal)",     category: "SUPER_SMASH", sortOrder: 2 },

  // ── MONTHLY AWAKENING STAGES ──────────────────────────────────────────────
  // Requested by Ryan (2026-07-16). Combines the wiki's "Awakened Stages"
  // (17 entries) and "Monthly Cats Awakened Stages" (12 entries) sections
  // from its "Special Events" master page -- both are the same mechanic
  // (a one-time stage that awakens/unlocks the True Form of a specific
  // older monthly-capsule Special/Rare Cat), just split across two wiki
  // sections by era rather than by a real unlock-gate between them (unlike
  // e.g. LIL_TRIAL/SUPER_SMASH, nothing here requires clearing the other
  // group first), so they're combined into one category rather than two.
  // Deliberately excludes "Cyclone Cats Awakened Stages" (per Ryan: the
  // Meow Medals catalog already covers that ground).
  { displayName: "Actress Awakens!",        category: "MONTHLY_AWAKENING", sortOrder: 1 },
  { displayName: "Samurai Awakens!",        category: "MONTHLY_AWAKENING", sortOrder: 2 },
  { displayName: "Boogie Awakens!",         category: "MONTHLY_AWAKENING", sortOrder: 3 },
  { displayName: "Ninja Awakens!",          category: "MONTHLY_AWAKENING", sortOrder: 4 },
  { displayName: "Box Cat Awaken!",         category: "MONTHLY_AWAKENING", sortOrder: 5 },
  { displayName: "Kung-Fu Awakens!",        category: "MONTHLY_AWAKENING", sortOrder: 6 },
  { displayName: "Bondage Awakens!",        category: "MONTHLY_AWAKENING", sortOrder: 7 },
  { displayName: "Mr. Awakens!",            category: "MONTHLY_AWAKENING", sortOrder: 8 },
  { displayName: "Panties Awakens!",        category: "MONTHLY_AWAKENING", sortOrder: 9 },
  { displayName: "Tricycle Awakens!",       category: "MONTHLY_AWAKENING", sortOrder: 10 },
  { displayName: "Dom Awakens!",            category: "MONTHLY_AWAKENING", sortOrder: 11 },
  { displayName: "Zombie Awakens!",         category: "MONTHLY_AWAKENING", sortOrder: 12 },
  { displayName: "Sumo Awakens!",           category: "MONTHLY_AWAKENING", sortOrder: 13 },
  { displayName: "Skirt Awakens!",          category: "MONTHLY_AWAKENING", sortOrder: 14 },
  { displayName: "Flower Cat Awakens!",     category: "MONTHLY_AWAKENING", sortOrder: 15 },
  { displayName: "Cat Kart Awakens!",       category: "MONTHLY_AWAKENING", sortOrder: 16 },
  { displayName: "Catburger Awakens!",      category: "MONTHLY_AWAKENING", sortOrder: 17 },
  { displayName: "Evil Cat Awakes!",        category: "MONTHLY_AWAKENING", sortOrder: 18 },
  { displayName: "Doll Cats Awake!",        category: "MONTHLY_AWAKENING", sortOrder: 19 },
  { displayName: "Adult Awakes!",           category: "MONTHLY_AWAKENING", sortOrder: 20 },
  { displayName: "Maiden Awakes!",          category: "MONTHLY_AWAKENING", sortOrder: 21 },
  { displayName: "Koi Awakens!",            category: "MONTHLY_AWAKENING", sortOrder: 22 },
  { displayName: "Bride Awakens!",          category: "MONTHLY_AWAKENING", sortOrder: 23 },
  { displayName: "Vacation Awakes!",        category: "MONTHLY_AWAKENING", sortOrder: 24 },
  { displayName: "Salaryman Awakes!",       category: "MONTHLY_AWAKENING", sortOrder: 25 },
  { displayName: "Reindeer Fish Awakens!",  category: "MONTHLY_AWAKENING", sortOrder: 26 },
  { displayName: "Kung-Fu X Awakens!",      category: "MONTHLY_AWAKENING", sortOrder: 27 },
  { displayName: "Vengeance Awakes!",       category: "MONTHLY_AWAKENING", sortOrder: 28 },
  { displayName: "Sports Day Awakens!",     category: "MONTHLY_AWAKENING", sortOrder: 29 },

];

/** Human-readable labels and display order for categories */
export const CATEGORY_META: Record<
  MilestoneCategory,
  { label: string; order: number }
> = {
  CRAZED:      { label: "Crazed Cats",            order: 0 },
  MANIC:       { label: "Manic Cats",             order: 1 },
  LIL_STAGES:  { label: "Li'l Stages",            order: 2 },
  LIL_TRIAL:   { label: "Li'l Cat's Trial",       order: 3 },
  ADVENT:      { label: "Advent Stages",          order: 4 },
  AWAKENING:   { label: "Awakening Stages",       order: 5 },
  CATCLAW:     { label: "Catclaw Championships",  order: 6 },
  MALEVOLENT:  { label: "Malevolent Stages",      order: 7 },
  SUPER_SMASH: { label: "Super Smash Families",   order: 8 },
  MONTHLY_AWAKENING: { label: "Monthly Awakening Stages", order: 9 },
  OTHER:       { label: "Other",                  order: 10 },
};

/**
 * Ensures the Milestone catalog rows in the DB exactly match MILESTONE_CATALOG.
 * Adds missing entries and removes stale ones (e.g. when catalog entries are renamed/removed).
 * Safe to call on every page load.
 */
export async function ensureMilestoneCatalog() {
  // @ts-ignore — see the MilestoneCategory widening comment above; the
  // stale local generated client's own Milestone.category type doesn't
  // include the 4 new values yet, though the real column/enum does.
  const existing: { id: string; category: MilestoneCategory; displayName: string }[] =
    await (prisma as any).milestone.findMany({
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
    // @ts-ignore — same generated-client lag as above
    await (prisma as any).milestone.createMany({ data: missing });
  }

  // Remove stale entries (no longer in catalog)
  const staleIds = existing
    .filter((m) => !catalogSet.has(`${m.category}||${m.displayName}`))
    .map((m) => m.id);
  if (staleIds.length > 0) {
    await prisma.milestone.deleteMany({ where: { id: { in: staleIds } } });
  }
}
