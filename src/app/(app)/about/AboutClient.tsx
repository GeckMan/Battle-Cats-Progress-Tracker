"use client";

import { useState, lazy, Suspense } from "react";

const BattleCatPlayground = lazy(() => import("@/components/BattleCatPlayground"));

export default function AboutClient() {
  const [unleashed, setUnleashed] = useState(false);

  if (!unleashed) {
    return (
      <section>
        <button
          type="button"
          onClick={() => setUnleashed(true)}
          className="w-full py-3 px-4 rounded-lg border border-dashed border-gray-700 bg-gray-950 text-sm text-gray-500 hover:text-amber-400 hover:border-amber-800 transition-colors group"
        >
          <span className="group-hover:hidden">. . .</span>
          <span className="hidden group-hover:inline">Unleash the Cat</span>
        </button>
      </section>
    );
  }

  // When unleashed, render a full-page overlay canvas that covers the About page.
  // The canvas renders all the About text as individual physics characters,
  // replacing the DOM text visually while the cat is active.
  return (
    <>
      {/* Full-page overlay — covers the entire About content area */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 50,
          background: "rgb(3, 7, 18)",
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={() => setUnleashed(false)}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 60,
            padding: "6px 14px",
            fontSize: 12,
            color: "rgb(156, 163, 175)",
            background: "rgba(17,24,39,0.8)",
            border: "1px solid rgb(55,65,81)",
            borderRadius: 6,
            cursor: "pointer",
            backdropFilter: "blur(4px)",
          }}
        >
          Close
        </button>

        {/* Hint */}
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 60,
            fontSize: 11,
            color: "rgba(255,255,255,0.15)",
            letterSpacing: "0.05em",
            pointerEvents: "none",
          }}
        >
          drag the cat around — throw it — watch the text scatter
        </div>

        <Suspense
          fallback={
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", color: "rgb(75,85,99)", fontSize: 14 }}>
              Loading playground...
            </div>
          }
        >
          <BattleCatPlayground />
        </Suspense>
      </div>
    </>
  );
}
