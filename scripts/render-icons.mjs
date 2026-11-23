/**
 * Renders src/app/apple-icon.png (180px) and src/app/favicon.ico (48px) from
 * src/app/icon.svg using the installed Edge. Usage: node scripts/render-icons.mjs
 */
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { readFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const svg = readFileSync(path.join(root, "src/app/icon.svg"), "utf8");
const browser = await chromium.launch({ channel: process.env.OG_BROWSER ?? "msedge" });

async function render(size, out, rounded) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  // Apple adds its own corner mask, so the apple icon is rendered full-bleed.
  const markup = rounded ? svg : svg.replace(/rx="14"/, 'rx="0"').replace(/<rect x="0.5"[^>]*\/>/, "");
  await page.setContent(
    `<html><body style="margin:0;background:transparent">${markup.replace(
      "<svg ",
      `<svg style="display:block;width:${size}px;height:${size}px" `,
    )}</body></html>`,
  );
  await page.screenshot({ path: out, omitBackground: true });
  await page.close();
}

const apple = path.join(root, "src/app/apple-icon.png");
const tmp = path.join(root, "src/app/.icon-48.png");
await render(180, apple, false);
await render(48, tmp, true);
await browser.close();
execFileSync("ffmpeg", ["-v", "error", "-y", "-i", tmp, path.join(root, "src/app/favicon.ico")]);
rmSync(tmp);
console.log("written apple-icon.png and favicon.ico");
