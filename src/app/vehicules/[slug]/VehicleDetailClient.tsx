"use client";

import Link from "next/link";
import { ChevronLeft, Star, Users, Briefcase, Gauge, Fuel as FuelIcon, Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";
import type { Vehicle } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import Reveal from "@/components/ui/Reveal";
import VehicleGallery from "@/components/vehicles/VehicleGallery";
import PriceSummaryPanel from "@/components/booking/PriceSummaryPanel";
import AvailabilityCalendar from "@/components/vehicles/AvailabilityCalendar";
import PricingTiersBar from "@/components/vehicles/PricingTiersBar";
import DeliveryPanel from "@/components/booking/DeliveryPanel";
import ExtrasSelector from "@/components/extras/ExtrasSelector";
import PackagesSection from "@/components/extras/PackagesSection";
import CarPrepConfigurator from "@/components/extras/CarPrepConfigurator";
import MobileStickyBar from "@/components/vehicles/MobileStickyBar";
import { useTripStore } from "@/store/tripStore";
import { daysBetween } from "@/lib/pricing";

export default function VehicleDetailClient({ vehicle }: { vehicle: Vehicle }) {
  const startDate = useTripStore((s) => s.startDate);
  const endDate = useTripStore((s) => s.endDate);
  const days = Math.max(
    daysBetween(startDate ? new Date(startDate) : null, endDate ? new Date(endDate) : null),
    1
  );

  return (
    <div className="container-edge py-8 md:py-12 pb-28 md:pb-16">
      <Link href="/vehicules" className="inline-flex items-center gap-1.5 text-sm text-paper/50 hover:text-gold-light mb-6">
        <ChevronLeft size={16} /> Retour à la flotte
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <Reveal>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs uppercase tracking-wider text-paper/40">{vehicle.category}</span>
                  {vehicle.badge && <Badge tone={vehicle.badge === "Dernières unités" ? "clay" : "gold"}>{vehicle.badge}</Badge>}
                </div>
                <h1 className="font-display text-4xl md:text-5xl text-paper">{vehicle.name}</h1>
                <p className="mt-2 text-paper/55 max-w-lg">{vehicle.tagline}</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-paper/10 px-3.5 py-2 text-sm text-gold-light shrink-0">
                <Star size={15} className="fill-gold-light" /> {vehicle.rating}
                <span className="text-paper/40 text-xs">({vehicle.reviewsCount} avis)</span>
              </div>
            </div>

            {vehicle.stockLeft && vehicle.stockLeft <= 2 && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-clay/15 border border-clay/30 px-4 py-1.5 text-xs text-clay-light">
                Plus que {vehicle.stockLeft} véhicule{vehicle.stockLeft > 1 ? "s" : ""} disponible{vehicle.stockLeft > 1 ? "s" : ""} pour ces dates
              </p>
            )}
          </Reveal>

          <Reveal delay={0.05}>
            <VehicleGallery vehicle={vehicle} />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <Spec icon={Users} label={`${vehicle.seats} places`} />
              <Spec icon={Briefcase} label={`${vehicle.bags} bagages`} />
              <Spec icon={Gauge} label={vehicle.transmission} />
              <Spec icon={FuelIcon} label={vehicle.fuel} />
              <Spec icon={CalendarIcon} label={`${vehicle.year}`} />
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="rounded-2xl border border-paper/10 bg-ink-soft p-5">
              <p className="text-sm font-semibold text-paper mb-3">Pourquoi choisir cette voiture ?</p>
              <ul className="space-y-2">
                {vehicle.whyChoose.map((reason) => (
                  <li key={reason} className="flex items-start gap-2 text-sm text-paper/65">
                    <CheckCircle2 size={16} className="text-gold-light shrink-0 mt-0.5" /> {reason}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {vehicle.features.map((f) => (
                  <span key={f} className="rounded-full border border-paper/10 px-3 py-1 text-xs text-paper/50">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <AvailabilityCalendar vehicle={vehicle} />
          </Reveal>

          <Reveal delay={0.16}>
            <PricingTiersBar vehicle={vehicle} />
          </Reveal>

          <Reveal delay={0.18}>
            <DeliveryPanel />
          </Reveal>

          <Reveal delay={0.2}>
            <PackagesSection days={days} />
          </Reveal>

          <Reveal delay={0.22}>
            <ExtrasSelector days={days} />
          </Reveal>

          <Reveal delay={0.24}>
            <CarPrepConfigurator />
          </Reveal>
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-24">
            <PriceSummaryPanel vehicle={vehicle} />
          </div>
        </div>
      </div>

      <MobileStickyBar vehicle={vehicle} />
    </div>
  );
}

function Spec({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-paper/10 bg-ink-soft px-3 py-2.5 text-sm text-paper/70">
      <Icon size={16} className="text-gold-light shrink-0" />
      {label}
    </div>
  );
}
