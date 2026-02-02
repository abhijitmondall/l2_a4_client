"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Link as LinkIcon,
  Save,
  Info,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  X,
  Factory,
  AlignLeft,
  Tablet,
  Package,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import api from "@/lib/api/api";
import Link from "next/link";
import Image from "next/image";
import { toast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store";

export default function AddMedicinePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    manufacturer: "",
    categoryId: "",
    image: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.medicines.getCategories();
        setCategories(res || []);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: Math.round(parseFloat(formData.price)),
        stock: parseInt(formData.stock),
        sellerId: user?.id,
        image: formData.image || null,
      };

      await api.seller.medicines.add(payload);
      toast({
        title: "Successfully Listed",
        description: "Your medicine is now live.",
        variant: "success",
      });
      router.push("/seller-dashboard/medicines");
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Check required fields.",
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      id: 1,
      label: "Identity",
      sub: "Name & Brand",
      done: !!formData.name && !!formData.manufacturer,
    },
    {
      id: 2,
      label: "Classification",
      sub: "Category Type",
      done: !!formData.categoryId,
    },
    {
      id: 3,
      label: "Description",
      sub: "Usage & Details",
      done: formData.description.length > 10,
    },
    {
      id: 4,
      label: "Inventory",
      sub: "Price & Stock",
      done: !!formData.price && !!formData.stock,
    },
    {
      id: 5,
      label: "Visuals",
      sub: "Optional URL",
      done: !!formData.image,
      optional: true,
    },
  ];

  const isComplete = steps.filter((s) => !s.optional).every((s) => s.done);

  return (
    <div className="max-w-[1400px] mx-auto pb-24 animate-in fade-in slide-in-from-bottom-2 duration-1000">
      {/* HEADER */}
      <div className="flex flex-col gap-2 mb-12">
        <Link
          href="/seller-dashboard/medicines"
          className="flex items-center gap-2 text-slate-400 hover:text-teal-600 font-bold text-xs uppercase tracking-widest transition-all hover:-translate-x-1 w-fit"
        >
          <ArrowLeft size={14} /> Back to Catalog
        </Link>
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase">
          New Listing
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
      >
        {/* LEFT: PROGRESS TIMELINE */}
        <div className="lg:col-span-3 sticky top-8 space-y-4">
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[40px] bg-white p-4">
            <CardHeader className="pb-4">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">
                Submission Flow
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2">
              <div className="relative space-y-8 before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className="relative flex items-start gap-4 group"
                  >
                    <div
                      className={cn(
                        "relative z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-500",
                        step.done
                          ? "bg-teal-500 border-teal-500 shadow-lg shadow-teal-100"
                          : "bg-white border-slate-200",
                      )}
                    >
                      {step.done && (
                        <CheckCircle2 size={10} className="text-white" />
                      )}
                    </div>
                    <div className="flex flex-col -mt-0.5">
                      <span
                        className={cn(
                          "text-sm font-black transition-colors tracking-tight",
                          step.done ? "text-slate-900" : "text-slate-400",
                        )}
                      >
                        {step.label}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 leading-none">
                        {step.sub}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div
                className={cn(
                  "mt-10 p-5 rounded-[30px] border transition-all duration-500",
                  isComplete
                    ? "bg-teal-50/50 border-teal-100"
                    : "bg-slate-50 border-slate-100",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "p-2 rounded-xl",
                      isComplete
                        ? "bg-teal-500 text-white"
                        : "bg-slate-200 text-slate-400",
                    )}
                  >
                    {isComplete ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <AlertCircle size={16} />
                    )}
                  </div>
                  <div>
                    <p
                      className={cn(
                        "text-xs font-black uppercase tracking-wider",
                        isComplete ? "text-teal-700" : "text-slate-500",
                      )}
                    >
                      {isComplete ? "Ready" : "In Progress"}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium italic">
                      Auto-save ready
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CENTER: CORE FORM */}
        <div className="lg:col-span-6 space-y-10">
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[40px] bg-white p-8">
            <CardHeader className="px-0 pt-0 pb-8 border-b border-slate-50 mb-8">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 italic">
                <Info size={14} className="text-teal-500" /> Primary Attributes
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-8">
              <div className="space-y-3">
                <Label className="font-bold text-slate-600 text-[10px] uppercase tracking-[0.15em] ml-1">
                  Medicine Name
                </Label>
                <div className="relative">
                  <Tablet
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <Input
                    required
                    placeholder="Ex: Panadol 500mg"
                    className="rounded-[24px] border-slate-100 h-16 pl-14 bg-slate-50/50 focus:bg-white text-lg font-bold transition-all border-2 focus:border-teal-500/20 shadow-none"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="font-bold text-slate-600 text-[10px] uppercase tracking-[0.15em] ml-1">
                    Category
                  </Label>
                  <Select
                    required
                    onValueChange={(v) =>
                      setFormData({ ...formData, categoryId: v })
                    }
                  >
                    <SelectTrigger className="rounded-[24px] border-slate-100 h-16 bg-slate-50/50 border-2 focus:ring-0 shadow-none">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {categories.map((c) => (
                        <SelectItem
                          key={c.id}
                          value={c.id}
                          className="font-bold"
                        >
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="font-bold text-slate-600 text-[10px] uppercase tracking-[0.15em] ml-1">
                    Manufacturer
                  </Label>
                  <div className="relative">
                    <Factory
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                      size={18}
                    />
                    <Input
                      required
                      placeholder="Ex: GSK"
                      className="rounded-[24px] border-slate-100 h-16 pl-14 bg-slate-50/50 border-2 shadow-none"
                      value={formData.manufacturer}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          manufacturer: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="font-bold text-slate-600 text-[10px] uppercase tracking-[0.15em] ml-1 flex items-center gap-2">
                  <AlignLeft size={14} /> Description
                </Label>
                <Textarea
                  required
                  className="rounded-[30px] border-slate-100 border-2 min-h-[160px] bg-slate-50/50 p-6 resize-none focus:bg-white transition-all text-slate-700 font-medium shadow-none"
                  placeholder="Indications..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              {/* COMMERCE & SUPPLY SECTION (ALIGNED INSIDE) */}
              <div className="pt-10 border-t border-slate-50">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-1 w-8 bg-teal-500 rounded-full" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-600 italic">
                    Commerce & Supply
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6 p-6 rounded-[32px] bg-teal-50/40 border border-teal-100/50 relative overflow-hidden">
                  <div className="space-y-3 relative z-10">
                    <Label className="font-black text-teal-900/40 text-[9px] uppercase tracking-widest ml-1">
                      Price per Unit ($)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-teal-600 text-xl">
                        $
                      </span>
                      <Input
                        required
                        type="number"
                        step="0.01"
                        className="rounded-[20px] border-none h-14 pl-10 bg-white shadow-sm text-xl font-black text-teal-700"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-3 relative z-10">
                    <Label className="font-black text-teal-900/40 text-[9px] uppercase tracking-widest ml-1">
                      Current Stock
                    </Label>
                    <div className="relative">
                      <Package
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-teal-200"
                        size={18}
                      />
                      <Input
                        required
                        type="number"
                        className="rounded-[20px] border-none h-14 pl-12 bg-white shadow-sm text-xl font-black text-teal-700"
                        placeholder="0"
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData({ ...formData, stock: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: MEDIA & PUBLISH */}
        <div className="lg:col-span-3 space-y-8">
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[40px] bg-white overflow-hidden p-3">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">
                  Visuals
                </CardTitle>
                {formData.image && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: "" })}
                    className="bg-rose-50 p-1 rounded-full text-rose-500"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="relative aspect-[4/5] rounded-[32px] bg-slate-50 border-2 border-dashed border-slate-100 flex items-center justify-center overflow-hidden">
                {formData.image.startsWith("http") ? (
                  <Image
                    src={formData.image}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 opacity-20">
                    <ImageIcon size={32} />
                  </div>
                )}
              </div>
              <div className="relative">
                <LinkIcon
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={14}
                />
                <Input
                  placeholder="Image URL..."
                  className="rounded-2xl pl-10 bg-slate-50 border-slate-100 h-12 text-[11px] font-bold"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={loading || !isComplete}
            className="w-full cursor-pointer rounded-[30px] h-20 bg-slate-900 hover:bg-teal-600 text-white font-black text-lg shadow-2xl active:scale-95 transition-all duration-500"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <span className="flex items-center gap-3 italic">
                <Save size={20} /> PUBLISH
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
