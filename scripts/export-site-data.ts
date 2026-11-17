/**
 * export-site-data.ts — READ-ONLY snapshot of the site's public GAME data, so the
 * Cowork sandbox (which can't reach the live DB or battlecatsprogress.app) can
 * read what the site actually contains: `git fetch origin site-data`.
 *
 * Exports ONLY game-reference tables (Unit, StoryChapter, LegendSaga,
 * LegendSubchapter, Milestone, MeowMedal). It never touches User, progress,
 * chat, activity, login-attempt, rate-limit or AppMeta tables, so no player data
 * leaves the database. Only findMany() calls — nothing is written to the DB.
 *
 * Output (OUT_DIR, default ./site-data): one JSON-lines file per table (one row
 * per line, sorted, so git diffs between exports show exactly which units
 * changed) + _meta.json with counts and the export time.
 *
 * Usage: OUT_DIR=site-data DATABASE_URL=... npx tsx ./scripts/export-site-data.ts
 */
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { seedPrisma as prisma, seedDisconnect } from "../prisma/seed-client.ts";

const OUT = process.env.OUT_DIR ?? "site-data";

const TABLES: Array<{ file: string; model: string; orderBy: Record<string, "asc"> }> = [
  { file: "units", model: "unit", orderBy: { unitNumber: "asc" } },
  { file: "story-chapters", model: "storyChapter", orderBy: { sortOrder: "asc" } },
  { file: "legend-sagas", model: "legendSaga", orderBy: { sortOrder: "asc" } },
  { file: "legend-subchapters", model: "legendSubchapter", orderBy: { sortOrder: "asc" } },
  { file: "milestones", model: "milestone", orderBy: { sortOrder: "asc" } },
  { file: "meow-medals", model: "meowMedal", orderBy: { sortOrder: "asc" } },
];

async function main() {
  mkdirSync(OUT, { recursive: true });
  const counts: Record<string, number> = {};
  for (const t of TABLES) {
    const rows: any[] = await (prisma as any)[t.model].findMany({ orderBy: t.orderBy });
    
    const text = rows.map((r) => JSON.stringify(r, (_k, v) => (typeof v === "bigint" ? Number(v) : v))).join("\n") + "\n";
    writeFileSync(join(OUT, `${t.file}.jsonl`), text);
    counts[t.file] = rows.length;
    console.log(`  ${t.file}: ${rows.length} rows`);
  }
  writeFileSync(join(OUT, "_meta.json"), JSON.stringify({ exportedAt: new Date().toISOString(), counts }, null, 2) + "\n");
}

main()
  .catch((e) => {
    console.error("export failed:", e.message);
    process.exitCode = 1;
  })
  .finally(() => seedDisconnect());
