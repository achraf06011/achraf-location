"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";
import type { Vehicle } from "@/lib/types";
import { useTripSummary } from "@/lib/useTripSummary";
import { formatDH } from "@/lib/pricing";
import { formatDateFr } from "@/lib/format";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import Button from "@/components/ui/Button";
import { useTripStore } from "@/store/tripStore";

export default function PriceSummaryPanel({ vehicle }: { vehicle: Vehicle }) {
  const router = useRouter();
  const selectVehicle = useTripStore((s) => s.selectVehicle);
  const startDate = useTripStore((s) => s.startDate);
  const endDate = useTripStore((s) => s.endDate);

  const summary = useTripSummary(vehicle.slug);
  const {
    days,
    rental,
    discount,
    pack,
    packTotal,
    standaloneExtras,
    carPrepTotal,
    deliveryFee,
    total,
  } = summary;

  function goToTrip() {
    selectVehicle(vehicle.slug);
    router.push("/reservation");
  }

  return (
    <div className="rounded-2xl border border-gold/20 bg-ink-soft p-5">
      <div className="flex items-center justify-between mb-1">
        <p className="font-display text-lg text-paper">{vehicle.name}</p>
        <span className="text-xs text-paper/40">
          {startDate && endDate ? `${formatDateFr(startDate)} → ${formatDateFr(endDate)}` : ""}
        </span>
      </div>
      <p className="text-xs text-paper/45 mb-4">{days} jour{days > 1 ? "s" : ""} de location</p>

      <div className="space-y-2 text-sm">
        <Row label={`Location (${days} j)`} value={formatDH(rental)} />
        {discount > 0 && <Row label="Offre du moment" value={`- ${formatDH(discount)}`} accent />}
        {pack && <Row label={pack.name} value={formatDH(packTotal)} />}
        {standaloneExtras.map(({ extra, total: t }) => (
          <Row key={extra.id} label={extra.name} value={formatDH(t)} />
        ))}
        {carPrepTotal > 0 && <Row label="Préparation véhicule" value={formatDH(carPrepTotal)} />}
        {deliveryFee > 0 && <Row label="Livraison" value={formatDH(deliveryFee)} />}
      </div>

      <div className="mt-4 pt-4 border-t border-paper/10 flex items-end justify-between">
        <span className="text-paper/60 text-sm">Total</span>
        <span className="font-display text-3xl text-gold-light">
          <AnimatedNumber value={total} suffix=" DH" />
        </span>
      </div>

      <Button onClick={goToTrip} size="lg" className="w-full mt-5">
        Ajouter à mon voyage
        <ArrowRight size={17} />
      </Button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-paper/35">
        <ShieldCheck size={13} /> Sans engagement · Réservation modifiable
      </p>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-paper/55">{label}</span>
      <span className={accent ? "text-emerald-400" : "text-paper/85"}>{value}</span>
    </div>
  );
}
