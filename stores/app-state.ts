import { create } from "zustand";

interface AppState {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  qrDialogOpen: boolean;
  setQrDialogOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  qrDialogOpen: false,
  setQrDialogOpen: (open) => set({ qrDialogOpen: open }),
}));
