import { create } from "zustand";
import type { User } from "../types";
import axios from "../lib/axios";
interface AuthState {
  user: User | null;
  access_token: string | null;
  refresh_token: string | null;
  loading: boolean;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
  getUserData: (code: string) => Promise<{
    user: User;
    access_token: string;
    refresh_token: string;
  } | null>;
  onGuestLogin: () => Promise<{
    user: User;
    access_token: string;
    refresh_token: string;
  } | null>;
  getRefreshedTokens: () => Promise<{
    access_token: string;
    refresh_token: string;
  } | null>;
  logout: () => void;
}

const setTokens = (access_token: string, refresh_token: string) => {
  localStorage.setItem("access_token", access_token);
  localStorage.setItem("refresh_token", refresh_token);
  // document.cookie = `refresh_token=${refresh_token}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30days
};

export const useUserStore = create<AuthState>((set) => ({
  user: null,
  access_token: null,
  refresh_token: null,
  loading: false,
  clearAuth: () => set({ user: null, access_token: null, refresh_token: null }),
  isAuthenticated: () => !!localStorage.getItem("access_token"),
  getUserData: async (code: string) => {
    try {
      const {
        data: { data },
      } = await axios.post("/v1/modules/session", {
        code,
      });
      const { user, access_token, refresh_token } = data;
      localStorage.setItem("user", JSON.stringify(user));
      setTokens(access_token, refresh_token);
      set({ user, access_token, refresh_token });
      return { user, access_token, refresh_token };
    } catch {
      return null;
    }
  },

  onGuestLogin: async () => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const {
        data: { data },
      } = await axios.post("/v1/modules/guest", { clientUrl: baseUrl });

      const { user, access_token, refresh_token } = data;
      localStorage.setItem("user", JSON.stringify(user));
      setTokens(access_token, refresh_token);
      set({ user, access_token, refresh_token });
      return { user, access_token, refresh_token };
    } catch {
      return null;
    }
  },
  getRefreshedTokens: async () => {
    const current_refresh_token = localStorage.getItem("refresh_token");

    const {
      data: { data },
    } = await axios.post("/v1/modules/session/refresh", {
      refresh_token: current_refresh_token,
    });
    const { access_token, refresh_token } = data;
    set({ access_token, refresh_token, isAuthenticated: () => true });
    setTokens(access_token, refresh_token);

    return { access_token, refresh_token };
  },
  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    set({
      user: null,
      access_token: null,
      refresh_token: null,
      isAuthenticated: () => false,
    });
  },
}));
