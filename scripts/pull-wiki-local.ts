/**
 * pull-wiki-local.ts — run on a normal home/office machine (NOT GitHub Actions)
 * to mirror the Battle Cats wiki's wikitext and publish it to the `wiki-data`
 * branch, where the sandbox and the sync can read it via git.
 *
 * Why local: battlecats.miraheze.org Cloudflare-challenges GitHub runner IPs
 * (shared datacenter IPs), but a normal home IP with an honest User-Agent gets
 * HTTP 200 (verified 2026-11-17). We stay polite: identifying User-Agent,
 * sequential requests, DELAY_MS between each, incremental (only changed pages
 * are re-downloaded after the first run). No spoofing of any kind.
 *
 * Run:   npx tsx ./scripts/pull-wiki-local.ts
 * Env (all optional):
 *   WIKI_NAMESPACES  pipe-separated namespace ids (default "0|10|14|828": articles, templates, categories, modules)
 *   DELAY_MS         pause between API requests (default 1000)
 *   NO_PUSH=1        write files only, don't commit/push
 *   WORK_DIR         local mirror checkout (default ./wiki-data-local, git-ignored by living outside src)
 *   REPO_URL         default https://github.com/GeckMan/Battle-Cats-Progress-Tracker.git
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync, readdirSync } from "fs";
import { execFileSync } from "child_process";
import { join } from "path";
import { wikiFetch, WIKI_BASE } from "./wiki-access.ts";

const NAMESPACES = (process.env.WIKI_NAMESPACES ?? "0|10|14|828").split("|");
const DELAY_MS = Number(process.env.DELAY_MS ?? 1000);
const WORK_DIR = process.env.WORK_DIR ?? "wiki-data-local";
const REPO_URL = process.env.REPO_URL ?? "https://github.com/GeckMan/Battle-Cats-Progress-Tracker.git";
const BATCH = 50;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const git = (...args: string[]) => execFileSync("git", args, { cwd: WORK_DIR, stdio: ["ignore", "pipe", "inherit"] }).toString().trim();
const safeName = (t: string) => t.replace(/[\\/:*?"<>|]/g, "_").replace(/ /g, "_");

async function api(params: Record<string, string>): Promise<any> {
  const url = new URL(`${WIKI_BASE}/w/api.php`);
  for (const [k, v] of Object.entries({ format: "json", formatversion: "2", ...params })) url.searchParams.set(k, v);
  await sleep(DELAY_MS);
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await wikiFetch(url.toString());
    if (res.status === 429 || res.status >= 500) {
      console.log(`  HTTP ${res.status}, backing off (attempt ${attempt})`);
      await sleep(5000 * attempt);
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${params.action}${res.status === 403 ? " — Cloudflare challenge: this machine/IP is blocked too" : ""}`);
    return res.json();
  }
  throw new Error("too many retries");
}

async function listTitles(ns: string): Promise<string[]> {
  const out: string[] = [];
  let cont: Record<string, string> = {};
  do {
    const j = await api({ action: "query", list: "allpages", apnamespace: ns, aplimit: "500", apfilterredir: "nonredirects", ...cont });
    out.push(...j.query.allpages.map((p: any) => p.title));
    cont = j.continue ?? {};
  } while (Object.keys(cont).length);
  return out;
}

async function categoryMembers(cat: string): Promise<string[]> {
  const out: string[] = [];
  let cont: Record<string, string> = {};
  do {
    const j = await api({ action: "query", list: "categorymembers", cmtitle: cat, cmlimit: "500", ...cont });
    out.push(...j.query.categorymembers.map((p: any) => p.title));
    cont = j.continue ?? {};
  } while (Object.keys(cont).length);
  return out;
}

/** from-title -> target-title for all main-namespace redirects (mirror skips redirect pages themselves). */
async function fetchRedirects(): Promise<Record<string, string>> {
  const idToTitle = new Map<number, string>();
  let cont: Record<string, string> = {};
  do {
    const j = await api({ action: "query", list: "allpages", apnamespace: "0", apfilterredir: "redirects", aplimit: "500", ...cont });
    for (const p of j.query.allpages) idToTitle.set(p.pageid, p.title);
    cont = j.continue ?? {};
  } while (Object.keys(cont).length);
  const out: Record<string, string> = {};
  cont = {};
  do {
    const j = await api({ action: "query", list: "allredirects", arnamespace: "0", arprop: "ids|title", arlimit: "500", ...cont });
    for (const r of j.query.allredirects) {
      const from = idToTitle.get(r.fromid);
      if (from) out[from] = r.title;
    }
    cont = j.continue ?? {};
  } while (Object.keys(cont).length);
  return out;
}

