import { vehicles } from "@/data/vehicles";
import VehicleCard from "@/components/vehicles/VehicleCard";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

const FEATURED_SLUGS = [
  "dacia-logan",
  "peugeot-208",
  "toyota-corolla",
  "peugeot-3008",
  "hyundai-tucson",
  "bmw-serie-3",
  "mercedes-classe-c",
  "porsche-macan",
];

export default function FeaturedVehicles() {
  const featured = FEATURED_SLUGS.map((slug) => vehicles.find((v) => v.slug === slug)).filter(
    (v): v is (typeof vehicles)[number] => Boolean(v)
  );
  return (
    <section className="container-edge py-16 md:py-24">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <SectionHeading
          eyebrow="Notre flotte"
          title="Une voiture pour chaque route."
          subtitle="De l'économique à la voiture de luxe, chaque véhicule est prêt à être personnalisé selon votre voyage."
        />
        <Button href="/vehicules" variant="outline" className="shrink-0">
          Voir toute la flotte
        </Button>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((v, i) => (
          <VehicleCard key={v.id} vehicle={v} index={i} />
        ))}
      </div>
    </section>
  );
}
