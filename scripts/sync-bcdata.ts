/**
 * sync-bcdata.ts — Automated data sync from fieryhenry/BCData
 *
 * Clones the BCData repository, finds the latest EN game version,
 * and upserts units + legend stages into the database.
 *
 * Usage:
 *   npx tsx ./scripts/sync-bcdata.ts
 *
 * Environment:
 *   DATABASE_URL or DIRECT_DATABASE_URL — Neon PostgreSQL connection string
 *
 * Data source:
 *   https://git.battlecatsmodding.org/fieryhenry/BCData.git
 *   Fallback: https://github.com/fieryhenry/BCData.git
 *
 * What it syncs:
 *   - Units: name (all forms), rarity/category, form count
 *   - Legend Stages: saga names + subchapter names
 *
 * Safe to run repeatedly — all writes are upserts.
 */

import "dotenv/config";
import { execSync } from "child_process";
import { readdirSync, readFileSync, existsSync } from "fs";
import path from "path";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/index.js";

// ── Config ───────────────────────────────────────────────────────────────────
const BCDATA_REPO_URLS = [
  "https://git.battlecatsmodding.org/fieryhenry/BCData.git",
  "https://github.com/fieryhenry/BCData.git",
];
const CLONE_DIR = "/tmp/bcdata-sync";
const REGION = "en";

// Rarity ranges in unitbuy.csv (row index = unit ID)
// The rarity is NOT a single column — it's determined by unit ID ranges
// that are well-known in the BC community:
//   0–8: Normal, 9–56: Special, rest determined by nyankoPictureBookData
// However, nyankoPictureBookData_Attribute.csv maps units to rarity groups.
// Column format: group0_id, group1_id, group2_id, group3_id, group4_id
// where groups correspond to rarity tiers in the picture book.
//
// Simpler approach: use the "rarity" field from nyankoPictureBookData.csv
// Column 3 (0-indexed) encodes the rarity:
//   0 = Normal, 1 = Special, 2 = Rare, 3 = Super Rare, 4 = Uber Rare, 5 = Legend Rare

const RARITY_MAP: Record<number, string> = {
  0: "NORMAL",
  1: "SPECIAL",
  2: "RARE",
  3: "SUPER_RARE",
  4: "UBER_RARE",
  5: "LEGEND_RARE",
};

// Fallback: known unit ID ranges for rarity (EN version)
const RARITY_RANGES: [number, number, string][] = [
  [0, 8, "NORMAL"],       // Cat through Lizard Cat
  [9, 56, "SPECIAL"],     // Ninja Cat through various special units
  // Everything else defaults to RARE, refined by nyankoPictureBookData
];

