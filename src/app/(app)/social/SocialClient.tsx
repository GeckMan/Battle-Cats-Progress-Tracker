"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type UserLite = { id: string; username: string; displayName: string | null };
type IncomingReq = { id: string; from: UserLite };
type OutgoingReq = { id: string; to: UserLite };
type FriendRow = { id: string; user: UserLite };

function UserAvatar({ name }: { name: string }) {
  const initials = name.slice(0, 2).toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-amber-950 border border-amber-800 flex items-center justify-center flex-shrink-0">
      <span className="text-xs font-semibold text-amber-300">{initials}</span>
    </div>
  );
}

export default function SocialClient({ userId }: { userId: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserLite[]>([]);
  const [incoming, setIncoming] = useState<IncomingReq[]>([]);
  const [outgoing, setOutgoing] = useState<OutgoingReq[]>([]);
  const [friends, setFriends] = useState<FriendRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    const res = await fetch("/api/social/summary");
    const data = await res.json();
    setIncoming(data.incoming);
    setOutgoing(data.outgoing);
    setFriends(data.friends);
    setLoading(false);
  }

  useEffect(() => { refresh(); }, []);

  async function search() {
    const res = await fetch(`/api/social/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data.users ?? []);
  }

  async function sendRequest(toUserId: string) {
    await fetch("/api/social/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toUserId }),
    });
    setQuery("");
    setResults([]);
    await refresh();
  }

  async function respond(requestId: string, action: "accept" | "reject") {
    await fetch("/api/social/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, action }),
    });
    await refresh();
  }

  return (
    <div className="space-y-4">

      {/* Search */}
      <div className="border border-gray-700 rounded-lg p-4 bg-black space-y-3">
        <div className="text-sm font-semibold text-gray-300">Find users</div>
        <div className="flex gap-2">
          <input
            className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-100 text-sm placeholder-gray-600 focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-800 transition-colors"
            placeholder="Search by username…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && query.trim() && search()}
          />
          <button
            className="px-4 py-2 rounded border border-amber-800 bg-amber-950/30 text-amber-300 text-sm hover:bg-amber-950/60 disabled:opacity-40 transition-colors"
            onClick={search}
            disabled={!query.trim()}
          >
            Search
          </button>
        </div>

        {results.length > 0 && (
          <div className="border-t border-gray-800 pt-3 space-y-2">
            {results
              .filter((u) => u.id !== userId)
              .map((u) => (
                <div key={u.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <UserAvatar name={u.displayName ?? u.username} />
                    <div>
                      <span className="text-sm text-gray-200">{u.displayName ?? u.username}</span>
                      <span className="text-xs text-gray-500 ml-1.5">@{u.username}</span>
                    </div>
                  </div>
                  <button
                    className="text-xs px-2.5 py-1 rounded border border-amber-800 bg-amber-950/30 text-amber-300 hover:bg-amber-950/60 transition-colors"
                    onClick={() => sendRequest(u.id)}
                  >
                    + Add friend
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Requests row */}
      <div className="grid gap-4 md:grid-cols-2">

        {/* Incoming */}
        <div className="border border-gray-700 rounded-lg p-4 bg-black">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-gray-300">Incoming requests</span>
            {!loading && incoming.length > 0 && (
              <span className="text-xs bg-amber-500 text-black font-bold rounded-full px-1.5 py-0.5 leading-none">
                {incoming.length}
              </span>
            )}
          </div>
          <div className="space-y-2">
            {loading ? (
              <div className="text-sm text-gray-600">Loading…</div>
            ) : incoming.length === 0 ? (
              <div className="text-sm text-gray-600">No pending requests</div>
            ) : (
              incoming.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 py-1">
                  <div className="flex items-center gap-2.5">
                    <UserAvatar name={r.from.displayName ?? r.from.username} />
                    <div>
                      <span className="text-sm text-gray-200">{r.from.displayName ?? r.from.username}</span>
                      <span className="text-xs text-gray-500 ml-1.5">@{r.from.username}</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      className="text-xs px-2.5 py-1 rounded border border-amber-800 bg-amber-950/30 text-amber-300 hover:bg-amber-950/60 transition-colors"
                      onClick={() => respond(r.id, "accept")}
                    >
                      Accept
                    </button>
                    <button
                      className="text-xs px-2.5 py-1 rounded border border-gray-700 bg-gray-900 text-gray-400 hover:bg-gray-800 transition-colors"
                      onClick={() => respond(r.id, "reject")}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Outgoing */}
        <div className="border border-gray-700 rounded-lg p-4 bg-black">
          <div className="text-sm font-semibold text-gray-300 mb-3">Outgoing requests</div>
          <div className="space-y-2">
            {loading ? (
              <div className="text-sm text-gray-600">Loading…</div>
            ) : outgoing.length === 0 ? (
              <div className="text-sm text-gray-600">None sent</div>
            ) : (
              outgoing.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 py-1">
                  <div className="flex items-center gap-2.5">
                    <UserAvatar name={r.to.displayName ?? r.to.username} />
                    <div>
                      <span className="text-sm text-gray-200">{r.to.displayName ?? r.to.username}</span>
                      <span className="text-xs text-gray-500 ml-1.5">@{r.to.username}</span>
                    </div>
                  </div>
                  <span className="text-xs border border-amber-900 text-amber-600 rounded-full px-2 py-0.5">
                    Pending
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Friends list */}
      <div className="border border-gray-700 rounded-lg p-4 bg-black">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-semibold text-gray-300">Friends</span>
          {!loading && friends.length > 0 && (
            <span className="text-xs text-gray-500">{friends.length}</span>
          )}
        </div>
        <div className="space-y-1">
          {loading ? (
            <div className="text-sm text-gray-600">Loading…</div>
          ) : friends.length === 0 ? (
            <div className="text-sm text-gray-600">No friends yet — search for someone above</div>
          ) : (
            friends.map((f) => (
              <div key={f.id} className="flex items-center justify-between gap-3 px-2 py-2 rounded hover:bg-gray-900 transition-colors">
                <div className="flex items-center gap-2.5">
                  <UserAvatar name={f.user.displayName ?? f.user.username} />
                  <Link
                    href={`/social/${encodeURIComponent(f.user.username)}`}
                    className="text-sm text-gray-200 hover:text-amber-300 transition-colors"
                  >
                    {f.user.displayName ?? f.user.username}
                    <span className="text-gray-500 ml-1.5">@{f.user.username}</span>
                  </Link>
                </div>
                <Link
                  href={`/social/compare/${encodeURIComponent(f.user.username)}`}
                  className="text-xs px-2.5 py-1 rounded border border-gray-700 text-gray-400 hover:border-amber-800 hover:text-amber-300 transition-colors"
                >
                  Compare →
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
