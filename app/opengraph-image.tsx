import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Proposar — AI Proposal Generator for Freelancers & Agencies";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a14 0%, #12121e 50%, #1a1a28 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 48,
          }}
        >
          <span
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: "#D4AF37",
              marginBottom: 16,
              letterSpacing: "-0.02em",
            }}
          >
            Proposar
          </span>
          <p
            style={{
              fontSize: 28,
              color: "#faf8f4",
              textAlign: "center",
              maxWidth: 800,
              lineHeight: 1.3,
              margin: 0,
            }}
          >
            AI Proposal Generator for Freelancers & Agencies
          </p>
          <p
            style={{
              fontSize: 20,
              color: "#888890",
              textAlign: "center",
              marginTop: 16,
            }}
          >
            Generate winning proposals in 60 seconds. Track opens. Close faster.
          </p>
          <div
            style={{
              display: "flex",
              marginTop: 32,
              padding: "12px 24px",
              backgroundColor: "#D4AF37",
              borderRadius: 8,
              color: "#0a0a14",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            Start free →
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
