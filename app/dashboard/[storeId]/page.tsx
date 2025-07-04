"use client";

// External Libraries
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Edit2, Trash2, PlusCircle, Filter } from "lucide-react";

// Internal Components & Hooks
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";

export default function StoreDashboardPage() {
  const router = useRouter();
  const { storeId } = useParams();
  const { stores } = useAuthStore();
  const store = stores.find(s => s.id === storeId);

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-white">
        <div className="text-2xl font-bold text-red-600 mb-6">
          Toko tidak ditemukan
        </div>
        <Button
          onClick={() => router.push("/stores")}
          className="flex items-center gap-2 px-6 py-2 rounded-lg shadow-md bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke List Toko
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
        {/* Search & Action Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              className="w-full md:w-80 px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base bg-gray-50 placeholder-gray-400"
              placeholder="Cari sesuatu..."
            />
            <Button
              variant="outline"
              className="ml-2 px-3 py-2 flex items-center gap-1"
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
          <Button className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-semibold px-5 py-2 rounded-lg shadow flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Tambah Data
          </Button>
        </div>
        <hr className="my-4 border-gray-200" />
        {/* Dummy Table Area */}
        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="min-w-full bg-white text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600 uppercase text-xs">
                <th className="px-4 py-3 text-left font-semibold">Column 1</th>
                <th className="px-4 py-3 text-left font-semibold">Column 2</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map(i => (
                <tr
                  key={i}
                  className="border-t border-gray-100 hover:bg-indigo-50/40 transition-colors group"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    Data {i}A
                  </td>
                  <td className="px-4 py-3 text-gray-700">Data {i}B</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                        i % 2 === 0
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {i % 2 === 0 ? "Active" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1 group-hover:border-indigo-400"
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex items-center gap-1 group-hover:bg-red-600 group-hover:text-white"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
