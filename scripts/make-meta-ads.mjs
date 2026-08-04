import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const adsDir = path.join(root, "public", "ads");
const thumbsDir = path.join(adsDir, "thumbs");
fs.mkdirSync(thumbsDir, { recursive: true });

const HIDE_COOKIES = `
  [class*="cookie" i], [id*="cookie" i], [class*="consent" i], [id*="consent" i],
  [class*="Cookie"], [id*="Cookie"], #onetrust-banner-sdk, .cc-window,
  [class*="cookie-banner"], [data-testid*="cookie" i] {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
  }
`;

async function clickFirstVisible(page, names) {
  for (const name of names) {
    const btn = page.getByRole("button", { name }).first();
    if (await btn.isVisible({ timeout: 1500 }).catch(() => false)) {
      await btn.click({ timeout: 4000 });
      console.log("clicked:", name.toString());
      return true;
    }
  }
  return false;
}

const sites = [
  {
    id: "da-peppe",
    url: "https://da-peppe.com",
    dismiss: async (page) => {
      await clickFirstVisible(page, [
        /tutto,\s*grazie/i,
        /^tutto/i,
        /alles akzeptieren/i,
        /alle akzeptieren/i,
        /accept all/i,
      ]);
      // Nie „Cookie-Einstellungen“ klicken
      await page.waitForTimeout(500);
      await page.addStyleTag({ content: HIDE_COOKIES });
    },
  },
  {
    id: "lunebraeu",
    url: "https://luenebraeu.vercel.app",
    dismiss: async (page) => {
      await page.waitForLoadState("networkidle").catch(() => {});
      await page.waitForTimeout(1500);
      // Splash tippen → Altersgate (Desktop-Mitte)
      const vp = page.viewportSize() || { width: 1440, height: 900 };
      await page.locator("body").click({
        position: { x: Math.floor(vp.width / 2), y: Math.floor(vp.height / 2) },
      });
      const age = page.getByRole("button", { name: /mindestens 16/i });
      await age.waitFor({ state: "visible", timeout: 10000 });
      await age.click();
      console.log("clicked: age gate 16+");
      await page.getByText(/Bier mit Haltung/i).first().waitFor({ state: "visible", timeout: 15000 });
      await page.waitForTimeout(1000);
      await clickFirstVisible(page, [/alles akzeptieren/i, /alle akzeptieren/i, /accept all/i]);
      await page.waitForTimeout(400);
      await page.addStyleTag({ content: HIDE_COOKIES });
      await page.evaluate(() => window.scrollTo(0, 0));
    },
  },
  {
    id: "salon-liora",
    url: "https://salon-liora.vercel.app",
    dismiss: async (page) => {
      await clickFirstVisible(page, [
        /alles akzeptieren/i,
        /alle akzeptieren/i,
        /accept all/i,
        /zustimmen/i,
      ]);
      await page.waitForTimeout(400);
      await page.addStyleTag({ content: HIDE_COOKIES });
    },
  },
];

