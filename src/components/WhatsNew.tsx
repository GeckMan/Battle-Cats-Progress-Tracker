"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { CURRENT_UPDATE } from "@/lib/whats-new";

type Update = typeof CURRENT_UPDATE;

/** One-time "What's new" dialog. Rendered by the (app) layout only when this user hasn't dismissed `update.id`. */
export default function WhatsNew({ update }: { update: Update }) {
  const [open, setOpen] = useState(true);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function dismiss() {
    setOpen(false);
    fetch("/api/whats-new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: update.id }),
    }).catch(() => {});
  }

  useEffect(() => {
    if (!open) return;
    buttonRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") dismiss(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={dismiss} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="whats-new-title"
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-xl border border-amber-800 bg-gray-950 p-5 sm:p-6 shadow-2xl"
      >
        <h2 id="whats-new-title" className="text-lg font-semibold text-amber-300">{update.title}</h2>
        <p className="mt-2 text-sm text-gray-300">{update.intro}</p>
        <ul className="mt-4 space-y-2.5">
          {update.items.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-200">
              <span className="text-amber-500 flex-shrink-0">&bull;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-gray-400">
          {update.footer}{" "}
          <Link href="/about" onClick={dismiss} className="text-amber-400 hover:underline">Open the changelog</Link>
        </p>
        <div className="mt-5 flex justify-end">
          <button
            ref={buttonRef}
            type="button"
            onClick={dismiss}
            className="rounded-md bg-amber-600 hover:bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
