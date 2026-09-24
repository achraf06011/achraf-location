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
  selectedExtraIds: string[];
  selectedPackId: string | null;
  carPrep: CarPrepChoice | null;
  flightInfo: FlightInfo | null;

  compareList: string[];

  loyaltyPoints: number;
  bookings: ConfirmedBooking[];

  setSearch: (patch: Partial<Pick<TripState, "pickupLocation" | "pickupCustom" | "dropoffLocation" | "dropoffCustom" | "startDate" | "endDate" | "startTime" | "endTime">>) => void;
  selectVehicle: (slug: string | null) => void;
  toggleExtra: (id: string) => void;
  setExtras: (ids: string[]) => void;
  selectPack: (id: string | null) => void;
  setCarPrep: (choice: CarPrepChoice | null) => void;
  setFlightInfo: (info: FlightInfo | null) => void;
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
      selectedExtraIds: [],
      selectedPackId: null,
      carPrep: null,
      flightInfo: null,

      compareList: [],

      loyaltyPoints: 0,
      bookings: [],

      setSearch: (patch) => set((s) => ({ ...s, ...patch })),

      selectVehicle: (slug) => set({ activeVehicleSlug: slug }),

      toggleExtra: (id) =>
        set((s) => ({
          selectedExtraIds: s.selectedExtraIds.includes(id)
            ? s.selectedExtraIds.filter((x) => x !== id)
            : [...s.selectedExtraIds, id],
        })),

      setExtras: (ids) => set({ selectedExtraIds: ids }),

      selectPack: (id) =>
        set((s) => ({
          selectedPackId: s.selectedPackId === id ? null : id,
        })),

      setCarPrep: (choice) => set({ carPrep: choice }),

      setFlightInfo: (info) => set({ flightInfo: info }),

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
