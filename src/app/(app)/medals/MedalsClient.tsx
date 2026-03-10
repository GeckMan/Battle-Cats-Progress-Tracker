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
  const pct = data.length ? Math.round((earnedCount / data.length) * 100) : 0;

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
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ── Header Panel ──────────────────────────────────────────────────── */}
      <div style={{
        background: "var(--void-warm, #080807)",
        border: "1px solid var(--steel-faint, rgba(200,200,192,0.12))",
        overflow: "hidden",
      }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
          color: "var(--nerv-orange, #FF9830)", padding: "8px 12px 7px",
          borderBottom: "1px solid var(--nerv-orange-dim, #C87020)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontFamily: "var(--font-sys, monospace)",
        }}>
          <span>Meow Medals</span>
          <button
            type="button"
            onClick={handleSync}
            disabled={syncing}
            style={{
              fontSize: 10, fontFamily: "var(--font-sys, monospace)", fontWeight: 500,
              letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 10px",
              border: "1px solid var(--nerv-orange-dim, #C87020)",
              background: "rgba(255,152,48,0.06)", color: "var(--nerv-orange, #FF9830)",
              cursor: syncing ? "wait" : "pointer", opacity: syncing ? 0.5 : 1,
            }}
          >
            {syncing ? "Syncing..." : "Sync"}
          </button>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1,
          background: "var(--steel-faint, rgba(200,200,192,0.12))",
        }}>
          {[
            { label: "Earned", value: `${earnedCount}`, sub: `of ${data.length}` },
            { label: "Completion", value: `${pct}%`, sub: `${data.length} medals total` },
            { label: "Remaining", value: `${data.length - earnedCount}`, sub: "to earn" },
          ].map((m) => (
            <div key={m.label} style={{
              background: "var(--void-warm, #080807)", padding: "12px 14px",
              display: "flex", flexDirection: "column", justifyContent: "center",
            }}>
              <div style={{
                fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
                color: "var(--nerv-orange, #FF9830)", marginBottom: 3,
                fontFamily: "var(--font-sys, monospace)",
              }}>{m.label}</div>
              <div style={{
                fontSize: 22, fontWeight: 700, color: "var(--data-green, #50FF50)",
                fontVariantNumeric: "tabular-nums", textShadow: "0 0 4px rgba(80,255,80,0.3)",
                lineHeight: 1.1, fontFamily: "var(--font-sys, monospace)",
              }}>{m.value}</div>
              <div style={{
                fontSize: 9, color: "var(--steel-dim, #888880)", marginTop: 3,
                letterSpacing: "0.06em", fontFamily: "var(--font-sys, monospace)",
              }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Medal Grid ────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gap: 10,
          gridTemplateColumns: "repeat(auto-fill, minmax(88px, 1fr))",
        }}
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
    </div>
  );
}

function MedalToken({
  row,
  onToggled,
}: {
  row: Row;
  onToggled: (earned: boolean) => void;
}) {
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
      title={tip}
      className="rounded-full"
      style={{
        width: 96,
        height: 96,
        border: row.earned
          ? "1px solid var(--nerv-orange, #FF9830)"
          : "1px solid var(--steel-faint, rgba(200,200,192,0.12))",
        background: row.earned
          ? "rgba(255,152,48,0.06)"
          : "var(--void, #000)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.15s",
        opacity: row.earned ? 1 : 0.6,
        boxShadow: row.earned ? "0 0 6px rgba(255,152,48,0.15)" : "none",
      }}
    >
      {localSrc ? (
        <img
          src={localSrc}
          alt={row.name}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
            filter: row.earned ? "none" : "grayscale(1)",
            opacity: row.earned ? 1 : 0.4,
          }}
        />
      ) : (
        <span style={{
          fontSize: 18,
          fontWeight: 700,
          color: row.earned ? "var(--nerv-orange, #FF9830)" : "var(--steel-dim, #888880)",
        }}>
          {row.earned ? "★" : "?"}
        </span>
      )}
    </button>
  );
}
