"use client";

import { useEffect } from "react";
import { create } from "zustand";

interface AvailabilityState {
  ranges: Record<string, [string, string][]>;
  status: "idle" | "loading" | "loaded" | "error";
  ensureLoaded: () => void;
}

export const useAvailabilityStore = create<AvailabilityState>((set, get) => ({
  ranges: {},
  status: "idle",

  ensureLoaded: () => {
    if (get().status !== "idle") return;
    set({ status: "loading" });
    fetch("/api/availability")
      .then((res) => (res.ok ? res.json() : { ranges: {} }))
      .then((data) => set({ ranges: data.ranges ?? {}, status: "loaded" }))
      .catch(() => set({ status: "error" }));
  },
}));

export function useLiveRangesFor(vehicleSlug: string): [string, string][] {
  const ensureLoaded = useAvailabilityStore((s) => s.ensureLoaded);
  const ranges = useAvailabilityStore((s) => s.ranges[vehicleSlug]);

  useEffect(() => {
    ensureLoaded();
  }, [ensureLoaded]);

  return ranges ?? [];
}
