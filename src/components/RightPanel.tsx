"use client";

import { useEffect, useState, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   RightPanel — sliding drawer on the right edge with Activity + Chat tabs
   ═══════════════════════════════════════════════════════════════════════════ */

type Tab = "activity" | "chat" | "admin";

export default function RightPanel({
  open,
  onClose,
  activeTab,
  onTabChange,
  unreadActivity,
  unreadChat,
  currentUserId,
  currentUserRole,
}: {
  open: boolean;
  onClose: () => void;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  unreadActivity: number;
  unreadChat: number;
  currentUserId: string;
  currentUserRole: string;
}) {
  const isAdmin = currentUserRole === "ADMIN";

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
            {isAdmin && (
              <TabButton
                active={activeTab === "admin"}
                onClick={() => onTabChange("admin")}
              >
                Admin
              </TabButton>
            )}
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
          {activeTab === "activity" && <ActivityTab />}
          {activeTab === "chat" && <ChatTab currentUserId={currentUserId} />}
          {activeTab === "admin" && isAdmin && <AdminTab />}
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
  role: string;
  content: string;
  createdAt: string;
};

function ChatTab({ currentUserId }: { currentUserId: string }) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [mutedUntil, setMutedUntil] = useState<string | null>(null);
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
      if (data.isMuted !== undefined) {
        setIsMuted(data.isMuted);
        setMutedUntil(data.mutedUntil);
      }
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
    if (!text || sending || isMuted) return;
    setSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      if (res.status === 403) {
        const err = await res.json();
        setIsMuted(true);
        setMutedUntil(err.mutedUntil ?? null);
        return;
      }
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
          <ChatBubble key={msg.id} msg={msg} isMe={msg.userId === currentUserId} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-800 px-3 py-3">
        {isMuted && (
          <div className="mb-2 px-3 py-2 rounded-md bg-red-950/30 border border-red-800/50 text-xs text-red-300">
            You are muted{mutedUntil ? ` until ${new Date(mutedUntil).toLocaleString()}` : ""}.
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isMuted ? "You are muted..." : "Type a message..."}
            maxLength={500}
            disabled={isMuted}
            className="flex-1 bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          />
          <button
            onClick={sendMessage}
            disabled={!draft.trim() || sending || isMuted}
            className="px-3 py-2 rounded-md bg-amber-900/50 border border-amber-800 text-amber-300 text-sm hover:bg-amber-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {sending ? "..." : "Send"}
          </button>
        </div>
        {!isMuted && (
          <div className="text-[10px] text-gray-600 mt-1 px-1">
            {draft.length}/500 — Enter to send
          </div>
        )}
      </div>
    </div>
  );
}

