"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pill, ArrowLeft, Home, Search, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Background Decorative Element */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center space-y-12">
        {/* Diagnostic Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-slate-900 border border-slate-800 shadow-2xl shadow-emerald-500/10 animate-pulse">
            <Pill className="h-10 w-10 text-emerald-500 rotate-[135deg]" />
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-[0.3em]">
            <ShieldAlert size={12} />
            System Error: 404
          </div>
        </div>

        {/* Big Text Section */}
        <div className="space-y-4">
          <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter uppercase leading-none">
            Lost <span className="text-emerald-500">Link</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium max-w-md mx-auto leading-relaxed uppercase tracking-wider">
            The medical registry you are attempting to access has been moved,
            archived, or does not exist in our current database.
          </p>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="h-14 rounded-2xl cursor-pointer border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-white font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Previous Node
          </Button>

          <Link href="/" className="w-full">
            <Button className="w-full h-14 cursor-pointer rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-xl shadow-emerald-900/20 flex items-center gap-2">
              <Home size={16} />
              Return Home
            </Button>
          </Link>
        </div>

        {/* Quick Search Helper */}
        <div className="pt-8 flex flex-col items-center gap-4">
          <div className="h-px w-20 bg-slate-800" />
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-2">
            <Search size={12} /> Search Inventory Instead?
          </p>
          <div className="flex gap-6">
            <Link
              href="/shop"
              className="text-[10px] font-bold text-slate-400 hover:text-emerald-500 transition-colors uppercase tracking-widest"
            >
              Medicines
            </Link>
            <Link
              href="/categories"
              className="text-[10px] font-bold text-slate-400 hover:text-emerald-500 transition-colors uppercase tracking-widest"
            >
              Categories
            </Link>
            <Link
              href="/contact"
              className="text-[10px] font-bold text-slate-400 hover:text-emerald-500 transition-colors uppercase tracking-widest"
            >
              Support
            </Link>
          </div>
        </div>
      </div>

      {/* Security Status Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-slate-700" />
          <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">
            Security Layer 04
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-slate-700" />
          <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">
            Verified Dispatch
          </span>
        </div>
      </div>
    </div>
  );
}
