"use client";

import { Gem } from "lucide-react";
import { useTripStore } from "@/store/tripStore";
import Badge from "@/components/ui/Badge";

export default function LoyaltyClub() {
  const points = useTripStore((s) => s.loyaltyPoints);
  const progress = (points % 1000) / 10;
  const availableRewards = Math.floor(points / 1000) * 50;

  return (
    <div className="rounded-2xl border border-gold/20 bg-gradient-to-br from-ink-soft to-ink p-6">
      <div className="flex items-center justify-between mb-4">
        <Badge>Atlas Club</Badge>
        <span className="flex items-center gap-1.5 text-gold-light text-sm">
          <Gem size={15} /> {points} points
        </span>
      </div>
      <p className="text-sm text-paper/55 mb-3">
        Encore {1000 - (points % 1000)} points avant votre prochaine récompense de 50 DH.
      </p>
      <div className="h-2 w-full rounded-full bg-ink overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold-dim to-gold-light transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 text-xs text-paper/40">
        1000 points = 50 DH de réduction · Vous avez {formatRewards(availableRewards)} disponibles
      </p>
    </div>
  );
}

function formatRewards(amount: number) {
  return amount > 0 ? `${amount} DH` : "0 DH";
}
