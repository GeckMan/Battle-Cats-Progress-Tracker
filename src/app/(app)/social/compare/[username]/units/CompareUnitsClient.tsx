"use client";

import { useState } from "react";
import Link from "next/link";
import { UNIT_CATEGORY_META } from "@/lib/unit-catalog";
import type { CompareUnit } from "./page";

/* ── Constants ──────────────────────────────────────────────────────────── */

const RARITY_ORDER = [
  "NORMAL", "SPECIAL", "RARE", "SUPER_RARE", "UBER_RARE", "LEGEND_RARE",
] as const;

const FORM_LABEL: Record<number, string> = {
  0: "—", 1: "F1", 2: "F2", 3: "TF", 4: "UF",
};

const FORM_BADGE: Record<number, string> = {
  0: "bg-gray-800 border-gray-700 text-gray-500",
  1: "bg-yellow-950/70 border-yellow-700/60 text-yellow-300",
  2: "bg-red-950/70 border-red-700/60 text-red-300",
  3: "bg-gray-900 border-gray-400 text-gray-100",
  4: "bg-purple-950/70 border-purple-500/60 text-purple-200",
};

const FORM_LETTER = ["f", "c", "s", "u"] as const;

function spriteUrl(unitNumber: number, formIndex: number) {
  const letter = FORM_LETTER[formIndex] ?? "f";
  return `/api/sprite?u=${unitNumber}&f=${letter}`;
}

type Tab = "missing" | "ahead" | "behind" | "all";

const TABS: { key: Tab; label: string; desc: string }[] = [
  { key: "missing", label: "They Have, You Don't", desc: "Units your friend has obtained that you haven't" },
  { key: "behind",  label: "They're Ahead",        desc: "Units you both have but they have a higher form" },
  { key: "ahead",   label: "You're Ahead",         desc: "Units you both have but you have a higher form" },
  { key: "all",     label: "All Units",            desc: "Every unit side-by-side" },
];

/* ── Component ──────────────────────────────────────────────────────────── */

