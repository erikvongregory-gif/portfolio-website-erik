/**
 * Photoreal OG: warp homepage screenshot into laptop screen via 4-point
 * perspective, then write 1200×630 PNG for Next.js opengraph-image.png.
 *
 * Usage: node scripts/compose-og.mjs
 */
import { chromium } from "playwright";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicOg = join(root, "public", "og-assets");
const srcOg = join(root, "src", "app", "og-assets");

const WIDTH = 1200;
const HEIGHT = 630;

async function main() {
  const plateBuf = await sharp(join(publicOg, "laptop-plate.png"))
    .resize(WIDTH, HEIGHT, { fit: "cover", position: "top" })
    .png()
    .toBuffer();

  const siteBuf = await sharp(join(publicOg, "site-screenshot.png"))
    .resize(1600, 1000, { fit: "cover", position: "top" })
    .extract({ left: 0, top: 0, width: 1600, height: 900 })
    .png()
    .toBuffer();

  const plateB64 = plateBuf.toString("base64");
  const siteB64 = siteBuf.toString("base64");

  // Destination quad on the cropped plate (screen glass corners).
  // Detected from luminance edges on laptop-plate-1200.png.
  // Order: TL → TR → BR → BL
  const dst = [
    [412, 26],
    [1054, 66],
    [1004, 512],
    [388, 432],
  ];

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });

  const pngBuf = await page.evaluate(
    async ({ plateB64, siteB64, WIDTH, HEIGHT, dst }) => {
      function load(src) {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      }

      // Solve perspective matrix mapping unit square → dest quad
      // Adapted from CSS/SVG perspective helpers
      function getTransform(src, dst) {
        const a = [];
        const b = [];
        for (let i = 0; i < 4; i++) {
          const [sx, sy] = src[i];
          const [dx, dy] = dst[i];
          a.push([sx, sy, 1, 0, 0, 0, -sx * dx, -sy * dx]);
          b.push(dx);
          a.push([0, 0, 0, sx, sy, 1, -sx * dy, -sy * dy]);
          b.push(dy);
        }
        // Gaussian elimination
        const m = a.map((row, i) => [...row, b[i]]);
        const n = 8;
        for (let col = 0; col < n; col++) {
          let pivot = col;
          for (let r = col + 1; r < n; r++) {
            if (Math.abs(m[r][col]) > Math.abs(m[pivot][col])) pivot = r;
          }
          [m[col], m[pivot]] = [m[pivot], m[col]];
          const div = m[col][col];
          for (let c = col; c <= n; c++) m[col][c] /= div;
          for (let r = 0; r < n; r++) {
            if (r === col) continue;
            const f = m[r][col];
            for (let c = col; c <= n; c++) m[r][c] -= f * m[col][c];
          }
        }
        return m.map((row) => row[n]);
      }

      function project(t, x, y) {
        const w = t[6] * x + t[7] * y + 1;
        return [(t[0] * x + t[1] * y + t[2]) / w, (t[3] * x + t[4] * y + t[5]) / w];
      }

      const plate = await load(`data:image/png;base64,${plateB64}`);
      const site = await load(`data:image/png;base64,${siteB64}`);

      const canvas = document.createElement("canvas");
      canvas.width = WIDTH;
      canvas.height = HEIGHT;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(plate, 0, 0, WIDTH, HEIGHT);

      const sw = site.naturalWidth;
      const sh = site.naturalHeight;
      const src = [
        [0, 0],
        [sw, 0],
        [sw, sh],
        [0, sh],
      ];
      const t = getTransform(src, dst);

      // Inverse map for sampling: dest → source
      const inv = getTransform(dst, src);

      const out = ctx.getImageData(0, 0, WIDTH, HEIGHT);
      const data = out.data;

      const siteCanvas = document.createElement("canvas");
      siteCanvas.width = sw;
      siteCanvas.height = sh;
      const sctx = siteCanvas.getContext("2d");
      sctx.drawImage(site, 0, 0);
      const siteData = sctx.getImageData(0, 0, sw, sh).data;

      // Bounding box of dest quad
      const xs = dst.map((p) => p[0]);
      const ys = dst.map((p) => p[1]);
      const minX = Math.max(0, Math.floor(Math.min(...xs)));
      const maxX = Math.min(WIDTH - 1, Math.ceil(Math.max(...xs)));
      const minY = Math.max(0, Math.floor(Math.min(...ys)));
      const maxY = Math.min(HEIGHT - 1, Math.ceil(Math.max(...ys)));

      function insideQuad(x, y) {
        // Ray-cast against convex quad
        let inside = false;
        for (let i = 0, j = 3; i < 4; j = i++) {
          const xi = dst[i][0];
          const yi = dst[i][1];
          const xj = dst[j][0];
          const yj = dst[j][1];
          const intersect =
            yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi + 1e-9) + xi;
          if (intersect) inside = !inside;
        }
        return inside;
      }

      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          if (!insideQuad(x + 0.5, y + 0.5)) continue;
          const [sx, sy] = project(inv, x + 0.5, y + 0.5);
          if (sx < 0 || sy < 0 || sx >= sw - 1 || sy >= sh - 1) continue;

          // Bilinear sample
          const x0 = Math.floor(sx);
          const y0 = Math.floor(sy);
          const x1 = x0 + 1;
          const y1 = y0 + 1;
          const fx = sx - x0;
          const fy = sy - y0;

          const i00 = (y0 * sw + x0) * 4;
          const i10 = (y0 * sw + x1) * 4;
          const i01 = (y1 * sw + x0) * 4;
          const i11 = (y1 * sw + x1) * 4;

          const di = (y * WIDTH + x) * 4;
          for (let c = 0; c < 3; c++) {
            const v =
              siteData[i00 + c] * (1 - fx) * (1 - fy) +
              siteData[i10 + c] * fx * (1 - fy) +
              siteData[i01 + c] * (1 - fx) * fy +
              siteData[i11 + c] * fx * fy;
            data[di + c] = v;
          }
          data[di + 3] = 255;
        }
      }

      ctx.putImageData(out, 0, 0);

      // Soft screen glass + blind stripes so it matches plate lighting
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(dst[0][0], dst[0][1]);
      ctx.lineTo(dst[1][0], dst[1][1]);
      ctx.lineTo(dst[2][0], dst[2][1]);
      ctx.lineTo(dst[3][0], dst[3][1]);
      ctx.closePath();
      ctx.clip();

      const glass = ctx.createLinearGradient(dst[0][0], dst[0][1], dst[2][0], dst[2][1]);
      glass.addColorStop(0, "rgba(255,255,255,0.12)");
      glass.addColorStop(0.35, "rgba(255,255,255,0)");
      glass.addColorStop(1, "rgba(0,0,0,0.16)");
      ctx.fillStyle = glass;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      ctx.globalAlpha = 0.12;
      ctx.fillStyle = "#000";
      // diagonal blind stripes
      for (let i = -40; i < 80; i++) {
        const o = i * 22;
        ctx.beginPath();
        ctx.moveTo(o, 0);
        ctx.lineTo(o + 14, 0);
        ctx.lineTo(o + 14 + HEIGHT, HEIGHT);
        ctx.lineTo(o + HEIGHT, HEIGHT);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // Brand badge
      const bx = 28;
      const by = HEIGHT - 54;
      const bw = 168;
      const bh = 40;
      const r = 20;
      ctx.beginPath();
      ctx.moveTo(bx + r, by);
      ctx.arcTo(bx + bw, by, bx + bw, by + bh, r);
      ctx.arcTo(bx + bw, by + bh, bx, by + bh, r);
      ctx.arcTo(bx, by + bh, bx, by, r);
      ctx.arcTo(bx, by, bx + bw, by, r);
      ctx.closePath();
      ctx.fillStyle = "rgba(10,10,14,0.82)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // mark
      const mx = bx + 10;
      const my = by + 7;
      const ms = 26;
      const mr = 8;
      ctx.beginPath();
      ctx.moveTo(mx + mr, my);
      ctx.arcTo(mx + ms, my, mx + ms, my + ms, mr);
      ctx.arcTo(mx + ms, my + ms, mx, my + ms, mr);
      ctx.arcTo(mx, my + ms, mx, my, mr);
      ctx.arcTo(mx, my, mx + ms, my, mr);
      ctx.closePath();
      ctx.fillStyle = "#5B6CFF";
      ctx.fill();
      ctx.fillStyle = "#fff";
      const bars = [
        [mx + 6, my + 7, 14, 2.5],
        [mx + 6, my + 12, 10, 2.5],
        [mx + 6, my + 17, 7, 2.5],
      ];
      for (const [x, y, w, h] of bars) {
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 2);
        ctx.fill();
      }

      ctx.fillStyle = "#fff";
      ctx.font = "500 16px ui-sans-serif, system-ui, sans-serif";
      ctx.textBaseline = "middle";
      ctx.fillText("evglab.com", bx + 46, by + bh / 2 + 1);

      return canvas.toDataURL("image/png").split(",")[1];
    },
    { plateB64, siteB64, WIDTH, HEIGHT, dst },
  );

  await browser.close();

  const buf = Buffer.from(pngBuf, "base64");
  await mkdir(publicOg, { recursive: true });
  await mkdir(srcOg, { recursive: true });

  const outputs = [
    join(publicOg, "opengraph.png"),
    join(srcOg, "opengraph.png"),
  ];
  for (const p of outputs) await writeFile(p, buf);

  console.log(`OG written (${buf.length} bytes)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
