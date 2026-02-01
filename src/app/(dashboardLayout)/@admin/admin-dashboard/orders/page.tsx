"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  User,
  ChevronDown,
  Store,
  MoreHorizontal,
  Calendar,
  CreditCard,
  Hash,
  Loader2,
  AlertCircle,
  Inbox,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { api } from "@/lib/api/api";
import { Order, OrderStatus } from "@/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.admin.orders.getAll();
      setOrders(data);
    } catch (err) {
      console.error("Order Fetch Error:", err);
      setError("Failed to synchronize with the order database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: OrderStatus,
  ) => {
    try {
      setProcessingId(orderId);

      await api.admin.orders.updateStatus(orderId, newStatus);

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
    } catch (err) {
      console.error("Update Error:", err);
      alert("Failed to update status. Please check permissions.");
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusStyle = (status: string) => {
    const s = status.toUpperCase();
    if (s === "PROCESSING" || s === "PLACED")
      return "bg-amber-50 text-amber-700 border-amber-100";
    if (s === "DELIVERED")
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (s === "SHIPPED") return "bg-blue-50 text-blue-700 border-blue-100";
    if (s === "CANCELLED") return "bg-rose-50 text-rose-700 border-rose-100";
    return "bg-slate-50 text-slate-500 border-slate-200";
  };

  if (loading)
    return (
      <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4">
        <Loader2
          className="h-10 w-10 animate-spin text-slate-300"
          strokeWidth={1.5}
        />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Fetching Encrypted Ledger...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4">
        <AlertCircle className="h-10 w-10 text-rose-500" />
        <p className="text-sm font-semibold text-slate-600">{error}</p>
        <Button variant="outline" onClick={fetchOrders}>
          Retry Sync
        </Button>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-slate-900 pb-20">
      <div className="max-w-6xl mx-auto px-6 pt-12">
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Orders Management
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Review fulfillment cycles and multi-seller disbursements.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-row items-center gap-2 text-right mr-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Active Orders
              </p>
              <p className="text-lg font-bold text-green-700">
                {orders.length}
              </p>
            </div>
            {/* <Button
              variant="outline"
              className="bg-white rounded-lg px-5 border-slate-200 text-xs font-bold uppercase tracking-wider"
            >
              Filter
            </Button>
            <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-5 text-xs font-bold uppercase tracking-wider">
              Export CSV
            </Button> */}
          </div>
        </header>

        {orders.length === 0 && (
          <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-20 flex flex-col items-center justify-center text-center">
            <Inbox className="h-12 w-12 text-slate-200 mb-4" />
            <h3 className="font-bold text-slate-900">No Orders Found</h3>
          </div>
        )}

        <div className="space-y-6">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="border border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white hover:border-slate-300 transition-all"
            >
              <CardContent className="p-0">
                {/* 1. Header with Actions */}
                <div className="p-6 md:px-8 flex flex-wrap items-center justify-between gap-6 border-b border-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                      {processingId === order.id ? (
                        <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                      ) : (
                        <Hash size={18} className="text-slate-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-slate-900 uppercase">
                          #{order.id.slice(0, 8)}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[9px] font-black uppercase px-2 py-0.5 border ${getStatusStyle(order.status)}`}
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-[11px] text-slate-400 font-bold uppercase tracking-tighter">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> Feb 01, 2026
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard size={12} /> {order.paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                        Total Bill
                      </p>
                      <p className="text-2xl font-black text-slate-900 tracking-tighter">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 border border-slate-200 rounded-xl hover:bg-slate-50"
                          disabled={processingId === order.id}
                        >
                          <MoreHorizontal size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 rounded-xl shadow-xl border-slate-100 p-1.5"
                      >
                        <DropdownMenuItem
                          className="text-xs font-bold uppercase p-2.5 rounded-lg cursor-pointer"
                          onClick={() =>
                            handleUpdateStatus(order.id, "shipped")
                          }
                        >
                          Dispatch Order
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-xs font-bold uppercase p-2.5 rounded-lg cursor-pointer"
                          onClick={() =>
                            handleUpdateStatus(order.id, "delivered")
                          }
                        >
                          Mark Delivered
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-xs font-bold uppercase p-2.5 rounded-lg text-rose-600 cursor-pointer"
                          onClick={() =>
                            handleUpdateStatus(order.id, "cancelled")
                          }
                        >
                          Cancel Transaction
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* 2. Customer & Logistics Split */}
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                  <div className="p-8 space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 tracking-widest">
                      <User size={13} className="text-indigo-500" /> Consignee
                    </label>
                    <p className="font-bold text-slate-900 uppercase italic tracking-tight">
                      {order.shippingName}
                    </p>
                    <p className="text-slate-500 text-xs font-medium lowercase">
                      {order.customer?.email}
                    </p>
                  </div>

                  <div className="p-8 space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 tracking-widest">
                      <MapPin size={13} className="text-rose-500" /> Logistics
                    </label>
                    <div className="text-sm">
                      <p className="font-semibold text-slate-700 leading-snug">
                        {order.shippingAddr}
                      </p>
                      <p className="text-slate-400 text-xs font-bold mt-1.5 flex items-center gap-1.5 underline decoration-slate-200">
                        <Phone size={11} /> {order.shippingPhone}
                      </p>
                    </div>
                  </div>

                  <div className="p-8 space-y-4 bg-slate-50/20">
                    <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 tracking-widest">
                      <Store size={13} className="text-amber-500" /> Payout
                      Breakdown
                    </label>
                    <div className="space-y-2">
                      {order.sellerBreakdown?.map((s, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                        >
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                            {s.sellerName}
                          </span>
                          <span className="font-black text-slate-900 text-xs">
                            ${s.payable}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Item Manifest */}
                <Collapsible>
                  <CollapsibleTrigger className="w-full flex items-center justify-center gap-3 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-t border-slate-50 hover:bg-slate-50 transition-colors">
                    Inventory Manifest ({order.items?.length || 0}){" "}
                    <ChevronDown size={14} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-8 pb-8 space-y-3">
                    {order.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl"
                      >
                        <div className="flex items-center gap-5">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 text-[11px] font-black">
                            {item.quantity}x
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-900 uppercase italic tracking-tighter">
                              {item.medicine?.name}
                            </h4>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                              {item.medicine?.category?.name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-slate-900">
                            ${item.price}
                          </p>
                          <p className="text-[9px] font-bold text-indigo-500 uppercase">
                            Provider: {item.seller?.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
