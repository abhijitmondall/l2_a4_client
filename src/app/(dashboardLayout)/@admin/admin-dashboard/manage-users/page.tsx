"use client";

import { useEffect, useState } from "react";
import {
  Search,
  MoreHorizontal,
  UserCheck,
  UserX,
  Trash2,
  ShieldCheck,
  Mail,
  Loader2,
  Users,
  Activity,
  AlertCircle,
  ShieldAlert,
  ShoppingBag,
  UserMinus,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { toast } from "@/hooks/useToast";
import api from "@/lib/api/api";
import { cn } from "@/lib/utils";
import { User } from "@/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [activeDialog, setActiveDialog] = useState<"delete" | "status" | null>(
    null,
  );
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await api.admin.users.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({ variant: "destructive", title: "Sync Error" });
    } finally {
      setLoading(false);
    }
  };

  // Helper for dynamic Role colors
  const getRoleStyles = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-50";
      case "seller":
        return "bg-violet-50 text-violet-700 border-violet-100 hover:bg-violet-50";
      case "customer":
        return "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100";
      default:
        return "bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-50";
    }
  };

  const closeDialogs = () => {
    setActiveDialog(null);
    setSelectedUser(null);
  };

  const handleStatusUpdate = async () => {
    if (!selectedUser) return;
    setUpdatingId(selectedUser.id);
    const nextStatus = selectedUser.status === "active" ? "banned" : "active";

    try {
      await api.admin.users.updateStatus(selectedUser.id, {
        status: nextStatus as "active" | "banned",
      });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, status: nextStatus } : u,
        ),
      );
      toast({
        title: "Status Synchronized",
        description: `${selectedUser.name} is now ${nextStatus}.`,
        variant: "success",
      });
    } catch (error) {
      toast({ variant: "destructive", title: "Update Failed" });
    } finally {
      setUpdatingId(null);
      closeDialogs();
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setUpdatingId(selectedUser.id);
    try {
      await api.admin.users.delete(selectedUser.id);
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      toast({
        title: `Deleted Successfully!`,
        description: `${selectedUser.name} has been purged.`,
        variant: "success",
      });
    } catch (error) {
      toast({ variant: "destructive", title: "Delete Failed" });
    } finally {
      setUpdatingId(null);
      closeDialogs();
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const stats = [
    {
      label: "Total Population",
      count: users.length,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Verified Sellers",
      count: users.filter((u) => u.role === "seller").length,
      icon: ShoppingBag,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Active Customers",
      count: users.filter((u) => u.role === "customer" && u.status === "active")
        .length,
      icon: Activity,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Restricted",
      count: users.filter((u) => u.status === "banned").length,
      icon: UserMinus,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  if (loading)
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#FDFDFF]">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic">
            Control Center
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1 flex items-center gap-2 justify-center md:justify-start">
            <ShieldCheck size={14} className="text-indigo-500" /> Secured
            Registry Access
          </p>
        </div>

        <div className="relative w-full md:w-96 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors"
            size={16}
          />
          <Input
            placeholder="Search credentials or identities..."
            className="pl-11 h-14 bg-white border-none shadow-sm rounded-2xl text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-indigo-500/10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, idx) => (
          <Card
            key={idx}
            className="border-none shadow-sm rounded-[24px] bg-white overflow-hidden group hover:shadow-md transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div
                  className={cn("p-3 rounded-2xl transition-colors", item.bg)}
                >
                  <item.icon size={22} className={item.color} />
                </div>
                {item.label === "Active Customers" && (
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </div>
              <div className="mt-5">
                <h3 className="text-3xl font-black tracking-tighter text-slate-900">
                  {item.count}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {item.label}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Table Area */}
      <div className="max-w-[1400px] mx-auto bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-6">Identity</th>
                <th className="px-4 py-6">Role</th>
                <th className="px-4 py-6">Status</th>
                <th className="px-8 py-6 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="group transition-colors hover:bg-slate-50/30"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "h-11 w-11 rounded-2xl flex items-center justify-center font-bold text-sm transition-all",
                          user.status === "active"
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                            : "bg-slate-100 text-slate-400",
                        )}
                      >
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block text-[13px] uppercase italic tracking-tight">
                          {user.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold lowercase flex items-center gap-1 mt-0.5">
                          <Mail size={10} /> {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] font-black uppercase tracking-widest rounded-lg px-2.5 py-1 border transition-colors",
                        getRoleStyles(user.role),
                      )}
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-5">
                    <div
                      className={cn(
                        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-colors",
                        user.status === "active"
                          ? "text-emerald-600 bg-emerald-50"
                          : "text-rose-600 bg-rose-50",
                      )}
                    >
                      <div
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          user.status === "active"
                            ? "bg-emerald-500 shadow-[0_0_8px_#10b981]"
                            : "bg-rose-500",
                        )}
                      />
                      {user.status}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-10 w-10 cursor-pointer p-0 rounded-xl hover:bg-slate-100 group-hover:rotate-90 transition-transform"
                        >
                          <MoreHorizontal
                            size={18}
                            className="text-slate-400"
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 rounded-2xl shadow-xl border-slate-100 p-1.5"
                      >
                        <DropdownMenuLabel className="text-[9px] font-black text-slate-400 uppercase tracking-widest p-2">
                          Security Actions
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user);
                            setActiveDialog("status");
                          }}
                          className={cn(
                            "font-bold text-[10px] uppercase p-3 rounded-xl cursor-pointer",
                            user.status === "active"
                              ? "text-rose-600"
                              : "text-emerald-600",
                          )}
                        >
                          {user.status === "active" ? (
                            <UserX size={14} className="mr-2" />
                          ) : (
                            <UserCheck size={14} className="mr-2" />
                          )}
                          {user.status === "active"
                            ? "Suspend Access"
                            : "Restore Access"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user);
                            setActiveDialog("delete");
                          }}
                          className="text-rose-600 font-bold text-[10px] uppercase p-3 rounded-xl cursor-pointer focus:bg-rose-50"
                        >
                          <Trash2 className="mr-2" size={14} /> Delete Identity
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- STATUS DIALOG --- */}
      <Dialog open={activeDialog === "status"} onOpenChange={closeDialogs}>
        <DialogContent className="sm:max-w-[400px] rounded-[32px] border-none p-8 shadow-2xl">
          <DialogHeader className="items-center text-center">
            <div className="h-14 w-14 bg-indigo-50 rounded-[20px] flex items-center justify-center mb-4 transition-transform hover:scale-110">
              <ShieldAlert className="text-indigo-600" size={28} />
            </div>
            <DialogTitle className="text-xl font-black uppercase italic tracking-tight">
              Security Update
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-sm font-medium mt-2 leading-relaxed">
              Confirm status change for{" "}
              <span className="font-bold text-slate-900 underline decoration-indigo-200">
                {selectedUser?.name}
              </span>
              ?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-8">
            <Button
              variant="outline"
              onClick={closeDialogs}
              className="flex-1 rounded-2xl cursor-pointer font-bold h-12 border-slate-100 bg-slate-50 hover:bg-slate-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={!!updatingId}
              className="flex-1 rounded-2xl cursor-pointer font-bold h-12 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
            >
              {updatingId ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Authorize"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- PURGE DIALOG --- */}
      <Dialog open={activeDialog === "delete"} onOpenChange={closeDialogs}>
        <DialogContent className="sm:max-w-[400px] rounded-[32px] border-none p-8 text-center shadow-2xl">
          <DialogHeader className="items-center">
            <div className="h-14 w-14 bg-rose-50 rounded-[20px] flex items-center justify-center mb-4">
              <AlertCircle className="text-rose-600" size={28} />
            </div>
            <DialogTitle className="text-xl font-black uppercase italic tracking-tight text-rose-600">
              Irreversible Purge
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-sm font-medium mt-2 leading-relaxed">
              Caution: Deleting{" "}
              <span className="font-bold text-slate-900">
                {selectedUser?.email}
              </span>{" "}
              will remove all records permanently.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-8">
            <Button
              onClick={handleDelete}
              disabled={!!updatingId}
              className="w-full rounded-2xl cursor-pointer font-bold h-14 bg-rose-600 hover:bg-rose-700 shadow-xl shadow-rose-100 transition-all active:scale-95"
            >
              {updatingId ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Confirm Permanent Deletion"
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={closeDialogs}
              className="w-full cursor-pointer rounded-2xl font-bold h-12 text-slate-400 hover:text-slate-600"
            >
              Abort Operation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
