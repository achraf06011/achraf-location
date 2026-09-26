"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CarPrepChoice } from "@/lib/types";

export type PickupOption = "aeroport" | "agence" | "hotel" | "adresse";

export interface FlightInfo {
  flightNumber: string;
  arrivalTime: string;
  terminal: string;
  instructions: string;
}

interface VehicleDraft {
  selectedExtraIds: string[];
  selectedPackId: string | null;
  carPrep: CarPrepChoice | null;
  flightInfo: FlightInfo | null;
}

export interface ConfirmedBooking {
  id: string;
  vehicleSlug: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
  days: number;
  pickupLocation: PickupOption;
  pickupCustom: string;
  dropoffLocation: PickupOption;
  dropoffCustom: string;
  selectedExtraIds: string[];
  selectedPackId: string | null;
  carPrep: CarPrepChoice | null;
  flightInfo: FlightInfo | null;
  total: number;
  pointsEarned: number;
  createdAt: string;
}

interface TripState {
  pickupLocation: PickupOption;
  pickupCustom: string;
  dropoffLocation: PickupOption;
  dropoffCustom: string;
  startDate: string | null;
  endDate: string | null;
  startTime: string;
  endTime: string;

  activeVehicleSlug: string | null;
  configuringVehicleSlug: string | null;
  vehicleDrafts: Record<string, VehicleDraft>;
  selectedExtraIds: string[];
  selectedPackId: string | null;
  carPrep: CarPrepChoice | null;
  flightInfo: FlightInfo | null;

  compareList: string[];

  loyaltyPoints: number;
  bookings: ConfirmedBooking[];

  setSearch: (patch: Partial<Pick<TripState, "pickupLocation" | "pickupCustom" | "dropoffLocation" | "dropoffCustom" | "startDate" | "endDate" | "startTime" | "endTime">>) => void;
  selectVehicle: (slug: string | null) => void;
  enterVehicleConfig: (slug: string) => void;
  toggleExtra: (id: string) => void;
  selectPack: (id: string | null) => void;
  setCarPrep: (choice: CarPrepChoice | null) => void;
  setFlightInfo: (info: FlightInfo | null) => void;
  presetForExperience: (extraIds: string[], packId: string | null) => void;
  toggleCompare: (vehicleId: string) => void;
  clearCompare: () => void;
  resetConfig: () => void;
  confirmBooking: (booking: Omit<ConfirmedBooking, "createdAt" | "pointsEarned">) => ConfirmedBooking;
}

export const useTripStore = create<TripState>()(
  persist(
    (set) => ({
      pickupLocation: "aeroport",
      pickupCustom: "",
      dropoffLocation: "aeroport",
      dropoffCustom: "",
      startDate: null,
      endDate: null,
      startTime: "10:00",
      endTime: "10:00",

      activeVehicleSlug: null,
      configuringVehicleSlug: null,
      vehicleDrafts: {},
      selectedExtraIds: [],
      selectedPackId: null,
      carPrep: null,
      flightInfo: null,

      compareList: [],

      loyaltyPoints: 0,
      bookings: [],

      setSearch: (patch) => set((s) => ({ ...s, ...patch })),

      selectVehicle: (slug) => set({ activeVehicleSlug: slug }),

      enterVehicleConfig: (slug) =>
        set((s) => {
          if (s.configuringVehicleSlug === slug) {
            return {};
          }

          const drafts = { ...s.vehicleDrafts };

          if (s.configuringVehicleSlug) {
            // Save the vehicle we're leaving so its options are there if we
            // come back (e.g. after browsing another car to compare).
            drafts[s.configuringVehicleSlug] = {
              selectedExtraIds: s.selectedExtraIds,
              selectedPackId: s.selectedPackId,
              carPrep: s.carPrep,
              flightInfo: s.flightInfo,
            };
            const incoming = drafts[slug];
            return {
              configuringVehicleSlug: slug,
              vehicleDrafts: drafts,
              selectedExtraIds: incoming?.selectedExtraIds ?? [],
              selectedPackId: incoming?.selectedPackId ?? null,
              carPrep: incoming?.carPrep ?? null,
              flightInfo: incoming?.flightInfo ?? null,
            };
          }

          // Nothing was actively being configured (fresh visit, or an
          // experience preset just primed these options). If this vehicle
          // already has a saved draft, restore it; otherwise keep whatever
          // is currently selected and adopt it as this vehicle's config.
          const incoming = drafts[slug];
          if (incoming) {
            return {
              configuringVehicleSlug: slug,
              selectedExtraIds: incoming.selectedExtraIds,
              selectedPackId: incoming.selectedPackId,
              carPrep: incoming.carPrep,
              flightInfo: incoming.flightInfo,
            };
          }
          return { configuringVehicleSlug: slug };
        }),

      toggleExtra: (id) =>
        set((s) => ({
          selectedExtraIds: s.selectedExtraIds.includes(id)
            ? s.selectedExtraIds.filter((x) => x !== id)
            : [...s.selectedExtraIds, id],
        })),

      selectPack: (id) =>
        set((s) => ({
          selectedPackId: s.selectedPackId === id ? null : id,
        })),

      setCarPrep: (choice) => set({ carPrep: choice }),

      setFlightInfo: (info) => set({ flightInfo: info }),

      presetForExperience: (extraIds, packId) =>
        set({
          selectedExtraIds: extraIds,
          selectedPackId: packId,
          carPrep: null,
          flightInfo: null,
          configuringVehicleSlug: null,
        }),

      toggleCompare: (vehicleId) =>
        set((s) => {
          if (s.compareList.includes(vehicleId)) {
            return { compareList: s.compareList.filter((x) => x !== vehicleId) };
          }
          if (s.compareList.length >= 3) return s;
          return { compareList: [...s.compareList, vehicleId] };
        }),

      clearCompare: () => set({ compareList: [] }),

      resetConfig: () =>
        set({
          selectedExtraIds: [],
          selectedPackId: null,
          carPrep: null,
          flightInfo: null,
          configuringVehicleSlug: null,
          vehicleDrafts: {},
        }),

      confirmBooking: (booking) => {
        const points = Math.round(booking.total * 0.1);
        const confirmed: ConfirmedBooking = {
          ...booking,
          createdAt: new Date().toISOString(),
          pointsEarned: points,
        };
        set((s) => ({
          bookings: [confirmed, ...s.bookings],
          loyaltyPoints: s.loyaltyPoints + points,
        }));
        return confirmed;
      },
    }),
    {
      name: "atlas-drive-trip",
      version: 1,
      partialize: (s) => ({
        pickupLocation: s.pickupLocation,
        pickupCustom: s.pickupCustom,
        dropoffLocation: s.dropoffLocation,
        dropoffCustom: s.dropoffCustom,
        startDate: s.startDate,
        endDate: s.endDate,
        startTime: s.startTime,
        endTime: s.endTime,
        activeVehicleSlug: s.activeVehicleSlug,
        configuringVehicleSlug: s.configuringVehicleSlug,
        vehicleDrafts: s.vehicleDrafts,
        selectedExtraIds: s.selectedExtraIds,
        selectedPackId: s.selectedPackId,
        carPrep: s.carPrep,
        flightInfo: s.flightInfo,
        compareList: s.compareList,
        loyaltyPoints: s.loyaltyPoints,
        bookings: s.bookings,
      }),
    }
  )
);
