/**
 * Renders public/evglab-logo-email.png (2x, transparent): new icon + white
 * "EvGlab" wordmark for the dark confirmation emails.
 * Usage: node scripts/render-email-logo.mjs
 */
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const svg = readFileSync(path.join(root, "src/app/icon.svg"), "utf8");
const browser = await chromium.launch({ channel: process.env.OG_BROWSER ?? "msedge" });
const page = await browser.newPage({ viewport: { width: 400, height: 112 } });
await page.setContent(`<html><head>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600&display=block" rel="stylesheet">
</head><body style="margin:0;background:transparent">
<div id="logo" style="display:inline-flex;align-items:center;gap:22px;padding:8px">
  ${svg.replace("<svg ", '<svg style="display:block;width:96px;height:96px" ')}
  <span style="font:600 66px 'Inter Tight',sans-serif;letter-spacing:-0.035em;color:#fff;line-height:1">EvGlab</span>
</div></body></html>`);
await page.evaluate(() => document.fonts.ready);
await page.locator("#logo").screenshot({
  path: path.join(root, "public/evglab-logo-email.png"),
  omitBackground: true,
});
await browser.close();
console.log("written public/evglab-logo-email.png");
