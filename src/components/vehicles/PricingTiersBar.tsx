"use client";

import { motion } from "framer-motion";
import { TrendingDown } from "lucide-react";
import type { Vehicle } from "@/lib/types";
import { baseRateTotal, formatDH, rentalTotal, tierSavings } from "@/lib/pricing";
import { cn } from "@/lib/cn";

const MILESTONES = [1, 3, 7, 14];

export default function PricingTiersBar({ vehicle }: { vehicle: Vehicle }) {
  const maxSavings = tierSavings(vehicle, 14);

  return (
    <div className="rounded-2xl border border-paper/10 bg-ink-soft p-5">
      <p className="flex items-center gap-2 text-sm font-semibold text-paper mb-1">
        <TrendingDown size={16} className="text-gold-light" /> Tarification intelligente
      </p>
      <p className="text-xs text-paper/45 mb-5">
        Plus vous restez, plus le tarif journalier baisse.
      </p>

      <div className="grid grid-cols-4 gap-2">
        {MILESTONES.map((days) => {
          const savings = tierSavings(vehicle, days);
          const heightPct = maxSavings > 0 ? Math.max(18, (savings / maxSavings) * 100) : 18;
          return (
            <div key={days} className="flex flex-col items-center">
              <div className="h-24 w-full flex items-end justify-center rounded-lg bg-ink overflow-hidden">
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: `${heightPct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "w-full rounded-t-lg",
                    savings > 0 ? "bg-gradient-to-t from-gold-dim to-gold-light" : "bg-paper/10"
                  )}
                />
              </div>
              <p className="mt-2 text-xs text-paper/70 font-medium">{days} j</p>
              <p className="text-[11px] text-gold-light">
                {savings > 0 ? `-${formatDH(savings)}` : "—"}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-xl bg-gold/10 border border-gold/20 px-4 py-3 text-xs text-gold-light">
        Vous économisez {formatDH(tierSavings(vehicle, 7))} avec une location de 7 jours, comparé au
        tarif court séjour ({formatDH(baseRateTotal(vehicle, 7))} → {formatDH(rentalTotal(vehicle, 7))}).
      </div>
    </div>
  );
}
