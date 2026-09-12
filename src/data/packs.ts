import type { Pack } from "@/lib/types";

export const packs: Pack[] = [
  {
    id: "pack-family",
    name: "Pack Family",
    subtitle: "Siège bébé + conducteur supplémentaire + Wi-Fi",
    includes: ["siege-bebe", "conducteur-supplementaire", "wifi-4g"],
    pricingType: "day",
    price: 120,
    compareAtPrice: 140,
    badge: "Le plus choisi en famille",
  },
  {
    id: "pack-wedding",
    name: "Pack Wedding",
    subtitle: "Décoration + livraison + préparation premium",
    includes: ["decoration-mariage", "livraison-aeroport"],
    pricingType: "flat",
    price: 450,
    compareAtPrice: 570,
    badge: "Idéal jour J",
  },
  {
    id: "pack-business",
    name: "Pack Business",
    subtitle: "Wi-Fi + livraison + conducteur supplémentaire",
    includes: ["wifi-4g", "livraison-aeroport", "conducteur-supplementaire"],
    pricingType: "day",
    price: 220,
    compareAtPrice: 270,
    badge: "Pensé pour vos déplacements pro",
  },
];

export function getPackById(id: string): Pack | undefined {
  return packs.find((p) => p.id === id);
}
