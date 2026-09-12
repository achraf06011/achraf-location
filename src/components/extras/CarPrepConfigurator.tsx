"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Cake, Check, Gem, Gift, Heart, Wand2 } from "lucide-react";
import { useTripStore } from "@/store/tripStore";
import type { CarPrepChoice } from "@/lib/types";
import { formatDH } from "@/lib/pricing";
import { CAR_PREP_PRICES } from "@/lib/useTripSummary";
import { cn } from "@/lib/cn";

const OCCASIONS: { id: CarPrepChoice["occasion"]; label: string; icon: typeof Gem }[] = [
  { id: "mariage", label: "Mariage", icon: Gem },
  { id: "anniversaire", label: "Anniversaire", icon: Cake },
  { id: "romantique", label: "Voyage romantique", icon: Heart },
  { id: "surprise", label: "Surprise", icon: Gift },
];

const OPTIONS_BY_OCCASION: Record<CarPrepChoice["occasion"], { id: string; label: string }[]> = {
  mariage: [
    { id: "deco-exterieure", label: "Décoration extérieure" },
    { id: "rubans", label: "Rubans" },
    { id: "fleurs", label: "Fleurs" },
    { id: "deco-interieure", label: "Décoration intérieure" },
  ],
  anniversaire: [
    { id: "deco-anniversaire", label: "Décoration anniversaire" },
    { id: "message-personnalise", label: "Message personnalisé" },
  ],
  romantique: [
    { id: "bouteille-eau", label: "Bouteille d'eau fraîche" },
    { id: "fleurs-romantique", label: "Fleurs" },
    { id: "deco-interieure", label: "Petite décoration intérieure" },
  ],
  surprise: [
    { id: "message-personnalise", label: "Message personnalisé" },
    { id: "deco-surprise", label: "Décoration surprise" },
  ],
};

export default function CarPrepConfigurator() {
  const carPrep = useTripStore((s) => s.carPrep);
  const setCarPrep = useTripStore((s) => s.setCarPrep);
  const [open, setOpen] = useState(!!carPrep);

  const occasion = carPrep?.occasion;
  const options = carPrep?.options ?? [];

  function pickOccasion(id: CarPrepChoice["occasion"]) {
    setCarPrep({ occasion: id, options: [] });
  }

  function toggleOption(id: string) {
    if (!occasion) return;
    const next = options.includes(id) ? options.filter((o) => o !== id) : [...options, id];
    setCarPrep({ occasion, options: next });
  }

  const total = options.reduce((s, id) => s + (CAR_PREP_PRICES[id] ?? 0), 0);

  return (
    <div className="rounded-2xl border border-paper/10 bg-ink-soft p-5">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 w-full text-left">
        <Wand2 size={16} className="text-gold-light" />
        <h3 className="font-display text-lg text-paper flex-1">Préparez ma voiture</h3>
        <span className="text-xs text-paper/40">{open ? "Réduire" : "Ouvrir"}</span>
      </button>

      {open && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 overflow-hidden">
          <p className="text-xs text-paper/45 mb-4">
            Une occasion spéciale ? Composez une préparation sur-mesure pour votre voiture.
          </p>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 mb-4">
            {OCCASIONS.map((occ) => (
              <button
                key={occ.id}
                onClick={() => pickOccasion(occ.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border py-3 text-xs transition-colors",
                  occasion === occ.id
                    ? "border-gold bg-gold/10 text-gold-light"
                    : "border-paper/10 text-paper/60 hover:border-paper/25"
                )}
              >
                <occ.icon size={18} />
                {occ.label}
              </button>
            ))}
          </div>

          {occasion && (
            <div className="space-y-2">
              {OPTIONS_BY_OCCASION[occasion].map((opt) => {
                const active = options.includes(opt.id);
                const price = CAR_PREP_PRICES[opt.id] ?? 0;
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleOption(opt.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-sm transition-colors",
                      active ? "border-gold/50 bg-gold/5 text-paper" : "border-paper/10 text-paper/60 hover:border-paper/25"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          "flex h-4 w-4 items-center justify-center rounded border",
                          active ? "border-gold bg-gold text-ink" : "border-paper/30"
                        )}
                      >
                        {active && <Check size={11} />}
                      </span>
                      {opt.label}
                    </span>
                    <span className="text-gold-light text-xs">+{formatDH(price)}</span>
                  </button>
                );
              })}

              <div className="flex items-center justify-between pt-3 mt-2 border-t border-paper/10 text-sm">
                <span className="text-paper/60">Coût de la préparation</span>
                <span className="font-display text-lg text-gold-light">{formatDH(total)}</span>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
