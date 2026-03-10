import "dotenv/config";
import { seedPrisma as prisma, seedDisconnect } from "../prisma/seed-client.ts";

const API_URL = "https://battle-cats.fandom.com/api.php";
const SOURCE_URL = "https://battle-cats.fandom.com/wiki/Meow_Medals";
const TSV_TITLE = "Module:Medal/medalname.tsv";

function pad3(n: number) {
  return String(n).padStart(3, "0");
}

function normalizeSpaces(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

function stripStars(nameWithStars: string) {
  // "★ Builder of Empires ★" -> "Builder of Empires"
  return normalizeSpaces(nameWithStars.replace(/★/g, ""));
}

function decodeWikiBreaks(s: string) {
  // Some descriptions use <br>
  return normalizeSpaces(s.replace(/<br\s*\/?>/gi, " "));
}

async function fetchWikiTitleContent(title: string): Promise<string> {
  const url =
    `${API_URL}?action=query&format=json&formatversion=2&prop=revisions&rvprop=content&titles=` +
    encodeURIComponent(title);

  const res = await fetch(url, {
    headers: {
      "User-Agent": "battlecats-progress/1.0",
      Accept: "application/json",
    },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${title}`);

  const json = (await res.json()) as any;
  const content = json?.query?.pages?.[0]?.revisions?.[0]?.content as string | undefined;

  if (!content) {
    throw new Error(
      `Could not read content for ${title}. Got keys: ${Object.keys(json ?? {}).join(", ")}`
    );
  }

  return content;
}

type ParsedMedal = {
  num: number; // 0-based index => Medal_000.png
  keyName: string; // name without ★
  displayName: string; // raw name (may include ★)
  description: string;
  imageFile: string; // Medal_000.png
};

function parseMedalNameTsv(tsv: string): ParsedMedal[] {
  const lines = tsv
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const medals: ParsedMedal[] = [];

  for (const line of lines) {
    // Split into [name, description?]; allow missing description
    const [rawName, rawDesc = ""] = line.split("\t");

    const displayName = normalizeSpaces(rawName ?? "");
    if (!displayName) continue;

    // Skip obvious headers if present
    if (displayName.toLowerCase() === "name") continue;

    const keyName = stripStars(displayName);
    const description = decodeWikiBreaks(rawDesc);

    const num = medals.length;

    medals.push({
      num,
      keyName,
      displayName,
      description,
      imageFile: `Medal_${pad3(num)}.png`,
    });
  }

  return medals;
}


async function main() {
  const tsv = await fetchWikiTitleContent(TSV_TITLE);

  const medals = parseMedalNameTsv(tsv);

  console.log(`Parsed medals: ${medals.length}`);
  if (medals.length === 0) {
    // Write a debug file so you can inspect what was fetched
    const fs = await import("node:fs");
    fs.writeFileSync("debug-medalname.tsv.txt", tsv, "utf8");
    throw new Error(
      `Parsed 0 medals from ${TSV_TITLE}. Wrote debug-medalname.tsv.txt.`
    );
  }

  // Upsert into MeowMedal
  for (const m of medals) {
    await prisma.meowMedal.upsert({
      where: { name: m.keyName },
      create: {
        name: m.keyName,
        description: m.description,
        requirementText: m.description, // placeholder; we’ll make structured rules later
        category: "Other",
        sortOrder: m.num,
        sourceUrl: SOURCE_URL,
        imageFile: m.imageFile,
      },
      update: {
        description: m.description,
        requirementText: m.description,
        sortOrder: m.num,
        sourceUrl: SOURCE_URL,
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
