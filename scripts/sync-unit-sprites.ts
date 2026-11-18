/**
 * sync-unit-sprites.ts — mirrors unit sprites into public/sprites/ so the site
 * serves them as static files (see src/lib/sprites.ts for why).
 *
 * For every collectible unit and each form it has (F1 f, F2 c, TF s, UF u; Ancient
 * Egg base forms share "0_m"), downloads the wiki's sprite if public/sprites/
 * doesn't already have it. Same filename rules as /api/sprite (zero-padded
 * Uni###_x00.png, falling back to the unpadded name for units < 100), same
 * static CDN. Polite: sequential with a short pause, identifying User-Agent.
 * Best-effort: a sprite the wiki doesn't have yet is skipped and retried next
 * run; the site falls back to the live proxy for it meanwhile.
 *
 * Usage: npx tsx ./scripts/sync-unit-sprites.ts   (needs DATABASE_URL)
 * Run by .github/workflows/sync-bcdata.yml, which commits new files.
 */
import "dotenv/config";
import { createHash } from "crypto";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import path from "path";
import { seedPrisma as prisma, seedDisconnect } from "../prisma/seed-client.ts";

const DIR = path.join(process.cwd(), "public", "sprites");
const UA = "BattleCatsProgressTracker/1.0 (+https://battlecatsprogress.app; contact via Discord https://discord.gg/3zsm3he8qQ)";
const DELAY_MS = 150;
const MAX_DOWNLOADS = 4000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
function cdnUrl(filename: string) {
  const md5 = createHash("md5").update(filename).digest("hex");
  return `https://static.miraheze.org/battlecatswiki/${md5[0]}/${md5.slice(0, 2)}/${filename}`;
}

async function download(u: number, f: string): Promise<Buffer | null> {
  const names = [`Uni${String(u).padStart(3, "0")}_${f}00.png`];
  if (u < 100) names.push(`Uni${u}_${f}00.png`);
  for (const name of names) {
    const res = await fetch(cdnUrl(name), { headers: { "User-Agent": UA } }).catch(() => null);
    await sleep(DELAY_MS);
    if (res?.ok && (res.headers.get("content-type") ?? "").includes("image")) return Buffer.from(await res.arrayBuffer());
  }
  return null;
}

async function main() {
  mkdirSync(DIR, { recursive: true });
  const units: any[] = await (prisma as any).unit.findMany({
    where: { excludeFromCollection: false },
    select: { unitNumber: true, name: true, evolvedName: true, trueName: true, ultraName: true },
    orderBy: { unitNumber: "asc" },
  });

  const wanted = new Set<string>();
  for (const u of units) {
    const egg = String(u.name).startsWith("Ancient Egg");
    const forms: [string, boolean][] = [["f", true], ["c", !!u.evolvedName], ["s", !!u.trueName], ["u", !!u.ultraName]];
    forms.forEach(([f, has], i) => {
      if (!has) return;
      wanted.add(egg && i <= 1 ? "0_m" : `${u.unitNumber}_${f}`);
    });
  }

  const missing = [...wanted].filter((k) => !existsSync(path.join(DIR, `${k}.png`)));
  console.log(`Sprites: ${wanted.size} wanted, ${wanted.size - missing.length} already mirrored, ${missing.length} to fetch`);
  let got = 0;
  const notFound: string[] = [];
  for (const k of missing.slice(0, MAX_DOWNLOADS)) {
    const [u, f] = k.split("_");
    const buf = await download(Number(u), f);
    if (buf) {
      writeFileSync(path.join(DIR, `${k}.png`), buf);
      got++;
      if (got % 100 === 0) console.log(`  …${got} downloaded`);
    } else {
      notFound.push(k);
    }
  }
  console.log(`  ✓ ${got} new sprite(s) mirrored`);
  if (notFound.length) console.log(`  ℹ ${notFound.length} not on the wiki CDN yet (proxy fallback covers them): ${notFound.slice(0, 30).join(", ")}${notFound.length > 30 ? " …" : ""}`);
}

main()
  .catch((e) => { console.log(`sprite sync failed (non-fatal): ${e.message}`); })
  .finally(() => seedDisconnect());
