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
        window.location.reload();
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
            className="text-xs px-3 py-1 rounded border border-amber-700 text-amber-300 hover:bg-amber-900 disabled:opacity-50 transition-colors"
            title="Sync medals from tracked progress (story/zombie/legend as available)"
          >
            {syncing ? "Syncing..." : "Sync"}
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
  const base =
    "w-24 h-24 rounded-full border flex items-center justify-center select-none overflow-hidden transition-all";

  const locked = "bg-gray-950 border-gray-800 opacity-60";
  const unlocked = "bg-transparent border-amber-700 ring-1 ring-amber-900";

  const tip = `${row.name}\n${row.description}`;
  const localSrc = row.imageFile ? `/medals/${row.imageFile}` : null;

  async function toggle() {
    const next = !row.earned;
    onToggled(next);

    const res = await fetch(`/api/meow-medals/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ earned: next }),
    });

    if (!res.ok) {
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
              : "w-full h-full object-cover opacity-40 pointer-events-none grayscale"
          }
        />
      ) : (
        <span className={`text-lg font-semibold ${row.earned ? "text-amber-400" : "text-gray-600"}`}>
          {row.earned ? "★" : "?"}
        </span>
      )}
    </button>
  );
}
