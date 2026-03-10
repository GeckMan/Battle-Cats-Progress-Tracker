"use client";

import { useTheme } from "@/lib/theme-context";
import NervDashboard from "./NervDashboard";

/**
 * DashboardShell — Client wrapper that switches between default and NERV layouts.
 * The server component passes all pre-computed data as props.
 */

type MetricRow = { label: string; pct: number; sub?: string };

interface DashboardData {
  overall: number;
  storyOverall: number;
  legendOverall: number;
  medalsOverall: number;
  milestonesOverall: number;
  unitsOverall: number;
  unitObtained: number;
  unitTotal: number;
  storyRows: MetricRow[];
  legendRows: MetricRow[];
  medalCategoryRows: (MetricRow & { category: string; earned: number; total: number })[];
  milestoneCategoryRows: (MetricRow & { cleared: number; total: number })[];
  medalEarned: number;
  medalTotal: number;
  milestoneCleared: number;
  milestoneTotal: number;
}

export default function DashboardShell({ data }: { data: DashboardData }) {
  const { theme } = useTheme();

  if (theme === "nerv") {
    return (
      <NervDashboard
        overall={data.overall}
        stats={[
          { title: "Overall", pct: data.overall, highlight: true },
          { title: "Story", pct: data.storyOverall },
          { title: "Legend", pct: data.legendOverall },
          { title: "Medals", pct: data.medalsOverall },
          { title: "Milestones", pct: data.milestonesOverall },
          { title: "Units", pct: data.unitsOverall, sub: `${data.unitObtained}/${data.unitTotal}` },
        ]}
        storyRows={data.storyRows}
        legendRows={data.legendRows}
        medalCategoryRows={data.medalCategoryRows.map((r) => ({
          label: r.category,
          pct: r.pct,
          sub: `${r.earned}/${r.total}`,
        }))}
        milestoneCategoryRows={data.milestoneCategoryRows.map((r) => ({
          label: r.label,
          pct: r.pct,
          sub: `${r.cleared}/${r.total}`,
        }))}
        medalSummary={`${data.medalEarned}/${data.medalTotal}`}
        milestoneSummary={`${data.milestoneCleared}/${data.milestoneTotal}`}
      />
    );
  }

  // Default theme — render original layout
  return (
    <DefaultDashboard data={data} />
  );
}

/* ── Default Dashboard (moved from server component for client theme detection) ── */

function DefaultDashboard({ data }: { data: DashboardData }) {
  return (
    <div className="p-4 pt-16 md:p-8 space-y-6 w-full">
      <h1 className="text-2xl font-semibold text-gray-100">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 md:gap-3">
        <StatCard title="Overall" pct={data.overall} highlight />
        <StatCard title="Story" pct={data.storyOverall} />
        <StatCard title="Legend" pct={data.legendOverall} />
        <StatCard title="Medals" pct={data.medalsOverall} />
        <StatCard title="Milestones" pct={data.milestonesOverall} />
        <StatCard title="Units" pct={data.unitsOverall} sub={`${data.unitObtained}/${data.unitTotal}`} />
      </div>

      {/* Story + Legend side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section title="Story Chapters">
          <div className="space-y-1.5">
            {data.storyRows.map((r) => (
              <CompactRow key={r.label} label={r.label} pct={r.pct} />
            ))}
          </div>
        </Section>

        <Section title="Legend Stages">
          <div className="space-y-1.5">
            {data.legendRows.map((r) => (
              <CompactRow key={r.label} label={r.label} pct={r.pct} />
            ))}
          </div>
        </Section>
      </div>

      {/* Medals + Milestones side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section title={`Meow Medals — ${data.medalEarned}/${data.medalTotal}`}>
          <div className="space-y-1.5">
            {data.medalCategoryRows.map((r) => (
              <CompactRow key={r.category} label={r.category} pct={r.pct} sub={`${r.earned}/${r.total}`} />
            ))}
          </div>
        </Section>

        <Section title={`Milestone Stages — ${data.milestoneCleared}/${data.milestoneTotal}`}>
          <div className="space-y-1.5">
            {data.milestoneCategoryRows.map((r) => (
              <CompactRow key={r.label} label={r.label} pct={r.pct} sub={`${r.cleared}/${r.total}`} />
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function pctColor(pct: number) {
  if (pct >= 80) return "#fbbf24"; // amber-400
  if (pct >= 40) return "#d97706"; // amber-600
  if (pct > 0)   return "#92400e"; // amber-800
  return "#4b5563"; // gray-600
}

function barFill(pct: number) {
  if (pct >= 80) return "bg-amber-400";
  if (pct >= 40) return "bg-amber-600";
  if (pct > 0)   return "bg-amber-800";
  return "bg-gray-700";
}

function StatCard({ title, pct, highlight = false, sub }: { title: string; pct: number; highlight?: boolean; sub?: string }) {
  return (
    <div className={`border rounded-lg p-3 md:p-4 bg-black ${highlight ? "border-amber-800" : "border-gray-700"}`}>
      <div className="text-xs md:text-sm text-gray-400 mb-1">{title}</div>
      <div className="text-2xl md:text-3xl font-semibold" style={{ color: pctColor(pct) }}>{pct}%</div>
      {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
      <div className="mt-3 h-2 rounded bg-gray-800 overflow-hidden">
        <div className={`h-2 ${barFill(pct)}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-gray-700 rounded-lg p-5 bg-black h-full">
      <h2 className="text-sm font-semibold text-gray-300 mb-3 pb-2 border-b border-gray-800">{title}</h2>
      {children}
    </div>
  );
}

function CompactRow({ label, pct, sub }: { label: string; pct: number; sub?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-[30%] text-sm text-gray-300 truncate flex-shrink-0">{label}</div>
      <div className="flex-1 h-2 rounded bg-gray-800 overflow-hidden">
        <div className={`h-2 ${barFill(pct)}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="w-16 text-right text-sm flex-shrink-0" style={{ color: pctColor(pct) }}>
        {sub ?? `${pct}%`}
      </div>
    </div>
  );
}
