export type Category = "Économique" | "Compacte" | "SUV" | "Premium" | "Luxe";
export type Transmission = "Automatique" | "Manuelle";
export type Fuel = "Essence" | "Diesel" | "Hybride" | "Électrique";
export type Silhouette = "hatch" | "sedan" | "suv" | "luxury";

export interface PriceTier {
  minDays: number;
  maxDays: number | null;
  pricePerDay: number;
  label: string;
}

export interface Vehicle {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: Category;
  tagline: string;
  priceTiers: PriceTier[];
  seats: number;
  bags: number;
  transmission: Transmission;
  fuel: Fuel;
  year: number;
  features: string[];
  whyChoose: string[];
  gradient: [string, string];
  silhouette: Silhouette;
  photo: string;
  photoPosition?: string;
  photoCredit: string;
  badge?: "Offre du moment" | "Populaire" | "Nouveau" | "Dernières unités";
  discountPercent?: number;
  unavailableRanges: [string, string][];
  stockLeft?: number;
  rating: number;
  reviewsCount: number;
}

export type ExtraPricingType = "day" | "flat";

export interface Extra {
  id: string;
  name: string;
  icon: string;
  price: number;
  pricingType: ExtraPricingType;
  description: string;
}

export interface Pack {
  id: string;
  name: string;
  subtitle: string;
  includes: string[];
  pricingType: ExtraPricingType;
  price: number;
  compareAtPrice: number;
  badge?: string;
}

export interface Experience {
  id: string;
  name: string;
  icon: string;
  subtitle: string;
  description: string;
  presetCategory: Category;
  presetExtraIds: string[];
  presetPackId?: string;
  gradient: [string, string];
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  tripType: string;
  rating: number;
  text: string;
}

export type LocationType = "airport" | "hotel" | "agency" | "delivery";

export interface MapLocation {
  id: string;
  name: string;
  type: LocationType;
  x: number;
  y: number;
}

export interface CarPrepChoice {
  occasion: "mariage" | "anniversaire" | "romantique" | "surprise";
  options: string[];
}
