"use client";

import { useMemo, useState } from "react";

type Row = {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  imageFile?: string | null;
};

export default function MedalsClient({ rows }: { rows: Row[] }) {
  const [data, setData] = useState(rows);
  const [syncing, setSyncing] = useState(false);

  const earnedCount = useMemo(() => data.filter((r) => r.earned).length, [data]);

  async function handleSync() {
    setSyncing(true);
    try {
      const res = await fetch("/api/meow-medals/sync", { method: "POST" });
      if (res.ok) {
        // Refresh medal earned state from server response isn't detailed,
        // so re-fetch the page data via a lightweight approach
        const refreshed = await fetch(window.location.href);
        if (refreshed.ok) {
          // Simplest reliable approach: reload only if sync succeeded
          window.location.reload();
        }
      }
    } finally {
      setSyncing(false);
    }
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-100">Meow Medals</h2>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-400">
            {earnedCount}/{data.length}
          </div>

          <button
            type="button"
            onClick={handleSync}
            disabled={syncing}
            className="text-xs px-3 py-1 rounded border border-gray-700 text-gray-200 hover:bg-gray-900 disabled:opacity-50"
            title="Sync medals from tracked progress (story/zombie/legend as available)"
          >
            {syncing ? "Syncing…" : "Sync"}
          </button>
        </div>
      </div>


      <div
  className="grid gap-2.5"
  style={{ gridTemplateColumns: "repeat(auto-fill, minmax(88px, 1fr))" }}
>

        {data.map((m) => (
          <MedalToken
            key={m.id}
            row={m}
            onToggled={(earned) => {
              setData((prev) =>
                prev.map((x) => (x.id === m.id ? { ...x, earned } : x))
              );
            }}
          />
        ))}
      </div>
    </section>
  );
}

function MedalToken({
  row,
  onToggled,
}: {
  row: Row;
  onToggled: (earned: boolean) => void;
}) {
  // w-24 = 96px — closest valid Tailwind size (w-25 is not in the default scale)
  const base =
    "w-24 h-24 rounded-full border flex items-center justify-center select-none overflow-hidden";

  const locked = "bg-gray-950 border-gray-800 opacity-60";
  const unlocked = "bg-transparent border-gray-700";

  const tip = `${row.name}\n${row.description}`;

  const localSrc = row.imageFile ? `/medals/${row.imageFile}` : null;

  async function toggle() {
    const next = !row.earned;

    // optimistic
    onToggled(next);

    const res = await fetch(`/api/meow-medals/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ earned: next }),
    });

    if (!res.ok) {
      // rollback on failure
      onToggled(!next);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`${base} ${row.earned ? unlocked : locked}`}
      title={tip}
    >
      {localSrc ? (
        <img
  src={localSrc}
  alt={row.name}
  loading="lazy"
  className={
    row.earned
      ? "w-full h-full object-cover pointer-events-none"
      : "w-full h-full object-cover opacity-60 pointer-events-none"
  }
/>


      ) : (
        <span className="text-lg font-semibold">{row.earned ? "★" : "?"}</span>
      )}
    </button>
  );
}
