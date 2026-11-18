import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "flight-seat-theme";
export const THEME_OPTIONS = ["system", "light", "dark"];

function getSystemTheme() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredTheme() {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return THEME_OPTIONS.includes(stored) ? stored : "system";
}

export function useTheme() {
  const [preference, setPreference] = useState(getStoredTheme);
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener?.("change", handleChange);
    return () => mediaQuery.removeEventListener?.("change", handleChange);
  }, []);

  const resolvedTheme = useMemo(
    () => (preference === "system" ? systemTheme : preference),
    [preference, systemTheme],
  );

  useEffect(() => {
    if (typeof document === "undefined") return;

    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.dataset.themePreference = preference;
    document.documentElement.style.colorScheme = resolvedTheme;
    window.localStorage.setItem(STORAGE_KEY, preference);
  }, [preference, resolvedTheme]);

  return { preference, resolvedTheme, setPreference };
}
