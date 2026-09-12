"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { vehicles } from "@/data/vehicles";
import VehicleCard from "@/components/vehicles/VehicleCard";
import VehicleFilters, { DEFAULT_FILTERS, applyFilters, type FiltersState } from "@/components/vehicles/VehicleFilters";
import CompareBar from "@/components/vehicles/CompareBar";
import BottomSheet from "@/components/ui/BottomSheet";
import { useTripStore } from "@/store/tripStore";
import { isVehicleAvailable } from "@/lib/availability";
import { formatDateFr } from "@/lib/format";
import { LOCATION_LABELS } from "@/lib/format";
import type { Category } from "@/lib/types";

export default function VehiclesPageClient() {
  const searchParams = useSearchParams();
  const presetCategory = searchParams.get("category") as Category | null;

  const [filters, setFilters] = useState<FiltersState>(() => ({
    ...DEFAULT_FILTERS,
    categories: presetCategory ? [presetCategory] : [],
  }));
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sort, setSort] = useState<"popular" | "price-asc" | "price-desc">("popular");

  const startDate = useTripStore((s) => s.startDate);
  const endDate = useTripStore((s) => s.endDate);
  const pickupLocation = useTripStore((s) => s.pickupLocation);

  const filtered = useMemo(() => {
    let result = applyFilters(vehicles, filters);
    if (sort === "price-asc") result = [...result].sort((a, b) => a.priceTiers[0].pricePerDay - b.priceTiers[0].pricePerDay);
    if (sort === "price-desc") result = [...result].sort((a, b) => b.priceTiers[0].pricePerDay - a.priceTiers[0].pricePerDay);
    if (sort === "popular") result = [...result].sort((a, b) => b.reviewsCount - a.reviewsCount);
    return result;
  }, [filters, sort]);

  const availableCount = filtered.filter((v) => isVehicleAvailable(v, startDate, endDate)).length;

  return (
    <div className="container-edge py-10 md:py-14">
      <div className="flex flex-col gap-2 mb-2">
        <h1 className="font-display text-3xl md:text-4xl text-paper">Notre flotte</h1>
        {startDate && endDate && (
          <p className="text-sm text-paper/50">
            Recherche : {formatDateFr(startDate)} → {formatDateFr(endDate)} · Récupération à{" "}
            {LOCATION_LABELS[pickupLocation]} ·{" "}
            <span className="text-gold-light">{availableCount} véhicules disponibles</span>
          </p>
        )}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <VehicleFilters filters={filters} onChange={setFilters} />
          </div>
        </aside>

        <div>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-paper/50">{filtered.length} véhicule{filtered.length > 1 ? "s" : ""}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSheetOpen(true)}
                className="lg:hidden flex items-center gap-1.5 rounded-full border border-paper/15 px-3.5 py-2 text-xs text-paper/70"
              >
                <SlidersHorizontal size={14} /> Filtres
              </button>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="rounded-full border border-paper/15 bg-ink-soft px-3.5 py-2 text-xs text-paper/70 outline-none focus:border-gold"
              >
                <option value="popular">Plus populaires</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-paper/10 bg-ink-soft p-14 text-center text-paper/50">
              Aucun véhicule ne correspond à ces critères. Essayez d&rsquo;élargir vos filtres.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((v, i) => (
                <VehicleCard key={v.id} vehicle={v} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Filtres">
        <VehicleFilters filters={filters} onChange={setFilters} />
      </BottomSheet>

      <CompareBar />
    </div>
  );
}
