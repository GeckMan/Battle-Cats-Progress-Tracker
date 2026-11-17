/**
 * wiki-unit-sync.ts — adds units BCData doesn't have yet, driven by the
 * mirrored Battle Cats wiki (the `wiki-data` branch; see pull-wiki-local.ts).
 *
 * Why: our unit list comes from BCData, a community repo that lags the live
 * game, so brand-new EN units (e.g. #874 Ryuichi, #866-868 PAC-MAN family,
 * #877 Hare of Inaba, found by wiki-factcheck.ts 2026-11-17) can be missing
 * for weeks. Ryan's rule: if the wiki says a unit is released in EN, add it —
 * no human check. So this step is deliberately conservative about WHAT counts
 * as "wiki says released in EN" rather than leaving it to a reviewer:
 *
 *   • page has a {{Cat Info}} block with ID / rarity / name1
 *   • NOT flagged {{JPExclusive}}/{{TWExclusive}}/{{KRExclusive}}/{{PCExclusive}},
 *     NOT a "(Switch ...)"/"(PC ...)" page, NOT {{Unobtainable}}
 *   • the page's "added in [[Version X.Y Update]]" resolves to a Version page whose
 *     "International:" release date is a real date on or before today (a "TBD"
 *     date, e.g. Version 16.0 as of 2026-11-17, means not yet released in EN)
 *
 * Everything else (source, collab flag, set name) is derived from the page's
 * own text, the same facts a human would read:
 *   source   Rare Capsule / Event Gacha / Special Sale / Catnip Challenges
 *   collab   a link to "[[<X> Collaboration Event]]"
 *   setName  reuse the set that existing units from the SAME event link already
 *            use (so Ryuichi joins "Kunio-kun Collaboration", not a new name);
 *            else "<X> Collaboration" for a collab, else none
 *
 * Event-level check (added 2026-11-17 after PAC-MAN): BCData and even the
 * version notes can contain an event's units BEFORE the event has run in EN
 * ("content added to international versions" in the 15.7 notes, yet the PAC-MAN
 * Collaboration Event page says "INT: TBA" / "English Version: ?"). So when a
 * unit's page links a Collaboration Event, that event's own page must not say
 * the EN release is TBA/unknown/future — otherwise the unit is NOT added.
 *
 * If a field can't be derived it is left null rather than guessed — later steps
 * (and the weekly bug sweep) fill it in.
 *
 * Safety: refuses to run if the wiki IDs don't line up with our unitNumbers
 * (offset sanity check), and adds at most MAX_ADDS units per run.
 * Only ever CREATES rows for unitNumbers that don't exist; never edits existing ones.
 */
import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";

const RARITY: Record<string, string> = { N: "NORMAL", EX: "SPECIAL", RR: "RARE", SR: "SUPER_RARE", UR: "UBER_RARE", LR: "LEGEND_RARE" };
const SORT_BASE: Record<string, number> = { NORMAL: 0, SPECIAL: 10000, RARE: 20000, SUPER_RARE: 30000, UBER_RARE: 40000, LEGEND_RARE: 50000 };
const MAX_ADDS = 25;
const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9぀-ヿ一-鿿]+/g, "");

type WikiPage = {
  id: number; rarity: string; names: string[]; page: string; head: string;
  regional: boolean; unobtainable: boolean; version: string | null; eventLinks: string[];
};

function field(block: string, key: string): string | null {
  const m = block.match(new RegExp(`\\|\\s*${key}\\s*=\\s*([^\\n|}]*)`, "i"));
  const v = m?.[1].trim();
  return v ? v : null;
}

