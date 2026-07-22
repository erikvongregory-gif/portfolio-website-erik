"use client";

import { useEffect, useState } from "react";
import { IconButton, useTheme } from "@once-ui-system/core";

/**
 * ThemeToggle must wait until mount before reading resolvedTheme.
 * SSR has no localStorage / matchMedia, so icon + aria-label would
 * otherwise mismatch the client and trigger a hydration warning.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <IconButton
        icon="moon"
        variant="tertiary"
        size="s"
        aria-label="Theme umschalten"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <IconButton
      icon={isDark ? "sun" : "moon"}
      variant="tertiary"
      size="s"
      aria-label={isDark ? "Light Mode aktivieren" : "Dark Mode aktivieren"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    />
  );
}
