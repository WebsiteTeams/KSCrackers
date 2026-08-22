import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IProduct } from './mockData';

export interface CartItem {
  product: IProduct;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (product: IProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  getOriginalTotal: () => number;
  getDiscountTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.product._id === product._id
          );

          if (existingItemIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += quantity;
            return { items: updatedItems };
          }

          return { items: [...state.items, { product, quantity }] };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product._id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.product._id !== productId),
            };
          }
          return {
            items: state.items.map((item) =>
              item.product._id === productId ? { ...item, quantity } : item
            ),
          };
        });
      },

      clearCart: () => set({ items: [] }),

      getCartTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.sellingPrice * item.quantity,
          0
        );
      },

      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      getOriginalTotal: () => {
        return get().items.reduce(
          (total, item) => total + (item.product.mrp || item.product.sellingPrice) * item.quantity,
          0
        );
      },

      getDiscountTotal: () => {
        const original = get().getOriginalTotal();
        const selling = get().getCartTotal();
        return Math.max(0, original - selling);
      },
    }),
    {
      name: 'ks-crackers-cart', // Name of storage item
    }
  )
);
