/**
 * probe-wiki-access.ts — one-off diagnostic: which routes to the Battle Cats
 * wiki data actually work from a GitHub Actions runner?
 *
 * Background: battlecats.miraheze.org has answered every scripted request
 * from our weekly sync with HTTP 403 since ~2026-08-24, even with a
 * policy-compliant User-Agent (app name + contact link). That's a network /
 * bot-management block, not a header problem, and we are deliberately NOT
 * trying to defeat it (no browser spoofing, no stealth tooling) — that would
 * be circumventing a block the site chose to put up. Legitimate options that
 * don't depend on getting past it are probed here so we can pick one with
 * real evidence instead of guessing:
 *
 *   1. miraheze-*      baseline: same host, honest UA (expect 403; logs the
 *                      response headers so we can see WHAT is blocking us)
 *   2. miraheze-bot    only if MIRAHEZE_BOT_USER / MIRAHEZE_BOT_PASS are set:
 *                      authenticated API access with a Special:BotPasswords
 *                      credential (Miraheze's documented route for bots)
 *   3. fandom-*        the original Battle Cats wiki on Fandom (different
 *                      host/operator); may carry the same Release Order data
 *   4. archive-*       Miraheze uploads XML dumps of public wikis to
 *                      archive.org; check one exists for this wiki
 *
 * Usage: npx tsx ./scripts/probe-wiki-access.ts   (see probe-wiki-access.yml)
 * Prints a table and, on GitHub Actions, appends it to the run summary.
 */
import { appendFileSync } from "fs";

const UA =
  "BattleCatsProgressTracker/1.0 (+https://battlecatsprogress.app; contact via Discord https://discord.gg/3zsm3he8qQ)";

type Row = { probe: string; status: string; detail: string };
const rows: Row[] = [];

async function probe(name: string, url: string, init: RequestInit = {}, jar?: { cookie: string }) {
  try {
    const headers: Record<string, string> = { "User-Agent": UA, Accept: "application/json, text/plain, */*" };
    if (jar?.cookie) headers.Cookie = jar.cookie;
    const res = await fetch(url, { ...init, headers: { ...headers, ...(init.headers as any) }, redirect: "follow" });
    const body = await res.text();
    const h = (k: string) => res.headers.get(k);
    const bits = [
      `server=${h("server") ?? "?"}`,
      h("cf-ray") ? "cloudflare" : "",
      h("cf-mitigated") ? `cf-mitigated=${h("cf-mitigated")}` : "",
      `${body.length}B`,
      body.slice(0, 90).replace(/\s+/g, " "),
    ].filter(Boolean);
    rows.push({ probe: name, status: `${res.status}`, detail: bits.join(" | ") });
    return { res, body };
  } catch (e) {
    rows.push({ probe: name, status: "ERR", detail: (e as Error).message });
    return null;
  }
}

async function main() {
  const M = "https://battlecats.miraheze.org";
  await probe("miraheze-api", `${M}/w/api.php?action=query&meta=siteinfo&format=json`);
  await probe("miraheze-raw", `${M}/w/index.php?title=Cat_Release_Order&action=raw`);
  await probe("miraheze-export", `${M}/wiki/Special:Export/Cat_Release_Order`);

  const user = process.env.MIRAHEZE_BOT_USER;
  const pass = process.env.MIRAHEZE_BOT_PASS;
  if (user && pass) {
    // Documented MediaWiki bot login: fetch a login token, then action=login
    // with a bot password (Special:BotPasswords), then reuse the session.
    const jar = { cookie: "" };
    const grab = (res: Response) => {
      const set = (res.headers as any).getSetCookie?.() ?? [];
      jar.cookie = [jar.cookie, ...set.map((c: string) => c.split(";")[0])].filter(Boolean).join("; ");
    };
    const t = await probe("miraheze-bot-token", `${M}/w/api.php?action=query&meta=tokens&type=login&format=json`, {}, jar);
    if (t && t.res.ok) {
      grab(t.res);
      const token = JSON.parse(t.body)?.query?.tokens?.logintoken;
      const body = new URLSearchParams({ action: "login", lgname: user, lgpassword: pass, lgtoken: token, format: "json" });
      const l = await probe("miraheze-bot-login", `${M}/w/api.php`, { method: "POST", body, headers: { "Content-Type": "application/x-www-form-urlencoded" } }, jar);
      if (l && l.res.ok) {
        grab(l.res);
        await probe("miraheze-bot-parse", `${M}/w/api.php?action=parse&format=json&prop=sections&page=Cat_Release_Order`, {}, jar);
      }
    }
  } else {
    rows.push({ probe: "miraheze-bot", status: "SKIP", detail: "MIRAHEZE_BOT_USER / MIRAHEZE_BOT_PASS not set" });
  }

  const F = "https://battle-cats.fandom.com";
  await probe("fandom-siteinfo", `${F}/api.php?action=query&meta=siteinfo&format=json`);
  await probe("fandom-release-order", `${F}/api.php?action=parse&page=Cat_Release_Order&prop=sections&format=json`);

  await probe(
    "archive-search",
    "https://archive.org/advancedsearch.php?q=battlecats+miraheze&fl%5B%5D=identifier&fl%5B%5D=title&rows=20&output=json"
  );
  await probe("archive-dump-guess", "https://archive.org/metadata/wiki-battlecatsmirahezeorg_w");

  const table = ["| probe | status | detail |", "|---|---|---|", ...rows.map((r) => `| ${r.probe} | ${r.status} | ${r.detail.replace(/\|/g, "/")} |`)].join("\n");
  console.log(table);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `## Wiki access probe\n\n${table}\n`);
}

main();
