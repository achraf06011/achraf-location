import Button from "@/components/ui/Button";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-edge py-24 md:py-32 text-center">
      <Compass className="mx-auto text-gold-light" size={40} />
      <h1 className="mt-6 font-display text-4xl md:text-5xl text-paper">Route introuvable.</h1>
      <p className="mt-3 text-paper/55 max-w-md mx-auto">
        Cette page n&rsquo;existe pas, mais votre prochaine voiture vous attend.
      </p>
      <div className="mt-8">
        <Button href="/">Retour à l&rsquo;accueil</Button>
      </div>
    </div>
  );
}
