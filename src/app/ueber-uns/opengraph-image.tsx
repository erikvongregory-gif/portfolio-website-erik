import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Erik von Gregory, EvGlab: Ich baue Werbematerial, das hängen bleibt.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Share card from the real page hero — regenerate via `node scripts/og-studio.mjs studio`. */
export default async function Image() {
  const body = await readFile(join(process.cwd(), "src/app/og-assets/studio.png"));
  return new Response(body, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
