"use client";

import { Column, Heading, Text } from "@once-ui-system/core/components";
import { useRef } from "react";
import { ScrollTrigger, useGsapScene } from "@/components/motion/gsap";
import { Glow, StudioSection } from "@/components/studio";
import { STEPS } from "./data";
import styles from "./HomeProcess.module.scss";

/**
 * The process as an edit timeline: five clips on a track and a playhead that
 * moves with the scroll. Each clip lights up once the playhead reaches it.
 */
export function HomeProcess() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGsapScene(rootRef, ({ motion }, scope) => {
    const clips = Array.from(scope.querySelectorAll<HTMLElement>("[data-clip]"));
    // --p goes only on the playhead and progress line, so a scroll frame restyles
    // two decorative spans instead of the whole list of steps.
    const marks = Array.from(scope.querySelectorAll<HTMLElement>("[data-mark]"));
    let last = "";
    const set = (p: number) => {
      const v = p.toFixed(4);
      if (v === last) return;
      last = v;
      marks.forEach((m) => m.style.setProperty("--p", v));
      clips.forEach((c, i) => {
        const on = p >= i / clips.length + 0.02;
        if (c.hasAttribute("data-on") !== on) c.toggleAttribute("data-on", on);
      });
    };

    if (!motion) {
      set(1);
      return;
    }

    set(0);
    const st = ScrollTrigger.create({
      trigger: scope,
      start: "top 82%",
      // Long enough that the playhead travels at reading speed, also for the short desktop row.
      end: () => `+=${Math.max(scope.offsetHeight, window.innerHeight * 0.6)}`,
      invalidateOnRefresh: true,
      onUpdate: (self) => set(self.progress),
    });
    return () => st.kill();
  });

  return (
    <StudioSection
      id="ablauf"
      kicker="Ablauf"
      title={
        <>
          Fünf Schritte, dann bist du <Glow>live</Glow>.
        </>
      }
      intro="Du brauchst kein Technik-Wissen. Ich führe dich durch alles."
    >
      <Column ref={rootRef} fillWidth className={styles.timeline}>
        <span className={styles.ruler} aria-hidden="true" />
        <span className={styles.progress} aria-hidden="true" data-mark />
        <span className={styles.playhead} aria-hidden="true" data-mark />
        <Column as="ol" className={styles.clips} fillWidth>
          {STEPS.map((s, i) => (
            <Column as="li" key={s.title} className={styles.clip} data-clip gap="12">
              <span className={styles.bar} aria-hidden="true" />
              <Text className={styles.meta}>
                <span className={styles.srOnly}>Schritt {i + 1}: </span>
                {s.meta}
              </Text>
              <Heading as="h3" className={styles.title}>
                {s.title}
              </Heading>
              <Text as="p" className={styles.body}>
                {s.body}
              </Text>
            </Column>
          ))}
        </Column>
      </Column>
    </StudioSection>
  );
}
