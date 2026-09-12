"use client";

import { Check, PackageCheck } from "lucide-react";
import { packs } from "@/data/packs";
import { getExtraById } from "@/data/extras";
import { useTripStore } from "@/store/tripStore";
import { formatDH, packLineTotal, packSavings } from "@/lib/pricing";
import { cn } from "@/lib/cn";

export default function PackagesSection({ days }: { days: number }) {
  const selectedPackId = useTripStore((s) => s.selectedPackId);
  const selectPack = useTripStore((s) => s.selectPack);

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <PackageCheck size={16} className="text-gold-light" />
        <h3 className="font-display text-xl text-paper">Packs intelligents</h3>
      </div>
      <p className="text-sm text-paper/45 mb-5">
        Plutôt que d&rsquo;ajouter chaque option séparément, économisez avec un pack pensé pour votre voyage.
      </p>

      <div className="grid gap-3 md:grid-cols-3">
        {packs.map((pack) => {
          const active = selectedPackId === pack.id;
          const total = packLineTotal(pack, days);
          const separate = packSavings(pack, days) + total;
          const saved = packSavings(pack, days);

          return (
            <button
              key={pack.id}
              onClick={() => selectPack(pack.id)}
              className={cn(
                "text-left rounded-2xl border p-5 transition-all",
                active ? "border-gold bg-gold/10 shadow-[0_0_0_1px_rgba(201,161,90,0.4)]" : "border-paper/10 bg-ink-soft hover:border-paper/25"
              )}
            >
              <div className="flex items-center justify-between">
                <p className="font-display text-lg text-paper">{pack.name}</p>
                {active && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-ink">
                    <Check size={12} />
                  </span>
                )}
              </div>
              {pack.badge && <p className="text-[11px] text-gold-light mt-1">{pack.badge}</p>}

              <ul className="mt-3 space-y-1.5">
                {pack.includes.map((id) => {
                  const e = getExtraById(id);
                  if (!e) return null;
                  return (
                    <li key={id} className="flex items-center gap-1.5 text-xs text-paper/60">
                      <Check size={12} className="text-gold-light shrink-0" /> {e.name}
                    </li>
                  );
                })}
              </ul>

              <div className="mt-4 pt-4 border-t border-paper/10">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-2xl text-gold-light">{formatDH(total)}</span>
                  <span className="text-xs text-paper/40">
                    {pack.pricingType === "day" ? "/ jour" : "forfait"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-paper/40 line-through">Prix séparément : {formatDH(separate)}</p>
                {saved > 0 && (
                  <p className="mt-1 text-xs font-medium text-emerald-400">Vous économisez {formatDH(saved)}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
