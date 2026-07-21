"use client";

import { IconButton, useTheme } from "@once-ui-system/core";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
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
