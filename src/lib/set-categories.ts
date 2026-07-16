// Categorizes a non-collab gacha "set" name (Unit.setName / banners[]
// entry) into a display group for the Sets filter dropdown on the Unit
// Collection page. Added 2026-07-16 after feedback from HexagonForce and
// Ryan that the flat, fully-alphabetical "All Sets" list had grown too
// long to scan — the handful of sets people actually look for most (the
// big Rare Ticket festivals, the closed roster of named Uber sets) were
// buried between things like "Ancient Eggs" and "Battle Cats Gashapon".
//
// This deliberately does NOT try to be an exhaustive per-name lookup
// table. New named events get added every time the weekly BCData sync
// discovers one, so a fully hardcoded map would go stale immediately.
// Only the well-known, structurally-stable "big ticket" category gets an
// explicit allowlist (it's a closed roster — see SUPERFEST_INCLUDED_
// SETNAMES in scripts/sync-bcdata.ts for the wiki-sourced source of
// truth); Anniversary sets get a small explicit list since there are only
// ever a handful; Seasonal events are recognized by keyword since new
// yearly variants (a new "Summer Break" sub-event, etc.) show up often;
// anything that doesn't match any of the above falls into a safe "Other
// Events & Campaigns" catch-all, so a brand-new set always still shows up
// somewhere sensible without needing a code change here.
//
// Collab sets are handled entirely separately (the existing "Collabs"
// drill-down submenu, gated on Unit.isCollab) and never reach this file.

export type SetCategoryKey = "TICKET_GACHA" | "ANNIVERSARY" | "SEASONAL" | "OTHER";

export const SET_CATEGORY_ORDER: { key: SetCategoryKey; label: string }[] = [
  { key: "TICKET_GACHA", label: "Ticket Gacha Events" },
  { key: "ANNIVERSARY", label: "Anniversary Events" },
  { key: "SEASONAL", label: "Seasonal Events" },
  { key: "OTHER", label: "Other Events & Campaigns" },
];

// The evergreen Rare Ticket-drawn festivals/selections, the "Busters"
// anti-trait variants (also Ticket-drawn, from the combined Busters
// Festival row), and the closed roster of ~10 permanent named Uber sets
// that make up the base gacha pool — confirmed via the Superfest wiki
// page's own explicit "Uber Super Rare" list (see SUPERFEST_INCLUDED_
// SETNAMES in scripts/sync-bcdata.ts). This is what players usually mean
// by "the big gacha sets."
const TICKET_GACHA_SETS = new Set<string>([
  "Rare Cat Capsule",
  "Uber Fest",
  "Epic Fest",
  "Super Fest",
  "RoyalFest",
  "Dynasty Fest",
  "Best of the Best",
  "Best of the Best Milestone Edition",
  "NEO Best of the Best",
  "Air Busters",
  "Wave Busters",
  "Red Busters",
  "Metal Busters",
  "Colossus Busters",
  "Tales of the Nekoluga",
  "The Dynamites",
  "Sengoku Wargods Vajiras",
  "Cyber Academy Galaxy Gals",
  "Lords of Destruction Dragon Emperors",
  "Ancient Heroes Ultra Souls",
  "Justice Strikes Back! Dark Heroes",
  "The Almighties",
  "Frontline Assault Iron Legion",
  "Nature's Guardians Elemental Pixies",
]);

const ANNIVERSARY_SETS = new Set<string>([
  "9th Anniversary Special Capsules",
  "10th Anniversary Memorial Capsules",
  "10th Memorial",
  "11 1/2 Year Anniversary",
]);

// Seasonal/holiday capsule events are recognized by keyword rather than an
// exhaustive list, since new seasonal variants get added most years and a
// hardcoded list would need constant upkeep.
const SEASONAL_KEYWORDS = [
  "halloween",
  "easter",
  "xmas",
  "christmas",
  "white day",
  "valentine",
  "lunar new year",
  "june bride",
  "new moon",
  "love letter",
  "gals of summer",
  "summer break",
  "lucky capsule",
  "year's end",
];

export function categorizeSetName(setName: string): SetCategoryKey {
  if (TICKET_GACHA_SETS.has(setName)) return "TICKET_GACHA";
  if (ANNIVERSARY_SETS.has(setName)) return "ANNIVERSARY";
  const lower = setName.toLowerCase();
  if (SEASONAL_KEYWORDS.some((kw) => lower.includes(kw))) return "SEASONAL";
  return "OTHER";
}

// Groups + alphabetizes a flat list of set names for display, dropping any
// category bucket that ends up empty (e.g. a friend's collection that
// happens to have no anniversary-tagged units yet).
export function groupSetNames(setNames: string[]): { key: SetCategoryKey; label: string; sets: string[] }[] {
  const buckets = new Map<SetCategoryKey, string[]>();
  for (const name of setNames) {
    const key = categorizeSetName(name);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(name);
  }
  return SET_CATEGORY_ORDER.map((c) => ({
    ...c,
    sets: (buckets.get(c.key) ?? []).slice().sort((a, b) => a.localeCompare(b)),
  })).filter((c) => c.sets.length > 0);
}
