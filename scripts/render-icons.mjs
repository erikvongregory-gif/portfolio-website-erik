/**
 * Renders src/app/apple-icon.png (180px) and src/app/favicon.ico (16/32/48px) from
 * src/app/icon.svg using the installed Edge. The ICO is written by Pillow (Python),
 * because Turbopack rejects the ICO files ffmpeg produces.
 * Usage: node scripts/render-icons.mjs
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
const tmp = path.join(root, "src/app/.icon-256.png");
await render(180, apple, false);
await render(256, tmp, true);
await browser.close();
execFileSync("python", [
  "-I",
  "-c",
  "import sys; from PIL import Image; Image.open(sys.argv[1]).convert('RGBA').save(sys.argv[2], format='ICO', sizes=[(16,16),(32,32),(48,48)])",
  tmp,
  path.join(root, "src/app/favicon.ico"),
]);
rmSync(tmp);
console.log("written apple-icon.png and favicon.ico");
