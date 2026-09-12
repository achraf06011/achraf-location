"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { experiences } from "@/data/experiences";
import { useTripStore } from "@/store/tripStore";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

export default function ExperiencesSection({ full = false }: { full?: boolean }) {
  const router = useRouter();
  const setExtras = useTripStore((s) => s.setExtras);
  const selectPack = useTripStore((s) => s.selectPack);

  function pick(exp: (typeof experiences)[number]) {
    setExtras(exp.presetExtraIds);
    selectPack(exp.presetPackId ?? null);
    router.push(`/vehicules?category=${encodeURIComponent(exp.presetCategory)}`);
  }

  return (
    <section className={cn("container-edge", full ? "py-16 md:py-20" : "py-16 md:py-24")}>
      <SectionHeading
        eyebrow="Nos expériences"
        title="Ne réservez pas qu'une voiture."
        subtitle="Chaque expérience préconfigure automatiquement le véhicule et les options adaptées à votre occasion."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {experiences.map((exp, i) => (
          <motion.button
            key={exp.id}
            onClick={() => pick(exp)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-3xl border border-paper/10 p-6 text-left min-h-[200px] flex flex-col justify-end"
            style={{
              background: `linear-gradient(160deg, ${exp.gradient[0]}, ${exp.gradient[1]})`,
            }}
          >
            <div className="absolute inset-0 bg-ink/40 group-hover:bg-ink/25 transition-colors" />
            <div className="relative z-10">
              <span className="text-3xl">{exp.emoji}</span>
              <h3 className="mt-3 font-display text-xl text-paper">{exp.name}</h3>
              <p className="text-paper/70 text-sm mt-1">{exp.subtitle}</p>
              {full && <p className="text-paper/55 text-xs mt-2 leading-relaxed">{exp.description}</p>}
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-gold-light opacity-0 group-hover:opacity-100 transition-opacity">
                Composer cette expérience →
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
