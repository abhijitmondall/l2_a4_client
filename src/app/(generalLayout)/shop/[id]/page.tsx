"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ShoppingCart,
  ArrowLeft,
  ShieldCheck,
  Package,
  Minus,
  Plus,
  Zap,
  Star,
  Store,
  Calendar,
  MessageSquare,
  MapPin,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Medicine } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore, useAuthStore } from "@/lib/store";
import { toast } from "@/hooks/useToast";
import api from "@/lib/api/api";
import { Spinner } from "@/components/ui/spinner";

export default function MedicineDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [medicine, setMedicine] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params.id) {
      fetchMedicine(params.id as string);
    }
  }, [params.id]);

  const fetchMedicine = async (id: string) => {
    try {
      const response = await api.medicines.getById(id);
      setMedicine(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load record",
        variant: "destructive",
      });
      router.push("/shop");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({ title: "Login required", variant: "destructive" });
      router.push("/login");
      return;
    }
    if (medicine && medicine.stock >= quantity) {
      addToCart(medicine, quantity);
      toast({
        title: "Success",
        description: "Added to dispensary cart.",
        variant: "success",
      });
    }
  };

  if (loading)
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Spinner className="h-10 w-10 text-teal-600" />
      </div>
    );
  if (!medicine) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="group text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Return to Registry
        </Button>
      </div>

      <main className="max-w-7xl mx-auto px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* LEFT: Image & Seller Info */}
          <div className="space-y-8">
            <div className="overflow-hidden rounded-[40px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="aspect-square rounded-[32px] bg-slate-50 relative flex items-center justify-center">
                {medicine.image ? (
                  <img
                    src={medicine.image}
                    alt={medicine.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[12rem] font-black text-teal-100/40">
                    {medicine.name.charAt(0)}
                  </span>
                )}
                <div className="absolute top-6 left-6">
                  <Badge className="bg-slate-900/90 text-teal-400 font-black px-4">
                    {medicine.category.name}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Seller Card */}
            <Card className="rounded-[32px] border-slate-200 bg-white overflow-hidden shadow-sm">
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <Store size={20} className="text-teal-600" />
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                    Verified Vendor
                  </h3>
                </div>
                <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 capitalize">
                  {medicine.seller?.status}
                </Badge>
              </div>
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="text-lg font-black text-slate-800 uppercase">
                    {medicine.seller?.name}
                  </p>
                  <p className="text-xs font-bold text-slate-400">
                    {medicine.seller?.email}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                  <MapPin size={14} className="text-teal-500" />
                  {medicine.seller?.address || "Registered Pharmacy Hub"}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: Details & Reviews */}
          <div className="flex flex-col space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-teal-600">
                <ShieldCheck size={18} />
                <span className="text-[11px] font-black uppercase tracking-[0.3em]">
                  Batch No: {medicine.id.slice(0, 8)}
                </span>
              </div>
              <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                {medicine.name}
              </h1>
              <div className="flex flex-wrap gap-4 items-center">
                <p className="text-sm font-bold text-slate-400">
                  MANUFACTURER:{" "}
                  <span className="text-slate-900 uppercase">
                    {medicine.manufacturer}
                  </span>
                </p>
                <div className="flex items-center gap-1.5">
                  <Package className="h-4 w-4 text-teal-500" />
                  <span className="text-[11px] font-black uppercase text-teal-600 tracking-widest">
                    {medicine.stock} Units In Stock
                  </span>
                </div>
              </div>
            </div>

            {/* Price & Cart Card */}
            <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-6">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-slate-900">
                  {formatPrice(medicine.price)}
                </span>
                <span className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                  per unit
                </span>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus size={14} />
                  </Button>
                  <span className="w-8 text-center font-black">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() =>
                      setQuantity(Math.min(medicine.stock, quantity + 1))
                    }
                  >
                    <Plus size={14} />
                  </Button>
                </div>
                <Button
                  disabled={user?.role !== "customer"}
                  className="flex-1 h-14 cursor-pointer rounded-2xl bg-teal-600 hover:bg-slate-900 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-teal-100"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart —{" "}
                  {formatPrice(medicine.price * quantity)}
                </Button>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-400 uppercase tracking-[0.2em] font-black text-[10px]">
                <Zap size={14} className="text-teal-500" /> Clinical Description
              </div>
              <p className="bg-white p-6 rounded-[24px] border border-slate-100 text-sm font-medium text-slate-600 leading-relaxed">
                {medicine.description}
              </p>
            </div>

            {/* REVIEWS SECTION */}
            <div className="space-y-6 pt-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2 text-slate-900 uppercase tracking-[0.2em] font-black text-[12px]">
                  <MessageSquare size={16} className="text-teal-500" /> Patient
                  Reviews
                </div>
                <Badge
                  variant="outline"
                  className="rounded-lg font-black text-slate-500"
                >
                  {medicine.reviews?.length || 0} Records
                </Badge>
              </div>

              <div className="space-y-4">
                {medicine.reviews && medicine.reviews.length > 0 ? (
                  medicine.reviews.map((review: any) => (
                    <div
                      key={review.id}
                      className="bg-white p-6 rounded-[24px] border border-slate-200/60 shadow-sm space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <User size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800 uppercase">
                              {review.user?.name}
                            </p>
                            <div className="flex items-center gap-1 mt-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={10}
                                  className={
                                    i < review.rating
                                      ? "fill-teal-500 text-teal-500"
                                      : "fill-slate-200 text-slate-200"
                                  }
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                          <Calendar size={10} />{" "}
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-600 pl-[52px] italic">
                        "{review.comment}"
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-12 text-slate-400 font-bold text-xs uppercase tracking-widest bg-slate-50 rounded-[24px] border border-dashed border-slate-200">
                    No Patient Reviews Yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
