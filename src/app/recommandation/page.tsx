import type { Metadata } from "next";
import RecommendationQuiz from "@/components/recommendation/RecommendationQuiz";

export const metadata: Metadata = {
  title: "Quelle voiture vous convient ?",
  description: "Répondez à 3 questions et découvrez le véhicule Atlas Drive le plus adapté à votre voyage.",
};

export default function RecommandationPage() {
  return (
    <div className="container-edge py-12 md:py-20">
      <RecommendationQuiz />
    </div>
  );
}
