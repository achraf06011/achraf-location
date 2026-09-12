import type { Extra } from "@/lib/types";

export const extras: Extra[] = [
  {
    id: "siege-bebe",
    name: "Siège bébé",
    icon: "Baby",
    price: 50,
    pricingType: "day",
    description: "Pour voyager sereinement avec votre enfant.",
  },
  {
    id: "decoration-mariage",
    name: "Décoration mariage",
    icon: "Flower2",
    price: 300,
    pricingType: "flat",
    description: "Recevez votre voiture décorée pour votre mariage.",
  },
  {
    id: "livraison-aeroport",
    name: "Livraison à l'aéroport",
    icon: "Plane",
    price: 150,
    pricingType: "flat",
    description: "Votre véhicule vous attend directement à l'aéroport.",
  },
  {
    id: "chauffeur-prive",
    name: "Chauffeur privé",
    icon: "UserCog",
    price: 800,
    pricingType: "day",
    description: "Détendez-vous, un chauffeur professionnel conduit pour vous.",
  },
  {
    id: "wifi-4g",
    name: "Wi-Fi 4G portable",
    icon: "Wifi",
    price: 40,
    pricingType: "day",
    description: "Restez connectés partout au Maroc.",
  },
  {
    id: "conducteur-supplementaire",
    name: "Conducteur supplémentaire",
    icon: "UserPlus",
    price: 50,
    pricingType: "day",
    description: "Partagez la conduite en toute légalité.",
  },
  {
    id: "protection-premium",
    name: "Protection Premium",
    icon: "ShieldCheck",
    price: 100,
    pricingType: "day",
    description: "Assurance tous risques, franchise réduite à 0 DH.",
  },
  {
    id: "gps-navigation",
    name: "GPS & assistance navigation",
    icon: "MapPinned",
    price: 30,
    pricingType: "day",
    description: "Ne vous perdez jamais entre médina et montagnes.",
  },
  {
    id: "coffre-toit",
    name: "Coffre de toit",
    icon: "PackagePlus",
    price: 40,
    pricingType: "day",
    description: "Volume supplémentaire pour vos road trips.",
  },
  {
    id: "prise-en-charge-nuit",
    name: "Prise en charge de nuit",
    icon: "Moon",
    price: 100,
    pricingType: "flat",
    description: "Récupérez votre véhicule après 22h sans supplément surprise.",
  },
];

export function getExtraById(id: string): Extra | undefined {
  return extras.find((e) => e.id === id);
}
