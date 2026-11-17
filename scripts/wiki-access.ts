/**
 * wiki-access.ts — shared access layer for the Battle Cats wiki on Miraheze.
 *
 * Since ~2026-08-24 every scripted request from our weekly sync to
 * battlecats.miraheze.org has answered HTTP 403, even with a policy-compliant
 * User-Agent (see WIKI_USER_AGENT). This module adds Miraheze's documented
 * route for bots: log in with a Special:BotPasswords credential and send the
 * session cookie on every request. It is used only when both env vars
 * MIRAHEZE_BOT_USER ("Account@botname") and MIRAHEZE_BOT_PASS are set;
 * otherwise (or if login fails) requests go out anonymously exactly as
 * before, so adding the secrets can only help, never break the sync.
 *
 * Whether bot authentication gets past whatever is returning the 403 is not
 * known yet -- run the "Probe wiki access" workflow to find out. If it doesn't,
 * scripts/mirror-wiki-dump.ts (the archive.org dump mirror) is the fallback.
 *
 * Deliberately NOT here: browser spoofing or any other way of disguising the
 * client. If the site doesn't want our traffic that's a policy to work with
 * (bot account, allowlist request), not to defeat.
 */

export const WIKI_BASE = "https://battlecats.miraheze.org";

export const WIKI_USER_AGENT =
  "BattleCatsProgressTracker/1.0 (+https://battlecatsprogress.app; contact via Discord https://discord.gg/3zsm3he8qQ)";

let cookie = "";
let loginAttempted = false;
export let botLoginStatus = "not attempted (no bot credentials set)";

function mergeCookies(res: Response) {
  const set: string[] = (res.headers as any).getSetCookie?.() ?? [];
  if (set.length === 0) return;
  const jar = new Map<string, string>();
  for (const part of cookie.split("; ").filter(Boolean)) {
    const i = part.indexOf("=");
    jar.set(part.slice(0, i), part.slice(i + 1));
  }
  for (const c of set) {
    const kv = c.split(";")[0];
    const i = kv.indexOf("=");
    jar.set(kv.slice(0, i), kv.slice(i + 1));
  }
  cookie = [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

/** Logs in once per process if bot credentials are configured. Never throws. */
export async function ensureBotLogin(): Promise<void> {
  if (loginAttempted) return;
  loginAttempted = true;
  const user = process.env.MIRAHEZE_BOT_USER;
  const pass = process.env.MIRAHEZE_BOT_PASS;
  if (!user || !pass) return;
  const headers = { "User-Agent": WIKI_USER_AGENT, Accept: "application/json" };
  try {
    const t = await fetch(`${WIKI_BASE}/w/api.php?action=query&meta=tokens&type=login&format=json`, { headers });
    if (!t.ok) {
      botLoginStatus = `login token request failed: HTTP ${t.status}`;
      console.log(`  ℹ Miraheze bot login: ${botLoginStatus} — continuing anonymously`);
      return;
    }
    mergeCookies(t);
    const token = ((await t.json()) as any)?.query?.tokens?.logintoken;
    const body = new URLSearchParams({ action: "login", lgname: user, lgpassword: pass, lgtoken: token, format: "json" });
    const l = await fetch(`${WIKI_BASE}/w/api.php`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/x-www-form-urlencoded", Cookie: cookie },
      body,
    });
    mergeCookies(l);
    const json = (await l.json().catch(() => null)) as any;
    const result = json?.login?.result;
    if (l.ok && result === "Success") {
      botLoginStatus = `logged in as ${json.login.lgusername ?? user}`;
    } else {
      botLoginStatus = `login failed: HTTP ${l.status} ${result ?? json?.error?.code ?? ""} ${json?.login?.reason ?? ""}`.trim();
      cookie = "";
    }
    console.log(`  ℹ Miraheze bot login: ${botLoginStatus}`);
  } catch (e) {
    botLoginStatus = `login error: ${(e as Error).message}`;
    cookie = "";
    console.log(`  ℹ Miraheze bot login: ${botLoginStatus} — continuing anonymously`);
  }
}

/** fetch() against the wiki with our User-Agent and (if logged in) bot session. */
export async function wikiFetch(url: string, init: RequestInit = {}): Promise<Response> {
  await ensureBotLogin();
  const headers: Record<string, string> = {
    "User-Agent": WIKI_USER_AGENT,
    Accept: "application/json",
    ...((init.headers as Record<string, string>) ?? {}),
  };
  if (cookie) headers.Cookie = cookie;
  return fetch(url, { ...init, headers });
}
