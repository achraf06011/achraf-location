"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";

export default function VehiclePhoto({
  src,
  alt,
  position = "center",
  gradient,
  className,
  priority = false,
  sizes = "(min-width: 1024px) 33vw, 100vw",
}: {
  src: string;
  alt: string;
  position?: string;
  gradient?: [string, string];
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div
      className={cn("relative h-full w-full overflow-hidden", className)}
      style={
        gradient
          ? { background: `linear-gradient(160deg, ${gradient[0]}, ${gradient[1]})` }
          : undefined
      }
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        style={{ objectFit: "cover", objectPosition: position }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
    </div>
  );
}
