"use client";

import { useEffect, useState } from "react";
import { IconButton } from "@once-ui-system/core";

const STORAGE_KEY = "data-theme";
type ThemeMode = "light" | "dark";

function readTheme(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "dark" ? "dark" : "light";
}

function applyTheme(theme: ThemeMode) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(readTheme());
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: ThemeMode = theme === "light" ? "dark" : "light";
    applyTheme(next);
    setTheme(next);
  };

  return (
    <IconButton
      icon={mounted && theme === "dark" ? "sun" : "moon"}
      variant="tertiary"
      size="s"
      aria-label={
        mounted
          ? theme === "light"
            ? "Dark Mode aktivieren"
            : "Light Mode aktivieren"
          : "Darstellung wechseln"
      }
      onClick={mounted ? toggle : undefined}
      style={mounted ? undefined : { visibility: "hidden" }}
    />
  );
}
