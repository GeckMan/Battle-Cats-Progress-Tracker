/**
 * weekly-chat-digest.ts — Pulls the past week of in-site chat
 * (ChatMessage, src/components/RightPanel.tsx's "Chat" tab) AND the
 * project's Discord bug-reports channel into one plain markdown file
 * committed to reports/, so a Cowork scheduled task can read it without
 * needing direct network/DB access of its own.
 *
 * Why this exists: Ryan asked for a weekly automated pass that reads chat
 * for bug reports and attempts to fix the obvious ones. The Cowork sandbox
 * that run executes in cannot reach the live Neon DB, battlecatsprogress.app,
 * or Discord's API directly (see CLAUDE.md's "Network limitations" section,
 * and there's no Discord MCP connector available either) — but it CAN
 * read/write this git repo. So this script does the parts that need real
 * network/DB access (reading ChatMessage, calling Discord's REST API) from
 * inside GitHub Actions, which has DATABASE_URL and DISCORD_BOT_TOKEN as
 * secrets, and leaves a combined digest file behind for the next Cowork run
 * to pick up.
 *
 * This script does NOT decide what's a bug report — it has no judgment to
 * apply, just a crude keyword heuristic to sort messages into "flagged" vs
 * "everything else" so the digest is easier to scan. The actual
 * investigation (is this real, what's the root cause, is it safe to
 * auto-push) happens in the Cowork scheduled task, same as every other fix
 * in this project's history — this script's only job is "get the raw
 * messages into the repo, honestly labeled as unreviewed."
 *
 * Usage: npx tsx ./scripts/weekly-chat-digest.ts
 * Needs: DATABASE_URL (and DIRECT_DATABASE_URL for migrations, not used here),
 *   DISCORD_BOT_TOKEN, DISCORD_CHANNEL_ID (Discord fetch is skipped with a
 *   warning, not a failure, if either is unset — this file should stay
 *   useful even if the bot gets removed/reconfigured later).
 */

import "dotenv/config";
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "fs";
import path from "path";
import { seedPrisma as prisma, seedDisconnect } from "../prisma/seed-client.ts";

const REPORTS_DIR = path.join(process.cwd(), "reports");

// Crude, intentionally-broad net — false positives are fine (a human/AI
// reviews the digest either way), false negatives are the thing to avoid.
const BUG_KEYWORDS = [
  "bug", "wrong", "incorrect", "broken", "doesn't work", "does not work",
  "should be", "shows up as", "duplicate", "missing", "error", "typo",
  "mismatch", "not showing", "isn't showing", "glitch", "weird", "issue",
  "mistake", "inverted", "backwards",
];

function looksLikeBugReport(content: string): boolean {
  const lower = content.toLowerCase();
  return BUG_KEYWORDS.some((kw) => lower.includes(kw));
}

function lastDigestCutoff(): Date {
  // Runs twice a week (Sun/Wed, see weekly-chat-digest.yml) at a ~3.5 day
  // cadence — look back 5 days by default (a day and a half of slack so a
  // late/rerun workflow doesn't drop messages posted right at the boundary)
  // rather than tracking a cursor file — simpler, and reposting an
  // already-handled message in the digest is harmless since the Cowork run
  // re-checks live site state before fixing anything anyway.
  const d = new Date();
  d.setDate(d.getDate() - 5);
  return d;
}

type DigestMessage = {
  source: "Site Chat" | "Discord";
  author: string;
  createdAt: Date;
  content: string;
};

/**
 * Pages backwards through the Discord channel's message history (newest
 * first, Discord's default order) via `before` cursors until it hits a page
 * entirely older than `since`, collecting only messages at/after that
 * cutoff. Capped at 10 pages (1000 messages) so a very chatty week can't
 * make this run forever — if a channel genuinely gets that busy, raise the
 * cap or shorten the digest window.
 */
