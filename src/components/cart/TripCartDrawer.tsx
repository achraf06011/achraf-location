"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import { useTripSummary } from "@/lib/useTripSummary";
import { formatDH } from "@/lib/pricing";
import Button from "@/components/ui/Button";
import { useTripStore } from "@/store/tripStore";
import VehicleArt from "@/components/vehicles/VehicleArt";
import Link from "next/link";

export default function TripCartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const summary = useTripSummary();
  const selectVehicle = useTripStore((s) => s.selectVehicle);
  const resetConfig = useTripStore((s) => s.resetConfig);

  const { vehicle, days, rentalAfterDiscount, extrasTotal, packTotal, deliveryFee, total, pack, standaloneExtras } =
    summary;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-ink/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed right-0 top-0 z-[80] h-full w-full max-w-md bg-ink-soft border-l border-paper/10 flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-paper/10">
              <h3 className="font-display text-2xl text-paper">Mon voyage</h3>
              <button onClick={onClose} aria-label="Fermer" className="text-paper/60 hover:text-paper p-1">
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {!vehicle && (
                <div className="text-center py-16">
                  <p className="text-paper/60 mb-6">Votre voyage est encore vide.</p>
                  <Button href="/vehicules" onClick={onClose}>
                    Choisir une voiture
                  </Button>
                </div>
              )}

              {vehicle && (
                <div className="rounded-2xl border border-paper/10 overflow-hidden">
                  <div className="h-32 relative">
                    <VehicleArt gradient={vehicle.gradient} silhouette={vehicle.silhouette} id={`cart-${vehicle.id}`} />
                    <button
                      onClick={() => {
                        selectVehicle(null);
                        resetConfig();
                      }}
                      className="absolute top-2 right-2 rounded-full bg-ink/70 p-1.5 text-paper/70 hover:text-clay-light"
                      aria-label="Retirer la voiture"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="font-display text-lg text-paper">{vehicle.name}</p>
                    <p className="text-sm text-paper/50">
                      {days} jour{days > 1 ? "s" : ""} · {formatDH(rentalAfterDiscount)}
                    </p>
                  </div>
                </div>
              )}

              {vehicle && (
                <div className="space-y-3 text-sm">
                  <Line label={`Location (${days} j)`} value={formatDH(rentalAfterDiscount)} />
                  {pack && (
                    <Line label={pack.name} value={formatDH(packTotal)} muted />
                  )}
                  {standaloneExtras.map(({ extra, total: t }) => (
                    <Line key={extra.id} label={extra.name} value={formatDH(t)} muted />
                  ))}
                  {deliveryFee > 0 && <Line label="Livraison" value={formatDH(deliveryFee)} muted />}
                  {extrasTotal === 0 && !pack && deliveryFee === 0 && (
                    <p className="text-paper/40 text-xs">Aucune option ajoutée pour le moment.</p>
                  )}
                </div>
              )}
            </div>

            {vehicle && (
              <div className="p-5 border-t border-paper/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-paper/60">Total</span>
                  <span className="font-display text-2xl text-gold-light">{formatDH(total)}</span>
                </div>
                <Button href="/reservation" size="lg" className="w-full" onClick={onClose}>
                  Voir le récapitulatif
                </Button>
                <Link
                  href={`/vehicules/${vehicle.slug}`}
                  onClick={onClose}
                  className="block text-center text-sm text-paper/50 hover:text-gold-light"
                >
                  Modifier ma configuration
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Line({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? "text-paper/50" : "text-paper/80"}>{label}</span>
      <span className={muted ? "text-paper/60" : "text-paper"}>{value}</span>
    </div>
  );
}