function readInternationalDates(pagesDir: string): Map<string, Date | null> {
  const out = new Map<string, Date | null>();
  for (const f of readdirSync(pagesDir)) {
    const v = f.match(/^Version_(\d+\.\d+)_Update\.wikitext$/);
    if (!v) continue;
    const t = readFileSync(join(pagesDir, f), "utf8");
    const m = t.match(/\*'''International:'''\s*([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?,\s*(\d{4})/);
    const mi = m ? MONTHS.indexOf(m[1].toLowerCase()) : -1;
    out.set(v[1], m && mi >= 0 ? new Date(Date.UTC(Number(m[3]), mi, Number(m[2]))) : null); // null = TBD / unparsed
  }
  return out;
}

function readUnitPages(pagesDir: string): WikiPage[] {
  const out: WikiPage[] = [];
  for (const f of readdirSync(pagesDir)) {
    if (!f.endsWith(".wikitext") || f.endsWith("_Gallery.wikitext")) continue;
    const text = readFileSync(join(pagesDir, f), "utf8");
    const i = text.indexOf("{{Cat Info");
    if (i < 0) continue;
    const block = text.slice(i, text.indexOf("}}", i));
    const id = Number(field(block, "ID"));
    const rarity = (field(block, "rarity") ?? "").toUpperCase();
    const names = [1, 2, 3, 4].map((n) => field(block, `name${n}`)).filter((n): n is string => !!n);
    if (!Number.isInteger(id) || !names.length) continue;
    const head = text.slice(0, i).trim().replace(/\s+/g, " ");
    const page = f.replace(/\.wikitext$/, "");
    const addedIn = head.match(/added in[^.]*?\[\[Version (\d+\.\d+)(?:\.\d+)?[ _]Update/i);
    const eventLinks = [...head.matchAll(/\[\[([^\]|#/]*?(?:Collaboration Event|\(Gacha Event\)))/g)].map((m) => m[1].trim());
    out.push({
      id, rarity, names, page, head,
      regional: /\{\{(JP|TW|KR|PC|Switch)Exclusive\}\}/i.test(head) || /\((Switch|PC)_/.test(page),
      unobtainable: /\{\{Unobtainable\}\}/i.test(head),
      version: addedIn?.[1] ?? null,
      eventLinks,
    });
  }
  return out;
}

export type EventStatus = { status: "released" | "not-released" | "unknown"; reason: string };

/** Reads an event page's own EN-release statements. */
export function eventReleaseStatus(link: string, pagesDir: string, redirects: Record<string, string>, today: Date): EventStatus {
  const file = (t: string) => join(pagesDir, `${t.replace(/[\\/:*?"<>|]/g, "_").replace(/ /g, "_")}.wikitext`);
  let title = link;
  for (let i = 0; i < 3 && redirects[title]; i++) title = redirects[title];
  const f = file(title);
  if (!existsSync(f)) return { status: "unknown", reason: `event page "${link}" not in mirror` };
  const text = readFileSync(f, "utf8");

  // explicit "INT: TBA" / "English Version: ?" => not released in EN yet
  const intLines = [...text.matchAll(/\bINT:\s*([^\n']*)/gi)].map((m) => m[1].trim());
  const enSection = text.match(/={2,4}\s*English Version\s*={2,4}\s*\n([\s\S]*?)(?:\n={2,4}|\n\{\{|$)/i)?.[1] ?? null;
  const dateRe = /([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s*(\d{4})/g;
  const firstDate = (s: string) => {
    const m = [...s.matchAll(dateRe)].map((d) => ({ mi: MONTHS.indexOf(d[1].toLowerCase()), d })).find((x) => x.mi >= 0);
    return m ? new Date(Date.UTC(Number(m.d[3]), m.mi, Number(m.d[2]))) : null;
  };

  const evidence: Date[] = [];
  let tba = false;
  for (const l of intLines) {
    if (/^(TBA|TBD|\?|N\/A)/i.test(l)) tba = true;
    const d = firstDate(l);
    if (d) evidence.push(d);
  }
  if (enSection !== null) {
    const bullets = enSection.split("\n").filter((l) => l.trim().startsWith("*"));
    if (!bullets.length || bullets.every((b) => /^\*\s*(\?|TBA|TBD)?\s*$/i.test(b.trim()))) tba = true;
    for (const b of bullets) { const d = firstDate(b); if (d) evidence.push(d); }
  }
  const past = evidence.filter((d) => d <= today);
  if (past.length) return { status: "released", reason: `event "${title}" has an EN date on or before today` };
  if (evidence.length) return { status: "not-released", reason: `event "${title}" EN date is in the future (${evidence[0].toISOString().slice(0, 10)})` };
  if (tba) return { status: "not-released", reason: `event "${title}" says EN release is TBA/unknown` };
  return { status: "unknown", reason: `event "${title}" has no EN schedule info` };
}

function deriveSource(head: string): string | null {
  if (/Catnip Challenges/i.test(head)) return "CATNIP_CHALLENGES";
  if (/special sale/i.test(head)) return "SPECIAL_SALE";
  if (/Rare (Cat )?Capsule/i.test(head)) return "RARE_CAPSULE";
  if (/Event Gacha|Event (Cat )?Capsule|Gacha Event/i.test(head)) return "EVENT_CAPSULE";
  return null;
}

export async function syncUnitsFromWikiMirror(prisma: any, mirrorDir: string | undefined): Promise<{ added: number[]; warnings: number }> {
  const none = { added: [] as number[], warnings: 0 };
  const pagesDir = mirrorDir ? join(mirrorDir, "pages") : "";
  if (!mirrorDir || !existsSync(pagesDir)) {
    console.log("  ℹ No wiki mirror available (WIKI_MIRROR_DIR unset or missing) — skipping wiki-driven unit adds");
    return none;
  }

  const pages = readUnitPages(pagesDir);
  const versions = readInternationalDates(pagesDir);
  const dbUnits: any[] = await prisma.unit.findMany({ select: { unitNumber: true, name: true, setName: true, isCollab: true } });
  const byNum = new Map<number, any>(dbUnits.map((u) => [u.unitNumber, u]));

  // Mainline page per ID (several pages can share an ID: Switch/PC variants).
  const mainline = new Map<number, WikiPage>();
  for (const p of pages) {
    const cur = mainline.get(p.id);
    const u = byNum.get(p.id);
    const better = !cur || (u && norm(p.names[0]) === norm(u.name)) || (cur.regional && !p.regional);
    if (better) mainline.set(p.id, p);
  }

  // Sanity: wiki IDs must line up with our unitNumbers.
  let both = 0, same = 0;
  for (const [id, p] of mainline) {
    const u = byNum.get(id);
    if (!u) continue;
    both++;
    if (norm(u.name) === norm(p.names[0])) same++;
  }
  if (both < 100 || same / both < 0.9) {
    console.log(`  ⚠ Wiki unit IDs don't line up with our unitNumbers (${same}/${both} names match) — NOT adding any wiki-driven units this run`);
    return { added: [], warnings: 1 };
  }
  console.log(`  Wiki ID check OK: ${same}/${both} existing units match by name`);

  // event link -> the set the existing units from that event already use
  const votes = new Map<string, Map<string, number>>();
  for (const [id, p] of mainline) {
    const u = byNum.get(id);
    if (!u?.setName) continue;
    for (const link of p.eventLinks) {
      const m = votes.get(link) ?? new Map<string, number>();
      m.set(u.setName, (m.get(u.setName) ?? 0) + 1);
      votes.set(link, m);
    }
  }
  const setForLink = (link: string) => {
    const m = votes.get(link);
    return m ? [...m.entries()].sort((a, b) => b[1] - a[1])[0][0] : null;
  };

  const today = new Date();
  const redirPath = join(mirrorDir, "redirects.json");
  const redirects: Record<string, string> = existsSync(redirPath) ? JSON.parse(readFileSync(redirPath, "utf8")) : {};
  const candidates = [...mainline.values()].filter((p) => !byNum.has(p.id) && RARITY[p.rarity]).sort((a, b) => a.id - b.id);
  const added: number[] = [];
  let warnings = 0;

  for (const p of candidates) {
    if (p.regional || p.unobtainable) continue; // regional-only / unobtainable: expected absent in EN
    if (!p.version) { console.log(`  ℹ Skipping wiki unit #${p.id} ${p.names[0]}: no "added in Version" found on its page`); continue; }
    const intl = versions.get(p.version);
    if (!intl || intl > today) { console.log(`  ℹ Skipping wiki unit #${p.id} ${p.names[0]}: Version ${p.version} has no international release date yet`); continue; }
    if (added.length >= MAX_ADDS) { console.log(`  ⚠ More than ${MAX_ADDS} wiki-driven units to add in one run — stopping at ${MAX_ADDS}, rerun/inspect`); warnings++; break; }

    // Event-level check: any linked Collaboration Event that the wiki says is not
    // (yet) released in EN blocks the add, whatever the version notes say.
    const collabEvents = p.eventLinks.filter((l) => /Collaboration Event$/.test(l));
    const blocked = collabEvents.map((l) => eventReleaseStatus(l, pagesDir, redirects, today)).find((r) => r.status === "not-released");
    if (blocked) { console.log(`  ℹ Skipping wiki unit #${p.id} ${p.names[0]}: ${blocked.reason} — not released in EN yet`); continue; }

    const category = RARITY[p.rarity];
    const source = deriveSource(p.head);
    const collabLink = p.eventLinks.find((l) => /Collaboration Event$/.test(l));
    let setName: string | null = null;
    for (const l of p.eventLinks) { setName = setForLink(l); if (setName) break; }
    // Collab only on explicit evidence: the unit's own page links a "...Collaboration
    // Event", or the reused set is itself a "...Collaboration" set. Do NOT infer it from
    // "some other unit in this set is flagged collab" (that wrongly flagged Hare of Inaba,
    // an Ancient Heroes Ultra Souls gacha unit, on its first run).
    if (!setName && collabLink) setName = collabLink.replace(/ Event$/, "");
    const isCollab = !!collabLink || (!!setName && /Collaboration$/.test(setName));

    await prisma.unit.create({
      data: {
        id: `unit-${p.id}`, unitNumber: p.id, name: p.names[0],
        evolvedName: p.names[1] ?? null, trueName: p.names[2] ?? null, ultraName: p.names[3] ?? null,
        category, formCount: Math.max(2, p.names.length), sortOrder: SORT_BASE[category] + p.id,
        isCollab, source, setName, excludeFromCollection: false,
      },
    });
    added.push(p.id);
    console.log(`  ✓ Added #${p.id} ${p.names[0]} from the wiki (${category}, source=${source ?? "null"}, setName=${setName ?? "null"}${isCollab ? ", collab" : ""}) — page [[${p.page}]], Version ${p.version} (EN ${intl.toISOString().slice(0, 10)})`);
  }
  console.log(`  Wiki-driven unit adds: ${added.length}`);
  return { added, warnings };
}

/**
 * Units BCData ships early: the English game files can contain a collab's units
 * before the collab has run in EN (PAC-MAN, found 2026-11-17: in the EN data,
 * but its wiki event page says "INT: TBA"). syncUnits() upserts everything BCData
 * has, so such units would show up in the app early. This hides them
 * (excludeFromCollection = true: out of listings, totals and completion %) while
 * their collab event isn't released in EN.
 *
 * Self-healing: units BCData has get excludeFromCollection reset by syncUnits() each
 * run, so they simply aren't re-hidden once the wiki shows an EN date. Units that
 * only exist because of the wiki-driven add (not in BCData yet) are never reset by
 * syncUnits(), so this function also UN-hides any hidden unit (other than
 * protectedNumbers, the Spirit-of-X entries) whose collab event the wiki now
 * explicitly says is released in EN.
 * Guards against wiki staleness hiding real units: only RECENT units (added in a
 * version released internationally within the last 180 days), only when the event
 * page says TBA/future explicitly, and at most MAX_HIDES per run.
 */
const MAX_HIDES = 12;
export async function hideUnreleasedEventUnits(prisma: any, mirrorDir: string | undefined, protectedNumbers: Set<number> = new Set()): Promise<number> {
  const pagesDir = mirrorDir ? join(mirrorDir, "pages") : "";
  if (!mirrorDir || !existsSync(pagesDir)) return 0;
  const pages = readUnitPages(pagesDir);
  const versions = readInternationalDates(pagesDir);
  const redirPath = join(mirrorDir, "redirects.json");
  const redirects: Record<string, string> = existsSync(redirPath) ? JSON.parse(readFileSync(redirPath, "utf8")) : {};
  const today = new Date();
  const recentCutoff = new Date(today.getTime() - 180 * 24 * 3600 * 1000);

  const dbUnits: any[] = await prisma.unit.findMany({ where: { excludeFromCollection: false }, select: { unitNumber: true, name: true } });
  const byNum = new Map<number, any>(dbUnits.map((u) => [u.unitNumber, u]));
  const hide: Array<{ n: number; label: string }> = [];
  for (const p of pages.sort((a, b) => Number(a.regional) - Number(b.regional))) {
    const u = byNum.get(p.id);
    if (!u || p.regional || norm(p.names[0]) !== norm(u.name) || hide.some((h) => h.n === p.id)) continue;
    const vDate = p.version ? versions.get(p.version) : null;
    if (!vDate || vDate < recentCutoff) continue;
    const ev = p.eventLinks.filter((l) => /Collaboration Event$/.test(l)).map((l) => eventReleaseStatus(l, pagesDir, redirects, today)).find((r) => r.status === "not-released");
    if (ev) hide.push({ n: p.id, label: `#${p.id} ${u.name}: ${ev.reason}` });
  }
  if (hide.length > MAX_HIDES) { console.log(`  ⚠ ${hide.length} units would be hidden as not-yet-released in EN (> ${MAX_HIDES}) — hiding none, inspect the wiki mirror`); return 0; }
  for (const h of hide) {
    await prisma.unit.update({ where: { unitNumber: h.n }, data: { excludeFromCollection: true } });
    console.log(`  ℹ Hidden until released in EN — ${h.label}`);
  }
  console.log(`  Units hidden as not-yet-released in EN: ${hide.length}`);

  // Un-hide: hidden units whose every linked collab event is now explicitly released.
  const hidden: any[] = await prisma.unit.findMany({ where: { excludeFromCollection: true }, select: { unitNumber: true, name: true } });
  let unhidden = 0;
  for (const u of hidden) {
    if (protectedNumbers.has(u.unitNumber)) continue;
    const p = pages.filter((x) => x.id === u.unitNumber && !x.regional).find((x) => norm(x.names[0]) === norm(u.name));
    if (!p) continue;
    const events = p.eventLinks.filter((l) => /Collaboration Event$/.test(l)).map((l) => eventReleaseStatus(l, pagesDir, redirects, today));
    if (events.length && events.every((e) => e.status === "released")) {
      await prisma.unit.update({ where: { unitNumber: u.unitNumber }, data: { excludeFromCollection: false } });
      console.log(`  ℹ Un-hidden — #${u.unitNumber} ${u.name}: ${events[0].reason}`);
      unhidden++;
    }
  }
  if (unhidden) console.log(`  Units un-hidden (now released in EN): ${unhidden}`);
  return hide.length;
}
