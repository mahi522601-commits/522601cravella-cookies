import { create } from "zustand";
import { defaultSiteSettings } from "@/services/firestore";

export const useUiStore = create((set) => ({
  mobileNavOpen: false,
  cartPulseKey: 0,
  siteSettings: defaultSiteSettings,
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
  bumpCartPulse: () => set((state) => ({ cartPulseKey: state.cartPulseKey + 1 })),
  setSiteSettings: (siteSettings) => set({ siteSettings }),
}));