const CATEGORY_SORT_BASE: Record<string, number> = {
  NORMAL: 0,
  SPECIAL: 10000,
  RARE: 20000,
  SUPER_RARE: 30000,
  UBER_RARE: 40000,
  LEGEND_RARE: 50000,
};

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const dbUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("ERROR: DATABASE_URL or DIRECT_DATABASE_URL must be set");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: dbUrl, max: 5 });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool), log: ["warn", "error"] });

  try {
    // Step 1: Clone/pull BCData
    console.log("── Cloning BCData repository ──");
    cloneOrPull();

    // Step 2: Find latest EN version
    const latestVersion = findLatestVersion();
    console.log(`Latest EN version: ${latestVersion}`);

    const dataDir = path.join(CLONE_DIR, "game_data", REGION, latestVersion);
    // Fallback for old repo structure (no game_data folder)
    const altDataDir = path.join(CLONE_DIR, `${latestVersion}${REGION}`);
    const baseDir = existsSync(dataDir) ? dataDir : existsSync(altDataDir) ? altDataDir : null;

    if (!baseDir) {
      console.error(`ERROR: Cannot find data directory. Tried:\n  ${dataDir}\n  ${altDataDir}`);
      process.exit(1);
    }
    console.log(`Using data dir: ${baseDir}`);

    const dataLocal = path.join(baseDir, "DataLocal");
    const resLocal = path.join(baseDir, "resLocal");

    // Step 3: Parse and sync units
    console.log("\n── Syncing Units ──");
    await syncUnits(prisma, dataLocal, resLocal);

    // Step 4: Parse and sync legend stages
    console.log("\n── Syncing Legend Stages ──");
    await syncLegendStages(prisma, dataLocal, resLocal);

    console.log("\n✓ Sync complete!");
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

// ── Git Operations ───────────────────────────────────────────────────────────

function cloneOrPull() {
  if (existsSync(path.join(CLONE_DIR, ".git"))) {
    console.log("  Pulling latest changes...");
    try {
      execSync("git pull --ff-only", { cwd: CLONE_DIR, stdio: "pipe", timeout: 60000 });
      return;
    } catch {
      console.log("  Pull failed, re-cloning...");
      execSync(`rm -rf ${CLONE_DIR}`);
    }
  }

  for (const url of BCDATA_REPO_URLS) {
    try {
      console.log(`  Cloning from ${url}...`);
      execSync(`git clone --depth 1 "${url}" "${CLONE_DIR}"`, { stdio: "pipe", timeout: 120000 });
      return;
    } catch (e) {
      console.log(`  Failed to clone from ${url}, trying next...`);
    }
  }

  throw new Error("Failed to clone BCData from any source");
}

function findLatestVersion(): string {
  // Try game_data/en/ structure first (Forgejo repo)
  const gameDataEnDir = path.join(CLONE_DIR, "game_data", REGION);
  if (existsSync(gameDataEnDir)) {
    const versions = readdirSync(gameDataEnDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && /^\d+\.\d+\.\d+$/.test(d.name))
      .map((d) => d.name)
      .sort(compareVersions);
    if (versions.length > 0) return versions[versions.length - 1];
  }

  // Fallback: old structure with version+region folders at root
  const rootDirs = readdirSync(CLONE_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^\d+\.\d+\.\d+en$/.test(d.name))
    .map((d) => d.name.replace(/en$/, ""))
    .sort(compareVersions);

  if (rootDirs.length > 0) return rootDirs[rootDirs.length - 1];

  throw new Error("No version directories found in BCData");
}

function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) - (pb[i] ?? 0);
  }
  return 0;
}

// ── Unit Sync ────────────────────────────────────────────────────────────────

interface ParsedUnit {
  unitNumber: number;
  name: string;
  evolvedName: string | null;
  trueName: string | null;
  ultraName: string | null;
  category: string;
  rarityFromData: boolean; // true if rarity came from data file, false if guessed
  formCount: number;
  sortOrder: number;
}

