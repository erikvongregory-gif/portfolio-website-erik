/* ═══════════════════════════════════════════
   HERO LIGHT GLASS — reaktiver Hintergrund
   Vertikale Glas-Paneele links und rechts. Dahinter ein Lichtfleck,
   der dem Cursor folgt und im Glas gebrochen wird. Monochrom.
═══════════════════════════════════════════ */
(function () {
  const root = document.querySelector('[data-hero-light]');
  if (!root) return;
  const section = root.closest('section') || root.parentElement;

  // Layout in Prozent der Hero-Breite: Glas-Paneele [links, breite]
  const PANELS = {
    left:  [[2, 10], [17, 10]],
    right: [[73, 10], [88, 10]],
  };
  // Freiflächen zwischen den Paneelen [von, bis]
  const WALLS = {
    left:  [[0, 2], [12, 17], [27, 32]],
    right: [[68, 73], [83, 88], [98, 100]],
  };

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

  /* ── Texturen ─────────────────────────────── */
  // Weicher Lichtfleck. mix > 0 macht ihn etwas grauer (für das Glas).
  function blobTexture(size, mix) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(size, size);
    const d = img.data;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const nx = ((x + 0.5) / size * 2 - 1) * 2.3;
        const ny = ((y + 0.5) / size * 2 - 1) * 2.3;
        const r2 = nx * nx + ny * ny;
        const core = 0.62 * Math.exp(-r2 / 0.16);
        const halo = 0.30 * Math.exp(-r2 / 0.9);
        const sum = core + halo + 1e-6;
        let v = (1.0 * core + 0.72 * halo) / sum;          // Kern weiß, Halo hellgrau
        if (mix) v = v * (1 - mix) + 0.55 * mix;
        let a = Math.min(1, core + halo);
        a *= 1 - smooth(1.978, 2.3, Math.sqrt(r2));
        const p = (y * size + x) * 4;
        const dither = ((7 * x + 13 * y) % 5) / 5 - 0.4;
        d[p] = d[p + 1] = d[p + 2] = 255 * v;
        d[p + 3] = clamp(255 * a + dither, 0, 255);
      }
    }
    ctx.putImageData(img, 0, 0);
    return c;
  }

  // Schmale Lichtkante an den Paneel-Rändern
  function edgeTexture() {
    const W = 24, H = 256;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(W, H);
    const d = img.data;
    const tones = [0.86, 1, 0.74, 0.95, 0.62];
    const tone = (t) => {
      const l = 4 * clamp(t, 0, 1), i = Math.min(3, Math.floor(l)), f = l - i;
      return tones[i] + (tones[i + 1] - tones[i]) * f;
    };
    for (let y = 0; y < H; y++) {
      const ny = ((y + 0.5) / H * 2 - 1) * 0.8;
      const vy = Math.exp(-(ny * ny) / (0.42 * 0.21));
      for (let x = 0; x < W; x++) {
        const n = (x + 0.5) / W;
        const fall = (1 - smooth(0.45, 1, n)) * (0.5 + 0.5 * smooth(0, 0.1, n));
        const hot = 1 - smooth(0, 0.18, n);
        let v = tone(1 - n / 0.8);
        v = v + (1 - v) * 0.1;
        v = v + (1 - v) * hot * 0.8;
        const a = 0.85 * clamp(fall * vy * (0.7 + 0.3 * hot) * (n < 0.25 + 0.6 * vy ? 1 : 0.35), 0, 1);
        const p = (y * W + x) * 4;
        d[p] = d[p + 1] = d[p + 2] = 255 * v;
        d[p + 3] = 255 * a;
      }
    }
    ctx.putImageData(img, 0, 0);
    return c;
  }

  /* ── DOM aufbauen ─────────────────────────── */
  const panelsEl = document.createElement('div');
  panelsEl.className = 'hl-panels';
  const stage = document.createElement('div');
  stage.className = 'hl-stage';
  root.append(panelsEl, stage);

  const texWall = blobTexture(256, 0);
  const texGlass = blobTexture(256, 0.1);
  const texEdge = edgeTexture();

  const makeCanvas = (tex) => {
    const c = document.createElement('canvas');
    c.width = tex.width; c.height = tex.height;
    c.getContext('2d').drawImage(tex, 0, 0);
    return c;
  };
  const makeWin = (l, w) => {
    const win = document.createElement('div');
    win.className = 'hl-win';
    win.style.left = l + '%';
    win.style.width = w + '%';
    stage.appendChild(win);
    return win;
  };

  const sides = {};
  ['left', 'right'].forEach((side) => {
    const s = { walls: [], glass: [], edges: [] };
    WALLS[side].forEach(([a, b]) => {
      const c = makeCanvas(texWall);
      makeWin(a, b - a).appendChild(c);
      s.walls.push({ c, lPct: a, left: 0, size: 0, lastOp: 0 });
    });
    PANELS[side].forEach(([l, w], i) => {
      const p = document.createElement('div');
      p.className = 'hl-panel';
      p.style.left = l + '%';
      p.style.width = w + '%';
      panelsEl.appendChild(p);

      const c = makeCanvas(texGlass);
      makeWin(l, w).appendChild(c);
      s.glass.push({ c, lPct: l, wPct: w, left: 0, size: 0, cx: 0, i: i + (side === 'right' ? 2 : 0), lastOp: 0 });

      [[l, -1], [l + w, 1]].forEach(([pct, dir]) => {
        const e = makeCanvas(texEdge);
        e.className = 'hl-edge';
        stage.appendChild(e);
        s.edges.push({ c: e, pct, side: dir, x: 0, h: 0, lastOp: 0 });
      });
    });
    sides[side] = s;
  });

  /* ── Einstellungen ────────────────────────── */
  const hoverMQ = matchMedia('(hover: hover) and (pointer: fine)');
  const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
  const CFG_HOVER = { wall: 0.2, glass: 0.48, edge: 0.95, lens: 0.7, idleY: 0.3, ampIdle: 0.7, drift: 1 };
  const CFG_TOUCH = { wall: 0.24, glass: 0.3, edge: 0.75, lens: 0.9, idleY: 0.32, ampIdle: 0.8, drift: 1.4 };
  const IDLE_X = { left: 0.15, right: 0.85 };

  let W = 0, H = 0, R = 200, edgeW = 10, secTop = 0, secH = 0;

  function measure() {
    W = stage.clientWidth;
    H = stage.clientHeight;
    if (W <= 0 || H <= 0) return;
    R = clamp(0.2 * W, 150, 440);
    const panelW = W * PANELS.left[0][1] / 100;
    edgeW = clamp(0.09 * panelW, 7, 18);
    const wallSize = 4.6 * R * 1.15;
    const glassSize = 4.6 * R * 1.35;
    Object.values(sides).forEach((s) => {
      s.walls.forEach((t) => {
        t.size = wallSize;
        t.c.style.width = t.c.style.height = wallSize + 'px';
        t.left = W * t.lPct / 100;
      });
      s.glass.forEach((t) => {
        t.size = glassSize;
        t.c.style.width = t.c.style.height = glassSize + 'px';
        t.left = W * t.lPct / 100;
        t.cx = t.left + (W * t.wPct / 100) / 2;
      });
      s.edges.forEach((t) => {
        t.h = 1.6 * R;
        t.c.style.width = 1.5 * edgeW + 'px';
        t.c.style.height = t.h + 'px';
        t.x = W * t.pct / 100;
      });
    });
    secH = section.offsetHeight;
    let top = 0, el = section;
    while (el) { top += el.offsetTop; el = el.offsetParent; }
    secTop = top;
  }

  /* ── Zeichnen ─────────────────────────────── */
  function draw(s, cfg, x, y, gx, gy, vx, vy, amp, t, wob) {
    const k = Math.min(0.035 * Math.hypot(vx, vy), 0.7);
    const ang = Math.atan2(vy, vx);
    const cs = Math.cos(ang), sn = Math.sin(ang);
    const g = 1 + k, q = 1 / Math.sqrt(1 + k);
    const a = cs * cs * g + sn * sn * q;
    const b = cs * sn * (g - q);
    const d = sn * sn * g + cs * cs * q;

    for (const w of s.walls) {
      const op = Math.round(1e4 * amp * cfg.wall) / 1e4;
      if (op === 0 && w.lastOp === 0) continue;
      w.lastOp = op;
      const z = w.size;
      w.c.style.transform = `matrix(${a},${b},${b},${d},${x - w.left - (a * z / 2 + b * z / 2)},${y - (b * z / 2 + d * z / 2)})`;
      w.c.style.opacity = op.toFixed(4);
    }
    for (const p of s.glass) {
      const op = Math.round(1e4 * amp * cfg.glass) / 1e4;
      if (op === 0 && p.lastOp === 0) continue;
      p.lastOp = op;
      const i = p.i;
      const sy = 1 + 0.05 * wob * Math.sin(0.83 * t + 1.7 * i);
      const sx = 1 + 0.04 * wob * Math.sin(0.61 * t + 2.3 * i + 1);
      const m1 = a * cfg.lens * sx, m2 = b * cfg.lens * sx, m3 = b * sy, m4 = d * sy;
      const z = p.size;
      const tx = p.cx + (gx - p.cx) * cfg.lens + 0.025 * wob * R * Math.sin(0.47 * t + 1.1 * i) - p.left - (m1 * z / 2 + m3 * z / 2);
      const ty = gy + 0.04 * wob * R * Math.sin(0.39 * t + 0.9 * i) - (m2 * z / 2 + m4 * z / 2);
      p.c.style.transform = `matrix(${m1},${m2},${m3},${m4},${tx},${ty})`;
      p.c.style.opacity = op.toFixed(4);
    }
    for (const e of s.edges) {
      const dx = x - e.x;
      const facing = smooth(-0.12 * R, 0.12 * R, dx * e.side);
      const near = Math.exp(-(dx * dx) / (0.36 * R * 2 * (0.36 * R)));
      const op = Math.round(1e4 * amp * cfg.edge * near * (0.35 + 0.65 * facing)) / 1e4;
      if (op === 0 && e.lastOp === 0) continue;
      e.lastOp = op;
      const sc = 1 + Math.min(0.035 * Math.abs(vy), 0.8);
      const ey = y - 3 * vy - e.h * sc / 2;
      const flip = e.side < 0 ? 1 : -1;
      e.c.style.transform = `translate3d(${e.x}px,${ey}px,0) scale(${flip},${sc})`;
      e.c.style.opacity = op.toFixed(4);
    }
  }

  // Gedämpfte Feder
  const spring = (pos, vel, target, k, zeta, dt) => {
    const acc = k * (target - pos) - 2 * Math.sqrt(k) * zeta * vel;
    vel += acc * dt;
    return [pos + vel * dt, vel];
  };

  /* ── Steuerung ────────────────────────────── */
  let teardown = null;

  function start() {
    teardown && teardown();
    const hover = hoverMQ.matches;
    const reduce = reduceMQ.matches;
    const cfg = hover ? CFG_HOVER : CFG_TOUCH;
    const off = [];
    const on = (t, ev, fn, o) => { t.addEventListener(ev, fn, o); off.push(() => t.removeEventListener(ev, fn, o)); };

    measure();
    const scrollFade = () => 1 - smooth(0.35 * H, 0.9 * H, scrollY - secTop);

    // Statisch bei reduzierter Bewegung
    if (reduce) {
      const paint = () => {
        measure();
        const f = 0.75 * scrollFade();
        ['left', 'right'].forEach((k) => {
          const x = W * IDLE_X[k], y = H * cfg.idleY;
          draw(sides[k], cfg, x, y, x, y, 0, 0, f, 0, 0);
        });
        stage.setAttribute('data-on', '');
      };
      const ro = new ResizeObserver(paint);
      ro.observe(stage);
      on(window, 'scroll', paint, { passive: true });
      paint();
      teardown = () => { ro.disconnect(); off.forEach((f) => f()); };
      return;
    }

    const mkState = (k) => {
      const x = W * IDLE_X[k], y = H * cfg.idleY;
      return { x, y, vx: 0, vy: 0, gx: x, gy: y, gvx: 0, gvy: 0, svx: 0, svy: 0, amp: 0 };
    };
    const st = { left: mkState('left'), right: mkState('right') };

    let pointer = null, raf = 0, visible = true, last = 0, t0 = 0, first = true;

    if (hover) {
      on(window, 'pointermove', (e) => {
        if (e.pointerType === 'touch') return;
        pointer = { x: e.clientX, y: e.clientY };
        kick();
      }, { passive: true });
      const clear = () => { pointer = null; };
      on(document.documentElement, 'pointerleave', clear);
      on(window, 'blur', clear);
    }

    function frame(now) {
      raf = 0;
      if (!visible || document.visibilityState !== 'visible') return;
      const dt = last === 0 ? 0.016 : Math.min(0.05, (now - last) / 1000);
      last = now;
      if (t0 === 0) t0 = now;
      const time = (now - t0) / 1000;
      const fade = scrollFade();
      const rect = stage.getBoundingClientRect();
      const inHero = pointer && pointer.y >= rect.top && pointer.y <= rect.bottom;

      ['left', 'right'].forEach((k, idx) => {
        const s = st[k];
        // Der Lichtfleck auf der Seite, auf der der Cursor ist, folgt ihm
        const px = inHero ? pointer.x - rect.left : 0;
        const active = inHero && (k === 'left' ? px < W / 2 : px >= W / 2);
        let tx, ty;
        if (active) {
          tx = px; ty = pointer.y - rect.top;
        } else {
          const ph = idx * 2.1;
          const ex = cfg.drift * (0.035 * Math.sin(time * Math.PI * 2 / 17 + ph) + 0.01 * Math.sin(time * Math.PI * 2 / 7.3 + ph));
          const ey = 0.08 * cfg.drift * Math.sin(time * Math.PI * 2 / 23 + 1.3 + ph);
          tx = W * (IDLE_X[k] + ex);
          ty = H * (cfg.idleY + ey);
        }
        [s.x, s.vx] = spring(s.x, s.vx, tx, 175, 0.82, dt);
        [s.y, s.vy] = spring(s.y, s.vy, ty, 175, 0.82, dt);
        [s.gx, s.gvx] = spring(s.gx, s.gvx, s.x, 70, 0.72, dt);
        [s.gy, s.gvy] = spring(s.gy, s.gvy, s.y, 70, 0.72, dt);
        const sm = 1 - Math.exp(-15 * dt);
        s.svx += (s.vx / 60 - s.svx) * sm;
        s.svy += (s.vy / 60 - s.svy) * sm;
        const target = active ? 1 : cfg.ampIdle;
        s.amp += (target - s.amp) * (1 - Math.exp(-dt * (first ? 1.4 : 3)));
        draw(sides[k], cfg, s.x, s.y, s.gx, s.gy, s.svx, s.svy, s.amp * fade, time, 1);
      });

      if (first) { stage.setAttribute('data-on', ''); first = false; }
      raf = requestAnimationFrame(frame);
    }
    function kick() {
      if (raf === 0 && visible && document.visibilityState === 'visible') {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    }

    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => { visible = e.isIntersecting; if (visible) kick(); });
    });
    io.observe(section);
    on(document, 'visibilitychange', kick);
    const ro = new ResizeObserver(() => { measure(); kick(); });
    ro.observe(stage);
    on(window, 'resize', () => { measure(); kick(); });
    kick();

    teardown = () => {
      raf && cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      off.forEach((f) => f());
    };
  }

  hoverMQ.addEventListener('change', start);
  reduceMQ.addEventListener('change', start);
  start();
})();
