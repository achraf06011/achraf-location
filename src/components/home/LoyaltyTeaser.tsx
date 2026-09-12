import { Gem, Gift, TrendingUp } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import Badge from "@/components/ui/Badge";

export default function LoyaltyTeaser() {
  return (
    <section className="container-edge py-16 md:py-24">
      <Reveal>
        <div className="rounded-[32px] border border-gold/20 bg-gradient-to-br from-ink-soft to-ink p-8 md:p-12 grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <Badge>Atlas Club</Badge>
            <h2 className="mt-4 font-display text-3xl md:text-4xl text-paper">
              Chaque voyage vous rapproche du prochain.
            </h2>
            <p className="mt-3 text-paper/60 max-w-xl">
              À chaque réservation, gagnez des points Atlas convertibles en réductions.
              Simple, automatique, sans carte à présenter.
            </p>
            <div className="mt-6 flex flex-wrap gap-6">
              <MiniStat icon={Gem} label="10 DH dépensés" value="= 1 point" />
              <MiniStat icon={TrendingUp} label="1000 points" value="= 50 DH offerts" />
              <MiniStat icon={Gift} label="Avantages" value="dès la 1ère réservation" />
            </div>
          </div>
          <div className="flex h-32 w-32 md:h-40 md:w-40 items-center justify-center rounded-full border border-gold/30 bg-gold/5 shrink-0 mx-auto">
            <div className="text-center">
              <p className="font-display text-3xl text-gold-light">+10%</p>
              <p className="text-[11px] text-paper/50 mt-1">de points sur chaque total</p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function MiniStat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10 text-gold-light shrink-0">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-sm text-paper">{value}</p>
        <p className="text-xs text-paper/45">{label}</p>
      </div>
    </div>
  );
}
