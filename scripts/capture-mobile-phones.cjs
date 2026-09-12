const { chromium, devices } = require("playwright");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const DIR = "public/images/final-cta";
const W = 682;
const H = 1024;

/** Glass rect — aspect tuned to iPhone 14 Pro CSS 393×852. */
const SCREEN = { x0: 132, y0: 64, x1: 550, y1: 958 };

const jobs = [
  { url: "https://salon-liora.vercel.app/", id: "lt", label: "Salon Liora" },
  { url: "https://da-peppe.com/", id: "rt", label: "Da Peppe", cookie: /TUTTO/i, preferHero: /spritz/i },
  { url: "https://ib-jungen-web.vercel.app/", id: "lb", label: "IB Jungen" },
  { url: "https://luenebraeu.vercel.app/", id: "rb", label: "Lünebräu", ageGate: true },
];

/** Real phone CSS viewport (Playwright device uses shorter 660 — wrong for mockups). */
const IPHONE = {
  ...devices["iPhone 14 Pro"],
  viewport: { width: 393, height: 852 },
  screen: { width: 393, height: 852 },
  deviceScaleFactor: 3,
};

function roundSvg(sw, sh, radius) {
  return Buffer.from(
    `<svg width="${sw}" height="${sh}" xmlns="http://www.w3.org/2000/svg">` +
      `<rect width="${sw}" height="${sh}" rx="${radius}" ry="${radius}" fill="#fff"/>` +
      `</svg>`
  );
}

async function dismissOverlays(page, job) {
  await page.waitForTimeout(800);
  const labels = [
    job.cookie,
    /ICH BIN MINDESTENS 16/i,
    /ALLE AKZEPTIEREN/i,
    /TUTTO/i,
    /Akzeptieren/i,
    /Accept/i,
    /Zustimmen/i,
  ].filter(Boolean);

  for (const name of labels) {
    try {
      await page.getByRole("button", { name }).first().click({ timeout: 1200 });
      await page.waitForTimeout(450);
    } catch {}
    try {
      await page.getByText(name).first().click({ timeout: 800 });
      await page.waitForTimeout(350);
    } catch {}
  }

  if (job.ageGate) {
    const box = page.viewportSize();
    if (box) {
      await page.mouse.click(box.width * 0.5, box.height * 0.58);
      await page.waitForTimeout(600);
      await page.mouse.click(box.width * 0.5, box.height * 0.62);
      await page.waitForTimeout(600);
    }
    for (const name of [/ALLE AKZEPTIEREN/i, /Akzeptieren/i]) {
      try {
        await page.getByRole("button", { name }).first().click({ timeout: 1200 });
        await page.waitForTimeout(400);
      } catch {}
    }
  }
}

/** Nudge hero carousels toward a preferred mobile slide when available. */
async function preferHeroSlide(page, preferHero) {
  if (!preferHero) return;
  for (let i = 0; i < 4; i++) {
    const ok = await page.evaluate((reSrc) => {
      const re = new RegExp(reSrc, "i");
      const imgs = [...document.querySelectorAll("img")];
      const active = imgs.find((img) => {
        const src = img.currentSrc || img.src || "";
        if (!re.test(src)) return false;
        const r = img.getBoundingClientRect();
        const style = window.getComputedStyle(img);
        const parent = img.closest("[class*='slide'], [class*='swiper'], section, div");
        const opacity = Number(style.opacity || 1);
        return (
          r.width > 200 &&
          r.height > 200 &&
          r.top < window.innerHeight * 0.75 &&
          opacity > 0.5
        );
      });
      return !!active;
    }, preferHero.source);

    if (ok) return;

    // Try next control, else tap right side of hero
    try {
      await page.locator('button[aria-label*="next" i], button[aria-label*="Next" i], [class*="next"]').first().click({ timeout: 500 });
    } catch {
      const box = page.viewportSize();
      if (box) await page.mouse.click(box.width * 0.88, box.height * 0.4);
    }
    await page.waitForTimeout(650);
  }
}

async function composePhone(shotPath, outPath) {
  const sw = SCREEN.x1 - SCREEN.x0 + 1;
  const sh = SCREEN.y1 - SCREEN.y0 + 1;
  const radius = Math.round(Math.min(sw, sh) * 0.12);
  const mask = roundSvg(sw, sh, radius);

  // Preserve original mobile proportions (contain) — no cover-crop distortion
  const fitted = await sharp(shotPath)
    .resize(sw, sh, { fit: "contain", background: { r: 5, g: 5, b: 5, alpha: 1 } })
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

  const tmp = outPath + ".tmp.webp";
  await sharp({
    create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: plate, left: SCREEN.x0, top: SCREEN.y0 },
      { input: rounded, left: SCREEN.x0, top: SCREEN.y0 },
      { input: path.join(DIR, "iphone-frame.png"), left: 0, top: 0 },
    ])
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(tmp);

  fs.copyFileSync(tmp, outPath);
  fs.unlinkSync(tmp);
}

(async () => {
  fs.mkdirSync(DIR, { recursive: true });
  fs.mkdirSync(".tmp-verify", { recursive: true });

  if (!fs.existsSync(path.join(DIR, "iphone-frame.png"))) {
    throw new Error("iphone-frame.png missing — run rebuild-phone-layers first");
  }

  const browser = await chromium.launch();

  for (const job of jobs) {
    const context = await browser.newContext({ ...IPHONE, locale: "de-DE" });
    const page = await context.newPage();
    await page.goto(job.url, { waitUntil: "domcontentloaded", timeout: 90000 });
    try {
      await page.waitForLoadState("networkidle", { timeout: 15000 });
    } catch {}
    await dismissOverlays(page, job);
    if (job.preferHero) {
      try {
        await preferHeroSlide(page, job.preferHero);
      } catch {}
    }

    // Ensure first viewport: scroll top, wait for hero images
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await page.evaluate(async () => {
      const imgs = [...document.images].filter((i) => i.getBoundingClientRect().height > 80);
      await Promise.all(
        imgs.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((res) => {
                img.onload = img.onerror = () => res();
              })
        )
      );
    });
    await page.waitForTimeout(500);

    const vp = page.viewportSize();
    console.log(job.id, "viewport", vp);

    const raw = path.join(DIR, `mobile-v5-${job.id}-raw.png`);
    await page.screenshot({ path: raw, fullPage: false });
    await page.screenshot({ path: `.tmp-verify/mobile-${job.id}.png`, fullPage: false });

    // Keep native pixel size — only strip alpha. Do NOT force cover-crop.
    const jpg = path.join(DIR, `mobile-v5-${job.id}.jpg`);
    await sharp(raw)
      .removeAlpha()
      .jpeg({ quality: 94, mozjpeg: true })
      .toFile(jpg);

    const out = path.join(DIR, `phone-true-${job.id}.webp`);
    await composePhone(jpg, out);
    await sharp(out).png().toFile(`.tmp-verify/phone-true-${job.id}.png`);
    console.log("ok", job.id, job.label);
    await context.close();
  }

  await browser.close();
  console.log("done");
})();
