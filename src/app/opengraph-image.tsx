import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Erik EvgLab – Websites mit Charakter, die Kunden bringen.";
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
          color: "#17161B",
          backgroundColor: "#F4F2F7",
          backgroundImage:
            "linear-gradient(135deg, #F8F7FB 0%, #EFEDF3 52%, #E7E4EC 100%)",
        }}
      >
        {/* Header */}
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
                backgroundColor: "#17161B",
                color: "#FFFFFF",
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              E
            </div>
            <div style={{ display: "flex", fontSize: 32, fontWeight: 700, letterSpacing: "-0.01em" }}>
              Erik EvgLab
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 22px",
              borderRadius: 999,
              border: "1px solid rgba(23,22,27,0.12)",
              backgroundColor: "rgba(255,255,255,0.5)",
              fontSize: 22,
              color: "#56545E",
            }}
          >
            Webentwicklung & Design
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", width: 12, height: 12, borderRadius: 999, backgroundColor: "#F5821F" }} />
            <div
              style={{
                display: "flex",
                fontSize: 22,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#8A8893",
              }}
            >
              Digitale Auftritte · Landsberg am Lech
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 82,
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: "-0.035em",
            }}
          >
            <div style={{ display: "flex", color: "#A3A1AB" }}>Websites mit Charakter,</div>
            <div style={{ display: "flex", color: "#17161B" }}>die Kunden bringen.</div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em" }}>
            webdesign.evglab.com
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "16px 28px",
              borderRadius: 999,
              backgroundColor: "#17161B",
              color: "#FFFFFF",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            Kostenloses Erstgespräch →
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
