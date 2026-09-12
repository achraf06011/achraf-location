export function formatDateFr(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long" }).format(d);
}

export function formatDateFrLong(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(d);
}

export const LOCATION_LABELS: Record<string, string> = {
  aeroport: "Aéroport Marrakech Menara",
  agence: "Agence Atlas Drive",
  hotel: "l'hôtel",
  adresse: "l'adresse indiquée",
};
