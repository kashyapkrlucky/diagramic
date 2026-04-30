import { create } from "zustand";
import type { User } from "../types";
import axios from "axios";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
  getUserData: (code: string) => Promise<string | null>;
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
      } = await axios.post(import.meta.env.VITE_AUTH_API_URL + "/v1/session", {
        code,
      });
      const { user, token } = data;
      set({ user, token });
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      return token;
    } catch {
      return null;
    }
  },
}));
