import type { Metadata } from "next";
import ReservationClient from "./ReservationClient";

export const metadata: Metadata = {
  title: "Votre voyage",
  description: "Récapitulatif de votre réservation Atlas Drive avant confirmation.",
};

export default function ReservationPage() {
  return <ReservationClient />;
}
