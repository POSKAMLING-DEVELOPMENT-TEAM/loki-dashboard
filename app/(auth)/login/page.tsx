"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import LoginForm from "@/components/form/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/stores");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return <LoginForm />;
}
