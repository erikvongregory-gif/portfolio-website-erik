# GEO-Audit: evglab.com

**Datum:** 17.11.2026 · **URL:** https://evglab.com · **Typ:** Agentur/Dienstleister (Solo-Studio) mit lokalem Bezug · **Seiten:** 31 (komplette Sitemap)
**Werkzeug:** geo-seo-claude (`/geo audit`), Crawl per Skript, Live-Site geprüft.

---

## Ergebnis

**GEO-Score: 54/100 (Poor, knapp unter Fair)**

Die Technik ist sehr gut: Server-Rendering, offene robots.txt für alle KI-Crawler, llms.txt, FAQ-Schema auf 28 von 31 Seiten. Was fehlt, ist alles außerhalb der eigenen Domain (Markenerwähnungen, Profile, Video-Plattformen) und eine eindeutige Positionierung: Für KI-Systeme ist EvGlab heute ein **Webdesigner aus Landsberg**, nicht ein 3D-Studio.

| Kategorie | Score | Gewicht | Gewichtet |
|---|---|---|---|
| AI Citability | 62 | 25 % | 15,5 |
| Brand Authority | 25* | 20 % | 5,0 |
| Content E-E-A-T | 55 | 20 % | 11,0 |
| Technical GEO | 85 | 15 % | 12,8 |
| Schema & Structured Data | 62 → ca. 72 nach Fixes | 10 % | 6,2 |
| Platform Optimization | 35* | 10 % | 3,5 |
| **Gesamt** | | | **54** |

\* Geschätzt aus Signalen auf der Site (kein `sameAs`, kein YouTube-Kanal verlinkt, keine Wikipedia/Reddit-Präsenz). Nicht extern gemessen.

---

## Bereits erledigt (in diesem Branch, nicht committet)

1. **3D-Seite hatte gar kein Schema.** Jetzt `WebPage` + `Service` + `VideoObject` (Imagefilm) + `BreadcrumbList` in `public/3d-produktanimation/index.html`.
2. **Über-uns hatte kein Schema.** Jetzt `AboutPage` mit `Person` (`@id …/ueber-uns#erik`, `knowsAbout`, `worksFor`) in `src/app/ueber-uns/page.tsx`.
3. **Startseite:** `serviceType` um 3D-Produktanimation, 3D-Produktfilme für Messen, Videoproduktion ergänzt; `founder` mit derselben `@id` verknüpft (Entität Erik ↔ EvGlab).
4. **llms.txt kannte weder 3D noch Videos.** Leistungen, Kurzfassung „3D-Produktfilme für Messen“ und beide Seiten ergänzt.

Lokal geprüft: alle JSON-LD-Blöcke parsen, Seiten liefern 200, TypeScript ohne Fehler.

---

## Hoch (diese Woche)

- **Positionierung (entschieden 18.11.2026): Agentur für Werbematerial, also Webdesign, 3D-Produktanimation und Reels.** Title, Meta-Description, Schema-Description und `serviceType` der Startseite, die llms.txt-Einleitung und der `jobTitle` auf Über-uns sind angepasst. Offen bleibt die sichtbare H1 der Startseite („Websites mit Charakter …“), die noch nur Websites nennt.
- **Kein `sameAs`.** Weder Organisation noch Person verlinken LinkedIn, Instagram, YouTube, Google-Unternehmensprofil. Das ist das wichtigste Signal für Entitätserkennung. URLs eintragen (ich habe keine erfunden).
- **Name uneinheitlich:** „Erik von Gregory“ (Schema), „Erik Freiherr von Gregory“ (llms.txt), „Erik EvGlab“ (Titles). Eine Hauptform festlegen, andere nur als `alternateName`.
- **Kein YouTube-Kanal.** Für ein Video-/3D-Studio der größte Hebel bei Gemini und Google AI Overviews. Imagefilm und Referenzen dort hochladen und auf der Seite einbetten/verlinken.

## Mittel (diesen Monat)

- **Stadt- und Branchenseiten sind zu 59–60 % wortgleich** (z. B. München ↔ Kempten, Brauereien ↔ Steuerberater). Gefahr „Doorway Pages“. Pro Seite einen echten lokalen/branchenspezifischen Abschnitt (Referenz, Zahl, Beispiel) ergänzen oder schwache Seiten zusammenlegen.
- **Gesperrte Überschriften** wie „Wenn deine Website dich b r e m s t“ oder „Was ich für dich b a u e“ landen buchstabenweise im HTML. Crawler und Screenreader lesen „b r e m s t“. `aria-label` mit dem ganzen Wort setzen und die Einzelbuchstaben `aria-hidden` machen.
- **Startseite hat zwei H1** (Desktop- und Mobil-Variante). Eine davon als `p`/`span` mit gleicher Optik.
- **Über-uns ist dünn** (385 Wörter). Für E-E-A-T: Werdegang, Werkzeuge (Blender, Next.js), Projektzahlen, Foto, Links zu Profilen.
- **Verknappung „Noch 3 Plätze / Nur bis 30. November“** auf allen Leistungsseiten: wirkt auf Bewertungssysteme als Trust-Risiko und veraltet nach Ablauf sichtbar.
- **Keine Bewertungen im Schema.** Die öffentliche 5★-Google-Bewertung (Da Peppe) als `Review` am Business auszeichnen, sobald es mehrere echte Bewertungen gibt (keine `AggregateRating` mit nur einer).
- **3D-Seite ohne FAQ.** Fragen wie „Was kostet ein 3D-Produktfilm?“, „Wie lange dauert die Produktion?“, „Welche Formate für den Messestand?“ mit kurzen, zitierfähigen Antworten (40–60 Wörter, konkrete Zahlen) plus `FAQPage`.

