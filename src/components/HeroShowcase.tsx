"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { findMagneticHero, paintHeroSpotlight } from "@/lib/heroSpotlight";
import styles from "./HeroShowcase.module.scss";

type CardContent = {
  title: string;
  image: string;
  /** Live site – makes the card clickable while it sits at the front. */
  url?: string;
  comingSoon?: boolean;
  obscured?: boolean;
};

// A single 3D state along the carousel arc.
type KeyState = {
  tx: number; // % of card (horizontal)
  ty: number; // % of card (vertical)
  tz: number; // px depth
  rx: number; // deg
  ry: number; // deg
  scale: number;
  opacity: number;
  z: number; // z-index
};

const DURATION = 22; // seconds for one full revolution
const DRAG_SENS = 0.7; // how strongly dragging scrubs the timeline
const CLICK_SLOP = 6; // px of pointer travel still counted as a click

// Control points of the arc, captured 1:1 from the reference animation.
// Order = travel order: spawn (top, back, hidden) -> centre (front, big) -> exit (right, back, hidden).
// Die z-Werte steigen entlang des Pfads monoton an: Eine Karte, die weiter
// vorne im Umlauf ist, bleibt IMMER über den nachrückenden Karten. Dadurch
// gibt es nie einen Ebenen-Tausch, während sich zwei Karten überlappen
// (das sah aus, als würde eine Karte durch die andere "durchbacken").
const KEYS: KeyState[] = [
  { tx: -10, ty: -300, tz: -1000, rx: 4, ry: -3, scale: 0.44, opacity: 0, z: 20 },
  { tx: -10, ty: -168.78, tz: -140.54, rx: 2.657, ry: -1.81, scale: 0.937, opacity: 0.8, z: 60 },
  { tx: -10, ty: -37.55, tz: 273.8, rx: 2.01, ry: -0.62, scale: 1.176, opacity: 0.997, z: 100 },
  { tx: 52.74, ty: 65.77, tz: 142.25, rx: 2.215, ry: 0.571, scale: 1.1, opacity: 0.935, z: 104 },
  { tx: 183.53, ty: 70, tz: -317.8, rx: 2.934, ry: 1.762, scale: 0.834, opacity: 0.72, z: 108 },
  { tx: 314.75, ty: 70, tz: -972.33, rx: 3.957, ry: 2.952, scale: 0.456, opacity: 0.041, z: 112 },
];

const COUNT = KEYS.length;

const projects: CardContent[] = [
  {
    title: "Salon Liora",
    image: "/images/projects/salon-liora/hero.png",
    url: "https://salon-liora.vercel.app",
  },
  { title: "EvGlab", image: "/images/projects/evglab/hero-ki.png", url: "https://ki.evglab.com" },
  {
    title: "Kapitalanlagen Deutschland (Entwurf)",
    image: "/images/projects/kapitalanlagen/hero.png",
    obscured: true,
  },
  {
    title: "Ingenieurbüro Jungen",
    image: "/images/projects/ib-jungen/hero.png",
    url: "https://ib-jungen-web.vercel.app",
  },
  {
    title: "Lünebräu",
    image: "/images/projects/lunebraeu/hero.png",
    url: "https://luenebraeu.vercel.app",
  },
  {
    title: "Da Peppe",
    image: "/images/projects/da-peppe/hero-live.png",
    url: "https://da-peppe.com",
  },
];

// Slots on the arc, filled with real work (repeated) instead of empty placeholders.
const cards: CardContent[] = [...projects, ...projects];

const lerp = (a: number, b: number, f: number) => a + (b - a) * f;

