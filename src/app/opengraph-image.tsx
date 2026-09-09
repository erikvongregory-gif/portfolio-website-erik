import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Erik EvgLab – Websites mit Charakter, die Kunden bringen.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Photoreal laptop mockup with live homepage — regenerate via `node scripts/compose-og.mjs`. */
export default async function Image() {
  const body = await readFile(join(process.cwd(), "src/app/og-assets/opengraph.png"));
  return new Response(body, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
