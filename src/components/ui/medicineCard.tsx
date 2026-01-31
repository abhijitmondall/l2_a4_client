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
    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight border shadow-sm ${
      stock > 0
        ? "bg-white/90 text-emerald-600 border-emerald-100 backdrop-blur-sm"
        : "bg-white/90 text-rose-600 border-rose-100 backdrop-blur-sm"
    }`}
  >
    <div
      className={`h-1.5 w-1.5 rounded-full ${stock > 0 ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}
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
      <Card className="group relative flex flex-col h-full border-slate-200 bg-white rounded-[24px] overflow-hidden transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1">
        <div className="relative aspect-square overflow-hidden bg-slate-50 border-b border-slate-50">
          <Link href={`/shop/${medicine.id}`} className="block h-full">
            {medicine.image ? (
              <img
                src={medicine.image}
                alt={medicine.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-50 to-emerald-50/30">
                <span className="text-5xl font-black text-teal-100 group-hover:scale-110 transition-transform duration-500">
                  {medicine.name.charAt(0)}
                </span>
              </div>
            )}
          </Link>

          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <Badge className="bg-teal-600/90 backdrop-blur-sm text-white border-none shadow-sm text-[10px] h-5 px-2 font-bold uppercase tracking-tighter">
              {medicine.category.name}
            </Badge>
          </div>

          <div className="absolute bottom-3 right-3">
            <StockStatus stock={medicine.stock} />
          </div>

          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <div className="bg-white p-2 rounded-full shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform">
              <Eye size={20} className="text-teal-600" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="p-5 flex flex-col flex-1">
          <div className="mb-4">
            <div className="flex justify-between items-start gap-2 mb-1">
              <Link href={`/shop/${medicine.id}`} className="flex-1">
                <h3 className="font-bold text-slate-800 text-[16px] leading-tight group-hover:text-teal-600 transition-colors line-clamp-1">
                  {medicine.name}
                </h3>
              </Link>
              <span className="font-black text-teal-600 text-lg leading-tight">
                {formatPrice(medicine.price)}
              </span>
            </div>

            <div className="flex items-center gap-1 text-slate-400 mb-2">
              <ShieldCheck size={12} className="text-teal-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Certified Pharmacy
              </span>
            </div>

            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed h-8">
              {medicine.description}
            </p>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={medicine.stock === 0}
            className={`w-full cursor-pointer h-10 rounded-xl font-bold text-sm transition-all ${
              medicine.stock === 0
                ? "bg-slate-100 text-slate-400"
                : "bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-100 active:scale-95"
            }`}
          >
            {medicine.stock === 0 ? (
              "Unavailable"
            ) : (
              <span className="flex items-center gap-2">
                <ShoppingCart size={16} />
                Add to Cart
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  {
    /* List View */
  }
  return (
    <Card className="group border-slate-200 bg-white rounded-[20px] overflow-hidden transition-all hover:shadow-md">
      <div className="flex p-3 gap-5 items-center">
        <Link href={`/shop/${medicine.id}`} className="w-32 shrink-0">
          <div className="aspect-square rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
            {medicine.image ? (
              <img
                src={medicine.image}
                alt={medicine.name}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-teal-50 text-xl font-bold text-teal-200">
                {medicine.name.charAt(0)}
              </div>
            )}
          </div>
        </Link>

        <div className="flex flex-1 items-center justify-between pr-4">
          <div className="space-y-1">
            <Link href={`/shop/${medicine.id}`}>
              <h3 className="text-lg font-bold text-slate-800 hover:text-teal-600 transition-colors tracking-tight">
                {medicine.name}
              </h3>
            </Link>
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className="bg-slate-100 text-slate-500 border-none font-bold text-[9px] h-4 uppercase"
              >
                {medicine.category.name}
              </Badge>
              <StockStatus stock={medicine.stock} />
            </div>
            <p className="text-xs text-slate-400 line-clamp-1 max-w-sm">
              {medicine.description}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-xl font-black text-teal-600">
              {formatPrice(medicine.price)}
            </span>
            <Button
              onClick={handleAddToCart}
              disabled={medicine.stock === 0}
              size="sm"
              className="h-9 px-5 cursor-pointer rounded-lg font-bold bg-teal-600 hover:bg-teal-700"
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
