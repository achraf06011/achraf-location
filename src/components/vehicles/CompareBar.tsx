"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Scale3d, X } from "lucide-react";
import { useTripStore } from "@/store/tripStore";
import { vehicles } from "@/data/vehicles";
import Button from "@/components/ui/Button";
import VehicleArt from "./VehicleArt";

export default function CompareBar() {
  const compareList = useTripStore((s) => s.compareList);
  const clearCompare = useTripStore((s) => s.clearCompare);

  const selected = vehicles.filter((v) => compareList.includes(v.id));

  return (
    <AnimatePresence>
      {selected.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="fixed bottom-4 left-1/2 z-[75] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-gold/25 bg-ink-soft/95 backdrop-blur-xl px-4 py-3 shadow-2xl">
            <div className="flex -space-x-3">
              {selected.map((v) => (
                <div
                  key={v.id}
                  className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-ink-soft"
                >
                  <VehicleArt gradient={v.gradient} silhouette={v.silhouette} id={`bar-${v.id}`} />
                </div>
              ))}
              {Array.from({ length: 3 - selected.length }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-10 rounded-full border-2 border-dashed border-paper/20 bg-ink"
                />
              ))}
            </div>
            <p className="flex-1 text-xs text-paper/60 hidden sm:block">
              <Scale3d size={13} className="inline mr-1 -mt-0.5" />
              {selected.length}/3 véhicules sélectionnés
            </p>
            <button onClick={clearCompare} className="text-paper/40 hover:text-clay-light p-1" aria-label="Vider">
              <X size={16} />
            </button>
            <Button href="/comparer" size="sm">
              Comparer
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
