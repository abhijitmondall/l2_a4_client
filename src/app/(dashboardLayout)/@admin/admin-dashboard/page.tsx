"use client";

import { useEffect, useState } from "react";
import {
  Users,
  ShoppingBag,
  UserMinus,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Zap,
  Globe,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import api from "@/lib/api/api";
import { cn } from "@/lib/utils";
import { User } from "@/types";

export default function AdminOverviewPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.admin.users.getAll();
        setUsers(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    {
      label: "Total Users",
      val: users.length,
      trend: "+12%",
      up: true,
      icon: Users,
      color: "indigo",
    },
    {
      label: "Revenue",
      val: "$42.5k",
      trend: "+8%",
      up: true,
      icon: Zap,
      color: "amber",
    },
    {
      label: "Sellers",
      val: users.filter((u) => u.role === "seller").length,
      trend: "+5%",
      up: true,
      icon: ShoppingBag,
      color: "violet",
    },
    {
      label: "Banned",
      val: users.filter((u) => u.status === "banned").length,
      trend: "-2%",
      up: false,
      icon: UserMinus,
      color: "rose",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 space-y-10 animate-in fade-in duration-700">
      {/* --- HERO SECTION --- */}
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">
            Systems Overview
          </h1>
          <div className="flex items-center gap-3">
            <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-3 py-1 font-bold">
              ● SYSTEM ONLINE
            </Badge>
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
              <Globe size={12} /> Global Node: Frankfurt v4.2
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="rounded-2xl h-12 px-6 font-bold border-slate-200"
          >
            Generate Report
          </Button>
          <Button className="rounded-2xl h-12 px-6 font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100">
            Broadcast Update
          </Button>
        </div>
      </div>

      {/* --- KPI GRID --- */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <Card
            key={i}
            className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white hover:shadow-md transition-all"
          >
            <CardContent className="p-7">
              <div className="flex justify-between items-start">
                <div className={cn("p-3 rounded-2xl", `bg-${s.color}-50`)}>
                  <s.icon className={cn(`text-${s.color}-600`)} size={24} />
                </div>
                <div
                  className={cn(
                    "flex items-center text-[10px] font-black px-2 py-1 rounded-lg",
                    s.up
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-rose-600 bg-rose-50",
                  )}
                >
                  {s.up ? (
                    <ArrowUpRight size={12} />
                  ) : (
                    <ArrowDownRight size={12} />
                  )}{" "}
                  {s.trend}
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-4xl font-black tracking-tighter text-slate-900">
                  {s.val}
                </h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {s.label}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- PERFORMANCE CHART AREA --- */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-[32px] bg-white p-8">
          <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black italic uppercase tracking-tight">
                Growth Trajectory
              </CardTitle>
              <p className="text-slate-400 text-xs font-medium">
                Monthly user acquisition & retention rate
              </p>
            </div>
            <TrendingUp className="text-indigo-500" size={24} />
          </CardHeader>
          <div className="h-[300px] w-full bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 flex items-center justify-center">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest italic">
              [ Visual Data Feed Placeholder ]
            </p>
          </div>
        </Card>

        {/* --- ACTIVITY LOG --- */}
        <Card className="border-none shadow-sm rounded-[32px] bg-white">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-xl font-black italic uppercase tracking-tight">
              Live Matrix
            </CardTitle>
          </CardHeader>
          <CardContent className="px-8 space-y-6">
            {[
              {
                user: "Alex R.",
                action: "New Store Verified",
                time: "2m ago",
                type: "success",
              },
              {
                user: "System",
                action: "Server Node Optimized",
                time: "14m ago",
                type: "system",
              },
              {
                user: "Jordan M.",
                action: "Suspicious Activity Flagged",
                time: "1h ago",
                type: "warning",
              },
              {
                user: "Sarah L.",
                action: "Tier 3 Subscription",
                time: "3h ago",
                type: "success",
              },
            ].map((log, i) => (
              <div
                key={i}
                className="flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      log.type === "success"
                        ? "bg-emerald-500"
                        : log.type === "warning"
                          ? "bg-rose-500"
                          : "bg-indigo-500",
                    )}
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {log.action}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      {log.user} • {log.time}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={14}
                  className="text-slate-300 group-hover:translate-x-1 transition-transform"
                />
              </div>
            ))}
            <Button
              variant="ghost"
              className="w-full rounded-2xl text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50"
            >
              View All Logs
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* --- SYSTEM HEALTH SEGMENT --- */}
      <div className="max-w-[1400px] mx-auto bg-slate-900 rounded-[40px] p-10 text-white flex flex-col lg:flex-row items-center gap-10">
        <div className="space-y-4 flex-1">
          <Badge className="bg-indigo-500/20 text-indigo-300 border-none font-bold">
            ENGINE STATUS
          </Badge>
          <h2 className="text-3xl font-black tracking-tight italic uppercase">
            Optimization Index: 98.2%
          </h2>
          <p className="text-slate-400 text-sm max-w-md">
            Your platform is currently performing above average. Database
            latency is within the 12ms threshold.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 w-full lg:w-auto">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
              <span>CPU Usage</span>
              <span className="text-indigo-400">24%</span>
            </div>
            <Progress value={24} className="h-2 bg-slate-800" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
              <span>Memory Cache</span>
              <span className="text-emerald-400">89%</span>
            </div>
            <Progress value={89} className="h-2 bg-slate-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
