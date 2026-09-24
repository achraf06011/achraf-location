import type { Vehicle } from "./types";

export function rangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart <= bEnd && bStart <= aEnd;
}

export function isVehicleAvailable(
  vehicle: Vehicle,
  startISO: string | null,
  endISO: string | null,
  liveRanges: [string, string][] = []
): boolean {
  if (!startISO || !endISO) return true;
  const start = new Date(startISO);
  const end = new Date(endISO);
  const allRanges = [...vehicle.unavailableRanges, ...liveRanges];
  return !allRanges.some(([s, e]) => rangesOverlap(start, end, new Date(s), new Date(e)));
}

export function unavailableDatesForMonth(
  vehicle: Vehicle,
  year: number,
  month: number,
  liveRanges: [string, string][] = []
): Set<string> {
  const set = new Set<string>();
  const allRanges = [...vehicle.unavailableRanges, ...liveRanges];
  for (const [s, e] of allRanges) {
    const start = new Date(s);
    const end = new Date(e);
    const cursor = new Date(start);
    while (cursor <= end) {
      if (cursor.getFullYear() === year && cursor.getMonth() === month) {
        set.add(cursor.toISOString().slice(0, 10));
      }
      cursor.setDate(cursor.getDate() + 1);
    }
  }
  return set;
}
