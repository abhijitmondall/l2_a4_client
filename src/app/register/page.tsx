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

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // All fields matching your Prisma Schema
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
      newErrors.password = "Password must be at least 6 characters";
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
      // 1. Destructure to remove confirmPassword
      const { confirmPassword, ...payload } = formData;

      // 2. CRITICAL API FIX: Convert empty strings to undefined
      // This prevents Prisma Enum errors (for gender) and empty string errors for optional fields
      const registrationPayload = {
        ...payload,
        gender: payload.gender || undefined,
        photo: payload.photo || undefined,
        phone: payload.phone || undefined,
        address: payload.address || undefined,
      };

      const user = await api.auth.signup(registrationPayload);

      // 3. Save User and Token to your Auth Store
      // if (response.user && response.token) {
      //   login(response.user, response.token);
      // }

      toast({
        title: "Registration successful",
        description: `Welcome to MediStore, ${user.name}!`,
        variant: "success",
      });

      setFormData({
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

      // 4. Role-based redirection
      // router.push(
      //   response.user.role === "seller" ? "/seller/dashboard" : "/shop",
      // );
    } catch (error: any) {
      console.error("Signup Error:", error);
      toast({
        title: "Registration failed",
        description:
          error.response?.data?.message ||
          "Please check all fields and try again.",
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
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-2xl shadow-2xl border-t-4 border-t-teal-600">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-teal-50 rounded-full">
              <UserPlus className="w-6 h-6 text-teal-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Create Account
          </CardTitle>
          <CardDescription>
            Enter all details to set up your MediStore profile
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-semibold">
                  <UserIcon className="w-4 h-4 text-teal-600" /> Full Name
                </Label>
                <Input
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-[10px] text-red-500 font-bold uppercase">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Gender (Optional) */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-semibold">
                  <Users className="w-4 h-4 text-teal-600" /> Gender
                </Label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-semibold">
                  <Mail className="w-4 h-4 text-teal-600" /> Email Address
                </Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-[10px] text-red-500 font-bold uppercase">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-semibold">
                  <Phone className="w-4 h-4 text-teal-600" /> Phone Number
                </Label>
                <Input
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              {/* Photo URL */}
              <div className="space-y-2 md:col-span-2">
                <Label className="flex items-center gap-2 font-semibold">
                  <ImageIcon className="w-4 h-4 text-teal-600" /> Profile Image
                  URL
                </Label>
                <Input
                  name="photo"
                  placeholder="https://example.com/avatar.png"
                  value={formData.photo}
                  onChange={handleChange}
                />
              </div>

              {/* Address */}
              <div className="space-y-2 md:col-span-2">
                <Label className="flex items-center gap-2 font-semibold">
                  <MapPin className="w-4 h-4 text-teal-600" /> Residential
                  Address
                </Label>
                <Input
                  name="address"
                  placeholder="123 Health St, Medical District"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-semibold">
                  <Lock className="w-4 h-4 text-teal-600" /> Password
                </Label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={
                      errors.password ? "border-red-500 pr-10" : "pr-10"
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[10px] text-red-500 font-bold uppercase">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label className="font-semibold">Confirm Password</Label>
                <Input
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-[10px] text-red-500 font-bold uppercase">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Role Dropdown */}
              <div className="space-y-2 md:col-span-2">
                <Label className="flex items-center gap-2 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-teal-600" /> Register As
                </Label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none font-medium"
                >
                  <option value="customer">Customer (I want to buy)</option>
                  <option value="seller">Seller (I am a Pharmacist)</option>
                </select>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-4">
            <Button
              type="submit"
              className="w-full cursor-pointer bg-teal-600 hover:bg-teal-700 h-12 text-white shadow-lg transition-all active:scale-[0.98] font-bold text-lg"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" /> Processing...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground font-medium">
              Already have an account?
              <Link
                href="/login"
                className="font-bold text-teal-600 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
