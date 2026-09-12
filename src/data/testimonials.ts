import type { MapLocation, Testimonial } from "@/lib/types";

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Yassine B.",
    location: "Marrakech",
    tripType: "Voyage en famille",
    rating: 5,
    text: "La voiture était prête directement à notre hôtel. Très pratique avec les enfants et les valises.",
  },
  {
    id: "t2",
    name: "Claire M.",
    location: "Lyon, France",
    tripType: "Road trip désert",
    rating: 5,
    text: "Le configurateur en ligne nous a permis de tout préparer avant d'arriver : rien à négocier sur place.",
  },
  {
    id: "t3",
    name: "Karim T.",
    location: "Casablanca",
    tripType: "Voyage d'affaires",
    rating: 5,
    text: "Livraison à l'aéroport nickel, Wi-Fi déjà installé. J'ai gagné une heure sur mon planning.",
  },
  {
    id: "t4",
    name: "Sophia & Adam",
    location: "Marrakech",
    tripType: "Mariage",
    rating: 5,
    text: "La décoration de la voiture était magnifique, exactement ce qu'on avait imaginé pour notre jour J.",
  },
  {
    id: "t5",
    name: "Hicham R.",
    location: "Rabat",
    tripType: "Escapade en couple",
    rating: 4,
    text: "Réservation en 5 minutes sur mobile, super fluide. Petit bémol sur l'attente au comptoir agence.",
  },
];

export const mapLocations: MapLocation[] = [
  { id: "l1", name: "Aéroport Marrakech Menara", type: "airport", x: 22, y: 68 },
  { id: "l2", name: "Agence Atlas Drive — Guéliz", type: "agency", x: 48, y: 42 },
  { id: "l3", name: "Hôtel Palmeraie Resort", type: "hotel", x: 78, y: 30 },
  { id: "l4", name: "Riad Médina Charme", type: "hotel", x: 55, y: 58 },
  { id: "l5", name: "Point relais Jardin Majorelle", type: "delivery", x: 40, y: 22 },
];
