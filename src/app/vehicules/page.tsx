import type { Metadata } from "next";
import { Suspense } from "react";
import VehiclesPageClient from "./VehiclesPageClient";

export const metadata: Metadata = {
  title: "Nos véhicules",
  description: "Découvrez la flotte Atlas Drive à Marrakech : économique, SUV, premium et luxe.",
};

export default function VehiculesPage() {
  return (
    <Suspense fallback={null}>
      <VehiclesPageClient />
    </Suspense>
  );
}
