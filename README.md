# Portfolio Website Erik EvgLab

Eigene Website auf Basis von Next.js und [Once UI](https://once-ui.com). Von Grund auf neu aufgebaut.

## Entwicklung

```bash
npm install
npm run dev
```

Die Seite läuft dann unter [http://localhost:3000](http://localhost:3000).

## Stack

- [Next.js](https://nextjs.org) (App Router)
- [Once UI](https://once-ui.com) für Layout, Tokens und Komponenten
- TypeScript

## Struktur

- `src/app` – Routen und Seiten (App Router)
- `src/components` – eigene Komponenten (`Providers` für Once UI)
- `src/resources` – Theming-/Config (`once-ui.config.ts`), Icons, globales CSS
- `src/types` – Typdefinitionen für die Config
- `public` – statische Assets
