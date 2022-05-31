import create from 'zustand';

import {
  CheckoutData,
  LootMetadata,
} from '@/lib/types';

export type CheckoutState = {
  selectedBag: LootMetadata | null;
  checkoutData: CheckoutData | null;
  resetCart: () => void;
  setSelectedBag: (loot: LootMetadata) => void;
  setCheckoutData: (data: CheckoutData) => void;
};

export const useCheckoutStore = create<CheckoutState>((set) => ({
  selectedBag: null,
  checkoutData: null,
  resetCart: () =>
    set({
      selectedBag: null,
      checkoutData: null,
    }),
  setSelectedBag: (selectedBag) => set({ selectedBag }),
  setCheckoutData: (checkoutData) => set({ checkoutData }),
}));
