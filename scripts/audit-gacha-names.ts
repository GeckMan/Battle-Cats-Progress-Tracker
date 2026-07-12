/**
 * One-time (manually-triggered) audit: compares battlecatsultimate/bcu-assets'
 * resolved English name for every historical rare-tier gacha row against each
 * corresponding unit's CURRENT Unit.setName in the live database.
 *
 * Why this exists: sync-bcdata.ts's syncEventSets() only ever consults
 * bcu-assets to fill in a setName that's currently NULL — by design, it never
 * overwrites an existing curated name (see the "existing setName always wins"
 * rule, and the Black Zeus/Raclesa incident that rule was written to prevent).
 * That's the right default for the automated weekly sync, but it also means
 * any OLD incorrect setName from a stale migration will silently sit there
 * forever — bcu-assets is never even consulted for units that already have
 * a setName, correct or not.
 *
 * This script does the opposite: it reads bcu-assets for every unit, whether
 * or not the unit already has a setName, and REPORTS every mismatch. It does
 * NOT write to the database at all — purely a read-only diagnostic, exactly
 * as agreed. A human reviews the report and decides which mismatches (if any)
 * warrant a real migration, the same way the Almighties/Uber Fest fix was
 * done by hand this session.
 *
 * Scope, same as syncEventSets(): only unlabeled (no "// <label>" comment),
 * single-row debut families whose row came from GatyaDataSetR1.csv have an
 * unambiguous bcu-assets row-index mapping. Labeled families and E/N-tier
 * rows are out of scope (see the big comment on fetchBcuGachaNameMap() in
 * sync-bcdata.ts for why).
 *
 * Run manually via: npx tsx ./scripts/audit-gacha-names.ts
 * (needs DATABASE_URL/DIRECT_DATABASE_URL + real internet access — i.e. the
 * GitHub Actions "Audit Gacha Names" workflow, not this sandbox.)
 */
import "dotenv/config";
import path from "path";
import { existsSync } from "fs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/index.js";
import {
  CLONE_DIR,
  REGION,
  cloneOrPull,
  findLatestVersion,
  detectEventFamilies,
  fetchBcuGachaNameMap,
  BCU_CATEGORY_ALIAS,
} from "./sync-bcdata.js";

interface Mismatch {
  rowIndex: number;
  bcuName: string;
  unitNumber: number;
  unitName: string;
  currentSetName: string | null;
}

interface WillFill {
  rowIndex: number;
  bcuName: string;
  unitNumber: number;
  unitName: string;
}

async function main() {
  const dbUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("ERROR: DATABASE_URL or DIRECT_DATABASE_URL must be set");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: dbUrl, max: 5 });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool), log: ["warn", "error"] });

  try {
    console.log("── Cloning BCData repository ──");
    cloneOrPull();

    const latestVersion = findLatestVersion();
    console.log(`Latest EN version: ${latestVersion}`);

    const dataDir = path.join(CLONE_DIR, "game_data", REGION, latestVersion);
    const altDataDir = path.join(CLONE_DIR, `${latestVersion}${REGION}`);
    const baseDir = existsSync(dataDir) ? dataDir : existsSync(altDataDir) ? altDataDir : null;
    if (!baseDir) {
      console.error(`ERROR: Cannot find data directory. Tried:\n  ${dataDir}\n  ${altDataDir}`);
      process.exit(1);
    }
    const dataLocal = path.join(baseDir, "DataLocal");

    console.log("\n── Detecting event families from banner debut history ──");
    const { families, provenance } = detectEventFamilies(dataLocal);
    console.log(`  Detected ${families.size} distinct event famil(y/ies)`);

    console.log("\n── Loading battlecatsultimate/bcu-assets gacha names ──");
    const bcuNames = await fetchBcuGachaNameMap();
    if (!bcuNames) {
      console.error("  ✗ Could not load bcu-assets gacha names this run — aborting audit (nothing to compare against)");
      process.exit(1);
    }
    console.log(`  Loaded ${bcuNames.size} row-name(s)`);

    const mismatches: Mismatch[] = [];
    const willFill: WillFill[] = [];
    let checked = 0;
    let matched = 0;

    for (const [label, memberIds] of families.entries()) {
      if (!label.startsWith("__unlabeled_")) continue; // out of scope, see doc comment
      const prov = provenance.get(label);
      if (!prov || prov.sourceFile !== "GatyaDataSetR1.csv") continue; // out of scope

      const rawBcuName = bcuNames.get(prov.rowIndex);
      if (!rawBcuName) continue; // bcu-assets has no entry for this row either

      const resolvedBcuName = BCU_CATEGORY_ALIAS[rawBcuName] ?? rawBcuName;

      const members = await (prisma as any).unit.findMany({
        where: { unitNumber: { in: [...memberIds] } },
        select: { unitNumber: true, name: true, setName: true },
      });

      for (const m of members) {
        checked++;
        if (!m.setName) {
          // Not a mismatch — syncEventSets() will fill this in on the next
          // regular weekly sync. Reported separately as low-priority/FYI.
          willFill.push({ rowIndex: prov.rowIndex, bcuName: resolvedBcuName, unitNumber: m.unitNumber, unitName: m.name });
          continue;
        }
        if (m.setName === resolvedBcuName) {
          matched++;
          continue;
        }
        mismatches.push({
          rowIndex: prov.rowIndex,
          bcuName: resolvedBcuName,
          unitNumber: m.unitNumber,
          unitName: m.name,
          currentSetName: m.setName,
        });
      }
    }

    console.log(`\n── Audit results ──`);
    console.log(`  Checked ${checked} unit(s) across ${families.size} detected famil(y/ies) (scope: unlabeled single-row rare-tier debuts only)`);
    console.log(`  ✓ ${matched} already match bcu-assets`);
    console.log(`  ○ ${willFill.length} have no setName yet — will be auto-filled by the next regular weekly sync, no action needed`);

    if (mismatches.length === 0) {
      console.log(`  ✓ No mismatches found — every unit with a setName in this scope agrees with bcu-assets`);
    } else {
      console.log(`  ⚠ ${mismatches.length} mismatch(es) found — CURRENT DB setName disagrees with bcu-assets. Nothing was changed; review each before writing a migration:\n`);
      for (const mm of mismatches) {
        console.log(
          `    row ${mm.rowIndex}: unit ${mm.unitNumber} "${mm.unitName}" — DB has setName="${mm.currentSetName}", bcu-assets says "${mm.bcuName}"`
        );
      }
    }

    console.log("\n✓ Audit complete (read-only — no database writes were made)");
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
