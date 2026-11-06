/* ═══════════════════════════════════════════
   SCROLLEN: weiches Scrollen (Lenis), getaktet über GSAP
   Lenis läuft im GSAP-Ticker und meldet jede Bewegung an ScrollTrigger,
   damit Scroll-Animationen exakt mit dem gedämpften Scrollen laufen.
═══════════════════════════════════════════ */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  let lenis = null;

  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  // Kein Pinch-Zoom in Safari (ergänzt touch-action im CSS)
  document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });

  // Weiches, gedämpftes Scrollen
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9 });
    if (hasGsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  window.lenis = lenis;

  // Anker-Links (z. B. „Potenzialanalyse" im Header) weich anfahren
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    a.addEventListener('click', (e) => {
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
      else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  // Parallax der Hintergrund-Muster: mit GSAP übernimmt motion.js.
  if (reduce || hasGsap) return;
  const page = document.querySelector('.page');
  const els = Array.from(document.querySelectorAll('.bp [data-speed]'));
  if (!page || !els.length) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    const y = scrollY - page.offsetTop;
    els.forEach((el) => {
      const ty = y * parseFloat(el.dataset.speed);
      const rot = el.dataset.rot ? ` rotate(${(y * parseFloat(el.dataset.rot)).toFixed(2)}deg)` : '';
      el.style.transform = `translate3d(0, ${ty.toFixed(1)}px, 0)${rot}`;
    });
  };
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();
