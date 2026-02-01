"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  MapPin,
  Phone,
  User,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Loader2,
  Pill,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore, useAuthStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { toast } from "@/hooks/useToast";
import api from "@/lib/api/api";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const { items, getTotalPrice, clearCart } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isAuthenticated && !isLoading) router.push("/login");
    // if (items.length === 0) router.push("/cart");
  }, [isAuthenticated, items, router, isLoading]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name required";
    if (!formData.address.trim()) newErrors.address = "Valid address required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Contact number required";
    } else if (!/^\d{11}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Must be exactly 11 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const orderPayload = {
        customerId: user?.id,
        paymentMethod: "COD",
        totalAmount: getTotalPrice(),
        shippingName: formData.name,
        shippingPhone: formData.phone,
        shippingAddr: formData.address,
        items: items.map((item) => ({
          medicineId: item.medicine.id,
          sellerId: item.medicine.sellerId,
          quantity: item.quantity,
          price: item.medicine.price,
        })),
      };

      await api.orders.create(orderPayload as Order);
      clearCart();
      toast({
        title: "Order Synchronized",
        description: "Your prescription is being processed.",
        variant: "success",
      });
      router.push("/dashboard/orders");
    } catch (error: any) {
      toast({
        title: "Gateway Error",
        description:
          error.response?.data?.message || "Internal transaction failure",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  if (!isAuthenticated || items.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-20 font-sans">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 mb-12">
        <div className="max-w-6xl mx-auto px-6 py-12 flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-lg shadow-emerald-500/20">
                <ShoppingBag size={24} />
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
                Secure <span className="text-emerald-500">Checkout</span>
              </h1>
            </div>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] ml-1">
              Review your prescription & finalize delivery
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="rounded-2xl border cursor-pointer border-slate-200 text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-widest px-8 h-14"
          >
            <ArrowLeft size={16} className="mr-2" /> Cart
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT: Shipping Form */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white rounded-[3rem] shadow-sm border border-slate-200/50 overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex items-center gap-3 bg-slate-50/30">
              <div className="bg-slate-900 p-2 rounded-xl text-emerald-400">
                <MapPin size={18} />
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">
                Delivery Logistics
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="space-y-6">
                <div className="grid gap-3">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    Full Legal Name
                  </Label>
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      size={16}
                    />
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`h-14 pl-12 rounded-2xl bg-slate-50 border-none font-bold focus:ring-2 focus:ring-emerald-500/20 ${errors.name ? "ring-2 ring-red-500/20" : ""}`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-[10px] font-black text-red-500 uppercase ml-1 italic tracking-widest">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="grid gap-3">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    Contact Number (11-Digits)
                  </Label>
                  <div className="relative">
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      size={16}
                    />
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="01XXXXXXXXX"
                      className={`h-14 pl-12 rounded-2xl bg-slate-50 border-none font-bold focus:ring-2 focus:ring-emerald-500/20 ${errors.phone ? "ring-2 ring-red-500/20" : ""}`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[10px] font-black text-red-500 uppercase ml-1 italic tracking-widest">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="grid gap-3">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    Full Shipping Address
                  </Label>
                  <div className="relative">
                    <MapPin
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      size={16}
                    />
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Street, City, Building Info"
                      className={`h-14 pl-12 rounded-2xl bg-slate-50 border-none font-bold focus:ring-2 focus:ring-emerald-500/20 ${errors.address ? "ring-2 ring-red-500/20" : ""}`}
                    />
                  </div>
                  {errors.address && (
                    <p className="text-[10px] font-black text-red-500 uppercase ml-1 italic tracking-widest">
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-emerald-50 rounded-3xl p-6 flex items-start gap-4 border border-emerald-100">
                <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-emerald-900 uppercase tracking-widest">
                    Standard Express Delivery
                  </p>
                  <p className="text-xs text-emerald-700 font-medium">
                    Your items will be dispatched within 24 hours of clinical
                    review.
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-16 rounded-[1.5rem] cursor-pointer bg-slate-900 hover:bg-emerald-600 text-white font-black text-[12px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-200"
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" size={20} />
                ) : (
                  <ShieldCheck className="mr-2" size={20} />
                )}
                Confirm Order & Dispatch
              </Button>
            </form>
          </div>
        </div>

        {/* RIGHT: Summary Sidebar */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-[80px] group-hover:bg-emerald-500/30 transition-all duration-700" />

            <div className="relative z-10 space-y-10">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-400">
                Prescription Summary
              </h3>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                {items.map((item) => (
                  <div
                    key={item.medicine.id}
                    className="flex justify-between items-center group/item"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-colors">
                        <Pill size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-black">
                          {item.medicine.name}
                        </p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-sm">
                      {formatPrice(item.medicine.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-5 border-t border-white/10 pt-8">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                    Logistics Fee
                  </span>
                  <span className="font-black text-emerald-400 text-xs">
                    FREE
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest mb-1">
                      Total Payable
                    </p>
                    <p className="text-5xl font-black tracking-tighter">
                      {formatPrice(getTotalPrice())}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Details */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/50 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                <CreditCard size={18} />
              </div>
              <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                Payment Protocol
              </h4>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-black text-slate-900">
                CASH ON DELIVERY (COD)
              </p>
              <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                Payment is only required upon physical arrival and inspection of
                items.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 opacity-30 grayscale">
            <AlertCircle size={14} />
            <p className="text-[9px] font-black uppercase tracking-widest">
              Encrypted Medical Transaction
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
