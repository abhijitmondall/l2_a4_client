"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Truck,
  CheckCircle2,
  Clock,
  Search,
  Loader2,
  MoreVertical,
  PackageCheck,
  AlertCircle,
  Package,
  Info,
  ExternalLink,
  Calendar,
  Hash,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import api from "@/lib/api/api";
import { toast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@/types";

const STATUS_TABS = [
  "ALL",
  "PLACED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function SellerOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const statusParam =
        activeTab === "ALL" ? undefined : activeTab.toLowerCase();
      const data = await api.seller.orders.getByStatus(
        statusParam as OrderStatus,
      );
      setOrders(data || []);
    } catch (error) {
      toast({ variant: "destructive", title: "Sync Error" });
    } finally {
      setLoading(false);
    }
  };

  /** * FIXED: updateOrderStatus
   * Added status normalization and optimistic UI update
   */
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);

    // Normalize status to lowercase for backend compatibility
    const formattedStatus = newStatus.toLowerCase() as OrderStatus;

    try {
      await api.seller.orders.updateStatus(orderId, formattedStatus);

      // Update local state immediately
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: formattedStatus } : o,
        ),
      );

      // If we are in a filtered tab, remove the order that no longer matches
      if (activeTab !== "ALL") {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      }

      toast({
        title: "Order Updated",
        description: `Status changed to ${formattedStatus}`,
        variant: "success",
      });
    } catch (error: any) {
      console.error("Update Error:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description:
          error.response?.data?.message || "Could not sync with server.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyles = (status: string) => {
    const s = (status || "").toUpperCase();
    if (s === "PLACED") return "bg-indigo-50 text-indigo-600 border-indigo-100";
    if (s === "DELIVERED")
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    if (s === "CANCELLED") return "bg-rose-50 text-rose-600 border-rose-100";
    return "bg-amber-50 text-amber-600 border-amber-100";
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-[#1E293B] tracking-tight">
              Orders
            </h1>
            <p className="text-slate-500 font-medium">
              Manage fulfillment and track revenue splits.
            </p>
          </div>

          <div className="relative w-full md:w-[400px]">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <Input
              placeholder="Search customer or Order ID..."
              className="pl-12 h-14 rounded-2xl border-none bg-white shadow-sm shadow-slate-200/50 focus:ring-2 focus:ring-teal-500/20 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2 no-scrollbar">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-8 py-3 rounded-xl text-[11px] font-black tracking-widest transition-all whitespace-nowrap",
                activeTab === tab
                  ? "bg-[#1E293B] text-white shadow-lg shadow-slate-200"
                  : "bg-white text-slate-400 hover:text-slate-600 border border-transparent hover:border-slate-200",
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* LIST */}
        <div className="grid gap-6">
          {loading ? (
            <div className="h-64 flex items-center justify-center bg-white rounded-[32px] border border-slate-100 shadow-sm">
              <Loader2 className="animate-spin text-teal-500" size={32} />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center bg-white rounded-[32px] border-2 border-dashed border-slate-100 text-slate-400 font-bold italic">
              <PackageCheck size={48} className="mb-2 text-slate-200" />
              No {activeTab.toLowerCase()} orders found
            </div>
          ) : (
            filteredOrders.map((order) => (
              <Card
                key={order.id}
                className="overflow-hidden border-none shadow-sm shadow-slate-200/60 rounded-[32px] bg-white transition-all hover:shadow-xl hover:shadow-slate-200/50"
              >
                <div className="flex flex-col xl:flex-row">
                  {/* SIDEBAR */}
                  <div className="xl:w-64 p-8 border-b xl:border-b-0 xl:border-r border-slate-50 space-y-6">
                    <Badge
                      className={cn(
                        "px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-tighter shadow-none border",
                        getStatusStyles(order.status),
                      )}
                    >
                      {order.status}
                    </Badge>

                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-1">
                          <Hash size={12} /> ID
                        </p>
                        <p className="text-sm font-bold text-slate-700">
                          {order.id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-1">
                          <Calendar size={12} /> Date
                        </p>
                        <p className="text-sm font-bold text-slate-700">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center gap-3 border-t border-slate-50">
                      <div className="h-10 w-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-black text-sm">
                        {order.customer?.name?.[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-800 truncate">
                          {order.customer?.name}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400 truncate">
                          {order.customer?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* MAIN CONTENT */}
                  <div className="flex-1 p-8 space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-teal-50 text-teal-600 rounded-lg">
                            <Package size={16} />
                          </div>
                          <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">
                            Your Package
                          </h4>
                        </div>
                        <p className="text-xs font-black text-teal-600">
                          Share: ${order.sellerPayout}
                        </p>
                      </div>

                      <div className="max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {order.myItems?.map((item: any, idx: number) => (
                            <button
                              key={idx}
                              onClick={() =>
                                router.push(`/shop/${item.medicineId}`)
                              }
                              className="group flex items-center justify-between p-3 rounded-2xl bg-[#F8FAFC] hover:bg-white hover:ring-2 hover:ring-teal-500/10 transition-all border border-transparent hover:border-teal-100 shadow-sm shadow-transparent hover:shadow-slate-200/50"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <ExternalLink
                                  size={14}
                                  className="text-slate-300 group-hover:text-teal-500 transition-colors shrink-0"
                                />
                                <span className="text-xs font-bold text-slate-600 truncate">
                                  {item.medicine?.name}
                                </span>
                              </div>
                              <span className="bg-[#1E293B] text-white px-2 py-0.5 rounded-lg font-black text-[9px]">
                                x{item.quantity}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* OTHER VENDORS */}
                    {order.otherSellerItems?.length > 0 && (
                      <div className="pt-5 border-t border-slate-50">
                        <div className="flex justify-between items-center mb-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Other Vendor Items
                          </p>
                          <p className="text-[10px] font-bold text-slate-400">
                            Total split: ${order.otherPayout}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {order.otherSellerItems.map(
                            (item: any, idx: number) => (
                              <button
                                key={idx}
                                onClick={() =>
                                  router.push(`/shop/${item.medicineId}`)
                                }
                                className="px-3 py-1.5 rounded-full bg-white text-[10px] font-bold text-slate-500 border border-slate-100 hover:border-slate-300 hover:text-slate-700 transition-all flex items-center gap-1.5"
                              >
                                {item.medicine?.name}
                                <span className="text-slate-300 font-black">
                                  x{item.quantity}
                                </span>
                              </button>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* TOTALS & ACTION */}
                  <div className="xl:w-64 p-8 bg-slate-50/30 flex flex-row xl:flex-col items-center xl:items-end justify-between xl:justify-center gap-6">
                    <div className="text-left xl:text-right">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">
                        Grand Total
                      </p>
                      <h3 className="text-4xl font-black text-[#1E293B] tracking-tighter">
                        ${order.totalAmount}
                      </h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="mt-1 flex items-center gap-1.5 text-[10px] font-bold text-teal-600 underline underline-offset-4 ml-auto">
                            <Info size={12} /> Payout Breakdown
                          </TooltipTrigger>
                          <TooltipContent className="bg-[#1E293B] text-white border-none rounded-xl p-3 shadow-2xl">
                            <div className="space-y-1 font-bold text-[11px]">
                              <div className="flex justify-between gap-8">
                                <span className="text-slate-400">
                                  Your Share:
                                </span>
                                <span>${order.sellerPayout}</span>
                              </div>
                              <div className="flex justify-between gap-8">
                                <span className="text-slate-400">
                                  Other Vendors:
                                </span>
                                <span>${order.otherPayout}</span>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <div className="w-full max-w-[160px]">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className="w-full h-14 rounded-2xl bg-[#1E293B] text-white hover:bg-[#0F172A] shadow-lg shadow-slate-200 flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-widest"
                            disabled={updatingId === order.id}
                          >
                            {updatingId === order.id ? (
                              <Loader2 className="animate-spin" size={16} />
                            ) : (
                              <>
                                <MoreVertical size={16} /> Action
                              </>
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-56 rounded-2xl p-2 shadow-2xl border-none ring-1 ring-black/5"
                        >
                          <DropdownMenuItem
                            onClick={() =>
                              updateOrderStatus(order.id, "processing")
                            }
                            className="rounded-xl py-3 font-bold text-xs gap-3 cursor-pointer"
                          >
                            <Clock size={16} className="text-amber-500" /> Mark
                            Processing
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateOrderStatus(order.id, "shipped")
                            }
                            className="rounded-xl py-3 font-bold text-xs gap-3 cursor-pointer"
                          >
                            <Truck size={16} className="text-blue-500" /> Mark
                            Shipped
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateOrderStatus(order.id, "delivered")
                            }
                            className="rounded-xl py-3 font-bold text-xs gap-3 cursor-pointer"
                          >
                            <CheckCircle2
                              size={16}
                              className="text-emerald-500"
                            />{" "}
                            Mark Delivered
                          </DropdownMenuItem>
                          <div className="h-px bg-slate-100 my-1" />
                          <DropdownMenuItem
                            onClick={() =>
                              updateOrderStatus(order.id, "cancelled")
                            }
                            className="rounded-xl py-3 font-bold text-xs gap-3 cursor-pointer text-rose-500"
                          >
                            <AlertCircle size={16} /> Cancel Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: #cbd5e1;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
