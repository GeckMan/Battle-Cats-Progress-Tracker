"use client";

import { useEffect, useState } from "react";
import Link from "next/link";


type UserLite = { id: string; username: string; displayName: string | null };

type IncomingReq = { id: string; from: UserLite };
type OutgoingReq = { id: string; to: UserLite };
type FriendRow = { id: string; user: UserLite };

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

  useEffect(() => {
    refresh();
  }, []);

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
    <div className="space-y-8">
      <div className="border border-gray-700 rounded-lg p-4 bg-black space-y-3">
        <div className="text-gray-100 font-semibold">Find users</div>
        <div className="flex gap-2">
          <input
            className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-100"
            placeholder="Search by username"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="px-3 py-2 rounded border border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-100"
            onClick={search}
            disabled={!query.trim()}
          >
            Search
          </button>
        </div>

        {results.length > 0 && (
          <div className="space-y-2">
            {results
              .filter((u) => u.id !== userId)
              .map((u) => (
                <div key={u.id} className="flex items-center justify-between">
                  <div className="text-gray-200">
                    {u.displayName ?? u.username} <span className="text-gray-500">@{u.username}</span>
                  </div>
                  <button
                    className="text-sm px-2 py-1 rounded border border-gray-700 bg-gray-800 hover:bg-gray-700"
                    onClick={() => sendRequest(u.id)}
                  >
                    Add
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border border-gray-700 rounded-lg p-4 bg-black">
          <div className="text-gray-100 font-semibold">Incoming requests</div>
          <div className="mt-3 space-y-2">
            {loading ? (
              <div className="text-sm text-gray-500">Loading…</div>
            ) : incoming.length === 0 ? (
              <div className="text-sm text-gray-500">None</div>
            ) : (
              incoming.map((r) => (
                <div key={r.id} className="flex items-center justify-between">
                  <div className="text-gray-200">
                    {r.from.displayName ?? r.from.username}{" "}
                    <span className="text-gray-500">@{r.from.username}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="text-sm px-2 py-1 rounded border border-gray-700 bg-gray-800 hover:bg-gray-700"
                      onClick={() => respond(r.id, "accept")}
                    >
                      Accept
                    </button>
                    <button
                      className="text-sm px-2 py-1 rounded border border-gray-700 bg-gray-900 hover:bg-gray-800"
                      onClick={() => respond(r.id, "reject")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border border-gray-700 rounded-lg p-4 bg-black">
          <div className="text-gray-100 font-semibold">Outgoing requests</div>
          <div className="mt-3 space-y-2">
            {loading ? (
              <div className="text-sm text-gray-500">Loading…</div>
            ) : outgoing.length === 0 ? (
              <div className="text-sm text-gray-500">None</div>
            ) : (
              outgoing.map((r) => (
                <div key={r.id} className="flex items-center justify-between">
                  <div className="text-gray-200">
                    {r.to.displayName ?? r.to.username}{" "}
                    <span className="text-gray-500">@{r.to.username}</span>
                  </div>
                  <div className="text-xs text-gray-500">Pending</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="border border-gray-700 rounded-lg p-4 bg-black">
        <div className="text-gray-100 font-semibold">Friends</div>
        <div className="mt-3 space-y-2">
          {loading ? (
            <div className="text-sm text-gray-500">Loading…</div>
          ) : friends.length === 0 ? (
            <div className="text-sm text-gray-500">No friends yet</div>
          ) : (
            friends.map((f) => (
  <div key={f.id} className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Link
        className="text-gray-200 hover:underline"
        href={`/social/${encodeURIComponent(f.user.username)}`}
      >
        {f.user.displayName ?? f.user.username}{" "}
        <span className="text-gray-500">@{f.user.username}</span>
      </Link>

      <Link
        className="text-xs text-gray-300 underline hover:text-gray-100"
        href={`/social/compare/${encodeURIComponent(f.user.username)}`}
      >
        Compare
      </Link>
    </div>

    <div className="text-xs text-gray-500">Friend</div>
  </div>
))

          )}
        </div>
      </div>
    </div>
  );
}
