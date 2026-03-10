"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export type Theme = "default" | "nerv";

type ThemeCtx = {
  theme: Theme;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeCtx>({
  theme: "default",
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

/**
 * ThemeProvider
 *
 * - Reads initial theme from `initialTheme` prop (server-rendered)
 * - Applies `data-theme` attribute on `<html>` for CSS targeting
 * - Persists to localStorage for instant reload (no flash)
 * - Syncs to DB via /api/settings/theme on change
 */
export function ThemeProvider({
  children,
  initialTheme = "default",
}: {
  children: ReactNode;
  initialTheme?: Theme;
}) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // On client, prefer localStorage for instant load
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("battlecats-theme") as Theme | null;
      if (stored === "nerv" || stored === "default") return stored;
    }
    return initialTheme;
  });

  // Apply data-theme attribute to <html> and persist
  useEffect(() => {
    const html = document.documentElement;
    if (theme === "nerv") {
      html.setAttribute("data-theme", "nerv");
    } else {
      html.removeAttribute("data-theme");
    }
    localStorage.setItem("battlecats-theme", theme);
  }, [theme]);

  // Sync to server
  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    // Fire and forget — no need to await
    fetch("/api/settings/theme", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: t }),
    }).catch(() => {});
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
