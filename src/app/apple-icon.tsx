import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #17140f, #0e0d0c)",
        }}
      >
        <div
          style={{
            fontFamily: "serif",
            fontSize: 92,
            fontWeight: 700,
            color: "#c9a15a",
            letterSpacing: -2,
          }}
        >
          AD
        </div>
      </div>
    ),
    { ...size }
  );
}
