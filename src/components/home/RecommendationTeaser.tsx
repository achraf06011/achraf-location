import { Sparkles, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

export default function RecommendationTeaser() {
  return (
    <section className="container-edge py-16 md:py-24">
      <Reveal>
        <div className="grain relative overflow-hidden rounded-[32px] border border-paper/10 bg-gradient-to-br from-night to-ink p-8 md:p-16 text-center">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_rgba(201,161,90,0.14)_0%,_transparent_70%)]" />
          <Sparkles className="mx-auto text-gold-light" size={28} />
          <h2 className="mt-5 font-display text-3xl md:text-5xl text-paper max-w-2xl mx-auto">
            Quelle voiture vous convient&nbsp;?
          </h2>
          <p className="mt-4 text-paper/60 max-w-lg mx-auto">
            Répondez à 3 questions rapides. Notre moteur de recommandation vous propose
            instantanément les véhicules les plus adaptés à votre voyage.
          </p>
          <div className="mt-8">
            <Button href="/recommandation" size="lg">
              Lancer le questionnaire
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
