"use client";

import { useState, useRef, lazy, Suspense, useEffect, useCallback } from "react";

const BattleCatPlayground = lazy(() => import("@/components/BattleCatPlayground"));

export default function AboutClient({ children }: { children: React.ReactNode }) {
  const [unleashed, setUnleashed] = useState(false);
  const [catCount, setCatCount] = useState<number | null>(null);
  const [alreadyUnleashed, setAlreadyUnleashed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch count on mount (silently — don't block render)
  useEffect(() => {
    fetch("/api/easter-egg")
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.count === "number") setCatCount(d.count);
        if (d.hasUnleashed) setAlreadyUnleashed(true);
      })
      .catch(() => {});
  }, []);

  const handleUnleash = useCallback(() => {
    setUnleashed(true);
    if (!alreadyUnleashed) {
      fetch("/api/easter-egg", { method: "POST" })
        .then((r) => r.json())
        .then((d) => {
          if (typeof d.count === "number") setCatCount(d.count);
          setAlreadyUnleashed(true);
        })
        .catch(() => {});
    }
  }, [alreadyUnleashed]);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {children}

      {/* Easter egg button — always at the bottom of the About content */}
      <div className="mt-10" data-playground-ui>
        {!unleashed ? (
          <button
            type="button"
            onClick={handleUnleash}
            className="w-full py-3 px-4 rounded-lg border border-dashed border-gray-700 bg-gray-950 text-sm text-gray-500 hover:text-amber-400 hover:border-amber-800 transition-colors group"
          >
            <span className="group-hover:hidden">. . .</span>
            <span className="hidden group-hover:inline">Unleash the Cat</span>
          </button>
        ) : (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setUnleashed(false)}
              className="w-full py-2 px-4 rounded-lg border border-gray-700 bg-gray-950 text-xs text-gray-500 hover:text-amber-400 hover:border-amber-800 transition-colors"
            >
              Recall the Cat
            </button>
            {catCount !== null && catCount > 0 && (
              <p className="text-center text-xs text-gray-600">
                {catCount === 1
                  ? "You are the first to unleash the cat."
                  : `${catCount} players have unleashed the cat.`}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Cat playground overlay */}
      {unleashed && (
        <Suspense fallback={null}>
          <BattleCatPlayground containerRef={containerRef} />
        </Suspense>
      )}
    </div>
  );
}
