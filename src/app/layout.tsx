import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppAssistant from "@/components/whatsapp/WhatsAppAssistant";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const siteUrl = "https://achraf-location.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Atlas Drive — Location de voitures à Marrakech",
    template: "%s | Atlas Drive",
  },
  description:
    "Louez votre voiture à Marrakech et personnalisez votre expérience : livraison aéroport, siège bébé, décoration mariage, chauffeur et bien plus.",
  keywords: [
    "location voiture Marrakech",
    "louer voiture Marrakech",
    "Atlas Drive",
    "location voiture aéroport Marrakech",
  ],
  openGraph: {
    title: "Atlas Drive — Location de voitures à Marrakech",
    description:
      "Marrakech. Votre route. Votre liberté. Réservez et personnalisez votre voiture en quelques clics.",
    url: siteUrl,
    siteName: "Atlas Drive",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${manrope.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-ink text-paper">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppAssistant />
      </body>
    </html>
  );
}
