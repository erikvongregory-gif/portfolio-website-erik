"use client";

import { Column } from "@once-ui-system/core/components";
import classNames from "classnames";
import { type KeyboardEvent, type PointerEvent, useEffect, useRef } from "react";
import { clamp, prefersReducedMotion, r5, rubber, springStep } from "./spring";
import styles from "./PixelName.module.scss";

/** 5x7 bitmaps (I is 3 wide). "#" = pixel on. */
const GLYPHS: Record<string, string[]> = {
  E: ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
  R: ["####.", "#...#", "#...#", "####.", "#.#..", "#..#.", "#...#"],
  I: ["###", ".#.", ".#.", ".#.", ".#.", ".#.", "###"],
  K: ["#...#", "#..#.", "#.#..", "##...", "#.#..", "#..#.", "#...#"],
};

const WORD = "ERIK";
const ROWS = 7;

function buildPixels(word: string) {
  const on: { x: number; y: number }[] = [];
  let col = 0;
  word.split("").forEach((ch, i) => {
    const g = GLYPHS[ch];
    g.forEach((row, y) => {
      row.split("").forEach((c, x) => {
        if (c === "#") on.push({ x: col + x, y });
      });
    });
    col += g[0].length + (i < word.length - 1 ? 1 : 0);
  });
  return { on, cols: col };
}

const { on: PIXELS, cols: COLS } = buildPixels(WORD);

type Dir = { x: -1 | 0 | 1; y: -1 | 0 | 1; name: string };
const HANDLES: Dir[] = [
  { x: -1, y: -1, name: "nw" },
  { x: 0, y: -1, name: "n" },
  { x: 1, y: -1, name: "ne" },
  { x: 1, y: 0, name: "e" },
  { x: 1, y: 1, name: "se" },
  { x: 0, y: 1, name: "s" },
  { x: -1, y: 1, name: "sw" },
  { x: -1, y: 0, name: "w" },
];

/**
 * The name in bitmap type inside a design-tool selection frame. Pull any of the
 * eight handles and the name stretches; let go and it springs back.
 */
