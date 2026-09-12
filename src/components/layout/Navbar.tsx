"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";
import { NAV_LINKS } from "./NavLinks";
import Button from "@/components/ui/Button";
import { useUIStore } from "@/store/uiStore";
import { useTripStore } from "@/store/tripStore";
import TripCartDrawer from "@/components/cart/TripCartDrawer";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const setCartOpen = useUIStore((s) => s.setCartOpen);
  const cartOpen = useUIStore((s) => s.cartOpen);
  const activeVehicleSlug = useTripStore((s) => s.activeVehicleSlug);
  const extrasCount = useTripStore((s) => s.selectedExtraIds.length);

  const itemCount = (activeVehicleSlug ? 1 : 0) + extrasCount;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-paper/10 bg-ink/80 backdrop-blur-xl">
        <div className="container-edge flex h-16 md:h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-display text-xl md:text-2xl tracking-wide text-paper group-hover:text-gold-light transition-colors">
              ATLAS <span className="text-gold-light">DRIVE</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-paper/70 hover:text-gold-light transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Ouvrir mon voyage"
              className="relative flex items-center gap-2 rounded-full border border-paper/15 px-3 py-2.5 md:px-4 text-paper/80 hover:border-gold hover:text-gold-light transition-colors"
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline text-sm">Mon voyage</span>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-clay text-[11px] font-bold text-paper">
                  {itemCount}
                </span>
              )}
            </button>
            <Button href="/vehicules" size="sm" className="hidden md:inline-flex">
              Réserver
            </Button>
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden text-paper p-2"
              aria-label="Ouvrir le menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ink/95 backdrop-blur-xl lg:hidden"
          >
            <div className="container-edge flex h-16 items-center justify-between">
              <span className="font-display text-xl text-paper">ATLAS DRIVE</span>
              <button onClick={() => setOpen(false)} className="text-paper p-2" aria-label="Fermer le menu">
                <X size={24} />
              </button>
            </div>
            <motion.nav
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06 } } }}
              className="container-edge mt-8 flex flex-col gap-2"
            >
              {NAV_LINKS.map((link) => (
                <motion.div
                  key={link.href}
                  variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-4 text-2xl font-display text-paper border-b border-paper/10"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-6">
                <Button href="/vehicules" size="lg" className="w-full" onClick={() => setOpen(false)}>
                  Réserver maintenant
                </Button>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      <TripCartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
