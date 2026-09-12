const { chromium, devices } = require("playwright");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const DIR = "public/images/final-cta";
const W = 682;
const H = 1024;
const SCREEN = { x0: 132, y0: 64, x1: 550, y1: 958 };

const jobs = [
  { url: "https://salon-liora.vercel.app/", id: "lt" },
  { url: "https://da-peppe.com/", id: "rt" },
  { url: "https://ib-jungen-web.vercel.app/", id: "lb" },
  { url: "https://luenebraeu.vercel.app/", id: "rb", age: true },
];

const IPHONE = {
  ...devices["iPhone 14 Pro"],
  viewport: { width: 393, height: 852 },
  screen: { width: 393, height: 852 },
  deviceScaleFactor: 3,
};

function maskSvg(sw, sh, r) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${sw}" height="${sh}"><rect width="${sw}" height="${sh}" rx="${r}" ry="${r}" fill="#fff"/></svg>`
  );
}

async function dismiss(page, age) {
  await page.waitForTimeout(600);
  const names = [
    /TUTTO/i,
    /ICH BIN MINDESTENS 16/i,
    /ALLE AKZEPTIEREN/i,
    /Akzeptieren/i,
    /Accept/i,
  ];
  for (const name of names) {
    try {
      await page.getByRole("button", { name }).first().click({ timeout: 900 });
      await page.waitForTimeout(350);
    } catch {}
  }
  if (age) {
    const box = page.viewportSize();
    if (box) {
      await page.mouse.click(box.width * 0.5, box.height * 0.58);
      await page.waitForTimeout(500);
    }
    try {
      await page.getByRole("button", { name: /ALLE AKZEPTIEREN/i }).first().click({ timeout: 900 });
    } catch {}
  }
}

async function compose(jpg, outWebp) {
  const sw = SCREEN.x1 - SCREEN.x0 + 1;
  const sh = SCREEN.y1 - SCREEN.y0 + 1;
  const radius = Math.round(Math.min(sw, sh) * 0.12);
  const mask = maskSvg(sw, sh, radius);

  const fitted = await sharp(jpg)
    .resize(sw, sh, { fit: "contain", background: { r: 5, g: 5, b: 5 } })
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
}

(async () => {
  const only = process.argv[2]; // optional id
  const browser = await chromium.launch();
  for (const job of jobs) {
    if (only && job.id !== only) continue;
    console.log("start", job.id);
    const ctx = await browser.newContext({ ...IPHONE, locale: "de-DE" });
    const page = await ctx.newPage();
    page.setDefaultTimeout(20000);
    await page.goto(job.url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(1200);
    await dismiss(page, job.age);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(700);

    const raw = path.join(".tmp-verify", `mobile-${job.id}.png`);
    await page.screenshot({ path: raw, fullPage: false });
    const jpg = path.join(DIR, `mobile-true-${job.id}.jpg`);
    await sharp(raw).removeAlpha().jpeg({ quality: 94, mozjpeg: true }).toFile(jpg);

    const out = path.join(DIR, `phone-true-${job.id}.webp`);
    await compose(jpg, out);
    await sharp(out).png().toFile(path.join(".tmp-verify", `phone-true-${job.id}.png`));
    console.log("ok", job.id, page.viewportSize());
    await ctx.close();
  }
  await browser.close();
  console.log("done");
})();