async function main() {
  // --- set up the wiki-data checkout ---
  if (!existsSync(join(WORK_DIR, ".git"))) {
    mkdirSync(WORK_DIR, { recursive: true });
    git("init", "-q");
    git("remote", "add", "origin", REPO_URL);
  }
  let hasRemoteBranch = true;
  try {
    git("fetch", "-q", "origin", "wiki-data");
    git("checkout", "-q", "-B", "wiki-data", "FETCH_HEAD");
  } catch {
    hasRemoteBranch = false;
    git("checkout", "-q", "--orphan", "wiki-data");
  }
  console.log(hasRemoteBranch ? "Updating existing wiki-data branch" : "Creating new wiki-data branch");

  const dir = join(WORK_DIR, "wiki-mirror");
  const pagesDir = join(dir, "pages");
  mkdirSync(pagesDir, { recursive: true });
  const indexPath = join(dir, "_index.json");
  const oldIndex: Record<string, { rev: number; file: string }> = existsSync(indexPath) ? JSON.parse(readFileSync(indexPath, "utf8")) : {};

  // --- enumerate pages ---
  let titles: string[] = [];
  for (const ns of NAMESPACES) {
    const t = await listTitles(ns);
    console.log(`namespace ${ns}: ${t.length} pages`);
    titles.push(...t);
  }

  // --- current revision ids (cheap, no content), then fetch content for changed pages only ---
  const revs = new Map<string, number>();
  for (let i = 0; i < titles.length; i += BATCH) {
    const batch = titles.slice(i, i + BATCH);
    const j = await api({ action: "query", prop: "revisions", rvprop: "ids", titles: batch.join("|") });
    for (const p of j.query.pages) if (p.revisions?.[0]) revs.set(p.title, p.revisions[0].revid);
    if ((i / BATCH) % 10 === 0) console.log(`  revision ids: ${Math.min(i + BATCH, titles.length)}/${titles.length}`);
  }
  const changed = titles.filter((t) => revs.has(t) && oldIndex[t]?.rev !== revs.get(t));
  console.log(`${changed.length} new/changed pages to download (of ${titles.length})`);

  const index: Record<string, { rev: number; file: string }> = {};
  for (const t of titles) if (revs.has(t) && oldIndex[t] && oldIndex[t].rev === revs.get(t)) index[t] = oldIndex[t];

  for (let i = 0; i < changed.length; i += BATCH) {
    const batch = changed.slice(i, i + BATCH);
    const j = await api({ action: "query", prop: "revisions", rvprop: "ids|content", rvslots: "main", titles: batch.join("|") });
    for (const p of j.query.pages) {
      const r = p.revisions?.[0];
      const text = r?.slots?.main?.content;
      if (typeof text !== "string") continue;
      const file = `${safeName(p.title)}.wikitext`;
      writeFileSync(join(pagesDir, file), text);
      index[p.title] = { rev: r.revid, file };
    }
    console.log(`  downloaded ${Math.min(i + BATCH, changed.length)}/${changed.length}`);
  }

  // --- drop files for pages that no longer exist ---
  const keep = new Set(Object.values(index).map((v) => v.file));
  for (const f of readdirSync(pagesDir)) if (!keep.has(f)) rmSync(join(pagesDir, f));

  // --- category listings the sync needs ---
  const jp = await categoryMembers("Category:Japanese Exclusive Content");
  writeFileSync(join(dir, "japanese-exclusive.json"), JSON.stringify(jp.sort(), null, 2));

  try {
    const redirects = await fetchRedirects();
    writeFileSync(join(dir, "redirects.json"), JSON.stringify(redirects, null, 1));
    console.log(`${Object.keys(redirects).length} redirects mirrored`);
  } catch (e) {
    console.log(`  (redirect mirror skipped: ${(e as Error).message})`);
  }

  writeFileSync(indexPath, JSON.stringify(index, null, 1));
  writeFileSync(join(dir, "_meta.json"), JSON.stringify({ source: "pull-wiki-local.ts", mirroredAt: new Date().toISOString(), pages: Object.keys(index).length, changedThisRun: changed.length }, null, 2));
  writeFileSync(
    join(WORK_DIR, "vercel.json"),
    JSON.stringify({ git: { deploymentEnabled: { "wiki-data": false } }, ignoreCommand: "exit 0" }, null, 2) + "\n"
  );

  if (process.env.NO_PUSH) return console.log(`Done (NO_PUSH). Files in ${dir}`);

  git("add", "-A");
  if (!git("status", "--porcelain")) return console.log("No changes since last mirror.");
  git("-c", "user.name=wiki-mirror", "-c", "user.email=noreply@battlecatsprogress.app", "commit", "-q", "-m", `chore: mirror wiki (${changed.length} changed) [skip ci]`);
  git("push", "origin", "wiki-data");
  console.log("Pushed to wiki-data.");
}

main().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
