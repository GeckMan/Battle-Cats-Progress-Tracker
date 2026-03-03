"use client";

import { useEffect, useState, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   RightPanel — sliding drawer on the right edge with Activity + Chat tabs
   ═══════════════════════════════════════════════════════════════════════════ */

type Tab = "activity" | "chat";

export default function RightPanel({
  open,
  onClose,
  activeTab,
  onTabChange,
  unreadActivity,
  unreadChat,
}: {
  open: boolean;
  onClose: () => void;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  unreadActivity: number;
  unreadChat: number;
}) {
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-screen w-[420px] max-w-[90vw] bg-gray-950 border-l border-gray-800 z-40 flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-gray-800">
          <div className="flex gap-1">
            <TabButton
              active={activeTab === "activity"}
              onClick={() => onTabChange("activity")}
              badge={activeTab !== "activity" ? unreadActivity : 0}
            >
              Activity
            </TabButton>
            <TabButton
              active={activeTab === "chat"}
              onClick={() => onTabChange("chat")}
              badge={activeTab !== "chat" ? unreadChat : 0}
            >
              Chat
            </TabButton>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-200 transition-colors p-1"
            aria-label="Close panel"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="4" x2="12" y2="12" />
              <line x1="12" y1="4" x2="4" y2="12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "activity" ? <ActivityTab /> : <ChatTab />}
        </div>
      </aside>
    </>
  );
}

