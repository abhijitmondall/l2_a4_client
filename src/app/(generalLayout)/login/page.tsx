"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ChevronRight,
  UserCheck,
  Pill,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/lib/store";
import { Spinner } from "@/components/ui/spinner";
import api from "@/lib/api/api";
import { toast } from "@/hooks/useToast";

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid format";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await api.auth.signin(formData);
      const { user, token } = response;
      login(user, token);
      toast({
        title: "Authorized",
        description: `Welcome back, ${user.name}`,
        variant: "success",
      });
      router.push(user.role === "seller" ? "/seller-dashboard" : "/shop");
    } catch (error: any) {
      toast({
        title: "Access Denied",
        description: error.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof typeof errors]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  if (user) {
    return (
      <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4">
        <Card className="w-full max-w-sm border-slate-200/60 shadow-2xl rounded-[2rem] overflow-hidden">
          <div className="bg-slate-900 p-8 text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
                <UserCheck className="w-10 h-10 text-emerald-500" />
              </div>
            </div>
            <h1 className="text-xl font-black text-white uppercase tracking-tighter">
              Active Session
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
              Identified as: {user.name}
            </p>
          </div>
          <CardContent className="p-8 flex flex-col gap-3 bg-white">
            <Button
              onClick={() => router.push("/profile")}
              className="w-full bg-slate-900 cursor-pointer hover:bg-emerald-600 text-white font-black uppercase text-[10px] tracking-[0.2em] h-12 rounded-xl transition-all"
            >
              Go to Profile
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/shop")}
              className="w-full border-slate-200 cursor-pointer text-slate-600 font-black uppercase text-[10px] tracking-[0.2em] h-12 rounded-xl hover:bg-slate-50"
            >
              Return to Shop
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-slate-50/50">
      {/* Subtle background tech pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: "radial-gradient(#10b981 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <Card className="w-full max-w-md shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] border-none rounded-[2.5rem] relative z-10 overflow-hidden">
        <div className="h-2 bg-emerald-500 w-full" />

        <CardHeader className="space-y-4 text-center pt-10 px-8">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 shadow-xl shadow-emerald-500/10">
              <Pill className="h-7 w-7 text-white rotate-45" />
            </div>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-black tracking-tighter uppercase text-slate-900">
              Medi<span className="text-emerald-500">Access</span>
            </CardTitle>
            <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Secure Registry Authentication
            </CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 px-8">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1"
              >
                Registry Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@organization.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`h-12 pl-10 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all focus:ring-emerald-500/20 ${errors.email ? "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,1)]" : ""}`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <Label
                  htmlFor="password"
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500"
                >
                  Access Key
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-[9px] font-black uppercase tracking-[0.1em] text-emerald-600 hover:text-emerald-700"
                >
                  Reset Key?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`h-12 pl-10 pr-10 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all focus:ring-emerald-500/20 ${errors.password ? "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,1)]" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-6 p-8 pt-4">
            <Button
              type="submit"
              className="w-full h-12 cursor-pointer bg-slate-900 hover:bg-emerald-600 text-white font-black uppercase text-xs tracking-[0.2em] rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-[0.98] group"
              disabled={loading}
            >
              {loading ? (
                <Spinner className="h-4 w-4 border-white" />
              ) : (
                <span className="flex items-center gap-2">
                  Verify Credentials{" "}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>

            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-100" />
              </div>
              <span className="relative flex justify-center">
                <span className="bg-white px-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                  Unauthorized Access Prohibited
                </span>
              </span>
            </div>

            <Link href="/register" className="w-full">
              <Button
                variant="ghost"
                type="button"
                className="w-full h-12 cursor-pointer text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50 font-black uppercase text-[10px] tracking-[0.2em] rounded-xl transition-all"
              >
                Create New Registry Account
              </Button>
            </Link>

            <div className="flex items-center justify-center gap-2 pt-2 text-slate-300">
              <ShieldCheck size={14} />
              <span className="text-[8px] font-black uppercase tracking-widest">
                End-to-End Encrypted Secure Portal
              </span>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
