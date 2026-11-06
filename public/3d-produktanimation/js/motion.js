/* ═══════════════════════════════════════════
   MOTION — GSAP + ScrollTrigger + SplitText, synchron mit Lenis
   Ruhig und gerichtet: Zeilen steigen aus einer Maske, Flächen öffnen sich,
   Hintergrund-Zeichnung entsteht beim Scrollen. Bei „reduzierte Bewegung“
   läuft nichts davon, die Seite zeigt alles sofort.
═══════════════════════════════════════════ */
(function () {
  const html = document.documentElement;
  const release = () => html.classList.remove('motion-pending');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !window.gsap || !window.ScrollTrigger) { release(); return; }

  const hasSplit = !!window.SplitText;
  gsap.registerPlugin(ScrollTrigger);
  if (hasSplit) gsap.registerPlugin(SplitText);
  html.classList.add('has-motion');

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const EASE = 'power4.out';
  const PLAY = 'play none none none'; // einmal abspielen, Trigger bleibt bestehen
  const SHADOW = 'drop-shadow(0 30px 60px rgba(0,0,0,0.9))';
  const isMobile = matchMedia('(max-width: 809px)').matches;

  // Zeilen aus einer Maske heben (Überschriften)
  function splitLines(el, vars, trigger) {
    if (!hasSplit) {
      return gsap.from(el, Object.assign({ y: 30, autoAlpha: 0, duration: 1.2, ease: EASE }, trigger ? { scrollTrigger: trigger } : {}, vars && vars.delay != null ? { delay: vars.delay } : {}));
    }
    let tween;
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'm-line',
      autoSplit: true,
      onSplit(self) {
        tween = gsap.from(self.lines, Object.assign({
          yPercent: 108,
          duration: 1.25,
          ease: EASE,
          stagger: 0.085,
        }, vars, trigger ? { scrollTrigger: trigger } : {}));
        return tween;
      },
    });
    return tween;
  }

  // Elemente weich von unten einblenden
  function rise(targets, trigger, vars) {
    targets = gsap.utils.toArray(targets).filter(Boolean);
    if (!targets.length) return;
    gsap.from(targets, Object.assign({
      y: 32,
      autoAlpha: 0,
      duration: 1.1,
      ease: EASE,
      stagger: 0.1,
      scrollTrigger: { trigger, start: 'clamp(top 86%)', toggleActions: PLAY },
    }, vars));
  }

  /* ── 1 · Hero: Auftritt ─────────────────────── */
  const hero = $('#hero');
  const statueL = $('.hero-statue--left');
  const statueR = $('.hero-statue--right');
  const heroInner = $('.hero-inner');

  const intro = gsap.timeline({ defaults: { ease: EASE }, delay: 0.15 });
  if (statueL && statueR) {
    intro
      .fromTo([statueL, statueR],
        { autoAlpha: 0, filter: 'blur(14px) ' + SHADOW, xPercent: (i) => (i ? 16 : -16) },
        { autoAlpha: 1, filter: 'blur(0px) ' + SHADOW, xPercent: 0, duration: 2.4, ease: 'expo.out' }, 0);
  }
  const headerEl = $('.site-header');
  if (headerEl) intro.from(headerEl, { y: -16, autoAlpha: 0, duration: 1.2 }, 0.55);
  const title = $('.hero-title');
  // Titel als Ganzes (Zeilen-Zerlegung würde den Umbruch an „Messe-“ verändern)
  if (title) {
    intro.fromTo(title,
      { y: 36, autoAlpha: 0, filter: 'blur(10px)' },
      { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 1.7, clearProps: 'filter' }, 0.25);
  }
  intro.from(['.hero-sub', '.hero-teaser'].map((s) => $(s)).filter(Boolean),
    { y: 22, autoAlpha: 0, duration: 1.3, stagger: 0.14 }, 0.85);

  // Startzustände sind gesetzt: Hero darf sichtbar werden
  release();

  // Hero beim Weiterscrollen: Statuen weichen zur Seite, Text tritt zurück
  if (hero && statueL && statueR && heroInner) {
    gsap.timeline({
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
    })
      .to(statueL, { x: () => -innerWidth * 0.07, y: () => innerHeight * 0.08, ease: 'none' }, 0)
      .to(statueR, { x: () => innerWidth * 0.07, y: () => innerHeight * 0.08, ease: 'none' }, 0)
      .to(heroInner, { y: () => -innerHeight * 0.12, opacity: 0.1, ease: 'none' }, 0);
  }

  /* ── 2 · Technische Zeichnung im Hintergrund ── */
  const page = $('.page');
  if (page) {
    // Senkrechte Hilfslinien zeichnen sich mit dem Scrollen
    gsap.fromTo('.bp-v', { scaleY: 0, transformOrigin: '50% 0%' }, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: page, start: 'clamp(top 80%)', end: 'bottom bottom', scrub: 0.6 },
    });
    // Waagerechte Linien und Kreuze, sobald sie ins Bild kommen
    $$('.bp-h').forEach((el) => {
      gsap.fromTo(el, { scaleX: 0, transformOrigin: '0% 50%' }, {
        scaleX: 1, duration: 1.8, ease: 'power3.inOut',
        scrollTrigger: { trigger: el, start: 'clamp(top 85%)', toggleActions: PLAY },
      });
    });
    $$('.bp-x').forEach((el) => {
      gsap.from(el, {
        autoAlpha: 0, rotation: -90, scale: 0.4, duration: 1.2, ease: 'back.out(2)',
        scrollTrigger: { trigger: el, start: 'clamp(top 85%)', toggleActions: PLAY },
      });
    });
    // Parallax der Zeichnungen (data-speed, data-rot wie zuvor)
    $$('.bp [data-speed]').forEach((el) => {
      const speed = parseFloat(el.dataset.speed) || 0;
      const rot = parseFloat(el.dataset.rot) || 0;
      const dist = () => Math.max(0, page.offsetHeight - innerHeight);
      gsap.fromTo(el, { y: 0, rotation: 0 }, {
        y: () => dist() * speed,
        rotation: () => dist() * rot,
        ease: 'none',
        scrollTrigger: { trigger: page, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true },
      });
    });
  }

  /* ── 3 · Überschriften ─────────────────────── */
  $$('.page .h2').forEach((h) => {
    splitLines(h, {}, { trigger: h, start: 'clamp(top 86%)', toggleActions: PLAY });
  });

  /* ── 4 · Drei Faktoren ─────────────────────── */
  const factorsHead = $('.factors-head');
  if (factorsHead) rise($('p', factorsHead), factorsHead, { delay: 0.25 });
  const factors = $$('.factor');
  if (factors.length) {
    gsap.from(factors, {
      y: 70, autoAlpha: 0, duration: 1.3, ease: EASE, stagger: 0.14,
      scrollTrigger: { trigger: '.factors', start: 'clamp(top 84%)', toggleActions: PLAY },
    });
    gsap.fromTo($$('.factor-media'),
      { clipPath: 'inset(100% 0% 0% 0% round 20px)' },
      {
        clipPath: 'inset(0% 0% 0% 0% round 20px)', duration: 1.5, ease: 'expo.out', stagger: 0.14,
        scrollTrigger: { trigger: '.factors', start: 'clamp(top 84%)', toggleActions: PLAY },
        onComplete() { gsap.set(this.targets(), { clearProps: 'clipPath' }); },
      });
  }

  /* ── 5 · Bento-Karten ──────────────────────── */
  $$('.bcard').forEach((card) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'clamp(top 86%)', toggleActions: PLAY } });
    tl.from(card, { y: 80, autoAlpha: 0, scale: 0.97, duration: 1.4, ease: EASE })
      .from($$('.bcard-title, .bcard-text, .btn-pill', card), {
        y: 18, autoAlpha: 0, duration: 1, ease: EASE, stagger: 0.08,
      }, 0.3);
  });

  /* ── 6 · Vergleich ─────────────────────────── */
  const compareHead = $('.compare-head');
  if (compareHead) rise($('.badge', compareHead), compareHead);
  const table = $('.compare-table');
  if (table) {
    const tl = gsap.timeline({ scrollTrigger: { trigger: table, start: 'clamp(top 82%)', toggleActions: PLAY } });
    tl.from(table, { y: 50, autoAlpha: 0, duration: 1.2, ease: EASE })
      .from('.compare-col--with', { x: isMobile ? 0 : -40, y: isMobile ? 30 : 0, autoAlpha: 0, duration: 1.2, ease: EASE }, 0.15)
      .from('.compare-col--without', { x: isMobile ? 0 : 40, y: isMobile ? 30 : 0, autoAlpha: 0, duration: 1.2, ease: EASE }, 0.25)
      .from('.compare-col--with .compare-list li', { x: -14, autoAlpha: 0, duration: 0.8, ease: EASE, stagger: 0.07 }, 0.5)
      .from('.compare-col--without .compare-list li', { x: -14, autoAlpha: 0, duration: 0.8, ease: EASE, stagger: 0.07 }, 0.6)
      .from('.compare-vs', { autoAlpha: 0, duration: 0.6, ease: 'power2.out' }, 0.9);
    const bg = $('.compare-bg');
    if (bg) {
      gsap.fromTo(bg, { yPercent: -6, scale: 1.18 }, {
        yPercent: 6, scale: 1.18, ease: 'none',
        scrollTrigger: { trigger: table, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }
  }

  /* ── 7 · Gespräch (CTA) ────────────────────── */
  const ctaHead = $('.cta-head');
  if (ctaHead) rise($$('.badge, .btn-swap', ctaHead), ctaHead, { delay: 0.2 });
  const ctaMedia = $('.cta-media');
  if (ctaMedia) {
    gsap.fromTo(ctaMedia,
      { clipPath: 'inset(12% 10% 12% 10% round 14px)', autoAlpha: 0 },
      {
        clipPath: 'inset(0% 0% 0% 0% round 14px)', autoAlpha: 1, duration: 1.6, ease: 'expo.out',
        scrollTrigger: { trigger: ctaMedia, start: 'clamp(top 85%)', toggleActions: PLAY },
        onComplete() { gsap.set(ctaMedia, { clearProps: 'clipPath' }); },
      });
    rise($('.cta-media-content', ctaMedia), ctaMedia, { delay: 0.5 });
  }
  const ctaCard = $('.cta-card');
  if (ctaCard) {
    const tl = gsap.timeline({ scrollTrigger: { trigger: ctaCard, start: 'clamp(top 86%)', toggleActions: PLAY } });
    tl.from(ctaCard, { y: 60, autoAlpha: 0, duration: 1.3, ease: EASE, delay: 0.12 })
      .from($$('.cta-stat', ctaCard), { y: 14, autoAlpha: 0, duration: 0.9, ease: EASE, stagger: 0.1 }, 0.5)
      .from($$('.cta-divider', ctaCard), { scaleX: 0, transformOrigin: '0% 50%', duration: 1, ease: 'power3.inOut', stagger: 0.1 }, 0.55);
  }

  /* ── 8 · Potenzialanalyse ──────────────────── */
  const check = $('.check-copy');
  if (check) {
    rise($('.check-eyebrow', check), check);
    rise($$('.check-intro, .check-learn', check), check, { delay: 0.3, stagger: 0.12 });
    const list = $('.check-list', check);
    if (list) {
      gsap.from($$('li', list), {
        x: -24, autoAlpha: 0, duration: 1, ease: EASE, stagger: 0.09,
        scrollTrigger: { trigger: list, start: 'clamp(top 84%)', toggleActions: PLAY },
      });
    }
    rise($('.check-actions', check), $('.check-actions', check));
  }
  const checkImg = $('.check-bg img');
  if (checkImg) {
    gsap.fromTo(checkImg, { y: () => innerHeight * 0.12 }, {
      y: () => -innerHeight * 0.12, ease: 'none',
      scrollTrigger: { trigger: '.check', start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
    });
  }

  /* ── 9 · Footer ────────────────────────────── */
  const footer = $('.site-footer');
  if (footer) {
    const logo = $('.footer-logo', footer);
    if (logo) splitLines(logo, { yPercent: 110, duration: 1.4 }, { trigger: footer, start: 'clamp(top 88%)', toggleActions: PLAY });
    rise([$('.footer-claim', footer)].concat($$('.footer-col', footer)), footer, { delay: 0.15, stagger: 0.08 });
    rise($('.footer-bottom', footer), footer, { delay: 0.6 });
  }

  // Nach Schriften und Bildern neu vermessen
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());
})();
