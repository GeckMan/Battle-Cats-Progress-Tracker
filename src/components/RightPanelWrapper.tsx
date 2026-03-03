"use client";

import { useState, useEffect, useCallback } from "react";
import RightPanel, { PanelToggleButton } from "./RightPanel";

const LS_KEY_ACTIVITY = "bc_lastSeenActivity";
const LS_KEY_CHAT = "bc_lastSeenChat";

function getLastSeen(key: string): string {
  if (typeof window === "undefined") return new Date().toISOString();
  return localStorage.getItem(key) ?? new Date(0).toISOString();
}

function setLastSeen(key: string) {
  localStorage.setItem(key, new Date().toISOString());
}

export default function RightPanelWrapper() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"activity" | "chat">("activity");
  const [unreadActivity, setUnreadActivity] = useState(0);
  const [unreadChat, setUnreadChat] = useState(0);

  // Poll for unread counts
  const checkUnread = useCallback(async () => {
    try {
      const [actRes, chatRes] = await Promise.all([
        fetch("/api/activity?limit=1"),
        fetch("/api/chat?limit=1"),
      ]);

      if (actRes.ok) {
        const data = await actRes.json();
        const lastSeen = new Date(getLastSeen(LS_KEY_ACTIVITY));
        const newCount = data.activities.filter(
          (a: { createdAt: string }) => new Date(a.createdAt) > lastSeen
        ).length;
        // If there's at least 1 newer than last seen, show the dot
        // (We can't get exact count from limit=1, so just check if newest is new)
        if (newCount > 0) {
          // Fetch more to get actual count
          const fullRes = await fetch("/api/activity?limit=200");
          if (fullRes.ok) {
            const full = await fullRes.json();
            setUnreadActivity(
              full.activities.filter(
                (a: { createdAt: string }) => new Date(a.createdAt) > lastSeen
              ).length
            );
          }
        } else {
          setUnreadActivity(0);
        }
      }

      if (chatRes.ok) {
        const data = await chatRes.json();
        const lastSeen = new Date(getLastSeen(LS_KEY_CHAT));
        const newCount = data.messages.filter(
          (m: { createdAt: string }) => new Date(m.createdAt) > lastSeen
        ).length;
        if (newCount > 0) {
          const fullRes = await fetch("/api/chat?limit=200");
          if (fullRes.ok) {
            const full = await fullRes.json();
            setUnreadChat(
              full.messages.filter(
                (m: { createdAt: string }) => new Date(m.createdAt) > lastSeen
              ).length
            );
          }
        } else {
          setUnreadChat(0);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Initial check + poll every 15s
  useEffect(() => {
    checkUnread();
    const interval = setInterval(checkUnread, 15000);
    return () => clearInterval(interval);
  }, [checkUnread]);

  // Mark tab as read when viewing it
  const handleTabChange = useCallback(
    (tab: "activity" | "chat") => {
      setActiveTab(tab);
      if (tab === "activity") {
        setLastSeen(LS_KEY_ACTIVITY);
        setUnreadActivity(0);
      } else {
        setLastSeen(LS_KEY_CHAT);
        setUnreadChat(0);
      }
    },
    []
  );

  // Mark current tab as read on open
  const handleOpen = useCallback(() => {
    setOpen(true);
    handleTabChange(activeTab);
  }, [activeTab, handleTabChange]);

  // Re-check on close (so badge updates while browsing)
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      {!open && (
        <PanelToggleButton
          onClick={handleOpen}
          unreadActivity={unreadActivity}
          unreadChat={unreadChat}
        />
      )}
      <RightPanel
        open={open}
        onClose={handleClose}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        unreadActivity={unreadActivity}
        unreadChat={unreadChat}
      />
    </>
  );
}
