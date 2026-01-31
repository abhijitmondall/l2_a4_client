import { create } from "zustand";
import { User, CartItem, Medicine } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialize: () => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

interface CartState {
  items: CartItem[];
  addToCart: (medicine: Medicine, quantity?: number) => void;
  removeFromCart: (medicineId: string) => void;
  updateQuantity: (medicineId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // Start in loading state

  login: (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  updateUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },

  initialize: () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true, isLoading: false });
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },
}));

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addToCart: (medicine, quantity = 1) => {
    const items = get().items;
    const existingItem = items.find((item) => item.medicine.id === medicine.id);

    if (existingItem) {
      set({
        items: items.map((item) =>
          item.medicine.id === medicine.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        ),
      });
    } else {
      set({ items: [...items, { medicine, quantity }] });
    }
  },
  removeFromCart: (medicineId) => {
    set({
      items: get().items.filter((item) => item.medicine.id !== medicineId),
    });
  },
  updateQuantity: (medicineId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(medicineId);
      return;
    }
    set({
      items: get().items.map((item) =>
        item.medicine.id === medicineId ? { ...item, quantity } : item,
      ),
    });
  },
  clearCart: () => set({ items: [] }),
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
  getTotalPrice: () => {
    return get().items.reduce(
      (total, item) => total + item.medicine.price * item.quantity,
      0,
    );
  },
}));

// Initialize auth state from localStorage
if (typeof window !== "undefined") {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      useAuthStore.setState({ user, token, isAuthenticated: true });
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }
}
