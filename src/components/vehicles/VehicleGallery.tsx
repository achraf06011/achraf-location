"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Vehicle } from "@/lib/types";
import VehicleArt from "./VehicleArt";
import { cn } from "@/lib/cn";

const SHOTS = [
  { id: "profil", label: "Profil", scale: 1, x: 0, y: 0 },
  { id: "avant", label: "Vue avant", scale: 1.8, x: -18, y: 8 },
  { id: "trois-quarts", label: "Trois-quarts", scale: 1.15, x: 6, y: -4 },
  { id: "jantes", label: "Détail jantes", scale: 2.6, x: -30, y: 16 },
];

export default function VehicleGallery({ vehicle }: { vehicle: Vehicle }) {
  const [active, setActive] = useState(0);
  const shot = SHOTS[active];

  return (
    <div>
      <div className="relative h-72 md:h-[420px] overflow-hidden rounded-3xl border border-paper/10">
        <AnimatePresence mode="wait">
          <motion.div
            key={shot.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
            style={{
              transform: `scale(${shot.scale}) translate(${shot.x}%, ${shot.y}%)`,
            }}
          >
            <VehicleArt gradient={vehicle.gradient} silhouette={vehicle.silhouette} id={`gallery-${vehicle.id}`} />
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-4 left-4 rounded-full bg-ink/60 backdrop-blur-md px-3.5 py-1.5 text-xs text-paper/80">
          {shot.label}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2">
        {SHOTS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActive(i)}
            className={cn(
              "relative h-16 overflow-hidden rounded-xl border transition-colors",
              active === i ? "border-gold" : "border-paper/10 hover:border-paper/25"
            )}
          >
            <div
              className="absolute inset-0"
              style={{ transform: `scale(${s.scale * 0.9}) translate(${s.x}%, ${s.y}%)` }}
            >
              <VehicleArt gradient={vehicle.gradient} silhouette={vehicle.silhouette} id={`thumb-${vehicle.id}-${s.id}`} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
