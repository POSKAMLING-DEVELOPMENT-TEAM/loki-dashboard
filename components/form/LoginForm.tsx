"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validation";
import { useLogin } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const loginMutation = useLogin();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get("message");
    if (message) {
      setSuccessMessage(message);
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (errors.root || loginMutation.isError) {
      const timer = setTimeout(() => {
        clearErrors();
        loginMutation.reset();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [errors.root, loginMutation.isError, clearErrors, loginMutation]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const onSubmit = async (data: LoginFormData) => {
    clearErrors();

    try {
      const result = await loginMutation.mutateAsync(data);
    } catch (error: any) {
      if (error.status === 401) {
        setError("root", {
          type: "manual",
          message: "Email atau password salah. Silakan coba lagi.",
        });
      } else if (error.status === 404) {
        setError("root", {
          type: "manual",
          message: "User tidak ditemukan.",
        });
      } else if (error.status === 422) {
        setError("root", {
          type: "manual",
          message: "Data yang dimasukkan tidak valid.",
        });
      } else {
        setError("root", {
          type: "manual",
          message:
            error.message || "Terjadi kesalahan saat login. Silakan coba lagi.",
        });
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (Object.keys(errors).length > 0) {
      return;
    }

    handleSubmit(onSubmit)(e);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div>
            <Image
              src="/assets/loki-nobg.png"
              alt="Logo Loki"
              width={200}
              height={200}
              className="mx-auto"
              priority
            />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Masuk ke akun Anda
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Selamat datang kembali ke Loki Dashboard
          </p>
        </div>

        {/* Success message display */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex justify-between items-start">
              <div className="flex">
                <svg
                  className="h-5 w-5 text-green-400 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-green-800">{successMessage}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSuccessMessage(null)}
                className="text-green-400 hover:text-green-600 transition-colors"
                aria-label="Clear message"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Single error display */}
        {(errors.root || loginMutation.isError) && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex justify-between items-start">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm text-red-800">
                    {errors.root?.message ||
                      loginMutation.error?.message ||
                      "Terjadi kesalahan saat login"}
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Periksa email dan password Anda
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  clearErrors();
                  loginMutation.reset();
                }}
                className="text-red-400 hover:text-red-600 transition-colors"
                aria-label="Clear error"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Alamat email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white ${
                    errors.email
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Alamat email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white ${
                    errors.password
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 hover:cursor-pointer"
            >
              {loginMutation.isPending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                "Masuk"
              )}
            </Button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">
                  Atau lanjutkan dengan
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="ml-2">Google</span>
              </button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">Belum punya akun?</p>
            <Link
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Daftar disini
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
