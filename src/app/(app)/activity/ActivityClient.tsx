"use client";

import { useEffect, useState, useCallback } from "react";

/* ─── Types ───────────────────────────────────────────────────────────────── */

type RawActivity = {
  id: string;
  userId: string;
  username: string;
  displayName: string | null;
  type: string;
  itemName: string | null;
  detail: string | null;
  createdAt: string;
};

type GroupedEntry = {
  key: string;
  userId: string;
  username: string;
  displayName: string | null;
  type: string;
  items: { itemName: string | null; detail: string | null }[];
  createdAt: Date;
};

/* ─── Constants ───────────────────────────────────────────────────────────── */

const BATCH_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

const TYPE_ICONS: Record<string, string> = {
  STORY_CLEARED: "📖",
  LEGEND_COMPLETED: "⭐",
  MEDAL_EARNED: "🏅",
  MILESTONE_CLEARED: "✅",
  UNIT_OBTAINED: "🐱",
  UNIT_EVOLVED: "⬆️",
  UNIT_REMOVED: "❌",
};

const TYPE_VERBS: Record<string, { single: string; plural: string }> = {
  STORY_CLEARED: { single: "updated Story chapter", plural: "updated Story chapters" },
  LEGEND_COMPLETED: { single: "completed Legend subchapter", plural: "completed Legend subchapters" },
  MEDAL_EARNED: { single: "earned medal", plural: "earned medals" },
  MILESTONE_CLEARED: { single: "cleared milestone", plural: "cleared milestones" },
  UNIT_OBTAINED: { single: "obtained", plural: "obtained new cats" },
  UNIT_EVOLVED: { single: "evolved", plural: "evolved cats" },
  UNIT_REMOVED: { single: "removed", plural: "removed cats" },
};

/* ─── Grouping Logic ──────────────────────────────────────────────────────── */

function groupActivities(raw: RawActivity[]): GroupedEntry[] {
  if (raw.length === 0) return [];

  const groups: GroupedEntry[] = [];
  let current: GroupedEntry | null = null;

  for (const a of raw) {
    const ts = new Date(a.createdAt);

    // Check if this activity belongs to the current group
    if (
      current &&
      current.userId === a.userId &&
      current.type === a.type &&
      Math.abs(ts.getTime() - current.createdAt.getTime()) < BATCH_WINDOW_MS
    ) {
      current.items.push({ itemName: a.itemName, detail: a.detail });
    } else {
      // Start a new group
      current = {
        key: a.id,
        userId: a.userId,
        username: a.username,
        displayName: a.displayName,
        type: a.type,
        items: [{ itemName: a.itemName, detail: a.detail }],
        createdAt: ts,
      };
      groups.push(current);
    }
  }

  return groups;
}

function describeGroup(g: GroupedEntry): string {
  const verbs = TYPE_VERBS[g.type] ?? { single: "did something with", plural: "did something with" };
  const count = g.items.length;

  if (count === 1) {
    const item = g.items[0];
    const name = item.itemName;
    const detail = item.detail;

    // For unit types: "obtained Nekoluga" or "evolved Nekoluga to True Form"
    if (g.type === "UNIT_OBTAINED" || g.type === "UNIT_EVOLVED" || g.type === "UNIT_REMOVED") {
      const suffix = detail ? ` to ${detail}` : "";
      return `${verbs.single} ${name ?? "a cat"}${suffix}`;
    }

    // For story with detail: "updated Empire of Cats Ch.1 (treasures → ALL)"
    if (detail) {
      return `${verbs.single} ${name ?? "something"} (${detail})`;
    }

    return `${verbs.single} ${name ?? "something"}`;
  }

  // Batched: "obtained 12 new cats" or "cleared 5 milestones"
  if (g.type === "UNIT_OBTAINED" || g.type === "UNIT_EVOLVED" || g.type === "UNIT_REMOVED") {
    return `${verbs.plural.replace("cats", `${count} cats`).replace("new ", `${count} new `)}`;
  }

  return `${verbs.plural.replace(/\b(chapter|subchapter|medal|milestone)s\b/, `${count} $&`)}`;
}

