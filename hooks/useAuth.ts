import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "../lib/api";
import { LoginCredentials, RegisterCredentials, User } from "../types/auth";
import { useAuthStore } from "../store/authStore";

// Hook for login mutation
export function useLogin() {
  const router = useRouter();
  const { setUser, setToken, setError, setLoading, clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      setLoading(true);
      setError(null);

      try {
        // Login to get token
        const loginResponse = await authApi.login(credentials);
        const { access_token } = loginResponse;

        // Store token
        setToken(access_token);

        // Get user profile only if login was successful
        const user = await authApi.getProfile();
        setUser(user);

        return { user, token: access_token };
      } catch (error: any) {
        // Clear any stored data on error
        clearAuth();

        const errorMessage = error.message || "Login failed";
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      router.push("/stores");
    },
    onError: (error: any) => {
      // Error is already handled in mutationFn
    },
  });
}

// Hook for getting user profile
export function useUserProfile() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: authApi.getProfile,
    enabled: false, // Don't run automatically
  });
}

// Hook for register mutation
export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const response = await authApi.register(credentials);
      return response;
    },
    onSuccess: () => {
      router.push(
        "/login?message=Registration successful! Please check your email to verify your account."
      );
    },
    onError: (error: any) => {
      // Error is handled by the mutation
      throw error;
    },
  });
}

// Hook for logout
export function useLogout() {
  const router = useRouter();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuth();
      router.push("/login");
    },
    onError: (error: any) => {
      // Still clear state even if API call fails
      clearAuth();
      router.push("/login");
    },
  });
}
