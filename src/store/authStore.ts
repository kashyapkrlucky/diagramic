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
  onGuestLogin: () => Promise<string | null>;
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
      } = await axios.post(
        import.meta.env.VITE_AUTH_API_URL + "/v1/public/session",
        {
          code,
        },
      );
      const { user, token } = data;
      set({ user, token });
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      return token;
    } catch {
      return null;
    }
  },

  onGuestLogin: async () => {
    try {
      const apiPath = import.meta.env.VITE_AUTH_API_URL + "/v1/public/guest";
      const baseUrl =
        import.meta.env.VITE_APP_BASE_URL || window.location.origin;
      const {
        data: { data },
      } = await axios.post(apiPath, { clientUrl: baseUrl });
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
