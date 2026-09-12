"use client";

import { useState } from "react";
import type { Vehicle } from "@/lib/types";
import { useTripSummary } from "@/lib/useTripSummary";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import BottomSheet from "@/components/ui/BottomSheet";
import PriceSummaryPanel from "@/components/booking/PriceSummaryPanel";

export default function MobileStickyBar({ vehicle }: { vehicle: Vehicle }) {
  const [open, setOpen] = useState(false);
  const summary = useTripSummary(vehicle.slug);

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-paper/10 bg-ink-soft/95 backdrop-blur-xl px-4 py-3 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-paper truncate">{vehicle.name}</p>
            <p className="text-xs text-paper/45">
              <AnimatedNumber value={summary.total} suffix=" DH" className="text-gold-light font-semibold" /> · total
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="shrink-0 rounded-full bg-gradient-to-r from-gold-light to-gold px-5 py-2.5 text-sm font-semibold text-ink"
          >
            Voir le total
          </button>
        </div>
      </div>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Votre récapitulatif">
        <PriceSummaryPanel vehicle={vehicle} />
      </BottomSheet>
    </>
  );
}
