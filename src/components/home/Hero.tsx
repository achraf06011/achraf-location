"use client";

import { motion } from "framer-motion";
import BookingSearch from "@/components/booking/BookingSearch";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-14 pb-28 md:pt-20 md:pb-36">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#2a2116_0%,_#0e0d0c_62%)]" />
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute -top-32 right-[-10%] h-[600px] w-[600px] rounded-full bg-gold/20 blur-[140px]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.35, scale: 1 }}
          transition={{ duration: 2, delay: 0.3 }}
          className="absolute bottom-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-clay/25 blur-[140px]"
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#f7f2e9 1px, transparent 1px), linear-gradient(90deg, #f7f2e9 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="container-edge">
        <div className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-light"
          >
            Atlas Drive · Location premium à Marrakech
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 font-display text-5xl sm:text-6xl md:text-7xl leading-[1.02] text-paper"
          >
            Votre Marrakech
            <br />
            <span className="text-gradient-gold italic">commence ici.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-xl text-lg text-paper/65"
          >
            Choisissez votre voiture, personnalisez votre expérience et prenez la route.
            Réservation en ligne, options sur-mesure, livraison où vous voulez.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12"
        >
          <BookingSearch />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-paper/50"
        >
          <Stat value="8" label="véhicules disponibles" />
          <Stat value="24/7" label="assistance WhatsApp" />
          <Stat value="4.8/5" label="satisfaction moyenne*" />
          <span className="text-[11px] text-paper/30">*Données de démonstration</span>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-display text-xl text-gold-light">{value}</span>
      <span>{label}</span>
    </div>
  );
}