## Niedrig

- Sitemap: alle `lastmod` identisch (Build-Zeit). Echte Änderungsdaten pro Seite liefern.
- robots.txt: `Host:` ist kein Standard; `OAI-SearchBot`, `Claude-SearchBot` explizit ergänzen (sind über `*` bereits erlaubt, nur Dokumentation).
- Kein `Content-Security-Policy`-Header.
- Startseiten-HTML 434 KB (RSC-Payload). Für Crawler ok, für LCP prüfen.
- 3D-Seite: Title-Schema „EvGlab | …“ statt „… · Erik EvGlab“ wie der Rest; Ansprache „Sie/wir“ statt „du/ich“. Bewusst entscheiden.
- Kein `llms-full.txt`.

---

## Kategorien im Detail

**AI Citability (62).** Stark: FAQ-Blöcke mit klaren Antworten, konkrete Preise (990 €, 1.500 €, 2.500 €, 99 €/Monat), Ablauf in fünf Schritten. Schwach: viel Werbesprache ohne überprüfbare Fakten („unfairer Website-Vorteil“), wenige Zahlen zu Ergebnissen, auf der 3D-Seite keine Antwort-Absätze, die ein KI-System wörtlich zitieren könnte.

**Brand Authority (25, geschätzt).** Solo-Marke, junge Domain, keine Wikipedia/Wikidata, keine Reddit-Erwähnungen gefunden, Profile nicht verknüpft. Hebel: LinkedIn-Unternehmensseite, YouTube, Einträge in Branchenverzeichnissen (z. B. Messe-Dienstleisterlisten), Gastbeiträge/Case Studies bei Kunden.

**Content E-E-A-T (55).** Echte Person, Adresse, Telefon, Impressum, Kundenstimmen und Live-Referenzen sind da. Es fehlen datierte Inhalte (Case Studies, Blog), Autorenangaben und ein ausführliches Profil.

**Technical GEO (85).** SSR/Prerender, HSTS, nosniff, Referrer-Policy, Permissions-Policy, Canonicals und OG auf allen Seiten, Vercel-Edge-Cache, Antwortzeit unter 0,5 s. Abzüge: CSP fehlt, lastmod-Werte, große HTML-Payload.

**Schema (62 → ca. 72).** Sehr gut auf Stadt-/Branchenseiten (ProfessionalService, Service, FAQPage, BreadcrumbList), Videos-Seite mit VideoObject. Vor den Fixes ohne Schema: 3D-Seite, Über-uns. Offen: `sameAs`, `Review`, eigenständige `Organization`/`WebSite`-Entität mit Logo.

**Platform Optimization (35, geschätzt).** Google AI Overviews: gute Basis durch FAQ und Schema. ChatGPT/Perplexity: brauchen externe Erwähnungen. Gemini: YouTube fehlt. Bing Copilot: Bing Webmaster Tools + IndexNow einrichten.

---

## Quick Wins

1. Commit + Deploy der vier Fixes oben.
2. `sameAs` mit echten Profil-URLs an Business und Person.
3. Positionierung festlegen und Startseiten-Title/H1/Description + llms.txt-Kopf angleichen.
4. Imagefilm auf YouTube hochladen, auf der 3D-Seite verlinken.
5. FAQ-Block (5 Fragen) auf der 3D-Seite.

## 30-Tage-Plan

- **Woche 1 – Entität:** Fixes deployen, `sameAs`, einheitlicher Name, Positionierung.
- **Woche 2 – 3D-Inhalte:** FAQ + Preisrahmen auf der 3D-Seite, eine Case Study mit Zahlen.
- **Woche 3 – Plattformen:** YouTube-Kanal, LinkedIn-Unternehmensseite, Google-Unternehmensprofil, Bing Webmaster Tools.
- **Woche 4 – Qualität:** Stadtseiten individualisieren oder zusammenlegen, gesperrte Überschriften barrierefrei machen, Über-uns ausbauen, Re-Audit mit `/geo compare`.

---

## Anhang: Seiten

Alle 31 Sitemap-URLs liefern 200 mit Canonical und OG-Bild. Schema fehlte nur auf `/3d-produktanimation` und `/ueber-uns` (jetzt ergänzt) sowie auf `/impressum` und `/datenschutz` (unkritisch). Rohdaten des Crawls: Titel, H1/H2, Wortzahl, Schema-Typen je Seite.