export default function CompareUnitsClient({
  units,
  myLabel,
  theirLabel,
  friendUsername,
}: {
  units: CompareUnit[];
  myLabel: string;
  theirLabel: string;
  friendUsername: string;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("missing");
  const [rarityFilter, setRarityFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hideCollab, setHideCollab] = useState(false);

  /* ── Compute categories ── */
  const missing     = units.filter((u) => u.theirForm > 0 && u.myForm === 0);
  const youDontHave = units.filter((u) => u.myForm > 0 && u.theirForm === 0);
  const theyAhead   = units.filter((u) => u.myForm > 0 && u.theirForm > u.myForm);
  const youAhead    = units.filter((u) => u.theirForm > 0 && u.myForm > u.theirForm);
  const same        = units.filter((u) => u.myForm > 0 && u.theirForm > 0 && u.myForm === u.theirForm);

  /* ── Filter the active tab's units ── */
  let tabUnits: CompareUnit[];
  switch (activeTab) {
    case "missing": tabUnits = missing; break;
    case "behind":  tabUnits = theyAhead; break;
    case "ahead":   tabUnits = youAhead; break;
    case "all":     tabUnits = units; break;
  }

  if (rarityFilter) {
    tabUnits = tabUnits.filter((u) => u.category === rarityFilter);
  }
  if (hideCollab) {
    tabUnits = tabUnits.filter((u) => !u.isCollab);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    tabUnits = tabUnits.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        (u.evolvedName?.toLowerCase().includes(q) ?? false) ||
        (u.trueName?.toLowerCase().includes(q) ?? false) ||
        (u.ultraName?.toLowerCase().includes(q) ?? false) ||
        String(u.unitNumber).includes(searchQuery)
    );
  }

  /* ── Group by rarity for rendering ── */
  const grouped = RARITY_ORDER.reduce<Record<string, CompareUnit[]>>((acc, r) => {
    const rUnits = tabUnits.filter((u) => u.category === r);
    if (rUnits.length > 0) acc[r] = rUnits;
    return acc;
  }, {});

  return (
    <div className="p-4 pt-16 md:p-8 space-y-6 w-full">

      {/* Header */}
      <div>
        <Link
          href={`/social/compare/${encodeURIComponent(friendUsername)}`}
          className="text-xs text-amber-600 hover:text-amber-400 transition-colors mb-2 inline-block"
        >
          ← Back to Compare
        </Link>
        <h1 className="text-2xl font-semibold text-gray-100">
          Unit Comparison
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {myLabel} <span className="text-gray-700">vs</span> {theirLabel}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        <SummaryCard
          label="They have, you don't"
          count={missing.length}
          color="border-blue-900 text-blue-400"
          active={activeTab === "missing"}
          onClick={() => setActiveTab("missing")}
        />
        <SummaryCard
          label="You have, they don't"
          count={youDontHave.length}
          color="border-amber-900 text-amber-400"
        />
        <SummaryCard
          label="They're ahead"
          count={theyAhead.length}
          color="border-blue-900 text-blue-400"
          active={activeTab === "behind"}
          onClick={() => setActiveTab("behind")}
        />
        <SummaryCard
          label="You're ahead"
          count={youAhead.length}
          color="border-amber-900 text-amber-400"
          active={activeTab === "ahead"}
          onClick={() => setActiveTab("ahead")}
        />
        <SummaryCard
          label="Same form"
          count={same.length}
          color="border-gray-700 text-gray-400"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap border-b border-gray-800 pb-3">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key)}
            title={t.desc}
            className={`px-3 py-1.5 text-sm rounded transition-colors
              ${activeTab === t.key
                ? "bg-amber-950/50 border border-amber-800 text-amber-300"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-900 border border-transparent"
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <input
          type="text"
          placeholder="Search by name or #…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-0 max-w-xs px-3 py-1.5 rounded border border-gray-700 bg-gray-900 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-700"
        />

        <select
          value={rarityFilter}
          onChange={(e) => setRarityFilter(e.target.value)}
          className="px-2 py-1.5 rounded border border-gray-700 bg-gray-900 text-xs text-gray-200 focus:outline-none focus:border-amber-700"
        >
          <option value="">All Rarities</option>
          {RARITY_ORDER.map((r) => (
            <option key={r} value={r}>
              {UNIT_CATEGORY_META[r]?.label ?? r}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setHideCollab((v) => !v)}
          className={`flex items-center gap-2 px-2 py-1.5 rounded border text-xs transition-colors ${
            hideCollab
              ? "bg-amber-950/50 border-amber-700 text-amber-300"
              : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200"
          }`}
        >
          <span>{hideCollab ? "✓" : ""} Hide Collab</span>
        </button>

        <span className="text-xs text-gray-600 ml-auto">
          {tabUnits.length} units
        </span>
      </div>

      {/* Unit list */}
      {tabUnits.length === 0 ? (
        <div className="text-sm text-gray-500 py-8 text-center">
          {searchQuery
            ? "No units match your search."
            : activeTab === "missing"
              ? `${theirLabel} doesn't have any units you're missing — nice!`
              : activeTab === "ahead"
                ? "You're not ahead on any units."
                : activeTab === "behind"
                  ? `${theirLabel} isn't ahead on any units.`
                  : "No units found."}
        </div>
      ) : (
        <div className="space-y-6">
          {RARITY_ORDER.filter((r) => grouped[r]).map((rarity) => (
            <RarityGroup
              key={rarity}
              rarity={rarity}
              units={grouped[rarity]}
              myLabel={myLabel}
              theirLabel={theirLabel}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────── */

function SummaryCard({
  label,
  count,
  color,
  active,
  onClick,
}: {
  label: string;
  count: number;
  color: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`border rounded-lg p-3 bg-black text-left transition-colors
        ${active ? "ring-1 ring-amber-500/50 border-amber-800" : color}
        ${onClick ? "cursor-pointer hover:brightness-110" : "cursor-default"}
      `}
    >
      <div className="text-2xl font-bold text-gray-100">{count}</div>
      <div className="text-[11px] text-gray-500 leading-tight mt-0.5">{label}</div>
    </button>
  );
}

const RARITY_ACCENT: Record<string, string> = {
  NORMAL:      "border-gray-600 text-gray-300 bg-gray-900/60",
  SPECIAL:     "border-blue-800 text-blue-300 bg-blue-950/30",
  RARE:        "border-green-800 text-green-300 bg-green-950/30",
  SUPER_RARE:  "border-amber-700 text-amber-300 bg-amber-950/30",
  UBER_RARE:   "border-orange-700 text-orange-300 bg-orange-950/30",
  LEGEND_RARE: "border-red-700 text-red-300 bg-red-950/30",
};

function RarityGroup({
  rarity,
  units,
  myLabel,
  theirLabel,
}: {
  rarity: string;
  units: CompareUnit[];
  myLabel: string;
  theirLabel: string;
}) {
  const [open, setOpen] = useState(true);
  const label = UNIT_CATEGORY_META[rarity]?.label ?? rarity;
  const accent = RARITY_ACCENT[rarity] ?? "border-gray-600 text-gray-300 bg-gray-900/60";

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between rounded-md border px-3 py-2 cursor-pointer transition-colors hover:brightness-110 ${accent}`}
      >
        <div className="flex items-center gap-3">
          <span className={`text-xs transition-transform ${open ? "rotate-90" : ""}`}>&#9654;</span>
          <span className="text-sm font-semibold">{label}</span>
          <span className="text-xs opacity-60">{units.length} units</span>
        </div>
      </button>

      {open && (
        <div className="border border-gray-800 rounded-lg bg-black overflow-hidden">
          {/* Column header */}
          <div className="grid grid-cols-12 gap-2 px-3 py-2 border-b border-gray-800 bg-gray-950 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-1"></div>
            <div className="col-span-4">Unit</div>
            <div className="col-span-3 text-center truncate">{myLabel}</div>
            <div className="col-span-1 text-center text-gray-700"></div>
            <div className="col-span-3 text-center truncate">{theirLabel}</div>
          </div>

          <div className="divide-y divide-gray-900">
            {units.map((u) => (
              <CompareRow key={u.id} unit={u} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CompareRow({ unit: u }: { unit: CompareUnit }) {
  const iAhead = u.myForm > u.theirForm;
  const theyAhead = u.theirForm > u.myForm;
  const myDisplayForm = Math.max(0, u.myForm - 1);
  const theirDisplayForm = Math.max(0, u.theirForm - 1);

  return (
    <div
      className={`grid grid-cols-12 gap-2 px-3 py-2 items-center text-sm transition-colors
        ${iAhead     ? "bg-amber-950/10 hover:bg-amber-950/20" :
          theyAhead  ? "bg-blue-950/10 hover:bg-blue-950/20"   :
                       "hover:bg-gray-950"}`}
    >
      {/* Sprite */}
      <div className="col-span-1 flex items-center justify-center">
        <img
          src={spriteUrl(u.unitNumber, Math.max(myDisplayForm, theirDisplayForm))}
          alt=""
          width={32}
          height={32}
          loading="lazy"
          className={`w-8 h-8 object-contain pixelated ${u.myForm === 0 && u.theirForm === 0 ? "opacity-30 grayscale" : ""}`}
          onError={(e) => { e.currentTarget.style.opacity = "0"; }}
        />
      </div>

      {/* Name */}
      <div className="col-span-4">
        <div className="text-sm text-gray-200 truncate">{u.name}</div>
        <div className="text-[10px] text-gray-600">#{u.unitNumber}</div>
      </div>

      {/* My form */}
      <div className="col-span-3 flex justify-center">
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${FORM_BADGE[u.myForm]}`}>
          {FORM_LABEL[u.myForm]}
        </span>
      </div>

      {/* Delta */}
      <div className="col-span-1 flex items-center justify-center">
        {iAhead && (
          <span className="text-xs text-amber-500 font-semibold">
            +{u.myForm - u.theirForm}
          </span>
        )}
        {theyAhead && (
          <span className="text-xs text-blue-400 font-semibold">
            -{u.theirForm - u.myForm}
          </span>
        )}
        {!iAhead && !theyAhead && u.myForm > 0 && (
          <span className="text-xs text-gray-700">=</span>
        )}
      </div>

      {/* Their form */}
      <div className="col-span-3 flex justify-center">
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${FORM_BADGE[u.theirForm]}`}>
          {FORM_LABEL[u.theirForm]}
        </span>
      </div>
    </div>
  );
}
