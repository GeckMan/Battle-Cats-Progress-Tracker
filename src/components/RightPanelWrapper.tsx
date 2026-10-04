"use client";

import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { PanelToggleButton } from "./PanelToggleButton";
import { useVisibleInterval } from "@/lib/use-visible-interval";

// Lazy-load the full 1300-line RightPanel — it's only needed when the user opens it
const loadRightPanel = () => import("./RightPanel");
const RightPanel = lazy(loadRightPanel);

const LS_KEY_ACTIVITY = "bc_lastSeenActivity";
const LS_KEY_CHAT = "bc_lastSeenChat";

function getLastSeen(key: string): string {
  if (typeof window === "undefined") return new Date().toISOString();
  return localStorage.getItem(key) ?? new Date(0).toISOString();
}

function setLastSeen(key: string) {
  localStorage.setItem(key, new Date().toISOString());
}

export default function RightPanelWrapper({ currentUserId, currentUserRole }: { currentUserId: string; currentUserRole: string }) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"activity" | "chat" | "admin" | "globalActivity">("activity");
  const [unreadActivity, setUnreadActivity] = useState(0);
  const [unreadChat, setUnreadChat] = useState(0);

  // Poll for unread counts — single count-only request (see
  // src/app/api/unread-counts/route.ts) instead of the old pattern of up to
  // 4 separate fetches (limit=1 then limit=200 for each of activity/chat).
  const checkUnread = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        activitySince: getLastSeen(LS_KEY_ACTIVITY),
        chatSince: getLastSeen(LS_KEY_CHAT),
      });
      const res = await fetch(`/api/unread-counts?${params}`);
      if (!res.ok) return;
      const data = await res.json();
      setUnreadActivity(data.unreadActivity ?? 0);
      setUnreadChat(data.unreadChat ?? 0);
    } catch {
      /* ignore */
    }
  }, []);

  // Initial check, then poll every 120s while the tab is visible (paused in
  // the background — see useVisibleInterval's own comment for why).
  useEffect(() => {
    checkUnread();
  }, [checkUnread]);
  useVisibleInterval(checkUnread, 120000);

  // Warm the RightPanel chunk shortly after the app shell mounts, instead of
  // only ever fetching it on the user's first tap. lazy()'s Suspense
  // fallback is `null`, so without this, tapping the toggle button on a
  // fresh page load makes the button disappear with ZERO visual feedback
  // until the chunk finishes downloading — reported as the panel (chat in
  // particular) feeling "clunky" to open, especially over a mobile
  // connection. A short delay keeps this out of the critical initial-paint
  // path; by the time a user actually reaches for the button, the chunk is
  // very likely already cached.
  useEffect(() => {
    const timer = setTimeout(() => {
      loadRightPanel().catch(() => {});
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Presence heartbeat — this component is mounted for the whole authenticated
  // app shell (not just while the panel is open), so it's a reliable place to
  // ping "I'm here" for the site-wide "online now" count.
  const ping = useCallback(() => {
    fetch("/api/presence", { method: "POST" }).catch(() => {});
  }, []);
  useEffect(() => {
    ping();
  }, [ping]);
  useVisibleInterval(ping, 60000);

  // Mark tab as read when viewing it
  const handleTabChange = useCallback(
    (tab: "activity" | "chat" | "admin" | "globalActivity") => {
      setActiveTab(tab);
      if (tab === "activity") {
        setLastSeen(LS_KEY_ACTIVITY);
        setUnreadActivity(0);
      } else if (tab === "chat") {
        setLastSeen(LS_KEY_CHAT);
        setUnreadChat(0);
      }
    },
    []
  );

  // Mark current tab as read on open + refresh counts
  const handleOpen = useCallback(() => {
    setOpen(true);
    handleTabChange(activeTab);
    checkUnread();
  }, [activeTab, handleTabChange, checkUnread]);

  // Re-check on close (so badge updates while browsing)
  const handleClose = useCallback(() => {
    setOpen(false);
    // Refresh unread counts after a short delay so new items show on the badge
    setTimeout(checkUnread, 500);
  }, [checkUnread]);

  return (
    <>
      {!open && (
        <PanelToggleButton
          onClick={handleOpen}
          unreadActivity={unreadActivity}
          unreadChat={unreadChat}
        />
      )}
      {open && (
        <Suspense fallback={null}>
          <RightPanel
            open={open}
            onClose={handleClose}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            unreadActivity={unreadActivity}
            unreadChat={unreadChat}
            currentUserId={currentUserId}
            currentUserRole={currentUserRole}
          />
        </Suspense>
      )}
    </>
  );
}
