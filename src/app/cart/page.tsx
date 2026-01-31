"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore, useAuthStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { useEffect } from "react";

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { items, removeFromCart, updateQuantity, getTotalPrice } =
    useCartStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex min-h-[400px] flex-col items-center justify-center">
          <ShoppingBag className="mb-4 h-24 w-24 text-gray-300" />
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Your cart is empty
          </h2>
          <p className="mb-6 text-gray-600">
            Add some medicines to get started
          </p>
          <Link href="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.medicine.id}
                    className="flex gap-4 border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    {/* Image */}
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      {item.medicine.image ? (
                        <img
                          src={item.medicine.image}
                          alt={item.medicine.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-100 to-emerald-100">
                          <span className="text-2xl font-bold text-teal-600">
                            {item.medicine.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link
                          href={`/shop/${item.medicine.id}`}
                          className="font-semibold text-gray-900 hover:text-teal-600"
                        >
                          {item.medicine.name}
                        </Link>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.medicine.category.name}
                        </p>
                        <p className="mt-1 text-sm font-medium text-teal-600">
                          {formatPrice(item.medicine.price)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(
                                item.medicine.id,
                                item.quantity - 1,
                              )
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(
                                item.medicine.id,
                                item.quantity + 1,
                              )
                            }
                            disabled={item.quantity >= item.medicine.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => removeFromCart(item.medicine.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(item.medicine.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                Order Summary
              </h2>

              <div className="space-y-2 border-b pb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-sm text-green-600">Free</span>
                </div>
              </div>

              <div className="flex justify-between border-b py-4 text-lg font-bold">
                <span>Total</span>
                <span className="text-teal-600">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>

              <Link href="/checkout" className="mt-6 block">
                <Button className="w-full">Proceed to Checkout</Button>
              </Link>

              <Link href="/shop" className="mt-3 block">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