function ChatBubble({ msg, isMe }: { msg: ChatMsg; isMe: boolean }) {
  const name = msg.displayName ?? msg.username;
  const isAdmin = msg.role === "ADMIN";
  const time = new Date(msg.createdAt);
  const timeStr = time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const dateStr = time.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const now = new Date();
  const isToday =
    time.getFullYear() === now.getFullYear() &&
    time.getMonth() === now.getMonth() &&
    time.getDate() === now.getDate();

  return (
    <div className={`px-2 py-1.5 rounded transition-colors group ${
      isMe ? "bg-amber-950/20 border-l-2 border-amber-700" : "hover:bg-gray-900/40"
    }`}>
      <div className="flex items-baseline gap-2">
        <span className={`text-xs font-medium ${isMe ? "text-amber-200" : "text-amber-300"}`}>
          {name}
          {isMe && <span className="text-amber-600 ml-1">(you)</span>}
        </span>
        {isAdmin && (
          <span className="text-[9px] font-bold bg-red-500/20 border border-red-700/50 text-red-300 rounded px-1 py-px leading-none">
            Admin
          </span>
        )}
        <span className="text-[10px] text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
          {isToday ? timeStr : `${dateStr} ${timeStr}`}
        </span>
      </div>
      <div className="text-sm text-gray-300 break-words">{msg.content}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Admin Tab — user management for admins (mute, delete)
   ═══════════════════════════════════════════════════════════════════════════ */

type AdminUser = {
  id: string;
  username: string;
  displayName: string | null;
  role: string;
  chatMutedUntil: string | null;
  isMuted: boolean;
  createdAt: string;
};

function AdminTab() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleteInput, setDeleteInput] = useState("");
  const [muteMenu, setMuteMenu] = useState<string | null>(null);
  const [confirmRole, setConfirmRole] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) return;
      const data = await res.json();
      setUsers(data.users);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Auto-clear feedback
  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(t);
  }, [feedback]);

  const handleMute = async (userId: string, minutes: number | null) => {
    setActionLoading(userId);
    setMuteMenu(null);
    try {
      const body = minutes === null
        ? { userId, unmute: true }
        : { userId, minutes };
      const res = await fetch("/api/admin/mute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        setFeedback({ msg: err.error ?? "Failed to mute user", type: "err" });
        return;
      }
      const data = await res.json();
      setFeedback({ msg: data.message ?? "Done", type: "ok" });
      fetchUsers();
    } finally {
      setActionLoading(null);
    }
  };

  const handleSetRole = async (userId: string, role: "ADMIN" | "USER") => {
    setActionLoading(userId);
    setConfirmRole(null);
    try {
      const res = await fetch("/api/admin/set-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });
      if (!res.ok) {
        const err = await res.json();
        setFeedback({ msg: err.error ?? "Failed to change role", type: "err" });
        return;
      }
      const data = await res.json();
      setFeedback({ msg: data.message ?? "Done", type: "ok" });
      fetchUsers();
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user || deleteInput !== user.username) return;
    setActionLoading(userId);
    try {
      const res = await fetch("/api/admin/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) {
        const err = await res.json();
        setFeedback({ msg: err.error ?? "Failed to delete user", type: "err" });
        return;
      }
      setFeedback({ msg: `Deleted @${user.username}`, type: "ok" });
      setConfirmDelete(null);
      setDeleteInput("");
      fetchUsers();
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div className="text-gray-500 text-sm py-12 text-center">Loading users...</div>;
  }

  const query = search.toLowerCase().trim();
  const filtered = query
    ? users.filter(
        (u) =>
          u.username.toLowerCase().includes(query) ||
          (u.displayName ?? "").toLowerCase().includes(query)
      )
    : users;

  return (
    <div className="overflow-y-auto h-full px-3 py-3 space-y-2">
      {/* Search bar */}
      <div className="relative">
        <svg
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        >
          <circle cx="7" cy="7" r="5" />
          <line x1="11" y1="11" x2="14.5" y2="14.5" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full bg-gray-900 border border-gray-700 rounded-md pl-8 pr-3 py-1.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-800 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="4" x2="12" y2="12" />
              <line x1="12" y1="4" x2="4" y2="12" />
            </svg>
          </button>
        )}
      </div>

      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">
        {query ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""}` : `User Management (${users.length})`}
      </div>

      {feedback && (
        <div className={`px-3 py-2 rounded-md text-xs border ${
          feedback.type === "ok"
            ? "bg-green-950/30 border-green-800/50 text-green-300"
            : "bg-red-950/30 border-red-800/50 text-red-300"
        }`}>
          {feedback.msg}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-gray-500 text-sm py-6 text-center">
          {query ? `No users matching "${search}"` : "No users found."}
        </div>
      )}

      {filtered.map((user) => {
        const isBeingActioned = actionLoading === user.id;
        const isDeleting = confirmDelete === user.id;
        const isMuting = muteMenu === user.id;
        const isRoleConfirm = confirmRole === user.id;

        return (
          <div
            key={user.id}
            className="rounded-md border border-gray-800 bg-gray-900/50 px-3 py-2.5"
          >
            {/* User info row */}
            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-gray-200 truncate">
                    {user.displayName ?? user.username}
                  </span>
                  <span className="text-[10px] text-gray-500">@{user.username}</span>
                  {user.role === "ADMIN" && (
                    <span className="text-[9px] font-bold bg-red-500/20 border border-red-700/50 text-red-300 rounded px-1 py-px leading-none">
                      Admin
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-gray-600 mt-0.5">
                  Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  {user.isMuted && (
                    <span className="ml-2 text-red-400">
                      Muted until {new Date(user.chatMutedUntil!).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions row */}
            <div className="flex items-center gap-1.5 mt-2">
              {/* Promote / Demote button */}
              {user.role === "ADMIN" ? (
                <button
                  onClick={() => setConfirmRole(isRoleConfirm ? null : user.id)}
                  disabled={isBeingActioned}
                  className="text-[11px] px-2 py-1 rounded border border-gray-600/50 text-gray-400 hover:bg-gray-800/50 transition-colors disabled:opacity-40"
                >
                  Demote
                </button>
              ) : (
                <button
                  onClick={() => setConfirmRole(isRoleConfirm ? null : user.id)}
                  disabled={isBeingActioned}
                  className="text-[11px] px-2 py-1 rounded border border-purple-800/50 text-purple-400 hover:bg-purple-950/30 transition-colors disabled:opacity-40"
                >
                  Promote
                </button>
              )}

              {/* Mute / Unmute (non-admins only) */}
              {user.role !== "ADMIN" && (
                <>
                  {user.isMuted ? (
                    <button
                      onClick={() => handleMute(user.id, null)}
                      disabled={isBeingActioned}
                      className="text-[11px] px-2 py-1 rounded border border-green-800/50 text-green-400 hover:bg-green-950/30 transition-colors disabled:opacity-40"
                    >
                      {isBeingActioned ? "..." : "Unmute"}
                    </button>
                  ) : (
                    <button
                      onClick={() => setMuteMenu(isMuting ? null : user.id)}
                      disabled={isBeingActioned}
                      className="text-[11px] px-2 py-1 rounded border border-amber-800/50 text-amber-400 hover:bg-amber-950/30 transition-colors disabled:opacity-40"
                    >
                      {isBeingActioned ? "..." : "Mute"}
                    </button>
                  )}
                </>
              )}

              {/* Delete (non-admins only) */}
              {user.role !== "ADMIN" && (
                <button
                  onClick={() => {
                    setConfirmDelete(isDeleting ? null : user.id);
                    setDeleteInput("");
                    setMuteMenu(null);
                    setConfirmRole(null);
                  }}
                  disabled={isBeingActioned}
                  className="text-[11px] px-2 py-1 rounded border border-red-800/50 text-red-400 hover:bg-red-950/30 transition-colors disabled:opacity-40"
                >
                  Delete
                </button>
              )}
            </div>

            {/* Role change confirmation */}
            {isRoleConfirm && (
              <div className="mt-2 p-2 rounded border border-purple-800/40 bg-purple-950/20">
                <div className="text-[10px] text-purple-300 mb-1.5">
                  {user.role === "ADMIN"
                    ? `Demote @${user.username} from Admin to User?`
                    : `Promote @${user.username} to Admin? They will have full moderation powers.`}
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleSetRole(user.id, user.role === "ADMIN" ? "USER" : "ADMIN")}
                    disabled={isBeingActioned}
                    className="text-[11px] px-2.5 py-1 rounded bg-purple-900/50 border border-purple-700 text-purple-200 hover:bg-purple-800/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {isBeingActioned ? "..." : "Confirm"}
                  </button>
                  <button
                    onClick={() => setConfirmRole(null)}
                    className="text-[11px] px-2 py-1 rounded text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Mute duration picker */}
            {isMuting && (
              <div className="mt-2 flex flex-wrap gap-1">
                <span className="text-[10px] text-gray-500 w-full mb-0.5">Mute duration:</span>
                {[
                  { label: "1 hour", minutes: 60 },
                  { label: "24 hours", minutes: 1440 },
                  { label: "7 days", minutes: 10080 },
                  { label: "Permanent", minutes: 525600 },
                ].map((opt) => (
                  <button
                    key={opt.minutes}
                    onClick={() => handleMute(user.id, opt.minutes)}
                    className="text-[10px] px-2 py-1 rounded bg-amber-950/30 border border-amber-800/40 text-amber-300 hover:bg-amber-900/40 transition-colors"
                  >
                    {opt.label}
                  </button>
                ))}
                <button
                  onClick={() => setMuteMenu(null)}
                  className="text-[10px] px-2 py-1 rounded text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Delete confirmation */}
            {isDeleting && (
              <div className="mt-2 p-2 rounded border border-red-800/40 bg-red-950/20">
                <div className="text-[10px] text-red-300 mb-1.5">
                  Type <span className="font-mono font-bold">{user.username}</span> to confirm deletion. This cannot be undone.
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={deleteInput}
                    onChange={(e) => setDeleteInput(e.target.value)}
                    placeholder={user.username}
                    className="flex-1 bg-gray-900 border border-red-800/50 rounded px-2 py-1 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-700"
                  />
                  <button
                    onClick={() => handleDelete(user.id)}
                    disabled={deleteInput !== user.username || isBeingActioned}
                    className="text-[11px] px-2.5 py-1 rounded bg-red-900/50 border border-red-700 text-red-200 hover:bg-red-800/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {isBeingActioned ? "..." : "Confirm"}
                  </button>
                  <button
                    onClick={() => { setConfirmDelete(null); setDeleteInput(""); }}
                    className="text-[11px] px-2 py-1 rounded text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
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
      className="fixed top-4 right-4 z-20 flex items-center gap-2.5 pl-2.5 pr-3 py-2 md:pl-3 md:pr-3.5 md:py-2.5 rounded-xl border border-amber-800/60 bg-gray-950/95 backdrop-blur-sm text-amber-300 hover:text-amber-200 hover:border-amber-700 hover:bg-gray-900/95 transition-all shadow-lg shadow-black/40 group"
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
      <span className="text-xs font-medium tracking-wide hidden md:inline">Activity & Chat</span>
    </button>
  );
}
