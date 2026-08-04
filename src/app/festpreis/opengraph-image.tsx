import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_HOST } from "@/lib/config";

export const alt = "Festpreis-Angebot in 24h – Website ohne Template-Look.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [geistRegular, geistBold] = await Promise.all([
    readFile(join(process.cwd(), "src/app/og-assets/Geist-Regular.ttf")),
    readFile(join(process.cwd(), "src/app/og-assets/Geist-Bold.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          fontFamily: "Geist",
          color: "#1a1c18",
          backgroundColor: "#f4f2ef",
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 90% 10%, rgba(143,191,154,0.28) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 8% 90%, rgba(245,228,166,0.35) 0%, transparent 50%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 60,
                height: 60,
                borderRadius: 16,
                backgroundColor: "#1a1c18",
                color: "#fffcf8",
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              E
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: "-0.01em",
              }}
            >
              EvgLab
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 22px",
              borderRadius: 999,
              border: "1px solid rgba(74,124,89,0.35)",
              backgroundColor: "rgba(223,232,216,0.7)",
              fontSize: 22,
              color: "#2f4a36",
              fontWeight: 700,
            }}
          >
            Festpreis in 24h
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                display: "flex",
                width: 12,
                height: 12,
                borderRadius: 999,
                backgroundColor: "#4a7c59",
              }}
            />
            <div
              style={{
                display: "flex",
                fontSize: 22,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#6b7264",
              }}
            >
              Landsberg am Lech · Bayern
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 74,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
              maxWidth: 980,
            }}
          >
            <div style={{ display: "flex", color: "#1a1c18" }}>
              Was kostet eine Website
            </div>
            <div style={{ display: "flex", color: "#4a7c59" }}>
              ohne Template-Look?
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#56594f",
              maxWidth: 820,
              lineHeight: 1.35,
            }}
          >
            Schriftliches Festpreis-Angebot – individuell, kein Baukasten.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            {SITE_HOST}/festpreis
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "16px 28px",
              borderRadius: 999,
              backgroundColor: "#1a1c18",
              color: "#fffcf8",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            Angebot anfordern →
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: geistRegular, weight: 400, style: "normal" },
        { name: "Geist", data: geistBold, weight: 700, style: "normal" },
      ],
    },
  );
}
