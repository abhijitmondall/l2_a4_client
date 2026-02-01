"use client";

import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Truck,
  Clock,
  Star,
  Pill,
  Heart,
  Brain,
  Bone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  const features = [
    {
      icon: Shield,
      title: "Certified Quality",
      description:
        "All medicines are verified and approved by licensed pharmacists",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description:
        "Express shipping available. Get your medicines within 24-48 hours",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description:
        "Round-the-clock customer service to assist with your orders",
    },
    {
      icon: Star,
      title: "Trusted Sellers",
      description:
        "Only verified pharmacies and healthcare providers on our platform",
    },
  ];

  const categories = [
    {
      name: "Pain Relief",
      icon: Pill,
      color: "from-blue-500 to-cyan-500",
      count: "120+ products",
    },
    {
      name: "Vitamins & Supplements",
      icon: Heart,
      color: "from-pink-500 to-rose-500",
      count: "200+ products",
    },
    {
      name: "Mental Health",
      icon: Brain,
      color: "from-purple-500 to-indigo-500",
      count: "80+ products",
    },
    {
      name: "Bone & Joint Care",
      icon: Bone,
      color: "from-orange-500 to-amber-500",
      count: "95+ products",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
                Your Health,
                <br />
                <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  Our Priority
                </span>
              </h1>
              <p className="text-lg text-gray-600 md:text-xl">
                Shop from a wide range of certified medicines and healthcare
                products. Delivered safely to your doorstep with care.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/shop">
                  <Button size="lg" className="group">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline">
                    Become a Seller
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900">500+</p>
                  <p className="text-sm text-gray-600">Medicines Available</p>
                </div>
                <div className="h-12 w-px bg-gray-300"></div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">10K+</p>
                  <p className="text-sm text-gray-600">Happy Customers</p>
                </div>
                <div className="h-12 w-px bg-gray-300"></div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">50+</p>
                  <p className="text-sm text-gray-600">Verified Sellers</p>
                </div>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="relative z-10 rounded-2xl bg-white/50 p-8 shadow-2xl backdrop-blur-sm">
                <img
                  src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=700&h=600&fit=crop"
                  alt="Healthcare"
                  className="rounded-xl mx-auto"
                />
              </div>
              <div className="absolute -right-4 -top-4 h-72 w-72 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-400 to-blue-400 opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Why Choose MediStore?
            </h2>
            <p className="text-lg text-gray-600">
              We ensure the highest standards in healthcare delivery
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-none shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600">
              Browse our extensive collection of medicines and healthcare
              products
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => (
              <Link key={index} href={`/shop?category=${category.name}`}>
                <Card className="group cursor-pointer overflow-hidden border-none shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl">
                  <CardContent className="p-0">
                    <div
                      className={`relative h-48 bg-gradient-to-br ${category.color} p-6 transition-all group-hover:scale-105`}
                    >
                      <category.icon className="h-16 w-16 text-white opacity-90" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="mb-1 text-xl font-bold text-white">
                          {category.name}
                        </h3>
                        <p className="text-sm text-white/90">
                          {category.count}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/shop">
              <Button size="lg" variant="outline">
                View All Categories
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-teal-600 to-emerald-600 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Join Our Community of Sellers
          </h2>
          <p className="mb-8 text-lg text-teal-50 md:text-xl">
            Are you a pharmacy or healthcare provider? Start selling on
            MediStore today and reach thousands of customers nationwide.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-teal-600 hover:bg-gray-100"
              >
                Register as Seller
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div>
              <p className="mb-2 text-3xl font-bold">95%</p>
              <p className="text-teal-100">Customer Satisfaction</p>
            </div>
            <div>
              <p className="mb-2 text-3xl font-bold">24/7</p>
              <p className="text-teal-100">Support Available</p>
            </div>
            <div>
              <p className="mb-2 text-3xl font-bold">100%</p>
              <p className="text-teal-100">Secure Payments</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
