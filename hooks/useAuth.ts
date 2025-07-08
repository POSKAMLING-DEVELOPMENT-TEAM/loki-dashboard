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
        const loginResponse = await authApi.login(credentials);
        const { access_token } = loginResponse;
        setToken(access_token);
        const user = await authApi.getProfile();
        setUser(user);

        return { user, token: access_token };
      } catch (error: any) {
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
  });
}

// Hook for getting user profile
export function useUserProfile() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: authApi.getProfile,
    enabled: false,
  });
}

// Hook for register mutation
export function useRegister() {
  const router = useRouter();
  const { setUser, setToken, setError, setLoading, clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      setLoading(true);
      setError(null);
      try {
        await authApi.register(credentials);
        const loginResponse = await authApi.login({
          email: credentials.email,
          password: credentials.password,
        });
        const { access_token } = loginResponse;
        setToken(access_token);
        const user = await authApi.getProfile();
        setUser(user);
        return { user, token: access_token };
      } catch (error: any) {
        clearAuth();
        const errorMessage = error.message || "Registration failed";
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      router.push("/stores");
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
      // router.push("/login");
    },
    onError: (error: any) => {
      // clearAuth();
      // router.push("/login");
    },
  });
}