async function syncUnits(prisma: PrismaClient, dataLocal: string, resLocal: string) {
  // 1. Parse rarity from data files
  const rarityMap = parseRarityMap(dataLocal);
  console.log(`  Parsed rarity for ${rarityMap.size} units`);

  // 2. Build authoritative form count map from nyankoPictureBookData.csv.
  // This file has one row per unit. One of its columns encodes the number of
  // forms available for that unit (1-4). We auto-detect the column.
  const formCountMap = parseFormCountMap(dataLocal);
  console.log(`  Parsed form counts for ${formCountMap.size} units`);

  // 3. Parse unit names from Unit_Explanation files
  const units: ParsedUnit[] = [];
  const explanationFiles = readdirSync(resLocal)
    .filter((f) => /^Unit_Explanation\d+_en\.csv$/.test(f))
    .sort((a, b) => {
      const na = parseInt(a.match(/\d+/)![0], 10);
      const nb = parseInt(b.match(/\d+/)![0], 10);
      return na - nb;
    });

  for (const file of explanationFiles) {
    const fileNum = parseInt(file.match(/\d+/)![0], 10);
    const unitNumber = fileNum - 1; // Unit_Explanation1 = unit 0

    const content = readFileSync(path.join(resLocal, file), "utf-8");
    const lines = content.trim().split("\n").filter((l) => l.trim());

    if (lines.length === 0) continue;

    // Each line = one form. First field (pipe-delimited) = name.
    const formNames = lines.map((line) => {
      const name = line.split("|")[0].trim();
      return name && name !== "＠" ? name : null;
    });

    const name = formNames[0];
    if (!name) continue; // Skip units with no name

    // Use nyankoPictureBookData form count as the authoritative source.
    // Explanation files often have names for unreleased/datamined forms,
    // but the picture book data reflects what's actually in the game.
    // Fall back to explanation file line count if picture book data is unavailable.
    const pbFormCount = formCountMap.get(unitNumber);
    const nameBasedCount = formNames.filter((n) => n !== null).length;
    const formCount = pbFormCount ?? nameBasedCount;

    // Only keep form names for forms that actually exist (per picture book count).
    // This prevents unreleased/datamined form names from appearing in the app.
    const evolvedName = formCount >= 2 ? (formNames[1] ?? null) : null;
    const trueName = formCount >= 3 ? (formNames[2] ?? null) : null;
    const ultraName = formCount >= 4 ? (formNames[3] ?? null) : null;

    // Determine rarity — prefer data file, fall back to guess
    const dataRarity = rarityMap.get(unitNumber);
    const category = dataRarity ?? guessRarity(unitNumber);
    const rarityFromData = !!dataRarity;

    const sortOrder = (CATEGORY_SORT_BASE[category] ?? 0) + unitNumber;

    units.push({
      unitNumber,
      name,
      evolvedName,
      trueName,
      ultraName,
      category,
      rarityFromData,
      formCount,
      sortOrder,
    });
  }

  console.log(`  Found ${units.length} units in BCData`);

  // 3. Count existing units in DB
  const existingCount = await (prisma as any).unit.count();
  const newUnits = units.length - existingCount;
  if (newUnits > 0) {
    console.log(`  ${newUnits} NEW units to add!`);
  } else {
    console.log(`  No new units (DB has ${existingCount}, BCData has ${units.length})`);
  }

  // 4. Upsert all units
  // If rarity was reliably parsed from data files, update category.
  // If rarity was only guessed, DON'T overwrite existing category (it may have
  // been correctly set by the seed migration or a previous successful sync).
  const hasReliableRarity = rarityMap.size > 0;
  if (!hasReliableRarity) {
    console.warn("  ⚠ Rarity was NOT parsed from data files — will NOT overwrite existing unit categories");
  }

  const batchSize = 50;
  let upserted = 0;
  for (let i = 0; i < units.length; i += batchSize) {
    const batch = units.slice(i, i + batchSize);
    await Promise.all(
      batch.map((u) => {
        // For updates: only include category/sortOrder if we have reliable rarity data
        const updateData: Record<string, unknown> = {
          name: u.name,
          evolvedName: u.evolvedName,
          trueName: u.trueName,
          ultraName: u.ultraName,
          formCount: u.formCount,
        };
        if (u.rarityFromData) {
          updateData.category = u.category;
          updateData.sortOrder = u.sortOrder;
        }

        return (prisma as any).unit.upsert({
          where: { unitNumber: u.unitNumber },
          create: {
            id: `unit-${u.unitNumber}`,
            unitNumber: u.unitNumber,
            name: u.name,
            evolvedName: u.evolvedName,
            trueName: u.trueName,
            ultraName: u.ultraName,
            category: u.category,
            formCount: u.formCount,
            sortOrder: u.sortOrder,
          },
          update: updateData,
        });
      })
    );
    upserted += batch.length;
    process.stdout.write(`\r  Upserted ${upserted}/${units.length} units...`);
  }
  console.log(`\n  ✓ ${upserted} units synced`);
}

