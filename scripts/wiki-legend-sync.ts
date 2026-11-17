/**
 * wiki-legend-sync.ts — Zero Legends sub-chapters the wiki shows as released in EN
 * that BCData's Map_Name.csv doesn't have yet (BCData lags the game: on 2026-11-17 it
 * stopped at sub-chapter 35 while v15.7 added 36 "Six Flans" and 37 "Noodle Nirvana",
 * released internationally 2026-10-27).
 *
 * Ryan's rule: follow the wiki where it agrees in 2+ places. A sub-chapter N qualifies
 * when the "Legend Stages" page lists "Sub-chapter N: [[Name]]" with "Added in
 * [[Version X]]", Name has its own wiki page, and Version X has an International date
 * on or before today. The sync appends these after its known list, so they're upserted
 * (and not removed by the stale-subchapter cleanup) like any other.
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { readInternationalDates } from "./wiki-unit-sync.ts";

export function wikiReleasedZeroLegends(mirrorDir: string | undefined): Array<{ n: number; name: string; stages: number }> {
  const pagesDir = mirrorDir ? join(mirrorDir, "pages") : "";
  const f = join(pagesDir, "Legend_Stages.wikitext");
  if (!mirrorDir || !existsSync(f)) return [];
  const text = readFileSync(f, "utf8");
  const zl = text.slice(text.indexOf("Zero Legends", text.indexOf("==Stages==")));
  const versions = readInternationalDates(pagesDir);
  const today = new Date();
  const out: Array<{ n: number; name: string; stages: number }> = [];
  const parts = zl.split(/^====\s*Sub-chapter\s*/m).slice(1);
  for (const part of parts) {
    const m = part.match(/^(\d+):\s*\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/);
    if (!m) continue;
    const n = Number(m[1]);
    const name = (m[3] ?? m[2]).trim();
    const v = part.match(/Added in \[\[Version (\d+\.\d+)/)?.[1];
    const d = v ? versions.get(v) : null;
    if (!d || d > today) continue; // not released in EN yet (or no version stated)
    if (!existsSync(join(pagesDir, `${m[2].trim().replace(/[\\/:*?"<>|]/g, "_").replace(/ /g, "_")}.wikitext`))) continue;
    const stages = part.split("\n").filter((l) => /^\*\s*Stage\s/.test(l.trim())).length;
    out.push({ n, name, stages });
  }
  return out;
}