/* ─── Time Sections ───────────────────────────────────────────────────────── */

function getTimeSection(date: Date, now: Date): string {
  const diff = now.getTime() - date.getTime();
  const dayMs = 86400000;

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - dayMs);
  const weekStart = new Date(todayStart.getTime() - 6 * dayMs);

  if (date >= todayStart) return "Today";
  if (date >= yesterdayStart) return "Yesterday";
  if (date >= weekStart) return "This Week";
  if (diff < 30 * dayMs) return "This Month";
  return "Earlier";
}

function relativeTime(date: Date, now: Date): string {
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ─── Component ───────────────────────────────────────────────────────────── */

export default function ActivityClient() {
  const [activities, setActivities] = useState<RawActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextOffset, setNextOffset] = useState<number | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchActivities = useCallback(async (offset = 0, append = false) => {
    try {
      const res = await fetch(`/api/activity?offset=${offset}&limit=100`);
      if (!res.ok) return;
      const data = await res.json();
      setActivities((prev) => (append ? [...prev, ...data.activities] : data.activities));
      setNextOffset(data.nextOffset);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const loadMore = () => {
    if (nextOffset === null || loadingMore) return;
    setLoadingMore(true);
    fetchActivities(nextOffset, true);
  };

  if (loading) {
    return (
      <div className="text-gray-500 text-sm py-12 text-center">Loading activity...</div>
    );
  }

  const grouped = groupActivities(activities);

  if (grouped.length === 0) {
    return (
      <div className="border border-gray-800 rounded-lg p-8 text-center">
        <div className="text-gray-500 text-sm">No recent activity from you or your friends.</div>
        <div className="text-gray-600 text-xs mt-2">Updates will appear here when progress is logged.</div>
      </div>
    );
  }

  // Group by time section
  const now = new Date();
  const sections = new Map<string, GroupedEntry[]>();
  for (const g of grouped) {
    const section = getTimeSection(g.createdAt, now);
    if (!sections.has(section)) sections.set(section, []);
    sections.get(section)!.push(g);
  }

  return (
    <div className="space-y-6">
      {Array.from(sections.entries()).map(([section, entries]) => (
        <div key={section}>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {section}
          </div>
          <div className="space-y-1">
            {entries.map((g) => (
              <ActivityRow key={g.key} group={g} now={now} />
            ))}
          </div>
        </div>
      ))}

      {nextOffset !== null && (
        <div className="text-center pt-2">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="text-sm px-4 py-2 rounded border border-gray-700 text-gray-400 hover:bg-gray-900 hover:text-gray-200 transition-colors disabled:opacity-50"
          >
            {loadingMore ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Activity Row ────────────────────────────────────────────────────────── */

function ActivityRow({ group, now }: { group: GroupedEntry; now: Date }) {
  const icon = TYPE_ICONS[group.type] ?? "📋";
  const description = describeGroup(group);
  const name = group.displayName ?? group.username;
  const time = relativeTime(group.createdAt, now);
  const count = group.items.length;

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-800 rounded-md px-4 py-3 bg-black hover:border-gray-700 transition-colors">
      <div className="flex items-start gap-3">
        <span className="text-base flex-shrink-0 mt-0.5">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm text-gray-200">
            <span className="font-medium text-gray-100">{name}</span>{" "}
            <span className="text-gray-400">{description}</span>
          </div>

          {/* Expandable detail for batches */}
          {count > 1 && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="text-xs text-gray-600 hover:text-gray-400 mt-1 transition-colors"
            >
              {expanded ? "▾ Hide details" : `▸ Show ${count} items`}
            </button>
          )}

          {expanded && count > 1 && (
            <div className="mt-2 space-y-0.5 text-xs text-gray-500 max-h-40 overflow-auto">
              {group.items.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-gray-700">•</span>
                  <span>
                    {item.itemName ?? "Unknown"}
                    {item.detail && <span className="text-gray-600"> ({item.detail})</span>}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <span className="text-xs text-gray-600 flex-shrink-0 whitespace-nowrap mt-0.5">{time}</span>
      </div>
    </div>
  );
}
