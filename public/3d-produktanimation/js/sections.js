/* ═══════════════════════════════════════════
   SECTIONS — Einblenden & Chat-Abläufe
═══════════════════════════════════════════ */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Format-Kacheln (Karte „Für jede Fläche gerendert")
  const ICONS = {
    monitor: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M9 20h6M12 16v4"/>',
    led: '<rect x="2.5" y="5" width="19" height="11" rx="1"/><path d="M2.5 10.5h19M8.8 5v11M15.2 5v11"/>',
    tablet: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M11 18h2"/>',
    phone: '<rect x="7.5" y="3" width="9" height="18" rx="2"/><path d="M11 18h2"/>',
    cube: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',
    play: '<circle cx="12" cy="12" r="9"/><path d="M10 8.8v6.4l5.2-3.2z"/>',
    loop: '<path d="M17 2l3 3-3 3"/><path d="M4 11V9a4 4 0 0 1 4-4h12"/><path d="M7 22l-3-3 3-3"/><path d="M20 13v2a4 4 0 0 1-4 4H4"/>',
    vr: '<path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h15A1.5 1.5 0 0 1 21 8.5v6a1.5 1.5 0 0 1-1.5 1.5H16l-2-2.5h-4L8 16H4.5A1.5 1.5 0 0 1 3 14.5z"/>',
    projector: '<rect x="2.5" y="8" width="19" height="9" rx="2"/><circle cx="16" cy="12.5" r="2.5"/><path d="M6 12.5h4"/>',
    touch: '<path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5a1.5 1.5 0 0 1 3 0V12m0-1a1.5 1.5 0 0 1 3 0v3.5A6.5 6.5 0 0 1 11.5 21h-.6a6 6 0 0 1-4.6-2.2L3.8 15.6a1.5 1.5 0 0 1 2.3-1.9L9 16.5"/>',
    spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
  };
  const ROWS = [
    ['i:led', '4K', 'i:monitor', '16:9', 'i:touch', 'L:8K', 'i:tablet', 'HDR', 'i:play'],
    ['32:9', 'i:projector', 'Loop', 'L:i:cube', '9:16', 'i:phone', 'CAD', 'i:vr', 'STEP'],
    ['i:loop', 'ProRes', 'i:spark', '60 fps', 'i:led', 'L:MP4', 'i:monitor', 'AR', 'i:touch'],
    ['VR', 'i:tablet', '21:9', 'i:cube', 'L:i:play', 'OBJ', 'i:projector', '8K', 'i:phone'],
  ];
  const tile = (t) => {
    let cls = 'tile';
    if (t.startsWith('L:')) { cls += ' tile--light'; t = t.slice(2); }
    const inner = t.startsWith('i:')
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${ICONS[t.slice(2)]}</svg>`
      : t;
    return `<span class="${cls}">${inner}</span>`;
  };
  document.querySelectorAll('[data-formats]').forEach((el) => {
    el.innerHTML = ROWS.map((row) => {
      const set = `<div class="formats-set">${row.map(tile).join('')}</div>`;
      return `<div class="formats-row">${set}${set.replace('class="formats-set"', 'class="formats-set" aria-hidden="true"')}</div>`;
    }).join('');
  });

  // Rollende Ziffern: jede Ziffer läuft zweimal durch 0–9 und stoppt auf ihrem Wert
  const odos = document.querySelectorAll('[data-odo]');
  odos.forEach((el) => {
    const text = el.dataset.odo;
    let n = 0;
    el.innerHTML = `<span class="odo-sr">${text}</span>` + Array.from(text).map((ch) => {
      if (!/\d/.test(ch)) return `<span aria-hidden="true">${ch === ' ' ? '&nbsp;' : ch}</span>`;
      const d = +ch;
      const nums = [];
      for (let i = 0; i < 20 + d + 1; i++) nums.push(i % 10);
      const delay = (n++ * 0.12).toFixed(2);
      return `<span class="odo-col" aria-hidden="true"><span class="odo-sizer">${d}</span><span class="odo-reel" data-to="${20 + d}" style="--od:${delay}s">${nums.map((x) => `<span>${x}</span>`).join('')}</span></span>`;
    }).join('');
  });
  const rollOdo = (el) => el.querySelectorAll('.odo-reel').forEach((r) => {
    r.style.transform = `translateY(-${r.dataset.to}em)`;
  });
  if (reduce) {
    odos.forEach((el) => {
      el.querySelectorAll('.odo-reel').forEach((r) => { r.style.transition = 'none'; });
      rollOdo(el);
    });
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        rollOdo(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.6 });
    odos.forEach((el) => io.observe(el));
  }

  // Parallax für Hintergrundbilder (data-parallax = Stärke)
  const plx = Array.from(document.querySelectorAll('[data-parallax]'));
  if (plx.length && !reduce && !window.gsap) {
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = innerHeight;
      plx.forEach((el) => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const shift = (r.top + r.height / 2 - vh / 2) * -parseFloat(el.dataset.parallax);
        el.style.transform = `translateY(${shift.toFixed(1)}px) scaleX(-1)`;
      });
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update);
    update();
  }

  // Einblenden beim Scrollen
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (reduce) {
    revealEls.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    revealEls.forEach((el) => io.observe(el));
  }

  // Abläufe: Elemente mit data-step="n" erscheinen nacheinander,
  // data-hide="n" verschwindet bei Schritt n (z. B. "schreibt …").
  document.querySelectorAll('[data-sequence]').forEach((seq) => {
    const steps = Array.from(seq.querySelectorAll('[data-step]'));
    const gap = parseFloat(seq.dataset.sequence) || 700;
    const max = Math.max(...steps.map((s) => +s.dataset.step));

    const show = (n) => {
      steps.forEach((s) => {
        if (+s.dataset.step === n) s.classList.add('is-on');
        if (s.dataset.hide && +s.dataset.hide === n) s.classList.add('is-gone');
      });
    };

    if (reduce) {
      for (let i = 0; i <= max; i++) show(i);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      for (let i = 0; i <= max; i++) setTimeout(() => show(i), i * gap);
    }, { threshold: 0.35 });
    io.observe(seq);
  });
})();