export function PixelName({ className }: { className?: string }) {
  const frameRef = useRef<HTMLSpanElement>(null);
  const sizeRef = useRef<HTMLSpanElement>(null);
  const s = useRef({
    sx: 1,
    sy: 1,
    vx: 0,
    vy: 0,
    dir: null as Dir | null,
    startX: 0,
    startY: 0,
    startSx: 1,
    startSy: 1,
    baseW: 0,
    baseH: 0,
    raf: 0,
    last: 0,
  });

  const measure = () => {
    const el = frameRef.current;
    const st = s.current;
    if (!el) return;
    st.baseW = el.offsetWidth / st.sx;
    st.baseH = el.offsetHeight / st.sy;
  };

  const apply = () => {
    const st = s.current;
    const el = frameRef.current;
    if (!el) return;
    el.style.setProperty("--sx", r5(st.sx));
    el.style.setProperty("--sy", r5(st.sy));
    if (sizeRef.current && st.baseW) {
      sizeRef.current.textContent = `${Math.round(st.baseW * st.sx)} × ${Math.round(st.baseH * st.sy)}`;
    }
  };

  useEffect(() => {
    measure();
    apply();
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (s.current.dir || s.current.raf) return;
      measure();
      apply();
    });
    ro.observe(el);
    const st = s.current;
    return () => {
      ro.disconnect();
      cancelAnimationFrame(st.raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tick = (t: number) => {
    const st = s.current;
    const dt = st.last ? Math.min((t - st.last) / 1000, 1 / 30) : 1 / 60;
    st.last = t;
    [st.sx, st.vx] = springStep(st.sx, st.vx, 1, 240, 9, dt);
    [st.sy, st.vy] = springStep(st.sy, st.vy, 1, 240, 9, dt);
    apply();
    const settled =
      Math.abs(st.sx - 1) < 0.0005 &&
      Math.abs(st.sy - 1) < 0.0005 &&
      Math.abs(st.vx) < 0.005 &&
      Math.abs(st.vy) < 0.005;
    if (settled || st.dir) {
      if (settled) {
        st.sx = st.sy = 1;
        st.vx = st.vy = 0;
        apply();
      }
      st.raf = 0;
      st.last = 0;
      return;
    }
    st.raf = requestAnimationFrame(tick);
  };

  const springBack = () => {
    const st = s.current;
    if (prefersReducedMotion()) {
      st.sx = st.sy = 1;
      st.vx = st.vy = 0;
      apply();
      return;
    }
    if (!st.raf) st.raf = requestAnimationFrame(tick);
  };

  const onDown = (dir: Dir) => (e: PointerEvent<HTMLSpanElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const st = s.current;
    cancelAnimationFrame(st.raf);
    st.raf = 0;
    st.last = 0;
    if (!st.baseW) measure();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Synthetic or already released pointer: dragging still works without capture.
    }
    st.dir = dir;
    st.startX = e.clientX;
    st.startY = e.clientY;
    st.startSx = st.sx;
    st.startSy = st.sy;
    st.vx = st.vy = 0;
    frameRef.current?.classList.add(styles.active);
  };

  const onMove = (e: PointerEvent<HTMLSpanElement>) => {
    const st = s.current;
    if (!st.dir || !st.baseW) return;
    // The frame is centred, so it grows on both sides: twice the pointer delta.
    if (st.dir.x !== 0) {
      const raw = st.startSx + (2 * (e.clientX - st.startX) * st.dir.x) / st.baseW;
      st.sx = rubber(raw, 0.5, 1.55, 2.2);
    }
    if (st.dir.y !== 0) {
      const raw = st.startSy + (2 * (e.clientY - st.startY) * st.dir.y) / st.baseH;
      st.sy = rubber(raw, 0.55, 1.7, 2.2);
    }
    apply();
  };

  const onUp = () => {
    const st = s.current;
    if (!st.dir) return;
    st.dir = null;
    frameRef.current?.classList.remove(styles.active);
    springBack();
  };

  const onKey = (e: KeyboardEvent<HTMLSpanElement>) => {
    const st = s.current;
    const map: Record<string, [number, number]> = {
      ArrowRight: [1, 0],
      ArrowLeft: [-1, 0],
      ArrowUp: [0, 1],
      ArrowDown: [0, -1],
    };
    const d = map[e.key];
    if (!d) return;
    e.preventDefault();
    if (prefersReducedMotion()) return;
    st.vx = clamp(st.vx + d[0] * 4.5, -9, 9);
    st.vy = clamp(st.vy + d[1] * 4.5, -9, 9);
    springBack();
  };

  return (
    <Column
      className={classNames(styles.wrap, className)}
      horizontal="center"
      role="group"
      aria-label="Erik, in Pixelschrift in einem Auswahlrahmen wie in einem Design-Tool"
    >
      <span ref={frameRef} className={styles.frame}>
        <span className={styles.sizeTag} aria-hidden="true">
          <span className={styles.layer}>Erik</span>
          <span ref={sizeRef} className={styles.size}>
            
          </span>
        </span>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${COLS} ${ROWS}`}
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          {PIXELS.map((p, i) => (
            <rect
              key={`${p.x}-${p.y}`}
              x={p.x + 0.07}
              y={p.y + 0.07}
              width={0.86}
              height={0.86}
              className={styles.px}
              style={{ animationDelay: `${(((i * 37) % 29) / 29) * 0.55 + 0.15}s` }}
            />
          ))}
        </svg>
        {HANDLES.map((h) => {
          const isSlider = h.name === "e";
          return (
            <span
              key={h.name}
              className={classNames(styles.handle, styles[h.name])}
              onPointerDown={onDown(h)}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
              {...(isSlider
                ? {
                    role: "slider",
                    tabIndex: 0,
                    "aria-label": "Namen in die Breite ziehen (Pfeiltasten)",
                    "aria-valuemin": 50,
                    "aria-valuemax": 155,
                    "aria-valuenow": 100,
                    "aria-valuetext": "Originalbreite, federt zurück",
                    "aria-orientation": "horizontal" as const,
                    onKeyDown: onKey,
                  }
                : { "aria-hidden": true })}
            />
          );
        })}
      </span>
    </Column>
  );
}
