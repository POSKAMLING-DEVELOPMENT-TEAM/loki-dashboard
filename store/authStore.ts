import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import { AuthStore, LoginCredentials, User } from "../types/auth";
import { authApi } from "../lib/api";

// Define Store type for dummy stores
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

          // Step 1: Call login API to get access token
          const loginResponse = await authApi.login(credentials);
          const { access_token } = loginResponse;

          // Step 2: Store token in cookies
          Cookies.set("auth-token", access_token, { expires: 7 });

          // Step 3: Get user profile using Bearer token
          const user = await authApi.getProfile();

          // Step 4: Update state
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
          // Even if logout fails, we still clear the token
        } finally {
          // Clear state regardless of API call success
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
            stores: [],
          });
        }
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true, error: null });
      },

      setToken: (token: string) => {
        // Store token in cookies for persistence
        Cookies.set("auth-token", token, {
          expires: 7, // 7 days
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      },

      clearAuth: () => {
        // Clear from cookies
        Cookies.remove("auth-token");

        // Clear from store
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

          // Get user profile using Bearer token
          const user = await authApi.getProfile();

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          // Clear invalid token
          Cookies.remove("auth-token");
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      // Dummy store functions
      addDummyStore: (store: Store) => {
        const currentStores = get().stores;
        set({ stores: [...currentStores, store] });
      },

      getDummyStores: () => {
        // Initialize with some dummy stores if empty
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
