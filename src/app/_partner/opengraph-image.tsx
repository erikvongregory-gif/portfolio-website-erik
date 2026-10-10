import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_HOST } from "@/lib/config";

export const alt = "Partnerprogramm EvGlab – 30 % Provision bei Auftrag.";
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
            top: -160,
            right: -40,
            width: 620,
            height: 620,
            borderRadius: 999,
            background:
              "radial-gradient(circle, rgba(91,108,255,0.28) 0%, rgba(91,108,255,0.08) 48%, transparent 72%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -200,
            left: -120,
            width: 520,
            height: 520,
            borderRadius: 999,
            background:
              "radial-gradient(circle, rgba(140,120,255,0.14) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "64px 72px",
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
                  width: 58,
                  height: 58,
                  borderRadius: 18,
                  backgroundColor: "#5B6CFF",
                  boxShadow: "0 14px 32px -10px rgba(91,108,255,0.75)",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", width: 26, height: 5, borderRadius: 999, background: "#fff" }} />
                  <div style={{ display: "flex", width: 18, height: 5, borderRadius: 999, background: "#fff" }} />
                  <div style={{ display: "flex", width: 13, height: 5, borderRadius: 999, background: "#fff" }} />
                </div>
              </div>
              <div style={{ display: "flex", fontSize: 30, fontWeight: 500, letterSpacing: "-0.03em" }}>
                EvGlab
              </div>
            </div>

            <div
              style={{
                display: "flex",
                padding: "12px 22px",
                borderRadius: 999,
                background: "rgba(91,108,255,0.1)",
                border: "1px solid rgba(91,108,255,0.28)",
                fontSize: 20,
                fontFamily: "Geist",
                color: "#3D4FD4",
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
            <div style={{ display: "flex", flexDirection: "column", gap: 22, flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  fontSize: 22,
                  fontFamily: "Geist",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#5B6CFF",
                }}
              >
                Empfehlung · Provision
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontSize: 64,
                  fontWeight: 400,
                  lineHeight: 1.06,
                  letterSpacing: "-0.045em",
                  maxWidth: 620,
                }}
              >
                <div style={{ display: "flex", color: "#12131A" }}>Du empfiehlst.</div>
                <div style={{ display: "flex", color: "#5B6CFF" }}>Ich baue.</div>
                <div style={{ display: "flex", color: "#12131A" }}>Du verdienst mit.</div>
              </div>

              <div
                style={{
                  display: "flex",
                  fontSize: 24,
                  fontFamily: "Geist",
                  color: "rgba(18,19,26,0.55)",
                  maxWidth: 540,
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
                height: 280,
                padding: "28px 26px",
                borderRadius: 40,
                background: "rgba(255,255,255,0.82)",
                border: "1px solid rgba(18,19,26,0.08)",
                boxShadow: "0 28px 56px -28px rgba(91,108,255,0.4)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 18,
                  fontFamily: "Geist",
                  color: "rgba(18,19,26,0.48)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Provision
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 118,
                  fontWeight: 500,
                  lineHeight: 0.9,
                  letterSpacing: "-0.06em",
                  color: "#5B6CFF",
                }}
              >
                30%
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 22,
                  fontFamily: "Geist",
                  color: "rgba(18,19,26,0.5)",
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
                fontSize: 26,
                fontWeight: 500,
                letterSpacing: "-0.02em",
                color: "rgba(18,19,26,0.72)",
              }}
            >
              {SITE_HOST}/partner
            </div>

            <div
              style={{
                display: "flex",
                padding: "18px 30px",
                borderRadius: 999,
                backgroundColor: "#5B6CFF",
                color: "#FFFFFF",
                fontSize: 24,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                boxShadow: "0 18px 44px -12px rgba(91,108,255,0.75)",
              }}
            >
              Playbook öffnen →
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
