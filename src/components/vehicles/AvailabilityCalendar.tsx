"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isBefore,
  isSameDay,
  isWithinInterval,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Vehicle } from "@/lib/types";
import { unavailableDatesForMonth } from "@/lib/availability";
import { useTripStore } from "@/store/tripStore";
import { useLiveRangesFor } from "@/store/availabilityStore";
import { daysBetween } from "@/lib/pricing";

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

export default function AvailabilityCalendar({ vehicle }: { vehicle: Vehicle }) {
  const [viewDate, setViewDate] = useState(() => startOfMonth(new Date()));
  const startDate = useTripStore((s) => s.startDate);
  const endDate = useTripStore((s) => s.endDate);
  const setSearch = useTripStore((s) => s.setSearch);
  const liveRanges = useLiveRangesFor(vehicle.slug);

  const today = startOfDay(new Date());
  const unavailable = useMemo(
    () => unavailableDatesForMonth(vehicle, viewDate.getFullYear(), viewDate.getMonth(), liveRanges),
    [vehicle, viewDate, liveRanges]
  );

  const days = eachDayOfInterval({ start: startOfMonth(viewDate), end: endOfMonth(viewDate) });
  const leadingBlanks = (getDay(startOfMonth(viewDate)) + 6) % 7;

  const selStart = startDate ? new Date(startDate) : null;
  const selEnd = endDate ? new Date(endDate) : null;

  function handleClick(day: Date) {
    const iso = format(day, "yyyy-MM-dd");
    if (!selStart || (selStart && selEnd)) {
      setSearch({ startDate: iso, endDate: null });
    } else if (isBefore(day, selStart)) {
      setSearch({ startDate: iso, endDate: null });
    } else {
      setSearch({ endDate: iso });
    }
  }

  const nights = daysBetween(selStart, selEnd);

  return (
    <div className="rounded-2xl border border-paper/10 bg-ink-soft p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-paper">
          <CalendarDays size={16} className="text-gold-light" /> Disponibilité
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewDate((d) => addMonths(d, -1))}
            className="rounded-full p-1.5 text-paper/50 hover:bg-paper/10"
            aria-label="Mois précédent"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs text-paper/70 w-24 text-center capitalize">
            {format(viewDate, "MMMM yyyy", { locale: fr })}
          </span>
          <button
            onClick={() => setViewDate((d) => addMonths(d, 1))}
            className="rounded-full p-1.5 text-paper/50 hover:bg-paper/10"
            aria-label="Mois suivant"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-paper/40 mb-2">
        {WEEKDAYS.map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <div key={`b${i}`} />
        ))}
        {days.map((day) => {
          const iso = format(day, "yyyy-MM-dd");
          const isPast = isBefore(day, today);
          const isUnavailable = unavailable.has(iso);
          const isSelStart = selStart && isSameDay(day, selStart);
          const isSelEnd = selEnd && isSameDay(day, selEnd);
          const inRange =
            selStart && selEnd && isWithinInterval(day, { start: selStart, end: selEnd });
          const disabled = isPast || isUnavailable;

          return (
            <button
              key={iso}
              disabled={disabled}
              onClick={() => handleClick(day)}
              className={cn(
                "aspect-square rounded-lg text-xs flex items-center justify-center transition-colors",
                disabled && "text-paper/15 line-through cursor-not-allowed",
                !disabled && !inRange && "text-paper/70 hover:bg-paper/10",
                !disabled && inRange && !isSelStart && !isSelEnd && "bg-gold/15 text-gold-light",
                !disabled && (isSelStart || isSelEnd) && "bg-gold text-ink font-semibold"
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3 text-paper/40">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-gold" /> Sélection
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-paper/15" /> Indisponible
          </span>
        </div>
        {nights > 0 && (
          <span className="text-gold-light font-medium">
            {nights} jour{nights > 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  );
}
