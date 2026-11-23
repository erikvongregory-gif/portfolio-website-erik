"use client";

import { Column, Heading, Row, SmartLink, Text } from "@once-ui-system/core";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { ContactDialog } from "@/components/ContactDialog";
import styles from "./OrbHero.module.scss";

/** Blender render of the glass ball (transparent, square). Optional: a CSS sphere stands in. */
export const ORB_SRC = "/images/studio/orb.webp";

/** Magnification inside the ball and the radial colour split per px of distance. */
const ZOOM = 1.32;
const SPLIT = 0.022;

function HeadlineContent() {
  return (
    <>
      <span className={styles.eyebrow}>3D-Produktfilme und Reels von EvGlab</span>
      <span className={styles.big}>Filme, die man nicht wegwischt.</span>
    </>
  );
}

/**
 * Films hero: an electric blue first screen with a glass ball drifting across
 * the headline. Inside the ball the headline is drawn again, magnified around
 * the ball centre and split into a red and a cyan copy, like a real lens.
 */
export function OrbHero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [orb, setOrb] = useState<"loading" | "render" | "css">("loading");
  const [positioned, setPositioned] = useState(false);
  const orbLoaded = orb === "render";

  // Use the rendered orb once it really loads; on error the CSS sphere stands in.
  useEffect(() => {
    const img = new Image();
    img.onload = () => setOrb("render");
    img.onerror = () => setOrb("css");
    img.src = ORB_SRC;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const wrap = wrapRef.current;
    if (!stage || !wrap) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let w = wrap.offsetWidth;
    let h = wrap.offsetHeight;
    // Box of the actual big headline glyphs (the drift stays over the words).
    const box = { x: 0, y: 0, w, h };
    const big = wrap.querySelector<HTMLElement>(`.${styles.big}`);
    let pointer: { x: number; y: number } | null = null;
    let pull = 0;
    let x = w * 0.5;
    let y = h * 0.55;
    let raf = 0;
    let visible = true;
    const t0 = performance.now();

    const apply = () => {
      wrap.style.setProperty("--x", `${x.toFixed(2)}px`);
      wrap.style.setProperty("--y", `${y.toFixed(2)}px`);
    };

    const measure = () => {
      w = wrap.offsetWidth;
      h = wrap.offsetHeight;
      if (big) {
        const range = document.createRange();
        range.selectNodeContents(big);
        const rects = [...range.getClientRects()];
        const origin = wrap.getBoundingClientRect();
        if (rects.length) {
          const l = Math.min(...rects.map((r) => r.left));
          const r = Math.max(...rects.map((r) => r.right));
          const t = Math.min(...rects.map((r) => r.top));
          const b = Math.max(...rects.map((r) => r.bottom));
          box.x = l - origin.left;
          box.y = t - origin.top;
          box.w = r - l;
          box.h = b - t;
        }
      }
      if (reduced) {
        x = box.x + box.w * 0.7;
        y = box.y + box.h * 0.5;
        apply();
      }
    };

    const frame = (now: number) => {
      const t = (now - t0) / 1000;
      // Slow Lissajous path over the headline (ratio ~ 3:5, never quite repeating).
      let tx = box.x + box.w * (0.5 + 0.44 * Math.sin(t * 0.19 + 0.6));
      let ty = box.y + box.h * (0.5 + 0.36 * Math.sin(t * 0.31 + 1.4));
      pull += ((pointer ? 0.32 : 0) - pull) * 0.04;
      if (pointer) {
        tx += (pointer.x - tx) * pull;
        ty += (pointer.y - ty) * pull;
      }
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      apply();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (reduced || raf || !visible || document.hidden) return;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      pointer = {
        x: Math.max(0, Math.min(w, e.clientX - r.left)),
        y: Math.max(0, Math.min(h, e.clientY - r.top)),
      };
    };
    const onLeave = () => {
      pointer = null;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    measure();
    apply();
    setPositioned(true);
    // Re-measure once the display font has loaded (line breaks change).
    document.fonts?.ready.then(measure).catch(() => {});
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(stage);
    document.addEventListener("visibilitychange", onVisibility);
    if (finePointer && !reduced) {
      stage.addEventListener("pointermove", onMove);
      stage.addEventListener("pointerleave", onLeave);
    }
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const lensVars = {
    "--zoom": ZOOM,
    "--zoom-red": ZOOM * (1 + SPLIT),
    "--zoom-cyan": ZOOM * (1 - SPLIT),
  } as CSSProperties;

  return (
    <Column
      as="section"
      ref={stageRef}
      data-theme="dark"
      className={styles.stage}
      fillWidth
      horizontal="center"
      aria-labelledby="films-hero-title"
    >
      <span className={styles.glow} aria-hidden="true" />

      <Column className={styles.inner} fillWidth maxWidth="xl" gap="40">
        <Column
          ref={wrapRef}
          className={styles.headWrap}
          fillWidth
          style={lensVars}
          data-ready={positioned && orb !== "loading" ? "" : undefined}
        >
          <Heading as="h1" id="films-hero-title" className={styles.headline}>
            <HeadlineContent />
          </Heading>

          {/* The ball: rendered orb or CSS sphere, then the lens copies on top. */}
          <span className={styles.orb} aria-hidden="true">
            {orbLoaded ? (
              // biome-ignore lint/performance/noImgElement: decorative transparent render, sized by CSS
              <img className={styles.orbImg} src={ORB_SRC} alt="" draggable={false} />
            ) : (
              <span className={styles.orbCss} />
            )}
          </span>

          <span className={styles.lens} aria-hidden="true">
            <Heading as="p" className={`${styles.headline} ${styles.copy} ${styles.copyRed}`}>
              <HeadlineContent />
            </Heading>
            <Heading as="p" className={`${styles.headline} ${styles.copy} ${styles.copyCyan}`}>
              <HeadlineContent />
            </Heading>
            <Heading as="p" className={`${styles.headline} ${styles.copy} ${styles.copyWhite}`}>
              <HeadlineContent />
            </Heading>
          </span>

          <span className={styles.specular} aria-hidden="true" />
        </Column>

        <Row
          className={styles.bottom}
          fillWidth
          horizontal="between"
          vertical="end"
          gap="32"
        >
          <Text as="p" className={styles.lead}>
            3D-Logo-Animationen, Produktfilme und Reels für Instagram, TikTok und LinkedIn. In
            Blender und Motion Design gebaut, im Look deiner Marke und passend zu deiner Website.
          </Text>
          <Row gap="20" vertical="center" wrap>
            <ContactDialog label="Film anfragen" size="m" funnel topic="film" idPrefix="film-hero-" />
            <SmartLink href="#showreel" unstyled className={styles.secondary}>
              Showreel ansehen
            </SmartLink>
          </Row>
        </Row>
      </Column>
    </Column>
  );
}
