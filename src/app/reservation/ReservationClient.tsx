"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, MapPin, Plane, ShieldCheck, Sparkles } from "lucide-react";
import { useTripStore } from "@/store/tripStore";
import { useTripSummary } from "@/lib/useTripSummary";
import { formatDH } from "@/lib/pricing";
import { formatDateFrLong, LOCATION_LABELS } from "@/lib/format";
import VehiclePhoto from "@/components/vehicles/VehiclePhoto";
import Button from "@/components/ui/Button";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import Reveal from "@/components/ui/Reveal";

export default function ReservationClient() {
  const router = useRouter();
  const summary = useTripSummary();
  const state = useTripStore();
  const confirmBooking = useTripStore((s) => s.confirmBooking);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    vehicle,
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

  if (!vehicle) {
    return (
      <div className="container-edge py-20 text-center">
        <p className="text-paper/55 mb-6">Vous n&rsquo;avez pas encore choisi de véhicule.</p>
        <Button href="/vehicules">Choisir une voiture</Button>
      </div>
    );
  }

  const hasDates = Boolean(state.startDate && state.endDate);
  const canConfirm = name.trim().length > 1 && phone.trim().length > 6 && hasDates;

  async function handleConfirm() {
    if (!vehicle || !canConfirm || submitting) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleSlug: vehicle.slug,
          vehicleName: vehicle.name,
          customerName: name.trim(),
          customerPhone: phone.trim(),
          startDate: state.startDate,
          endDate: state.endDate,
          pickupLocation: state.pickupLocation,
          pickupCustom: state.pickupCustom,
          dropoffLocation: state.dropoffLocation,
          dropoffCustom: state.dropoffCustom,
          extras: state.selectedExtraIds,
          packId: state.selectedPackId,
          carPrep: state.carPrep,
          flightInfo: state.flightInfo,
          total,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.message ?? data.error ?? "Une erreur est survenue. Réessayez.");
        return;
      }

      const booking = confirmBooking({
        id: data.reservation.id,
        vehicleSlug: vehicle.slug,
        vehicleName: vehicle.name,
        startDate: state.startDate ?? "",
        endDate: state.endDate ?? "",
        days,
        pickupLocation: state.pickupLocation,
        pickupCustom: state.pickupCustom,
        dropoffLocation: state.dropoffLocation,
        dropoffCustom: state.dropoffCustom,
        selectedExtraIds: state.selectedExtraIds,
        selectedPackId: state.selectedPackId,
        carPrep: state.carPrep,
        flightInfo: state.flightInfo,
        total,
      });
      state.resetConfig();
      state.selectVehicle(null);
      router.push(`/confirmation?id=${booking.id}`);
    } catch {
      setSubmitError("Impossible de contacter le serveur. Vérifiez votre connexion et réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-edge py-10 md:py-14 pb-32 md:pb-16">
      <h1 className="font-display text-3xl md:text-4xl text-paper mb-1">Votre voyage</h1>
      <p className="text-paper/50 mb-10">Vérifiez les détails avant de confirmer votre réservation.</p>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Reveal>
            <div className="rounded-2xl border border-paper/10 bg-ink-soft overflow-hidden">
              <div className="h-40 relative">
                <VehiclePhoto src={vehicle.photo} alt={vehicle.name} position={vehicle.photoPosition} gradient={vehicle.gradient} sizes="600px" />
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="font-display text-xl text-paper">{vehicle.name}</p>
                  <p className="text-sm text-paper/50">
                    {formatDateFrLong(state.startDate)} → {formatDateFrLong(state.endDate)} · {days} jour{days > 1 ? "s" : ""}
                  </p>
                </div>
                <Link href={`/vehicules/${vehicle.slug}`} className="text-sm text-gold-light hover:underline shrink-0">
                  Modifier
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="rounded-2xl border border-paper/10 bg-ink-soft p-5 space-y-3">
              <p className="flex items-center gap-2 text-sm font-semibold text-paper">
                <MapPin size={15} className="text-gold-light" /> Lieu de récupération
              </p>
              <p className="text-sm text-paper/60">
                {LOCATION_LABELS[state.pickupLocation]}
                {state.pickupCustom && ` — ${state.pickupCustom}`}
              </p>
              {state.flightInfo?.flightNumber && (
                <p className="flex items-center gap-1.5 text-xs text-paper/45">
                  <Plane size={13} /> Vol {state.flightInfo.flightNumber} · arrivée {state.flightInfo.arrivalTime}
                </p>
              )}
            </div>
          </Reveal>

          {(pack || standaloneExtras.length > 0 || carPrepTotal > 0) && (
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-paper/10 bg-ink-soft p-5">
                <p className="flex items-center gap-2 text-sm font-semibold text-paper mb-3">
                  <Sparkles size={15} className="text-gold-light" /> Options sélectionnées
                </p>
                <ul className="space-y-2 text-sm">
                  {pack && (
                    <li className="flex items-center justify-between text-paper/70">
                      <span>{pack.name}</span>
                      <span>{formatDH(packTotal)}</span>
                    </li>
                  )}
                  {standaloneExtras.map(({ extra, total: t }) => (
                    <li key={extra.id} className="flex items-center justify-between text-paper/70">
                      <span>
                        {extra.name} {extra.pricingType === "day" ? `× ${days} j` : ""}
                      </span>
                      <span>{formatDH(t)}</span>
                    </li>
                  ))}
                  {carPrepTotal > 0 && (
                    <li className="flex items-center justify-between text-paper/70">
                      <span>Préparation véhicule</span>
                      <span>{formatDH(carPrepTotal)}</span>
                    </li>
                  )}
                </ul>
              </div>
            </Reveal>
          )}

          <Reveal delay={0.15}>
            <div className="rounded-2xl border border-paper/10 bg-ink-soft p-5">
              <p className="text-sm font-semibold text-paper mb-4">Vos coordonnées</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Prénom et nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl border border-paper/15 bg-ink px-3.5 py-2.5 text-sm text-paper placeholder:text-paper/35 outline-none focus:border-gold"
                />
                <input
                  type="tel"
                  placeholder="Téléphone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-xl border border-paper/15 bg-ink px-3.5 py-2.5 text-sm text-paper placeholder:text-paper/35 outline-none focus:border-gold"
                />
              </div>
              {!hasDates && (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-clay-light">
                  <AlertTriangle size={13} />
                  Choisissez vos dates sur la fiche du véhicule avant de confirmer.
                </p>
              )}
              <p className="mt-2 text-[11px] text-paper/35">
                Après validation, notre équipe vous appelle pour vérifier votre demande avant de
                bloquer le véhicule.
              </p>
            </div>
          </Reveal>

          {submitError && (
            <Reveal delay={0.18}>
              <div className="flex items-start gap-2.5 rounded-2xl border border-clay/30 bg-clay/10 p-4 text-sm text-clay-light">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                {submitError}
              </div>
            </Reveal>
          )}
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-gold/20 bg-ink-soft p-5">
            <p className="font-display text-lg text-paper mb-4">Total du voyage</p>
            <div className="space-y-2 text-sm">
              <Row label="Location" value={formatDH(rental - discount)} />
              {pack && <Row label={pack.name} value={formatDH(packTotal)} />}
              {standaloneExtras.length > 0 && <Row label="Options" value={formatDH(summary.extrasTotal)} />}
              {carPrepTotal > 0 && <Row label="Préparation" value={formatDH(carPrepTotal)} />}
              {deliveryFee > 0 && <Row label="Livraison" value={formatDH(deliveryFee)} />}
            </div>
            <div className="mt-4 pt-4 border-t border-paper/10 flex items-end justify-between">
              <span className="text-paper/60 text-sm">Total</span>
              <span className="font-display text-3xl text-gold-light">
                <AnimatedNumber value={total} suffix=" DH" />
              </span>
            </div>
            <Button onClick={handleConfirm} size="lg" className="w-full mt-5" disabled={!canConfirm || submitting}>
              {submitting ? "Envoi en cours…" : "Confirmer ma réservation"}
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-paper/35">
              <ShieldCheck size={13} /> Réservation de démonstration
            </p>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-paper/10 bg-ink-soft/95 backdrop-blur-xl px-4 py-3 lg:hidden flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-paper/45">Total</p>
          <p className="font-display text-lg text-gold-light">{formatDH(total)}</p>
        </div>
        <Button onClick={handleConfirm} disabled={!canConfirm || submitting}>
          {submitting ? "Envoi…" : "Confirmer"}
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-paper/55">{label}</span>
      <span className="text-paper/85">{value}</span>
    </div>
  );
}
