// Nimmt Scroll-Videos der Live-Projekte auf (inkl. aller Original-Animationen).
// Trick: Erst ein Setup-Kontext, der Cookie-Banner/Age-Gates wegklickt und den
// Storage-State sichert – dann die eigentliche Aufnahme mit sauberem Start.
import { chromium } from "playwright";
import { mkdirSync, renameSync, rmSync } from "node:fs";

const targets = [
  {
    name: "evglab",
    url: "https://evglab.com",
    dismiss: ["Alle akzeptieren"],
  },
  {
    name: "ib-jungen",
    url: "https://ib-jungen-web.vercel.app",
    dismiss: ["Alle akzeptieren", "Akzeptieren", "Verstanden"],
  },
  {
    name: "lunebraeu",
    url: "https://luenebraeu.vercel.app",
    dismiss: ["ICH BIN MINDESTENS 16", "ALLE AKZEPTIEREN", "Alle akzeptieren"],
  },
];

const VIEWPORT = { width: 1280, height: 800 };
const MAX_SCROLL = 4000; // px
const SCROLL_SPEED = 320; // px/s
const OUT_DIR = "public/videos/projects";
const TMP_DIR = "scripts/.video-tmp";

mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch();

async function dismissOverlays(page, labels) {
  for (const label of labels) {
    try {
      const el = page.getByText(label, { exact: false }).first();
      await el.click({ timeout: 2500 });
      await page.waitForTimeout(900);
      console.log(`  weggeklickt: "${label}"`);
    } catch {
      /* nicht vorhanden – ok */
    }
  }
}

for (const t of targets) {
  console.log(`\n=== ${t.name} ===`);

  // 1) Setup: Banner wegklicken, Storage-State sichern
  const setupCtx = await browser.newContext({ viewport: VIEWPORT });
  const setupPage = await setupCtx.newPage();
  await setupPage.goto(t.url, { waitUntil: "networkidle", timeout: 60000 });
  await setupPage.waitForTimeout(1500);
  await dismissOverlays(setupPage, t.dismiss);
  const storageState = await setupCtx.storageState();
  await setupCtx.close();

  // 2) Aufnahme mit sauberem Start
  rmSync(TMP_DIR, { recursive: true, force: true });
  const recCtx = await browser.newContext({
    viewport: VIEWPORT,
    storageState,
    recordVideo: { dir: TMP_DIR, size: VIEWPORT },
  });
  const page = await recCtx.newPage();
  await page.goto(t.url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1000);
  // Falls Banner Storage überlebt hat: nochmal wegklicken
  await dismissOverlays(page, t.dismiss);
  await page.waitForTimeout(1200);

  await page.evaluate(
    async ({ maxScroll, speed }) => {
      const total = Math.min(
        document.body.scrollHeight - window.innerHeight,
        maxScroll,
      );
      const duration = (total / speed) * 1000;
      const start = performance.now();
      await new Promise((resolve) => {
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          window.scrollTo(0, total * p);
          if (p < 1) requestAnimationFrame(tick);
          else resolve();
        };
        requestAnimationFrame(tick);
      });
    },
    { maxScroll: MAX_SCROLL, speed: SCROLL_SPEED },
  );
  await page.waitForTimeout(1200);

  const video = page.video();
  await recCtx.close();
  const tmpPath = await video.path();
  const outPath = `${OUT_DIR}/${t.name}.webm`;
  rmSync(outPath, { force: true });
  renameSync(tmpPath, outPath);
  console.log(`  OK: ${outPath}`);
}

rmSync(TMP_DIR, { recursive: true, force: true });
await browser.close();
console.log("\nFertig.");