async function fetchDiscordMessages(since: Date): Promise<DigestMessage[]> {
  const token = process.env.DISCORD_BOT_TOKEN;
  const channelId = process.env.DISCORD_CHANNEL_ID;
  if (!token || !channelId) {
    console.log("  Skipping Discord (DISCORD_BOT_TOKEN or DISCORD_CHANNEL_ID not set)");
    return [];
  }

  const collected: DigestMessage[] = [];
  let before: string | undefined;

  for (let page = 0; page < 10; page++) {
    const url = new URL(`https://discord.com/api/v10/channels/${channelId}/messages`);
    url.searchParams.set("limit", "100");
    if (before) url.searchParams.set("before", before);

    const res = await fetch(url, {
      headers: { Authorization: `Bot ${token}` },
    });
    if (!res.ok) {
      console.log(`  ⚠ Discord API returned ${res.status} ${res.statusText} — skipping Discord for this run`);
      break;
    }
    const batch: any[] = await res.json();
    if (batch.length === 0) break;

    let hitCutoff = false;
    for (const m of batch) {
      const createdAt = new Date(m.timestamp);
      if (createdAt < since) {
        hitCutoff = true;
        continue;
      }
      if (m.author?.bot) continue; // skip other bots / this bot's own messages
      let content: string = m.content || "";
      if (!content && Array.isArray(m.attachments) && m.attachments.length > 0) {
        content = `[attachment: ${m.attachments.map((a: any) => a.filename).join(", ")}]`;
      }
      if (!content) continue;
      collected.push({
        source: "Discord",
        author: m.author?.global_name || m.author?.username || "unknown",
        createdAt,
        content,
      });
    }

    before = batch[batch.length - 1].id;
    if (hitCutoff) break;
  }

  return collected;
}

async function main() {
  const since = lastDigestCutoff();

  const siteMessages = await (prisma as any).chatMessage.findMany({
    where: { createdAt: { gte: since }, deletedAt: null },
    orderBy: { createdAt: "asc" },
    include: { user: { select: { username: true, displayName: true } } },
  });

  const siteDigestMessages: DigestMessage[] = siteMessages.map((m: any) => ({
    source: "Site Chat" as const,
    author: m.user?.displayName || m.user?.username || m.userId,
    createdAt: new Date(m.createdAt),
    content: m.content,
  }));

  console.log("Fetching Discord channel history...");
  const discordMessages = await fetchDiscordMessages(since);
  console.log(`  Got ${discordMessages.length} Discord message(s) since ${since.toISOString()}`);

  const messages = [...siteDigestMessages, ...discordMessages].sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
  );

  if (!existsSync(REPORTS_DIR)) mkdirSync(REPORTS_DIR, { recursive: true });

  const today = new Date().toISOString().slice(0, 10);
  const filePath = path.join(REPORTS_DIR, `chat-digest-${today}.md`);

  const flagged = messages.filter((m) => looksLikeBugReport(m.content));
  const rest = messages.filter((m) => !looksLikeBugReport(m.content));

  const fmt = (m: DigestMessage) =>
    `- [${m.source}] **${m.author}** (${m.createdAt.toISOString()}): ${m.content.replace(/\n/g, " ")}`;

  const lines: string[] = [];
  lines.push(`# Weekly chat digest — ${today}`);
  lines.push("");
  lines.push(
    `Covers in-site chat and the Discord bug-reports channel since ${since.toISOString()}. This file is generated automatically by scripts/weekly-chat-digest.ts (see .github/workflows/weekly-chat-digest.yml) — nothing in it has been investigated or verified yet. "Flagged" just means a message contained a crude bug-report-ish keyword; it is not a judgment that anything is actually wrong.`
  );
  lines.push("");
  lines.push(`## Flagged as possible bug reports (${flagged.length})`);
  lines.push("");
  if (flagged.length === 0) {
    lines.push("_None this week._");
  } else {
    for (const m of flagged) lines.push(fmt(m));
  }
  lines.push("");
  lines.push(`## Everything else (${rest.length})`);
  lines.push("");
  if (rest.length === 0) {
    lines.push("_None this week._");
  } else {
    for (const m of rest) lines.push(fmt(m));
  }
  lines.push("");

  writeFileSync(filePath, lines.join("\n"));
  console.log(`Wrote ${filePath} (${flagged.length} flagged, ${rest.length} other, ${messages.length} total)`);

  // Keep the reports/ directory from growing forever — retain the last 16
  // digests (~2 months at a twice-weekly cadence) and prune older ones.
  const allDigests = readdirSync(REPORTS_DIR)
    .filter((f) => /^chat-digest-\d{4}-\d{2}-\d{2}\.md$/.test(f))
    .sort();
  const toRemove = allDigests.slice(0, Math.max(0, allDigests.length - 16));
  for (const f of toRemove) {
    const p = path.join(REPORTS_DIR, f);
    try {
      require("fs").unlinkSync(p);
      console.log(`Pruned old digest ${f}`);
    } catch {
      // best-effort
    }
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await seedDisconnect();
  });
