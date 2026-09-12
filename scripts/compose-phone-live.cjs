const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const { chromium, devices } = require("playwright");

const DIR = "public/images/final-cta";
const W = 682;
const H = 1024;
/** Inside measured glass; aspect ≈ 393/852 */
const SCREEN = { x0: 138, y0: 68, x1: 544, y1: 950 };

function maskSvg(sw, sh, r) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${sw}" height="${sh}"><rect width="${sw}" height="${sh}" rx="${r}" ry="${r}" fill="#fff"/></svg>`
  );
}

async function compose(jpg, outWebp) {
  const sw = SCREEN.x1 - SCREEN.x0 + 1;
  const sh = SCREEN.y1 - SCREEN.y0 + 1;
  const radius = Math.round(Math.min(sw, sh) * 0.115);
  const mask = maskSvg(sw, sh, radius);

  // fill = keep full mobile frame, tiny stretch only (same aspect ~)
  const fitted = await sharp(jpg)
    .resize(sw, sh, { fit: "fill" })
    .removeAlpha()
    .png()
    .toBuffer();

  const rounded = await sharp(fitted)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const plate = await sharp({
    create: { width: sw, height: sh, channels: 4, background: { r: 5, g: 5, b: 5, alpha: 1 } },
  })
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const buf = await sharp({
    create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: plate, left: SCREEN.x0, top: SCREEN.y0 },
      { input: rounded, left: SCREEN.x0, top: SCREEN.y0 },
      { input: path.join(DIR, "iphone-frame.png"), left: 0, top: 0 },
    ])
    .webp({ quality: 92, alphaQuality: 100 })
    .toBuffer();

  fs.writeFileSync(outWebp, buf);
  await sharp(buf).png().toFile(outWebp.replace("public/images/final-cta/", ".tmp-verify/").replace(".webp", ".png"));
}

async function captureLt() {
  const IPHONE = {
    ...devices["iPhone 14 Pro"],
    viewport: { width: 393, height: 852 },
    screen: { width: 393, height: 852 },
    deviceScaleFactor: 3,
  };
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...IPHONE, locale: "de-DE" });
  const page = await ctx.newPage();
  await page.goto("https://salon-liora.vercel.app/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(1500);
  try {
    await page.getByRole("button", { name: /Akzeptieren|Accept/i }).first().click({ timeout: 800 });
  } catch {}
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  const raw = ".tmp-verify/mobile-lt.png";
  await page.screenshot({ path: raw, fullPage: false });
  await sharp(raw).removeAlpha().jpeg({ quality: 94, mozjpeg: true }).toFile(path.join(DIR, "mobile-true-lt.jpg"));
  await browser.close();
  console.log("captured lt");
}

(async () => {
  if (!fs.existsSync(path.join(DIR, "mobile-true-lt.jpg"))) {
    await captureLt();
  }
  // ensure lt from latest verify shot if jpg missing content
  if (fs.existsSync(".tmp-verify/mobile-lt.png")) {
    const m = await sharp(".tmp-verify/mobile-lt.png").metadata();
    if (m.height >= 2000) {
      await sharp(".tmp-verify/mobile-lt.png")
        .removeAlpha()
        .jpeg({ quality: 94, mozjpeg: true })
        .toFile(path.join(DIR, "mobile-true-lt.jpg"));
    } else {
      await captureLt();
    }
  } else {
    await captureLt();
  }

  for (const id of ["lt", "rt", "lb", "rb"]) {
    const jpg = path.join(DIR, `mobile-true-${id}.jpg`);
    if (!fs.existsSync(jpg)) {
      console.log("missing", jpg);
      continue;
    }
    const out = path.join(DIR, `phone-live-${id}.webp`);
    await compose(jpg, out);
    console.log("ok", id, (await sharp(jpg).metadata()).width + "x" + (await sharp(jpg).metadata()).height);
  }
})();
