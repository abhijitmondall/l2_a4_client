"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { api } from "@/lib/api/api";
import {
  SlidersHorizontal,
  Activity,
  PackageSearch,
  Search,
  X,
  ArrowRight,
  ArrowLeft,
  Box,
} from "lucide-react";
import { Medicine } from "@/types";
import { MedicineCard } from "@/components/ui/medicineCard";
import { Badge } from "@/components/ui/badge";

interface IMedicineSearchParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export default function MedicinesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [masterList, setMasterList] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 6;

  // URL Parameters
  const categoryId = searchParams.get("categoryId");
  const categoryName = searchParams.get("category");
  const urlSearch = searchParams.get("search") || "";
  const urlMinPrice = searchParams.get("minPrice") || "";
  const urlMaxPrice = searchParams.get("maxPrice") || "";
  const urlStockStatus = searchParams.get("stockStatus") || "all"; // "all" | "inStock" | "outOfStock"
  const currentPage = Number(searchParams.get("page")) || 1;

  // Local UI States
  const [localSearch, setLocalSearch] = useState(urlSearch);
  const [localMin, setLocalMin] = useState(urlMinPrice);
  const [localMax, setLocalMax] = useState(urlMaxPrice);
  const [localStockStatus, setLocalStockStatus] = useState(urlStockStatus);

  useEffect(() => {
    const fetchMasterData = async () => {
      setLoading(true);
      try {
        const params = { ...(categoryId && { categoryId }) };
        const response = await api.medicines.getAll(
          params as IMedicineSearchParams,
        );
        setMasterList(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Fetch failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMasterData();
  }, [categoryId]);

  // --- FILTER LOGIC WITH STOCK STATUS FILTER ---
  const {
    paginatedMedicines,
    totalPages,
    totalResults,
    showingFrom,
    showingTo,
    totalUnits,
  } = useMemo(() => {
    const filtered = masterList.filter((m) => {
      const matchesSearch =
        !localSearch ||
        m.name.toLowerCase().includes(localSearch.toLowerCase());
      const matchesMin = !localMin || m.price >= Number(localMin);
      const matchesMax = !localMax || m.price <= Number(localMax);

      // Stock Status Filtering logic
      let matchesStock = true;
      if (localStockStatus === "inStock") matchesStock = (m.stock || 0) > 0;
      if (localStockStatus === "outOfStock")
        matchesStock = (m.stock || 0) === 0;

      return matchesSearch && matchesMin && matchesMax && matchesStock;
    });

    const total = Math.ceil(filtered.length / itemsPerPage);
    const validPage = Math.min(currentPage, total || 1);
    const start = (validPage - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, filtered.length);

    const stockSum = filtered.reduce((acc, curr) => acc + (curr.stock || 0), 0);

    return {
      paginatedMedicines: filtered.slice(start, end),
      totalPages: total || 1,
      totalResults: filtered.length,
      showingFrom: filtered.length === 0 ? 0 : start + 1,
      showingTo: end,
      totalUnits: stockSum,
    };
  }, [
    masterList,
    localSearch,
    localMin,
    localMax,
    localStockStatus,
    currentPage,
  ]);

  // URL Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (localSearch) params.set("search", localSearch);
      else params.delete("search");
      if (localMin) params.set("minPrice", localMin);
      else params.delete("minPrice");
      if (localMax) params.set("maxPrice", localMax);
      else params.delete("maxPrice");
      if (localStockStatus !== "all")
        params.set("stockStatus", localStockStatus);
      else params.delete("stockStatus");

      params.set("page", "1"); // Reset on filter change
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 350);
    return () => clearTimeout(timer);
  }, [localSearch, localMin, localMax, localStockStatus]);

  const handlePageChange = (pageNum: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(pageNum));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearAll = () => {
    setLocalSearch("");
    setLocalMin("");
    setLocalMax("");
    setLocalStockStatus("all");
    router.push(pathname);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-24">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
                Clinical <span className="text-emerald-500">Inventory</span>
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search archive..."
                  className="pl-12 pr-4 py-3 bg-slate-100 border-none rounded-2xl text-xs font-bold w-64 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${showFilters ? "bg-slate-900 text-white" : "bg-white text-slate-600"}`}
              >
                <SlidersHorizontal size={14} />
                {showFilters ? "Close Filters" : "Advanced Filters"}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-400">
                  Availability
                </label>
                <select
                  value={localStockStatus}
                  onChange={(e) => setLocalStockStatus(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-bold appearance-none cursor-pointer"
                >
                  <option value="all">All Items</option>
                  <option value="inStock">In Stock Only</option>
                  <option value="outOfStock">Out of Stock</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-400">
                  Price Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={localMin}
                    onChange={(e) => setLocalMin(e.target.value)}
                    placeholder="Min"
                    className="w-1/2 bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-bold"
                  />
                  <input
                    type="number"
                    value={localMax}
                    onChange={(e) => setLocalMax(e.target.value)}
                    placeholder="Max"
                    className="w-1/2 bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-bold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-400">
                  Batch Metrics
                </label>
                <div className="flex items-center gap-2 h-[44px]">
                  <Badge className="bg-emerald-500 text-white font-black text-[10px] h-full px-4 rounded-xl">
                    {totalResults} SKU Found
                  </Badge>
                  <Badge className="bg-slate-900 text-white font-black text-[10px] h-full px-4 rounded-xl flex gap-2 items-center">
                    <Box size={12} className="text-emerald-400" /> {totalUnits}
                  </Badge>
                </div>
              </div>
              <div className="flex items-end pb-1">
                <button
                  onClick={handleClearAll}
                  className="w-full flex items-center justify-center gap-2 text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 px-4 py-3 rounded-xl transition-all"
                >
                  <X size={14} /> Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-12">
        {!loading && (
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-emerald-500 rounded-full" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Showing {showingFrom}-{showingTo} of {totalResults} matches
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="h-[40vh] flex items-center justify-center">
            <Activity className="animate-spin text-emerald-500" />
          </div>
        ) : paginatedMedicines.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
              {paginatedMedicines.map((m) => (
                <div
                  key={m.id}
                  className="relative transition-all duration-300"
                >
                  <MedicineCard medicine={m} viewMode={"grid"} />
                  {m.stock === 0 && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] rounded-3xl z-10 flex items-center justify-center">
                      <Badge className="bg-slate-900 text-white px-4 py-2 uppercase text-[10px]">
                        Sold Out
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-20 flex flex-col items-center gap-8">
                <div className="flex items-center gap-4">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="p-4 rounded-2xl bg-white border border-slate-200 disabled:opacity-20"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="flex items-center bg-white border border-slate-200 rounded-[2.5rem] p-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`h-12 w-12 rounded-full text-[11px] font-black transition-all ${currentPage === i + 1 ? "bg-slate-900 text-white" : "text-slate-400"}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="p-4 rounded-2xl bg-white border border-slate-200 disabled:opacity-20"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="h-[40vh] flex flex-col items-center justify-center text-center">
            <PackageSearch size={60} className="text-slate-200 mb-4" />
            <h3 className="font-black uppercase text-slate-900">
              No results for this stock filter
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
