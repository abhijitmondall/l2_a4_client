"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Mail,
  LogIn,
  Eye,
  EyeOff,
  ChevronRight,
  UserCheck,
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
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Min. 6 characters required";
    }

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
        title: "Welcome Back!",
        description: `Logged in as ${user.name}`,
        variant: "success",
      });

      if (user.role === "seller") {
        router.push("/seller/dashboard");
      } else {
        router.push("/shop");
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description:
          error.response?.data?.message || "Invalid email or password",
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

  // Logged in State
  if (user) {
    return (
      <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4">
        <Card className="w-full max-w-sm text-center p-6 border-t-4 border-teal-600 shadow-xl">
          <div className="flex justify-center mb-4">
            <div className="bg-teal-50 p-4 rounded-full">
              <UserCheck className="w-10 h-10 text-teal-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Already Signed In</h1>
          <p className="text-muted-foreground mb-6 text-sm">
            You are currently logged in as {user.name}.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => router.push("/profile")}
              className="w-full bg-teal-600 hover:bg-teal-700"
            >
              Go to Profile
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/shop")}
              className="w-full"
            >
              Return to Shop
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-teal-600 transition-all duration-300">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <div className="bg-teal-50 p-3 rounded-2xl mb-2">
              <LogIn className="w-8 h-8 text-teal-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-base">
            Access your MediStore account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="flex items-center gap-2 font-medium"
              >
                <Mail className="w-4 h-4 text-teal-600" /> Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`h-11 transition-all focus:ring-2 focus:ring-teal-500 ${errors.email ? "border-red-500 bg-red-50/30" : "bg-gray-50/50"}`}
              />
              {errors.email && (
                <p className="text-xs font-bold text-red-500 uppercase flex items-center gap-1">
                  <span>●</span> {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label
                  htmlFor="password"
                  className="flex items-center gap-2 font-medium"
                >
                  <Lock className="w-4 h-4 text-teal-600" /> Password
                </Label>
                <Link
                  href="/forgot-password"
                  size="sm"
                  className="text-xs text-teal-600 hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`h-11 pr-10 transition-all focus:ring-2 focus:ring-teal-500 ${errors.password ? "border-red-500 bg-red-50/30" : "bg-gray-50/50"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-bold text-red-500 uppercase flex items-center gap-1">
                  <span>●</span> {errors.password}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-6 pt-2">
            <Button
              type="submit"
              className="w-full h-12 cursor-pointer bg-teal-600 hover:bg-teal-700 text-lg font-bold shadow-md transition-all active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Spinner className="h-5 w-5 border-white" /> Verifying...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ChevronRight className="w-5 h-5" />
                </span>
              )}
            </Button>

            <div className="relative w-full text-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <span className="relative bg-white px-4 text-xs text-muted-foreground uppercase font-semibold">
                New to MediStore?
              </span>
            </div>

            <Link href="/register" className="w-full">
              <Button
                variant="outline"
                type="button"
                className="w-full h-11 border-teal-600 text-teal-600 hover:bg-teal-50 font-bold"
              >
                Create an Account
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
