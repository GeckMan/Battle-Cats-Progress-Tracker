/**
 * wiki-form-sync.ts — keeps evolved/true/ultra form names (and formCount) matched to
 * the wiki, because BCData lags the live game (new True/Ultra Forms) and occasionally
 * carries odd EN text (Nekoluga's form 2 came through as "Unknown Cat").
 *
 * Ryan's rule (2026-11-17): follow the wiki when it agrees with itself in more than one
 * place. A form name W for form N is used only when BOTH the page's {{Cat Info}} nameN
 * AND its {{Description}} NameN (the transcribed in-game text) say W. A form we don't
 * have yet is only added once released in EN: if the page says "[[True Form]]/[[Ultra
 * Form]] added in [[Version X]]", Version X must have an International date on or
 * before today. Runs right after syncUnits() (which rewrites names from BCData every
 * run), so it re-applies each week; idempotent. Exceptions: FORM_EXCEPTION_UNITS.
 */
import { existsSync, readFileSync, readdirSync } from "fs";
import { join } from "path";
import { norm, readUnitPages, readInternationalDates } from "./wiki-unit-sync.ts";

export const FORM_EXCEPTION_UNITS = new Set<number>([]);
const COLS = ["name", "evolvedName", "trueName", "ultraName"] as const;
const MAX_CHANGES = 40;

export async function syncFormNamesFromWikiMirror(prisma: any, mirrorDir: string | undefined, protectedNumbers: Set<number> = new Set()): Promise<number> {
  const pagesDir = mirrorDir ? join(mirrorDir, "pages") : "";
  if (!mirrorDir || !existsSync(pagesDir)) return 0;
  const versions = readInternationalDates(pagesDir);
  const today = new Date();
  const files = new Map<string, string>(readdirSync(pagesDir).map((f) => [f.replace(/\.wikitext$/, ""), f]));
  const units: any[] = await prisma.unit.findMany({
    where: { excludeFromCollection: false },
    select: { unitNumber: true, name: true, evolvedName: true, trueName: true, ultraName: true, formCount: true },
  });
  const pages = readUnitPages(pagesDir).filter((p) => !p.regional);
  const byId = new Map<number, typeof pages>();
  for (const p of pages) byId.set(p.id, [...(byId.get(p.id) ?? []), p]);

  const changes: Array<{ u: any; data: Record<string, unknown>; why: string[] }> = [];
  for (const u of units) {
    if (FORM_EXCEPTION_UNITS.has(u.unitNumber) || protectedNumbers.has(u.unitNumber)) continue;
    const p = (byId.get(u.unitNumber) ?? []).find((x) => norm(x.names[0]) === norm(u.name));
    if (!p) continue;
    const text = readFileSync(join(pagesDir, files.get(p.page)!), "utf8");
    const desc = new Map<number, string>();
    for (const m of text.matchAll(/^\|\s*Name([1-4])\s*=\s*(.+?)\s*$/gm)) if (!desc.has(Number(m[1]))) desc.set(Number(m[1]), m[2]);
    const data: Record<string, unknown> = {};
    const why: string[] = [];
    let forms = u.formCount ?? 0;
    for (let i = 2; i <= 4; i++) {
      const w = p.names[i - 1];
      if (!w || !desc.get(i) || norm(desc.get(i)!) !== norm(w)) continue; // wiki doesn't agree with itself
      const col = COLS[i - 1];
      if (u[col] && norm(u[col]) === norm(w)) { forms = Math.max(forms, i); continue; }
      if (!u[col] && i >= 3) {
        const v = text.match(new RegExp(`\\[\\[${i === 3 ? "True" : "Ultra"} Form\\]\\] added in \\[\\[Version (\\d+\\.\\d+)`))?.[1];
        if (v) {
          const d = versions.get(v);
          if (!d || d > today) continue; // not released in EN yet
        }
      }
      data[col] = w;
      forms = Math.max(forms, i);
      why.push(`${col}: "${u[col] ?? "—"}" → "${w}"`);
    }
    if (forms !== u.formCount && why.length) data.formCount = forms;
    if (why.length) changes.push({ u, data, why });
  }
  if (changes.length > MAX_CHANGES) {
    console.log(`  ⚠ ${changes.length} form-name changes from the wiki (> ${MAX_CHANGES}) — applying none; check the mirror/parser`);
    return 0;
  }
  for (const c of changes) {
    await prisma.unit.update({ where: { unitNumber: c.u.unitNumber }, data: c.data });
    console.log(`  ✓ Forms #${c.u.unitNumber} ${c.u.name}: ${c.why.join("; ")}`);
  }
  console.log(`  Wiki-agreed form names: ${changes.length} unit(s) updated`);
  return changes.length;
}
