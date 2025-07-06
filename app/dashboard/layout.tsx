"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { SidebarDashboard, DashboardHeader } from "@/components/dashboard";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white">
      <SidebarDashboard open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
      <main className="flex-1 overflow-x-hidden min-h-screen flex flex-col">
        <div className="sticky top-0 z-30">
          <DashboardHeader
            title="Dashboard"
            onMenuClick={() => setIsSidebarOpen(true)}
          />
        </div>
        <div className="flex-1 flex justify-center items-start py-8 px-2 md:px-8">
          <div className="w-full max-w-6xl bg-white/90 rounded-2xl shadow-2xl border border-gray-100 p-4 md:p-8 transition-all duration-300">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
