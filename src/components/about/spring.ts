/** Tiny damped spring step (semi-implicit Euler). Returns the new [value, velocity]. */
export function springStep(
  value: number,
  velocity: number,
  target: number,
  stiffness: number,
  damping: number,
  dt: number,
): [number, number] {
  const accel = -stiffness * (value - target) - damping * velocity;
  const v = velocity + accel * dt;
  return [value + v * dt, v];
}

/** Rubber band: past the limits the value keeps moving, but ever slower. */
export function rubber(value: number, min: number, max: number, give = 0.35): number {
  if (value > max) return max + (1 - 1 / ((value - max) * give + 1)) / give;
  if (value < min) return min - (1 - 1 / ((min - value) * give + 1)) / give;
  return value;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export const r5 = (v: number) => v.toFixed(5);
