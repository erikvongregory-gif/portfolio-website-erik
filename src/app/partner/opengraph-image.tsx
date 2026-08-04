import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_HOST } from "@/lib/config";

export const alt = "Partnerprogramm EvgLab – 30 % Provision bei Auftrag.";
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
          padding: 72,
          fontFamily: "Geist",
          color: "#1a1c18",
          backgroundColor: "#f4f2ef",
          backgroundImage:
            "radial-gradient(ellipse 55% 50% at 12% 20%, rgba(245,228,166,0.5) 0%, transparent 55%), radial-gradient(ellipse 45% 40% at 92% 15%, rgba(168,212,230,0.32) 0%, transparent 50%), radial-gradient(ellipse 40% 35% at 78% 85%, rgba(74,124,89,0.18) 0%, transparent 55%)",
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
            Partnerprogramm
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              flex: 1,
            }}
          >
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
                Empfehlung · Provision
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 68,
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.035em",
                maxWidth: 640,
              }}
            >
              <div style={{ display: "flex", color: "#1a1c18" }}>Du empfiehlst.</div>
              <div style={{ display: "flex", color: "#4a7c59" }}>Ich baue.</div>
              <div style={{ display: "flex", color: "#1a1c18" }}>Du verdienst mit.</div>
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 26,
                color: "#56594f",
                maxWidth: 560,
                lineHeight: 1.35,
              }}
            >
              30 % vom Auftragsvolumen – wenn daraus ein Projekt wird.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: 280,
              height: 300,
              padding: "28px 26px",
              borderRadius: 36,
              backgroundColor: "#fffcf8",
              border: "1.5px solid rgba(22,21,15,0.1)",
              boxShadow: "0 18px 40px -28px rgba(22,21,15,0.35)",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 20,
                fontWeight: 700,
                color: "#6b7264",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Provision
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 120,
                fontWeight: 700,
                lineHeight: 0.9,
                letterSpacing: "-0.06em",
                color: "#2f5c3a",
              }}
            >
              30%
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 22,
                color: "#56594f",
                lineHeight: 1.3,
              }}
            >
              vom Auftrag
            </div>
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
            {SITE_HOST}/partner
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
            Playbook öffnen →
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
