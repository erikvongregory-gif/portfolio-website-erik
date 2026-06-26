import sharp from "sharp";
import { readFile } from "node:fs/promises";
import path from "node:path";

const dir = path.resolve("public/brand");

const jobs = [
  { svg: "evglab-mark.svg", out: "evglab-mark-512.png", width: 512 },
  { svg: "evglab-mark.svg", out: "evglab-mark-1024.png", width: 1024 },
  { svg: "evglab-mark-white.svg", out: "evglab-mark-white-512.png", width: 512 },
  { svg: "evglab-logo.svg", out: "evglab-logo-1200.png", width: 1200 },
  { svg: "evglab-logo-dark.svg", out: "evglab-logo-dark-1200.png", width: 1200 },
];

for (const job of jobs) {
  const input = await readFile(path.join(dir, job.svg));
  await sharp(input, { density: 384 })
    .resize({ width: job.width })
    .png()
    .toFile(path.join(dir, job.out));
  console.log("wrote", job.out);
}
