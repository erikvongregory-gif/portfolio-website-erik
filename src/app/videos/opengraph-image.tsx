import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "3D-Produktfilme und Reels von EvGlab: Filme, die man nicht wegwischt.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Share card from the real page hero — regenerate via `node scripts/og-studio.mjs films`. */
export default async function Image() {
  const body = await readFile(join(process.cwd(), "src/app/og-assets/films.png"));
  return new Response(body, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
