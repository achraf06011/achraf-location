import type { Metadata } from "next";
import { Suspense } from "react";
import ConfirmationClient from "./ConfirmationClient";

export const metadata: Metadata = {
  title: "Réservation confirmée",
  description: "Votre réservation Atlas Drive est confirmée.",
};

export default function ConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmationClient />
    </Suspense>
  );
}
