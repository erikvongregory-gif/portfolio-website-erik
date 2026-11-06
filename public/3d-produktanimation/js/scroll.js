/* ═══════════════════════════════════════════
   SCROLLEN: weiches Scrollen (Lenis) + Parallax der Hintergrund-Muster
═══════════════════════════════════════════ */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lenis = null;

  // Weiches, gedämpftes Scrollen
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9 });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  // Anker-Links (z. B. „Potenzialanalyse" im Header) weich anfahren
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    a.addEventListener('click', (e) => {
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { duration: 1.6 });
      else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  // Parallax: Muster bewegen sich langsamer/schneller als der Inhalt,
  // Kreise drehen sich dabei leicht mit.
  if (reduce) return;
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
