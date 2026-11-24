"use client";

import { Column } from "@once-ui-system/core/components";
import { type ComponentProps, useEffect, useRef, useState } from "react";

/**
 * Marks its subtree with data-inview="true" once it scrolls into view, so the
 * pen doodles and strike-throughs inside start drawing at the right moment.
 */
export function InView({ children, ...rest }: ComponentProps<typeof Column>) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      // Start once the top edge is a little way into the screen. A ratio
      // threshold would fire late or never for blocks taller than the screen.
      { threshold: 0, rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Column ref={ref} data-inview={seen ? "true" : "false"} {...rest}>
      {children}
    </Column>
  );
}
