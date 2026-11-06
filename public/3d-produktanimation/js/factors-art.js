/* ═══════════════════════════════════════════
   DREI FAKTOREN — animierte Strichzeichnungen
   Die SVGs werden eingebettet und in zwei Ebenen geteilt:
   Hintergrund (Fläche, Körnung, Filter) bleibt statisch,
   die Linien liegen auf einer eigenen Ebene und werden animiert.
   01 Linse:   Kreise fahren zusammen, Linse öffnet sich, Ring dreht.
   02 Schichten: Explosionsansicht, Schichten fahren auseinander und atmen.
   03 Brücke:  Würfel zeichnen sich, Röhre wächst, Punkt pendelt hinüber.
═══════════════════════════════════════════ */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !window.gsap || !window.ScrollTrigger || !window.DrawSVGPlugin) return;
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

  const NS = 'http://www.w3.org/2000/svg';
  const LINE = /^(l|d|t|k|w)$/;
  const PLAY = 'play none none none';

  // Klassen-Selektoren auf die eingebettete Grafik begrenzen
  const scopeCss = (css, scope) =>
    css.replace(/(^|[{},])(\s*)\.([a-zA-Z][\w-]*)/g, (m, p, s, c) => `${p}${s}${scope} .${c}`);

  const svgEl = () => {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 1200 1200');
    s.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    s.setAttribute('focusable', 'false');
    return s;
  };

  const path = (d, cls) => {
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d);
    p.setAttribute('class', cls);
    return p;
  };

  async function embed(img, n) {
    const res = await fetch(img.currentSrc || img.src);
    if (!res.ok) throw new Error('svg ' + res.status);
    let txt = await res.text();
    txt = txt
      .replace(/id="([\w-]+)"/g, `id="f${n}-$1"`)
      .replace(/url\(#([\w-]+)\)/g, `url(#f${n}-$1)`);
    const src = new DOMParser().parseFromString(txt, 'image/svg+xml').documentElement;
    if (src.nodeName !== 'svg') throw new Error('svg parse');

    const wrap = document.createElement('span');
    wrap.className = 'fsvg' + (img.classList.contains('is-mono') ? ' is-mono' : '');
    wrap.dataset.fsvg = n;
    wrap.setAttribute('aria-hidden', 'true');
    const bg = svgEl();
    const fg = svgEl();
    fg.classList.add('fsvg-lines');

    const style = src.querySelector('style');
    if (style) {
      const st = document.createElementNS(NS, 'style');
      st.textContent = scopeCss(style.textContent, `[data-fsvg="${n}"]`);
      bg.appendChild(st);
    }
    const lines = [];
    Array.from(src.children).forEach((ch) => {
      if (ch.nodeName === 'style') return;
      const node = document.importNode(ch, true);
      if (LINE.test(node.getAttribute('class') || '')) { fg.appendChild(node); lines.push(node); }
      else bg.appendChild(node);
    });
    wrap.append(bg, fg);
    img.replaceWith(wrap);
    return { wrap, fg, lines };
  }

  /* ── 01 · Linse ────────────────────────────── */
  function lens(L) {
    const [axes, ring, cl, cr, lensE, dl, drw, drl, dc] = L;
    const O = '600 600';
    gsap.set([cl, cr], { drawSVG: '0%' });
    const intro = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
      .fromTo(ring, { opacity: 0, rotation: -120, svgOrigin: O }, { opacity: 1, rotation: 0, duration: 2.4 }, 0)
      .fromTo(axes, { opacity: 0, scale: 0.15, svgOrigin: O }, { opacity: 1, scale: 1, duration: 1.8 }, 0.1)
      .fromTo([cl, dl], { x: -180 }, { x: 0, duration: 2 }, 0.15)
      .fromTo([cr, drw, drl], { x: 180 }, { x: 0, duration: 2 }, 0.15)
      .to([cl, cr], { drawSVG: '100%', duration: 1.7, ease: 'power2.inOut' }, 0.15)
      .fromTo([dl, drw, drl], { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power1.out' }, 0.6)
      .fromTo(lensE, { scaleY: 0, opacity: 0, svgOrigin: O }, { scaleY: 1, opacity: 1, duration: 1.3, ease: 'back.out(1.7)' }, 1.2)
      .fromTo(dc, { scale: 0, svgOrigin: O }, { scale: 1, duration: 0.8, ease: 'back.out(3)' }, 1.55);
    const idle = () => [
      gsap.to(ring, { rotation: '+=360', svgOrigin: O, duration: 90, ease: 'none', repeat: -1 }),
      gsap.timeline({ repeat: -1, yoyo: true, defaults: { duration: 2.6, ease: 'sine.inOut' } })
        .to([cl, dl], { x: 22 }, 0)
        .to([cr, drw, drl], { x: -22 }, 0)
        .to(lensE, { scaleX: 1.45, svgOrigin: O }, 0)
        .to(dc, { scale: 1.35, svgOrigin: O }, 0),
    ];
    return { intro, idle };
  }

  /* ── 02 · Schichten (Explosionsansicht) ───── */
  function slabs(L, fg) {
    // Letzter Punkt-Pfad enthält auch die senkrechte Achse: trennen
    const d3 = L[7];
    d3.setAttribute('d', 'M600 195 924.75 382.5M600 195 275.25 382.5M600 195v-17.5');
    const axis = path('M600 595V57.5M600 970V432.5M600 820V220', 'd');
    fg.insertBefore(axis, fg.firstChild); // hinter die Schichten
    const dot = L[8];
    const layers = [[L[0], L[1]], [L[2], L[3]], [L[4], L[5]], [L[6], L[7], dot]];
    const STEP = 112.5;

    const intro = gsap.timeline({ paused: true });
    layers.forEach((g, k) => {
      intro.fromTo(g, { y: k * STEP }, { y: 0, duration: 1.9, ease: 'expo.out' }, 0.35 + (3 - k) * 0.08);
      if (k) intro.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power1.out' }, 0.35);
    });
    intro.fromTo(layers[0], { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0)
      .fromTo(axis, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power1.out' }, 0.9)
      .fromTo(dot, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.8, ease: 'back.out(3)' }, 1.5);

    const idle = () => [
      gsap.timeline({ repeat: -1, yoyo: true, defaults: { duration: 2.8, ease: 'sine.inOut' } })
        .to(layers[1], { y: -8 }, 0)
        .to(layers[2], { y: -16 }, 0)
        .to(layers[3], { y: -24 }, 0),
      gsap.to(axis, { strokeDashoffset: -20.4, duration: 1.1, ease: 'none', repeat: -1 }),
    ];
    return { intro, idle };
  }

  /* ── 03 · Brücke ───────────────────────────── */
  function cubes(L, fg) {
    const [c1l, c1d, c2l, c2d, e1, e2, tube, diag, dot] = L;
    // Röhre in zwei Linien teilen, damit beide gleichzeitig wachsen
    tube.setAttribute('d', 'M414.33 419.39l327.34 189');
    const tube2 = path('M458.33 495.61l327.34 189', 'l');
    tube.after(tube2);
    const E1 = { x: 436.33 - 600, y: 457.5 - 552 };
    const E2 = { x: 763.67 - 600, y: 646.5 - 552 };

    gsap.set([c1l, c2l, tube, tube2], { drawSVG: '0%' });
    const intro = gsap.timeline({ paused: true })
      .to(c1l, { drawSVG: '100%', duration: 1.5, ease: 'power2.inOut' }, 0.2)
      .to(c2l, { drawSVG: '100%', duration: 1.5, ease: 'power2.inOut' }, 0.45)
      .fromTo([c1d, c2d], { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power1.out' }, 1.1)
      .fromTo(diag, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power1.out' }, 1.2)
      .fromTo(e1, { scale: 0, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(2.2)' }, 1.3)
      .to([tube, tube2], { drawSVG: '100%', duration: 1, ease: 'power2.inOut' }, 1.5)
      .fromTo(dot, { x: E1.x, y: E1.y, scale: 0, transformOrigin: '50% 50%' }, { x: 0, y: 0, scale: 1, duration: 1, ease: 'power2.inOut' }, 1.5)
      .fromTo(e2, { scale: 0, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(2.2)' }, 2.3);

    const idle = () => [
      gsap.timeline({ repeat: -1, repeatDelay: 0.3 })
        .to(dot, { x: E2.x, y: E2.y, duration: 1.3, ease: 'power2.inOut' })
        .to(e2, { scale: 1.12, duration: 0.25, yoyo: true, repeat: 1, ease: 'power1.out' }, '>-0.1')
        .to(dot, { x: E1.x, y: E1.y, duration: 1.3, ease: 'power2.inOut' }, '+=0.35')
        .to(e1, { scale: 1.12, duration: 0.25, yoyo: true, repeat: 1, ease: 'power1.out' }, '>-0.1')
        .to(dot, { x: 0, y: 0, duration: 0.65, ease: 'power2.inOut' }, '+=0.35'),
      gsap.to(diag, { strokeDashoffset: -20.4, duration: 1, ease: 'none', repeat: -1 }),
    ];
    return { intro, idle };
  }

  const KINDS = { lens, slabs, cubes };

  /* ── Start ─────────────────────────────────── */
  const imgs = Array.from(document.querySelectorAll('.factor-media img'));
  imgs.forEach((img, i) => {
    const kind = (img.getAttribute('src').match(/line-(\w+)-/) || [])[1];
    if (!KINDS[kind]) return;
    embed(img, i + 1).then(({ wrap, fg, lines }) => {
      const { intro, idle } = KINDS[kind](lines, fg);
      let loops = null;
      let visible = false;
      const sync = () => {
        if (!loops) return;
        loops.forEach((t) => (visible ? t.resume() : t.pause()));
      };
      intro.eventCallback('onComplete', () => { loops = idle(); sync(); });

      // Einmal abspielen, wenn die Karten ins Bild kommen (Karte blendet zuerst auf)
      // IntersectionObserver statt ScrollTrigger: erkennt auch das seitliche
      // Wischen durch die Karten auf dem Handy.
      let started = false;
      new IntersectionObserver((entries) => {
        const e = entries[0];
        visible = e.isIntersecting;
        if (visible && !started && e.intersectionRatio >= 0.35) {
          started = true;
          gsap.delayedCall(0.35, () => intro.play()); // Karte blendet zuerst auf
        }
        sync();
      }, { threshold: [0, 0.35] }).observe(wrap);
    }).catch(() => { /* Bild bleibt als statische Grafik stehen */ });
  });
})();
