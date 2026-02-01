"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Star,
  Pill,
  Heart,
  Brain,
  Activity,
  Thermometer,
  ShoppingBag,
} from "lucide-react";
import { api } from "@/lib/api/api";
import { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.medicines.getCategories();
        setCategories(data?.slice(0, 4) || []);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const getCategoryTheme = (name: string) => {
    const themes: Record<string, { icon: any; color: string; shadow: string }> =
      {
        "Pain Relief": {
          icon: Thermometer,
          color: "from-blue-500 to-cyan-400",
          shadow: "shadow-blue-200",
        },
        Antibiotics: {
          icon: Pill,
          color: "from-emerald-500 to-teal-400",
          shadow: "shadow-emerald-200",
        },
        "Mental Health": {
          icon: Brain,
          color: "from-violet-500 to-purple-400",
          shadow: "shadow-purple-200",
        },
        Cardiovascular: {
          icon: Heart,
          color: "from-rose-500 to-pink-400",
          shadow: "shadow-rose-200",
        },
      };
    return (
      themes[name] || {
        icon: Activity,
        color: "from-slate-600 to-slate-400",
        shadow: "shadow-slate-200",
      }
    );
  };

  return (
    <div className="flex flex-col bg-white font-sans antialiased">
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-32 md:pb-40 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-50/50 via-white to-white">
        <div className="container relative mx-auto px-4">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Live Medical Network
                </span>
              </div>

              <h1 className="text-6xl lg:text-8xl font-black leading-[0.9] text-slate-900 tracking-tight">
                Healthcare <br />
                <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  Reimagined.
                </span>
              </h1>

              <p className="text-xl text-slate-500 leading-relaxed max-w-lg">
                The most trusted digital pharmacy ecosystem. Genuine
                medications, verified pharmacists, and lightning-fast delivery.
              </p>

              <div className="flex flex-wrap gap-5 pt-4">
                <Link href="/shop">
                  <Button
                    size="lg"
                    className="h-16 px-10 cursor-pointer rounded-2xl bg-slate-900 hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-300 group"
                  >
                    Explore Shop
                    <ShoppingBag className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-16 px-10 cursor-pointer rounded-2xl border-slate-200 bg-white hover:bg-slate-50 font-bold"
                  >
                    Partner Portal
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative animate-in fade-in zoom-in duration-1000">
              <div className="absolute -left-12 top-1/4 z-20 hidden lg:block animate-bounce [animation-duration:3s]">
                <div className="bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/50 flex items-center gap-4">
                  <div className="h-10 w-10 bg-emerald-500 rounded-full flex items-center justify-center text-white italic font-serif">
                    A+
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase text-slate-400">
                      Quality Score
                    </p>
                    <p className="font-bold text-slate-900">Verified Stocks</p>
                  </div>
                </div>
              </div>

              <div className="relative rounded-[3rem] overflow-hidden border-[12px] border-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] bg-slate-200">
                <img
                  src="https://images.pexels.com/photos/5910953/pexels-photo-5910953.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Modern Pharmacy"
                  className="aspect-[4/4.5] object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST METRICS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Patients", val: "2.4M+", icon: Activity },
              { label: "Verified Pharmacists", val: "12k+", icon: ShieldCheck },
              { label: "Cities Covered", val: "450+", icon: Truck },
              { label: "Average Rating", val: "4.9/5", icon: Star },
            ].map((stat, i) => (
              <div
                key={i}
                className="group p-8 rounded-[2.5rem] bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 transition-all text-center"
              >
                <stat.icon className="h-6 w-6 mx-auto mb-4 text-emerald-500" />
                <h3 className="text-3xl font-black text-slate-900 mb-1">
                  {stat.val}
                </h3>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-emerald-600">
              Browse Catalog
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Curated for your health.
            </h3>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {loading
              ? Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton
                      key={i}
                      className="h-72 rounded-[3rem] bg-slate-200"
                    />
                  ))
              : categories.map((cat) => {
                  const theme = getCategoryTheme(cat.name);
                  const Icon = theme.icon;
                  return (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${cat.id}`}
                      className="group"
                    >
                      <div className="h-72 relative bg-white rounded-[3rem] p-10 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden border border-slate-100">
                        <div
                          className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${theme.color} flex items-center justify-center text-white shadow-lg ${theme.shadow} mb-12`}
                        >
                          <Icon size={28} />
                        </div>
                        <h4 className="text-2xl font-black text-slate-900">
                          {cat.name}
                        </h4>
                        <p className="text-emerald-500 text-xs font-black uppercase tracking-widest mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          View More <ArrowRight size={14} />
                        </p>
                        <div
                          className={`absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-gradient-to-br ${theme.color} opacity-5 group-hover:scale-150 transition-transform duration-700`}
                        />
                      </div>
                    </Link>
                  );
                })}
          </div>
        </div>
      </section>

      {/* 4. PARTNER CTA*/}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-slate-900 rounded-[4rem] overflow-hidden relative">
            <div className="grid md:grid-cols-2 items-center">
              <div className="p-12 md:p-24 space-y-8">
                <h2 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tighter">
                  Scale your <span className="text-emerald-400">Practice.</span>
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Join the Live Medical Network. Manage inventory, digital
                  prescriptions, and local logistics through our verified
                  dashboard.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/register">
                    <Button className="h-14 px-8 cursor-pointer rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold transition-transform hover:scale-105 shadow-xl shadow-emerald-500/20">
                      Become a Partner
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button
                      variant="ghost"
                      className="h-14 px-8 cursor-pointer text-white hover:bg-white/10 font-bold"
                    >
                      Contact Sales
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative h-full min-h-100 hidden md:block">
                <div className="absolute inset-10 rounded-[2.5rem] overflow-hidden border-8 border-slate-800 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 bg-slate-800">
                  <img
                    src="https://images.pexels.com/photos/3985062/pexels-photo-3985062.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    className="h-full w-full object-cover object-center"
                    alt="Healthcare Professional"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
