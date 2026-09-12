import type { Extra, Pack, PriceTier, Vehicle } from "./types";

export function tierFor(vehicle: Vehicle, days: number): PriceTier {
  const tier = vehicle.priceTiers.find(
    (t) => days >= t.minDays && (t.maxDays === null || days <= t.maxDays)
  );
  return tier ?? vehicle.priceTiers[vehicle.priceTiers.length - 1];
}

export function rentalTotal(vehicle: Vehicle, days: number): number {
  if (days <= 0) return 0;
  return tierFor(vehicle, days).pricePerDay * days;
}

export function baseRateTotal(vehicle: Vehicle, days: number): number {
  const base = vehicle.priceTiers[0].pricePerDay;
  return base * days;
}

export function tierSavings(vehicle: Vehicle, days: number): number {
  return Math.max(0, baseRateTotal(vehicle, days) - rentalTotal(vehicle, days));
}

export function extraLineTotal(extra: Extra, days: number): number {
  return extra.pricingType === "day" ? extra.price * Math.max(days, 1) : extra.price;
}

export function extrasTotal(extras: Extra[], selectedIds: string[], days: number): number {
  return extras
    .filter((e) => selectedIds.includes(e.id))
    .reduce((sum, e) => sum + extraLineTotal(e, days), 0);
}

export function packLineTotal(pack: Pack, days: number): number {
  return pack.pricingType === "day" ? pack.price * Math.max(days, 1) : pack.price;
}

export function packSeparateTotal(pack: Pack, days: number): number {
  return pack.pricingType === "day"
    ? pack.compareAtPrice * Math.max(days, 1)
    : pack.compareAtPrice;
}

export function packSavings(pack: Pack, days: number): number {
  return Math.max(0, packSeparateTotal(pack, days) - packLineTotal(pack, days));
}

export function daysBetween(start: Date | null, end: Date | null): number {
  if (!start || !end) return 0;
  const ms = end.getTime() - start.getTime();
  const days = Math.round(ms / (1000 * 60 * 60 * 24));
  return Math.max(days, 0);
}

export function formatDH(amount: number): string {
  return `${Math.round(amount).toLocaleString("fr-FR")} DH`;
}

export const DELIVERY_FEES: Record<string, number> = {
  aeroport: 150,
  hotel: 100,
  riad: 120,
  adresse: 80,
  agence: 0,
};
