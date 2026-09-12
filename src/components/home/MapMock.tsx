"use client";

import { useState } from "react";
import { Plane, Building2, Home, PackageSearch, MapPin } from "lucide-react";
import { mapLocations } from "@/data/testimonials";
import type { LocationType } from "@/lib/types";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

const ICONS: Record<LocationType, React.ElementType> = {
  airport: Plane,
  agency: Building2,
  hotel: Home,
  delivery: PackageSearch,
};

export default function MapMock() {
  const [active, setActive] = useState(mapLocations[0].id);
  const activeLocation = mapLocations.find((l) => l.id === active);

  return (
    <section className="container-edge py-16 md:py-24">
      <SectionHeading
        eyebrow="Autour de vous"
        title="Voyez ce qui est disponible près de vous."
        subtitle="Aéroport, agence, hôtels partenaires : visualisez les points de prise en charge autour de Marrakech."
      />

      <div className="mt-10 relative overflow-hidden rounded-3xl border border-paper/10 bg-ink-soft h-[380px] md:h-[440px]">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(#f7f2e9 1px, transparent 1px), linear-gradient(90deg, #f7f2e9 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#17140f_85%)]" />

        {mapLocations.map((loc) => {
          const Icon = ICONS[loc.type];
          const isActive = active === loc.id;
          return (
            <button
              key={loc.id}
              onClick={() => setActive(loc.id)}
              style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
              aria-label={loc.name}
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all",
                  isActive
                    ? "border-gold bg-gold text-ink scale-110"
                    : "border-gold/40 bg-ink text-gold-light group-hover:scale-105"
                )}
              >
                <Icon size={16} />
              </span>
              {isActive && (
                <span className="absolute -inset-2 rounded-full border border-gold/40 animate-ping" />
              )}
            </button>
          );
        })}
      </div>

      {activeLocation && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-paper/10 bg-ink-soft px-5 py-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-gold-light shrink-0">
            <MapPin size={16} />
          </span>
          <div>
            <p className="text-sm text-paper">{activeLocation.name}</p>
            <p className="text-xs text-paper/40 capitalize">{typeLabel(activeLocation.type)}</p>
          </div>
        </div>
      )}
      <p className="mt-3 text-[11px] text-paper/30">
        Carte illustrative — positions approximatives à des fins de démonstration.
      </p>
    </section>
  );
}

function typeLabel(type: LocationType) {
  switch (type) {
    case "airport":
      return "Aéroport";
    case "agency":
      return "Agence Atlas Drive";
    case "hotel":
      return "Hôtel / Riad partenaire";
    case "delivery":
      return "Point de livraison";
  }
}
