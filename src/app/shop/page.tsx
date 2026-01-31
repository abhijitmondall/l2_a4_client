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
          title: "Error",
          description: "Failed to load shop data",
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
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="max-w-[1400px] mx-auto px-6 pt-12">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Dispensary
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Quality healthcare products delivered to your door.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* --- SIDEBAR --- */}
          <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-24 lg:mt-3">
            <Card className="border-slate-200 shadow-sm rounded-[24px] overflow-hidden bg-white">
              <div className="bg-slate-50/50 border-b border-slate-100 p-6">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-widest">
                  <Filter size={16} className="text-teal-600" /> Filters
                </h3>
              </div>

              <CardContent className="p-6 space-y-8">
                <div className="space-y-3">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    Search
                  </Label>
                  <div className="relative group">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors"
                      size={16}
                    />
                    <Input
                      placeholder="Keyword..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pl-10 h-11 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    Category
                  </Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(v) => {
                      setSelectedCategory(v);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-full bg-slate-50 border-none h-11 rounded-xl font-semibold text-slate-700">
                      <div className="flex items-center gap-2">
                        <LayoutGrid size={14} className="text-teal-600" />
                        <SelectValue placeholder="All Categories" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    Price Range ($)
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Min"
                      type="number"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, min: e.target.value })
                      }
                      className="bg-slate-50 border-none h-10 rounded-lg text-sm px-3"
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, max: e.target.value })
                      }
                      className="bg-slate-50 border-none h-10 rounded-lg text-sm px-3"
                    />
                  </div>
                </div>

                <div
                  className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => setInStockOnly(!inStockOnly)}
                >
                  <Label
                    htmlFor="stock"
                    className="text-sm font-bold text-slate-700 cursor-pointer"
                  >
                    In Stock Only
                  </Label>
                  <Checkbox
                    id="stock"
                    checked={inStockOnly}
                    onCheckedChange={(v) => setInStockOnly(v as boolean)}
                    className="data-[state=checked]:bg-teal-600 rounded-md"
                  />
                </div>

                <Button
                  onClick={resetFilters}
                  variant="outline"
                  className="w-full rounded-xl border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-widest py-6 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all"
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* --- MAIN CONTENT --- */}
          <main className="flex-1 w-full">
            {(selectedCategory !== "all" ||
              searchTerm ||
              inStockOnly ||
              priceRange.min ||
              priceRange.max) && (
              <div className="flex items-center flex-wrap gap-3 mb-6 animate-in fade-in slide-in-from-top-2">
                <span className="text-sm font-bold text-slate-400">
                  Active filters:
                </span>

                {selectedCategory !== "all" && (
                  <Badge className="bg-teal-50 text-teal-700 border-teal-100 px-3 py-1.5 rounded-lg flex gap-2 items-center">
                    Category: {selectedCategory}
                    <X
                      size={14}
                      className="cursor-pointer hover:text-teal-900"
                      onClick={() => setSelectedCategory("all")}
                    />
                  </Badge>
                )}

                {searchTerm && (
                  <Badge className="bg-teal-50 text-teal-700 border-teal-100 px-3 py-1.5 rounded-lg flex gap-2 items-center">
                    Search: {searchTerm}
                    <X
                      size={14}
                      className="cursor-pointer hover:text-teal-900"
                      onClick={() => setSearchTerm("")}
                    />
                  </Badge>
                )}

                {(priceRange.min || priceRange.max) && (
                  <Badge className="bg-teal-50 text-teal-700 border-teal-100 px-3 py-1.5 rounded-lg flex gap-2 items-center">
                    Price: {priceRange.min ? `$${priceRange.min}` : "$0"} —{" "}
                    {priceRange.max ? `$${priceRange.max}` : "Any"}
                    <X
                      size={14}
                      className="cursor-pointer hover:text-teal-900"
                      onClick={() => setPriceRange({ min: "", max: "" })}
                    />
                  </Badge>
                )}

                {inStockOnly && (
                  <Badge className="bg-teal-50 text-teal-700 border-teal-100 px-3 py-1.5 rounded-lg flex gap-2 items-center">
                    In Stock Only
                    <X
                      size={14}
                      className="cursor-pointer hover:text-teal-900"
                      onClick={() => setInStockOnly(false)}
                    />
                  </Badge>
                )}

                <button
                  onClick={resetFilters}
                  className="text-sm font-bold text-teal-600 hover:text-teal-700 underline underline-offset-4 ml-2"
                >
                  Clear all
                </button>
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div className="text-slate-500 font-medium">
                Showing
                <span className="text-slate-900 font-bold">
                  {filteredMedicines.length > 0 ? indexOfFirstItem + 1 : 0}-
                  {Math.min(indexOfLastItem, filteredMedicines.length)}
                </span>
                of
                <span className="text-slate-900 font-bold">
                  {filteredMedicines.length}
                </span>{" "}
                medicines
              </div>

              <div className="flex items-center gap-3">
                <Select
                  value={sortBy}
                  onValueChange={(v) => setSortBy(v as SortOption)}
                >
                  <SelectTrigger className="w-[180px] bg-white border-slate-200 rounded-xl font-bold h-10 shadow-sm">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="newest">Newest Arrival</SelectItem>
                    <SelectItem value="price-asc">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-desc">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="name-asc">Name: A-Z</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-slate-100 text-teal-600 shadow-inner" : "text-slate-400"}`}
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-slate-100 text-teal-600 shadow-inner" : "text-slate-400"}`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Display */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-[380px] bg-slate-100 rounded-[32px] animate-pulse"
                  />
                ))}
              </div>
            ) : currentItems.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-[32px] border-2 border-dashed border-slate-100">
                <PackageSearch
                  className="mx-auto text-slate-200 mb-4"
                  size={64}
                  strokeWidth={1.5}
                />
                <h3 className="text-xl font-bold text-slate-900">
                  No results found
                </h3>
                <p className="text-slate-400">
                  Adjust your search or filters to find what you're looking for.
                </p>
                <Button
                  onClick={resetFilters}
                  variant="link"
                  className="text-teal-600 mt-2"
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {currentItems.map((m) => (
                  <MedicineCard key={m.id} medicine={m} viewMode={viewMode} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex flex-col items-center gap-4">
                <div className="flex items-center gap-1.5 bg-white p-2 rounded-[22px] border border-slate-200 shadow-sm">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded-xl h-10 w-10"
                  >
                    <ChevronLeft size={18} />
                  </Button>
                  <div className="flex gap-1">
                    {getPageNumbers().map((p, i) =>
                      p === "..." ? (
                        <span
                          key={i}
                          className="px-2 text-slate-400 self-center"
                        >
                          ...
                        </span>
                      ) : (
                        <Button
                          key={i}
                          variant={currentPage === p ? "default" : "ghost"}
                          onClick={() => handlePageChange(p as number)}
                          className={`h-10 w-10 rounded-xl font-bold text-sm transition-all ${
                            currentPage === p
                              ? "bg-teal-600 text-white shadow-md shadow-teal-100"
                              : "text-slate-500 hover:bg-slate-50"
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
                    className="rounded-xl h-10 w-10"
                  >
                    <ChevronRight size={18} />
                  </Button>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Page {currentPage} of {totalPages}
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
