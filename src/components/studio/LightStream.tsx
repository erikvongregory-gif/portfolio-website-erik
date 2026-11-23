"use client";

import { useEffect, useRef } from "react";

/**
 * A river of light made of real EvGlab film frames.
 *
 * The running preview films are painted into a small atlas every other frame.
 * Each particle is a tiny chip cut from that atlas, travelling along a curved
 * path from a vanishing point towards the viewer. Additive blending turns the
 * dense middle white; the sparse edges keep the film colours plus a faint
 * chromatic split. Pulses of light run down the stream and, when they arrive,
 * light the giant word (via the `onPulseArrive` callback). The pointer bends it.
 */

const FILMS = [
  "evglab-flyover",
  "veyra",
  "tidely",
  "evglab-pendel",
  "gold-noir",
  "evglab-scalez",
  "osmo-pocket",
  "kontext",
];

const TILE_W = 160;
const TILE_H = 90;
const COLS = 4;

type Particle = {
  t: number;
  u: number;
  speed: number;
  tile: number;
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  alpha: number;
  edge: string | null;
  flicker: number;
};

type Pulse = { p: number; v: number; fired: boolean };

type Props = {
  className?: string;
  onPulseArrive?: () => void;
  /** "hero" = full first screen, "band" = quieter stream for CTA bands. */
  variant?: "hero" | "band";
};

const gauss = () => {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

/**
 * One shared set of film sources for every LightStream on the page (hero and
 * CTA band). Posters load right away (a few KB each); the preview videos only
 * after the page has loaded and the browser is idle, and never on phones,
 * with Save-Data or on slow connections. Videos play only while at least one
 * stream is visible.
 */
type FilmSource = {
  posters: HTMLImageElement[];
  videos: (HTMLVideoElement | null)[];
  playing: number;
};
let shared: FilmSource | null = null;

function getFilmSource(): FilmSource {
  if (shared) return shared;
  const source: FilmSource = {
    posters: FILMS.map((name) => {
      const img = new Image();
      img.decoding = "async";
      img.src = `/videos/${name}.webp`;
      return img;
    }),
    videos: FILMS.map(() => null),
    playing: 0,
  };
  shared = source;

  const conn = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;
  const lite =
    window.matchMedia("(max-width: 768px)").matches ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    conn?.saveData === true ||
    /(^|-)(2g|3g)$/.test(conn?.effectiveType ?? "");
  if (lite) return source;

  const loadVideos = () => {
    source.videos = FILMS.map((name) => {
      const v = document.createElement("video");
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.preload = "auto";
      v.setAttribute("muted", "");
      v.setAttribute("playsinline", "");
      v.src = `/videos/${name}-preview.mp4`;
      if (source.playing > 0) v.play().catch(() => {});
      return v;
    });
  };
  const whenIdle = () => {
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void })
      .requestIdleCallback;
    if (ric) ric(loadVideos, { timeout: 4000 });
    else setTimeout(loadVideos, 1500);
  };
  if (document.readyState === "complete") whenIdle();
  else window.addEventListener("load", whenIdle, { once: true });
  return source;
}

function playFilms(source: FilmSource) {
  source.playing += 1;
  if (source.playing === 1) for (const v of source.videos) v?.play().catch(() => {});
}

function pauseFilms(source: FilmSource) {
  source.playing = Math.max(0, source.playing - 1);
  if (source.playing === 0) for (const v of source.videos) v?.pause();
}

