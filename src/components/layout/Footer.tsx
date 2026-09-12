import Link from "next/link";
import { NAV_LINKS } from "./NavLinks";

export default function Footer() {
  return (
    <footer className="border-t border-paper/10 bg-ink-soft mt-24">
      <div className="container-edge py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <span className="font-display text-2xl text-paper">
            ATLAS <span className="text-gold-light">DRIVE</span>
          </span>
          <p className="mt-4 text-paper/50 text-sm max-w-sm leading-relaxed">
            Marrakech. Votre route. Votre liberté. Agence premium de location de voitures,
            pensée pour les voyageurs exigeants — touristes, familles, professionnels et
            événements.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-paper/40 mb-4">Navigation</p>
          <ul className="space-y-2.5">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-paper/60 hover:text-gold-light">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-paper/40 mb-4">Contact démo</p>
          <ul className="space-y-2.5 text-sm text-paper/60">
            <li>Guéliz, Marrakech</li>
            <li>contact@atlas-drive.demo</li>
            <li>+212 6 00 00 00 00 (fictif)</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <div className="container-edge py-6 flex flex-col gap-2 text-xs text-paper/35">
          <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
            <p>© 2026 Atlas Drive — Projet de démonstration commerciale. Toutes les données sont fictives.</p>
            <p>Conçu pour montrer le potentiel d&rsquo;une vraie plateforme de réservation.</p>
          </div>
          <p className="text-paper/25">
            Photos de véhicules : Wikimedia Commons, sous licence Creative Commons — crédits détaillés sur
            chaque fiche véhicule.
          </p>
        </div>
      </div>
    </footer>
  );
}
