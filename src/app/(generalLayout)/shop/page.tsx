"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Search,
  X,
  Grid,
  List,
  PackageSearch,
  Filter,
  ChevronRight,
  ChevronLeft,
  LayoutGrid,
  Pill,
  Sparkles,
  ArrowUpDown,
  Trash2,
  Loader2,
  Activity,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { Medicine, Category } from "@/types";
import { MedicineCard } from "@/components/ui/medicineCard";
import { toast } from "@/hooks/useToast";
import api from "@/lib/api/api";

type SortOption = "newest" | "price-asc" | "price-desc" | "name-asc";

export default function ShopPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [m, c] = await Promise.all([
          api.medicines.getAll(),
          api.medicines.getCategories(),
        ]);
        setMedicines(m);
        setCategories(c);
      } catch (err) {
        toast({
          title: "System Error",
          description: "Failed to sync dispensary data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredMedicines = useMemo(() => {
    const result = medicines.filter(
      (m) =>
        (selectedCategory === "all" || m.category.name === selectedCategory) &&
        (m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!priceRange.min || m.price >= parseFloat(priceRange.min)) &&
        (!priceRange.max || m.price <= parseFloat(priceRange.max)) &&
        (!inStockOnly || m.stock > 0),
    );

    return result.sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [
    medicines,
    searchTerm,
    selectedCategory,
    priceRange,
    inStockOnly,
    sortBy,
  ]);

  const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMedicines.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setInStockOnly(false);
    setPriceRange({ min: "", max: "" });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-20 font-sans">
      {/* --- HERO HEADER --- */}
      <div className="bg-white border-b border-slate-200 mb-12">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="bg-slate-900 p-2.5 rounded-2xl text-emerald-400 shadow-xl shadow-slate-200">
                  <Pill size={28} />
                </div>
                <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">
                  The <span className="text-emerald-500">Dispensary</span>
                </h1>
              </div>
              <p className="text-slate-400 font-bold uppercase text-[11px] tracking-[0.3em] ml-1">
                Verified Pharmaceutical Archive • Global Standards
              </p>
            </div>
            <div className="bg-emerald-50 px-6 py-4 rounded-[2rem] border border-emerald-100 flex items-center gap-4">
              <Sparkles className="text-emerald-600" size={20} />
              <div>
                <p className="text-[10px] font-black uppercase text-emerald-900 tracking-widest leading-none">
                  Status
                </p>
                <p className="text-xs font-bold text-emerald-700 mt-1">
                  Pharmacist on Duty
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-10 items-start">
        {/* --- SIDEBAR FILTERS --- */}
        <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-10">
          <div className="bg-white rounded-[3rem] shadow-sm border border-slate-200/50 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center gap-3 bg-slate-50/30">
              <div className="bg-slate-900 p-2 rounded-xl text-emerald-400">
                <Filter size={16} />
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">
                Search Parameters
              </h3>
            </div>

            <CardContent className="p-8 space-y-10">
              {/* Search */}
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Keyword
                </Label>
                <div className="relative group">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors"
                    size={16}
                  />
                  <Input
                    placeholder="Search medicines..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-12 h-14 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Therapeutic Category
                </Label>
                <Select
                  value={selectedCategory}
                  onValueChange={(v) => {
                    setSelectedCategory(v);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-full bg-slate-50 border-none h-14 rounded-2xl font-black text-slate-700 focus:ring-2 focus:ring-emerald-500/20">
                    <div className="flex items-center gap-2">
                      <LayoutGrid size={16} className="text-emerald-500" />
                      <SelectValue placeholder="All Categories" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                    <SelectItem value="all" className="font-bold py-3">
                      All Categories
                    </SelectItem>
                    {categories.map((cat) => (
                      <SelectItem
                        key={cat.id}
                        value={cat.name}
                        className="font-bold py-3"
                      >
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price */}
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Price Range
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, min: e.target.value })
                    }
                    className="bg-slate-50 border-none h-12 rounded-xl font-bold text-center"
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, max: e.target.value })
                    }
                    className="bg-slate-50 border-none h-12 rounded-xl font-bold text-center"
                  />
                </div>
              </div>

              {/* Stock Toggle */}
              <div
                className="flex items-center justify-between bg-slate-50 p-5 rounded-2xl border border-slate-100 cursor-pointer hover:bg-emerald-50 hover:border-emerald-100 transition-all group"
                onClick={() => setInStockOnly(!inStockOnly)}
              >
                <Label className="text-[11px] font-black text-slate-600 uppercase tracking-widest cursor-pointer group-hover:text-emerald-900 transition-colors">
                  In Stock Only
                </Label>
                <Checkbox
                  checked={inStockOnly}
                  onCheckedChange={(v) => setInStockOnly(v as boolean)}
                  className="data-[state=checked]:bg-emerald-500 rounded-md border-slate-300"
                />
              </div>

              <Button
                onClick={resetFilters}
                variant="outline"
                className="w-full rounded-[1.5rem] border-slate-200 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] py-8 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all"
              >
                Reset System Filters
              </Button>
            </CardContent>
          </div>
        </aside>

        {/* --- PRODUCT GRID --- */}
        <main className="flex-1 w-full space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 shrink-0">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] animate-pulse" />
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
                    {loading ? (
                      "Syncing Archive..."
                    ) : (
                      <>
                        Showing{" "}
                        <span className="text-slate-900">
                          {filteredMedicines.length === 0
                            ? 0
                            : indexOfFirstItem + 1}
                          {" – "}
                          {Math.min(indexOfLastItem, filteredMedicines.length)}
                        </span>{" "}
                        of{" "}
                        <span className="text-slate-900">
                          {filteredMedicines.length}
                        </span>{" "}
                        Results
                      </>
                    )}
                  </span>
                </div>

                {/* {(selectedCategory !== "all" ||
                  searchTerm ||
                  inStockOnly ||
                  priceRange.min ||
                  priceRange.max) && (
                  <div className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-slate-300" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
                        Active Parameters:
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                      {selectedCategory !== "all" && (
                        <Badge className="bg-white text-slate-900 border border-slate-200 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex gap-2 items-center shadow-sm group hover:border-emerald-200 transition-all">
                          <span className="text-emerald-500">Category:</span>{" "}
                          {selectedCategory}
                          <X
                            size={14}
                            className="cursor-pointer text-slate-400 hover:text-rose-500"
                            onClick={() => setSelectedCategory("all")}
                          />
                        </Badge>
                      )}

                      {searchTerm && (
                        <Badge className="bg-white text-slate-900 border border-slate-200 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex gap-2 items-center shadow-sm group hover:border-emerald-200 transition-all">
                          <span className="text-emerald-500">Keyword:</span>{" "}
                          {searchTerm}
                          <X
                            size={14}
                            className="cursor-pointer text-slate-400 hover:text-rose-500"
                            onClick={() => setSearchTerm("")}
                          />
                        </Badge>
                      )}

                      {(priceRange.min || priceRange.max) && (
                        <Badge className="bg-white text-slate-900 border border-slate-200 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex gap-2 items-center shadow-sm group hover:border-emerald-200 transition-all">
                          <span className="text-emerald-500">Budget:</span>
                          {priceRange.min ? `$${priceRange.min}` : "$0"}—
                          {priceRange.max ? `$${priceRange.max}` : "∞"}
                          <X
                            size={14}
                            className="cursor-pointer text-slate-400 hover:text-rose-500"
                            onClick={() => setPriceRange({ min: "", max: "" })}
                          />
                        </Badge>
                      )}

                      {inStockOnly && (
                        <Badge className="bg-emerald-500 text-white border-none px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex gap-2 items-center shadow-md">
                          In Stock
                          <X
                            size={14}
                            className="cursor-pointer text-emerald-100 hover:text-white"
                            onClick={() => setInStockOnly(false)}
                          />
                        </Badge>
                      )}

                      <button
                        onClick={resetFilters}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] text-rose-500 hover:bg-rose-50 transition-all group border border-transparent hover:border-rose-100"
                      >
                        <Trash2
                          size={12}
                          className="group-hover:rotate-12 transition-transform"
                        />
                        Clear All
                      </button>
                    </div>
                  </div>
                )} */}
              </div>

              {/* Optional Divider matching the site's clean aesthetic */}
              <div className="h-px w-full bg-slate-200/60" />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Select
                value={sortBy}
                onValueChange={(v) => setSortBy(v as SortOption)}
              >
                <SelectTrigger className="w-[200px] bg-white border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest h-12 shadow-sm">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown size={14} className="text-slate-400" />
                    <SelectValue placeholder="Sort" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl font-bold">
                  <SelectItem value="newest">Newest Arrival</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Alphabetical: A-Z</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm shrink-0">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-xl transition-all ${viewMode === "grid" ? "bg-slate-900 text-emerald-400 shadow-xl" : "text-slate-300"}`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 rounded-xl transition-all ${viewMode === "list" ? "bg-slate-900 text-emerald-400 shadow-xl" : "text-slate-300"}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* List/Grid Container */}
          {loading ? (
            <div className="min-h-[50vh] flex flex-col items-center justify-center bg-[#F1F5F9] gap-4">
              <div className="relative">
                <Loader2 className="animate-spin text-emerald-500" size={48} />
                <Activity
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-400"
                  size={20}
                />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">
                Initializing Registry...
              </p>
            </div>
          ) : currentItems.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[4rem] border border-slate-200 border-dashed">
              <PackageSearch
                className="mx-auto text-slate-100 mb-6"
                size={100}
                strokeWidth={1}
              />
              <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                Archive Empty
              </h3>
              <p className="text-slate-400 font-bold text-sm mt-2">
                No medicines found matching your query.
              </p>
              <Button
                onClick={resetFilters}
                variant="link"
                className="text-emerald-500 mt-4 font-black text-xs uppercase tracking-widest underline"
              >
                Clear all parameters
              </Button>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                  : "space-y-6"
              }
            >
              {currentItems.map((m) => (
                <MedicineCard key={m.id} medicine={m} viewMode={viewMode} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-20 flex flex-col items-center gap-6">
              <div className="flex items-center gap-3 bg-white p-3 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-2xl h-12 w-12 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <ChevronLeft size={20} />
                </Button>

                <div className="flex gap-2">
                  {getPageNumbers().map((p, i) =>
                    p === "..." ? (
                      <span
                        key={i}
                        className="px-2 text-slate-300 self-center font-black"
                      >
                        ...
                      </span>
                    ) : (
                      <Button
                        key={i}
                        onClick={() => handlePageChange(p as number)}
                        className={`h-12 w-12 rounded-2xl font-black text-xs transition-all ${
                          currentPage === p
                            ? "bg-slate-900 text-emerald-400 shadow-xl shadow-slate-300"
                            : "bg-transparent text-slate-400 hover:text-slate-900"
                        }`}
                      >
                        {p}
                      </Button>
                    ),
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded-2xl h-12 w-12 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <ChevronRight size={20} />
                </Button>
              </div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
                Page {currentPage} — {totalPages}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