export function LightStream({ className, onPulseArrive, variant = "hero" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const arriveRef = useRef(onPulseArrive);
  arriveRef.current = onPulseArrive;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const band = variant === "band";
    const COUNT = Math.round((mobile ? 800 : 1900) * (band ? 0.5 : 1));

    // ——— Atlas of running films ———
    const atlas = document.createElement("canvas");
    atlas.width = TILE_W * COLS;
    atlas.height = TILE_H * Math.ceil(FILMS.length / COLS);
    const actx = atlas.getContext("2d");
    if (!actx) return;

    const source = getFilmSource();
    const posters = source.posters;

    const paintAtlas = () => {
      FILMS.forEach((_, i) => {
        const x = (i % COLS) * TILE_W;
        const y = Math.floor(i / COLS) * TILE_H;
        const v = source.videos[i];
        const p = posters[i];
        try {
          if (v && v.readyState >= 2) actx.drawImage(v, x, y, TILE_W, TILE_H);
          else if (p.complete && p.naturalWidth) actx.drawImage(p, x, y, TILE_W, TILE_H);
        } catch {
          /* frame not decodable yet */
        }
      });
    };

    // ——— Bloom buffer (low-res copy, scaled back up = cheap soft glow) ———
    const bloom = document.createElement("canvas");
    const bctx = bloom.getContext("2d");

    // ——— Geometry ———
    let W = 0;
    let H = 0;
    let dpr = 1;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = r.width;
      H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      bloom.width = Math.max(1, Math.round(W / 8));
      bloom.height = Math.max(1, Math.round(H / 8));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Pointer bend (smoothed)
    const pointer = { x: 0.5, y: 0.5, active: false };
    const bend = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = (e.clientX - r.left) / r.width;
      pointer.y = (e.clientY - r.top) / r.height;
      pointer.active = e.pointerType === "mouse";
    };
    const onLeave = () => {
      pointer.active = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    // Path control points in normalised space; mobile runs more upright.
    const base = band
      ? [
          [0.98, 0.06],
          [0.78, 0.2],
          [0.7, 0.62],
          [0.42, 1.18],
        ]
      : mobile
      ? [
          [0.8, 0.1],
          [0.62, 0.24],
          [0.42, 0.55],
          [1.05, 1.12],
        ]
      : [
          [0.86, 0.14],
          [0.62, 0.16],
          [0.58, 0.56],
          [0.14, 1.18],
        ];
    const cp = base.map((p) => [p[0], p[1]]);

    const point = (t: number, out: number[]) => {
      const m = 1 - t;
      const a = m * m * m;
      const b = 3 * m * m * t;
      const c = 3 * m * t * t;
      const d = t * t * t;
      out[0] = (a * cp[0][0] + b * cp[1][0] + c * cp[2][0] + d * cp[3][0]) * W;
      out[1] = (a * cp[0][1] + b * cp[1][1] + c * cp[2][1] + d * cp[3][1]) * H;
      // derivative
      const da = -3 * m * m;
      const db = 3 * m * m - 6 * m * t;
      const dc = 6 * m * t - 3 * t * t;
      const dd = 3 * t * t;
      out[2] = (da * cp[0][0] + db * cp[1][0] + dc * cp[2][0] + dd * cp[3][0]) * W;
      out[3] = (da * cp[0][1] + db * cp[1][1] + dc * cp[2][1] + dd * cp[3][1]) * H;
    };

    // ——— Particles ———
    const EDGE_LEFT = ["rgba(90,200,255,", "rgba(110,140,255,", "rgba(150,110,255,"];
    const EDGE_RIGHT = ["rgba(255,120,200,", "rgba(255,150,90,", "rgba(255,210,120,"];
    const spawn = (p: Particle | null, initial: boolean): Particle => {
      const u = Math.max(-1.7, Math.min(1.7, gauss() * 0.42));
      const tile = Math.floor(Math.random() * FILMS.length);
      const sw = 18 + Math.random() * 26;
      const sh = sw * (0.22 + Math.random() * 0.2);
      const abs = Math.abs(u);
      const edge =
        abs > 0.75
          ? (u < 0 ? EDGE_LEFT : EDGE_RIGHT)[Math.floor(Math.random() * 3)]
          : null;
      const next: Particle = p ?? ({} as Particle);
      next.t = initial ? Math.random() : Math.random() * 0.02;
      next.u = u;
      next.speed = 0.035 + Math.random() * 0.03;
      next.tile = tile;
      next.sx = (tile % COLS) * TILE_W + Math.random() * (TILE_W - sw);
      next.sy = Math.floor(tile / COLS) * TILE_H + Math.random() * (TILE_H - sh);
      next.sw = sw;
      next.sh = sh;
      next.alpha = 0.35 + Math.random() * 0.5 - abs * 0.15;
      next.edge = edge;
      next.flicker = Math.random() * Math.PI * 2;
      return next;
    };
    const particles: Particle[] = Array.from({ length: COUNT }, () => spawn(null, true));

    const pulses: Pulse[] = [];
    let nextPulse = 0.8;

    // ——— Loop ———
    let raf = 0;
    let last = performance.now();
    let time = 0;
    let frame = 0;
    let running = true;
    const pt = [0, 0, 0, 0];

    const step = (dt: number) => {
      time += dt;

      // bend toward pointer, idle sway otherwise
      const tx = pointer.active ? (pointer.x - 0.55) * 0.28 : Math.sin(time * 0.35) * 0.03;
      const ty = pointer.active ? (pointer.y - 0.45) * 0.18 : Math.cos(time * 0.27) * 0.02;
      bend.x += (tx - bend.x) * Math.min(1, dt * 2.2);
      bend.y += (ty - bend.y) * Math.min(1, dt * 2.2);
      cp[1][0] = base[1][0] + bend.x * 0.6;
      cp[1][1] = base[1][1] + bend.y * 0.6;
      cp[2][0] = base[2][0] + bend.x;
      cp[2][1] = base[2][1] + bend.y;

      nextPulse -= dt;
      if (nextPulse <= 0) {
        pulses.push({ p: 0, v: 0.38 + Math.random() * 0.12, fired: false });
        nextPulse = 1.6 + Math.random() * 1.6;
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pu = pulses[i];
        pu.p += pu.v * dt * (0.4 + pu.p * 1.4);
        if (!pu.fired && pu.p > 0.9) {
          pu.fired = true;
          arriveRef.current?.();
        }
        if (pu.p > 1.2) pulses.splice(i, 1);
      }

      for (const p of particles) {
        const d = p.t * p.t;
        p.t += p.speed * dt * (0.18 + d * 2.2);
        if (p.t > 1.02) spawn(p, false);
      }
    };

    const draw = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";

      // soft source light where the stream is born
      {
        const sx = cp[0][0] * W * dpr;
        const sy = cp[0][1] * H * dpr;
        const r = Math.max(W, H) * 0.09 * dpr;
        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, r);
        g.addColorStop(0, "rgba(220,245,255,0.35)");
        g.addColorStop(0.35, "rgba(120,190,230,0.10)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(sx - r, sy - r, r * 2, r * 2);
      }

      const px = pointer.x * W;
      const py = pointer.y * H;
      const R = Math.min(W, H) * 0.16;

      for (const p of particles) {
        const t = p.t;
        point(t, pt);
        const d = Math.pow(t, 1.7);
        const len = Math.hypot(pt[2], pt[3]) || 1;
        const tx = pt[2] / len;
        const ty = pt[3] / len;
        const nx = -ty;
        const ny = tx;
        const width = (mobile ? 0.012 : 0.008) * W + d * (mobile ? 0.26 : 0.21) * W;
        let x = pt[0] + nx * p.u * width;
        let y = pt[1] + ny * p.u * width;

        // local push away from the pointer
        if (pointer.active) {
          const dx = x - px;
          const dy = y - py;
          const dist = Math.hypot(dx, dy);
          if (dist < R && dist > 0.1) {
            const f = (1 - dist / R) * (1 - dist / R) * R * 0.35;
            x += (dx / dist) * f;
            y += (dy / dist) * f;
          }
        }

        const size = 1.6 + d * (mobile ? 24 : 46);
        const fadeIn = Math.min(1, t * 14);
        let boost = 0;
        for (const pu of pulses) {
          const k = (t - pu.p) / 0.035;
          boost += Math.exp(-k * k);
        }
        const flick = 0.85 + 0.15 * Math.sin(time * 3 + p.flicker);
        const a = Math.min(1, p.alpha * fadeIn * flick * (0.55 + 0.6 * (1 - Math.abs(p.u) / 1.7)));

        const sw = size;
        const sh = size * (p.sh / p.sw);
        const s = dpr;
        ctx.setTransform(tx * s, ty * s, -ty * s, tx * s, x * s, y * s);

        ctx.globalAlpha = a;
        ctx.drawImage(atlas, p.sx, p.sy, p.sw, p.sh, -sw / 2, -sh / 2, sw, sh);

        if (p.edge) {
          ctx.globalAlpha = 1;
          ctx.fillStyle = `${p.edge}${(0.32 * a).toFixed(3)})`;
          ctx.fillRect(-sw / 2, -sh / 2, sw, sh);
        }
        if (boost > 0.02) {
          ctx.globalAlpha = 1;
          ctx.fillStyle = `rgba(255,255,255,${Math.min(0.8, boost * 0.55 * a).toFixed(3)})`;
          ctx.fillRect(-sw / 2, -sh / 2, sw, sh);
        }
      }
      // bloom pass
      if (bctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        bctx.globalCompositeOperation = "copy";
        bctx.drawImage(canvas, 0, 0, bloom.width, bloom.height);
        ctx.imageSmoothingEnabled = true;
        ctx.globalAlpha = 0.85;
        ctx.drawImage(bloom, 0, 0, canvas.width, canvas.height);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (frame++ % 2 === 0) paintAtlas();
      step(dt);
      draw();
      if (running) raf = requestAnimationFrame(loop);
    };

    let holdsFilms = false;
    const start = () => {
      if (running && raf) return;
      running = true;
      last = performance.now();
      if (!holdsFilms) {
        holdsFilms = true;
        playFilms(source);
      }
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
      raf = 0;
      if (holdsFilms) {
        holdsFilms = false;
        pauseFilms(source);
      }
    };

    if (reduced) {
      // One settled, still frame from the posters.
      running = false;
      const paintStill = () => {
        paintAtlas();
        draw();
      };
      Promise.all(posters.map((p) => p.decode().catch(() => {}))).then(paintStill);
      return () => {
        ro.disconnect();
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerleave", onLeave);
      };
    }

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting && !document.hidden ? start() : stop()),
      { threshold: 0 },
    );
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    running = false;
    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [variant]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
