"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  UserPlus,
  Mail,
  Lock,
  User as UserIcon,
  ShieldCheck,
  Image as ImageIcon,
  Users,
  Phone,
  MapPin,
  Loader2,
  ChevronRight,
  Pill,
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
import { toast } from "@/hooks/useToast";
import api from "@/lib/api/api";
import { User } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer" as "customer" | "seller",
    photo: "",
    phone: "",
    address: "",
    gender: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Min. 6 characters required";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { confirmPassword, ...payload } = formData;
      const registrationPayload = {
        ...payload,
        gender: payload.gender || undefined,
        photo: payload.photo || undefined,
        phone: payload.phone || undefined,
        address: payload.address || undefined,
      };

      const res = await api.auth.signup(registrationPayload as User);

      const { user, token } = res;

      login(res.user, token);
      toast({
        title: "Registry Created",
        description: `Account verified for ${user.name}.`,
        variant: "success",
      });

      router.push(user.role === "seller" ? "/seller-dashboard" : "/shop");
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description:
          error.response?.data?.message || "Verify your data and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background Tech Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: "radial-gradient(#10b981 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <Card className="w-full max-w-2xl shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] border-none rounded-[2.5rem] relative z-10 overflow-hidden">
        <div className="h-2 bg-emerald-500 w-full" />

        <CardHeader className="text-center pt-10 pb-6">
          <div className="flex justify-center mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 shadow-xl shadow-emerald-500/10">
              <Pill className="h-7 w-7 text-white rotate-45" />
            </div>
          </div>
          <CardTitle className="text-3xl font-black tracking-tighter uppercase text-slate-900">
            Medi<span className="text-emerald-500">Register</span>
          </CardTitle>
          <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Initialize New Clinical Profile
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-8 px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 flex items-center gap-2">
                  <UserIcon size={12} className="text-emerald-500" /> Full Name
                </Label>
                <Input
                  name="name"
                  placeholder="e.g. Dr. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className={`h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all ${errors.name ? "border-red-500 ring-1 ring-red-500" : ""}`}
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 flex items-center gap-2">
                  <Users size={12} className="text-emerald-500" /> Gender
                </Label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none appearance-none cursor-pointer"
                >
                  <option value="">Identify Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 flex items-center gap-2">
                  <Mail size={12} className="text-emerald-500" /> Secure Email
                </Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="name@organization.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all ${errors.email ? "border-red-500 ring-1 ring-red-500" : ""}`}
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 flex items-center gap-2">
                  <Phone size={12} className="text-emerald-500" /> Contact Line
                </Label>
                <Input
                  name="phone"
                  placeholder="+1.000.000.000"
                  value={formData.phone}
                  onChange={handleChange}
                  className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all"
                />
              </div>

              {/* Profile Photo */}
              <div className="md:col-span-2 space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 flex items-center gap-2">
                  <ImageIcon size={12} className="text-emerald-500" /> Digital
                  Avatar URL
                </Label>
                <Input
                  name="photo"
                  placeholder="https://cdn.repository.com/user-01.png"
                  value={formData.photo}
                  onChange={handleChange}
                  className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2 space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 flex items-center gap-2">
                  <MapPin size={12} className="text-emerald-500" /> Deployment
                  Address
                </Label>
                <Input
                  name="address"
                  placeholder="Unit 04, Health District, Global Sector"
                  value={formData.address}
                  onChange={handleChange}
                  className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 flex items-center gap-2">
                  <Lock size={12} className="text-emerald-500" /> Set Key
                </Label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={`h-12 pr-10 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all ${errors.password ? "border-red-500 ring-1 ring-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                  Confirm Key
                </Label>
                <Input
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all ${errors.confirmPassword ? "border-red-500 ring-1 ring-red-500" : ""}`}
                />
              </div>

              {/* Role */}
              <div className="md:col-span-2 space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 flex items-center gap-2">
                  <ShieldCheck size={12} className="text-emerald-500" />{" "}
                  Registry Class
                </Label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none cursor-pointer"
                >
                  <option value="customer">Customer (Buyer)</option>
                  <option value="seller">Seller (Pharmacist/Seller)</option>
                </select>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-6 p-10 pt-4">
            <Button
              type="submit"
              className="w-full h-14 cursor-pointer bg-slate-900 hover:bg-emerald-600 text-white font-black uppercase text-xs tracking-[0.2em] rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-[0.98] group"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Initialize Profile{" "}
                  <ChevronRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </span>
              )}
            </Button>

            <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
              Already Registered?{" "}
              <Link
                href="/login"
                className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4"
              >
                Access Portal
              </Link>
            </p>

            <div className="flex items-center justify-center gap-2 opacity-50">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-900">
                MediStore Security Protocol v2.4
              </span>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
