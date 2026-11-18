/**
 * take-screenshots.ts — captures the live site so the Cowork sandbox (which can't
 * reach battlecatsprogress.app) can see it: `git fetch origin screenshots`.
 *
 * Logs in as a dedicated preview account (PREVIEW_USER / PREVIEW_PASS secrets —
 * never a real player's account), then captures the main pages at phone and
 * desktop sizes in both themes. READ-ONLY: it only navigates and opens panels; it
 * never clicks progress toggles. Also records console errors, failed requests and
 * slow loads per page into report.json, which doubles as a smoke test after deploys.
 *
 * Env: BASE_URL (default https://battlecatsprogress.app), PREVIEW_USER, PREVIEW_PASS,
 *      OUT_DIR (default ./screenshots), PAGES (optional comma list to limit pages).
 */
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

// playwright is installed only in the Screenshots workflow (not a site dependency), so
// load it dynamically and keep it out of the app's type-check.
type Browser = any;
type Page = any;
const PLAYWRIGHT = "playwright";

const BASE = (process.env.BASE_URL || "https://battlecatsprogress.app").replace(/\/$/, "");
const OUT = process.env.OUT_DIR || "screenshots";
const USER = process.env.PREVIEW_USER || "";
const PASS = process.env.PREVIEW_PASS || "";
const ONLY = (process.env.PAGES || "").split(",").map((s) => s.trim()).filter(Boolean);

const PUBLIC_PAGES = ["/login", "/signup", "/about"];
const APP_PAGES = ["/dashboard", "/units", "/story", "/legend", "/medals", "/milestones", "/social", "/settings"];
const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: "desktop", width: 1440, height: 900, isMobile: false, hasTouch: false },
];
const THEMES = ["default", "nerv"] as const;
const MAX_FULL_HEIGHT = 3; // full-page shots capped at 3 screens tall

type PageReport = { file: string; url: string; status: number | null; loadMs: number; consoleErrors: string[]; failedRequests: string[] };
const report: PageReport[] = [];
const want = (p: string) => !ONLY.length || ONLY.includes(p);
const slug = (p: string) => p.replace(/^\//, "").replace(/\//g, "_") || "home";

async function settle(page: Page) {
  await page.waitForLoadState("load").catch(() => {});
  // the app polls in the background, so "networkidle" may never come; give rendering a moment
  await page.waitForTimeout(2500);
}

async function shoot(page: Page, path: string, file: string) {
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];
  const onConsole = (m: any) => { if (m.type() === "error") consoleErrors.push(m.text().slice(0, 300)); };
  const onFail = (r: any) => failedRequests.push(`${r.failure()?.errorText ?? "failed"} ${r.url()}`.slice(0, 300));
  const onResp = (r: any) => { if (r.status() >= 400 && !r.url().includes("/_next/")) failedRequests.push(`HTTP ${r.status()} ${r.url()}`.slice(0, 300)); };
  page.on("console", onConsole); page.on("requestfailed", onFail); page.on("response", onResp);
  const t0 = Date.now();
  const resp = await page.goto(BASE + path, { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => null);
  await settle(page);
  const loadMs = Date.now() - t0;
  const vp = page.viewportSize()!;
  const fullH = await page.evaluate(() => document.documentElement.scrollHeight).catch(() => vp.height);
  await page.screenshot({ path: join(OUT, `${file}.png`), clip: { x: 0, y: 0, width: vp.width, height: Math.min(fullH, vp.height * MAX_FULL_HEIGHT) } });
  page.off("console", onConsole); page.off("requestfailed", onFail); page.off("response", onResp);
  report.push({ file: `${file}.png`, url: path, status: resp?.status() ?? null, loadMs, consoleErrors, failedRequests });
  console.log(`  ${file}.png  (${resp?.status() ?? "?"}, ${loadMs}ms${consoleErrors.length ? `, ${consoleErrors.length} console errors` : ""})`);
}

async function run(browser: Browser) {
  for (const vp of VIEWPORTS) {
    for (const theme of THEMES) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch,
        colorScheme: "dark", reducedMotion: "reduce",
      });
      await ctx.addInitScript((t: string) => { try { localStorage.setItem("battlecats-theme", t); } catch {} }, theme);
      const page = await ctx.newPage();
      const tag = `${vp.name}-${theme}`;
      console.log(`== ${tag}`);

      for (const p of PUBLIC_PAGES) if (want(p)) await shoot(page, p, `${tag}__public_${slug(p)}`);

      if (!USER || !PASS) { console.log("  (no PREVIEW_USER/PREVIEW_PASS — skipping logged-in pages)"); await ctx.close(); continue; }
      await page.goto(BASE + "/login", { waitUntil: "domcontentloaded" });
      await page.fill('input[autocomplete="username"]', USER);
      await page.fill('input[type="password"]', PASS);
      await Promise.all([page.waitForURL(/\/dashboard/, { timeout: 30000 }).catch(() => {}), page.click('form button')]);
      if (!/\/dashboard/.test(page.url())) { console.log(`  ⚠ login did not reach /dashboard (at ${page.url()})`); await ctx.close(); continue; }

      // One-time "What's new" dialog: photograph it if it's showing, then dismiss it
      // so it doesn't cover the page shots (dismissing marks it seen for the test account).
      await settle(page);
      const gotIt = page.getByRole("button", { name: "Got it" });
      if (await gotIt.count()) {
        await page.screenshot({ path: join(OUT, `${tag}__whats_new.png`) });
        await gotIt.first().click().catch(() => {});
        await page.waitForTimeout(800);
        console.log(`  ${tag}__whats_new.png`);
      }

      for (const p of APP_PAGES) if (want(p)) await shoot(page, p, `${tag}__${slug(p)}`);

      // Right panel (activity / chat) open on the dashboard.
      if (want("panel")) {
        await page.goto(BASE + "/dashboard", { waitUntil: "domcontentloaded" });
        await settle(page);
        const btn = page.locator('[aria-label="Open panel"]');
        if (await btn.count()) {
          await btn.first().click().catch(() => {});
          await page.waitForTimeout(2000);
          await page.screenshot({ path: join(OUT, `${tag}__panel_activity.png`) });
          const chat = page.getByRole("button", { name: /^chat/i });
          if (await chat.count()) { await chat.first().click().catch(() => {}); await page.waitForTimeout(2000); await page.screenshot({ path: join(OUT, `${tag}__panel_chat.png`) }); }
          console.log(`  ${tag}__panel_*.png`);
        }
      }
      await ctx.close();
    }
  }
}

(async () => {
  mkdirSync(OUT, { recursive: true });
  const { chromium } = await import(PLAYWRIGHT);
  const browser = await chromium.launch();
  try { await run(browser); } finally { await browser.close(); }
  writeFileSync(join(OUT, "report.json"), JSON.stringify({ base: BASE, takenAt: new Date().toISOString(), pages: report }, null, 2));
  const problems = report.filter((r) => r.consoleErrors.length || r.failedRequests.length || (r.status ?? 0) >= 400);
  const md = [`# Screenshots — ${new Date().toISOString()}`, `Base: ${BASE}`, "", `${report.length} page captures; ${problems.length} with errors.`, "",
    ...problems.map((r) => `- **${r.file}** (${r.url}, HTTP ${r.status}): ${[...r.consoleErrors, ...r.failedRequests].slice(0, 4).join(" | ")}`)].join("\n");
  writeFileSync(join(OUT, "README.md"), md + "\n");
  if (process.env.GITHUB_STEP_SUMMARY) writeFileSync(process.env.GITHUB_STEP_SUMMARY, md + "\n", { flag: "a" });
})();
