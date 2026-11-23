/**
 * Renders the brand kit in public/brand/ (same file names as before, so external
 * links keep working) from the studio icon in src/app/icon.svg.
 *
 *   evglab-mark.svg / -512.png / -1024.png   icon tile (dark stage, glowing bars, signal dot)
 *   evglab-mark-white.svg / -white-512.png   bars only, white, for dark backgrounds
 *   evglab-mark-black.svg                    bars only, ink, for light backgrounds
 *   evglab-logo.svg / -1200.png              tile + "EvGlab" in ink, for light backgrounds
 *   evglab-logo-dark.svg / -dark-1200.png    tile + "EvGlab" in white, for dark backgrounds
 *
 * Usage: node scripts/render-brand.mjs
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const brand = path.join(root, "public/brand");
const icon = readFileSync(path.join(root, "src/app/icon.svg"), "utf8").trim();

const bars = (fill) => `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="EvGlab">
  <rect x="15" y="17" width="32" height="7" rx="3.5" fill="${fill}"/>
  <rect x="15" y="28.5" width="22" height="7" rx="3.5" fill="${fill}"/>
  <rect x="15" y="40" width="15" height="7" rx="3.5" fill="${fill}"/>
  <circle cx="47.5" cy="43.5" r="3.5" fill="#FF9A3C"/>
</svg>
`;

// Wordmark logo: the icon tile (scaled to 56px) + text. Text uses Inter Tight with safe fallbacks.
const inner = icon.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
const logo = (ink, idSuffix) => `<svg width="250" height="56" viewBox="0 0 250 56" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="EvGlab">
  <g transform="scale(0.875)">${inner.replaceAll('id="bar"', `id="bar${idSuffix}"`).replaceAll("url(#bar)", `url(#bar${idSuffix})`).replaceAll('id="stage"', `id="stage${idSuffix}"`).replaceAll("url(#stage)", `url(#stage${idSuffix})`)}</g>
  <text x="72" y="40" fill="${ink}" font-family="'Inter Tight', 'Segoe UI', Helvetica, Arial, sans-serif" font-size="34" font-weight="600" letter-spacing="-1.2">EvGlab</text>
</svg>
`;

const files = {
  "evglab-mark.svg": icon + "\n",
  "evglab-mark-white.svg": bars("#FFFFFF"),
  "evglab-mark-black.svg": bars("#16181A"),
  "evglab-logo.svg": logo("#16181A", "L"),
  "evglab-logo-dark.svg": logo("#FFFFFF", "D"),
};
for (const [name, svg] of Object.entries(files)) writeFileSync(path.join(brand, name), svg);

const browser = await chromium.launch({ channel: process.env.OG_BROWSER ?? "msedge" });
async function png(svg, width, height, out) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.setContent(`<html><head>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600&display=block" rel="stylesheet">
</head><body style="margin:0;background:transparent">${svg.replace(
    "<svg ",
    `<svg style="display:block;width:${width}px;height:${height}px" `,
  )}</body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(brand, out), omitBackground: true });
  await page.close();
}
await png(files["evglab-mark.svg"], 512, 512, "evglab-mark-512.png");
await png(files["evglab-mark.svg"], 1024, 1024, "evglab-mark-1024.png");
await png(files["evglab-mark-white.svg"], 512, 512, "evglab-mark-white-512.png");
await png(files["evglab-logo.svg"], 1200, 269, "evglab-logo-1200.png");
await png(files["evglab-logo-dark.svg"], 1200, 269, "evglab-logo-dark-1200.png");
await browser.close();
console.log("brand kit written to public/brand");
