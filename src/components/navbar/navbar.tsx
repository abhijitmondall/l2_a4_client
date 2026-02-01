"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCart,
  User,
  LogOut,
  Package,
  Menu,
  X,
  Pill,
  Search,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { api } from "@/lib/api/api";
import { Medicine } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore, useCartStore } from "@/lib/store";

function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        try {
          const data = await api.medicines.getAll({ search: query, limit: 5 });
          setResults(data || []);
          setIsOpen(true);
        } catch (err) {
          console.error("Search error:", err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="relative w-full max-w-sm" ref={searchRef}>
      <div className="relative group">
        <Search
          className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${isLoading ? "text-emerald-500" : "text-slate-400 group-focus-within:text-emerald-500"}`}
        />
        <Input
          type="text"
          placeholder="Search medicines..."
          className="w-full pl-10 pr-10 h-10 bg-slate-100/50 border-transparent focus:bg-white focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 rounded-2xl transition-all text-sm font-medium"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin text-emerald-500" />
            ) : (
              <X className="h-4 w-4 text-slate-400" />
            )}
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden z-[110] animate-in fade-in slide-in-from-top-2">
          <div className="p-2">
            <p className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Results
            </p>
            {results.length > 0 ? (
              <div className="space-y-1">
                {results.map((med) => (
                  <Link
                    key={med.id}
                    href={`/shop/${med.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-emerald-50 group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-white transition-colors">
                        <Pill className="h-4 w-4 text-slate-400 group-hover:text-emerald-500" />
                      </div>
                      <span className="text-sm font-bold text-slate-900">
                        {med.name}
                      </span>
                    </div>
                    <span className="text-xs font-black text-slate-600">
                      ${med.price}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-500">
                No medications found.
              </div>
            )}
            {results.length > 0 && (
              <Link
                href={`/medicines?search=${query}`}
                className="flex items-center justify-center gap-2 p-2 mt-2 bg-slate-900 rounded-lg text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                View All <ArrowRight size={12} />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Main Navbar Component ---
export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/categories", label: "Categories" },
    { href: "/shop", label: "Pharmacy" },
    user && { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav
      className={`sticky top-0 z-[100] w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/50 py-2 shadow-sm"
          : "bg-white py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 group-hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/10">
            <Pill className="h-5 w-5 text-white rotate-45" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900">
            Medi<span className="text-emerald-500">Store</span>
          </span>
        </Link>

        {/* Desktop Navigation & Search */}
        <div className="hidden lg:flex items-center gap-12 flex-1">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link?.href;
              return (
                <Link
                  key={link?.href || "undefined"}
                  href={link?.href || ""}
                  className={`relative flex flex-col items-center text-xs font-black uppercase tracking-[0.2em] transition-colors hover:text-emerald-600 ${
                    isActive ? "text-emerald-600" : "text-slate-400"
                  }`}
                >
                  {link?.label}
                  {/* The Active Dot */}
                  <span
                    className={`absolute -bottom-1.5 left-px h-1 w-1 rounded-full bg-emerald-500 transition-all duration-300 ${
                      isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
                    }`}
                  />
                </Link>
              );
            })}
          </div>
          <GlobalSearch />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-1.5 bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50">
              {user?.role === "customer" && (
                <Link href="/cart">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative cursor-pointer rounded-xl hover:bg-white text-slate-600"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {getTotalItems() > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-500 text-[10px] font-bold text-white shadow-md">
                        {getTotalItems()}
                      </span>
                    )}
                  </Button>
                </Link>
              )}
              {user?.role === "seller" && (
                <Link href="/seller-dashboard">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl cursor-pointer hover:bg-white"
                  >
                    <Package className="h-5 w-5 text-slate-600" />
                  </Button>
                </Link>
              )}
              <Link href="/profile">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl cursor-pointer hover:bg-white"
                >
                  <User className="h-5 w-5 text-slate-600" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="rounded-xl cursor-pointer hover:bg-rose-50 hover:text-rose-500"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="hidden sm:block">
                <Button
                  variant="ghost"
                  className="text-xs font-black cursor-pointer uppercase tracking-widest text-slate-500 hover:text-emerald-600 rounded-xl px-5"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-slate-900 cursor-pointer hover:bg-emerald-600 text-white font-bold h-10 px-6 rounded-xl transition-all shadow-xl shadow-slate-200">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden cursor-pointer rounded-xl bg-slate-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-slate-100 p-6 lg:hidden animate-in slide-in-from-top-4">
          <div className="space-y-6">
            <GlobalSearch />
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link?.href || "undefined"}
                  href={link?.href || ""}
                  className="text-lg font-black tracking-tight text-slate-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link?.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
