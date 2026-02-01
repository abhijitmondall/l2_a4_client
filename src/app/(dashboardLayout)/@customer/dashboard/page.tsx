"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  ArrowUpRight,
  Search,
  Calendar,
  ChevronRight,
  Loader2,
  Inbox,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api/api";
import { Order, OrderStatus } from "@/types";
import { format } from "date-fns";

const statusConfig: Record<string, any> = {
  placed: {
    // Changed keys to lowercase to match typical DB values
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-50",
    dot: "bg-amber-500",
  },
  processing: {
    icon: Package,
    color: "text-blue-500",
    bg: "bg-blue-50",
    dot: "bg-blue-500",
  },
  shipped: {
    icon: Truck,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    dot: "bg-indigo-500",
  },
  delivered: {
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    dot: "bg-emerald-500",
  },
  cancelled: {
    icon: AlertCircle,
    color: "text-rose-500",
    bg: "bg-rose-50",
    dot: "bg-rose-500",
  },
};

export default function ActivityPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [stats, setStats] = useState({
    active: 0,
    totalSpent: 0,
    totalCount: 0,
  });

  // Fetch all data once on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const fetchedOrders = await api.orders.getMyOrders();
      const data = fetchedOrders || [];
      setOrders(data);

      // Calculate Global Stats
      const spent = data.reduce((acc, curr) => acc + curr.totalAmount, 0);
      const active = data.filter((o) =>
        ["placed", "processing", "shipped"].includes(o.status.toLowerCase()),
      ).length;

      setStats({
        active,
        totalSpent: spent,
        totalCount: data.length,
      });
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // COMBINED FILTER: Handles both Status Tab and Search Query
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Filter by Status Tab
      const matchesStatus =
        activeTab === "ALL" ||
        order.status.toLowerCase() === activeTab.toLowerCase();

      // 2. Filter by Search Query
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some((item) =>
          item.medicineId.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      return matchesStatus && matchesSearch;
    });
  }, [orders, activeTab, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 pt-24">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
              Activity <span className="text-emerald-500">Registry</span>
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Real-time synchronization with MediStore Central
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-xl border-slate-200 bg-white font-black text-[10px] uppercase tracking-widest h-12 px-6 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
          >
            <Calendar className="mr-2 h-4 w-4 text-emerald-500" /> Generate
            Audit
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              label: "Active Nodes",
              value: stats.active.toString().padStart(2, "0"),
              icon: Package,
              color: "bg-emerald-500",
            },
            {
              label: "Procurement Total",
              value: `$${stats.totalSpent.toLocaleString()}`,
              icon: ArrowUpRight,
              color: "bg-slate-900",
            },
            {
              label: "Registry Count",
              value: stats.totalCount.toString().padStart(2, "0"),
              icon: AlertCircle,
              color: "bg-blue-500",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm flex items-center gap-5 group hover:border-emerald-500/30 transition-all"
            >
              <div
                className={`${stat.color} h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform`}
              >
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-black text-slate-900 tracking-tighter">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* List Container */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row justify-between gap-6 bg-slate-50/30">
            {/* Search Input */}
            <div className="relative w-full lg:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
              <Input
                placeholder="Search Order Hash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-10 h-12 rounded-xl border-slate-200 bg-white focus:border-emerald-500/50 font-bold text-xs uppercase tracking-tight"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
              {[
                "ALL",
                "PLACED",
                "PROCESSING",
                "SHIPPED",
                "DELIVERED",
                "CANCELLED",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? "bg-slate-900 text-white shadow-xl shadow-slate-200 scale-105"
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-40 gap-4">
                <Loader2
                  className="h-10 w-10 text-emerald-500 animate-spin"
                  strokeWidth={3}
                />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  Establishing Connection...
                </span>
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  // Normalize status to lowercase to match config keys
                  const statusKey = order.status.toLowerCase();
                  const config = statusConfig[statusKey] || statusConfig.placed;
                  const StatusIcon = config.icon;

                  return (
                    <div
                      key={order.id}
                      className="p-6 hover:bg-slate-50/80 transition-all group border-l-4 border-l-transparent hover:border-l-emerald-500"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                          <div
                            className={`${config.bg} h-14 w-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm`}
                          >
                            <StatusIcon className={`${config.color} h-6 w-6`} />
                          </div>
                          <div>
                            <h3 className="font-black text-slate-900 uppercase tracking-tighter text-sm flex items-center gap-2">
                              {order.id.slice(-10).toUpperCase()}
                              <span className="px-2 py-0.5 bg-slate-100 rounded text-[8px] text-slate-500 italic">
                                {order.items.length} units
                              </span>
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                              TIMESTAMP:{" "}
                              {format(
                                new Date(order.createdAt),
                                "MMM dd, yyyy • HH:mm",
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-12 w-full md:w-auto">
                          <div className="text-right">
                            <p className="text-sm font-black text-slate-900 tracking-tighter">
                              USD {order.totalAmount.toFixed(2)}
                            </p>
                            <div className="flex items-center gap-2 justify-end mt-1">
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${config.dot} animate-pulse`}
                              />
                              <span
                                className={`text-[9px] font-black uppercase tracking-widest ${config.color}`}
                              >
                                {order.status}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100"
                            onClick={() =>
                              (window.location.href = `/orders/${order.id}`)
                            }
                          >
                            <ChevronRight
                              size={18}
                              className="text-slate-400 group-hover:text-emerald-500"
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-slate-300 gap-4">
                <Inbox size={48} strokeWidth={1} className="text-slate-200" />
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                    Null Pointer: No Records
                  </p>
                  <p className="text-[9px] font-bold text-slate-300 uppercase mt-1">
                    Try adjusting filtration parameters
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-1 w-4 bg-emerald-500/20 rounded-full"
                />
              ))}
            </div>
            <button
              onClick={() => fetchData()}
              className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-emerald-600 transition-all"
            >
              Forced Database Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
