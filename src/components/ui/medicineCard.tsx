"use client";

import Link from "next/link";
import { ShoppingCart, Star, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Medicine } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore, useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/useToast";

interface MedicineCardProps {
  medicine: Medicine;
  viewMode?: "grid" | "list";
}

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

    // Check if user is authenticated and is a customer
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
        description: "Only customers can add items to cart",
        variant: "destructive",
      });
      return;
    }

    if (medicine.stock > 0) {
      addToCart(medicine, 1);
      toast({
        title: "Added to cart",
        description: `${medicine.name} has been added to your cart.`,
      });
    }
  };

  // Grid View (Default)
  if (viewMode === "grid") {
    return (
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <Link href={`/shop/${medicine.id}`}>
          <div className="aspect-square overflow-hidden bg-gray-100">
            {medicine.image ? (
              <img
                src={medicine.image}
                alt={medicine.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-100 to-emerald-100">
                <span className="text-4xl font-bold text-teal-600">
                  {medicine.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </Link>

        <CardContent className="p-4">
          <Link href={`/shop/${medicine.id}`}>
            <h3 className="mb-1 font-semibold text-gray-900 hover:text-teal-600 transition-colors">
              {medicine.name}
            </h3>
          </Link>
          <p className="mb-2 text-xs text-gray-500">{medicine.category.name}</p>
          <p className="mb-2 line-clamp-2 text-sm text-gray-600">
            {medicine.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-teal-600">
              {formatPrice(medicine.price)}
            </span>
            <span
              className={`text-xs ${medicine.stock > 0 ? "text-green-600" : "text-red-600"}`}
            >
              {medicine.stock > 0 ? (
                <span className="flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  {medicine.stock} in stock
                </span>
              ) : (
                "Out of stock"
              )}
            </span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full"
            onClick={handleAddToCart}
            disabled={medicine.stock === 0}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {medicine.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // List View
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="flex flex-col sm:flex-row">
        {/* Image Section */}
        <Link href={`/shop/${medicine.id}`} className="sm:w-48 flex-shrink-0">
          <div className="aspect-square sm:h-48 overflow-hidden bg-gray-100">
            {medicine.image ? (
              <img
                src={medicine.image}
                alt={medicine.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-100 to-emerald-100">
                <span className="text-4xl font-bold text-teal-600">
                  {medicine.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Content Section */}
        <div className="flex flex-1 flex-col justify-between p-4">
          <div>
            <Link href={`/shop/${medicine.id}`}>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 hover:text-teal-600 transition-colors">
                {medicine.name}
              </h3>
            </Link>

            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-teal-100 px-2 py-1 text-xs font-medium text-teal-700">
                {medicine.category.name}
              </span>
              {medicine.manufacturer && (
                <span className="text-xs text-gray-500">
                  by {medicine.manufacturer}
                </span>
              )}
            </div>

            <p className="mb-3 text-sm text-gray-600 line-clamp-2">
              {medicine.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-teal-600">
                {formatPrice(medicine.price)}
              </span>
              <span
                className={`flex items-center gap-1 text-sm ${medicine.stock > 0 ? "text-green-600" : "text-red-600"}`}
              >
                {medicine.stock > 0 ? (
                  <>
                    <Package className="h-4 w-4" />
                    {medicine.stock} in stock
                  </>
                ) : (
                  "Out of stock"
                )}
              </span>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={medicine.stock === 0}
              className="min-w-[140px]"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {medicine.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
