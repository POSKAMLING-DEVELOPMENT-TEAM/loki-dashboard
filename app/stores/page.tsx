"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Store as StoreIcon, PlusCircle, XCircle } from "lucide-react";

export default function StoresPage() {
  const router = useRouter();
  const { stores, isLoading, addDummyStore, getDummyStores, token, logout } =
    useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [address, setAddress] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const packageOptions = [
    { key: "gratis", name: "Gratis", desc: "Fitur dasar, cocok untuk pemula." },
    {
      key: "pro",
      name: "Pro",
      desc: "Fitur lanjutan untuk bisnis berkembang.",
    },
    {
      key: "bisnis",
      name: "Bisnis",
      desc: "Semua fitur premium untuk bisnis besar.",
    },
  ];

  useEffect(() => {
    if (token === "dummy-token-123") {
      getDummyStores();
    }
  }, [token, getDummyStores]);

  const validateName = (value: string) => {
    if (!value.trim()) {
      setNameError("Nama toko wajib diisi");
      return false;
    }
    if (value.trim().length < 3) {
      setNameError("Nama toko minimal 3 karakter");
      return false;
    }
    if (value.trim().length > 50) {
      setNameError("Nama toko maksimal 50 karakter");
      return false;
    }
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(value.trim())) {
      setNameError(
        "Nama toko hanya boleh berisi huruf, angka, spasi, dan tanda hubung"
      );
      return false;
    }
    setNameError("");
    return true;
  };

  const validateDescription = (value: string) => {
    if (value.length > 200) {
      setDescriptionError("Deskripsi maksimal 200 karakter");
      return false;
    }
    setDescriptionError("");
    return true;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    validateName(value);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setDescription(value);
    validateDescription(value);
  };

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

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const isNameValid = validateName(name);
    const isDescriptionValid = validateDescription(description);
    if (!isNameValid || !isDescriptionValid) return;
    if (!phone_number.trim()) {
      setPhoneError("Nomor telepon wajib diisi");
      return;
    }
    if (!/^[0-9]+$/.test(phone_number)) {
      setPhoneError("Nomor telepon hanya boleh berisi angka.");
      return;
    }
    if (!email.trim()) {
      setEmailError("Email toko wajib diisi");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Format email tidak valid.");
      return;
    }
    const existingStore = stores.find(
      store => store.name.toLowerCase().trim() === name.toLowerCase().trim()
    );
    if (existingStore) {
      setError("Nama toko sudah ada. Gunakan nama yang berbeda.");
      return;
    }
    setStep(2);
    setSelectedPackage(null);
  };

  const handleConfirmPackage = () => {
    if (selectedPackage) {
      const newId = Date.now().toString();
      addDummyStore({
        id: newId,
        name: name.trim(),
        description: description.trim(),
        address: address.trim(),
        phone_number: phone_number.trim(),
        email: email.trim(),
        package: selectedPackage,
      });
      getDummyStores();
    }
    setStep(1);
    setShowModal(false);
    // Reset all fields
    setName("");
    setDescription("");
    setAddress("");
    setPhoneNumber("");
    setEmail("");
    setNameError("");
    setDescriptionError("");
    setPhoneError("");
    setEmailError("");
    setError("");
    // setSelectedStoreId(null);
    setSelectedPackage(null);
  };

  // Add computed variable for button disabled state
  const isFormInvalid =
    !name.trim() ||
    !phone_number.trim() ||
    !email.trim() ||
    !!nameError ||
    !!phoneError ||
    !!emailError;

  // Filter stores by search
  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-white py-12 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-10 border border-indigo-100">
        <div className="flex flex-col items-center mb-8">
          <StoreIcon className="w-16 h-16 text-indigo-500 mb-2 drop-shadow" />
          <h1 className="text-3xl font-extrabold text-indigo-800 mb-2 text-center drop-shadow">
            Pilih Toko Anda
          </h1>
          <p className="text-gray-600 text-lg text-center">
            Silakan pilih toko untuk masuk ke dashboard, atau tambahkan toko
            baru.
          </p>
        </div>
        {/* Search input */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-2">
          <input
            type="text"
            className="w-full sm:w-80 px-4 py-3 border border-indigo-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg bg-indigo-50 placeholder-gray-400"
            placeholder="Cari toko..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {/* Scrollable store list */}
        <div className="max-h-[400px] overflow-y-auto pr-1 mb-8 custom-scrollbar">
          {filteredStores.length === 0 ? (
            <div className="text-center text-gray-500 text-lg font-medium py-8">
              Tidak ada toko yang ditemukan.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStores.map(store => (
                <div
                  key={store.id}
                  className="group bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl shadow hover:shadow-lg transition-shadow duration-200 p-6 flex flex-col justify-between cursor-pointer hover:scale-[1.025]"
                  onClick={() => router.push(`/dashboard/${store.id}`)}
                >
                  <div className="flex items-center gap-3 mb-2 min-w-0">
                    <StoreIcon className="w-7 h-7 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                    <span
                      className="text-xl font-bold text-indigo-800 group-hover:text-indigo-900 transition-colors truncate max-w-full"
                      title={store.name}
                    >
                      {store.name}
                    </span>
                  </div>
                  <div className="text-gray-600 text-sm mb-3 min-h-[32px]">
                    {store.description || (
                      <span className="italic text-gray-400">
                        Tidak ada deskripsi
                      </span>
                    )}
                  </div>
                  <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full w-fit">
                    ID: {store.id}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="w-full flex items-center justify-center gap-2 text-lg font-bold py-4 mt-2 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 shadow-lg"
        >
          <PlusCircle className="w-6 h-6" />
          Tambah Toko
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="w-full mt-8 text-base font-semibold border border-indigo-200 text-indigo-700 bg-white hover:bg-indigo-50"
        >
          Kembali ke Login
        </Button>
      </div>
      {/* Modal Add Store */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 w-full max-w-md sm:max-w-lg relative animate-fadeIn mx-2 overflow-y-auto max-h-[95vh]">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
              onClick={() => {
                setShowModal(false);
                setStep(1);
              }}
              aria-label="Tutup"
            >
              <XCircle className="w-7 h-7" />
            </button>
            {/* Stepper Indicator */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div
                className={`flex items-center gap-2 ${
                  step === 1 ? "font-bold text-indigo-700" : "text-gray-400"
                }`}
              >
                <span
                  className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${
                    step === 1
                      ? "border-indigo-600 bg-indigo-100"
                      : "border-gray-300 bg-gray-100"
                  }`}
                >
                  1
                </span>
                <span>Data Toko</span>
              </div>
              <span className="w-8 h-0.5 bg-gray-200 rounded"></span>
              <div
                className={`flex items-center gap-2 ${
                  step === 2 ? "font-bold text-indigo-700" : "text-gray-400"
                }`}
              >
                <span
                  className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${
                    step === 2
                      ? "border-indigo-600 bg-indigo-100"
                      : "border-gray-300 bg-gray-100"
                  }`}
                >
                  2
                </span>
                <span>Pilih Paket</span>
              </div>
            </div>
            {/* Step 1: Form */}
            {step === 1 && (
              <>
                <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">
                  Tambah Toko Baru
                </h2>
                <form onSubmit={handleNextStep} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-base font-semibold text-gray-800 mb-1 items-center gap-2">
                        Nama Toko{" "}
                        <span className="text-red-500 text-lg">*</span>
                      </label>
                      <input
                        className={`block w-full px-5 py-4 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 text-lg ${
                          nameError
                            ? "border-red-300 bg-red-50 focus:ring-red-400"
                            : "border-indigo-200 bg-white/80 focus:ring-indigo-400"
                        }`}
                        placeholder="Contoh: Toko Sukses Jaya"
                        value={name}
                        onChange={handleNameChange}
                        required
                        autoFocus
                      />
                      {nameError && (
                        <div className="text-red-500 text-sm mt-1">
                          {nameError}
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-base font-semibold text-gray-800 mb-1">
                        Deskripsi Toko
                      </label>
                      <textarea
                        className={`block w-full px-5 py-4 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 text-lg resize-none ${
                          descriptionError
                            ? "border-red-300 bg-red-50 focus:ring-red-400"
                            : "border-indigo-200 bg-white/80 focus:ring-indigo-400"
                        }`}
                        placeholder="Ceritakan tentang toko Anda"
                        value={description}
                        onChange={handleDescriptionChange}
                        rows={2}
                      />
                      <span className="text-xs text-gray-500 mt-1 block">
                        Contoh: Toko kelontong, minimarket, dsb.
                      </span>
                      {descriptionError && (
                        <div className="text-red-500 text-sm mt-1">
                          {descriptionError}
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-base font-semibold text-gray-800 mb-1">
                        Alamat Toko
                      </label>
                      <input
                        className="block w-full px-5 py-4 border border-indigo-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-gray-900 text-lg bg-white/80"
                        placeholder="Alamat lengkap toko"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                      />
                      <span className="text-xs text-gray-500 mt-1 block">
                        Contoh: Jl. Merdeka No. 123
                      </span>
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-1">
                        Nomor Telepon <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        className="block w-full px-5 py-4 border border-indigo-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-gray-900 text-lg bg-white/80"
                        placeholder="0812xxxxxxx"
                        value={phone_number}
                        onChange={handlePhoneChange}
                        required
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
                      <label className="block text-base font-semibold text-gray-800 mb-1">
                        Email Toko <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        className="block w-full px-5 py-4 border border-indigo-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-gray-900 text-lg bg-white/80"
                        placeholder="Email toko"
                        value={email}
                        onChange={handleEmailChange}
                        required
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
                  </div>
                  {error && (
                    <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                      {error}
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full mt-2 text-lg font-bold py-3 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 shadow"
                    disabled={isFormInvalid}
                  >
                    Lanjut
                  </Button>
                </form>
              </>
            )}
            {/* Step 2: Pilih Paket */}
            {step === 2 && (
              <>
                <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
                  Pilih Paket Toko
                </h2>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  {packageOptions.map(pkg => (
                    <button
                      key={pkg.key}
                      type="button"
                      onClick={() => setSelectedPackage(pkg.key)}
                      className={`w-full flex flex-col items-start border-2 rounded-xl p-5 transition-all shadow group
                        ${
                          selectedPackage === pkg.key
                            ? "border-indigo-500 bg-indigo-100"
                            : "border-indigo-200 bg-indigo-50 hover:border-indigo-500 hover:bg-indigo-100"
                        }`}
                    >
                      <span className="text-lg font-bold text-indigo-800 group-hover:text-indigo-900 mb-1">
                        {pkg.name}
                      </span>
                      <span className="text-gray-600 text-sm mb-1">
                        {pkg.desc}
                      </span>
                      <span className="inline-block bg-indigo-200 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mt-2">
                        {pkg.key.toUpperCase()}
                      </span>
                    </button>
                  ))}
                </div>
                <Button
                  type="button"
                  className="w-full mt-2 text-lg font-bold py-3 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 shadow"
                  disabled={!selectedPackage}
                  onClick={handleConfirmPackage}
                >
                  Buat Toko
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
