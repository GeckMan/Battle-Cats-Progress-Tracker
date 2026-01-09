import "dotenv/config";
import { load } from "cheerio";
import { seedPrisma as prisma, seedDisconnect } from "../prisma/seed-client.ts";

const WIKI_BASE = "https://battlecats.miraheze.org";
const API_URL = `${WIKI_BASE}/w/api.php`;
const PAGE = "Meow_Medals";
const SOURCE_URL = `${WIKI_BASE}/wiki/${PAGE}`;


function normalizeSpaces(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

function pad3(n: number) {
  return String(n).padStart(3, "0");
}

async function fetchParsedHtml(page: string): Promise<string> {
  const url =
    `${API_URL}?action=parse&format=json&prop=text&redirects=1&page=` +
    encodeURIComponent(page);

  const res = await fetch(url, {
    headers: {
      // Miraheze can be picky without a UA
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

type MedalRow = {
  medalNumber: number;
  name: string;
  description: string;
  imageFile: string; // Medal_000.png (your local convention)
  sourceUrl: string;
  category: string;
};

function extractMedalsFromPageHtml(html: string): MedalRow[] {
  const $ = load(html);

  // Find all candidate rows across all tables. We’ll keep those that look like:
  // Icon | Name | Description
  const medals: MedalRow[] = [];

  $("table tr").each((_, tr) => {
    const $tr = $(tr);
    const tds = $tr.find("td");
    if (tds.length < 2) return;

    // Try to find the icon image in the first td
    const img = $tr.find("td img").first();
    const imgSrc = img.attr("src") ?? "";
    const imgAlt = img.attr("alt") ?? "";

    // We need some “Medal” signal to avoid pulling random tables
    const medalish = /medal/i.test(imgAlt) || /medal/i.test(imgSrc);
    if (!medalish) return;

    // Name and description typically follow in subsequent columns
    const nameText = normalizeSpaces($(tds.get(1)).text());
    const descText =
      tds.length >= 3
        ? normalizeSpaces($(tds.get(2)).text())
        : normalizeSpaces($(tds.get(1)).next().text());

    if (!nameText) return;

    // Determine medal number.
    // Prefer extracting from filename patterns if present.
    // Examples we might see:
    // - "Medal_000.png"
    // - "Medal 000.png"
    // - ".../Medal_000.png"
    const raw = `${imgSrc} ${imgAlt}`;
    const m =
      raw.match(/Medal[_\s](\d{3})\.png/i) ||
      nameText.match(/Medal\s+(\d{3})/i); // fallback if they prefix names

    // If we can't identify the number, we’ll defer and assign sequentially later
    const medalNumber = m ? Number(m[1]) : -1;

    // Local filename convention (underscore)
    const imageFile =
      medalNumber >= 0 ? `Medal_${pad3(medalNumber)}.png` : "";

    medals.push({
      medalNumber,
      name: nameText,
      description: descText || "",
      imageFile,
      sourceUrl: SOURCE_URL,
      category: "Other",
    });
  });

  // If we didn’t reliably extract numbers, assign by order found.
  // Also normalize numbers -> filename.
  let next = 0;
  for (const r of medals) {
    if (r.medalNumber < 0) {
      r.medalNumber = next;
    }
    next = Math.max(next, r.medalNumber + 1);

    if (!r.imageFile) r.imageFile = `Medal_${pad3(r.medalNumber)}.png`;
  }

  // Deduplicate by medalNumber (keep first)
  const byNum = new Map<number, MedalRow>();
  for (const r of medals) {
    if (!byNum.has(r.medalNumber)) byNum.set(r.medalNumber, r);
  }

  return Array.from(byNum.values()).sort((a, b) => a.medalNumber - b.medalNumber);
}

async function main() {
  const html = await fetchParsedHtml(PAGE);

  // Optional: write debug file if you ever need to inspect what Miraheze returned
  // (await import("node:fs")).writeFileSync("debug-miraheze-meow-medals.html", html);

  const medals = extractMedalsFromPageHtml(html);

  console.log(`Parsed medals from Miraheze page: ${medals.length}`);
  if (medals.length === 0) {
    throw new Error(
      "Parsed 0 medals from Miraheze Meow_Medals page. The table markup may differ; we can tighten selectors after seeing your debug HTML."
    );
  }

  for (const m of medals) {
    await prisma.meowMedal.upsert({
      where: { name: m.name },
      create: {
        name: m.name,
        description: m.description,
        requirementText: m.description, // placeholder for now
        category: m.category,
        sortOrder: m.medalNumber,
        sourceUrl: m.sourceUrl,
        imageFile: m.imageFile,
      },
      update: {
        description: m.description,
        requirementText: m.description,
        category: m.category,
        sortOrder: m.medalNumber,
        sourceUrl: m.sourceUrl,
        imageFile: m.imageFile,
      },
    });
  }

  console.log("Upsert complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await seedDisconnect();
  });