export function HeroShowcase() {
  const stageRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const stage = stageRef.current;
    const deck = deckRef.current;
    if (!stage) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let t = 0;
    let dragging = false;
    let last = performance.now();
    let raf = 0;
    let front = -1;
    // Pointer down position – a release close to it counts as a click, not a drag.
    let downX = 0;
    let downY = 0;

    // Mouse-driven parallax tilt of the whole deck (lerped for smoothness).
    let tmx = 0;
    let tmy = 0;
    let cmx = 0;
    let cmy = 0;

    const render = () => {
      // The card closest to the viewer (highest translateZ) is the interactive one.
      let bestZ = Number.NEGATIVE_INFINITY;
      let bestIndex = -1;

      for (let i = 0; i < cards.length; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;

        const phase = (((t + i / cards.length) % 1) + 1) % 1;
        const pos = phase * COUNT;
        const seg = Math.floor(pos) % COUNT;
        const raw = pos - Math.floor(pos);
        const f = raw * raw * (3 - 2 * raw); // smoothstep easing
        const a = KEYS[seg];
        const b = KEYS[(seg + 1) % COUNT];

        const tx = lerp(a.tx, b.tx, f);
        const ty = lerp(a.ty, b.ty, f);
        const tz = lerp(a.tz, b.tz, f);
        const rx = lerp(a.rx, b.rx, f);
        const ry = lerp(a.ry, b.ry, f);
        const scale = lerp(a.scale, b.scale, f);
        const opacity = lerp(a.opacity, b.opacity, f);
        const z = Math.round(lerp(a.z, b.z, f));

        el.style.transform = `translate3d(calc(-50% + ${tx}%), calc(-50% + ${ty}%), ${tz}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(0deg) scale(${scale})`;
        el.style.opacity = String(opacity);
        el.style.zIndex = String(z);

        if (tz > bestZ) {
          bestZ = tz;
          bestIndex = i;
        }
      }

      if (bestIndex !== front) {
        cardRefs.current[front]?.removeAttribute("data-front");
        cardRefs.current[bestIndex]?.setAttribute("data-front", "true");
        front = bestIndex;
        stage.dataset.clickable = cards[bestIndex]?.url ? "true" : "false";
      }
    };

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!dragging && !reduced) {
        t = (t + dt / DURATION) % 1;
      }
      cmx += (tmx - cmx) * 0.08;
      cmy += (tmy - cmy) * 0.08;
      if (deck) {
        deck.style.transform = `translateX(-10%) rotateX(${3 + cmy}deg) rotateY(${-4 + cmx}deg)`;
      }
      render();
      raf = requestAnimationFrame(tick);
    };

    const paintSpot = (e: PointerEvent, strength = 1) => {
      const hero = findMagneticHero(stage);
      if (hero) paintHeroSpotlight(hero, e.clientX, e.clientY, strength);
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      downX = e.clientX;
      downY = e.clientY;
      stage.setPointerCapture(e.pointerId);
      paintSpot(e, 1);
    };
    const onMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / (rect.width || 1) - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / (rect.height || 1) - 0.5) * 2;
      tmx = nx * 5;
      tmy = -ny * 4;
      // Pointer capture steals moves from the hero – keep the spotlight in sync.
      paintSpot(e, dragging ? 1 : 0.85);
      if (!dragging) return;
      t = (((t + (e.movementX / (rect.width || 1)) * DRAG_SENS) % 1) + 1) % 1;
      render();
    };
    const onLeave = () => {
      tmx = 0;
      tmy = 0;
    };
    const onUp = (e: PointerEvent) => {
      const wasDragging = dragging;
      dragging = false;
      last = performance.now();
      paintSpot(e, 0.7);
      if (stage.hasPointerCapture(e.pointerId)) stage.releasePointerCapture(e.pointerId);

      if (!wasDragging) return;
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > CLICK_SLOP) return;
      const url = cards[front]?.url;
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    };
    const onCancel = (e: PointerEvent) => {
      dragging = false;
      last = performance.now();
      if (stage.hasPointerCapture(e.pointerId)) stage.releasePointerCapture(e.pointerId);
    };

    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onCancel);
    stage.addEventListener("pointerleave", onLeave);

    render();
    if (!reduced) raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onCancel);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className={styles.stage}
      aria-label="Projekt-Vorschau: ziehen zum Blättern, Klick öffnet die Website vorne"
      role="group"
    >
      <div ref={deckRef} className={styles.deck}>
        {cards.map((c, i) => {
          const blurTitle = c.comingSoon || c.obscured;
          const blurImage = c.comingSoon;
          return (
          <figure
            key={i}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className={styles.card}
          >
            <div className={styles.inner} data-sheen>
              <div className={styles.chrome}>
                <div className={styles.dots}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </div>
                <span
                  className={`${styles.title}${blurTitle ? ` ${styles.blurText}` : ""}`}
                >
                  {c.title}
                </span>
                {c.url && (
                  <span className={styles.cta} aria-hidden="true">
                    Live ansehen ↗
                  </span>
                )}
              </div>
              <div className={styles.imageWrap}>
                <Image
                  className={`${styles.image}${blurImage ? ` ${styles.imageBlur}` : ""}`}
                  src={c.image}
                  alt={
                    c.comingSoon
                      ? "Projekt – bald verfügbar"
                      : c.obscured
                        ? "Projektentwurf"
                        : `${c.title} – Website`
                  }
                  fill
                  sizes="(min-width: 1440px) 420px, 30vw"
                  priority={i === 0}
                />
                {c.comingSoon && (
                  <div className={styles.teaser}>
                    <span className={styles.teaserBadge}>
                      <span className={styles.teaserDot} />
                      Eventuell bald verfügbar
                    </span>
                  </div>
                )}
              </div>
            </div>
          </figure>
          );
        })}
      </div>

      {/* Same destinations as the cards, reachable by keyboard and screen readers. */}
      <ul className={styles.links}>
        {projects.map((p) =>
          p.url ? (
            <li key={p.title}>
              <a href={p.url} target="_blank" rel="noopener noreferrer">
                {p.title} – Website live ansehen
              </a>
            </li>
          ) : null,
        )}
      </ul>
    </div>
  );
}
