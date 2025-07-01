"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { stores, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && stores.length === 0) {
      router.replace("/create-store");
    }
  }, [stores, isLoading, router]);

  if (isLoading || stores.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
