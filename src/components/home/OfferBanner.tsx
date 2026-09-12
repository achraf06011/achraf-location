import { Sparkles } from "lucide-react";
import { vehicles } from "@/data/vehicles";
import VehicleArt from "@/components/vehicles/VehicleArt";
import Countdown from "@/components/ui/Countdown";
import Button from "@/components/ui/Button";
import { formatDH } from "@/lib/pricing";
import Reveal from "@/components/ui/Reveal";

export default function OfferBanner() {
  const vehicle = vehicles.find((v) => v.discountPercent);
  if (!vehicle) return null;

  const originalPrice = vehicle.priceTiers[1].pricePerDay;
  const discountedPrice = Math.round(originalPrice * (1 - vehicle.discountPercent! / 100));

  return (
    <section className="container-edge py-16 md:py-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-[32px] border border-gold/20 bg-gradient-to-br from-ink-soft to-ink grain">
          <div className="grid md:grid-cols-2">
            <div className="relative h-56 md:h-auto">
              <VehicleArt gradient={vehicle.gradient} silhouette={vehicle.silhouette} id="offer" />
            </div>
            <div className="p-7 md:p-12 flex flex-col justify-center">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-clay/20 border border-clay/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-clay-light mb-5">
                <Sparkles size={13} /> Offre du moment
              </span>
              <h3 className="font-display text-3xl md:text-4xl text-paper">
                {vehicle.name} <span className="text-gradient-gold">-{vehicle.discountPercent}%</span>
              </h3>
              <p className="mt-3 text-paper/60">
                Du 15 au 20 septembre — profitez d&rsquo;un tarif exceptionnel sur notre berline la
                plus réservée.
              </p>

              <div className="mt-6 flex items-center gap-3">
                <span className="text-paper/35 line-through text-lg">{formatDH(originalPrice)}</span>
                <span className="font-display text-3xl text-gold-light">{formatDH(discountedPrice)}</span>
                <span className="text-paper/40 text-sm">/jour</span>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="rounded-xl border border-paper/10 bg-ink px-4 py-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-paper/40 mb-1">
                    Offre valable encore
                  </p>
                  <Countdown seconds={8 * 3600 + 42 * 60 + 17} className="text-gold-light text-lg" />
                </div>
                <Button href={`/vehicules/${vehicle.slug}`}>Réserver cette offre</Button>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
