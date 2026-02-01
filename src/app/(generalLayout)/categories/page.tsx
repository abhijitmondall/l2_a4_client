"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Pill,
  Loader2,
  Stethoscope,
  ShieldPlus,
  ArrowRight,
  Dna,
  Microscope,
  Activity,
  ChevronRight,
} from "lucide-react";
import { api } from "@/lib/api/api";
import { Category } from "@/types";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function CategoryArchivePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.medicines.getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [categories, searchQuery]);

  const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("antibiotic")) return <Microscope size={28} />;
    if (n.includes("cardio")) return <Stethoscope size={28} />;
    if (n.includes("supplements") || n.includes("vitamin"))
      return <ShieldPlus size={28} />;
    if (n.includes("genetics")) return <Dna size={28} />;
    return <Pill size={28} />;
  };

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#F1F5F9] gap-4">
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
    );

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans pb-20">
      {/* --- TOP HEADER SECTION --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <span>Catalogue</span>
                <ChevronRight size={12} />
                <span className="text-emerald-500">
                  Classification Registry
                </span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">
                Medical <span className="text-emerald-500">Categories</span>
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative group w-full md:w-80">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"
                  size={18}
                />
                <input
                  placeholder="Filter by classification..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-bold transition-all"
                />
              </div>
              <Badge className="bg-slate-900 h-14 px-6 rounded-2xl text-xs font-black flex items-center gap-2">
                <span className="text-emerald-400">
                  {filteredCategories.length}
                </span>{" "}
                UNITS
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN GRID --- */}
      <main className="max-w-7xl mx-auto px-6 mt-12">
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <Link
                key={category.id}
                href={`/medicines?categoryId=${category.id}`}
                className="group relative bg-white rounded-[2.5rem] border border-slate-200/60 p-8 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2 overflow-hidden flex flex-col h-full"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-all duration-700 group-hover:rotate-12 group-hover:scale-150">
                  {getCategoryIcon(category.name)}
                </div>

                <div className="relative z-10 space-y-6 flex-1">
                  <div className="h-16 w-16 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-400 transition-all duration-500">
                    {getCategoryIcon(category.name)}
                  </div>

                  <div>
                    <h3 className="text-2xl font-black tracking-tight text-slate-900 mb-2 uppercase italic leading-none">
                      {category.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider leading-relaxed">
                      {category.description ||
                        "Classified pharmaceutical archives for clinical distribution."}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Inventory
                    </span>
                    <span className="text-xs font-black text-slate-900">
                      VERIFIED
                    </span>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center space-y-6">
            <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100">
              <Search size={64} className="text-slate-100" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 uppercase">
                Archive Mismatch
              </h3>
              <p className="text-sm text-slate-400 font-medium max-w-xs">
                No medical classifications match your current filter parameters.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 px-8 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-500 transition-all"
              >
                Reset Search
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Fixed Status Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-4 z-40">
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <p className="text-[9px] font-black text-white uppercase tracking-[0.3em]">
          System Status: Global Pharmaceutical Index Online
        </p>
      </div>
    </div>
  );
}
