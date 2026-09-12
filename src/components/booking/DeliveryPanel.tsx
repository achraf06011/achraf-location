"use client";

import { Plane, Building2, Home, MapPin, CheckCircle2 } from "lucide-react";
import { useTripStore, type PickupOption } from "@/store/tripStore";
import { DELIVERY_FEES, formatDH } from "@/lib/pricing";
import { cn } from "@/lib/cn";

const OPTIONS: { id: PickupOption; label: string; icon: React.ElementType }[] = [
  { id: "aeroport", label: "Aéroport Marrakech", icon: Plane },
  { id: "hotel", label: "Hôtel", icon: Home },
  { id: "adresse", label: "Adresse personnalisée", icon: MapPin },
  { id: "agence", label: "Agence Atlas Drive", icon: Building2 },
];

export default function DeliveryPanel() {
  const state = useTripStore();

  return (
    <div className="rounded-2xl border border-paper/10 bg-ink-soft p-5">
      <p className="text-sm font-semibold text-paper mb-1">Où souhaitez-vous recevoir votre voiture ?</p>
      <p className="text-xs text-paper/45 mb-4">Le tarif de livraison varie selon la zone.</p>

      <div className="grid grid-cols-2 gap-2">
        {OPTIONS.map((opt) => {
          const fee = DELIVERY_FEES[opt.id];
          const active = state.pickupLocation === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => state.setSearch({ pickupLocation: opt.id })}
              className={cn(
                "flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-colors",
                active ? "border-gold bg-gold/10" : "border-paper/10 hover:border-paper/25"
              )}
            >
              <opt.icon size={16} className={active ? "text-gold-light" : "text-paper/50"} />
              <span className="text-xs text-paper">{opt.label}</span>
              <span className="text-[11px] text-paper/40">{fee > 0 ? `+${formatDH(fee)}` : "Gratuit"}</span>
            </button>
          );
        })}
      </div>

      {(state.pickupLocation === "hotel" || state.pickupLocation === "adresse") && (
        <input
          type="text"
          placeholder={state.pickupLocation === "hotel" ? "Nom de l'hôtel" : "Votre adresse"}
          value={state.pickupCustom}
          onChange={(e) => state.setSearch({ pickupCustom: e.target.value })}
          className="mt-3 w-full rounded-xl border border-paper/15 bg-ink px-3.5 py-2.5 text-sm text-paper placeholder:text-paper/35 outline-none focus:border-gold"
        />
      )}

      {state.pickupLocation === "aeroport" && <FlightForm />}
    </div>
  );
}

function FlightForm() {
  const flightInfo = useTripStore((s) => s.flightInfo);
  const setFlightInfo = useTripStore((s) => s.setFlightInfo);

  const info = flightInfo ?? { flightNumber: "", arrivalTime: "", terminal: "", instructions: "" };

  function update(patch: Partial<typeof info>) {
    setFlightInfo({ ...info, ...patch });
  }

  return (
    <div className="mt-4 rounded-xl bg-ink p-4 space-y-3">
      <p className="flex items-center gap-1.5 text-xs font-medium text-paper/70">
        <Plane size={13} className="text-gold-light" /> Informations de vol
      </p>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="N° de vol (ex: AT1234)"
          value={info.flightNumber}
          onChange={(e) => update({ flightNumber: e.target.value })}
          className="rounded-lg border border-paper/15 bg-ink-soft px-3 py-2 text-xs text-paper placeholder:text-paper/35 outline-none focus:border-gold"
        />
        <input
          type="time"
          value={info.arrivalTime}
          onChange={(e) => update({ arrivalTime: e.target.value })}
          className="rounded-lg border border-paper/15 bg-ink-soft px-3 py-2 text-xs text-paper outline-none focus:border-gold [color-scheme:dark]"
        />
        <input
          type="text"
          placeholder="Terminal"
          value={info.terminal}
          onChange={(e) => update({ terminal: e.target.value })}
          className="col-span-2 rounded-lg border border-paper/15 bg-ink-soft px-3 py-2 text-xs text-paper placeholder:text-paper/35 outline-none focus:border-gold"
        />
        <textarea
          placeholder="Instructions particulières (optionnel)"
          value={info.instructions}
          onChange={(e) => update({ instructions: e.target.value })}
          rows={2}
          className="col-span-2 resize-none rounded-lg border border-paper/15 bg-ink-soft px-3 py-2 text-xs text-paper placeholder:text-paper/35 outline-none focus:border-gold"
        />
      </div>
      {info.flightNumber && info.arrivalTime && (
        <p className="flex items-center gap-1.5 text-xs text-emerald-400">
          <CheckCircle2 size={13} /> Votre voiture sera préparée pour votre arrivée.
        </p>
      )}
    </div>
  );
}
