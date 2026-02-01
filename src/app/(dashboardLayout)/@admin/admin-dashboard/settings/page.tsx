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
  Globe,
  Phone,
  MapPin,
  Camera,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import { useAuthStore } from "@/lib/store";
import { toast } from "@/hooks/useToast";
import api from "@/lib/api/api";

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

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
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
        description: "Your profile has been synchronized.",
        variant: "success",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Update failed",
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
        title: "Validation Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
    }
    setPasswordLoading(true);
    try {
      await api.auth.updateMyPassword(passwords);
      setPasswords({ password: "", passwordConfirm: "" });
      toast({
        title: "Security Updated",
        description: "Your password has been changed successfully.",
        variant: "success",
      });
    } catch (error: any) {
      toast({
        title: "Security Error",
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
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <Loader2
          className="h-12 w-12 animate-spin text-primary/60"
          strokeWidth={1.5}
        />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Initializing Profile...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Page Header */}
        <header className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">
            Account Settings
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Configure your professional identity and security protocols.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Info */}
          <aside className="lg:col-span-4 space-y-6">
            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-3xl overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-slate-800 to-slate-900" />
              <div className="px-6 pb-8">
                <div className="relative -mt-12 mb-4">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-xl rounded-2xl">
                    <AvatarImage
                      src={formData.photo}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-slate-100 text-slate-400 text-2xl font-bold">
                      {formData.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 p-1.5 bg-white rounded-lg shadow-md border border-slate-100">
                    <Camera size={14} className="text-slate-600" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-xl text-slate-900 tracking-tight">
                    {formData.name || "Access User"}
                  </h3>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider">
                    {user?.role || "Member"}
                  </p>
                  <div className="flex items-center gap-2 text-slate-400 pt-2">
                    <Globe size={14} />
                    <p className="text-[11px] font-medium truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="p-6 bg-indigo-50/50 border border-indigo-100/50 rounded-3xl">
              <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">
                Security Level
              </h4>
              <p className="text-xs text-indigo-900 leading-relaxed font-medium">
                Your account is currently protected by standard encrypted
                protocols. Rotate keys every 90 days.
              </p>
            </div>
          </aside>

          {/* Main Forms */}
          <div className="lg:col-span-8 space-y-8">
            {/* Profile Form */}
            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-3xl overflow-hidden">
              <CardHeader className="px-8 pt-8 pb-0">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-3 text-slate-400">
                  <User size={16} className="text-primary" /> Profile Identity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Avatar Source URL
                    </Label>
                    <Input
                      value={formData.photo}
                      onChange={(e) =>
                        setFormData({ ...formData, photo: e.target.value })
                      }
                      placeholder="https://..."
                      className="h-12 border-slate-100 bg-slate-50/50 focus:bg-white transition-all rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Full Legal Name
                      </Label>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="h-12 border-slate-100 bg-slate-50/50 focus:bg-white rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Phone Contact
                      </Label>
                      <div className="relative">
                        <Phone
                          size={14}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                        />
                        <Input
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="pl-10 h-12 border-slate-100 bg-slate-50/50 focus:bg-white rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Address
                    </Label>
                    <div className="relative">
                      <MapPin
                        size={14}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      />
                      <Input
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        className="pl-10 h-12 border-slate-100 bg-slate-50/50 focus:bg-white rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={profileLoading}
                      className="h-12 px-8 cursor-pointer rounded-xl font-bold uppercase text-[11px] tracking-widest shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                    >
                      {profileLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Sync Identity
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Password Form */}
            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-3xl overflow-hidden border-t-4 border-t-primary/10">
              <CardHeader className="px-8 pt-8 pb-0">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-3 text-slate-400">
                  <Lock size={16} className="text-blue-500" /> Security Core
                </CardTitle>
                <CardDescription className="text-xs font-medium">
                  Authorized password rotation protocol
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        New Secret Key
                      </Label>
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
                          className="h-12 border-slate-100 bg-slate-50/50 rounded-xl pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Confirm Rotation
                      </Label>
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={passwords.passwordConfirm}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            passwordConfirm: e.target.value,
                          })
                        }
                        className="h-12 border-slate-100 bg-slate-50/50 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      variant="outline"
                      disabled={passwordLoading}
                      className="h-12 px-8 cursor-pointer border-slate-200 rounded-xl font-bold uppercase text-[11px] tracking-widest hover:bg-slate-50"
                    >
                      {passwordLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <ShieldCheck className="h-4 w-4 mr-2 text-blue-500" />
                      )}
                      Commit Change
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
