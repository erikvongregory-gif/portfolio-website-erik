const { chromium, devices } = require("playwright");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const DIR = "public/images/final-cta";
const PHONE = path.join(DIR, "iphone-front.png");
const W = 682;
const H = 1024;

/**
 * Slightly larger than glass so UI underlaps the opaque bezel (no page bleed).
 * Frame sits on top and masks the edges.
 */
const SCREEN = { x0: 128, y0: 60, x1: 554, y1: 964 };

const jobs = [
  { url: "https://salon-liora.vercel.app/", id: "lt", label: "Salon Liora" },
  { url: "https://da-peppe.com/", id: "rt", label: "Da Peppe" },
  { url: "https://ib-jungen-web.vercel.app/", id: "lb", label: "IB Jungen" },
  { url: "https://luenebraeu.vercel.app/", id: "rb", label: "Lünebräu", ageGate: true },
];

async function makeFrame() {
  const { data, info } = await sharp(PHONE).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const N = w * h;
  const bg = new Uint8Array(N);

  // Strict checkerboard only — keep silver chrome / buttons
  const isChecker = (i) => {
    const o = i * c;
    const r = data[o],
      g = data[o + 1],
      b = data[o + 2];
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma > 198 && max - min < 18;
  };

  const stack = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const i = y * w + x;
    if (bg[i] || !isChecker(i)) return;
    bg[i] = 1;
    stack.push(i);
  };

  for (let x = 0; x < w; x++) {
    push(x, 0);
    push(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    push(0, y);
    push(w - 1, y);
  }
  while (stack.length) {
    const i = stack.pop();
    const x = i % w;
    const y = (i / w) | 0;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const o = i * c;
      if (bg[i]) {
        data[o + 3] = 0;
        continue;
      }
      const inScreen =
        x >= SCREEN.x0 && x <= SCREEN.x1 && y >= SCREEN.y0 && y <= SCREEN.y1;
      const luma = 0.2126 * data[o] + 0.7152 * data[o + 1] + 0.0722 * data[o + 2];
      // Punch display glass (keep Dynamic Island hardware ~luma mid-dark with shape)
      if (inScreen && luma < 42) {
        // Keep island band (sensor pill) opaque
        const onIsland =
          y >= 70 && y <= 92 && x >= 268 && x <= 414 && Math.abs(x - 341) < 78;
        if (!onIsland) data[o + 3] = 0;
      }
    }
  }

  const out = path.join(DIR, "iphone-frame.png");
  await sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toFile(out);
  let opaque = 0;
  for (let i = 0; i < N; i++) if (data[i * c + 3] > 200) opaque++;
  console.log("frame opaque", opaque);
  return out;
}

async function dismissOverlays(page, { ageGate = false } = {}) {
  await page.waitForTimeout(900);
  const labels = [
    /ICH BIN MINDESTENS 16/i,
    /ALLE AKZEPTIEREN/i,
    /Akzeptieren/i,
    /Accept/i,
    /TUTTO/i,
  ];
  for (const name of labels) {
    try {
      await page.getByRole("button", { name }).first().click({ timeout: 1000 });
      await page.waitForTimeout(450);
    } catch {}
    try {
      await page.getByText(name).first().click({ timeout: 700 });
      await page.waitForTimeout(350);
    } catch {}
  }
  if (ageGate) {
    const box = page.viewportSize();
    if (box) {
      await page.mouse.click(box.width * 0.5, box.height * 0.58);
      await page.waitForTimeout(700);
      await page.mouse.click(box.width * 0.5, box.height * 0.62);
      await page.waitForTimeout(700);
    }
    for (const name of [/ALLE AKZEPTIEREN/i, /Akzeptieren/i]) {
      try {
        await page.getByRole("button", { name }).first().click({ timeout: 1200 });
        await page.waitForTimeout(400);
      } catch {}
    }
  }
}

async function composePhone(shotPath, outPath) {
  const sw = SCREEN.x1 - SCREEN.x0 + 1;
  const sh = SCREEN.y1 - SCREEN.y0 + 1;
  const radius = Math.round(Math.min(sw, sh) * 0.12);
  const mask = Buffer.from(
    `<svg width="${sw}" height="${sh}" xmlns="http://www.w3.org/2000/svg">` +
      `<rect width="${sw}" height="${sh}" rx="${radius}" ry="${radius}" fill="#fff"/>` +
      `</svg>`
  );

  const shot = await sharp(shotPath)
    .resize(sw, sh, { fit: "cover", position: "top" })
    .removeAlpha()
    .png()
    .toBuffer();

  const rounded = await sharp(shot)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const plate = await sharp({
    create: { width: sw, height: sh, channels: 4, background: { r: 5, g: 5, b: 5, alpha: 1 } },
  })
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  await sharp({
    create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: plate, left: SCREEN.x0, top: SCREEN.y0 },
      { input: rounded, left: SCREEN.x0, top: SCREEN.y0 },
      { input: path.join(DIR, "iphone-frame.png"), left: 0, top: 0 },
    ])
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(outPath);
}

(async () => {
  fs.mkdirSync(DIR, { recursive: true });
  fs.mkdirSync(".tmp-verify", { recursive: true });
  await makeFrame();

  const browser = await chromium.launch();
  const device = devices["iPhone 14 Pro"];

  for (const job of jobs) {
    const context = await browser.newContext({ ...device, locale: "de-DE" });
    const page = await context.newPage();
    await page.goto(job.url, { waitUntil: "networkidle", timeout: 90000 });
    await dismissOverlays(page, { ageGate: !!job.ageGate });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    const raw = path.join(DIR, `mobile-${job.id}-raw.png`);
    await page.screenshot({ path: raw, fullPage: false });
    await page.screenshot({ path: `.tmp-verify/mobile-${job.id}.png`, fullPage: false });

    await sharp(raw)
      .resize(780, 1688, { fit: "cover", position: "top" })
      .removeAlpha()
      .jpeg({ quality: 92, mozjpeg: true })
      .toFile(path.join(DIR, `mobile-${job.id}.jpg`));

    const out = path.join(DIR, `phone-v4-${job.id}.webp`);
    await composePhone(path.join(DIR, `mobile-${job.id}.jpg`), out);
    console.log("ok", job.id, job.label);
    await context.close();
  }

  await browser.close();
  console.log("done");
})();
