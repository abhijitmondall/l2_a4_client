"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  CheckCircle2,
  Pill,
  Loader2,
  Truck,
  PackageCheck,
  ClipboardList,
  Search,
  ChevronRight,
  Download,
  HelpCircle,
  AlertCircle,
  XCircle,
  Activity, // New icon for cancel
} from "lucide-react";
import { api } from "@/lib/api/api";
import { Order, OrderStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/useToast"; // Updated to your specific import
import Link from "next/link";

export default function PerfectedOrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const loadData = async () => {
    try {
      const data = await api.orders.getMyOrders();
      setOrders(data);
      if (data.length > 0) {
        // Maintain selection after status update
        if (selectedOrder) {
          const updated = data.find((o) => o.id === selectedOrder.id);
          setSelectedOrder(updated || data[0]);
        } else {
          setSelectedOrder(data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // New Cancel Functionality
  const handleCancelOrder = async (orderId: string) => {
    setCancelling(true);
    try {
      await api.orders.updateStatus(orderId, {
        status: "cancelled" as OrderStatus,
      });
      toast({
        title: "Order Terminated",
        description: "The medical request has been successfully cancelled.",
        variant: "success",
      });
      await loadData();
    } catch (err) {
      toast({
        title: "Action Failed",
        description: "Could not cancel the order at this time.",
        variant: "destructive",
      });
    } finally {
      setCancelling(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [orders, searchQuery]);

  const getStepStatus = (stepId: string, currentStatus: string) => {
    const hierarchy = ["placed", "processing", "shipped", "delivered"];
    const currentIndex = hierarchy.indexOf(currentStatus.toLowerCase());
    const stepIndex = hierarchy.indexOf(stepId);

    if (currentStatus.toLowerCase() === "cancelled") return "pending";
    if (currentIndex > stepIndex) return "complete";
    if (currentIndex === stepIndex) return "active";
    return "pending";
  };

  const isCancellable = selectedOrder?.status.toLowerCase() === "placed";
  const isTooLate = ["processing", "shipped", "delivered"].includes(
    selectedOrder?.status.toLowerCase() || "",
  );

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#F1F5F9] gap-4">
        <div className="relative">
          <Loader2 className="animate-spin text-emerald-500" size={48} />
          <Activity
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-400"
            size={20}
          />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">
          Initializing Registry...
        </p>
      </div>
    );

  return (
    <div className="flex h-screen bg-[#F1F5F9] overflow-hidden font-sans">
      {/* --- LEFT PANEL: ORDER HISTORY --- */}
      <div className="w-95 bg-white/80 backdrop-blur-xl border-r border-slate-200 flex flex-col shadow-2xl z-20">
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
              Archive
            </h1>
            <Badge className="bg-slate-900 text-[10px] font-black">
              {filteredOrders.length}
            </Badge>
          </div>
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"
              size={18}
            />
            <input
              placeholder="Search by Order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-bold transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-3">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <button
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`w-full p-5 rounded-[1.5rem] text-left transition-all duration-300 flex items-center justify-between group ${
                  selectedOrder?.id === order.id
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-200 translate-x-2"
                    : "bg-white hover:bg-emerald-50 text-slate-600 border border-transparent hover:border-emerald-100"
                }`}
              >
                <div className="space-y-1">
                  <p
                    className={`text-[9px] font-black uppercase tracking-widest ${selectedOrder?.id === order.id ? "text-emerald-400" : "text-slate-400"}`}
                  >
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <h4 className="font-black text-sm tracking-tight">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </h4>
                  <p
                    className={`text-[10px] font-bold ${selectedOrder?.id === order.id ? "text-slate-300" : "text-slate-500"}`}
                  >
                    {order.items.length} units • ${order.totalAmount} •{" "}
                    <span className="uppercase text-[8px]">{order.status}</span>
                  </p>
                </div>
                <ChevronRight
                  size={18}
                  className={`${selectedOrder?.id === order.id ? "text-emerald-400" : "text-slate-200"}`}
                />
              </button>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                No matches found
              </p>
            </div>
          )}
        </div>
      </div>

      {/* --- RIGHT PANEL: LIVE DETAIL VIEW --- */}
      <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
        {selectedOrder ? (
          <div className="max-w-5xl mx-auto p-12 space-y-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl text-white ${selectedOrder.status === "cancelled" ? "bg-rose-500" : "bg-emerald-500"}`}
                  >
                    <ShoppingBag size={24} />
                  </div>
                  <h2 className="text-4xl font-black tracking-tighter text-slate-900">
                    Order{" "}
                    <span
                      className={
                        selectedOrder.status === "cancelled"
                          ? "text-rose-500"
                          : "text-emerald-500"
                      }
                    >
                      Overview
                    </span>
                  </h2>
                </div>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">
                  Transaction Hash: {selectedOrder.id}
                </p>
              </div>
              <div className="flex gap-3">
                {/* --- ENHANCED CANCEL BUTTON WITH TOOLTIP --- */}
                <div className="relative group/cancel">
                  <button
                    disabled={!isCancellable || cancelling}
                    onClick={() => handleCancelOrder(selectedOrder.id)}
                    className={`px-6 py-3 cursor-pointer rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 
                      ${
                        isCancellable
                          ? "bg-white border border-rose-200 text-rose-500 hover:bg-rose-50"
                          : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
                      }`}
                  >
                    {cancelling ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <XCircle size={14} />
                    )}
                    Cancel Order
                  </button>

                  {/* Tooltip implementation */}
                  {!isCancellable && isTooLate && (
                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900 text-white text-[9px] font-black rounded-lg opacity-0 group-hover/cancel:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 shadow-xl border border-slate-800">
                      CANCELLATION LOCKED: PHARMACIST IS PROCESSING
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
                    </div>
                  )}
                </div>

                {/* <button className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <Download size={14} /> PDF Invoice
                </button> */}
                <Link href={"/contact"}>
                  <button className="px-6 py-3 cursor-pointer rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2">
                    <HelpCircle size={14} /> Support
                  </button>
                </Link>
              </div>
            </div>

            {/* Live Progress Bar Card */}
            <div className="bg-white rounded-[3rem] border border-slate-200/50 p-10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                <Badge
                  className={`${selectedOrder.status === "cancelled" ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"} border-none px-4 py-2 rounded-xl font-black text-[10px] uppercase`}
                >
                  {selectedOrder.status === "cancelled"
                    ? "Status: Terminated"
                    : "Est: Feb 05, 2026"}
                </Badge>
              </div>

              {selectedOrder.status === "cancelled" ? (
                <div className="flex flex-col items-center py-6 text-rose-500 space-y-3">
                  <XCircle size={48} className="animate-pulse" />
                  <p className="font-black uppercase tracking-[0.4em] text-xs">
                    Medical Request Voided
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4 relative mt-4">
                  <div className="absolute top-7 left-0 w-full h-[3px] bg-slate-100" />
                  {[
                    { id: "placed", icon: ClipboardList, label: "Registered" },
                    {
                      id: "processing",
                      icon: PackageCheck,
                      label: "Pharmacist",
                    },
                    { id: "shipped", icon: Truck, label: "Dispatch" },
                    { id: "delivered", icon: CheckCircle2, label: "Arrival" },
                  ].map((step) => {
                    const status = getStepStatus(step.id, selectedOrder.status);
                    return (
                      <div
                        key={step.id}
                        className="relative z-10 flex flex-col items-center gap-4"
                      >
                        <div
                          className={`h-14 w-14 rounded-[1.5rem] flex items-center justify-center border-4 border-white shadow-xl transition-all duration-700 ${
                            status === "complete"
                              ? "bg-emerald-500 text-white"
                              : status === "active"
                                ? "bg-slate-900 text-white scale-125 rotate-3"
                                : "bg-white text-slate-300 border-slate-100"
                          }`}
                        >
                          <step.icon size={22} />
                        </div>
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest ${status === "pending" ? "text-slate-300" : "text-slate-900"}`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Item Details */}
              <div className="lg:col-span-7 space-y-8">
                <div className="bg-white rounded-[2.5rem] border border-slate-200/50 overflow-hidden shadow-sm">
                  <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-[12px] font-black uppercase tracking-widest text-slate-400">
                      Prescription Contents
                    </h3>
                    <span className="text-emerald-500 font-black text-xs">
                      {selectedOrder.items.length} Medicines
                    </span>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-colors group"
                      >
                        <div className="flex items-center gap-5">
                          <div className="h-16 w-16 rounded-[1.25rem] bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all duration-300 rotate-12 group-hover:rotate-0">
                            <Pill size={24} />
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-lg leading-tight">
                              {item.medicine?.name}
                            </p>
                            <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">
                              {item.medicine?.manufacturer}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-slate-900 text-lg">
                            ${item.price * item.quantity}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Logistics Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/50 space-y-4">
                    <div className="flex items-center gap-3 text-emerald-500">
                      <MapPin size={20} />
                      <h4 className="text-[10px] font-black uppercase tracking-widest">
                        Recipient Information
                      </h4>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-black text-slate-900">
                        {selectedOrder.shippingName}
                      </p>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        {selectedOrder.shippingAddr}
                      </p>
                      <p className="text-xs text-slate-500 font-medium italic">
                        {selectedOrder.shippingPhone}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/50 space-y-4">
                    <div className="flex items-center gap-3 text-emerald-500">
                      <CreditCard size={20} />
                      <h4 className="text-[10px] font-black uppercase tracking-widest">
                        Billing Info
                      </h4>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-black text-slate-900 uppercase">
                        {selectedOrder.paymentMethod}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        Transaction cleared via secure medical gateway.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Sidebar */}
              <div className="lg:col-span-5 space-y-8">
                <div
                  className={`rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group transition-all duration-500 ${selectedOrder.status === "cancelled" ? "bg-slate-800" : "bg-slate-900"}`}
                >
                  <div
                    className={`absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-[80px] group-hover:bg-emerald-500/30 transition-all duration-700 ${selectedOrder.status === "cancelled" ? "bg-rose-500/10" : "bg-emerald-500/20"}`}
                  />
                  <div className="relative z-10 space-y-10">
                    <h3
                      className={`text-[11px] font-black uppercase tracking-[0.3em] ${selectedOrder.status === "cancelled" ? "text-rose-400" : "text-emerald-400"}`}
                    >
                      Financial Summary
                    </h3>

                    <div className="space-y-5">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                          Subtotal
                        </span>
                        <span className="font-black text-lg">
                          ${selectedOrder.totalAmount}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                          Medical Tax
                        </span>
                        <span
                          className={`font-black text-lg ${selectedOrder.status === "cancelled" ? "text-rose-400" : "text-emerald-400"}`}
                        >
                          {selectedOrder.status === "cancelled"
                            ? "Reversed"
                            : "Included"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                          Shipping
                        </span>
                        <span
                          className={`font-black text-lg ${selectedOrder.status === "cancelled" ? "text-rose-400" : "text-emerald-400"}`}
                        >
                          {selectedOrder.status === "cancelled"
                            ? "Voided"
                            : "Free"}
                        </span>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                      <div>
                        <p
                          className={`text-[10px] font-black uppercase tracking-widest mb-1 ${selectedOrder.status === "cancelled" ? "text-rose-500" : "text-emerald-500"}`}
                        >
                          {selectedOrder.status === "cancelled"
                            ? "Refundable Total"
                            : "Total Amount"}
                        </p>
                        <p className="text-5xl font-black tracking-tighter">
                          ${selectedOrder.totalAmount}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-[2.5rem] p-8 border border-amber-100 flex items-start gap-4">
                  <AlertCircle className="text-amber-600 shrink-0" size={24} />
                  <div>
                    <h4 className="text-xs font-black text-amber-900 uppercase tracking-widest mb-1">
                      Pharmacist Note
                    </h4>
                    <p className="text-xs text-amber-700 font-medium leading-relaxed">
                      {selectedOrder.status === "cancelled"
                        ? "This medical request has been terminated. Transaction logs are preserved for your records."
                        : "Please ensure someone is available at the delivery address to sign for sensitive medication."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-300 font-black uppercase tracking-widest">
            Select Order Archive
          </div>
        )}
      </div>
    </div>
  );
}
