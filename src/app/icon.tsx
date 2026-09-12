import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0e0d0c",
          borderRadius: 14,
        }}
      >
        <div
          style={{
            fontFamily: "serif",
            fontSize: 34,
            fontWeight: 700,
            color: "#c9a15a",
            letterSpacing: -1,
          }}
        >
          AD
        </div>
      </div>
    ),
    { ...size }
  );
}
