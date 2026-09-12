"use client";

import { create } from "zustand";

interface UIState {
  cartOpen: boolean;
  whatsappOpen: boolean;
  mobileSheet: "none" | "filters" | "extras" | "summary";
  setCartOpen: (v: boolean) => void;
  setWhatsappOpen: (v: boolean) => void;
  setMobileSheet: (v: UIState["mobileSheet"]) => void;
}

export const useUIStore = create<UIState>((set) => ({
  cartOpen: false,
  whatsappOpen: false,
  mobileSheet: "none",
  setCartOpen: (v) => set({ cartOpen: v }),
  setWhatsappOpen: (v) => set({ whatsappOpen: v }),
  setMobileSheet: (v) => set({ mobileSheet: v }),
}));
