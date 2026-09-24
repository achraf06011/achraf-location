"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Gem, MessageCircle, PhoneCall, User, XCircle } from "lucide-react";
import { useTripStore } from "@/store/tripStore";
import { formatDH } from "@/lib/pricing";
import { formatDateFrLong } from "@/lib/format";
import Button from "@/components/ui/Button";
import { getVehicleBySlug } from "@/data/vehicles";
import VehiclePhoto from "@/components/vehicles/VehiclePhoto";
import { useReservationStatus } from "@/lib/useReservationStatus";

const STATUS_CONFIG = {
  pending: {
    icon: Clock,
    iconCls: "bg-gold/15 text-gold-light",
    title: "Demande de réservation envoyée",
    badge: "En attente de vérification",
    badgeCls: "bg-gold/15 text-gold-light",
    message:
      "Notre équipe va vous appeler pour vérifier votre demande avant de la confirmer définitivement.",
  },
  confirmed: {
    icon: CheckCircle2,
    iconCls: "bg-emerald-500/15 text-emerald-400",
    title: "Réservation confirmée",
    badge: "Confirmée",
    badgeCls: "bg-emerald-500/15 text-emerald-300",
    message: "Votre réservation a été vérifiée et validée par notre équipe.",
  },
  rejected: {
    icon: XCircle,
    iconCls: "bg-clay/15 text-clay-light",
    title: "Réservation non confirmée",
    badge: "Annulée",
    badgeCls: "bg-clay/20 text-clay-light",
    message:
      "Cette demande n'a pas pu être vérifiée. Contactez-nous si vous pensez qu'il s'agit d'une erreur.",
  },
} as const;

export default function ConfirmationClient() {
  const params = useSearchParams();
  const id = params.get("id");
  const booking = useTripStore((s) => s.bookings.find((b) => b.id === id));
  const loyaltyPoints = useTripStore((s) => s.loyaltyPoints);
  const liveStatus = useReservationStatus(id);

  if (!booking) {
    return (
      <div className="container-edge py-20 text-center">
        <p className="text-paper/55 mb-6">Réservation introuvable.</p>
        <Button href="/vehicules">Réserver une voiture</Button>
      </div>
    );
  }

  const vehicle = getVehicleBySlug(booking.vehicleSlug);
  const status = STATUS_CONFIG[liveStatus ?? "pending"];
  const Icon = status.icon;

  return (
    <div className="container-edge py-14 md:py-20 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 16 }}
        className={`flex h-16 w-16 items-center justify-center rounded-full mb-6 ${status.iconCls}`}
      >
        <Icon size={32} />
      </motion.div>

      <h1 className="font-display text-3xl md:text-4xl text-paper">{status.title}</h1>
      <p className="mt-2 text-paper/55">
        Référence <span className="text-gold-light">{booking.id}</span> — {status.message}
      </p>

      {(liveStatus ?? "pending") === "pending" && (
        <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-gold/20 bg-gold/5 p-4 text-sm text-paper/70">
          <PhoneCall size={16} className="text-gold-light shrink-0 mt-0.5" />
          Un conseiller Atlas Drive va appeler le numéro que vous avez indiqué pour vérifier votre
          identité avant de bloquer le véhicule à votre nom.
        </div>
      )}

      {vehicle && (
        <div className="mt-6 rounded-2xl border border-paper/10 bg-ink-soft overflow-hidden">
          <div className="h-36 relative">
            <VehiclePhoto src={vehicle.photo} alt={vehicle.name} position={vehicle.photoPosition} gradient={vehicle.gradient} sizes="600px" />
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between">
              <p className="font-display text-xl text-paper">{booking.vehicleName}</p>
              <span className={`rounded-full text-xs px-3 py-1 ${status.badgeCls}`}>{status.badge}</span>
            </div>
            <p className="mt-1 text-sm text-paper/50">
              {formatDateFrLong(booking.startDate)} → {formatDateFrLong(booking.endDate)} · {booking.days} jour
              {booking.days > 1 ? "s" : ""}
            </p>
            <div className="mt-4 pt-4 border-t border-paper/10 flex items-center justify-between">
              <span className="text-paper/60 text-sm">Total payé sur place</span>
              <span className="font-display text-2xl text-gold-light">{formatDH(booking.total)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-gold/20 bg-gold/5 p-5 flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 text-gold-light shrink-0">
          <Gem size={20} />
        </div>
        <div>
          <p className="text-paper text-sm">
            Vous gagnez <span className="text-gold-light font-semibold">{booking.pointsEarned} points Atlas</span>
          </p>
          <p className="text-xs text-paper/45">Total cumulé : {loyaltyPoints} points ({Math.floor(loyaltyPoints / 1000) * 50} DH de réduction disponibles)</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/espace-client">
          <User size={16} /> Voir mon espace client
        </Button>
        <Button variant="outline" href="/vehicules">
          Réserver un autre véhicule
        </Button>
        <Button variant="ghost" href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer">
          <MessageCircle size={16} /> Contacter sur WhatsApp
        </Button>
      </div>
    </div>
  );
}
