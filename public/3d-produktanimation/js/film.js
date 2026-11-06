/* ═══════════════════════════════════════════
   IMAGEFILM — adaptives Streaming (HLS) aus Vercel Blob
   - Lädt nichts, bis die Bühne in die Nähe kommt (nur das 20-KB-Vorschaubild).
   - Qualität richtet sich nach Leitung und Playergröße: Handy 720p/1080p,
     Desktop 1080p/1440p, 4K-Bildschirm und Vollbild bis 2160p.
   - Startet stumm im Bild, pausiert außerhalb. Ton und Vollbild per Knopf.
   - Bei „Daten sparen“ oder „reduzierte Bewegung“: Start erst per Klick.
═══════════════════════════════════════════ */
(function () {
  const video = document.querySelector('.film-video');
  if (!video) return;
  const frame = video.closest('.film-frame');
  const src = video.dataset.hls;
  const playBtn = frame.querySelector('[data-film="play"]');
  const soundBtn = frame.querySelector('[data-film="sound"]');
  const fsBtn = frame.querySelector('[data-film="fullscreen"]');
  const qualityEl = frame.querySelector('.film-quality');
  const HLS_JS = '/3d-produktanimation/js/vendor/hls.light.min.js';

  const conn = navigator.connection || {};
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const autoplay = !reduce && !conn.saveData;
  const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);
  const nativeHls = !!video.canPlayType('application/vnd.apple.mpegurl');

  let ready = null; // Promise: Quelle ist angehängt
  let inView = false;
  let userStarted = false;
  let hls = null;

  const label = (h) => (h >= 2000 ? '4K' : h ? h + 'p' : '');
  const showQuality = (h) => { if (qualityEl) qualityEl.textContent = label(h); };

  function loadScript(url) {
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = url;
      s.async = true;
      s.onload = res;
      s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  function attach() {
    return ready || (ready = connect());
  }

  async function connect() {
    // Safari (macOS/iOS) spielt HLS nativ: sparsam und mit AirPlay
    if (isSafari && nativeHls) {
      video.src = src;
      video.addEventListener('resize', () => showQuality(video.videoHeight));
      return;
    }
    try {
      if (!window.Hls) await loadScript(HLS_JS);
    } catch (e) { /* Skript nicht ladbar */ }
    if (window.Hls && Hls.isSupported()) {
      hls = new Hls({
        capLevelToPlayerSize: true,   // nie größer als der Player (inkl. Pixeldichte)
        startLevel: -1,
        autoStartLoad: false,         // Segmente erst beim Abspielen laden
        abrEwmaDefaultEstimate: 4e6,  // vorsichtiger Start, schaltet dann hoch
        maxBufferLength: 20,
        maxMaxBufferLength: 40,
        backBufferLength: 30,
      });
      hls.on(Hls.Events.LEVEL_SWITCHED, (_, d) => {
        const lvl = hls.levels[d.level];
        if (lvl) showQuality(lvl.height);
      });
      hls.on(Hls.Events.ERROR, (_, d) => {
        if (!d.fatal) return;
        if (d.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
        else if (d.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
      });
      hls.loadSource(src);
      hls.attachMedia(video);
    } else if (nativeHls) {
      video.src = src;
      video.addEventListener('resize', () => showQuality(video.videoHeight));
    }
  }

  function play() {
    if (hls && !hls.__loading) { hls.__loading = true; hls.startLoad(-1); }
    const p = video.play();
    if (p && p.catch) {
      p.catch(() => {
        // Autoplay blockiert: Play-Knopf zeigen
        if (playBtn) playBtn.hidden = false;
      });
    }
  }

  function setSound(on) {
    video.muted = !on;
    soundBtn.setAttribute('aria-pressed', String(on));
    soundBtn.setAttribute('aria-label', on ? 'Ton ausschalten' : 'Ton einschalten');
    const t = soundBtn.querySelector('.film-btn-label');
    if (t) t.textContent = on ? 'Ton aus' : 'Ton an';
  }

  // Vorladen kurz bevor die Bühne erscheint, abspielen wenn sichtbar
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) attach();
  }, { rootMargin: '300px 0px' }).observe(frame);

  new IntersectionObserver((entries) => {
    inView = entries[0].isIntersecting;
    if (inView) {
      if (autoplay || userStarted) { attach().then(play); }
      else if (playBtn) playBtn.hidden = false;
    } else if (!video.paused) {
      video.pause();
    }
  }, { threshold: 0.35 }).observe(frame);

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      userStarted = true;
      playBtn.hidden = true;
      attach().then(() => { setSound(true); play(); });
    });
  }
  video.addEventListener('playing', () => { if (playBtn) playBtn.hidden = true; });

  soundBtn.addEventListener('click', () => {
    const on = video.muted;
    setSound(on);
    if (on) { userStarted = true; attach().then(play); }
  });

  fsBtn.addEventListener('click', () => {
    userStarted = true;
    attach().then(play);
    if (document.fullscreenElement) { document.exitFullscreen(); return; }
    if (frame.requestFullscreen) frame.requestFullscreen().catch(() => {});
    else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen(); // iPhone
  });
  document.addEventListener('fullscreenchange', () => {
    fsBtn.setAttribute('aria-label', document.fullscreenElement ? 'Vollbild beenden' : 'Vollbild');
  });
})();
