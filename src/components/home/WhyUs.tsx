import { Plane, HeadphonesIcon, CarFront, CalendarClock, MessageCircle, Sparkles } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const ITEMS = [
  { icon: Plane, title: "Livraison à l'aéroport", text: "Votre voiture vous attend dès l'arrivée, sans détour." },
  { icon: HeadphonesIcon, title: "Assistance 7j/7", text: "Une équipe disponible à chaque étape de votre voyage." },
  { icon: CarFront, title: "Véhicules récents", text: "Une flotte entretenue, moins de 2 ans en moyenne." },
  { icon: CalendarClock, title: "Réservation flexible", text: "Modifiez vos dates et options en quelques clics." },
  { icon: MessageCircle, title: "Support WhatsApp", text: "Une réponse humaine, rapide, sans formulaire interminable." },
  { icon: Sparkles, title: "Options personnalisées", text: "Décoration, chauffeur, sièges enfants : à vous de composer." },
];

export default function WhyUs() {
  return (
    <section className="container-edge py-16 md:py-24">
      <SectionHeading
        eyebrow="Pourquoi Atlas Drive"
        title="Pensé pour un voyage sans friction."
        align="center"
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.06}>
            <div className="h-full rounded-2xl border border-paper/10 bg-ink-soft p-6 hover:border-gold/30 transition-colors">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 text-gold-light">
                <item.icon size={20} />
              </div>
              <h3 className="mt-4 font-display text-lg text-paper">{item.title}</h3>
              <p className="mt-1.5 text-sm text-paper/55">{item.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
