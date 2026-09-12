"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, ChevronLeft, Send, Car, Coins, CalendarCheck, Plane, Heart } from "lucide-react";
import { useTripStore } from "@/store/tripStore";
import { useTripSummary } from "@/lib/useTripSummary";
import { formatDateFr, LOCATION_LABELS } from "@/lib/format";
import { formatDH } from "@/lib/pricing";
import { getExtraById } from "@/data/extras";

const WHATSAPP_NUMBER = "212600000000";

type Topic = "choisir" | "prix" | "disponibilite" | "aeroport" | "mariage";

const TOPICS: { id: Topic; label: string; icon: React.ElementType }[] = [
  { id: "choisir", label: "Choisir une voiture", icon: Car },
  { id: "prix", label: "Comprendre le prix", icon: Coins },
  { id: "disponibilite", label: "Vérifier une disponibilité", icon: CalendarCheck },
  { id: "aeroport", label: "Livraison à l'aéroport", icon: Plane },
  { id: "mariage", label: "Préparer une voiture pour mariage", icon: Heart },
];

export default function WhatsAppAssistant() {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState<Topic | null>(null);
  const summary = useTripSummary();
  const state = useTripStore();

  const message = useMemo(() => buildMessage(topic, summary, state), [topic, summary, state]);
  const [edited, setEdited] = useState<string | null>(null);

  const finalMessage = edited ?? message;

  function selectTopic(t: Topic) {
    setTopic(t);
    setEdited(null);
  }

  function close() {
    setOpen(false);
    setTimeout(() => {
      setTopic(null);
      setEdited(null);
    }, 300);
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        aria-label="Besoin d'aide sur WhatsApp"
        className="fixed bottom-24 right-5 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-ink shadow-[0_10px_30px_-8px_rgba(37,211,102,0.7)] md:bottom-5"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        animate={{ y: [0, -4, 0] }}
        transition={{ y: { duration: 2.4, repeat: Infinity, ease: "easeInOut" } }}
      >
        <MessageCircle size={26} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 z-[95] bg-ink/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="fixed bottom-24 right-5 z-[100] w-[calc(100vw-2.5rem)] max-w-sm rounded-3xl border border-paper/10 bg-ink-soft shadow-2xl overflow-hidden md:bottom-5"
            >
              <div className="flex items-center gap-3 bg-[#128C7E] px-5 py-4">
                {topic && (
                  <button onClick={() => setTopic(null)} className="text-paper/90" aria-label="Retour">
                    <ChevronLeft size={20} />
                  </button>
                )}
                <div className="flex-1">
                  <p className="text-paper font-semibold text-sm">Assistant Atlas Drive</p>
                  <p className="text-paper/70 text-xs">Généralement en ligne</p>
                </div>
                <button onClick={close} className="text-paper/80" aria-label="Fermer">
                  <X size={20} />
                </button>
              </div>

              <div className="p-5">
                {!topic && (
                  <div>
                    <p className="text-paper/70 text-sm mb-4">Besoin d&rsquo;aide ? Choisissez un sujet :</p>
                    <div className="space-y-2">
                      {TOPICS.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => selectTopic(t.id)}
                          className="w-full flex items-center gap-3 rounded-xl border border-paper/10 px-4 py-3 text-left text-sm text-paper hover:border-gold hover:bg-gold/5 transition-colors"
                        >
                          <t.icon size={18} className="text-gold-light shrink-0" />
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {topic && (
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-ink p-4">
                      <p className="text-xs text-paper/40 mb-2">Message généré automatiquement</p>
                      <textarea
                        value={finalMessage}
                        onChange={(e) => setEdited(e.target.value)}
                        rows={5}
                        className="w-full resize-none bg-transparent text-sm text-paper/90 outline-none"
                      />
                    </div>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(finalMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 text-sm font-semibold text-ink hover:brightness-105 transition"
                    >
                      <Send size={16} />
                      Envoyer sur WhatsApp
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function buildMessage(
  topic: Topic | null,
  summary: ReturnType<typeof useTripSummary>,
  state: ReturnType<typeof useTripStore.getState>
): string {
  const { vehicle } = summary;
  const dateRange =
    state.startDate && state.endDate
      ? `du ${formatDateFr(state.startDate)} au ${formatDateFr(state.endDate)}`
      : "";
  const vehicleName = vehicle ? vehicle.name : "une voiture";
  const optionsNames = state.selectedExtraIds
    .map((id) => getExtraById(id)?.name)
    .filter(Boolean);

  switch (topic) {
    case "choisir":
      return `Bonjour, je souhaite louer une voiture à Marrakech ${dateRange}. Pouvez-vous m'aider à choisir le véhicule le plus adapté ?`;
    case "prix":
      return vehicle
        ? `Bonjour, je souhaite comprendre le prix pour la ${vehicleName} ${dateRange}. Le total affiché sur le site est de ${formatDH(summary.total)}, pouvez-vous confirmer ce montant ?`
        : `Bonjour, je souhaite comprendre comment est calculé le prix de location d'une voiture ${dateRange}.`;
    case "disponibilite":
      return `Bonjour, je souhaite vérifier la disponibilité de la ${vehicleName} ${dateRange}.`;
    case "aeroport":
      return `Bonjour, je souhaite une livraison à l'aéroport de Marrakech pour la ${vehicleName} ${dateRange}.`;
    case "mariage":
      return `Bonjour, je souhaite préparer une voiture décorée pour un mariage (${vehicleName || "modèle à définir"}) ${dateRange}.`;
    default: {
      const parts = [
        `Bonjour, je souhaite louer une ${vehicleName}`,
        dateRange,
      ];
      if (state.pickupLocation) parts.push(`avec récupération à ${LOCATION_LABELS[state.pickupLocation]}`);
      if (optionsNames.length) parts.push(`et les options : ${optionsNames.join(", ")}`);
      return parts.filter(Boolean).join(" ") + ".";
    }
  }
}
