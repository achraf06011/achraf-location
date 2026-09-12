"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Plane, Building2, Home, Calendar, ArrowRight } from "lucide-react";
import { useTripStore, type PickupOption } from "@/store/tripStore";
import { cn } from "@/lib/cn";

const LOCATION_OPTIONS: { id: PickupOption; label: string; icon: React.ElementType }[] = [
  { id: "aeroport", label: "Aéroport Marrakech", icon: Plane },
  { id: "agence", label: "Agence Atlas Drive", icon: Building2 },
  { id: "hotel", label: "Hôtel / Riad", icon: Home },
  { id: "adresse", label: "Adresse personnalisée", icon: MapPin },
];

export default function BookingSearch({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const state = useTripStore();
  const [sameDropoff, setSameDropoff] = useState(true);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (sameDropoff) {
      state.setSearch({
        dropoffLocation: state.pickupLocation,
        dropoffCustom: state.pickupCustom,
      });
    }
    router.push("/vehicules");
  }

  return (
    <form
      onSubmit={submit}
      className={cn(
        "grain relative rounded-[28px] border border-paper/10 bg-ink-soft/90 backdrop-blur-xl p-5 md:p-7 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]",
        compact && "p-4 md:p-5"
      )}
    >
      <div className="grid gap-5 md:grid-cols-[1.2fr_1.2fr_1fr] md:gap-6">
        <FieldGroup label="Je récupère ma voiture" step={1}>
          <LocationSelect
            value={state.pickupLocation}
            onChange={(v) => state.setSearch({ pickupLocation: v })}
          />
          {(state.pickupLocation === "hotel" || state.pickupLocation === "adresse") && (
            <input
              type="text"
              placeholder={state.pickupLocation === "hotel" ? "Nom de l'hôtel" : "Votre adresse"}
              value={state.pickupCustom}
              onChange={(e) => state.setSearch({ pickupCustom: e.target.value })}
              className="mt-2 w-full rounded-xl border border-paper/15 bg-ink px-3.5 py-2.5 text-sm text-paper placeholder:text-paper/35 outline-none focus:border-gold"
            />
          )}
        </FieldGroup>

        <FieldGroup label="Je rends ma voiture" step={2}>
          <label className="flex items-center gap-2 text-xs text-paper/60 mb-2.5">
            <input
              type="checkbox"
              checked={sameDropoff}
              onChange={(e) => setSameDropoff(e.target.checked)}
              className="accent-gold h-3.5 w-3.5"
            />
            Même endroit que la récupération
          </label>
          {!sameDropoff && (
            <>
              <LocationSelect
                value={state.dropoffLocation}
                onChange={(v) => state.setSearch({ dropoffLocation: v })}
              />
              {(state.dropoffLocation === "hotel" || state.dropoffLocation === "adresse") && (
                <input
                  type="text"
                  placeholder={state.dropoffLocation === "hotel" ? "Nom de l'hôtel" : "Votre adresse"}
                  value={state.dropoffCustom}
                  onChange={(e) => state.setSearch({ dropoffCustom: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-paper/15 bg-ink px-3.5 py-2.5 text-sm text-paper placeholder:text-paper/35 outline-none focus:border-gold"
                />
              )}
            </>
          )}
          {sameDropoff && (
            <div className="rounded-xl border border-paper/10 bg-ink px-3.5 py-2.5 text-sm text-paper/40">
              Identique à la récupération
            </div>
          )}
        </FieldGroup>

        <FieldGroup label="Dates & horaires" step={3}>
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2 flex items-center gap-2 text-[11px] text-paper/40 mb-0.5">
              <Calendar size={12} /> Départ
            </div>
            <input
              type="date"
              value={state.startDate ?? ""}
              onChange={(e) => state.setSearch({ startDate: e.target.value })}
              className="rounded-xl border border-paper/15 bg-ink px-2.5 py-2.5 text-sm text-paper outline-none focus:border-gold [color-scheme:dark]"
            />
            <input
              type="time"
              value={state.startTime}
              onChange={(e) => state.setSearch({ startTime: e.target.value })}
              className="rounded-xl border border-paper/15 bg-ink px-2.5 py-2.5 text-sm text-paper outline-none focus:border-gold [color-scheme:dark]"
            />
            <div className="col-span-2 flex items-center gap-2 text-[11px] text-paper/40 mb-0.5 mt-1">
              <Calendar size={12} /> Retour
            </div>
            <input
              type="date"
              value={state.endDate ?? ""}
              onChange={(e) => state.setSearch({ endDate: e.target.value })}
              className="rounded-xl border border-paper/15 bg-ink px-2.5 py-2.5 text-sm text-paper outline-none focus:border-gold [color-scheme:dark]"
            />
            <input
              type="time"
              value={state.endTime}
              onChange={(e) => state.setSearch({ endTime: e.target.value })}
              className="rounded-xl border border-paper/15 bg-ink px-2.5 py-2.5 text-sm text-paper outline-none focus:border-gold [color-scheme:dark]"
            />
          </div>
        </FieldGroup>
      </div>

      <button
        type="submit"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-light to-gold py-4 text-sm md:text-base font-semibold text-ink transition-all hover:brightness-110 shadow-[0_10px_40px_-10px_rgba(201,161,90,0.7)]"
      >
        Voir les véhicules disponibles
        <ArrowRight size={18} />
      </button>
    </form>
  );
}

function FieldGroup({
  label,
  step,
  children,
}: {
  label: string;
  step: number;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-paper/50">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gold/20 text-[10px] text-gold-light">
          {step}
        </span>
        {label}
      </p>
      {children}
    </div>
  );
}

function LocationSelect({
  value,
  onChange,
}: {
  value: PickupOption;
  onChange: (v: PickupOption) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {LOCATION_OPTIONS.map((opt) => (
        <button
          type="button"
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={cn(
            "flex items-center gap-1.5 rounded-xl border px-2.5 py-2 text-left text-[12px] transition-colors",
            value === opt.id
              ? "border-gold bg-gold/10 text-gold-light"
              : "border-paper/15 text-paper/60 hover:border-paper/30"
          )}
        >
          <opt.icon size={14} className="shrink-0" />
          <span className="leading-tight">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
