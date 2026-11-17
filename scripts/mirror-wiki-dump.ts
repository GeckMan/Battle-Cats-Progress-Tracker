/**
 * mirror-wiki-dump.ts — backup source for Battle Cats wiki data.
 *
 * battlecats.miraheze.org blocks scripted requests from GitHub Actions
 * (HTTP 403 since ~2026-08-24). Miraheze publishes public XML dumps of its
 * wikis on archive.org, which isn't blocked. This script finds the newest
 * dump, stream-parses it, and keeps only what the sync needs:
 *
 *   pages/<Title>.wikitext   latest wikitext of WANTED_PAGES
 *   japanese-exclusive.json  titles of pages in Category:Japanese Exclusive Content
 *   _meta.json               which archive.org item/file was used, dump date, counts
 *
 * Output goes to OUT_DIR (default ./wiki-mirror); mirror-wiki-dump.yml commits
 * it to the orphan `wiki-data` branch. The data is up to a month old (dumps
 * are monthly) — a backup, not live. Never throws away existing output: if no
 * dump can be found/parsed it exits nonzero and writes nothing.
 *
 * Usage: npx tsx ./scripts/mirror-wiki-dump.ts
 * Needs on PATH (whichever matches the dump's extension): 7z, gzip, bzip2, zstd.
 */
import { createReadStream, createWriteStream, existsSync, mkdirSync, rmSync, writeFileSync, appendFileSync } from "fs";
import { spawn } from "child_process";
import { createInterface } from "readline";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import { join } from "path";

const UA =
  "BattleCatsProgressTracker/1.0 (+https://battlecatsprogress.app; contact via Discord https://discord.gg/3zsm3he8qQ)";
const OUT_DIR = process.env.OUT_DIR ?? "wiki-mirror";
const TMP_DIR = process.env.TMP_DIR ?? "wiki-dump-tmp";
const WANTED_PAGES = new Set(["Cat Release Order", "Cat Guide"]);
const JP_CATEGORY_RE = /\[\[\s*Category\s*:\s*Japanese[ _]Exclusive[ _]Content\s*(\|[^\]]*)?\]\]/i;

const summary: string[] = [];
function note(line: string) {
  console.log(line);
  summary.push(line);
}
function flushSummary() {
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `## Wiki dump mirror\n\n${summary.map((l) => `- ${l}`).join("\n")}\n`);
}

async function getJson(url: string): Promise<any | null> {
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA } });
    if (!r.ok) {
      note(`GET ${url} → HTTP ${r.status}`);
      return null;
    }
    return await r.json();
  } catch (e) {
    note(`GET ${url} → ${(e as Error).message}`);
    return null;
  }
}

type Candidate = { id: string; file: string; size: number; mtime: number };

async function findDump(): Promise<Candidate | null> {
  const ids = new Set<string>(["wiki-battlecatsmirahezeorg_w"]);
  const search = await getJson(
    "https://archive.org/advancedsearch.php?q=" +
      encodeURIComponent("battlecats AND (miraheze OR wiki)") +
      "&fl%5B%5D=identifier&rows=50&output=json"
  );
  for (const d of search?.response?.docs ?? []) if (/battlecats/i.test(d.identifier) && /miraheze/i.test(d.identifier)) ids.add(d.identifier); // other wikis (Fandom, wikihouse) are NOT this wiki
  note(`candidate archive.org items: ${[...ids].join(", ")}`);

  const cands: Candidate[] = [];
  for (const id of ids) {
    const meta = await getJson(`https://archive.org/metadata/${id}`);
    const files: any[] = meta?.files ?? [];
    if (!files.length) {
      note(`${id}: no files / not found`);
      continue;
    }
    for (const f of files) {
      const name: string = f.name ?? "";
      if (!/\.xml(\.(gz|bz2|zst|7z))?$|\.7z$/i.test(name)) continue;
      if (/history|pages-meta-history/i.test(name)) continue; // full history is huge and unneeded
      cands.push({ id, file: name, size: Number(f.size ?? 0), mtime: Number(f.mtime ?? 0) });
    }
    note(`${id}: ${files.length} files, ${cands.filter((c) => c.id === id).length} usable dump file(s)`);
  }
  if (!cands.length) return null;
  // Prefer "current" dumps, then newest by upload time.
  cands.sort((a, b) => Number(/current/i.test(b.file)) - Number(/current/i.test(a.file)) || b.mtime - a.mtime);
  return cands[0];
}

