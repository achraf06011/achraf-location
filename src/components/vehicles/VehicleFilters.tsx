"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Category, Fuel, Transmission } from "@/lib/types";

export interface FiltersState {
  categories: Category[];
  transmissions: Transmission[];
  fuels: Fuel[];
  maxPrice: number;
  minSeats: number;
}

export const DEFAULT_FILTERS: FiltersState = {
  categories: [],
  transmissions: [],
  fuels: [],
  maxPrice: 1200,
  minSeats: 0,
};

const CATEGORIES: Category[] = ["Économique", "Compacte", "SUV", "Premium", "Luxe"];
const TRANSMISSIONS: Transmission[] = ["Automatique", "Manuelle"];
const FUELS: Fuel[] = ["Essence", "Diesel", "Hybride", "Électrique"];

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function VehicleFilters({
  filters,
  onChange,
}: {
  filters: FiltersState;
  onChange: (f: FiltersState) => void;
}) {
  const hasActive =
    filters.categories.length > 0 ||
    filters.transmissions.length > 0 ||
    filters.fuels.length > 0 ||
    filters.minSeats > 0 ||
    filters.maxPrice < 1200;

  return (
    <div className="rounded-2xl border border-paper/10 bg-ink-soft p-5">
      <div className="flex items-center justify-between mb-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-paper">
          <SlidersHorizontal size={16} className="text-gold-light" /> Filtres
        </p>
        {hasActive && (
          <button
            onClick={() => onChange(DEFAULT_FILTERS)}
            className="flex items-center gap-1 text-xs text-paper/50 hover:text-clay-light"
          >
            <X size={12} /> Réinitialiser
          </button>
        )}
      </div>

      <FilterGroup title="Catégorie">
        {CATEGORIES.map((c) => (
          <Chip
            key={c}
            active={filters.categories.includes(c)}
            onClick={() => onChange({ ...filters, categories: toggle(filters.categories, c) })}
          >
            {c}
          </Chip>
        ))}
      </FilterGroup>

      <FilterGroup title="Transmission">
        {TRANSMISSIONS.map((t) => (
          <Chip
            key={t}
            active={filters.transmissions.includes(t)}
            onClick={() => onChange({ ...filters, transmissions: toggle(filters.transmissions, t) })}
          >
            {t}
          </Chip>
        ))}
      </FilterGroup>

      <FilterGroup title="Carburant">
        {FUELS.map((f) => (
          <Chip
            key={f}
            active={filters.fuels.includes(f)}
            onClick={() => onChange({ ...filters, fuels: toggle(filters.fuels, f) })}
          >
            {f}
          </Chip>
        ))}
      </FilterGroup>

      <div className="mb-1">
        <p className="text-xs uppercase tracking-wider text-paper/40 mb-3">
          Prix max / jour · {filters.maxPrice} DH
        </p>
        <input
          type="range"
          min={200}
          max={1200}
          step={50}
          value={filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-gold"
        />
      </div>

      <div className="mt-4">
        <p className="text-xs uppercase tracking-wider text-paper/40 mb-3">
          Places min · {filters.minSeats || "Toutes"}
        </p>
        <div className="flex gap-1.5">
          {[0, 2, 4, 5, 7].map((n) => (
            <Chip key={n} active={filters.minSeats === n} onClick={() => onChange({ ...filters, minSeats: n })}>
              {n === 0 ? "Toutes" : `${n}+`}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-xs uppercase tracking-wider text-paper/40 mb-3">{title}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs transition-colors",
        active
          ? "border-gold bg-gold/15 text-gold-light"
          : "border-paper/15 text-paper/60 hover:border-paper/30"
      )}
    >
      {children}
    </button>
  );
}

export function applyFilters<T extends { category: Category; transmission: Transmission; fuel: Fuel; seats: number; priceTiers: { pricePerDay: number }[] }>(
  items: T[],
  filters: FiltersState
): T[] {
  return items.filter((v) => {
    if (filters.categories.length && !filters.categories.includes(v.category)) return false;
    if (filters.transmissions.length && !filters.transmissions.includes(v.transmission)) return false;
    if (filters.fuels.length && !filters.fuels.includes(v.fuel)) return false;
    if (filters.minSeats && v.seats < filters.minSeats) return false;
    if (v.priceTiers[0].pricePerDay > filters.maxPrice) return false;
    return true;
  });
}
