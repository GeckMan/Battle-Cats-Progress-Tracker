"use client";

/**
 * NervDashboard — NERV Operations Console variant of the dashboard.
 * Renders dense metrics grid with phosphor-green values, NERV panel headers,
 * 3px glowing progress bars, and compressed serif headings.
 *
 * The parent server component passes pre-computed data as props.
 */

type MetricRow = { label: string; pct: number; sub?: string };
type StatRow = { title: string; pct: number; sub?: string; highlight?: boolean };

interface NervDashboardProps {
  overall: number;
  stats: StatRow[];
  storyRows: MetricRow[];
  legendRows: MetricRow[];
  medalCategoryRows: MetricRow[];
  milestoneCategoryRows: MetricRow[];
  medalSummary: string;
  milestoneSummary: string;
}

export default function NervDashboard({
  overall,
  stats,
  storyRows,
  legendRows,
  medalCategoryRows,
  milestoneCategoryRows,
  medalSummary,
  milestoneSummary,
}: NervDashboardProps) {
  return (
    <div style={{ padding: "12px", paddingTop: "48px", display: "flex", flexDirection: "column", gap: "2px", width: "100%" }}>
      {/* Page title */}
      <h1 style={{ marginBottom: "8px" }}>Operations Console</h1>

      {/* ── Metrics Grid — 2×3 dense cells ─────────────────────────── */}
      <div className="nerv-panel">
        <div className="nerv-panel-header">
          <span>System Status — Overview</span>
          <span className="tag"><span className="led green" />All Systems Nominal</span>
        </div>
        <div className="nerv-metrics-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {stats.map((s) => (
            <div key={s.title} className={`nerv-metric-cell ${s.highlight ? "highlight" : ""}`}>
              <div className="m-label">{s.title}</div>
              <div className="m-value">{s.pct}%</div>
              {s.sub && <div className="m-sub">{s.sub}</div>}
              <div className="nerv-progress" style={{ marginTop: "4px" }}>
                <div className="fill" style={{ width: `${s.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Story + Legend side by side ─────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px" }}>
        <NervDataPanel title="Story Chapters" tag={`${storyRows.length} CHAPTERS`} rows={storyRows} />
        <NervDataPanel title="Legend Stages" tag={`${legendRows.length} SAGAS`} rows={legendRows} />
      </div>

      {/* ── Medals + Milestones side by side ────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px" }}>
        <NervDataPanel title={`Meow Medals`} tag={medalSummary} rows={medalCategoryRows} />
        <NervDataPanel title={`Milestone Stages`} tag={milestoneSummary} rows={milestoneCategoryRows} />
      </div>

      {/* Status bar */}
      <div className="nerv-status-bar" style={{ marginTop: "4px" }}>
        <span>DATA:LIVE</span>
        <span>SYNC:OK</span>
        <span>{new Date().toISOString().slice(0, 10)}</span>
      </div>
    </div>
  );
}

/* ── NERV Data Panel with rows ─────────────────────────────────────────── */

function NervDataPanel({
  title,
  tag,
  rows,
}: {
  title: string;
  tag: string;
  rows: MetricRow[];
}) {
  return (
    <div className="nerv-panel" style={{ height: "100%" }}>
      <div className="nerv-panel-header">
        <span>{title}</span>
        <span className="tag">{tag}</span>
      </div>
      <div className="nerv-panel-body">
        {rows.map((r) => (
          <div key={r.label} className="nerv-data-row">
            <span className="lbl" style={{ width: "35%", flexShrink: 0 }}>{r.label}</span>
            <span style={{ flex: 1 }}>
              <div className="nerv-progress">
                <div className="fill" style={{ width: `${r.pct}%` }} />
              </div>
            </span>
            <span className="val" style={{ width: "50px" }}>
              {r.sub ?? `${r.pct}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
