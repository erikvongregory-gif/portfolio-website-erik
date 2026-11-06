/* ═══════════════════════════════════════════
   COOKIE-EINWILLIGUNG (§ 25 TDDDG, Art. 6 Abs. 1 lit. a DSGVO)
   - Nichts außer der Auswahl selbst wird vor der Einwilligung gespeichert oder geladen.
   - „Alle akzeptieren“ und „Nur notwendige“ sind gleichwertig auf der ersten Ebene.
   - Gleicher Speicher-Schlüssel wie evglab.com: eine Auswahl gilt auf der ganzen Domain.
   - Widerruf jederzeit über „Cookie-Einstellungen“ im Footer.
═══════════════════════════════════════════ */
(function () {
  var KEY = 'evglab-cookie-consent';
  var UPDATED_EVENT = 'evglab:cookie-consent-updated';
  var VERSION = 1;
  var MAX_AGE = 365 * 24 * 60 * 60 * 1000; // nach 12 Monaten erneut fragen
  var GA_ID = 'G-QVYH1N0EPQ';
  var PIXEL_ID = '919588920489707';
  var isLocal = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);

  var loaded = { statistics: false, marketing: false };
  var current = read();

  /* ── Speicher ─────────────────────────────── */
  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var v = JSON.parse(raw);
      if (v.updatedAt && Date.now() - Date.parse(v.updatedAt) > MAX_AGE) return null;
      return { necessary: true, statistics: !!v.statistics, marketing: !!v.marketing, updatedAt: v.updatedAt };
    } catch (e) {
      return null;
    }
  }

  function write(c) {
    var prev = current;
    var next = { necessary: true, statistics: !!c.statistics, marketing: !!c.marketing, updatedAt: new Date().toISOString(), version: VERSION };
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch (e) { /* Speicher gesperrt */ }
    current = next;
    window.dispatchEvent(new Event(UPDATED_EVENT));

    var revoked = prev && ((prev.statistics && !next.statistics) || (prev.marketing && !next.marketing));
    if (revoked) {
      revoke(prev, next);
      return;
    }
    apply(next);
  }

  /* ── Dienste laden ───────────────────────── */
  function apply(c) {
    if (!c) return;
    if (c.statistics && !loaded.statistics) loadStatistics();
    if (c.marketing && !loaded.marketing) loadMarketing();
  }

  function addScript(src) {
    var s = document.createElement('script');
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
  }

  function loadStatistics() {
    loaded.statistics = true;

    // Vercel Web Analytics (cookielos, nur auf dem Live-Server verfügbar)
    if (!isLocal) {
      window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
      var va = document.createElement('script');
      va.defer = true;
      va.src = '/_vercel/insights/script.js';
      document.head.appendChild(va);
    }

    // Google Analytics 4 (IP gekürzt, ohne Signals und Werbe-Personalisierung)
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    addScript('https://www.googletagmanager.com/gtag/js?id=' + GA_ID);
  }

  function loadMarketing() {
    loaded.marketing = true;
    /* eslint-disable */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
      n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  /* ── Widerruf ─────────────────────────────── */
  function clearCookies(test) {
    var host = location.hostname;
    var parts = host.split('.');
    var domains = ['', host, '.' + host];
    if (parts.length > 1) domains.push('.' + parts.slice(-2).join('.'));
    document.cookie.split(';').forEach(function (pair) {
      var name = pair.split('=')[0].trim();
      if (!name || !test(name)) return;
      domains.forEach(function (d) {
        document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
      });
    });
  }

  function revoke(prev, next) {
    if (prev.statistics && !next.statistics) {
      if (window.gtag) window.gtag('consent', 'update', { analytics_storage: 'denied' });
      clearCookies(function (n) { return /^_ga|^_gid|^_gat/.test(n); });
    }
    if (prev.marketing && !next.marketing) {
      if (typeof window.fbq === 'function') window.fbq('consent', 'revoke');
      clearCookies(function (n) { return /^_fbp|^_fbc|^fr$/.test(n); });
    }
    // Neu laden, damit bereits geladene Skripte sicher nicht weiterlaufen.
    if (loaded.statistics || loaded.marketing) setTimeout(function () { location.reload(); }, 350);
  }

  /* ── Oberfläche ──────────────────────────── */
  var root = null;
  var lastFocus = null;

  var CATS = [
    {
      key: 'necessary',
      name: 'Notwendig',
      locked: true,
      desc: 'Speichert Ihre Cookie-Auswahl, damit wir nicht bei jedem Besuch erneut fragen. Ohne diese Speicherung funktioniert die Seite nicht wie vorgesehen.',
      rows: [
        ['Anbieter', 'EvGlab (Erik Freiherr von Gregory)'],
        ['Speicher', 'localStorage „evglab-cookie-consent“'],
        ['Dauer', '12 Monate oder bis Sie die Auswahl ändern'],
        ['Grundlage', '§ 25 Abs. 2 Nr. 2 TDDDG, Art. 6 Abs. 1 lit. c DSGVO']
      ]
    },
    {
      key: 'statistics',
      name: 'Statistik',
      desc: 'Anonyme Reichweitenmessung, damit wir verstehen, welche Inhalte ankommen. Wird nur mit Ihrer Einwilligung geladen.',
      rows: [
        ['Dienste', 'Vercel Web Analytics (Vercel Inc., USA), Google Analytics 4 (Google Ireland Ltd. / Google LLC, USA)'],
        ['Cookies', '_ga, _ga_* (bis 2 Jahre); Vercel arbeitet ohne Cookies'],
        ['Drittland', 'USA, Grundlage: EU-US Data Privacy Framework'],
        ['Grundlage', '§ 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO']
      ]
    },
    {
      key: 'marketing',
      name: 'Marketing',
      desc: 'Meta Pixel für die Messung und Optimierung unserer Anzeigen auf Facebook und Instagram. Wird nur mit Ihrer Einwilligung geladen.',
      rows: [
        ['Dienst', 'Meta Pixel (Meta Platforms Ireland Ltd. / Meta Platforms Inc., USA)'],
        ['Cookies', '_fbp, _fbc (bis 90 Tage), fr (bis 90 Tage)'],
        ['Drittland', 'USA, Grundlage: EU-US Data Privacy Framework'],
        ['Grundlage', '§ 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO']
      ]
    }
  ];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch];
    });
  }

  // Erste Ebene: schmale Leiste unten. Zweck, Dienste, USA-Hinweis und
  // zwei gleichwertige Knöpfe; Details über „Mehr anzeigen“.
  function introHTML() {
    return '' +
      '<div class="cc-bar">' +
        '<p class="cc-bar-text" id="cc-desc"><strong id="cc-title">Cookies:</strong> ' +
        'Statistik und Marketing (Vercel, Google, Meta) laden wir nur mit Ihrer Einwilligung, ' +
        'dabei sind Übermittlungen in die USA möglich. Jederzeit im Footer widerrufbar. ' +
        '<span class="cc-nowrap"><a href="/datenschutz">Datenschutz</a> · <a href="/impressum">Impressum</a></span></p>' +
        '<div class="cc-bar-actions">' +
          '<button type="button" class="cc-more" data-cc="settings" aria-expanded="false">Mehr anzeigen</button>' +
          '<button type="button" class="cc-btn" data-cc="reject">Nur notwendige</button>' +
          '<button type="button" class="cc-btn" data-cc="accept">Alle akzeptieren</button>' +
        '</div>' +
      '</div>';
  }

  function settingsHTML(c) {
    var items = CATS.map(function (cat) {
      var checked = cat.locked || (c && c[cat.key]);
      var rows = cat.rows.map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('');
      return '' +
        '<li class="cc-cat">' +
          '<div class="cc-cat-head">' +
            '<label class="cc-cat-name" for="cc-' + cat.key + '">' + esc(cat.name) +
              (cat.locked ? '<small>immer aktiv</small>' : '') + '</label>' +
            '<span class="cc-switch">' +
              '<input type="checkbox" role="switch" id="cc-' + cat.key + '" data-cat="' + cat.key + '"' +
                (checked ? ' checked' : '') + (cat.locked ? ' disabled' : '') + '>' +
              '<span aria-hidden="true"></span>' +
            '</span>' +
          '</div>' +
          '<p class="cc-cat-desc">' + esc(cat.desc) + '</p>' +
          '<details><summary>Details</summary><dl>' + rows + '</dl></details>' +
        '</li>';
    }).join('');

    return '' +
      '<span class="cc-eyebrow">Cookie-Einstellungen</span>' +
      '<h2 class="cc-title" id="cc-title">Selbst <strong>auswählen.</strong></h2>' +
      '<p class="cc-text" id="cc-desc">Wählen Sie, welche Dienste wir laden dürfen. Sie können Ihre Auswahl jederzeit ändern oder widerrufen.</p>' +
      '<ul class="cc-cats">' + items + '</ul>' +
      '<div class="cc-actions">' +
        '<button type="button" class="cc-btn" data-cc="reject">Nur notwendige</button>' +
        '<button type="button" class="cc-btn" data-cc="accept">Alle akzeptieren</button>' +
        '<button type="button" class="cc-btn cc-btn--ghost cc-btn--wide" data-cc="save">Auswahl speichern</button>' +
      '</div>' +
      '<div class="cc-links">' +
        (c ? '' : '<button type="button" data-cc="intro">Weniger anzeigen</button>') +
        '<a href="/datenschutz">Datenschutz</a>' +
        '<a href="/impressum">Impressum</a>' +
      '</div>';
  }

  function open(view, focus) {
    if (!root) {
      root = document.createElement('section');
      root.className = 'cc';
      root.setAttribute('role', 'dialog');
      root.setAttribute('aria-modal', 'false');
      root.setAttribute('aria-labelledby', 'cc-title');
      root.setAttribute('aria-describedby', 'cc-desc');
      root.setAttribute('tabindex', '-1');
      root.setAttribute('data-lenis-prevent', '');
      root.addEventListener('click', onClick);
      root.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && current) close();
      });
      document.body.appendChild(root);
    }
    root.innerHTML = view === 'settings' ? settingsHTML(current) : introHTML();
    root.classList.toggle('cc--bar', view !== 'settings');
    root.hidden = false;
    void root.offsetWidth; // Startzustand übernehmen, damit die Einblendung animiert
    root.classList.add('is-in');
    if (focus) {
      lastFocus = document.activeElement;
      root.focus({ preventScroll: true });
    }
  }

  function close() {
    if (!root) return;
    root.classList.remove('is-in');
    setTimeout(function () { if (root) root.hidden = true; }, 450);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    lastFocus = null;
  }

  function onClick(e) {
    var btn = e.target.closest('[data-cc]');
    if (!btn) return;
    var action = btn.getAttribute('data-cc');
    if (action === 'settings') { open('settings', true); return; }
    if (action === 'intro') { open('intro', true); return; }
    if (action === 'accept') write({ statistics: true, marketing: true });
    if (action === 'reject') write({ statistics: false, marketing: false });
    if (action === 'save') {
      var pick = { statistics: false, marketing: false };
      root.querySelectorAll('input[data-cat]').forEach(function (i) {
        if (i.dataset.cat !== 'necessary') pick[i.dataset.cat] = i.checked;
      });
      write(pick);
    }
    close();
  }

  /* ── Start ─────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-cc-open]');
    if (!t) return;
    e.preventDefault();
    open('settings', true);
  });

  // Auswahl aus einem anderen Tab übernehmen
  window.addEventListener('storage', function (e) {
    if (e.key !== KEY) return;
    var prev = current;
    current = read();
    if (prev && current) {
      var revoked = (prev.statistics && !current.statistics) || (prev.marketing && !current.marketing);
      if (revoked) { revoke(prev, current); return; }
    }
    apply(current);
  });

  if (current) apply(current);
  else setTimeout(function () { open('intro', false); }, 700);
})();
