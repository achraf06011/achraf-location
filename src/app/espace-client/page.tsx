import type { Metadata } from "next";
import EspaceClientClient from "./EspaceClientClient";

export const metadata: Metadata = {
  title: "Espace client",
  description: "Suivez vos réservations Atlas Drive et vos points de fidélité Atlas Club.",
};

export default function EspaceClientPage() {
  return <EspaceClientClient />;
}
