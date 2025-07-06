"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";

export default function CreateStorePage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const router = useRouter();
  const { checkAuth, logout } = useAuthStore();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value)) {
      setPhoneNumber(value);
      setPhoneError("");
    } else {
      setPhoneError("Nomor telepon hanya boleh berisi angka.");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !/^\S+@\S+\.\S+$/.test(value)) {
      setEmailError("Format email tidak valid.");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (phone_number && !/^[0-9]+$/.test(phone_number)) {
      setPhoneError("Nomor telepon hanya boleh berisi angka.");
      return;
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Format email tidak valid.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          address,
          phone_number,
          email,
          slug,
        }),
      });
      if (!res.ok) throw new Error("Gagal membuat toko");
      await checkAuth();
      router.replace("/dashboard");
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100/80 via-blue-100/70 to-white py-12 px-2 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl flex flex-col items-center justify-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col items-center mb-2"
        >
          <motion.span
            className="text-6xl mb-2 select-none"
            role="img"
            aria-label="store"
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.7 }}
          >
            🏪
          </motion.span>
          <motion.h1
            className="text-3xl sm:text-4xl font-extrabold text-indigo-800 text-center mb-2 leading-tight drop-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Kamu belum memiliki toko
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-gray-700 text-center font-medium mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            Yuk, bikin toko kamu terlebih dahulu untuk mulai menggunakan Loki
            Dashboard!
          </motion.p>
        </motion.div>
        <motion.form
          className="w-full space-y-6"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label
                htmlFor="store-name"
                className="block text-base font-semibold text-gray-800 mb-1 items-center gap-2"
              >
                Nama Toko
                <span className="text-red-500 text-lg">*</span>
              </label>
              <input
                id="store-name"
                className="block w-full px-5 py-4 border border-indigo-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-gray-900 text-lg bg-white/80"
                placeholder="Contoh: Toko Sukses Jaya"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoFocus
                disabled={loading}
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="store-description"
                className="block text-base font-semibold text-gray-800 mb-1"
              >
                Deskripsi Toko
              </label>
              <textarea
                id="store-description"
                className="block w-full px-5 py-4 border border-indigo-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-gray-900 text-lg bg-white/80 resize-none"
                placeholder="Ceritakan tentang toko Anda"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={2}
                disabled={loading}
              />
              <span className="text-xs text-gray-500 mt-1 block">
                Contoh: Toko kelontong, minimarket, dsb.
              </span>
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="store-address"
                className="block text-base font-semibold text-gray-800 mb-1"
              >
                Alamat Toko
              </label>
              <input
                id="store-address"
                className="block w-full px-5 py-4 border border-indigo-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-gray-900 text-lg bg-white/80"
                placeholder="Alamat lengkap toko"
                value={address}
                onChange={e => setAddress(e.target.value)}
                disabled={loading}
              />
              <span className="text-xs text-gray-500 mt-1 block">
                Contoh: Jl. Merdeka No. 123
              </span>
            </div>
            <div>
              <label
                htmlFor="store-phone"
                className="block text-base font-semibold text-gray-800 mb-1"
              >
                Nomor Telepon
              </label>
              <input
                id="store-phone"
                type="tel"
                className="block w-full px-5 py-4 border border-indigo-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-gray-900 text-lg bg-white/80"
                placeholder="0812xxxxxxx"
                value={phone_number}
                onChange={handlePhoneChange}
                disabled={loading}
              />
              {phoneError && (
                <span className="text-xs text-red-500 mt-1 block">
                  {phoneError}
                </span>
              )}
              <span className="text-xs text-gray-500 mt-1 block">
                Nomor yang bisa dihubungi pelanggan.
              </span>
            </div>
            <div>
              <label
                htmlFor="store-email"
                className="block text-base font-semibold text-gray-800 mb-1"
              >
                Email Toko
              </label>
              <input
                id="store-email"
                type="email"
                className="block w-full px-5 py-4 border border-indigo-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-gray-900 text-lg bg-white/80"
                placeholder="Email toko"
                value={email}
                onChange={handleEmailChange}
                disabled={loading}
              />
              {emailError && (
                <span className="text-xs text-red-500 mt-1 block">
                  {emailError}
                </span>
              )}
              <span className="text-xs text-gray-500 mt-1 block">
                Contoh: toko@email.com
              </span>
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="store-slug"
                className="block text-base font-semibold text-gray-800 mb-1"
              >
                Slug (URL toko)
              </label>
              <input
                id="store-slug"
                className="block w-full px-5 py-4 border border-indigo-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-gray-900 text-lg bg-white/80"
                placeholder="contoh-toko-sukses"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                disabled={loading}
              />
              <span className="text-xs text-gray-500 mt-1 block">
                URL unik toko Anda, misal: loki.com/store/contoh-toko-sukses
              </span>
            </div>
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center -mt-2">
              {error}
            </div>
          )}
          <motion.button
            type="submit"
            className="w-full flex justify-center py-4 px-4 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            disabled={loading || !name.trim() || !!phoneError || !!emailError}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>{" "}
                Membuat...
              </span>
            ) : (
              "Buat Toko"
            )}
          </motion.button>
        </motion.form>
        <motion.button
          type="button"
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="w-full mt-2 flex justify-center py-3 px-4 border border-indigo-200 text-lg font-semibold rounded-xl text-indigo-700 bg-white/80 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300 transition-all duration-200 shadow"
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          Kembali ke Login
        </motion.button>
      </div>
    </div>
  );
}
