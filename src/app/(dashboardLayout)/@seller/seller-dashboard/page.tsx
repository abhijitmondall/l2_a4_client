"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  Package,
  AlertCircle,
  ArrowUpRight,
  Plus,
  ChevronRight,
  Activity,
  ShoppingBag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatPrice, cn } from "@/lib/utils";
import api from "@/lib/api/api";
import Link from "next/link";

export default function SellerDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await api.seller.getDashboardStats();
        setData(stats);
      } catch (error) {
        console.error("Dashboard Stats Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-slate-400">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
        <p className="font-bold animate-pulse uppercase tracking-widest text-xs">
          Syncing store data...
        </p>
      </div>
    );

  // Calculate fulfillment percentage dynamically
  const totalOrdersCount = data?.recentOrders?.length || 0;
  const fulfillmentRate =
    totalOrdersCount > 0
      ? Math.round(
          ((totalOrdersCount - (data?.pendingOrders || 0)) / totalOrdersCount) *
            100,
        )
      : 0;

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 italic uppercase">
            Store Overview
          </h1>
          <p className="text-slate-500 font-medium tracking-tight">
            Manage your pharmacy metrics and daily orders here.
          </p>
        </div>
        <Link href="/seller-dashboard/add-medicine">
          <Button className="rounded-2xl cursor-pointer bg-[#00A389] hover:bg-[#008f77] px-8 h-12 font-bold shadow-xl shadow-teal-100 hover:scale-105 transition-all gap-2 text-white">
            <Plus size={20} strokeWidth={3} /> Add New Medicine
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Analytics & Orders */}
        <div className="lg:col-span-8 space-y-8">
          {/* Revenue Hero Card */}
          <Card className="relative overflow-hidden border-none bg-slate-950 text-white rounded-[40px] shadow-2xl">
            <CardContent className="p-10 flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-6">
              <div className="space-y-6">
                <Badge className="bg-teal-500/10 text-[#00E5BC] border border-teal-500/20 py-1.5 px-4 rounded-full font-bold text-[11px] uppercase tracking-widest">
                  Revenue Performance
                </Badge>
                <div>
                  <h2 className="text-6xl font-black tracking-tighter">
                    {formatPrice(data?.totalRevenue || 0)}
                  </h2>
                  <div className="flex items-center gap-2 mt-3 text-slate-400 font-semibold">
                    <div className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
                      <TrendingUp size={16} />
                    </div>
                    <span>Growth trending up 12% vs last month</span>
                  </div>
                </div>
              </div>
              <Link
                href="/seller-dashboard/orders"
                className="hidden sm:flex h-32 w-32 rounded-full bg-gradient-to-br from-teal-500/20 to-transparent border border-white/5 items-center justify-center group cursor-pointer transition-all hover:border-white/20"
              >
                <ArrowUpRight
                  size={48}
                  className="text-[#00E5BC] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform underline"
                />
              </Link>
            </CardContent>
            <div className="absolute top-0 right-0 h-64 w-64 bg-teal-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          </Card>

          {/* Recent Orders List */}
          <Card className="border-none shadow-sm bg-white rounded-[32px] overflow-hidden border border-slate-100">
            <CardHeader className="px-8 py-6 flex flex-row items-center justify-between bg-white border-b border-slate-50">
              <CardTitle className="text-xl font-black text-slate-800 tracking-tight uppercase italic">
                Recent Orders
              </CardTitle>
              <Link href="/seller-dashboard/orders">
                <Button
                  variant="ghost"
                  className="text-[#00A389] font-bold gap-1 hover:bg-teal-50 rounded-xl"
                >
                  View All <ChevronRight size={16} />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50/50">
                    <tr className="text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
                      <th className="px-8 py-5">Order ID</th>
                      <th className="px-4 py-5">Status</th>
                      <th className="px-8 py-5 text-right">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {data?.recentOrders?.length > 0 ? (
                      data.recentOrders.slice(0, 5).map((order: any) => (
                        <tr
                          key={order.id}
                          className="group hover:bg-slate-50/30 transition-all cursor-default"
                        >
                          <td className="px-8 py-6">
                            <span className="font-bold text-slate-900 block group-hover:text-teal-700 transition-colors tracking-tight text-base">
                              #{order.id.slice(-8).toUpperCase()}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                              CUSTOMER: {order.customer?.name || "Guest"}
                            </span>
                          </td>
                          <td className="px-4 py-6">
                            <Badge
                              className={cn(
                                "rounded-lg px-3 py-1 font-black text-[9px] uppercase border shadow-none",
                                {
                                  "bg-amber-50 text-amber-600 border-amber-100":
                                    order.status === "placed",
                                  "bg-blue-50 text-blue-600 border-blue-100":
                                    order.status === "processing",
                                  "bg-emerald-50 text-emerald-600 border-emerald-100":
                                    order.status === "delivered",
                                  "bg-rose-50 text-rose-600 border-rose-100":
                                    order.status === "cancelled",
                                },
                              )}
                            >
                              {order.status}
                            </Badge>
                          </td>
                          <td className="px-8 py-6 text-right font-black text-slate-900 text-xl tracking-tighter">
                            {formatPrice(order.totalAmount)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-8 py-10 text-center text-slate-400 font-bold italic uppercase text-xs"
                        >
                          No recent orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Alerts & Status */}
        <div className="lg:col-span-4 space-y-8">
          {/* Fulfillment Card */}
          <Card className="border-none shadow-sm rounded-[32px] p-2 bg-white border border-slate-100">
            <CardHeader className="p-6 pb-2">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
                Tasks to Fulfillment
              </p>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-6xl font-black text-slate-900 tracking-tighter">
                  {data?.pendingOrders || 0}
                </span>
                <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">
                  Orders
                </span>
              </div>
              <p className="text-amber-600 font-black text-[10px] mt-2 uppercase tracking-widest flex items-center gap-1">
                <Activity size={12} /> Awaiting Confirmation
              </p>
            </CardHeader>
            <CardContent className="p-6 pt-6">
              <Progress
                value={fulfillmentRate}
                className="h-3 bg-slate-100 [&>div]:bg-[#FF9500] rounded-full"
              />
              <div className="flex justify-between items-center mt-5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {fulfillmentRate}% Success Rate
                </span>
                <ShoppingBag size={14} className="text-slate-300" />
              </div>
            </CardContent>
          </Card>

          {/* REAL Low Stock Alerts */}
          <Card className="border-none bg-rose-50/50 rounded-[32px] p-6 shadow-sm border border-rose-100">
            <div className="flex items-center gap-3 text-rose-600 mb-6">
              <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                <AlertCircle size={20} strokeWidth={3} />
              </div>
              <h3 className="font-black text-xs uppercase tracking-widest">
                Inventory Alerts
              </h3>
            </div>
            <div className="space-y-4">
              {data?.lowStockMedicines?.length > 0 ? (
                data.lowStockMedicines.slice(0, 3).map((med: any) => (
                  <div
                    key={med.id}
                    className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 font-black text-xs">
                        !
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 truncate max-w-[120px]">
                          {med.name}
                        </p>
                        <p className="text-[11px] font-black text-rose-500 uppercase">
                          Only {med.stock} left
                        </p>
                      </div>
                    </div>
                    <Link href={`/seller-dashboard/inventory`}>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-10 w-10 text-slate-300 hover:text-teal-600 hover:bg-teal-50 rounded-xl"
                      >
                        <Plus size={20} />
                      </Button>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                  Stock levels healthy ✨
                </div>
              )}
            </div>
          </Card>

          {/* Inventory Health Card */}
          <Card className="border-none bg-white rounded-[32px] p-8 text-center shadow-sm border border-slate-100 group">
            <div className="h-20 w-20 bg-slate-50 rounded-[28px] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-teal-50 transition-all duration-500">
              <Package
                className="text-slate-300 group-hover:text-teal-500 transition-colors"
                size={40}
              />
            </div>
            <div className="space-y-2 mb-8">
              <p className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">
                Inventory
              </p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest px-4 leading-relaxed">
                You have{" "}
                <span className="text-teal-600 font-black">
                  {data?.totalMedicines || 0} active listings
                </span>
              </p>
            </div>
            <Link href="/seller-dashboard/inventory">
              <Button
                variant="outline"
                className="w-full rounded-2xl h-14 font-black border-slate-200 text-slate-700 hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all text-xs uppercase tracking-widest shadow-sm"
              >
                Manage Inventory
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
