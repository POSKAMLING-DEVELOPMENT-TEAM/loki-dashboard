"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { Menu, LogOut } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  onMenuClick: () => void;
}

export function DashboardHeader({ title, onMenuClick }: DashboardHeaderProps) {
  const { user, logout } = useAuthStore();
  const userName = user?.name || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="h-16 bg-white/80 backdrop-blur-md shadow-md border-b border-gray-200 sticky top-0 z-40 transition-all">
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-blue-400 flex items-center justify-center text-white font-bold text-lg shadow">
            {userInitial}
          </div>
          <span className="text-sm text-muted-foreground font-semibold">
            {userName}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            title="Logout"
            className="transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
