/**
 * Rendert das OG-Image (1200×630) aus scripts/og/og.html.
 * 2× gerendert und mit sharp heruntergerechnet → gestochen scharf.
 *
 * Usage: node scripts/og/render-og.mjs [ausgabe.png]
 */
import { chromium } from "playwright";
import { readFile, rm, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..", "..");
const out = process.argv[2] ?? join(root, "src", "app", "og-assets", "opengraph.png");

const rootUrl = pathToFileURL(root).href;
const html = (await readFile(join(__dirname, "og.html"), "utf8")).replaceAll("{{ROOT}}", rootUrl);
const tmp = join(__dirname, ".og-render.html");
await writeFile(tmp, html);

// Lokal installierten Chrome/Edge nutzen (kein Playwright-Browser-Download nötig).
let browser;
for (const channel of ["chrome", "msedge", undefined]) {
  try {
    browser = await chromium.launch(channel ? { channel } : {});
    break;
  } catch {}
}
if (!browser) throw new Error("Kein Chromium-Browser gefunden.");
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
await page.goto(pathToFileURL(tmp).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const shot = await page.screenshot({ type: "png" });
await browser.close();
await rm(tmp, { force: true });

await sharp(shot).resize(1200, 630, { kernel: "lanczos3" }).png({ compressionLevel: 9 }).toFile(out);
console.log("OG geschrieben:", out);
