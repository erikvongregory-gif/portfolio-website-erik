/**
 * Renders the share images (1200x630) from the real page heroes.
 *
 *   home   -> src/app/og-assets/opengraph.png  (light stream + "Hingucker")
 *   films  -> src/app/og-assets/films.png      (blue hero, glass orb lens)
 *   studio -> src/app/og-assets/studio.png     (paper workbook, ERIK)
 *
 * Usage (dev server running): node scripts/og-studio.mjs [home|films|studio|all] [baseUrl]
 */
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import path from "node:path";

const which = process.argv[2] ?? "all";
const base = process.argv[3] ?? "http://localhost:3000";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assets = path.join(root, "src/app/og-assets");

const BADGE = `
  <span style="width:7px;height:7px;border-radius:50%;background:#ff9a3c;box-shadow:0 0 10px rgba(255,154,60,.8)"></span>`;

const PRESETS = {
  home: {
    path: "/",
    out: "opengraph.png",
    wait: 6500,
    // Turn the hero into a share card: brand top-left, disciplines bottom-right.
    tweak: (badge) => {
      const stage = document.querySelector("main section");
      if (!stage) throw new Error("hero not found");
      const aside = stage.querySelector('[class*="aside"]');
      if (aside) {
        aside.innerHTML = `
          <p style="margin:0 0 14px;font:500 15px var(--font-body);color:rgba(242,245,244,.6);display:flex;align-items:center;gap:10px">${badge}
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
    },
  },
  films: {
    path: "/videos",
    out: "films.png",
    wait: 5000,
    tweak: () => {
      const stage = document.querySelector("main section");
      if (!stage) throw new Error("hero not found");
      // Keep headline and orb; drop the small CTA row so the card stays calm.
      stage.querySelectorAll("a, button").forEach((el) => {
        el.style.visibility = "hidden";
      });
      const brand = document.createElement("p");
      brand.textContent = "EvGlab · evglab.com/videos";
      brand.style.cssText =
        "position:absolute;top:40px;left:56px;z-index:20;margin:0;font:600 22px var(--font-heading);letter-spacing:-.02em;color:#fff";
      stage.appendChild(brand);
    },
  },
  studio: {
    path: "/ueber-uns",
    out: "studio.png",
    wait: 4500,
    tweak: () => {
      const hero = document.querySelector("main section");
      if (!hero) throw new Error("hero not found");
      // Name, headline and the desk are the card; the intro and CTA would be cut off.
      hero.querySelectorAll('[class*="intro"], [class*="ctaRow"]').forEach((el) => {
        el.style.visibility = "hidden";
      });
    },
  },
};

// Uses the installed Edge (or OG_BROWSER=chrome) so canvas and video render like a real browser.
const browser = await chromium.launch({ channel: process.env.OG_BROWSER ?? "msedge" });

for (const [name, preset] of Object.entries(PRESETS)) {
  if (which !== "all" && which !== name) continue;
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
  await page.goto(base + preset.path, { waitUntil: "networkidle" });
  await page.addStyleTag({
    content: `
      header, [data-bf-banner], nextjs-portal, [aria-labelledby="cookie-title"] { display: none !important; }
      :root { --studio-banner-h: 0px !important; }
    `,
  });
  await page.evaluate(preset.tweak, BADGE);
  await page.waitForTimeout(preset.wait);
  const out = path.join(assets, preset.out);
  await page.screenshot({ path: out });
  await page.close();
  console.log("written", out);
}
await browser.close();