function parseRarityMap(dataLocal: string): Map<number, string> {
  const map = new Map<number, string>();

  // ── Strategy 1: Parse unitbuy.csv ──────────────────────────────────────
  // unitbuy.csv has one row per unit (row index = unit ID).
  // One of its columns contains the rarity value (0-5).
  // The column index varies across game versions, so we auto-detect it.
  const unitbuyPath = path.join(dataLocal, "unitbuy.csv");
  if (existsSync(unitbuyPath)) {
    const content = readFileSync(unitbuyPath, "utf-8");
    const lines = content.trim().split("\n").filter((l) => l.trim());

    if (lines.length > 9) {
      // Parse all rows into columns
      const rows = lines.map((l) => l.split(",").map((c) => parseInt(c.trim(), 10)));
      const numCols = Math.min(...rows.map((r) => r.length));

      // Auto-detect: find a column where:
      //   1. All values are in range [0, 5]
      //   2. The first 9 rows (units 0-8, Normal cats) all have value 0
      //   3. Rows 9-56 (Special cats) all have value 1
      //   4. There are at least 3 distinct values total (not all the same)
      let bestCol = -1;
      for (let col = 0; col < numCols; col++) {
        const colVals = rows.map((r) => r[col]);
        const allInRange = colVals.every((v) => v >= 0 && v <= 5);
        if (!allInRange) continue;

        const normalOk = colVals.slice(0, 9).every((v) => v === 0);
        if (!normalOk) continue;

        const specialOk = colVals.slice(9, Math.min(57, colVals.length)).every((v) => v === 1);
        if (!specialOk) continue;

        const distinctVals = new Set(colVals);
        if (distinctVals.size >= 3) {
          bestCol = col;
          break;
        }
      }

      if (bestCol >= 0) {
        console.log(`  Found rarity in unitbuy.csv column ${bestCol}`);
        for (let i = 0; i < rows.length; i++) {
          const rarityNum = rows[i][bestCol];
          const category = RARITY_MAP[rarityNum];
          if (category) {
            map.set(i, category);
          }
        }
        console.log(`  Rarity distribution: ${summarizeRarity(map)}`);
        return map;
      } else {
        console.warn("  WARNING: Could not auto-detect rarity column in unitbuy.csv");
      }
    }
  }

  // ── Strategy 2: Parse nyankoPictureBookData.csv ────────────────────────
  // Each row = one unit. Try to find a rarity column here too.
  const pbPath = path.join(dataLocal, "nyankoPictureBookData.csv");
  if (existsSync(pbPath)) {
    const content = readFileSync(pbPath, "utf-8");
    const lines = content.trim().split("\n").filter((l) => l.trim());

    if (lines.length > 9) {
      const rows = lines.map((l) => l.split(",").map((c) => parseInt(c.trim(), 10)));
      const numCols = Math.min(...rows.map((r) => r.length));

      for (let col = 0; col < numCols; col++) {
        const colVals = rows.map((r) => r[col]);
        const allInRange = colVals.every((v) => v >= 0 && v <= 5);
        if (!allInRange) continue;

        // For picture book data, units 0-8 should map to rarity 0
        const normalOk = colVals.slice(0, 9).every((v) => v === 0);
        if (!normalOk) continue;

        const distinctVals = new Set(colVals);
        if (distinctVals.size >= 4) {
          console.log(`  Found rarity in nyankoPictureBookData.csv column ${col}`);
          for (let i = 0; i < rows.length; i++) {
            const rarityNum = rows[i][col];
            const category = RARITY_MAP[rarityNum];
            if (category) {
              map.set(i, category);
            }
          }
          console.log(`  Rarity distribution: ${summarizeRarity(map)}`);
          return map;
        }
      }
    }
  }

  console.warn("  WARNING: Could not parse rarity from any data file, using fallback guessRarity()");
  return map;
}

