"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogOut, Store as StoreIcon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetHeader,
  SheetDescription,
} from "@/components/ui/sheet";

const navigationItems = [{ href: "/stores", label: "Toko", icon: StoreIcon }];

interface SidebarDashboardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SidebarDashboard = ({
  open,
  onOpenChange,
}: SidebarDashboardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const userName = user?.name || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="left"
          className="w-64 p-0 bg-gradient-to-b from-indigo-200/80 via-blue-100/80 to-white/90 border-none shadow-2xl"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>
              Navigation menu for accessing different areas of the application
            </SheetDescription>
          </SheetHeader>
          <div className="flex h-full flex-col">
            {/* Branding Section */}
            <div className="p-8 pb-6 bg-gradient-to-br from-indigo-400/80 via-blue-400/60 to-white/0 flex flex-col items-center gap-2 rounded-b-3xl shadow-md">
              <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center mb-2">
                <Image
                  src="/assets/loki-nobg.png"
                  alt="Loki Logo"
                  width={44}
                  height={44}
                />
              </div>
              <span className="text-base font-bold text-indigo-900 tracking-widest uppercase opacity-80">
                Loki Dashboard
              </span>
            </div>
            {/* Menu */}
            <nav className="flex-1 p-4 pt-8 space-y-2 overflow-y-auto bg-white/60 backdrop-blur-md rounded-tr-3xl">
              {navigationItems.map(item => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group border-l-4 shadow-sm ${
                      isActive
                        ? "text-indigo-700 bg-indigo-100 border-indigo-600"
                        : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 border-transparent"
                    }`}
                    style={{ marginBottom: 4 }}
                    onClick={() => onOpenChange(false)}
                  >
                    <item.icon
                      className={`w-5 h-5 transition-colors duration-200 ${
                        isActive
                          ? "text-indigo-700"
                          : "text-gray-400 group-hover:text-indigo-600"
                      }`}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            {/* Footer */}
            <div className="p-4 border-t border-gray-100 flex flex-col items-center gap-3 bg-white/70 rounded-b-2xl">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-blue-400 flex items-center justify-center text-white font-bold text-lg shadow">
                {userInitial}
              </div>
              <span className="text-xs text-gray-500 font-semibold">
                {userName}
              </span>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
                onClick={() => {
                  handleLogout();
                  onOpenChange(false);
                }}
              >
                <LogOut className="w-5 h-5 mr-3" />
                Keluar
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="hidden md:flex md:w-64 md:flex-col bg-gradient-to-b from-indigo-200/80 via-blue-100/80 to-white/90 border-r border-gray-200 shadow-2xl">
        {/* Branding Section */}
        <div className="p-8 pb-6 bg-gradient-to-br from-indigo-400/80 via-blue-400/60 to-white/0 flex flex-col items-center gap-2 rounded-b-3xl shadow-md">
          <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center mb-2">
            <Image
              src="/assets/loki-nobg.png"
              alt="Loki Logo"
              width={44}
              height={44}
            />
          </div>
          <span className="text-base font-bold text-indigo-900 tracking-widest uppercase opacity-80">
            Loki Dashboard
          </span>
        </div>
        {/* Menu */}
        <nav className="flex-1 p-4 pt-8 space-y-2 overflow-y-auto bg-white/60 backdrop-blur-md rounded-tr-3xl">
          {navigationItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group border-l-4 shadow-sm ${
                  isActive
                    ? "text-indigo-700 bg-indigo-100 border-indigo-600"
                    : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 border-transparent"
                }`}
                style={{ marginBottom: 4 }}
              >
                <item.icon
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isActive
                      ? "text-indigo-700"
                      : "text-gray-400 group-hover:text-indigo-600"
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex flex-col items-center gap-3 bg-white/70 rounded-b-2xl">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-blue-400 flex items-center justify-center text-white font-bold text-lg shadow">
            {userInitial}
          </div>
          <span className="text-xs text-gray-500 font-semibold">
            {userName}
          </span>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Keluar
          </Button>
        </div>
      </div>
    </>
  );
};
