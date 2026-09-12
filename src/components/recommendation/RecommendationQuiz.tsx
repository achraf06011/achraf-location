"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, RotateCcw, Sparkles } from "lucide-react";
import { vehicles } from "@/data/vehicles";
import type { Category } from "@/lib/types";
import VehicleCard from "@/components/vehicles/VehicleCard";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type PeopleAnswer = "1-2" | "3-4" | "5+";
type TripAnswer = "Ville" | "Famille" | "Luxe" | "Affaires" | "Mariage" | "Road trip";
type BudgetAnswer = "Économique" | "Confort" | "Premium" | "Luxe";

const QUESTIONS = [
  {
    key: "people",
    title: "Combien de personnes ?",
    options: ["1-2", "3-4", "5+"] as PeopleAnswer[],
  },
  {
    key: "trip",
    title: "Quel type de voyage ?",
    options: ["Ville", "Famille", "Luxe", "Affaires", "Mariage", "Road trip"] as TripAnswer[],
  },
  {
    key: "budget",
    title: "Votre budget ?",
    options: ["Économique", "Confort", "Premium", "Luxe"] as BudgetAnswer[],
  },
] as const;

const TRIP_CATEGORY_MAP: Record<TripAnswer, Category[]> = {
  Ville: ["Économique", "Compacte"],
  Famille: ["SUV", "Compacte"],
  Luxe: ["Luxe"],
  Affaires: ["Premium"],
  Mariage: ["Luxe", "Premium"],
  "Road trip": ["SUV"],
};

const BUDGET_CATEGORY_MAP: Record<BudgetAnswer, Category[]> = {
  Économique: ["Économique"],
  Confort: ["Compacte", "SUV"],
  Premium: ["Premium"],
  Luxe: ["Luxe"],
};

const MIN_SEATS: Record<PeopleAnswer, number> = { "1-2": 2, "3-4": 4, "5+": 5 };

export default function RecommendationQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{
    people?: PeopleAnswer;
    trip?: TripAnswer;
    budget?: BudgetAnswer;
  }>({});

  const done = step >= QUESTIONS.length;

  function answer(key: string, value: string) {
    setAnswers((a) => ({ ...a, [key]: value }));
    setTimeout(() => setStep((s) => s + 1), 250);
  }

  function reset() {
    setAnswers({});
    setStep(0);
  }

  const results = done ? computeResults(answers) : [];

  return (
    <div className="mx-auto max-w-3xl">
      {!done && (
        <div className="mb-8 flex items-center gap-2">
          {QUESTIONS.map((_, i) => (
            <div key={i} className={cn("h-1 flex-1 rounded-full", i <= step ? "bg-gold" : "bg-paper/10")} />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-xs uppercase tracking-wider text-gold-light mb-3">
              Question {step + 1} / {QUESTIONS.length}
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-paper mb-8">{QUESTIONS[step].title}</h2>

            <div className="grid gap-3 sm:grid-cols-2">
              {QUESTIONS[step].options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => answer(QUESTIONS[step].key, opt)}
                  className="rounded-2xl border border-paper/10 bg-ink-soft px-6 py-5 text-left text-lg font-display text-paper hover:border-gold hover:bg-gold/5 transition-colors"
                >
                  {opt}
                </button>
              ))}
            </div>

            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="mt-6 flex items-center gap-1.5 text-sm text-paper/50 hover:text-paper"
              >
                <ArrowLeft size={15} /> Question précédente
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-10">
              <Sparkles className="mx-auto text-gold-light mb-3" size={26} />
              <p className="text-xs uppercase tracking-wider text-gold-light mb-2">Notre recommandation</p>
              <h2 className="font-display text-3xl md:text-4xl text-paper">
                {results[0]
                  ? `Nous pensons que la ${results[0].name} correspond parfaitement à votre voyage.`
                  : "Voici quelques suggestions."}
              </h2>
              {results[0] && (
                <ul className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-paper/60">
                  {results[0].whyChoose.slice(0, 3).map((r) => (
                    <li key={r} className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-gold-light" /> {r}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((v, i) => (
                <VehicleCard key={v.id} vehicle={v} index={i} />
              ))}
            </div>

            <div className="mt-10 text-center">
              <Button variant="outline" onClick={reset}>
                <RotateCcw size={15} /> Refaire le questionnaire
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function computeResults(answers: { people?: PeopleAnswer; trip?: TripAnswer; budget?: BudgetAnswer }) {
  const tripCats = answers.trip ? TRIP_CATEGORY_MAP[answers.trip] : [];
  const budgetCats = answers.budget ? BUDGET_CATEGORY_MAP[answers.budget] : [];
  const minSeats = answers.people ? MIN_SEATS[answers.people] : 0;

  const scored = vehicles.map((v) => {
    let score = 0;
    if (tripCats.includes(v.category)) score += 3;
    if (budgetCats.includes(v.category)) score += 3;
    if (v.seats >= minSeats) score += 1;
    score += v.rating / 10;
    return { vehicle: v, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.vehicle);
}
