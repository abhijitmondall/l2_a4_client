"use client";

import Link from "next/link";
import { ShoppingCart, Eye, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Medicine } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore, useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/useToast";

interface MedicineCardProps {
  medicine: Medicine;
  viewMode?: "grid" | "list";
}

const StockStatus = ({ stock }: { stock: number }) => (
  <div
    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border shadow-sm backdrop-blur-md ${
      stock > 0
        ? "bg-white/80 text-teal-600 border-teal-100"
        : "bg-white/80 text-rose-600 border-rose-100"
    }`}
  >
    <div
      className={`h-1.5 w-1.5 rounded-full ${
        stock > 0 ? "bg-teal-500 animate-pulse" : "bg-rose-500"
      }`}
    />
    {stock > 0 ? `${stock} In Stock` : "Out of Stock"}
  </div>
);

export function MedicineCard({
  medicine,
  viewMode = "grid",
}: MedicineCardProps) {
  const { addToCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to add items to cart",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    if (user?.role !== "customer") {
      toast({
        title: "Access denied",
        description: "Only customers can shop",
        variant: "destructive",
      });
      return;
    }

    if (medicine.stock > 0) {
      addToCart(medicine, 1);
      toast({
        title: "Added to cart",
        description: `${medicine.name} added successfully!`,
        variant: "success",
      });
    }
  };

  if (viewMode === "grid") {
    return (
      <Card className="group relative flex flex-col h-full border-slate-200 bg-white rounded-[24px] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1.5">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-slate-50 border-b border-slate-50">
          <Link href={`/shop/${medicine.id}`} className="block h-full">
            {medicine.image ? (
              <img
                src={medicine.image}
                alt={medicine.name}
                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-50 to-slate-50">
                <span className="text-6xl font-black text-teal-100/50 group-hover:scale-110 transition-transform duration-700">
                  {medicine.name.charAt(0)}
                </span>
              </div>
            )}
          </Link>

          {/* Floating Badges */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-slate-900/90 backdrop-blur-md text-teal-400 border-none shadow-lg text-[9px] h-6 px-3 font-black uppercase tracking-[0.1em]">
              {medicine.category.name}
            </Badge>
          </div>

          <div className="absolute bottom-4 right-4">
            <StockStatus stock={medicine.stock} />
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-teal-900/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <div className="bg-white p-3 rounded-full shadow-2xl translate-y-8 group-hover:translate-y-0 transition-all duration-500">
              <Eye size={22} className="text-teal-600" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="p-6 flex flex-col flex-1">
          <div className="mb-5">
            <div className="flex justify-between items-start gap-3 mb-2">
              <Link href={`/shop/${medicine.id}`} className="flex-1">
                <h3 className="font-black text-slate-800 text-[17px] leading-tight group-hover:text-teal-600 transition-colors line-clamp-1 uppercase tracking-tight">
                  {medicine.name}
                </h3>
              </Link>
              <span className="font-black text-teal-600 text-xl leading-none">
                {formatPrice(medicine.price)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400 mb-3">
              <ShieldCheck size={14} className="text-teal-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em]">
                Certified Archive
              </span>
            </div>

            <p className="text-xs font-medium text-slate-500 line-clamp-2 leading-relaxed h-8">
              {medicine.description}
            </p>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={medicine.stock === 0 || user?.role === "admin"}
            className={`w-full cursor-pointer h-12 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
              medicine.stock === 0
                ? "bg-slate-100 text-slate-400"
                : "bg-teal-600 hover:bg-slate-900 text-white shadow-lg shadow-teal-100 hover:shadow-slate-200 active:scale-95"
            }`}
          >
            {medicine.stock === 0 ? (
              "Out of Reach"
            ) : (
              <span className="flex items-center gap-2">
                <ShoppingCart size={16} strokeWidth={2.5} />
                Add to Cart
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  /* --- List View Design --- */
  return (
    <Card className="group border-slate-200 bg-white rounded-[28px] overflow-hidden transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:border-teal-100">
      <div className="flex p-4 gap-6 items-center">
        <Link href={`/shop/${medicine.id}`} className="w-40 shrink-0">
          <div className="aspect-square rounded-[20px] overflow-hidden bg-slate-50 border border-slate-100 relative">
            {medicine.image ? (
              <img
                src={medicine.image}
                alt={medicine.name}
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-teal-50/50 text-2xl font-black text-teal-200">
                {medicine.name.charAt(0)}
              </div>
            )}
          </div>
        </Link>

        <div className="flex flex-1 items-center justify-between pr-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[9px] h-5 px-2 uppercase tracking-tighter">
                {medicine.category.name}
              </Badge>
              <StockStatus stock={medicine.stock} />
            </div>

            <Link href={`/shop/${medicine.id}`}>
              <h3 className="text-xl font-black text-slate-800 hover:text-teal-600 transition-colors tracking-tight uppercase">
                {medicine.name}
              </h3>
            </Link>

            <div className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck size={12} className="text-teal-500" />
              <span className="text-[9px] font-black uppercase tracking-widest">
                Authenticated Pharma Product
              </span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">
                Unit Price
              </p>
              <span className="text-2xl font-black text-teal-600">
                {formatPrice(medicine.price)}
              </span>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={medicine.stock === 0}
              className={`h-14 px-8 cursor-pointer rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                medicine.stock === 0
                  ? "bg-slate-100 text-slate-400"
                  : "bg-teal-600 hover:bg-slate-900 text-white shadow-xl shadow-teal-50"
              }`}
            >
              <ShoppingCart size={18} className="mr-2" strokeWidth={2.5} />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
