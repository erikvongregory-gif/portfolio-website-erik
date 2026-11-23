/**
 * Renders the share image (src/app/og-assets/opengraph.png, 1200x630) from the
 * real home hero: light stream of EvGlab films + "Hingucker".
 *
 * Usage (dev server running): node scripts/og-studio.mjs [baseUrl]
 */
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import path from "node:path";

const base = process.argv[2] ?? "http://localhost:3000";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "src/app/og-assets/opengraph.png");

// Uses the installed Edge (or OG_BROWSER=chrome) so canvas and video render like a real browser.
const browser = await chromium.launch({ channel: process.env.OG_BROWSER ?? "msedge" });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
// No cookie banner in the shot: pretend the visitor already chose.
await page.addInitScript(() => {
  try {
    localStorage.setItem(
      "evglab-cookie-consent",
      JSON.stringify({ necessary: true, statistics: false, marketing: false, ts: Date.now() }),
    );
  } catch {}
});
await page.goto(base + "/", { waitUntil: "networkidle" });

await page.addStyleTag({
  content: `
    header, [data-bf-banner], nextjs-portal, [aria-labelledby="cookie-title"] { display: none !important; }
    :root { --studio-banner-h: 0px !important; }
  `,
});

// Turn the hero into a share card: brand top-left, disciplines bottom-right.
await page.evaluate(() => {
  const stage = document.querySelector("main section");
  if (!stage) throw new Error("hero not found");
  const aside = stage.querySelector('[class*="aside"]');
  if (aside) {
    aside.innerHTML = `
      <p style="margin:0 0 14px;font:500 15px var(--font-body);color:rgba(242,245,244,.6);display:flex;align-items:center;gap:10px">
        <span style="width:7px;height:7px;border-radius:50%;background:#ff9a3c;box-shadow:0 0 10px rgba(255,154,60,.8)"></span>
        Landsberg am Lech · für ganz Deutschland
      </p>
      <p style="margin:0;font:400 26px/1.25 var(--font-heading);letter-spacing:-.02em;color:#fff">
        Websites, 3D-Produktfilme<br/>und Reels aus einer Hand.
      </p>
      <p style="margin:18px 0 0;font:500 17px var(--font-body);color:#cdeef0">evglab.com</p>`;
  }
  const brand = document.createElement("p");
  brand.textContent = "EvGlab";
  brand.style.cssText =
    "position:absolute;top:44px;left:56px;z-index:5;margin:0;font:600 30px var(--font-heading);letter-spacing:-.03em;color:#fff";
  stage.appendChild(brand);
});

// Let the stream fill up and a pulse light the word.
await page.waitForTimeout(6500);
await page.screenshot({ path: out });
await browser.close();
console.log("written", out);
