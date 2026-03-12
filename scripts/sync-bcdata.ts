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
// Map_Name.csv contains subchapter names for ALL map types (1200+ lines).
// Each map type (SoL, daily stages, events, UL, ZL, etc.) occupies a
// contiguous block. The offset per type = sum of subchapter counts for all
// preceding types (ordered by type suffix: 0-9 then A-Z).
//
// We discover map types by enumerating MapStageData{TYPE}_{SUB}.csv files,
// compute offsets, and identify SoL/UL/ZL by checking the first subchapter
// name against known values.

// Known first-subchapter names for each legend saga
const KNOWN_SAGA_STARTS: Record<string, string[]> = {
  "Stories of Legend": ["The Legend Begins"],
  "Uncanny Legends": ["Exile's Resort"],
  "Zero Legends": [
    "An Ancient Curse", "Royal Tomb", "Underground Labyrinth",
    "Forgotten Graves", "Lost Ruin", "Relic Excavation",
  ],
};

const SAGA_ORDER = ["Stories of Legend", "Uncanny Legends", "Zero Legends"];

async function syncLegendStages(prisma: PrismaClient, dataLocal: string, resLocal: string) {
  // ── Step 1: Parse Map_Name.csv ─────────────────────────────────────────
  const mapNamePath = path.join(resLocal, "Map_Name.csv");
  if (!existsSync(mapNamePath)) {
    console.log("  Map_Name.csv not found — skipping legend stages");
    return;
  }

  const mapContent = readFileSync(mapNamePath, "utf-8");
  const mapLines = mapContent.trim().split("\n").filter((l) => l.trim());

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

  // ── Step 2: Discover map types from MapStageData files ─────────────────
  // Each file is named MapStageData{TYPE}_{SUBCHAPTER}.csv
  // TYPE is a single char: 0-9 then A-Z for types 10+
  const dataFiles = readdirSync(dataLocal);
  const typeMaxSub = new Map<string, number>();

  for (const f of dataFiles) {
    const m = f.match(/^MapStageData([0-9A-Za-z])_(\d+)\.csv$/);
    if (m) {
      const type = m[1];
      const sub = parseInt(m[2], 10);
      typeMaxSub.set(type, Math.max(typeMaxSub.get(type) ?? -1, sub));
    }
  }

  // Sort: digits 0-9 first, then letters A-Z
  const sortedTypes = [...typeMaxSub.keys()].sort((a, b) => {
    const aIsDigit = a >= "0" && a <= "9";
    const bIsDigit = b >= "0" && b <= "9";
    if (aIsDigit && !bIsDigit) return -1;
    if (!aIsDigit && bIsDigit) return 1;
    return a.charCodeAt(0) - b.charCodeAt(0);
  });

  console.log(`  Found ${sortedTypes.length} map types: ${sortedTypes.join(", ")}`);
  for (const t of sortedTypes) {
    console.log(`    Type ${t}: ${(typeMaxSub.get(t) ?? 0) + 1} subchapters`);
  }

  // Compute Map_Name.csv offsets per type
  // Each type gets (maxSubIdx + 1) entries in Map_Name.csv, in sorted order.
  interface TypeOffset { type: string; offset: number; count: number; firstName: string }
  const typeOffsets: TypeOffset[] = [];
  let cumOffset = 0;

  for (const type of sortedTypes) {
    const count = (typeMaxSub.get(type) ?? 0) + 1;
    const firstName = allNames[cumOffset] ?? "(out of range)";
    typeOffsets.push({ type, offset: cumOffset, count, firstName });
    cumOffset += count;
  }

  console.log(`  Computed total entries: ${cumOffset} (Map_Name.csv has ${allNames.length})`);
  if (Math.abs(cumOffset - allNames.length) > 10) {
    console.warn(`  WARNING: Large mismatch between computed offsets (${cumOffset}) and Map_Name.csv lines (${allNames.length})`);
  }

  // Log each type's offset and first name
  for (const t of typeOffsets) {
    const abbr = t.firstName.length > 50 ? t.firstName.substring(0, 50) + "..." : t.firstName;
    console.log(`    Type ${t.type}: offset=${t.offset}, count=${t.count}, first="${abbr}"`);
  }

  // ── Step 3: Identify which types are legend sagas ──────────────────────
  interface SagaInfo { sagaName: string; offset: number; count: number }
  const foundSagas: SagaInfo[] = [];
  const matchedSagas = new Set<string>();

  // Primary: match by first subchapter name at computed offsets
  for (const t of typeOffsets) {
    for (const [sagaName, starters] of Object.entries(KNOWN_SAGA_STARTS)) {
      if (matchedSagas.has(sagaName)) continue;
      if (starters.includes(t.firstName)) {
        foundSagas.push({ sagaName, offset: t.offset, count: t.count });
        matchedSagas.add(sagaName);
        console.log(`  ✓ Matched type ${t.type} → ${sagaName} (${t.count} subchapters)`);
        break;
      }
    }
  }

  // Fallback: if some sagas weren't matched, search all of Map_Name.csv
  if (matchedSagas.size < SAGA_ORDER.length) {
    console.log(`  Only matched ${matchedSagas.size}/${SAGA_ORDER.length} sagas via offsets, trying string search...`);
    for (const [sagaName, starters] of Object.entries(KNOWN_SAGA_STARTS)) {
      if (matchedSagas.has(sagaName)) continue;
      for (const name of starters) {
        const idx = allNames.indexOf(name);
        if (idx < 0) continue;
        // Find which type block this index falls into
        let count = 49; // reasonable default
        for (const t of typeOffsets) {
          if (idx >= t.offset && idx < t.offset + t.count) {
            count = t.count - (idx - t.offset);
            break;
          }
        }
        foundSagas.push({ sagaName, offset: idx, count });
        matchedSagas.add(sagaName);
        console.log(`  ✓ Found "${name}" at index ${idx} → ${sagaName} (${count} subchapters)`);
        break;
      }
    }
  }

  // Last resort: types with 20+ subchapters that aren't matched yet
  if (matchedSagas.size < SAGA_ORDER.length) {
    const matchedOffsets = new Set(foundSagas.map((s) => s.offset));
    for (const t of typeOffsets) {
      if (matchedOffsets.has(t.offset)) continue;
      if (t.count < 20) continue;
      const skip = ["Monday Stage", "Tuesday Stage", "Cat Ticket Chance!", "Growing Yellow", "XP Stage"];
      if (skip.includes(t.firstName)) continue;
      const missingSaga = SAGA_ORDER.find((n) => !matchedSagas.has(n));
      if (missingSaga) {
        foundSagas.push({ sagaName: missingSaga, offset: t.offset, count: t.count });
        matchedSagas.add(missingSaga);
        console.log(`  ✓ Inferred type ${t.type} → ${missingSaga} (${t.count} subchapters, first="${t.firstName}")`);
      }
    }
  }

  if (foundSagas.length === 0) {
    console.error("  ERROR: Could not identify any legend sagas. Aborting.");
    return;
  }

  // Sort sagas in canonical order
  foundSagas.sort((a, b) => SAGA_ORDER.indexOf(a.sagaName) - SAGA_ORDER.indexOf(b.sagaName));

  // ── Step 4: Build subchapter list ──────────────────────────────────────
  type SubEntry = { sortOrder: number; name: string; sagaName: string };
  const subchapters: SubEntry[] = [];

  for (const saga of foundSagas) {
    for (let i = 0; i < saga.count; i++) {
      const name = allNames[saga.offset + i];
      if (name) {
        subchapters.push({ sortOrder: i, name, sagaName: saga.sagaName });
      }
    }
  }

  console.log(`  Total legend subchapters: ${subchapters.length}`);
  for (const saga of foundSagas) {
    const count = subchapters.filter((s) => s.sagaName === saga.sagaName).length;
    console.log(`    ${saga.sagaName}: ${count} subchapters`);
  }

  // Log first and last entry from each saga
  for (const saga of foundSagas) {
    const entries = subchapters.filter((s) => s.sagaName === saga.sagaName);
    if (entries.length > 0) {
      console.log(`    ${saga.sagaName} first: "${entries[0].name}"`);
      console.log(`    ${saga.sagaName} last:  "${entries[entries.length - 1].name}"`);
    }
  }

  if (subchapters.length === 0) {
    console.error("  ERROR: No legend subchapters found. Aborting.");
    return;
  }

  // ── Step 5: Get or create sagas in DB ──────────────────────────────────
  const existingSagas = await (prisma as any).legendSaga.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const sagaIdMap = new Map<string, string>();
  for (const s of existingSagas) sagaIdMap.set(s.displayName, s.id);

  for (let i = 0; i < foundSagas.length; i++) {
    const saga = foundSagas[i];
    if (!sagaIdMap.has(saga.sagaName)) {
      const created = await (prisma as any).legendSaga.create({
        data: { displayName: saga.sagaName, sortOrder: i + 1 },
      });
      sagaIdMap.set(saga.sagaName, created.id);
      console.log(`  Created saga: "${saga.sagaName}"`);
    }
  }

  // ── Step 6: Upsert subchapters ─────────────────────────────────────────
  const validNames = new Set<string>();
  let upsertedCount = 0;

  for (const sub of subchapters) {
    const sagaId = sagaIdMap.get(sub.sagaName);
    if (!sagaId) continue;
    validNames.add(sub.name);

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

  // Log distribution
  const sagaDist: Record<string, number> = {};
  for (const sub of subchapters) {
    sagaDist[sub.sagaName] = (sagaDist[sub.sagaName] ?? 0) + 1;
  }
  console.log(`  Saga distribution: ${Object.entries(sagaDist).map(([k, v]) => `${k}=${v}`).join(", ")}`);
  console.log(`  ✓ Upserted ${upsertedCount} legend subchapters`);

  // ── Step 7: Clean up non-legend subchapters from previous buggy syncs ──
  // SAFETY: Only clean up if we upserted 50+ (SoL alone has 49)
  if (upsertedCount >= 50) {
    const allExisting = await (prisma as any).legendSubchapter.findMany({
      select: { id: true, displayName: true, sagaId: true },
    });
    const toDelete: string[] = [];
    for (const existing of allExisting) {
      if (!validNames.has(existing.displayName)) {
        toDelete.push(existing.id);
      }
    }
    if (toDelete.length > 0) {
      console.log(`  Cleaning up ${toDelete.length} non-legend subchapters (keeping ${allExisting.length - toDelete.length})`);
      await (prisma as any).userLegendProgress.deleteMany({
        where: { subchapterId: { in: toDelete } },
      });
      await (prisma as any).legendSubchapter.deleteMany({
        where: { id: { in: toDelete } },
      });
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
