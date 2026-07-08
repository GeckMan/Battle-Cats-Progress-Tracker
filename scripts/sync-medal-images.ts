/**
 * sync-medal-images.ts — Fills in missing Meow Medal artwork from the wiki.
 *
 * BCData (scripts/sync-bcdata.ts) only ships medal names/descriptions/
 * conditions — it does not include the actual icon graphics at all. The 125
 * images already in public/medals/ were sourced by hand at some point (most
 * likely from the Battle Cats wiki, matching the old
 * import-meow-medals-miraheze.ts scraper's naming convention).
 *
 * This script closes that gap going forward: for every MeowMedal row whose
 * assigned image file (set by sync-bcdata.ts's syncMeowMedals, e.g.
 * "Medal_125.png") doesn't exist yet in public/medals/, it looks that medal
 * up on the wiki's Meow_Medals page by name and downloads the artwork.
 *
 * Intended to run right after sync-bcdata.ts, as part of the same CI job —
 * see .github/workflows/sync-bcdata.yml, which commits any newly-downloaded
 * images back into public/medals/ so they ship with the next deploy.
 *
 * Usage:
 *   npx tsx ./scripts/sync-medal-images.ts
 *
 * This is best-effort: if the wiki is unreachable or a medal isn't found on
 * the page (e.g. brand new, wiki not updated yet), it logs a warning and
 * moves on rather than failing the whole run — missing artwork is a cosmetic
 * gap, not a data-integrity problem like a failed BCData sync would be.
 */

import "dotenv/config";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import path from "path";
import { load } from "cheerio";
import { seedPrisma as prisma, seedDisconnect } from "../prisma/seed-client.ts";

const WIKI_BASE = "https://battlecats.miraheze.org";
const API_URL = `${WIKI_BASE}/w/api.php`;
const PAGE = "Meow_Medals";
const MEDALS_DIR = path.join(process.cwd(), "public", "medals");

function normalizeMedalName(name: string): string {
  return name
    .replace(/[★☆✩✪✫✬✭✮✯✰⭐]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

async function fetchParsedHtml(page: string): Promise<string> {
  const url =
    `${API_URL}?action=parse&format=json&prop=text&redirects=1&page=` +
    encodeURIComponent(page);

  const res = await fetch(url, {
    headers: {
      "User-Agent": "battlecats-progress/1.0",
      Accept: "application/json",
    },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status} from parse API: ${url}`);

  const json = (await res.json()) as any;
  const html = json?.parse?.text?.["*"] as string | undefined;

  if (!html) {
    throw new Error(`parse API returned no HTML. Keys: ${Object.keys(json ?? {}).join(", ")}`);
  }

  return html;
}

/**
 * MediaWiki image `src` attributes are usually thumbnail URLs like:
 *   //static.wikitide.net/.../thumb/a/ab/Medal_037.png/50px-Medal_037.png
 * The full-resolution original lives at:
 *   //static.wikitide.net/.../a/ab/Medal_037.png
 * (strip the "/thumb" segment and the trailing "<size>px-<filename>" part).
 */
function resolveOriginalImageUrl(src: string): string {
  let url = src.trim();
  if (url.startsWith("//")) url = "https:" + url;

  const thumbMatch = url.match(/^(.*)\/thumb\/(.+)\/[^/]+$/);
  if (thumbMatch) {
    url = `${thumbMatch[1]}/${thumbMatch[2]}`;
  }

  return url;
}

/** Parses the Meow_Medals wiki page into a normalizedName -> image URL map. */
function extractMedalImageMap(html: string): Map<string, string> {
  const $ = load(html);
  const map = new Map<string, string>();

  $("table tr").each((_, tr) => {
    const $tr = $(tr);
    const tds = $tr.find("td");
    if (tds.length < 2) return;

    const img = $tr.find("td img").first();
    const imgSrc = img.attr("src") ?? "";
    const imgAlt = img.attr("alt") ?? "";
    const medalish = /medal/i.test(imgAlt) || /medal/i.test(imgSrc);
    if (!medalish || !imgSrc) return;

    const nameText = $(tds.get(1)).text().replace(/\s+/g, " ").trim();
    if (!nameText) return;

    const key = normalizeMedalName(nameText);
    if (!map.has(key)) {
      map.set(key, resolveOriginalImageUrl(imgSrc));
    }
  });

  return map;
}

async function main() {
  if (!existsSync(MEDALS_DIR)) mkdirSync(MEDALS_DIR, { recursive: true });

  const medals: { id: string; name: string; imageFile: string | null }[] =
    await (prisma as any).meowMedal.findMany({
      select: { id: true, name: true, imageFile: true },
    });

  const missing = medals.filter(
    (m) => m.imageFile && !existsSync(path.join(MEDALS_DIR, m.imageFile))
  );

  if (missing.length === 0) {
    console.log("All meow medal images already present — nothing to fetch.");
    return;
  }

  console.log(`${missing.length} medal(s) missing local artwork — checking the wiki...`);

  let imageMap: Map<string, string>;
  try {
    const html = await fetchParsedHtml(PAGE);
    imageMap = extractMedalImageMap(html);
    console.log(`  Parsed ${imageMap.size} medal images from the wiki page.`);
  } catch (e: any) {
    console.warn(`  Could not fetch/parse the wiki page (${e.message}) — skipping image sync for now.`);
    return;
  }

  let downloaded = 0;
  let notFound = 0;
  let failed = 0;

  for (const m of missing) {
    const key = normalizeMedalName(m.name);
    const imgUrl = imageMap.get(key);
    if (!imgUrl) {
      console.warn(`    No wiki match for "${m.name}" — leaving unset for now.`);
      notFound++;
      continue;
    }

    try {
      const res = await fetch(imgUrl, { headers: { "User-Agent": "battlecats-progress/1.0" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      writeFileSync(path.join(MEDALS_DIR, m.imageFile!), buf);
      console.log(`    ✓ Downloaded ${m.imageFile} for "${m.name}"`);
      downloaded++;
    } catch (e: any) {
      console.warn(`    Failed to download image for "${m.name}" from ${imgUrl}: ${e.message}`);
      failed++;
    }
  }

  console.log(
    `\n✓ Medal image sync done: ${downloaded} downloaded, ${notFound} not found on wiki, ${failed} failed.`
  );
}

main()
  .catch((e) => {
    console.error("Medal image sync failed:", e);
    // Non-fatal by design — missing artwork shouldn't fail the whole CI run.
  })
  .finally(async () => {
    await seedDisconnect();
  });