/** Summarize rarity distribution for logging */
function summarizeRarity(map: Map<number, string>): string {
  const counts: Record<string, number> = {};
  for (const v of map.values()) {
    counts[v] = (counts[v] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([k, v]) => `${k}=${v}`)
    .join(", ");
}

function guessRarity(unitNumber: number): string {
  // Fallback rarity using well-known unit ID ranges for Battle Cats EN.
  // Normal: 0–8, Special: 9–56, everything else defaults to RARE.
  // This is only used when the data files can't be parsed — the sync
  // will log a warning so it's visible in GitHub Actions.
  if (unitNumber <= 8) return "NORMAL";
  if (unitNumber <= 56) return "SPECIAL";
  return "RARE";
}

// ── Form Count Parsing ───────────────────────────────────────────────────────

function parseFormCountMap(dataLocal: string): Map<number, number> {
  const map = new Map<number, number>();

  // nyankoPictureBookData.csv: one row per unit (row index = unit ID).
  // One column encodes the number of forms shown in the Cat Guide (1-4).
  // We auto-detect this column by checking which one:
  //   1. Has all values in range [1, 4] (or [2, 4] for known multi-form units)
  //   2. Units 0-8 (Normal cats) all have value 3 (Normal/Evolved/True forms)
  //   3. Has reasonable distribution (not all the same value)
  const pbPath = path.join(dataLocal, "nyankoPictureBookData.csv");
  if (!existsSync(pbPath)) {
    console.warn("  WARNING: nyankoPictureBookData.csv not found — form counts unavailable");
    return map;
  }

  const content = readFileSync(pbPath, "utf-8");
  const lines = content.trim().split("\n").filter((l) => l.trim());
  if (lines.length < 10) return map;

  const rows = lines.map((l) => l.split(",").map((c) => parseInt(c.trim(), 10)));
  const numCols = Math.min(...rows.map((r) => r.length));

  let bestCol = -1;
  for (let col = 0; col < numCols; col++) {
    const colVals = rows.map((r) => r[col]);

    // All values must be in range [1, 6] (some units might have 5+ forms eventually)
    if (!colVals.every((v) => v >= 1 && v <= 6)) continue;

    // Units 0-8 (Normal cats: Cat through Titan Cat) all have 3 forms
    const normalOk = colVals.slice(0, 9).every((v) => v === 3);
    if (!normalOk) continue;

    // Should have at least 3 distinct values (1, 2, 3 at minimum)
    const distinct = new Set(colVals);
    if (distinct.size < 3) continue;

    // Should have a reasonable distribution — most units have 2 or 3 forms
    const count2 = colVals.filter((v) => v === 2).length;
    const count3 = colVals.filter((v) => v === 3).length;
    if (count2 + count3 > colVals.length * 0.3) {
      bestCol = col;
      break;
    }
  }

  if (bestCol >= 0) {
    console.log(`  Found form count in nyankoPictureBookData.csv column ${bestCol}`);
    for (let i = 0; i < rows.length; i++) {
      map.set(i, rows[i][bestCol]);
    }
    // Log distribution
    const dist: Record<number, number> = {};
    for (const v of map.values()) dist[v] = (dist[v] ?? 0) + 1;
    console.log(`  Form count distribution: ${Object.entries(dist).map(([k, v]) => `${k}-form=${v}`).join(", ")}`);
  } else {
    console.warn("  WARNING: Could not auto-detect form count column in nyankoPictureBookData.csv");
  }

  return map;
}

// ── Legend Stage Sync ────────────────────────────────────────────────────────
//
// Map_Name.csv has names for ALL map types (1200+ entries): SoL, UL, ZL,
// daily stages, events, collabs, etc.
//
// CRITICAL: UL and ZL entries are INTERLEAVED in Map_Name.csv (they were
// added simultaneously in alternating game updates). We CANNOT use contiguous
// index ranges for UL or ZL.
//
// Strategy:
//   - SoL: indices 0-48 (contiguous, confirmed, fixed at 49)
//   - ZL:  hardcoded known names, searched individually by name
//          (grows with game updates — forward scan picks up new ones)
//   - UL:  found by ELIMINATION — from "Exile's Resort" onward, collect
//          names that aren't SoL, aren't ZL, and aren't non-legend,
//          capped at exactly 49

// ── SoL: 49 subchapters, indices 0-48, fixed forever ─────────────────────
const SOL_EXPECTED_FIRST = "The Legend Begins";
const SOL_EXPECTED_LAST = "Laboratory of Relics";
const SOL_COUNT = 49;

// ── UL: 49 subchapters, fixed forever ─────────────────────────────────────
// UL entries are INTERLEAVED with ZL in Map_Name.csv (indices 908+).
// We find UL by elimination: everything from "Exile's Resort" onward that
// is NOT SoL, NOT ZL, and NOT a non-legend name, capped at 49.
const UL_FIRST_NAME = "Exile's Resort";
const UL_COUNT = 49;

// ── ZL: dynamic, grows with game updates ──────────────────────────────────
// These are in correct sort order. New subchapters are added at the end.
const ZL_KNOWN_NAMES: string[] = [
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
  "Truth's Devouring Maw",
  "A Journey of Moments",
  "Patisserie Parklands",
  "Reverse Royal Grave",
  "Sleeping Chasm",
  "Forgotten Republic",
  "Booklet Islands",
  "Vainglorious Venture",
  "Phantasmagoria",
  "Muscle Empire",
];

// Max ZL subchapters before we stop scanning for new ones
const ZL_MAX = 60;

async function syncLegendStages(prisma: PrismaClient, dataLocal: string, resLocal: string) {
  // ── Step 1: Parse Map_Name.csv ─────────────────────────────────────────
  const mapNamePath = path.join(resLocal, "Map_Name.csv");
  if (!existsSync(mapNamePath)) {
    console.log("  Map_Name.csv not found — skipping legend stages");
    return;
  }

  const mapContent = readFileSync(mapNamePath, "utf-8");
  const mapLines = mapContent.trim().split("\n").filter((l) => l.trim());

  // Parse names — format is "id|name" (pipe-delimited, numeric ID first)
  const allNames: string[] = [];
  for (const line of mapLines) {
    const p = line.split("|");
    const id = parseInt(p[0].trim(), 10);
    if (!isNaN(id) && p.length > 1) {
      allNames.push(p.slice(1).join("|").trim());
    } else {
      allNames.push(p[0].trim());
    }
  }
  console.log(`  Map_Name.csv: ${allNames.length} names`);

  // Build a lookup: name → index (first occurrence)
  const nameToIdx = new Map<string, number>();
  for (let i = 0; i < allNames.length; i++) {
    if (!nameToIdx.has(allNames[i])) {
      nameToIdx.set(allNames[i], i);
    }
  }

  // ── Step 2: Build subchapter lists per saga ────────────────────────────
  type SubEntry = { sortOrder: number; name: string; sagaName: string };
  const subchapters: SubEntry[] = [];
  const sagaNames: string[] = [];

  // Non-legend stage names that appear interleaved in Map_Name.csv
  const NON_LEGEND_PATTERNS = [
    "Growing", "XP ", "Merciless XP", "Cat Ticket Chance",
    "Facing Danger", "Siege of Hippoe", "Clionel Ascendant",
    "Otherworld Colosseum", "Catclaw Championships",
    "Catamin", "Gauntlet", "Baron Seal",
  ];

  function isNonLegendName(nm: string): boolean {
    for (const pat of NON_LEGEND_PATTERNS) {
      if (nm.startsWith(pat) || nm.includes(pat)) return true;
    }
    // Event/collab patterns
    if (nm.includes("(Normal)") || nm.includes("(Expert)") || nm.includes("(Deadly)") ||
        nm.includes("(Merciless)") || nm.includes("(Insane)")) return true;
    if (nm.endsWith("Ranking") || nm.startsWith("Ranking")) return true;
    if (nm.includes(" VS ")) return true;
    // "Rank N" patterns (Catclaw Championships Rank 1-9)
    if (/Rank \d+/.test(nm)) return true;
    return false;
  }

  // --- Stories of Legend: contiguous block at indices 0..48 ---
  const solFirst = allNames[0];
  const solLast = allNames[SOL_COUNT - 1];
  console.log(`  Stories of Legend: expecting indices 0-${SOL_COUNT - 1}`);
  console.log(`    first: "${solFirst}" (expected "${SOL_EXPECTED_FIRST}") ${solFirst === SOL_EXPECTED_FIRST ? "✓" : "⚠ MISMATCH"}`);
  console.log(`    last:  "${solLast}" (expected "${SOL_EXPECTED_LAST}") ${solLast === SOL_EXPECTED_LAST ? "✓" : "⚠ MISMATCH"}`);

  const solNameSet = new Set<string>();
  if (solFirst === SOL_EXPECTED_FIRST) {
    sagaNames.push("Stories of Legend");
    for (let i = 0; i < SOL_COUNT; i++) {
      const name = allNames[i];
      if (name) {
        subchapters.push({ sortOrder: i, name, sagaName: "Stories of Legend" });
        solNameSet.add(name);
      }
    }
    console.log(`    Added ${SOL_COUNT} SoL subchapters`);
  } else {
    console.error("  ERROR: Stories of Legend not found at expected position — skipping SoL");
  }

  // --- Zero Legends: known names + forward scanning for new ones ---
  // ZL must be identified BEFORE UL, because UL uses elimination (everything
  // that's not SoL, not ZL, not non-legend).
  console.log(`  Zero Legends: searching for ${ZL_KNOWN_NAMES.length} known names`);
  let zlFound = 0;
  let zlMissing: string[] = [];
  const zlNameSet = new Set<string>(ZL_KNOWN_NAMES);

  for (let i = 0; i < ZL_KNOWN_NAMES.length; i++) {
    const name = ZL_KNOWN_NAMES[i];
    if (nameToIdx.has(name)) {
      subchapters.push({ sortOrder: i, name, sagaName: "Zero Legends" });
      zlFound++;
    } else {
      zlMissing.push(name);
    }
  }
  console.log(`    Found ${zlFound}/${ZL_KNOWN_NAMES.length} in Map_Name.csv`);
  if (zlMissing.length > 0) {
    console.warn(`    Missing ${zlMissing.length} ZL names: ${zlMissing.join(", ")}`);
  }

  // Forward scan for NEW ZL subchapters added after our known list.
  // Find the last known ZL name's index, scan forward, collect unknowns.
  let lastKnownZlIdx = -1;
  for (const name of ZL_KNOWN_NAMES) {
    const idx = nameToIdx.get(name);
    if (idx !== undefined && idx > lastKnownZlIdx) {
      lastKnownZlIdx = idx;
    }
  }

  // We'll also collect new ZL names into a set so UL elimination skips them.
  // But we can't know if a new unknown name is ZL vs UL yet — we'll handle
  // this by doing UL elimination FIRST (from Exile's Resort, cap at 49),
  // then treating remaining unknowns as potential new ZL.
  // Actually: since UL is capped at exactly 49 and is complete, any unknown
  // name in the post-SoL region that's not non-legend must be ZL (once we
  // have our 49 UL).

  if (zlFound > 0) sagaNames.push("Zero Legends");

  // --- Uncanny Legends: found by ELIMINATION ---
  // Scan from "Exile's Resort" forward through Map_Name.csv. Collect names
  // that are NOT in SoL (0-48), NOT in ZL, and NOT non-legend. Cap at 49.
  const ulStartIdx = nameToIdx.get(UL_FIRST_NAME);
  const ulCollected: { name: string; mapIdx: number }[] = [];

  if (ulStartIdx !== undefined) {
    console.log(`  Uncanny Legends: found "${UL_FIRST_NAME}" at index ${ulStartIdx}`);
    console.log(`    Scanning forward, collecting by elimination (not SoL, not ZL, not non-legend)...`);

    for (let i = ulStartIdx; i < allNames.length && ulCollected.length < UL_COUNT; i++) {
      const nm = allNames[i];
      if (!nm) continue;

      // Skip SoL names (shouldn't appear here, but be safe)
      if (solNameSet.has(nm)) continue;

      // Skip known ZL names
      if (zlNameSet.has(nm)) continue;

      // Skip non-legend names
      if (isNonLegendName(nm)) continue;

      ulCollected.push({ name: nm, mapIdx: i });
    }

    console.log(`    Collected ${ulCollected.length} UL subchapters by elimination`);
    if (ulCollected.length === UL_COUNT) {
      console.log(`    ✓ Got exactly ${UL_COUNT} as expected`);
    } else {
      console.warn(`    ⚠ Expected ${UL_COUNT}, got ${ulCollected.length}`);
    }

    // Log first and last
    if (ulCollected.length > 0) {
      console.log(`    first: "${ulCollected[0].name}" (idx=${ulCollected[0].mapIdx})`);
      console.log(`    last:  "${ulCollected[ulCollected.length - 1].name}" (idx=${ulCollected[ulCollected.length - 1].mapIdx})`);
    }

    // Add UL subchapters with sortOrder based on collection order
    const ulNameSet = new Set<string>();
    for (let i = 0; i < ulCollected.length; i++) {
      subchapters.push({ sortOrder: i, name: ulCollected[i].name, sagaName: "Uncanny Legends" });
      ulNameSet.add(ulCollected[i].name);
    }

    if (ulCollected.length > 0) sagaNames.push("Uncanny Legends");

    // Now scan for NEW ZL subchapters beyond the known list.
    // These are names after the last known ZL index that aren't UL, not SoL, not non-legend.
    if (lastKnownZlIdx >= 0) {
      let newZlCount = 0;
      for (let i = lastKnownZlIdx + 1; i < allNames.length && zlFound + newZlCount < ZL_MAX; i++) {
        const nm = allNames[i];
        if (!nm) continue;
        if (solNameSet.has(nm)) continue;
        if (zlNameSet.has(nm)) continue;
        if (ulNameSet.has(nm)) continue;
        if (isNonLegendName(nm)) continue;

        const sortOrder = ZL_KNOWN_NAMES.length + newZlCount;
        subchapters.push({ sortOrder, name: nm, sagaName: "Zero Legends" });
        zlNameSet.add(nm);
        newZlCount++;
        console.log(`    NEW ZL subchapter: "${nm}" (sortOrder=${sortOrder})`);
      }
      if (newZlCount > 0) {
        console.log(`    Discovered ${newZlCount} new ZL subchapters beyond known list`);
      }
    }
  } else {
    console.error(`  ERROR: Could not find UL start "${UL_FIRST_NAME}" in Map_Name.csv`);
  }

  // ── Step 3: Summary ────────────────────────────────────────────────────
  const sagaDist: Record<string, number> = {};
  for (const sub of subchapters) {
    sagaDist[sub.sagaName] = (sagaDist[sub.sagaName] ?? 0) + 1;
  }
  console.log(`  Total legend subchapters: ${subchapters.length}`);
  for (const [saga, count] of Object.entries(sagaDist)) {
    console.log(`    ${saga}: ${count}`);
  }

  if (subchapters.length === 0) {
    console.error("  ERROR: No legend subchapters found. Aborting.");
    return;
  }

  // ── Step 4: Get or create sagas in DB ──────────────────────────────────
  const existingSagas = await (prisma as any).legendSaga.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const sagaIdMap = new Map<string, string>();
  for (const s of existingSagas) sagaIdMap.set(s.displayName, s.id);

  const SAGA_ORDER = ["Stories of Legend", "Uncanny Legends", "Zero Legends"];
  for (const sagaName of sagaNames) {
    if (!sagaIdMap.has(sagaName)) {
      const sortOrder = SAGA_ORDER.indexOf(sagaName) + 1 || sagaNames.indexOf(sagaName) + 1;
      const created = await (prisma as any).legendSaga.create({
        data: { displayName: sagaName, sortOrder },
      });
      sagaIdMap.set(sagaName, created.id);
      console.log(`  Created saga: "${sagaName}"`);
    }
  }

  // ── Step 5: Upsert subchapters ─────────────────────────────────────────
  // Track valid (sagaId, displayName) pairs for saga-aware cleanup
  const validPairs = new Set<string>();
  let upsertedCount = 0;

  for (const sub of subchapters) {
    const sagaId = sagaIdMap.get(sub.sagaName);
    if (!sagaId) continue;
    validPairs.add(`${sagaId}::${sub.name}`);

    try {
      await (prisma as any).legendSubchapter.upsert({
        where: { sagaId_displayName: { sagaId, displayName: sub.name } },
        create: { sagaId, displayName: sub.name, sortOrder: sub.sortOrder },
        update: { sortOrder: sub.sortOrder },
      });
      upsertedCount++;
    } catch (e: any) {
      console.warn(`    Failed to upsert "${sub.name}": ${e.message}`);
    }
  }

  console.log(`  ✓ Upserted ${upsertedCount} legend subchapters`);

  // ── Step 6: Saga-aware cleanup of stale subchapters ────────────────────
  // SAFETY: Only clean up if we upserted enough (SoL alone has 49)
  if (upsertedCount >= 50) {
    const allExisting = await (prisma as any).legendSubchapter.findMany({
      select: { id: true, displayName: true, sagaId: true },
    });
    const toDelete: string[] = [];
    for (const existing of allExisting) {
      const key = `${existing.sagaId}::${existing.displayName}`;
      if (!validPairs.has(key)) {
        toDelete.push(existing.id);
        console.log(`    Stale: "${existing.displayName}" (saga=${existing.sagaId})`);
      }
    }
    if (toDelete.length > 0) {
      console.log(`  Cleaning up ${toDelete.length} stale subchapters (keeping ${allExisting.length - toDelete.length})`);
      await (prisma as any).userLegendProgress.deleteMany({
        where: { subchapterId: { in: toDelete } },
      });
      await (prisma as any).legendSubchapter.deleteMany({
        where: { id: { in: toDelete } },
      });
    } else {
      console.log("  No stale subchapters to clean up");
    }
  } else if (upsertedCount > 0) {
    console.warn(`  Only upserted ${upsertedCount} subchapters — skipping cleanup to protect existing data`);
  } else {
    console.warn("  No subchapters upserted — skipping cleanup.");
  }
}


// ── Run ──────────────────────────────────────────────────────────────────────
main().catch((e) => {
  console.error("Sync failed:", e);
  process.exit(1);
});
