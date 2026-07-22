/** Shared pointer → CSS spotlight + per-element studio sheen. */

export function paintHeroSpotlight(
  root: HTMLElement,
  clientX: number,
  clientY: number,
  active: number,
) {
  const r = root.getBoundingClientRect();
  const w = r.width || 1;
  const h = r.height || 1;
  root.style.setProperty("--spot-x", `${((clientX - r.left) / w) * 100}%`);
  root.style.setProperty("--spot-y", `${((clientY - r.top) / h) * 100}%`);
  root.style.setProperty("--spot-active", String(active));

  root.querySelectorAll<HTMLElement>("[data-sheen]").forEach((el) => {
    const br = el.getBoundingClientRect();
    if (br.width < 8 || br.height < 8) return;
    el.style.setProperty("--mx", String((clientX - br.left) / br.width));
    el.style.setProperty("--my", String((clientY - br.top) / br.height));
    el.style.setProperty("--sheen", String(active));
  });
}

export function clearHeroSpotlight(root: HTMLElement) {
  root.style.setProperty("--spot-active", "0");
  root.querySelectorAll<HTMLElement>("[data-sheen]").forEach((el) => {
    el.style.setProperty("--sheen", "0");
  });
}

export function findMagneticHero(from: Element | null): HTMLElement | null {
  return from?.closest<HTMLElement>("[data-magnetic-hero]") ?? null;
}
