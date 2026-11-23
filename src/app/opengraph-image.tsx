import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "EvGlab – Websites, 3D-Filme und Reels, die Kunden bringen.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Share card from the real home hero — regenerate via `node scripts/og-studio.mjs` (dev server running). */
export default async function Image() {
  const body = await readFile(join(process.cwd(), "src/app/og-assets/opengraph.png"));
  return new Response(body, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
