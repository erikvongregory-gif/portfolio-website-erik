"use client";

import { useState } from "react";
import { Text } from "@once-ui-system/core";
import { COOKIE_SETTINGS_EVENT } from "@/components/CookieBanner";

export function CookieSettingsButton() {
  const [hover, setHover] = useState(false);

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT))}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        margin: 0,
        cursor: "pointer",
        display: "inline-flex",
        font: "inherit",
        lineHeight: 1,
      }}
    >
      <Text
        variant="body-default-xs"
        onBackground={hover ? "neutral-strong" : "neutral-weak"}
        style={{ transition: "color 0.15s ease" }}
      >
        Cookie-Einstellungen
      </Text>
    </button>
  );
}
