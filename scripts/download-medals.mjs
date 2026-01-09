import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";

// Reuse the same Prisma client config you already use for seed
import { seedPrisma as prisma, seedDisconnect } from "../prisma/seed-client.ts";

const WIKI_BASE = "https://battlecats.miraheze.org";
const API_URL = `${WIKI_BASE}/w/api.php`;

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function downloadToFile(url, outPath) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "battlecats-progress/1.0",
      Accept: "image/*,*/*;q=0.8",
    },
    redirect: "follow",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} for ${url}\n${text.slice(0, 200)}`);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(outPath, buf);
}

// IMPORTANT: Miraheze file titles are often "Medal 123.png" (space), while your local files are "Medal_123.png" (underscore).
async function fetchFileUrlFromMiraheze(localFileName) {
  const candidates = [];

  // 1) underscore version (your local convention)
  candidates.push(localFileName);

  // 2) space version: Medal_123.png -> Medal 123.png
  const spaceVersion = localFileName.replace(
    /^Medal_(\d{3})\.png$/i,
    "Medal $1.png"
  );
  if (spaceVersion !== localFileName) candidates.push(spaceVersion);

  for (const candidate of candidates) {
    const title = `File:${candidate}`;
    const url =
      `${API_URL}?action=query&format=json&formatversion=2&prop=imageinfo&iiprop=url&titles=` +
      encodeURIComponent(title);

    const res = await fetch(url, {
      headers: {
        "User-Agent": "battlecats-progress/1.0",
        Accept: "application/json",
      },
    });

    if (!res.ok) continue;

    const json = await res.json();
    const fileUrl = json?.query?.pages?.[0]?.imageinfo?.[0]?.url;

    if (fileUrl) return fileUrl;
  }

  throw new Error(
    `No imageinfo.url found on Miraheze for ${localFileName} (tried underscore + space variants)`
  );
}

async function main() {
  const outDir = path.join(process.cwd(), "public", "medals");
  await ensureDir(outDir);

  const medals = await prisma.meowMedal.findMany({
    select: { imageFile: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  const files = Array.from(
    new Set(medals.map((m) => m.imageFile).filter(Boolean))
  );

  console.log(`Found ${files.length} medal images in DB.`);
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of files) {
    const outPath = path.join(outDir, file);

    if (await fileExists(outPath)) {
      skipped++;
      continue;
    }

    try {
      const url = await fetchFileUrlFromMiraheze(file);
      console.log(`Downloading ${file}...`);
      await downloadToFile(url, outPath);
      downloaded++;
    } catch (e) {
      failed++;
      console.warn(`Failed: ${file}\n${e?.message ?? e}`);
    }
  }

  console.log(
    `Done. downloaded=${downloaded}, skipped=${skipped}, failed=${failed}, out=${outDir}`
  );

  if (failed > 0) {
    process.exitCode = 1;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await seedDisconnect();
  });
