"use client";

import { useRef } from "react";
import { Column, Icon, Row, Text } from "@once-ui-system/core";
import Image from "next/image";
import { gsap, useGsapScene } from "@/components/motion/gsap";
import styles from "./Statement.module.scss";

type StatementProps = {
  text: string;
  /** Wörter (ohne Satzzeichen), die einen Marker bekommen. Reihenfolge = Belege 0, 1, 2. */
  highlights?: string[];
  /** Belege (Projekte, Kundenstimme, Anfrage) rund um den Satz zeigen. */
  proofs?: boolean;
};

const clean = (w: string) => w.replace(/[.,!?;:–]/g, "");

/** Startlage der Belege beim Einfliegen (Richtung, Drehung). */
const FLY_FROM: Record<string, gsap.TweenVars> = {
  shotA: { x: -120, y: 60, rotate: -14 },
  shotB: { x: 120, y: 80, rotate: 14 },
  quote: { x: 100, y: -40, rotate: 8 },
  toast: { x: -100, y: 40, rotate: -6 },
};

/**
 * Gepinntes Statement: Wörter tauchen beim Scrollen aus der Unschärfe auf,
 * Schlüsselwörter bekommen einen Marker, und zu jedem fliegt ein Beleg ein
 * (Projekte → „auffällt“, Kundenstimme → „Vertrauen“, Anfrage → „Kunden“).
 */
export function Statement({ text, highlights = [], proofs = true }: StatementProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const words = text.split(" ");

  useGsapScene(rootRef, ({ motion, desktop }, scope) => {
    if (!motion) return;
    const q = gsap.utils.selector(scope);
    const wordEls = q("[data-word]");
    const marks = q("[data-mark]");
    const para = q("[data-para]");
    const floats = q("[data-float]") as HTMLElement[];

    gsap.set(wordEls, { opacity: 0.12, filter: "blur(6px)", yPercent: 30 });
    gsap.set(marks, { scaleX: 0 });

    const tl = gsap.timeline({
      scrollTrigger: desktop
        ? {
            trigger: scope,
            start: "center center",
            end: `+=${window.innerHeight * 1.8}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.8,
          }
        : { trigger: scope, start: "top 75%", end: "bottom 45%", scrub: 0.8 },
    });

    const step = 0.12;
    const textDur = wordEls.length * step + 0.6;
    tl.fromTo(para, { scale: 0.94 }, { scale: 1, duration: textDur, ease: "none" }, 0);

    let markIndex = 0;
    wordEls.forEach((el, i) => {
      const at = i * step;
      tl.to(el, { opacity: 1, filter: "blur(0px)", yPercent: 0, duration: 0.5, ease: "power2.out" }, at);
      const mark = el.querySelector("[data-mark]");
      if (!mark) return;
      tl.to(mark, { scaleX: 1, duration: 0.45, ease: "power3.inOut" }, at + 0.25);

      // Belege zum Schlüsselwort einfliegen lassen.
      const group = floats.filter((f) => f.dataset.for === String(markIndex));
      group.forEach((f, j) => {
        tl.fromTo(
          f,
          { ...FLY_FROM[f.dataset.float ?? ""], opacity: 0, scale: 0.85, filter: "blur(10px)" },
          {
            x: 0,
            y: 0,
            rotate: Number(f.dataset.rotate ?? 0),
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.7,
            ease: "back.out(1.4)",
          },
          at + 0.3 + j * 0.12,
        );
      });
      markIndex++;
    });

    if (!desktop) return;

    // Leichte Parallaxe über die ganze Szene, danach gemeinsamer Abgang.
    floats.forEach((f) => {
      tl.to(
        f.parentElement,
        { yPercent: Number(f.dataset.drift ?? -20), duration: textDur + 1.2, ease: "none" },
        0,
      );
    });
    tl.addLabel("out", ">");
    tl.to(para, { yPercent: -12, opacity: 0.55, duration: 0.8, ease: "power1.in" }, "out");
    tl.to(
      floats,
      { opacity: 0, scale: 0.9, filter: "blur(8px)", duration: 0.6, ease: "power1.in", stagger: 0.05 },
      "out",
    );
  });

  return (
    <Column
      as="section"
      ref={rootRef}
      fillWidth
      horizontal="center"
      paddingY="104"
      m={{ paddingY: "64" }}
      className={proofs ? styles.scene : undefined}
    >
      {proofs && (
      <span className={styles.floats} aria-hidden="true">
        <span className={styles.slotShotA}>
          <span className={styles.shot} data-float="shotA" data-for="0" data-rotate="-6" data-drift="-30">
            <Image src="/images/projects/salon-liora/hero.png" alt="" fill sizes="300px" />
          </span>
        </span>
        <span className={styles.slotShotB}>
          <span className={styles.shot} data-float="shotB" data-for="0" data-rotate="5" data-drift="-12">
            <Image src="/images/projects/lunebraeu/hero.png" alt="" fill sizes="320px" />
          </span>
        </span>
        <span className={styles.slotQuote}>
          <Column className={styles.card} gap="12" data-float="quote" data-for="1" data-rotate="3" data-drift="-24">
            <Text className={styles.stars}>★★★★★</Text>
            <Text variant="body-default-s" onBackground="neutral-strong">
              „Innerhalb von nur drei Tagen waren wir mit einer komplett neuen Website online.“
            </Text>
            <Row gap="8" vertical="center">
              <span className={styles.avatar}>
                <Image src="/images/projects/da-peppe/hero-live.png" alt="" fill sizes="28px" />
              </span>
              <Column gap="2">
                <Text variant="label-strong-s" onBackground="neutral-strong">
                  Da Peppe
                </Text>
                <Text variant="label-default-xs" onBackground="neutral-weak">
                  Google, 5 von 5
                </Text>
              </Column>
            </Row>
          </Column>
        </span>
        <span className={styles.slotToast}>
          <Row
            className={styles.card}
            gap="12"
            vertical="center"
            data-float="toast"
            data-for="2"
            data-rotate="-3"
            data-drift="-36"
          >
            <span className={styles.toastIcon}>
              <Icon name="email" size="s" />
            </span>
            <Column gap="2" fillWidth>
              <Row horizontal="between" vertical="center" gap="8">
                <Text variant="label-strong-s" onBackground="neutral-strong">
                  Neue Anfrage
                </Text>
                <Text variant="label-default-xs" onBackground="neutral-weak">
                  gerade eben
                </Text>
              </Row>
              <Text variant="label-default-s" onBackground="neutral-weak">
                Über das Kontaktformular deiner Website
              </Text>
            </Column>
          </Row>
        </span>
      </span>
      )}

      <Column maxWidth={48} fillWidth horizontal="center" paddingX="l" className={styles.copy}>
        <p className={styles.text} data-para>
          {words.map((w, i) => {
            const marked = highlights.includes(clean(w));
            return (
              <span key={`${w}-${i}`} className={styles.word} data-word>
                {marked ? (
                  <span className={styles.marked}>
                    <span className={styles.mark} data-mark aria-hidden="true" />
                    {w}
                  </span>
                ) : (
                  w
                )}
                {i < words.length - 1 ? " " : ""}
              </span>
            );
          })}
        </p>
      </Column>
    </Column>
  );
}
