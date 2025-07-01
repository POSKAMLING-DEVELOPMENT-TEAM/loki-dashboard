import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import {
  AuthState,
  User,
  UserRole,
  Store,
  LoginCredentials,
  AuthResponse,
} from "../types/auth";
import { authApi } from "../lib/api";

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithOAuth: (provider: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      token: null,
      roles: [],
      stores: [],
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null });

          const response = await authApi.login(credentials);
          const { user, token, roles, stores } = response;

          // Store token in cookies
          Cookies.set("auth-token", token, { expires: 7 });

          set({
            user,
            token,
            roles,
            stores,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Login failed",
            isLoading: false,
          });
          throw error;
        }
      },

      loginWithOAuth: async (provider: string) => {
        try {
          set({ isLoading: true, error: null });

          // Redirect to OAuth provider
          window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth/${provider}`;
        } catch (error: any) {
          set({
            error: error.message || "OAuth login failed",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        Cookies.remove("auth-token");
        set({
          user: null,
          token: null,
          roles: [],
          stores: [],
          isAuthenticated: false,
          error: null,
        });
      },

      setUser: (user: User) => set({ user }),
      setToken: (token: string) => set({ token }),
      setError: (error: string | null) => set({ error }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),

      checkAuth: async () => {
        try {
          const token = Cookies.get("auth-token");
          if (!token) {
            set({ isAuthenticated: false });
            return;
          }

          set({ isLoading: true });
          const response = await authApi.getProfile();
          const { user, roles, stores } = response;

          set({
            user,
            token,
            roles,
            stores,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          Cookies.remove("auth-token");
          set({
            user: null,
            token: null,
            roles: [],
            stores: [],
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        roles: state.roles,
        stores: state.stores,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
