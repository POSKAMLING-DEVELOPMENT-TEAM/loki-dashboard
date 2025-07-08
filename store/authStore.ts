import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import { AuthStore, LoginCredentials, User } from "../types/auth";
import { authApi } from "../lib/api";

interface Store {
  id: string;
  name: string;
  description: string;
  address: string;
  phone_number: string;
  email: string;
  package: string;
}

export const useAuthStore = create<
  AuthStore & {
    stores: Store[];
    addDummyStore: (store: Store) => void;
    getDummyStores: () => void;
  }
>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      stores: [],

      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null });
          const loginResponse = await authApi.login(credentials);
          const { access_token } = loginResponse;
          Cookies.set("auth-token", access_token, { expires: 7 });
          const user = await authApi.getProfile();

          set({
            user,
            token: access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error.message || "Login failed",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true, error: null });
      },

      setToken: (token: string) => {
        Cookies.set("auth-token", token, {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      },

      clearAuth: () => {
        Cookies.remove("auth-token");
        set({
          user: null,
          isAuthenticated: false,
          error: null,
          stores: [],
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      updateUser: (updatedUser: User) => {
        set({ user: updatedUser });
      },

      checkAuth: async () => {
        try {
          const token = Cookies.get("auth-token");
          if (!token) {
            set({ isAuthenticated: false });
            return;
          }

          set({ isLoading: true });

          const user = await authApi.getProfile();

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          Cookies.remove("auth-token");
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      addDummyStore: (store: Store) => {
        const currentStores = get().stores;
        set({ stores: [...currentStores, store] });
      },

      getDummyStores: () => {
        const currentStores = get().stores;
        if (currentStores.length === 0) {
          const dummyStores: Store[] = [
            {
              id: "1",
              name: "Toko Sukses Jaya",
              description: "Toko kelontong dan minimarket",
              address: "Jl. Merdeka No. 123",
              phone_number: "08123456789",
              email: "toko@example.com",
              package: "Pro",
            },
          ];
          set({ stores: dummyStores });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        stores: state.stores,
      }),
    }
  )
);
