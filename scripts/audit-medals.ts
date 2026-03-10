import "dotenv/config";

const API_URL = "https://battle-cats.fandom.com/api.php";

async function fetchTitleContent(title: string): Promise<string> {
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
  if (!content) throw new Error(`No content for ${title}`);

  return content;
}

function normalize(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

function stripStars(s: string) {
  return normalize(s.replace(/★/g, ""));
}

function parseMedalNameTSV(tsv: string): string[] {
  const lines = tsv.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const names: string[] = [];

  for (const line of lines) {
    const [rawName] = line.split("\t");
    const name = stripStars(rawName ?? "");
    if (!name) continue;
    if (name.toLowerCase() === "name") continue; // header guard
    names.push(name);
  }

  return names;
}

function parseMedalOrderTSV(tsv: string): string[] {
  const lines = tsv.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const names: string[] = [];

  for (const line of lines) {
    // Header is "Name\tRarity"
    if (line.toLowerCase().startsWith("name\t")) continue;

    const [name] = line.split("\t");
    const n = normalize(name ?? "");
    if (!n) continue;
    names.push(n);
  }

  return names;
}

async function main() {
  const nameTSV = await fetchTitleContent("Module:Medal/medalname.tsv");
  const orderTSV = await fetchTitleContent("Module:Medal/medalorder.tsv");

  const names = parseMedalNameTSV(nameTSV);
  const order = parseMedalOrderTSV(orderTSV);

  const nameSet = new Set(names);
  const orderSet = new Set(order);

  const inOrderNotInNames = order.filter((n) => !nameSet.has(n));
  const inNamesNotInOrder = names.filter((n) => !orderSet.has(n));

  console.log(`medalname.tsv count: ${names.length}`);
  console.log(`medalorder.tsv count: ${order.length}`);
  console.log("");

  console.log(`In medalorder.tsv but missing in medalname.tsv: ${inOrderNotInNames.length}`);
  for (const n of inOrderNotInNames) console.log(`  - ${n}`);

  console.log("");
  console.log(`In medalname.tsv but missing in medalorder.tsv: ${inNamesNotInOrder.length}`);
  for (const n of inNamesNotInOrder) console.log(`  - ${n}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
