"use client";

import { useMemo } from "react";
import { useTripStore } from "@/store/tripStore";
import { getVehicleBySlug } from "@/data/vehicles";
import { extras as allExtras, getExtraById } from "@/data/extras";
import { getPackById } from "@/data/packs";
import {
  DELIVERY_FEES,
  daysBetween,
  extraLineTotal,
  packLineTotal,
  packSavings,
  rentalTotal,
  tierFor,
  tierSavings,
} from "./pricing";

export function useTripSummary(overrideSlug?: string) {
  const state = useTripStore();
  const slug = overrideSlug ?? state.activeVehicleSlug;

  return useMemo(() => {
    const vehicle = slug ? getVehicleBySlug(slug) : undefined;
    const days = Math.max(daysBetween(
      state.startDate ? new Date(state.startDate) : null,
      state.endDate ? new Date(state.endDate) : null
    ), 1);

    const pack = state.selectedPackId ? getPackById(state.selectedPackId) : undefined;
    const packIncludedIds = new Set(pack?.includes ?? []);

    const standaloneExtraIds = state.selectedExtraIds.filter((id) => !packIncludedIds.has(id));
    const standaloneExtras = standaloneExtraIds
      .map((id) => getExtraById(id))
      .filter(Boolean)
      .map((e) => ({
        extra: e!,
        total: extraLineTotal(e!, days),
      }));

    const includedExtras = (pack?.includes ?? [])
      .map((id) => getExtraById(id))
      .filter(Boolean) as typeof allExtras;

    const rental = vehicle ? rentalTotal(vehicle, days) : 0;
    const tier = vehicle ? tierFor(vehicle, days) : undefined;
    const savings = vehicle ? tierSavings(vehicle, days) : 0;

    const discount = vehicle?.discountPercent ? Math.round(rental * (vehicle.discountPercent / 100)) : 0;
    const rentalAfterDiscount = rental - discount;

    const extrasTotal = standaloneExtras.reduce((s, x) => s + x.total, 0);
    const packTotal = pack ? packLineTotal(pack, days) : 0;
    const packSaved = pack ? packSavings(pack, days) : 0;

    const carPrepTotal =
      state.carPrep?.options.reduce((sum, opt) => {
        return sum + (CAR_PREP_PRICES[opt] ?? 0);
      }, 0) ?? 0;

    const deliveryFee =
      state.pickupLocation !== "agence" ? DELIVERY_FEES[state.pickupLocation] ?? 0 : 0;

    const total = rentalAfterDiscount + extrasTotal + packTotal + carPrepTotal + deliveryFee;
    const pointsEarned = Math.round(total * 0.1);

    return {
      vehicle,
      days,
      tier,
      rental,
      discount,
      rentalAfterDiscount,
      savings,
      pack,
      packTotal,
      packSaved,
      includedExtras,
      standaloneExtras,
      extrasTotal,
      carPrepTotal,
      deliveryFee,
      total,
      pointsEarned,
      state,
    };
  }, [slug, state]);
}

export const CAR_PREP_PRICES: Record<string, number> = {
  "deco-exterieure": 150,
  rubans: 60,
  fleurs: 120,
  "deco-interieure": 90,
  "deco-anniversaire": 100,
  "message-personnalise": 40,
  "bouteille-eau": 30,
  "fleurs-romantique": 90,
  "deco-surprise": 80,
};
