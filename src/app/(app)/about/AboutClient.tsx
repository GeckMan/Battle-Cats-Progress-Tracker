"use client";

import { useState, useRef, lazy, Suspense } from "react";

const BattleCatPlayground = lazy(() => import("@/components/BattleCatPlayground"));

export default function AboutClient({ children }: { children: React.ReactNode }) {
  const [unleashed, setUnleashed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {children}

      {/* Easter egg button — always at the bottom of the About content */}
      <div className="mt-10" data-playground-ui>
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
          <button
            type="button"
            onClick={() => setUnleashed(false)}
            className="w-full py-2 px-4 rounded-lg border border-gray-700 bg-gray-950 text-xs text-gray-500 hover:text-amber-400 hover:border-amber-800 transition-colors"
          >
            Recall the Cat
          </button>
        )}
      </div>

      {/* Canvas overlay — sits on top of the page content */}
      {unleashed && (
        <Suspense fallback={null}>
          <BattleCatPlayground containerRef={containerRef} />
        </Suspense>
      )}
    </div>
  );
}
