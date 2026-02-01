"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Save,
  User,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Camera,
  LogOut,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/store";
import { toast } from "@/hooks/useToast";
import api from "@/lib/api/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, updateUser, initialize, logout } =
    useAuthStore();

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    photo: "",
  });

  const [passwords, setPasswords] = useState({
    password: "",
    passwordConfirm: "",
  });

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
    if (user?.role === "admin") {
      router.push("/admin-dashboard/settings");
    }

    if (user?.role === "seller") {
      router.push("/seller-dashboard/settings");
    }

    if (user?.role === "customer") {
      router.push("/dashboard/settings");
    }

    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        photo: user.photo || "",
      });
    }
  }, [isLoading, isAuthenticated, user, router]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const updatedUser = await api.auth.updateMe(formData);
      updateUser(updatedUser);
      toast({
        title: "Success",
        description: "Profile synchronized.",
        variant: "success",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update",
        variant: "destructive",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.password !== passwords.passwordConfirm) {
      return toast({
        title: "Error",
        description: "Passwords mismatch.",
        variant: "destructive",
      });
    }
    setPasswordLoading(true);
    try {
      await api.auth.updateMyPassword(passwords);
      setPasswords({ password: "", passwordConfirm: "" });
      toast({
        title: "Success",
        description: "Credentials updated.",
        variant: "success",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Update failed",
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (isLoading)
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

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-20 font-sans">
      {/* --- HEADER SECTION --- */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-white shadow-2xl transition-transform group-hover:scale-105 duration-500">
                <AvatarImage src={formData.photo} />
                <AvatarFallback className="bg-emerald-500 text-white text-3xl font-black">
                  {formData.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 bg-slate-900 p-2 rounded-xl text-white shadow-lg cursor-pointer">
                <Camera size={16} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
                  {formData.name || "MediUser"}
                </h1>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-none rounded-lg text-[10px] font-black uppercase tracking-widest">
                  Verified Client
                </Badge>
              </div>
              <p className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                <Mail size={14} className="text-emerald-500" /> {user?.email}
              </p>
            </div>
          </div>
          <Button
            onClick={() => logout()}
            variant="ghost"
            className="rounded-2xl cursor-pointer border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 text-[10px] font-black uppercase tracking-widest px-8 h-14"
          >
            <LogOut size={16} className="mr-2" /> Sign Out
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* --- LEFT COLUMN: PERSONAL INFO --- */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white rounded-[3rem] shadow-sm border border-slate-200/50 overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500 p-2 rounded-xl text-white">
                  <User size={18} />
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">
                  Personal Metadata
                </h3>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="p-10 space-y-8">
              <div className="space-y-6">
                <div className="grid gap-3">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    Avatar Source URL
                  </Label>
                  <Input
                    className="h-14 rounded-2xl bg-slate-50 border-none font-bold focus:ring-2 focus:ring-emerald-500/20"
                    value={formData.photo}
                    onChange={(e) =>
                      setFormData({ ...formData, photo: e.target.value })
                    }
                    placeholder="https://image-cloud.com/user-01.png"
                  />
                </div>

                <div className="grid gap-3">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    Display Name
                  </Label>
                  <Input
                    className="h-14 rounded-2xl bg-slate-50 border-none font-bold focus:ring-2 focus:ring-emerald-500/20"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-3">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                      Phone Line
                    </Label>
                    <div className="relative">
                      <Phone
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                        size={16}
                      />
                      <Input
                        className="h-14 pl-12 rounded-2xl bg-slate-50 border-none font-bold focus:ring-2 focus:ring-emerald-500/20"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                      Primary Location
                    </Label>
                    <div className="relative">
                      <MapPin
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                        size={16}
                      />
                      <Input
                        className="h-14 pl-12 rounded-2xl bg-slate-50 border-none font-bold focus:ring-2 focus:ring-emerald-500/20"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={profileLoading}
                  className="h-14 px-10 cursor-pointer rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-slate-200"
                >
                  {profileLoading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Save className="mr-2" size={16} />
                  )}
                  Sync Changes
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* --- RIGHT COLUMN: SECURITY --- */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-[80px] group-hover:bg-emerald-500/30 transition-all duration-1000" />

            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-xl text-emerald-400">
                  <Lock size={18} />
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-400">
                  Access Control
                </h3>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                      New Secure Password
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="h-14 rounded-2xl bg-white/5 border-white/10 text-white font-bold focus:ring-emerald-500/20 pr-12"
                        value={passwords.password}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            password: e.target.value,
                          })
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-400 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                      Confirm Identity
                    </Label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      className="h-14 rounded-2xl bg-white/5 border-white/10 text-white font-bold focus:ring-emerald-500/20"
                      value={passwords.passwordConfirm}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          passwordConfirm: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full h-14 cursor-pointer rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
                >
                  {passwordLoading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <ShieldCheck className="mr-2" size={16} />
                  )}
                  Reset Gateway Key
                </Button>
              </form>
            </div>
          </div>

          {/* Security Alert */}
          <div className="bg-amber-50 rounded-[2.5rem] p-8 border border-amber-100 flex items-start gap-4">
            <ShieldCheck className="text-amber-600 shrink-0" size={24} />
            <div>
              <h4 className="text-xs font-black text-amber-900 uppercase tracking-widest mb-1">
                Privacy Notice
              </h4>
              <p className="text-xs text-amber-700 font-medium leading-relaxed">
                Your medical history and prescription records are encrypted. We
                never share your data with third-party advertisers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
