"use client";

import { useState, lazy, Suspense } from "react";

const BattleCatPlayground = lazy(() => import("@/components/BattleCatPlayground"));

export default function AboutClient() {
  const [unleashed, setUnleashed] = useState(false);

  return (
    <section className="space-y-4">
      {!unleashed ? (
        <button
          type="button"
          onClick={() => setUnleashed(true)}
          className="w-full py-3 px-4 rounded-lg border border-dashed border-gray-700 bg-gray-950 text-sm text-gray-500 hover:text-amber-400 hover:border-amber-800 transition-colors group"
        >
          <span className="group-hover:hidden">. . .</span>
          <span className="hidden group-hover:inline">Unleash the Cat</span>
        </button>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600 uppercase tracking-wide">
              Drag the cat around. Throw it. Watch the text flow.
            </p>
            <button
              type="button"
              onClick={() => setUnleashed(false)}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Close
            </button>
          </div>
          <Suspense
            fallback={
              <div className="w-full h-[500px] rounded-lg border border-gray-700 bg-gray-950 flex items-center justify-center">
                <span className="text-gray-600 text-sm">Loading playground...</span>
              </div>
            }
          >
            <BattleCatPlayground />
          </Suspense>
        </div>
      )}
    </section>
  );
}
