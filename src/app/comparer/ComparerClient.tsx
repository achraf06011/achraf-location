"use client";

import { Check, Minus, Scale3d, X } from "lucide-react";
import { vehicles } from "@/data/vehicles";
import { useTripStore } from "@/store/tripStore";
import VehicleArt from "@/components/vehicles/VehicleArt";
import Button from "@/components/ui/Button";
import { formatDH } from "@/lib/pricing";
import Reveal from "@/components/ui/Reveal";

const ROWS: {
  label: string;
  render: (v: (typeof vehicles)[number]) => React.ReactNode;
}[] = [
  { label: "Catégorie", render: (v) => v.category },
  { label: "Prix / jour (1-2j)", render: (v) => formatDH(v.priceTiers[0].pricePerDay) },
  { label: "Prix / jour (7j+)", render: (v) => formatDH(v.priceTiers[2].pricePerDay) },
  { label: "Places", render: (v) => v.seats },
  { label: "Bagages", render: (v) => v.bags },
  { label: "Transmission", render: (v) => v.transmission },
  { label: "Carburant", render: (v) => v.fuel },
  { label: "Année", render: (v) => v.year },
  {
    label: "Automatique",
    render: (v) =>
      v.transmission === "Automatique" ? (
        <Check size={16} className="text-emerald-400" />
      ) : (
        <Minus size={16} className="text-paper/25" />
      ),
  },
  { label: "Note clients", render: (v) => `${v.rating} / 5 (${v.reviewsCount})` },
];

export default function ComparerClient() {
  const compareList = useTripStore((s) => s.compareList);
  const toggleCompare = useTripStore((s) => s.toggleCompare);
  const selected = vehicles.filter((v) => compareList.includes(v.id));

  return (
    <div className="container-edge py-10 md:py-14">
      <div className="flex items-center gap-2 mb-2">
        <Scale3d className="text-gold-light" size={22} />
        <h1 className="font-display text-3xl md:text-4xl text-paper">Comparer les véhicules</h1>
      </div>
      <p className="text-paper/50 max-w-xl">
        Sélectionnez jusqu&rsquo;à 3 véhicules depuis la flotte pour comparer prix, capacité et
        équipements côte à côte.
      </p>

      {selected.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-paper/10 bg-ink-soft p-14 text-center">
          <p className="text-paper/55 mb-6">Aucun véhicule sélectionné pour la comparaison.</p>
          <Button href="/vehicules">Parcourir la flotte</Button>
        </div>
      ) : (
        <Reveal className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr>
                <th className="w-40" />
                {selected.map((v) => (
                  <th key={v.id} className="p-3 align-bottom">
                    <div className="relative rounded-2xl overflow-hidden border border-paper/10">
                      <button
                        onClick={() => toggleCompare(v.id)}
                        className="absolute top-2 right-2 z-10 rounded-full bg-ink/60 p-1 text-paper/70 hover:text-clay-light"
                        aria-label="Retirer"
                      >
                        <X size={14} />
                      </button>
                      <div className="h-28">
                        <VehicleArt gradient={v.gradient} silhouette={v.silhouette} id={`cmp-${v.id}`} />
                      </div>
                      <div className="p-3 text-left">
                        <p className="font-display text-lg text-paper">{v.name}</p>
                        <Button href={`/vehicules/${v.slug}`} size="sm" className="mt-2 w-full">
                          Choisir cette voiture
                        </Button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? "bg-ink-soft/40" : ""}>
                  <td className="p-3 text-sm text-paper/50">{row.label}</td>
                  {selected.map((v) => (
                    <td key={v.id} className="p-3 text-sm text-paper text-center">
                      {row.render(v)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      )}
    </div>
  );
}