async function captureThumbs(browser) {
  for (const site of sites) {
    // Desktop-Viewport — Norddorf zeigt Website-/Desktop-Referenzen, keine Mobile-Screens
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    try {
      await page.goto(site.url, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(1000);
      await site.dismiss(page);
      await page.waitForTimeout(600);
      await page.evaluate(() => window.scrollTo(0, 0));
      const out = path.join(thumbsDir, `${site.id}.png`);
      // Nur oberer Hero-Bereich (saubere Desktop-Vorschau)
      await page.screenshot({
        path: out,
        type: "png",
        clip: { x: 0, y: 0, width: 1440, height: 900 },
      });
      console.log("thumb desktop", site.id);
    } catch (err) {
      console.error("thumb failed", site.id, err.message);
      throw err;
    } finally {
      await page.close();
    }
  }
}

function adHtml({ format, thumbFiles }) {
  const isStory = format === "story";
  const W = 1080;
  const H = isStory ? 1920 : 1350;

  // Norddorf: Headline dominiert — ~23–45% der Höhe
  const padTop = isStory ? Math.round(H * 0.14) : Math.round(H * 0.06);
  const padBottom = isStory ? Math.round(H * 0.30) : Math.round(H * 0.16);
  const gapAfterHeadline = isStory ? 36 : 28;
  // Norddorf: Karten ~12% der Höhe, Gruppe ~62% der Breite
  const cardW = isStory ? 268 : 240;
  const cardH = isStory ? 220 : 196;
  const cardGap = isStory ? 16 : 14;
  const fontSize = isStory ? 112 : 84;
  const copyW = isStory ? 900 : 720;

  const thumbs = thumbFiles
    .map(
      (f) => `
      <div class="card">
        <img src="file://${f.replace(/\\/g, "/")}" alt="" />
        <div class="fade" aria-hidden="true"></div>
      </div>`,
    )
    .join("");

  const rowW = cardW * 3 + cardGap * 2;

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8" />
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,600;1,700&family=Geist:wght@500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: ${W}px; height: ${H}px; overflow: hidden;
    background: #f7f6f3;
    color: #16150f;
    font-family: Geist, "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  body::before {
    content: "";
    position: absolute; inset: 0;
    background-image: repeating-linear-gradient(
      90deg,
      rgba(22,21,15,0.03) 0,
      rgba(22,21,15,0.03) 1px,
      transparent 1px,
      transparent 44px
    );
    pointer-events: none;
  }
  .frame {
    position: relative;
    width: ${W}px; height: ${H}px;
    padding: ${padTop}px 0 ${padBottom}px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${gapAfterHeadline}px;
  }
  .copy {
    text-align: center;
    width: ${copyW}px;
  }
  h1 {
    font-family: "Playfair Display", "Times New Roman", Georgia, serif;
    font-weight: 800;
    font-size: ${fontSize}px;
    line-height: 0.96;
    letter-spacing: -0.03em;
    color: #111111;
  }
  h1 .line { display: block; }
  h1 .accent {
    color: #2a5236;
    font-style: italic;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  .refs {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
  }
  .row {
    display: flex;
    gap: ${cardGap}px;
    justify-content: center;
    width: ${rowW}px;
  }
  .card {
    position: relative;
    width: ${cardW}px;
    height: ${cardH}px;
    border-radius: 8px;
    overflow: hidden;
    background: #ebe9e4;
    /* Soft glow wie Norddorf — nicht harter Schatten */
    box-shadow:
      0 0 0 1px rgba(22,21,15,0.04),
      0 8px 24px rgba(22,21,15,0.08),
      0 2px 6px rgba(22,21,15,0.04);
    filter: saturate(0.94) contrast(0.98);
  }
  .card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    display: block;
  }
  .card .fade {
    position: absolute;
    left: -8%; right: -8%; bottom: -2%;
    height: 48%;
    background: linear-gradient(
      180deg,
      rgba(247,246,243,0) 0%,
      rgba(247,246,243,0.45) 45%,
      rgba(247,246,243,0.92) 78%,
      rgba(247,246,243,1) 100%
    );
    filter: blur(6px);
    pointer-events: none;
  }
  .pill-wrap {
    width: ${rowW}px;
    display: flex;
    justify-content: flex-end;
  }
  .pill {
    display: inline-flex;
    align-items: center;
    padding: 10px 14px;
    border-radius: 7px;
    background: #16150f;
    color: #fff;
    font-size: ${isStory ? 15 : 14}px;
    font-weight: 500;
    letter-spacing: -0.02em;
    white-space: nowrap;
  }
</style>
</head>
<body>
  <div class="frame">
    <div class="copy">
      <h1>
        <span class="line">Die meisten</span>
        <span class="line">Websites sehen</span>
        <span class="line">nach Template aus.</span>
        <span class="line accent">Deine wird es</span>
        <span class="line accent">nicht mehr.</span>
      </h1>
    </div>
    <div class="refs">
      <div class="row">${thumbs}</div>
      <div class="pill-wrap">
        <div class="pill">Website ohne Template-Look →</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function renderAd(browser, format, thumbFiles) {
  const W = 1080;
  const H = format === "story" ? 1920 : 1350;
  const tmp = path.join(adsDir, `_tmp-${format}.html`);
  fs.writeFileSync(tmp, adHtml({ format, thumbFiles }), "utf8");
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.goto(`file://${tmp.replace(/\\/g, "/")}`, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    // Force-load Playfair cuts used in the ad
    await Promise.all([
      document.fonts.load('800 112px "Playfair Display"'),
      document.fonts.load('italic 700 112px "Playfair Display"'),
    ]);
  });
  await page.waitForTimeout(400);
  const out = path.join(
    adsDir,
    format === "story" ? "evglab-ad-story-9x16.png" : "evglab-ad-feed-4x5.png",
  );
  await page.screenshot({ path: out, type: "png" });
  await page.close();
  fs.unlinkSync(tmp);
  console.log("ad", path.basename(out));
}

const skipThumbs = process.argv.includes("--skip-thumbs");
const browser = await chromium.launch();
try {
  if (!skipThumbs) await captureThumbs(browser);
  const thumbFiles = ["da-peppe", "lunebraeu", "salon-liora"].map((id) =>
    path.join(thumbsDir, `${id}.png`),
  );
  for (const f of thumbFiles) {
    if (!fs.existsSync(f) || fs.statSync(f).size < 20_000) {
      throw new Error(`Thumb ungültig/zu klein: ${f}`);
    }
  }
  await renderAd(browser, "story", thumbFiles);
  await renderAd(browser, "feed", thumbFiles);
} finally {
  await browser.close();
}
