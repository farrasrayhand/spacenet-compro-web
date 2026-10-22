import { ImageResponse } from "next/og";

export const alt =
  "SpaceNet — internet fiber dan wireless untuk rumah dan bisnis di Samarinda";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Gambar Open Graph digenerate Next (next/og); tidak perlu file PNG manual. */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#F5F8FC",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 9999,
              border: "3px solid #1C6FD6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 9999,
                backgroundColor: "#1C6FD6",
              }}
            />
          </div>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700, fontStyle: "italic" }}>
            <span style={{ color: "#16181D" }}>SPACE</span>
            <span style={{ color: "#1C6FD6" }}>NET</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 60, fontWeight: 700, color: "#16181D", lineHeight: 1.1 }}>
            Internet Samarinda
          </div>
          <div style={{ fontSize: 30, color: "#555F6E", lineHeight: 1.4 }}>
            Fiber dan wireless untuk rumah dan bisnis. Paket 30-100 Mbps, tanpa batas FUP.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "2px solid #D5E0EE",
            paddingTop: 22,
            fontSize: 24,
            color: "#555F6E",
          }}
        >
          <span>PT. Space Network Mediatama</span>
          <span style={{ color: "#1C6FD6", fontWeight: 600 }}>0811-585-255</span>
        </div>
      </div>
    ),
    size,
  );
}
