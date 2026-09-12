import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVehicleBySlug, vehicles } from "@/data/vehicles";
import VehicleDetailClient from "./VehicleDetailClient";

export function generateStaticParams() {
  return vehicles.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = getVehicleBySlug(slug);
  if (!vehicle) return {};
  return {
    title: vehicle.name,
    description: `${vehicle.name} — ${vehicle.tagline} À partir de ${vehicle.priceTiers[0].pricePerDay} DH/jour chez Atlas Drive, Marrakech.`,
  };
}

export default async function VehiculeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = getVehicleBySlug(slug);
  if (!vehicle) notFound();

  return <VehicleDetailClient vehicle={vehicle} />;
}
