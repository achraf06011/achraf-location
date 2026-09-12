"use client";

import Link from "next/link";
import { MessageCircle, Plus, Settings, Eye, Clock } from "lucide-react";
import { useTripStore } from "@/store/tripStore";
import { getVehicleBySlug } from "@/data/vehicles";
import { formatDH } from "@/lib/pricing";
import { formatDateFrLong } from "@/lib/format";
import VehiclePhoto from "@/components/vehicles/VehiclePhoto";
import LoyaltyClub from "@/components/client/LoyaltyClub";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

export default function EspaceClientClient() {
  const bookings = useTripStore((s) => s.bookings);

  return (
    <div className="container-edge py-10 md:py-14">
      <h1 className="font-display text-3xl md:text-4xl text-paper">Bonjour Yassine</h1>
      <p className="text-paper/50 mt-1">Voici un aperçu de votre espace Atlas Drive.</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {bookings.length === 0 ? (
            <div className="rounded-2xl border border-paper/10 bg-ink-soft p-14 text-center">
              <p className="text-paper/55 mb-6">Vous n&rsquo;avez pas encore de réservation.</p>
              <Button href="/vehicules">Réserver une voiture</Button>
            </div>
          ) : (
            bookings.map((booking, i) => {
              const vehicle = getVehicleBySlug(booking.vehicleSlug);
              const daysUntil = daysFromNow(booking.startDate);
              return (
                <Reveal key={booking.id} delay={i * 0.05}>
                  <div className="rounded-2xl border border-paper/10 bg-ink-soft overflow-hidden">
                    <div className="grid sm:grid-cols-[140px_1fr]">
                      <div className="h-32 sm:h-full relative">
                        {vehicle && (
                          <VehiclePhoto
                            src={vehicle.photo}
                            alt={vehicle.name}
                            position={vehicle.photoPosition}
                            gradient={vehicle.gradient}
                            sizes="200px"
                          />
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="font-display text-lg text-paper">{booking.vehicleName}</p>
                            <p className="text-xs text-paper/45">
                              {formatDateFrLong(booking.startDate)} → {formatDateFrLong(booking.endDate)}
                            </p>
                          </div>
                          <span className="rounded-full bg-emerald-500/15 text-emerald-300 text-xs px-3 py-1 shrink-0">
                            Confirmée
                          </span>
                        </div>

                        {daysUntil !== null && daysUntil >= 0 && (
                          <p className="mt-3 flex items-center gap-1.5 text-xs text-gold-light">
                            <Clock size={13} />
                            {daysUntil === 0
                              ? "Votre voyage commence aujourd'hui !"
                              : `Votre prochain voyage commence dans ${daysUntil} jour${daysUntil > 1 ? "s" : ""}.`}
                          </p>
                        )}

                        <p className="mt-2 text-sm text-paper/60">Total : {formatDH(booking.total)}</p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {vehicle && (
                            <>
                              <ActionLink href={`/vehicules/${vehicle.slug}`} icon={Settings} label="Modifier" />
                              <ActionLink href={`/vehicules/${vehicle.slug}`} icon={Plus} label="Ajouter une option" />
                            </>
                          )}
                          <a
                            href={`https://wa.me/212600000000?text=${encodeURIComponent(
                              `Bonjour, je vous contacte au sujet de ma réservation ${booking.id} (${booking.vehicleName}).`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 rounded-full border border-paper/15 px-3.5 py-1.5 text-xs text-paper/70 hover:border-gold hover:text-gold-light"
                          >
                            <MessageCircle size={13} /> WhatsApp
                          </a>
                          <ActionLink href={`/confirmation?id=${booking.id}`} icon={Eye} label="Voir les détails" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })
          )}
        </div>

        <div className="space-y-6">
          <LoyaltyClub />
          <div className="rounded-2xl border border-paper/10 bg-ink-soft p-5">
            <p className="text-sm font-semibold text-paper mb-3">Besoin d&rsquo;aide ?</p>
            <p className="text-xs text-paper/50 mb-4">
              Notre équipe est disponible 7j/7 pour toute question sur votre réservation.
            </p>
            <Link
              href="https://wa.me/212600000000"
              target="_blank"
              className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-2.5 text-sm font-semibold text-ink"
            >
              <MessageCircle size={16} /> Discuter sur WhatsApp
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionLink({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 rounded-full border border-paper/15 px-3.5 py-1.5 text-xs text-paper/70 hover:border-gold hover:text-gold-light"
    >
      <Icon size={13} /> {label}
    </Link>
  );
}

function daysFromNow(iso: string): number | null {
  if (!iso) return null;
  const target = new Date(iso + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}
