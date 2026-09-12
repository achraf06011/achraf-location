import { Star } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

export default function Testimonials() {
  return (
    <section className="container-edge py-16 md:py-24">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <SectionHeading
          eyebrow="Ils ont voyagé avec nous"
          title="Avis clients."
          subtitle="Contenu de démonstration — témoignages fictifs illustrant l'expérience Atlas Drive."
        />
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.slice(0, 6).map((t, i) => (
          <Reveal key={t.id} delay={i * 0.05}>
            <div className="h-full rounded-2xl border border-paper/10 bg-ink-soft p-6">
              <div className="flex gap-0.5 text-gold-light">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} size={14} className={idx < t.rating ? "fill-gold-light" : "fill-transparent opacity-30"} />
                ))}
              </div>
              <p className="mt-4 text-paper/75 text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-5 flex items-center justify-between text-xs text-paper/45">
                <span className="font-medium text-paper/70">{t.name}</span>
                <span>{t.location} · {t.tripType}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
