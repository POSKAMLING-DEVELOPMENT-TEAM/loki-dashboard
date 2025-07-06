"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";

const Dashboard = () => {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold text-gray-800">
        Welcome to the Dashboard
      </h1>
      <Button onClick={handleLogout}>logout</Button>
    </div>
  );
};

export default Dashboard;
