"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShoppingCart, ArrowLeft, Star, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Medicine, Review } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore, useAuthStore } from "@/lib/store";

import { toast } from "@/hooks/useToast";
import api from "@/lib/api/api";
import { Spinner } from "@/components/ui/spinner";

export default function MedicineDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
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
        description: "Failed to load medicine details",
        variant: "destructive",
      });
      router.push("/shop");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to add items to cart",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    if (medicine && medicine.stock >= quantity) {
      addToCart(medicine, quantity);
      toast({
        title: "Added to cart",
        description: `${quantity} x ${medicine.name} added to your cart`,
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Spinner className="mx-auto" />
      </div>
    );
  }

  if (!medicine) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Shop
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="overflow-hidden rounded-lg bg-gray-100">
          {medicine.image ? (
            <img
              src={medicine.image}
              alt={medicine.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-[500px] items-center justify-center bg-gradient-to-br from-teal-100 to-emerald-100">
              <span className="text-9xl font-bold text-teal-600">
                {medicine.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <p className="mb-2 text-sm text-gray-500">
              {medicine.category.name}
            </p>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              {medicine.name}
            </h1>
            <p className="mb-4 text-sm text-gray-600">
              by {medicine.manufacturer || "Unknown Manufacturer"}
            </p>
            <p className="text-3xl font-bold text-teal-600">
              {formatPrice(medicine.price)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              {medicine.stock > 0
                ? `${medicine.stock} in stock`
                : "Out of stock"}
            </span>
          </div>

          {medicine.stock > 0 && (
            <Card>
              <CardContent className="p-6 ">
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center font-medium">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setQuantity(Math.min(medicine.stock, quantity + 1))
                      }
                    >
                      +
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full md:w-[40%] cursor-pointer"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart - {formatPrice(medicine.price * quantity)}
                </Button>
              </CardContent>
            </Card>
          )}

          {medicine.stock === 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <p className="font-medium text-red-900">Out of Stock</p>
                <p className="mt-1 text-sm text-red-700">
                  This medicine is currently unavailable. Please check back
                  later.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            <h2 className="font-semibold text-gray-900">Description</h2>
            <p className="text-gray-600">{medicine.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
