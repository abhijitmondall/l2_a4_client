"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X, Grid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Medicine, Category } from "@/types";

import { Spinner } from "@/components/ui/spinner";
import { MedicineCard } from "@/components/ui/medicineCard";
import { toast } from "@/hooks/useToast";
import api from "@/lib/api/api";

type SortOption =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "oldest";
type ViewMode = "grid" | "list";

export default function ShopPage() {
  // State management
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Fetch data on mount
  useEffect(() => {
    fetchMedicines();
    fetchCategories();
  }, []);

  // Apply filters and sorting whenever dependencies change
  useEffect(() => {
    applyFiltersAndSort();
  }, [
    medicines,
    searchTerm,
    selectedCategory,
    priceRange,
    inStockOnly,
    sortBy,
  ]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, priceRange, inStockOnly, sortBy]);

  const fetchMedicines = async () => {
    try {
      const response = await api.medicines.getAll();
      console.log(response);
      setMedicines(response);
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to load medicines",
        variant: "destructive",
      });
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.medicines.getCategories();
      setCategories(response);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...medicines];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (medicine) =>
          medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          medicine.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          medicine.manufacturer
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(
        (medicine) => medicine.category.name === selectedCategory,
      );
    }

    // Apply price range filter
    if (priceRange.min) {
      filtered = filtered.filter(
        (medicine) => medicine.price >= parseFloat(priceRange.min),
      );
    }
    if (priceRange.max) {
      filtered = filtered.filter(
        (medicine) => medicine.price <= parseFloat(priceRange.max),
      );
    }

    // Apply in-stock filter
    if (inStockOnly) {
      filtered = filtered.filter((medicine) => medicine.stock > 0);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

    setFilteredMedicines(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setPriceRange({ min: "", max: "" });
    setInStockOnly(false);
    setSortBy("newest");
  };

  const hasActiveFilters = () => {
    return (
      searchTerm ||
      selectedCategory ||
      priceRange.min ||
      priceRange.max ||
      inStockOnly
    );
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMedicines.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // if (loading) {
  //   return <Spinner />;
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Shop Medicines
          </h1>
          <p className="text-gray-600">
            Browse our wide selection of {medicines.length} certified medicines
          </p>
        </div>

        {/* Search and Controls Bar */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search medicines, categories, manufacturers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Filter Toggle Button */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="h-5 w-5" />
              Filters
              {hasActiveFilters() && (
                <span className="ml-1 rounded-full bg-teal-600 px-2 py-0.5 text-xs text-white">
                  Active
                </span>
              )}
            </Button>

            {/* View Mode Toggle */}
            <div className="flex gap-1 rounded-md border p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded p-2 ${
                  viewMode === "grid"
                    ? "bg-teal-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`rounded p-2 ${
                  viewMode === "list"
                    ? "bg-teal-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters() && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Active filters:
              </span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-3 py-1 text-sm text-teal-700">
                  Search: {searchTerm}
                  <button onClick={() => setSearchTerm("")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-3 py-1 text-sm text-teal-700">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory("")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {priceRange.min && (
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-3 py-1 text-sm text-teal-700">
                  Min: ${priceRange.min}
                  <button
                    onClick={() => setPriceRange({ ...priceRange, min: "" })}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {priceRange.max && (
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-3 py-1 text-sm text-teal-700">
                  Max: ${priceRange.max}
                  <button
                    onClick={() => setPriceRange({ ...priceRange, max: "" })}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-3 py-1 text-sm text-teal-700">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-teal-600 hover:text-teal-700 hover:underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar Filters */}
          {showFilters && (
            <aside className="w-full lg:w-64">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Filters</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="lg:hidden"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Category Filter */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Price Range
                      </label>
                      <div className="space-y-2">
                        <Input
                          type="number"
                          placeholder="Min ($)"
                          value={priceRange.min}
                          onChange={(e) =>
                            setPriceRange({
                              ...priceRange,
                              min: e.target.value,
                            })
                          }
                          min="0"
                          step="0.01"
                        />
                        <Input
                          type="number"
                          placeholder="Max ($)"
                          value={priceRange.max}
                          onChange={(e) =>
                            setPriceRange({
                              ...priceRange,
                              max: e.target.value,
                            })
                          }
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    {/* Stock Filter */}
                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={inStockOnly}
                          onChange={(e) => setInStockOnly(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                        />
                        <span className="text-sm text-gray-700">
                          In Stock Only
                        </span>
                      </label>
                    </div>

                    {/* Clear Filters */}
                    {hasActiveFilters() && (
                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="w-full"
                      >
                        Clear All Filters
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </aside>
          )}

          {/* Main Content */}
          <main className="flex-1">
            {loading ? (
              <div className="mt-12 flex justify-center">
                <Spinner />
              </div>
            ) : (
              <>
                {/* Results Header */}
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="text-sm text-gray-600">
                    Showing {currentItems.length > 0 ? indexOfFirstItem + 1 : 0}
                    -{Math.min(indexOfLastItem, filteredMedicines.length)} of{" "}
                    {filteredMedicines.length} medicines
                  </div>

                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Sort by:
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="name-asc">Name (A-Z)</option>
                      <option value="name-desc">Name (Z-A)</option>
                      <option value="price-asc">Price (Low to High)</option>
                      <option value="price-desc">Price (High to Low)</option>
                    </select>
                  </div>
                </div>

                {/* Medicine Grid/List */}
                {currentItems.length === 0 ? (
                  <Card className="p-12">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                        <Search className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-gray-900">
                        No medicines found
                      </h3>
                      <p className="mb-4 text-gray-600">
                        Try adjusting your search or filters to find what you're
                        looking for.
                      </p>
                      {hasActiveFilters() && (
                        <Button onClick={clearFilters}>
                          Clear All Filters
                        </Button>
                      )}
                    </div>
                  </Card>
                ) : (
                  <>
                    <div
                      className={
                        viewMode === "grid"
                          ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                          : "space-y-4"
                      }
                    >
                      {currentItems?.map((medicine) => (
                        <MedicineCard
                          key={medicine.id}
                          medicine={medicine}
                          viewMode={viewMode}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-8 flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>

                        <div className="flex gap-1">
                          {/* First page */}
                          {currentPage > 3 && (
                            <>
                              <Button
                                variant={
                                  currentPage === 1 ? "default" : "outline"
                                }
                                onClick={() => paginate(1)}
                              >
                                1
                              </Button>
                              {currentPage > 4 && (
                                <span className="flex items-center px-2">
                                  ...
                                </span>
                              )}
                            </>
                          )}

                          {/* Pages around current */}
                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(
                              (page) =>
                                page === currentPage ||
                                page === currentPage - 1 ||
                                page === currentPage + 1 ||
                                page === currentPage - 2 ||
                                page === currentPage + 2,
                            )
                            .map((page) => (
                              <Button
                                key={page}
                                variant={
                                  currentPage === page ? "default" : "outline"
                                }
                                onClick={() => paginate(page)}
                              >
                                {page}
                              </Button>
                            ))}

                          {/* Last page */}
                          {currentPage < totalPages - 2 && (
                            <>
                              {currentPage < totalPages - 3 && (
                                <span className="flex items-center px-2">
                                  ...
                                </span>
                              )}
                              <Button
                                variant={
                                  currentPage === totalPages
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => paginate(totalPages)}
                              >
                                {totalPages}
                              </Button>
                            </>
                          )}
                        </div>

                        <Button
                          variant="outline"
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
