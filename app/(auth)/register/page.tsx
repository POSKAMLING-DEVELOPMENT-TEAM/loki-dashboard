"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  AlertCircle,
  X,
} from "lucide-react";
import Image from "next/image";
import { registerSchema, type RegisterFormData } from "@/lib/validation";
import { useRegister } from "@/hooks/useAuth";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (errors.root || registerMutation.isError) {
      const timer = setTimeout(() => {
        clearErrors("root");
        registerMutation.reset();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [errors.root, registerMutation.isError, clearErrors, registerMutation]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // clearErrors("root");
      await registerMutation.mutateAsync(data);
      reset();
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const dismissError = () => {
    clearErrors("root");
    registerMutation.reset();
  };

  const getErrorMessage = () => {
    if (errors.root?.message) return errors.root.message;
    if (registerMutation.error?.message) return registerMutation.error.message;

    // Handle different error types
    if (registerMutation.error && typeof registerMutation.error === "object") {
      if ("message" in registerMutation.error) {
        return registerMutation.error.message as string;
      }
      // Handle API error responses
      if (
        typeof registerMutation.error === "object" &&
        registerMutation.error !== null &&
        "response" in registerMutation.error &&
        (registerMutation.error as any).response
      ) {
        const response = (registerMutation.error as any).response;
        if (response.data?.message) return response.data.message;
        if (response.data?.error) return response.data.error;
      }
    }

    return "Terjadi kesalahan saat registrasi. Silakan coba lagi.";
  };

  const isLoading = registerMutation.isPending || isSubmitting;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <Image
              src="/assets/loki-nobg.png"
              alt="Logo Loki"
              width={200}
              height={200}
              className="mx-auto"
              priority
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Daftar Akun Baru
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Buat akun untuk mulai menggunakan Loki Dashboard
          </p>
        </div>

        {/* Error display */}
        {(errors.root || registerMutation.isError) && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex justify-between items-start">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="ml-3">
                  <p className="text-sm text-red-800">{getErrorMessage()}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={dismissError}
                className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
                aria-label="Tutup pesan error"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Name field */}
            <div>
              <label htmlFor="name" className="sr-only">
                Nama lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("name")}
                  id="name"
                  type="text"
                  autoComplete="name"
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-colors ${
                    errors.name
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="Nama lengkap"
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
              </div>
              {errors.name && (
                <p
                  id="name-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email field */}
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
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-colors ${
                    errors.email
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="Alamat email"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>
              {errors.email && (
                <p
                  id="email-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone number field */}
            <div>
              <label htmlFor="phone_number" className="sr-only">
                Nomor telepon
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("phone_number")}
                  id="phone_number"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="tel"
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-colors ${
                    errors.phone_number
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="Nomor telepon"
                  aria-invalid={errors.phone_number ? "true" : "false"}
                  aria-describedby={
                    errors.phone_number ? "phone-error" : undefined
                  }
                />
              </div>
              {errors.phone_number && (
                <p
                  id="phone-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.phone_number.message}
                </p>
              )}
            </div>

            {/* Password field */}
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
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-colors ${
                    errors.password
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="Password"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p
                  id="password-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Password confirmation field */}
            <div>
              <label htmlFor="password_confirmation" className="sr-only">
                Konfirmasi password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("password_confirmation")}
                  id="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-colors ${
                    errors.password_confirmation
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="Konfirmasi password"
                  aria-invalid={errors.password_confirmation ? "true" : "false"}
                  aria-describedby={
                    errors.password_confirmation
                      ? "confirm-password-error"
                      : undefined
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors hover:cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword
                      ? "Sembunyikan konfirmasi password"
                      : "Tampilkan konfirmasi password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password_confirmation && (
                <p
                  id="confirm-password-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.password_confirmation.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 hover:cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  <span>Mendaftar...</span>
                </div>
              ) : (
                "Daftar"
              )}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">Sudah punya akun? </p>
            <Link
              href="/login"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Masuk di sini
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
