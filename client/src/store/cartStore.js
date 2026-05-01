import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const getLineTotal = (item) => Number(item.price || 0) * Number(item.qty || 0);

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product, qty = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.productId === product.id);
          const nextItems = existing
            ? state.items.map((item) =>
                item.productId === product.id
                  ? { ...item, qty: item.qty + qty }
                  : item,
              )
            : [
                ...state.items,
                {
                  productId: product.id,
                  name: product.name,
                  imageUrl: product.imageUrl,
                  qty,
                  price: product.price,
                  weight: product.weight,
                },
              ];

          return { items: nextItems, isOpen: true };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      updateQty: (productId, nextQty) =>
        set((state) => ({
          items:
            nextQty <= 0
              ? state.items.filter((item) => item.productId !== productId)
              : state.items.map((item) =>
                  item.productId === productId
                    ? { ...item, qty: nextQty }
                    : item,
                ),
        })),
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      getSubtotal: () => get().items.reduce((sum, item) => sum + getLineTotal(item), 0),
      getItemCount: () => get().items.reduce((sum, item) => sum + Number(item.qty || 0), 0),
    }),
    {
      name: "cravella-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
