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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAuthStore } from "@/lib/store";
import { toast } from "@/hooks/useToast";
import api from "@/lib/api/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, updateUser, initialize } =
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

  // 1. Initialize Store
  useEffect(() => {
    initialize();
  }, [initialize]);

  // 2. Sync form with user data once loaded
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
    if (user?.role === "admin") {
      router.push("/admin-dashboard/settings");
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
        description: "Profile updated.",
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
        description: "Passwords do not match.",
        variant: "destructive",
      });
    }
    setPasswordLoading(true);
    try {
      await api.auth.updateMyPassword(passwords);
      setPasswords({ password: "", passwordConfirm: "" });
      toast({
        title: "Success",
        description: "Password changed successfully.",
        variant: "success",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">
          Loading account...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="border-b pb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Account Settings
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your profile and security credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <aside>
            <Card className="pt-8 pb-6 flex flex-col items-center shadow-sm">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage src={formData.photo} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                  {formData.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h3 className="mt-4 font-semibold text-lg">
                {formData.name || "User"}
              </h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </Card>
          </aside>

          <div className="md:col-span-2 space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-md flex items-center gap-2">
                  <User className="w-4 h-4" /> Personal Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="photo">Avatar URL</Label>
                    <Input
                      id="photo"
                      value={formData.photo}
                      onChange={(e) =>
                        setFormData({ ...formData, photo: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Location</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={profileLoading}
                      className="cursor-pointer"
                    >
                      {profileLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save Profile
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-md flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" /> Security
                </CardTitle>
                <CardDescription>
                  Update your login password below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="grid gap-2">
                    <Label>New Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={passwords.password}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            password: e.target.value,
                          })
                        }
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Confirm Password</Label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={passwords.passwordConfirm}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          passwordConfirm: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="outline"
                      disabled={passwordLoading}
                      className="border-blue-200 hover:bg-blue-50 cursor-pointer "
                    >
                      {passwordLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <ShieldCheck className="h-4 w-4 mr-2" />
                      )}
                      Change Password
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
