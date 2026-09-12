import type { Metadata } from "next";
import ComparerClient from "./ComparerClient";

export const metadata: Metadata = {
  title: "Comparer les véhicules",
  description: "Comparez jusqu'à 3 véhicules Atlas Drive côte à côte : prix, places, transmission, équipements.",
};

export default function ComparerPage() {
  return <ComparerClient />;
}