function TabButton({
  active,
  onClick,
  badge,
  children,
}: {
  active: boolean;
  onClick: () => void;
  badge?: number;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-3 py-1.5 text-sm rounded transition-colors ${
        active
          ? "bg-amber-950 text-amber-200 border border-amber-800"
          : "text-gray-400 border border-transparent hover:bg-gray-900 hover:text-gray-200"
      }`}
    >
      {children}
      {(badge ?? 0) > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1 leading-none">
          {badge! > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Activity Tab — ported from the old standalone page
   ═══════════════════════════════════════════════════════════════════════════ */

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

const BATCH_WINDOW_MS = 5 * 60 * 1000;

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

function groupActivities(raw: RawActivity[]): GroupedEntry[] {
  if (raw.length === 0) return [];
  const groups: GroupedEntry[] = [];
  let current: GroupedEntry | null = null;
  for (const a of raw) {
    const ts = new Date(a.createdAt);
    if (
      current &&
      current.userId === a.userId &&
      current.type === a.type &&
      Math.abs(ts.getTime() - current.createdAt.getTime()) < BATCH_WINDOW_MS
    ) {
      current.items.push({ itemName: a.itemName, detail: a.detail });
    } else {
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
    if (g.type === "UNIT_OBTAINED" || g.type === "UNIT_EVOLVED" || g.type === "UNIT_REMOVED") {
      const suffix = item.detail ? ` to ${item.detail}` : "";
      return `${verbs.single} ${item.itemName ?? "a cat"}${suffix}`;
    }
    if (item.detail) return `${verbs.single} ${item.itemName ?? "something"} (${item.detail})`;
    return `${verbs.single} ${item.itemName ?? "something"}`;
  }
  if (g.type === "UNIT_OBTAINED" || g.type === "UNIT_EVOLVED" || g.type === "UNIT_REMOVED") {
    return `${verbs.plural.replace("cats", `${count} cats`).replace("new ", `${count} new `)}`;
  }
  return `${verbs.plural.replace(/\b(chapter|subchapter|medal|milestone)s\b/, `${count} $&`)}`;
}

function getTimeSection(date: Date, now: Date): string {
  const dayMs = 86400000;
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - dayMs);
  const weekStart = new Date(todayStart.getTime() - 6 * dayMs);
  if (date >= todayStart) return "Today";
  if (date >= yesterdayStart) return "Yesterday";
  if (date >= weekStart) return "This Week";
  if (now.getTime() - date.getTime() < 30 * dayMs) return "This Month";
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

function ActivityTab() {
  const [activities, setActivities] = useState<RawActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextOffset, setNextOffset] = useState<number | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchActivities = useCallback(async (offset = 0, append = false) => {
    try {
      const res = await fetch(`/api/activity?offset=${offset}&limit=50`);
      if (!res.ok) return;
      const data = await res.json();
      setActivities((prev) => (append ? [...prev, ...data.activities] : data.activities));
      setNextOffset(data.nextOffset);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  if (loading) {
    return <div className="text-gray-500 text-sm py-12 text-center">Loading activity...</div>;
  }

  const grouped = groupActivities(activities);

  if (grouped.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-500 text-sm">No recent activity.</div>
        <div className="text-gray-600 text-xs mt-1">Updates appear when you or friends log progress.</div>
      </div>
    );
  }

  const now = new Date();
  const sections = new Map<string, GroupedEntry[]>();
  for (const g of grouped) {
    const section = getTimeSection(g.createdAt, now);
    if (!sections.has(section)) sections.set(section, []);
    sections.get(section)!.push(g);
  }

  return (
    <div className="overflow-y-auto h-full px-3 py-3 space-y-4">
      {Array.from(sections.entries()).map(([section, entries]) => (
        <div key={section}>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">
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
        <div className="text-center py-2">
          <button
            onClick={() => {
              setLoadingMore(true);
              fetchActivities(nextOffset, true);
            }}
            disabled={loadingMore}
            className="text-xs px-3 py-1.5 rounded border border-gray-700 text-gray-400 hover:bg-gray-900 hover:text-gray-200 transition-colors disabled:opacity-50"
          >
            {loadingMore ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}

function ActivityRow({ group, now }: { group: GroupedEntry; now: Date }) {
  const icon = TYPE_ICONS[group.type] ?? "📋";
  const description = describeGroup(group);
  const name = group.displayName ?? group.username;
  const time = relativeTime(group.createdAt, now);
  const count = group.items.length;
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-md px-3 py-2 hover:bg-gray-900/50 transition-colors">
      <div className="flex items-start gap-2">
        <span className="text-sm flex-shrink-0 mt-0.5">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-300">
            <span className="font-medium text-gray-100">{name}</span>{" "}
            <span className="text-gray-400">{description}</span>
          </div>
          {count > 1 && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="text-[10px] text-gray-600 hover:text-gray-400 mt-0.5 transition-colors"
            >
              {expanded ? "▾ Hide" : `▸ ${count} items`}
            </button>
          )}
          {expanded && count > 1 && (
            <div className="mt-1 space-y-0.5 text-[10px] text-gray-500 max-h-32 overflow-auto">
              {group.items.map((item, i) => (
                <div key={i}>
                  <span className="text-gray-700">• </span>
                  {item.itemName ?? "Unknown"}
                  {item.detail && <span className="text-gray-600"> ({item.detail})</span>}
                </div>
              ))}
            </div>
          )}
        </div>
        <span className="text-[10px] text-gray-600 flex-shrink-0 whitespace-nowrap mt-0.5">{time}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Chat Tab — global message board visible to all users
   ═══════════════════════════════════════════════════════════════════════════ */

type ChatMsg = {
  id: string;
  userId: string;
  username: string;
  displayName: string | null;
  content: string;
  createdAt: string;
};

function ChatTab() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async (before?: string) => {
    try {
      const url = before
        ? `/api/chat?before=${encodeURIComponent(before)}&limit=50`
        : `/api/chat?limit=50`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      if (before) {
        setMessages((prev) => [...prev, ...data.messages]);
      } else {
        setMessages(data.messages);
      }
      setHasMore(data.hasMore);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  // Poll for new messages every 10s
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/chat?limit=50`);
        if (!res.ok) return;
        const data = await res.json();
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newMsgs = data.messages.filter((m: ChatMsg) => !existingIds.has(m.id));
          if (newMsgs.length === 0) return prev;
          return [...newMsgs, ...prev];
        });
      } catch { /* ignore poll errors */ }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (!loading) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, loading]);

  const sendMessage = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      if (!res.ok) return;
      const msg = await res.json();
      setMessages((prev) => [msg, ...prev]);
      setDraft("");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return <div className="text-gray-500 text-sm py-12 text-center">Loading chat...</div>;
  }

  // Messages are newest-first from API, reverse for display (oldest at top)
  const displayMessages = [...messages].reverse();

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div ref={containerRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {hasMore && (
          <div className="text-center py-2">
            <button
              onClick={() => {
                const oldest = displayMessages[0];
                if (oldest) {
                  setLoadingMore(true);
                  fetchMessages(oldest.createdAt);
                }
              }}
              disabled={loadingMore}
              className="text-xs px-3 py-1.5 rounded border border-gray-700 text-gray-400 hover:bg-gray-900 hover:text-gray-200 transition-colors disabled:opacity-50"
            >
              {loadingMore ? "Loading..." : "Load older messages"}
            </button>
          </div>
        )}

        {displayMessages.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500 text-sm">No messages yet.</div>
            <div className="text-gray-600 text-xs mt-1">Be the first to say something!</div>
          </div>
        )}

        {displayMessages.map((msg) => (
          <ChatBubble key={msg.id} msg={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-800 px-3 py-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            maxLength={500}
            className="flex-1 bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-800 transition-colors"
          />
          <button
            onClick={sendMessage}
            disabled={!draft.trim() || sending}
            className="px-3 py-2 rounded-md bg-amber-900/50 border border-amber-800 text-amber-300 text-sm hover:bg-amber-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {sending ? "..." : "Send"}
          </button>
        </div>
        <div className="text-[10px] text-gray-600 mt-1 px-1">
          {draft.length}/500 — Enter to send
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ msg }: { msg: ChatMsg }) {
  const name = msg.displayName ?? msg.username;
  const time = new Date(msg.createdAt);
  const timeStr = time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const dateStr = time.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const now = new Date();
  const isToday =
    time.getFullYear() === now.getFullYear() &&
    time.getMonth() === now.getMonth() &&
    time.getDate() === now.getDate();

  return (
    <div className="px-2 py-1.5 rounded hover:bg-gray-900/40 transition-colors group">
      <div className="flex items-baseline gap-2">
        <span className="text-xs font-medium text-amber-300">{name}</span>
        <span className="text-[10px] text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
          {isToday ? timeStr : `${dateStr} ${timeStr}`}
        </span>
      </div>
      <div className="text-sm text-gray-300 break-words">{msg.content}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Toggle Button — shown in the layout, top-right corner
   More prominent styling with amber accent + notification badges
   ═══════════════════════════════════════════════════════════════════════════ */

export function PanelToggleButton({
  onClick,
  unreadActivity,
  unreadChat,
}: {
  onClick: () => void;
  unreadActivity: number;
  unreadChat: number;
}) {
  const totalUnread = unreadActivity + unreadChat;

  return (
    <button
      onClick={onClick}
      className="fixed top-4 right-4 z-20 flex items-center gap-2.5 pl-3 pr-3.5 py-2.5 rounded-xl border border-amber-800/60 bg-gray-950/95 backdrop-blur-sm text-amber-300 hover:text-amber-200 hover:border-amber-700 hover:bg-gray-900/95 transition-all shadow-lg shadow-black/40 group"
      aria-label="Open panel"
    >
      {/* Icon */}
      <div className="relative">
        <svg
          width="18"
          height="18"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="group-hover:scale-110 transition-transform"
        >
          <polyline points="1,8 4,8 6,3 8,13 10,6 12,8 15,8" />
        </svg>
        {/* Combined red badge on the icon */}
        {totalUnread > 0 && (
          <span className="absolute -top-2 -right-2.5 min-w-[16px] h-[16px] flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold px-0.5 leading-none animate-pulse">
            {totalUnread > 99 ? "99+" : totalUnread}
          </span>
        )}
      </div>

      {/* Label */}
      <span className="text-xs font-medium tracking-wide">Activity & Chat</span>
    </button>
  );
}
