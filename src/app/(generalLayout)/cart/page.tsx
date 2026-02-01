"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  Pill,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore, useAuthStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const { items, removeFromCart, updateQuantity, getTotalPrice } =
    useCartStore();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) router.push("/login");
  }, [isAuthenticated, router, isLoading]);

  if (!isAuthenticated) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-16 rounded-[4rem] shadow-sm border border-slate-200 flex flex-col items-center gap-6 max-w-lg">
          <div className="bg-slate-50 p-8 rounded-[2.5rem] text-slate-200">
            <ShoppingBag size={80} strokeWidth={1} />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
              Cart is Empty
            </h2>
            <p className="text-slate-400 font-bold text-sm">
              Your medical archive is currently waiting for prescriptions.
            </p>
          </div>
          <Link href="/shop" className="w-full">
            <Button className="w-full h-16 rounded-2xl cursor-pointer bg-slate-900 hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all">
              Browse Medicines
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-20 font-sans">
      {/* --- HEADER --- */}
      <div className="bg-white border-b border-slate-200 mb-12">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-lg shadow-emerald-500/20">
                <ShoppingBag size={24} />
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
                My <span className="text-emerald-500">Cart</span>
              </h1>
            </div>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] ml-1">
              {items.length} Medical Items Ready for Review
            </p>
          </div>
          <Link href="/shop">
            <Button
              variant="ghost"
              className="rounded-2xl border cursor-pointer border-slate-200 text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-widest px-8 h-14"
            >
              <ArrowLeft size={16} className="mr-2" /> Continue Shopping
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* --- LEFT: CART ITEMS --- */}
        <div className="lg:col-span-7 space-y-6">
          {items.map((item) => (
            <div
              key={item.medicine.id}
              className="bg-white rounded-[2.5rem] p-8 border border-slate-200/50 shadow-sm flex items-center gap-6 group hover:border-emerald-200 transition-all duration-300"
            >
              {/* Image Block */}
              <div className="h-28 w-28 rounded-3xl overflow-hidden bg-slate-100 shrink-0 relative">
                {item.medicine.image ? (
                  <img
                    src={item.medicine.image}
                    alt={item.medicine.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-300">
                    <Pill size={32} />
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <Badge className="bg-white/90 backdrop-blur-md text-slate-900 text-[9px] font-black border-none px-2 py-0.5">
                    MED
                  </Badge>
                </div>
              </div>

              {/* Details Block */}
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-slate-900 text-xl tracking-tight leading-none">
                      {item.medicine.name}
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">
                      {item.medicine.category.name}
                    </p>
                  </div>
                  <p className="font-black text-slate-900 text-lg">
                    {formatPrice(item.medicine.price)}
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  {/* Modern Quantity Selector */}
                  <div className="flex items-center bg-slate-50 rounded-2xl p-1 border border-slate-100">
                    <button
                      onClick={() =>
                        updateQuantity(item.medicine.id, item.quantity - 1)
                      }
                      className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center text-[12px] font-black text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.medicine.id, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.medicine.stock}
                      className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-colors disabled:opacity-20"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.medicine.id)}
                    className="h-12 w-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- RIGHT: ORDER SUMMARY --- */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-[80px] group-hover:bg-emerald-500/30 transition-all duration-700" />

            <div className="relative z-10 space-y-10">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-400">
                Financial Summary
              </h3>

              <div className="space-y-5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                    Cart Subtotal
                  </span>
                  <span className="font-black text-lg">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                    Clinical Handling
                  </span>
                  <span className="font-black text-lg text-emerald-400">
                    FREE
                  </span>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest mb-1">
                    Total Payable
                  </p>
                  <p className="text-5xl font-black tracking-tighter">
                    {formatPrice(getTotalPrice())}
                  </p>
                </div>
              </div>

              <Link href="/checkout" className="block">
                <Button className="w-full h-16 cursor-pointer rounded-[1.5rem] bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[12px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-emerald-500/20 group/btn">
                  Proceed to Checkout{" "}
                  <ChevronRight
                    className="ml-2 group-hover/btn:translate-x-1 transition-transform"
                    size={18}
                  />
                </Button>
              </Link>
            </div>
          </div>

          {/* Trust Factors */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/50 space-y-6">
            <div className="flex items-start gap-4">
              <ShieldCheck className="text-emerald-500 shrink-0" size={24} />
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                  Encrypted Transaction
                </h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Safety protocols active. Payments are processed via secure
                  medical gateways.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 border-t border-slate-50 pt-6">
              <AlertCircle className="text-blue-500 shrink-0" size={24} />
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                  Clinical Review
                </h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  All prescriptions undergo pharmacist verification before
                  dispatch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
