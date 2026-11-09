/* ═══════════════════════════════════════════
   ANFRAGE-MODAL
   Jeder Link mit data-request="analyse|gespraech|projekt|zeitplan" öffnet
   das Formular. Versand über /api/potenzialanalyse (Resend).
═══════════════════════════════════════════ */
(function () {
  const TOPICS = {
    analyse: {
      eyebrow: 'Kostenlos und unverbindlich',
      title: '<strong>Potenzialanalyse</strong> anfragen',
      lead: 'Wir melden uns persönlich bei Ihnen. Das kurze Video Ihres Messestands schicken Sie uns danach einfach per E-Mail.',
      submit: 'Potenzialanalyse anfragen',
    },
    gespraech: {
      eyebrow: '30 Minuten · kostenlos',
      title: '<strong>Erstgespräch</strong> vereinbaren',
      lead: 'Wir melden uns mit Terminvorschlägen und klären gemeinsam, welche Geschichte Ihr Produkt am Stand erzählen soll.',
      submit: 'Erstgespräch anfragen',
    },
    projekt: {
      eyebrow: 'Projekt anfragen',
      title: 'Erzählen Sie uns von <strong>Ihrem Produkt</strong>',
      lead: 'Ein paar Eckdaten reichen. Wir melden uns persönlich und besprechen mit Ihnen den nächsten Schritt.',
      submit: 'Anfrage senden',
    },
    zeitplan: {
      eyebrow: 'Messe-Countdown',
      title: 'Zeitplan für <strong>Ihre Messe</strong>',
      lead: 'Nennen Sie uns Ihre Messe. Wir planen rückwärts ab dem ersten Messetag und schicken Ihnen einen Zeitplan.',
      submit: 'Zeitplan anfragen',
    },
  };

  const X = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  const CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const dlg = document.createElement('dialog');
  dlg.className = 'rq';
  dlg.setAttribute('aria-labelledby', 'rq-title');
  dlg.setAttribute('data-lenis-prevent', '');
  dlg.innerHTML = `
    <div class="rq-inner">
      <button type="button" class="rq-close" data-rq-close aria-label="Schließen">${X}</button>

      <div class="rq-start">
        <span class="rq-eyebrow" data-rq="eyebrow"></span>
        <h2 class="rq-title" id="rq-title" data-rq="title"></h2>
        <p class="rq-lead" data-rq="lead"></p>

        <form class="rq-form" novalidate>
          <label class="rq-field">
            <span class="rq-label">Name</span>
            <input class="rq-input" name="name" autocomplete="name" required minlength="2" maxlength="120">
          </label>
          <label class="rq-field">
            <span class="rq-label">Unternehmen</span>
            <input class="rq-input" name="company" autocomplete="organization" required minlength="2" maxlength="160">
          </label>
          <label class="rq-field">
            <span class="rq-label">E-Mail</span>
            <input class="rq-input" name="email" type="email" autocomplete="email" inputmode="email" required maxlength="200">
          </label>
          <label class="rq-field">
            <span class="rq-label">Telefon <em>(optional)</em></span>
            <input class="rq-input" name="phone" type="tel" autocomplete="tel" inputmode="tel" maxlength="60">
          </label>
          <label class="rq-field rq-field--wide">
            <span class="rq-label">Nächste Messe <em>(optional)</em></span>
            <input class="rq-input" name="fair" maxlength="160" placeholder="z. B. Hannover Messe, April 2027">
          </label>
          <label class="rq-field rq-field--wide">
            <span class="rq-label">Ihr Produkt in ein, zwei Sätzen <em>(optional)</em></span>
            <textarea class="rq-input" name="message" rows="3" maxlength="3000"></textarea>
          </label>
          <label class="rq-hp" aria-hidden="true">Website <input name="website" tabindex="-1" autocomplete="off"></label>

          <p class="rq-error" role="alert" aria-live="polite"></p>
          <button type="submit" class="rq-submit">
            <span class="rq-spin" hidden></span>
            <span data-rq="submit"></span>
          </button>
          <p class="rq-note">Wir nutzen Ihre Angaben nur, um Ihre Anfrage zu beantworten. Der Versand läuft über Resend (USA). Mehr in der <a href="/datenschutz" target="_blank" rel="noopener">Datenschutzerklärung</a>.</p>
        </form>
      </div>

      <div class="rq-done" hidden tabindex="-1">
        <span class="rq-check">${CHECK}</span>
        <span class="rq-eyebrow">Anfrage gesendet</span>
        <h2 class="rq-title">Danke, <strong>wir melden uns</strong>.</h2>
        <p class="rq-lead" data-rq="done"></p>
        <div class="rq-contact">
          <strong>Baris Basöz</strong>
          Vertrieb 3D-Produktfilme<br>
          <a href="tel:+4917672791512">+49 176 72791512</a> · <a href="mailto:kontakt@evglab.com">kontakt@evglab.com</a>
        </div>
        <button type="button" class="rq-submit" data-rq-close>Schließen</button>
      </div>
    </div>`;
  document.body.appendChild(dlg);

  const form = dlg.querySelector('form');
  const start = dlg.querySelector('.rq-start');
  const done = dlg.querySelector('.rq-done');
  const errEl = dlg.querySelector('.rq-error');
  const btn = form.querySelector('.rq-submit');
  const spin = btn.querySelector('.rq-spin');
  const slot = (k) => dlg.querySelector(`[data-rq="${k}"]`);

  let topic = 'analyse';
  let openedAt = 0;
  let sending = false;

  function open(t) {
    topic = TOPICS[t] ? t : 'analyse';
    const c = TOPICS[topic];
    slot('eyebrow').textContent = c.eyebrow;
    slot('title').innerHTML = c.title;
    slot('lead').textContent = c.lead;
    slot('submit').textContent = c.submit;
    start.hidden = false;
    done.hidden = true;
    errEl.textContent = '';
    openedAt = Date.now();

    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');
    document.documentElement.classList.add('rq-lock');
    if (window.lenis) window.lenis.stop();
    requestAnimationFrame(() => dlg.classList.add('is-in'));
    // Auf dem Handy nicht sofort die Tastatur öffnen
    if (matchMedia('(min-width: 810px)').matches) form.elements.name.focus();
    else dlg.focus();
  }

  function close() {
    dlg.classList.remove('is-in');
    setTimeout(() => {
      if (dlg.open) dlg.close();
      else cleanup();
    }, 250);
  }
  function cleanup() {
    document.documentElement.classList.remove('rq-lock');
    if (window.lenis) window.lenis.start();
  }
  dlg.addEventListener('close', cleanup);
  dlg.addEventListener('cancel', (e) => { e.preventDefault(); close(); }); // Esc mit Animation
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg) close(); // Klick auf den Hintergrund
    if (e.target.closest('[data-rq-close]')) close();
  });

  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-request]');
    if (!a) return;
    e.preventDefault();
    open(a.dataset.request);
  });
  // Direktlink: evglab.com/3d-produktanimation#anfrage
  if (location.hash === '#anfrage') setTimeout(() => open('analyse'), 600);

  function validate() {
    let first = null;
    for (const el of form.querySelectorAll('[required]')) {
      const bad = !el.checkValidity();
      el.setAttribute('aria-invalid', String(bad));
      if (bad && !first) first = el;
    }
    if (first) {
      errEl.textContent = first.name === 'email'
        ? 'Bitte geben Sie eine gültige E-Mail-Adresse an.'
        : 'Bitte füllen Sie Name, Unternehmen und E-Mail aus.';
      first.focus();
      return false;
    }
    return true;
  }
  form.addEventListener('input', (e) => {
    if (e.target.getAttribute('aria-invalid') === 'true' && e.target.checkValidity()) {
      e.target.setAttribute('aria-invalid', 'false');
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending) return;
    errEl.textContent = '';
    if (!validate()) return;

    const data = Object.fromEntries(new FormData(form));
    data.topic = topic;
    data.elapsed = Date.now() - openedAt;

    sending = true;
    btn.disabled = true;
    spin.hidden = false;
    try {
      const res = await fetch('/api/potenzialanalyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.error || 'Senden fehlgeschlagen.');

      slot('done').textContent = topic === 'analyse'
        ? 'Sie bekommen gleich eine Bestätigung per E-Mail. Antworten Sie darauf einfach mit dem Video Ihres Messestands.'
        : 'Sie bekommen gleich eine Bestätigung per E-Mail. Wir melden uns persönlich bei Ihnen.';
      start.hidden = true;
      done.hidden = false;
      done.focus();
      form.reset();

      // Nur wenn der Besucher eingewilligt hat, sind diese Dienste geladen
      try {
        if (typeof window.gtag === 'function') window.gtag('event', 'generate_lead', { form: 'potenzialanalyse', topic });
        if (typeof window.fbq === 'function') window.fbq('track', 'Lead', { content_name: topic });
      } catch (_) { /* Tracking darf nie stören */ }
    } catch (err) {
      errEl.textContent = (err && err.message && err.message !== 'Failed to fetch')
        ? err.message
        : 'Keine Verbindung. Bitte versuchen Sie es noch einmal oder schreiben Sie an kontakt@evglab.com.';
    } finally {
      sending = false;
      btn.disabled = false;
      spin.hidden = true;
    }
  });
})();
