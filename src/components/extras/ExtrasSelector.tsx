"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Check, Plus, Sparkles } from "lucide-react";
import { extras } from "@/data/extras";
import { useTripStore } from "@/store/tripStore";
import { getPackById } from "@/data/packs";
import { extraLineTotal, formatDH } from "@/lib/pricing";
import { cn } from "@/lib/cn";
import { getIcon } from "@/lib/icons";

export default function ExtrasSelector({ days }: { days: number }) {
  const selectedExtraIds = useTripStore((s) => s.selectedExtraIds);
  const toggleExtra = useTripStore((s) => s.toggleExtra);
  const selectedPackId = useTripStore((s) => s.selectedPackId);
  const pack = selectedPackId ? getPackById(selectedPackId) : undefined;
  const packIncluded = new Set(pack?.includes ?? []);

  const [flashes, setFlashes] = useState<Record<string, boolean>>({});

  function handleToggle(id: string, isAdding: boolean) {
    toggleExtra(id);
    if (isAdding) {
      setFlashes((f) => ({ ...f, [id]: true }));
      setTimeout(() => setFlashes((f) => ({ ...f, [id]: false })), 700);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={16} className="text-gold-light" />
        <h3 className="font-display text-xl text-paper">Personnalisez votre expérience</h3>
      </div>
      <p className="text-sm text-paper/45 mb-5">
        Ajoutez des options à la demande — le total se met à jour instantanément.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {extras.map((extra) => {
          const included = packIncluded.has(extra.id);
          const active = selectedExtraIds.includes(extra.id) || included;
          const lineTotal = extraLineTotal(extra, days);
          const Icon = getIcon(extra.icon);

          return (
            <div
              key={extra.id}
              className={cn(
                "relative rounded-2xl border p-4 transition-colors",
                active ? "border-gold/50 bg-gold/5" : "border-paper/10 bg-ink-soft"
              )}
            >
              <AnimatePresence>
                {flashes[extra.id] && (
                  <motion.span
                    initial={{ opacity: 0, y: 0, scale: 0.8 }}
                    animate={{ opacity: 1, y: -28, scale: 1.1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute top-2 right-4 text-xs font-semibold text-gold-light pointer-events-none"
                  >
                    +{formatDH(lineTotal)}
                  </motion.span>
                )}
              </AnimatePresence>

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold-light">
                    <Icon size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-paper">{extra.name}</p>
                    <p className="text-xs text-paper/45 mt-1 leading-relaxed">{extra.description}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm">
                  <span className="text-gold-light font-medium">{formatDH(extra.price)}</span>
                  <span className="text-paper/40"> {extra.pricingType === "day" ? "/ jour" : "forfait"}</span>
                </p>

                {included ? (
                  <span className="flex items-center gap-1 rounded-full bg-gold/15 px-3 py-1.5 text-xs text-gold-light">
                    <Check size={13} /> Inclus dans le pack
                  </span>
                ) : (
                  <button
                    onClick={() => handleToggle(extra.id, !selectedExtraIds.includes(extra.id))}
                    className={cn(
                      "flex items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                      active
                        ? "bg-gold text-ink"
                        : "border border-paper/20 text-paper/70 hover:border-gold hover:text-gold-light"
                    )}
                  >
                    {active ? (
                      <>
                        <Check size={13} /> Ajouté
                      </>
                    ) : (
                      <>
                        <Plus size={13} /> Ajouter
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
