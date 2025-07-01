import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";

export function useAuth(requireAuth: boolean = true) {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.replace("/login");
      } else if (!requireAuth && isAuthenticated) {
        router.replace("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, router]);

  return { isAuthenticated, isLoading };
}
