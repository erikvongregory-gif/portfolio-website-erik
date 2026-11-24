"use client";

import { Column } from "@once-ui-system/core/components";
import classNames from "classnames";
import {
  type ComponentProps,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useRef,
} from "react";
import { clamp, prefersReducedMotion, r5, springStep } from "./spring";
import styles from "./Pickup.module.scss";

/** Shared stacking counter: whatever was picked up last stays on top. */
let topZ = 10;

export type Spot = { x: number; y: number };

type Props = Omit<ComponentProps<typeof Column>, "children"> & {
  /** Accessible name of the object (e.g. the photo caption). */
  label: string;
  /** Resting tilt in degrees. */
  tilt?: number;
  /** Position on the wide desktop desk (>= 1200px), in % of the hero. */
  desk: Spot;
  /** Position in the pile on tablets (640–1199px), in % of the pile. */
  mid: Spot;
  /** Position in the pile on phones, in % of the pile. */
  pile: Spot;
  children: ReactNode;
};

/**
 * Something lying on the notebook page that can be picked up: it follows the
 * pointer, tilts with the drag speed, swings, and springs home on release.
 * Keyboard users can focus it and nudge it with Enter or Space.
 */
export function Pickup({
  label,
  tilt = 0,
  desk,
  mid,
  pile,
  className,
  style,
  children,
  ...rest
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const s = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    a: 0,
    va: 0,
    sc: 1,
    grabX: 0,
    grabY: 0,
    pvx: 0,
    pvy: 0,
    lastMove: 0,
    dragging: false,
    /** Touch only: the finger is down, but it is not yet clear if it scrolls or drags. */
    pending: false,
    downX: 0,
    downY: 0,
    raf: 0,
    last: 0,
  });

  useEffect(() => {
    const st = s.current;
    return () => cancelAnimationFrame(st.raf);
  }, []);

  const apply = () => {
    const st = s.current;
    const el = ref.current;
    if (!el) return;
    el.style.transform = `translate3d(${r5(st.x)}px, ${r5(st.y)}px, 0) rotate(${r5(tilt + st.a)}deg) scale(${r5(st.sc)})`;
  };

  const tick = (t: number) => {
    const st = s.current;
    const dt = st.last ? Math.min((t - st.last) / 1000, 1 / 30) : 1 / 60;
    st.last = t;

    if (st.dragging) {
      // Pointer speed decays when the pointer rests, so the tilt settles.
      st.pvx *= 0.86;
      st.pvy *= 0.86;
      const target = clamp(st.pvx * 0.028, -26, 26);
      [st.a, st.va] = springStep(st.a, st.va, target, 170, 11, dt);
    } else {
      [st.x, st.vx] = springStep(st.x, st.vx, 0, 105, 12.5, dt);
      [st.y, st.vy] = springStep(st.y, st.vy, 0, 105, 12.5, dt);
      [st.a, st.va] = springStep(st.a, st.va, -st.vx * 0.012, 150, 8, dt);
    }
    st.sc += ((st.dragging ? 1.055 : 1) - st.sc) * 0.22;
    apply();

    const settled =
      !st.dragging &&
      Math.abs(st.x) < 0.1 &&
      Math.abs(st.y) < 0.1 &&
      Math.abs(st.vx) < 1 &&
      Math.abs(st.vy) < 1 &&
      Math.abs(st.a) < 0.02 &&
      Math.abs(st.va) < 0.05 &&
      Math.abs(st.sc - 1) < 0.001;
    if (settled) {
      st.x = st.y = st.vx = st.vy = st.a = st.va = 0;
      st.sc = 1;
      st.last = 0;
      st.raf = 0;
      apply();
      return;
    }
    st.raf = requestAnimationFrame(tick);
  };

  const run = () => {
    const st = s.current;
    if (!st.raf) st.raf = requestAnimationFrame(tick);
  };

  const pickUp = (e: PointerEvent<HTMLDivElement>) => {
    const st = s.current;
    st.pending = false;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Synthetic or already released pointer: dragging still works without capture.
    }
    st.dragging = true;
    st.grabX = e.clientX - st.x;
    st.grabY = e.clientY - st.y;
    st.pvx = st.pvy = 0;
    st.lastMove = performance.now();
    topZ += 1;
    e.currentTarget.style.zIndex = String(topZ);
    e.currentTarget.classList.add(styles.held);
    run();
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion()) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (e.pointerType === "touch") {
      // On phones the pile fills the screen. touch-action: pan-y lets a vertical
      // swipe scroll the page; only a sideways start picks the item up.
      const st = s.current;
      st.pending = true;
      st.downX = e.clientX;
      st.downY = e.clientY;
      return;
    }
    pickUp(e);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const st = s.current;
    if (st.pending) {
      const dx = Math.abs(e.clientX - st.downX);
      const dy = Math.abs(e.clientY - st.downY);
      if (dx > 6 && dx > dy) pickUp(e);
      else if (dy > 10) st.pending = false;
      return;
    }
    if (!st.dragging) return;
    const now = performance.now();
    const dt = Math.max((now - st.lastMove) / 1000, 1 / 240);
    st.lastMove = now;
    const nx = e.clientX - st.grabX;
    const ny = e.clientY - st.grabY;
    // Smoothed pointer velocity in px/s.
    st.pvx = st.pvx * 0.6 + ((nx - st.x) / dt) * 0.4;
    st.pvy = st.pvy * 0.6 + ((ny - st.y) / dt) * 0.4;
    st.x = nx;
    st.y = ny;
  };

  const release = (e: PointerEvent<HTMLDivElement>) => {
    const st = s.current;
    st.pending = false;
    if (!st.dragging) return;
    st.dragging = false;
    // Carry a little of the throw into the way home.
    st.vx = clamp(st.pvx * 0.35, -1600, 1600);
    st.vy = clamp(st.pvy * 0.35, -1600, 1600);
    e.currentTarget.classList.remove(styles.held);
    run();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    if (prefersReducedMotion()) return;
    const st = s.current;
    st.va += (Math.random() > 0.5 ? 1 : -1) * 320;
    st.vy -= 160;
    run();
  };

  return (
    <Column
      ref={ref}
      className={classNames(styles.pickup, className)}
      role="group"
      aria-roledescription="Zum Anfassen"
      aria-label={label}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={release}
      onPointerCancel={release}
      onKeyDown={onKeyDown}
      style={
        {
          "--dx": `${desk.x}%`,
          "--dy": `${desk.y}%`,
          "--tx": `${mid.x}%`,
          "--ty": `${mid.y}%`,
          "--mx": `${pile.x}%`,
          "--my": `${pile.y}%`,
          transform: `rotate(${tilt}deg)`,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {children}
    </Column>
  );
}