async function download(c: Candidate): Promise<string> {
  mkdirSync(TMP_DIR, { recursive: true });
  const dest = join(TMP_DIR, c.file.replace(/[^\w.\-]/g, "_"));
  const url = `https://archive.org/download/${c.id}/${c.file.split("/").map(encodeURIComponent).join("/")}`;
  note(`downloading ${url} (${(c.size / 1e6).toFixed(1)} MB)`);
  const r = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
  if (!r.ok || !r.body) throw new Error(`download HTTP ${r.status}`);
  await pipeline(Readable.fromWeb(r.body as any), createWriteStream(dest));
  return dest;
}

/** Returns a readable stream of decompressed XML text. */
function openXml(path: string): Readable {
  const run = (cmd: string, args: string[]) => {
    const p = spawn(cmd, args, { stdio: ["ignore", "pipe", "inherit"] });
    p.on("error", (e) => {
      throw new Error(`${cmd} failed to start: ${e.message}`);
    });
    return p.stdout;
  };
  if (/\.7z$/i.test(path)) return run("7z", ["e", "-so", path]);
  if (/\.gz$/i.test(path)) return run("gzip", ["-dc", path]);
  if (/\.bz2$/i.test(path)) return run("bzip2", ["-dc", path]);
  if (/\.zst$/i.test(path)) return run("zstd", ["-dc", path]);
  return createReadStream(path);
}

const unescapeXml = (s: string) =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&amp;/g, "&");

async function parse(path: string) {
  const rl = createInterface({ input: openXml(path), crlfDelay: Infinity });
  const pages = new Map<string, string>();
  const jpExclusive: string[] = [];
  let pageCount = 0;
  let title = "";
  let ns = "";
  let inText = false;
  let textBuf: string[] = [];
  let lastText = "";
  let dumpTs = "";

  for await (const line of rl) {
    if (inText) {
      const end = line.indexOf("</text>");
      if (end >= 0) {
        textBuf.push(line.slice(0, end));
        lastText = textBuf.join("\n");
        textBuf = [];
        inText = false;
      } else textBuf.push(line);
      continue;
    }
    const t = line.match(/<title>(.*)<\/title>/);
    if (t) {
      title = unescapeXml(t[1]);
      ns = "";
      lastText = "";
      continue;
    }
    const n = line.match(/<ns>(-?\d+)<\/ns>/);
    if (n) ns = n[1];
    const ts = line.match(/<timestamp>([^<]+)<\/timestamp>/);
    if (ts && ts[1] > dumpTs) dumpTs = ts[1];
    const tx = line.match(/<text\b[^>]*>(.*)$/);
    if (tx && !/<text\b[^>]*\/>/.test(line)) {
      const rest = tx[1];
      const end = rest.indexOf("</text>");
      if (end >= 0) lastText = rest.slice(0, end);
      else {
        textBuf = [rest];
        inText = true;
      }
      continue;
    }
    if (line.includes("</page>")) {
      pageCount++;
      if (ns === "0" && lastText) {
        const text = unescapeXml(lastText);
        if (WANTED_PAGES.has(title)) pages.set(title, text);
        if (lastText.includes("Japanese") && JP_CATEGORY_RE.test(text)) jpExclusive.push(title);
      }
      title = "";
      lastText = "";
    }
  }
  return { pages, jpExclusive, pageCount, dumpTs };
}

async function main() {
  try {
    const cand = await findDump();
    if (!cand) throw new Error("no usable Miraheze dump found on archive.org");
    note(`using ${cand.id} / ${cand.file}`);
    const file = await download(cand);
    const { pages, jpExclusive, pageCount, dumpTs } = await parse(file);
    note(`parsed ${pageCount} pages; newest revision timestamp ${dumpTs || "?"}`);
    note(`wanted pages found: ${[...pages.keys()].join(", ") || "none"}`);
    note(`Japanese Exclusive Content members: ${jpExclusive.length}`);
    if (![...WANTED_PAGES].some((p) => pages.has(p))) throw new Error("none of the wanted pages were in the dump");

    rmSync(OUT_DIR, { recursive: true, force: true });
    mkdirSync(join(OUT_DIR, "pages"), { recursive: true });
    for (const [t, text] of pages) writeFileSync(join(OUT_DIR, "pages", `${t.replace(/ /g, "_")}.wikitext`), text);
    writeFileSync(join(OUT_DIR, "japanese-exclusive.json"), JSON.stringify(jpExclusive.sort(), null, 2));
    writeFileSync(
      join(OUT_DIR, "_meta.json"),
      JSON.stringify({ item: cand.id, file: cand.file, dumpNewestRevision: dumpTs, mirroredAt: new Date().toISOString(), pageCount }, null, 2)
    );
    note("mirror written");
  } catch (e) {
    note(`FAILED: ${(e as Error).message}`);
    flushSummary();
    process.exit(1);
  } finally {
    if (existsSync(TMP_DIR)) rmSync(TMP_DIR, { recursive: true, force: true });
  }
  flushSummary();
}

main();
