import create from 'zustand';

import {
  ApparelSize,
  CheckoutData,
  GloveSize,
  LootMetadata,
} from '@/lib/types';

export type CheckoutState = {
  selectedBag: LootMetadata | null;
  hoodieSize: ApparelSize | null;
  pantsSize: ApparelSize | null;
  glovesSize: GloveSize | null;
  checkoutData: CheckoutData | null;
  resetCart: () => void;
  setSelectedBag: (loot: LootMetadata) => void;
  setHoodieSize: (size: ApparelSize) => void;
  setPantsSize: (size: ApparelSize) => void;
  setGlovesSize: (size: GloveSize) => void;
  setCheckoutData: (data: CheckoutData) => void;
};

export const useCheckoutStore = create<CheckoutState>((set) => ({
  selectedBag: null,
  hoodieSize: null,
  pantsSize: null,
  glovesSize: null,
  checkoutData: null,
  resetCart: () =>
    set({
      selectedBag: null,
      checkoutData: null,
      hoodieSize: null,
      pantsSize: null,
      glovesSize: null,
    }),
  setSelectedBag: (selectedBag) => set({ selectedBag }),
  setHoodieSize: (hoodieSize) => set({ hoodieSize }),
  setPantsSize: (pantsSize) => set({ pantsSize }),
  setGlovesSize: (glovesSize) => set({ glovesSize }),
  setCheckoutData: (checkoutData) => set({ checkoutData }),
}));
