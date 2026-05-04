import { create } from "zustand";
import type { User } from "../types";
import axios from "../lib/axios";
interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
  getUserData: (code: string) => Promise<{user: User, token: string} | null>;
  onGuestLogin: () => Promise<{user: User, token: string} | null>;
  }

export const useUserStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: false,
  clearAuth: () => set({ user: null, token: null }),
  isAuthenticated: () => !!localStorage.getItem("token"),
  getUserData: async (code: string) => {
    try {
      const {
        data: { data },
      } = await axios.post("/v1/public/session", {
        code,
      });
      const { user, token } = data;
      set({ user, token });
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      return { user, token };
    } catch {
      return null;
    }
  },

  onGuestLogin: async () => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const {
        data: { data },
      } = await axios.post("/v1/public/guest", { clientUrl: baseUrl });
      const { user, token } = data;
      set({ user, token });
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      return { user, token };
    } catch {
      return null;
    }
  },
}));
