"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Heart,
  History,
  ShieldCheck,
  Store,
  Users,
  ShieldAlert,
  BarChart3,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useAuthStore } from "@/lib/store";

export default function DashboardLayout({
  customer,
  seller,
  admin, // Added Admin Slot
}: {
  customer: React.ReactNode;
  seller: React.ReactNode;
  admin: React.ReactNode;
}) {
  const { user, logout, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    // Role-based routing logic
    if (user?.role === "admin" && pathname === "/dashboard") {
      router.push("/admin-dashboard");
    } else if (user?.role === "seller" && pathname === "/dashboard") {
      router.push("/seller-dashboard");
    } else if (
      user?.role === "customer" &&
      (pathname.startsWith("/seller-dashboard") ||
        pathname.startsWith("/admin-dashboard"))
    ) {
      router.push("/dashboard");
    }
  }, [user, pathname, router, isLoading]);

  const adminNav = [
    { name: "Global Overview", href: "/admin-dashboard", icon: BarChart3 },
    {
      name: "Manage Users",
      href: "/admin-dashboard/manage-users",
      icon: Users,
    },
    // {
    //   name: "Seller Verifications",
    //   href: "/admin-dashboard/verifications",
    //   icon: ShieldAlert,
    // },
    {
      name: "All Transactions",
      href: "/admin-dashboard/orders",
      icon: FileText,
    },
    {
      name: "System Settings",
      href: "/admin-dashboard/settings",
      icon: Settings,
    },
  ];

  const sellerNav = [
    { name: "Overview", href: "/seller-dashboard", icon: LayoutDashboard },
    { name: "Inventory", href: "/seller-dashboard/medicines", icon: Package },
    { name: "Orders", href: "/seller-dashboard/orders", icon: ShoppingBag },
    {
      name: "Add Product",
      href: "/seller-dashboard/add-medicine",
      icon: PlusCircle,
    },
  ];

  const customerNav = [
    { name: "My Activity", href: "/dashboard", icon: LayoutDashboard },
    { name: "Order History", href: "/dashboard/orders", icon: History },
    { name: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  // Helper to determine Nav based on role
  const getNavItems = () => {
    switch (user?.role) {
      case "admin":
        return adminNav;
      case "seller":
        return sellerNav;
      default:
        return customerNav;
    }
  };

  const currentNav = getNavItems();

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Toaster />

      {/* --- SIDEBAR --- */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full p-6">
          {/* Branding with dynamic color logic */}
          <div className="flex items-center gap-3 px-2 mb-10">
            <div
              className={cn(
                "h-10 w-10 rounded-2xl flex items-center justify-center text-white shadow-lg",
                user.role === "admin"
                  ? "bg-indigo-600 shadow-indigo-100"
                  : "bg-teal-600 shadow-teal-100",
              )}
            >
              {user.role === "admin" ? (
                <ShieldAlert size={22} strokeWidth={2.5} />
              ) : (
                <ShieldCheck size={22} strokeWidth={2.5} />
              )}
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 block leading-none italic uppercase">
                Mediship
              </span>
              <span
                className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  user.role === "admin" ? "text-indigo-600" : "text-teal-600",
                )}
              >
                {user.role} Control
              </span>
            </div>
          </div>

          <nav className="flex-1 space-y-1.5">
            <Link
              href="/shop"
              className="flex items-center gap-3 px-4 py-3.5 mb-6 rounded-2xl text-sm font-bold transition-all bg-slate-950 text-white hover:bg-slate-800 shadow-xl shadow-slate-200"
            >
              <Store
                size={20}
                className={
                  user.role === "admin" ? "text-indigo-400" : "text-teal-400"
                }
              />
              Go to Shop
            </Link>

            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-2">
              Management
            </div>

            {currentNav.map((link) => {
              const isActive = pathname === link.href;
              const activeStyles =
                user.role === "admin"
                  ? "bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100/10"
                  : "bg-teal-50 text-teal-700 shadow-sm shadow-teal-100/10";

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group",
                    isActive
                      ? activeStyles
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  <link.icon
                    size={20}
                    className={cn(
                      isActive
                        ? user.role === "admin"
                          ? "text-indigo-600"
                          : "text-teal-600"
                        : "text-slate-400 group-hover:text-slate-900",
                    )}
                  />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-slate-100 space-y-4">
            <div className="px-4 py-3 bg-slate-50 rounded-2xl flex items-center gap-3 border border-slate-100">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-white font-black text-xs shadow-sm",
                  user.role === "admin" ? "bg-indigo-500" : "bg-teal-500",
                )}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-slate-900 truncate uppercase italic tracking-tighter">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-500 truncate font-medium">
                  {user.email}
                </p>
              </div>
            </div>
            <Button
              onClick={logout}
              variant="ghost"
              className="w-full justify-start gap-3 px-4 py-4 rounded-2xl text-slate-400 font-bold hover:bg-rose-50 hover:text-rose-600 transition-colors uppercase text-[10px] tracking-widest"
            >
              <LogOut size={18} />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 sticky top-0 z-40">
          <div
            className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center text-white font-black",
              user.role === "admin" ? "bg-indigo-600" : "bg-teal-600",
            )}
          >
            M
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X /> : <Menu />}
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-10 max-w-[1600px] mx-auto">
            {/* Dynamic role-based rendering */}
            {user.role === "admin"
              ? admin
              : user.role === "seller"
                ? seller
                : customer}
          </div>
        </main>
      </div>
    </div>
  );
}
