/**
 * weekly-chat-digest.ts — Pulls the past week of in-site chat
 * (ChatMessage, src/components/RightPanel.tsx's "Chat" tab) into a plain
 * markdown file committed to reports/, so a Cowork scheduled task can read
 * it without needing direct network/DB access of its own.
 *
 * Why this exists: Ryan asked for a weekly automated pass that reads chat
 * for bug reports and attempts to fix the obvious ones. The Cowork sandbox
 * that run executes in cannot reach the live Neon DB or
 * battlecatsprogress.app directly (see CLAUDE.md's "Network limitations"
 * section) — but it CAN read/write this git repo. So this script does the
 * one thing that needs real DB access (reading ChatMessage) from inside
 * GitHub Actions, which already has DATABASE_URL as a secret, and leaves a
 * digest file behind for the next Cowork run to pick up.
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
 * Needs: DATABASE_URL (and DIRECT_DATABASE_URL for migrations, not used here)
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
  // Look back 8 days by default (a day of slack past the weekly cadence so
  // a late/rerun workflow doesn't drop messages posted right at the
  // boundary) rather than tracking a cursor file — simpler, and reposting
  // an already-handled message in the digest is harmless since the Cowork
  // run re-checks live site state before fixing anything anyway.
  const d = new Date();
  d.setDate(d.getDate() - 8);
  return d;
}

async function main() {
  const since = lastDigestCutoff();

  const messages = await (prisma as any).chatMessage.findMany({
    where: { createdAt: { gte: since }, deletedAt: null },
    orderBy: { createdAt: "asc" },
    include: { user: { select: { username: true, displayName: true } } },
  });

  if (!existsSync(REPORTS_DIR)) mkdirSync(REPORTS_DIR, { recursive: true });

  const today = new Date().toISOString().slice(0, 10);
  const filePath = path.join(REPORTS_DIR, `chat-digest-${today}.md`);

  const flagged = messages.filter((m: any) => looksLikeBugReport(m.content));
  const rest = messages.filter((m: any) => !looksLikeBugReport(m.content));

  const fmt = (m: any) =>
    `- **${m.user?.displayName || m.user?.username || m.userId}** (${new Date(m.createdAt).toISOString()}): ${m.content.replace(/\n/g, " ")}`;

  const lines: string[] = [];
  lines.push(`# Weekly chat digest — ${today}`);
  lines.push("");
  lines.push(
    `Covers in-site chat messages since ${since.toISOString()}. This file is generated automatically by scripts/weekly-chat-digest.ts (see .github/workflows/weekly-chat-digest.yml) — nothing in it has been investigated or verified yet. "Flagged" just means a message contained a crude bug-report-ish keyword; it is not a judgment that anything is actually wrong.`
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

  // Keep the reports/ directory from growing forever — retain the last 8
  // digests (~2 months at a weekly cadence) and prune older ones.
  const allDigests = readdirSync(REPORTS_DIR)
    .filter((f) => /^chat-digest-\d{4}-\d{2}-\d{2}\.md$/.test(f))
    .sort();
  const toRemove = allDigests.slice(0, Math.max(0, allDigests.length - 8));
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
