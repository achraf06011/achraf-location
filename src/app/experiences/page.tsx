import type { Metadata } from "next";
import ExperiencesSection from "@/components/experiences/ExperiencesSection";

export const metadata: Metadata = {
  title: "Nos expériences",
  description: "Marrakech Weekend, Desert Escape, Wedding Experience... des formules pensées pour chaque occasion.",
};

export default function ExperiencesPage() {
  return (
    <div className="pt-6">
      <ExperiencesSection full />
    </div>
  );
}
