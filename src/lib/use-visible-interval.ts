"use client";

import { useEffect, useRef } from "react";

/**
 * Like setInterval, but pauses while the tab is in the background and
 * immediately re-fires once when the tab becomes visible again (so state
 * doesn't look stale right after switching back).
 *
 * Added 2026-10 after the site repeatedly hit Vercel's Fluid Active CPU
 * quota and got shut down — several components (RightPanelWrapper's unread
 * checks, the chat/online-count/admin-roster polls inside RightPanel, the
 * sidebar's friend-request poll) were polling on plain setInterval
 * unconditionally, including from tabs sitting backgrounded/idle, which is
 * pure wasted serverless invocations. This doesn't change what gets polled,
 * only skips polling while nobody could possibly be looking at the result.
 */
export function useVisibleInterval(callback: () => void, ms: number) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (typeof document === "undefined") return;

    let interval: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      if (interval) return;
      interval = setInterval(() => callbackRef.current(), ms);
    };
    const stop = () => {
      if (!interval) return;
      clearInterval(interval);
      interval = null;
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        callbackRef.current();
        start();
      } else {
        stop();
      }
    };

    if (document.visibilityState === "visible") start();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [ms]);
}
