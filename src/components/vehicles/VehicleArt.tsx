"use client";

import { cn } from "@/lib/cn";
import type { Silhouette } from "@/lib/types";

const SILHOUETTE_TRANSFORM: Record<Silhouette, { sx: number; sy: number; ty: number }> = {
  hatch: { sx: 0.82, sy: 0.88, ty: 6 },
  sedan: { sx: 1, sy: 0.95, ty: 2 },
  suv: { sx: 1.05, sy: 1.22, ty: -10 },
  luxury: { sx: 1.24, sy: 1.06, ty: -2 },
};

export default function VehicleArt({
  gradient,
  silhouette,
  className,
  id,
}: {
  gradient: [string, string];
  silhouette: Silhouette;
  className?: string;
  id: string;
}) {
  const gradId = `grad-${id}`;
  const glowId = `glow-${id}`;
  const t = SILHOUETTE_TRANSFORM[silhouette];

  return (
    <svg
      viewBox="0 0 400 220"
      className={cn("h-full w-full", className)}
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={gradient[0]} />
          <stop offset="100%" stopColor={gradient[1]} />
        </linearGradient>
        <radialGradient id={`vign-${id}`} cx="50%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
        </radialGradient>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={gradient[1]} stopOpacity="0.55" />
          <stop offset="100%" stopColor={gradient[1]} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="220" fill={`url(#${gradId})`} />
      <rect width="400" height="220" fill={`url(#vign-${id})`} />

      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1={260 + i * 34}
          y1="-10"
          x2={210 + i * 34}
          y2="230"
          stroke="#f7f2e9"
          strokeOpacity={0.08 - i * 0.02}
          strokeWidth="1.5"
        />
      ))}

      <ellipse cx="200" cy="176" rx="130" ry="16" fill={`url(#${glowId})`} />

      <g transform={`translate(200,140) scale(${t.sx},${t.sy}) translate(-200,${-140 + t.ty})`}>
        <path
          d="M40,160 C40,140 55,120 75,118 C90,95 120,62 145,58 L225,55 C250,55 265,75 278,95 C300,95 320,105 335,120 C350,130 358,145 358,160 Z"
          fill="#0e0d0c"
          fillOpacity="0.82"
          stroke="#f7f2e9"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
        <path
          d="M100,118 L148,70 L224,67 L268,96 L244,118 Z"
          fill="#f7f2e9"
          fillOpacity="0.18"
        />
        <line x1="100" y1="118" x2="244" y2="118" stroke="#f7f2e9" strokeOpacity="0.25" strokeWidth="1" />

        <circle cx="100" cy="162" r="27" fill="#0e0d0c" stroke="#f7f2e9" strokeOpacity="0.4" strokeWidth="2" />
        <circle cx="100" cy="162" r="11" fill="#f7f2e9" fillOpacity="0.25" />
        <circle cx="300" cy="162" r="27" fill="#0e0d0c" stroke="#f7f2e9" strokeOpacity="0.4" strokeWidth="2" />
        <circle cx="300" cy="162" r="11" fill="#f7f2e9" fillOpacity="0.25" />
      </g>
    </svg>
  );
}
