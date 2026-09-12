"use client";

import { motion } from "framer-motion";
import type { Vehicle } from "@/lib/types";
import VehiclePhoto from "./VehiclePhoto";

export default function VehicleGallery({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative h-72 md:h-[420px] overflow-hidden rounded-3xl border border-paper/10"
      >
        <VehiclePhoto
          src={vehicle.photo}
          alt={vehicle.name}
          position={vehicle.photoPosition}
          gradient={vehicle.gradient}
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
        />
      </motion.div>
      <p className="mt-2 text-right text-[11px] text-paper/25">Photo : {vehicle.photoCredit}</p>
    </div>
  );
}
