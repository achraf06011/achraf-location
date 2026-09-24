"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Users, Briefcase, Gauge, Scale3d } from "lucide-react";
import type { Vehicle } from "@/lib/types";
import VehiclePhoto from "./VehiclePhoto";
import Badge from "@/components/ui/Badge";
import { formatDH } from "@/lib/pricing";
import { useTripStore } from "@/store/tripStore";
import { cn } from "@/lib/cn";
import { isVehicleAvailable } from "@/lib/availability";
import { useLiveRangesFor } from "@/store/availabilityStore";

export default function VehicleCard({ vehicle, index = 0 }: { vehicle: Vehicle; index?: number }) {
  const compareList = useTripStore((s) => s.compareList);
  const toggleCompare = useTripStore((s) => s.toggleCompare);
  const startDate = useTripStore((s) => s.startDate);
  const endDate = useTripStore((s) => s.endDate);
  const inCompare = compareList.includes(vehicle.id);
  const startingPrice = vehicle.priceTiers[1]?.pricePerDay ?? vehicle.priceTiers[0].pricePerDay;
  const liveRanges = useLiveRangesFor(vehicle.slug);
  const available = isVehicleAvailable(vehicle, startDate, endDate, liveRanges);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: (index % 6) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-3xl border border-paper/10 bg-ink-soft overflow-hidden"
    >
      <Link href={`/vehicules/${vehicle.slug}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <div
            className={cn(
              "absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110",
              !available && "grayscale opacity-50"
            )}
          >
            <VehiclePhoto
              src={vehicle.photo}
              alt={vehicle.name}
              position={vehicle.photoPosition}
              gradient={vehicle.gradient}
              sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink-soft to-transparent" />

          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {!available ? (
              <Badge tone="clay">Indisponible à ces dates</Badge>
            ) : (
              vehicle.badge && (
                <Badge tone={vehicle.badge === "Dernières unités" ? "clay" : "gold"}>{vehicle.badge}</Badge>
              )
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              toggleCompare(vehicle.id);
            }}
            className={cn(
              "absolute top-3 right-3 flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] backdrop-blur-md transition-colors",
              inCompare
                ? "border-gold bg-gold/20 text-gold-light"
                : "border-paper/20 bg-ink/40 text-paper/70 hover:border-paper/40"
            )}
          >
            <Scale3d size={13} />
            {inCompare ? "Ajouté" : "Comparer"}
          </button>

          {available && vehicle.stockLeft && vehicle.stockLeft <= 2 && (
            <div className="absolute bottom-3 left-3 rounded-full bg-clay/90 px-3 py-1 text-[11px] font-medium text-paper">
              Plus que {vehicle.stockLeft} véhicule{vehicle.stockLeft > 1 ? "s" : ""} disponible{vehicle.stockLeft > 1 ? "s" : ""}
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-paper/40">{vehicle.category}</p>
              <h3 className="font-display text-xl text-paper mt-0.5">{vehicle.name}</h3>
            </div>
            <div className="flex items-center gap-1 text-xs text-gold-light shrink-0 mt-1">
              <Star size={13} className="fill-gold-light" />
              {vehicle.rating}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3 text-paper/45 text-xs">
            <span className="flex items-center gap-1">
              <Users size={13} /> {vehicle.seats}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase size={13} /> {vehicle.bags}
            </span>
            <span className="flex items-center gap-1">
              <Gauge size={13} /> {vehicle.transmission === "Automatique" ? "Auto" : "Manuelle"}
            </span>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              {vehicle.discountPercent ? (
                <div className="flex items-center gap-2">
                  <span className="text-paper/35 text-xs line-through">
                    {formatDH(vehicle.priceTiers[0].pricePerDay)}
                  </span>
                  <Badge tone="clay" className="px-2 py-0.5 text-[10px]">
                    -{vehicle.discountPercent}%
                  </Badge>
                </div>
              ) : null}
              <p className="text-paper">
                <span className="font-display text-2xl text-gold-light">{formatDH(startingPrice)}</span>
                <span className="text-paper/40 text-sm"> /jour</span>
              </p>
            </div>
            <span className="rounded-full border border-paper/20 px-4 py-2 text-xs font-medium text-paper group-hover:border-gold group-hover:text-gold-light group-hover:bg-gold/5 transition-colors">
              Personnaliser
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
