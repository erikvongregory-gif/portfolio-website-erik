import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_HOST } from "@/lib/config";

export const alt = "Erik EvgLab – Websites mit Charakter, die Kunden bringen.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [tightRegular, tightMedium, tightSemiBold, geistRegular] = await Promise.all([
    readFile(join(process.cwd(), "src/app/og-assets/InterTight-Regular.ttf")),
    readFile(join(process.cwd(), "src/app/og-assets/InterTight-Medium.ttf")),
    readFile(join(process.cwd(), "src/app/og-assets/InterTight-SemiBold.ttf")),
    readFile(join(process.cwd(), "src/app/og-assets/Geist-Regular.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#F6F5F9",
          color: "#12131A",
          fontFamily: "Inter Tight",
        }}
      >
        {/* Soft light atmosphere — not flat white */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(145deg, #FBFAFD 0%, #F3F1F8 48%, #EEEAF6 100%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -220,
            right: -100,
            width: 720,
            height: 720,
            borderRadius: 999,
            background:
              "radial-gradient(circle, rgba(91,108,255,0.28) 0%, rgba(91,108,255,0.08) 42%, transparent 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -280,
            left: -200,
            width: 520,
            height: 520,
            borderRadius: 999,
            background:
              "radial-gradient(circle, rgba(140,120,255,0.1) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Floating craft cards */}
        <div
          style={{
            position: "absolute",
            right: 56,
            top: 148,
            width: 250,
            height: 158,
            borderRadius: 36,
            background: "rgba(255,255,255,0.78)",
            border: "1px solid rgba(18,19,26,0.08)",
            boxShadow: "0 28px 60px -28px rgba(91,108,255,0.45)",
            display: "flex",
            flexDirection: "column",
            padding: 22,
            gap: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              width: "58%",
              height: 14,
              borderRadius: 999,
              background: "rgba(91,108,255,0.7)",
            }}
          />
          <div
            style={{
              display: "flex",
              width: "86%",
              height: 10,
              borderRadius: 999,
              background: "rgba(18,19,26,0.1)",
            }}
          />
          <div
            style={{
              display: "flex",
              width: "70%",
              height: 10,
              borderRadius: 999,
              background: "rgba(18,19,26,0.06)",
            }}
          />
          <div
            style={{
              display: "flex",
              marginTop: "auto",
              width: 92,
              height: 28,
              borderRadius: 999,
              background: "#5B6CFF",
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            right: 92,
            bottom: 118,
            width: 206,
            height: 138,
            borderRadius: 32,
            background: "rgba(91,108,255,0.1)",
            border: "1px solid rgba(91,108,255,0.22)",
            display: "flex",
            flexDirection: "column",
            padding: 18,
            gap: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 38,
              height: 38,
              borderRadius: 14,
              background: "#5B6CFF",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <div style={{ display: "flex", width: 15, height: 3, borderRadius: 999, background: "#fff" }} />
              <div style={{ display: "flex", width: 10, height: 3, borderRadius: 999, background: "#fff" }} />
              <div style={{ display: "flex", width: 7, height: 3, borderRadius: 999, background: "#fff" }} />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              width: "72%",
              height: 9,
              borderRadius: 999,
              background: "rgba(18,19,26,0.16)",
            }}
          />
          <div
            style={{
              display: "flex",
              width: "50%",
              height: 9,
              borderRadius: 999,
              background: "rgba(18,19,26,0.08)",
            }}
          />
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "58px 64px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 56,
                  height: 56,
                  borderRadius: 18,
                  backgroundColor: "#5B6CFF",
                  boxShadow: "0 14px 32px -10px rgba(91,108,255,0.75)",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", width: 24, height: 5, borderRadius: 999, background: "#FFFFFF" }} />
                  <div style={{ display: "flex", width: 17, height: 5, borderRadius: 999, background: "#FFFFFF" }} />
                  <div style={{ display: "flex", width: 12, height: 5, borderRadius: 999, background: "#FFFFFF" }} />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 28,
                  fontWeight: 500,
                  letterSpacing: "-0.03em",
                }}
              >
                Erik EvgLab
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "11px 18px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.72)",
                border: "1px solid rgba(18,19,26,0.08)",
                fontSize: 18,
                fontFamily: "Geist",
                color: "rgba(18,19,26,0.62)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: "#5B6CFF",
                }}
              />
              Landsberg am Lech
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 22,
              maxWidth: 760,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 20,
                fontFamily: "Geist",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#5B6CFF",
              }}
            >
              Webdesign · Webentwicklung
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 76,
                fontWeight: 400,
                lineHeight: 1.04,
                letterSpacing: "-0.048em",
              }}
            >
              <div style={{ display: "flex", color: "rgba(18,19,26,0.38)" }}>
                Websites mit Charakter,
              </div>
              <div style={{ display: "flex", color: "#12131A" }}>die Kunden bringen.</div>
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 24,
                fontFamily: "Geist",
                color: "rgba(18,19,26,0.55)",
                lineHeight: 1.35,
                maxWidth: 580,
              }}
            >
              Individuell. Kein Template. Inklusive kostenlosem Entwurf.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 24,
                fontWeight: 500,
                letterSpacing: "-0.02em",
                color: "rgba(18,19,26,0.72)",
              }}
            >
              {SITE_HOST}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "17px 28px",
                borderRadius: 999,
                backgroundColor: "#5B6CFF",
                color: "#FFFFFF",
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                boxShadow: "0 18px 44px -12px rgba(91,108,255,0.75)",
              }}
            >
              Kostenloses Erstgespräch →
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter Tight", data: tightRegular, weight: 400, style: "normal" },
        { name: "Inter Tight", data: tightMedium, weight: 500, style: "normal" },
        { name: "Inter Tight", data: tightSemiBold, weight: 600, style: "normal" },
        { name: "Geist", data: geistRegular, weight: 400, style: "normal" },
      ],
    },
  );
}
