"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ShoppingCart,
  ArrowLeft,
  ShieldCheck,
  Package,
  Minus,
  Plus,
  Zap,
  Star,
  Store,
  Calendar,
  MessageSquare,
  MapPin,
  User,
  Send,
  Edit2,
  X,
  AlertCircle,
  Loader2,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCartStore, useAuthStore } from "@/lib/store";
import { toast } from "@/hooks/useToast";
import api from "@/lib/api/api";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice } from "@/lib/utils";

export default function MedicineDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();

  const [medicine, setMedicine] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Review Logic States
  const [hasPurchased, setHasPurchased] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  // Find if user already reviewed
  const existingReview = medicine?.reviews?.find(
    (r: any) => r.userId === user?.id,
  );

  useEffect(() => {
    if (params.id) {
      fetchData(params.id as string);
    }
  }, [params.id, isAuthenticated]);

  const fetchData = async (id: string) => {
    try {
      const response = await api.medicines.getById(id);
      setMedicine(response);

      if (isAuthenticated && user?.role === "customer") {
        const orders = await api.orders.getMyOrders();
        const purchased = orders.some((order: any) =>
          order.items.some((item: any) => item.medicineId === id),
        );
        setHasPurchased(purchased);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load record",
        variant: "destructive",
      });
      router.push("/shop");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({ title: "Login required", variant: "destructive" });
      router.push("/login");
      return;
    }
    if (medicine && medicine.stock >= quantity) {
      addToCart(medicine, quantity);
      toast({
        title: "Success",
        description: "Added to dispensary cart.",
        variant: "success",
      });
    }
  };

  const handleSubmitReview = async () => {
    if (!comment.trim()) return;
    setSubmittingReview(true);
    try {
      if (editingReviewId) {
        await api.reviews.update(editingReviewId, { rating, comment });
        toast({
          title: "Update Success",
          description: "Your clinical experience has been updated.",
          variant: "success",
        });
      } else {
        await api.reviews.create({ medicineId: medicine.id, rating, comment });
        toast({
          title: "Review Submitted",
          description: "Feedback archived.",
          variant: "success",
        });
      }
      resetReviewForm();
      fetchData(medicine.id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Operation failed.",
        variant: "destructive",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleEditClick = (review: any) => {
    setEditingReviewId(review.id);
    setRating(review.rating);
    setComment(review.comment);
    window.scrollTo({
      top: document.getElementById("review-section")?.offsetTop
        ? document.getElementById("review-section")!.offsetTop - 100
        : 0,
      behavior: "smooth",
    });
  };

  const resetReviewForm = () => {
    setEditingReviewId(null);
    setComment("");
    setRating(5);
  };

  if (loading)
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

  if (!medicine) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="group text-[10px] cursor-pointer font-black uppercase tracking-[0.2em] text-slate-400"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Return to Registry
        </Button>
      </div>

      <main className="max-w-7xl mx-auto px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* LEFT: Media & Seller */}
          <div className="space-y-8">
            <div className="overflow-hidden rounded-[40px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="aspect-square rounded-[32px] bg-slate-50 relative flex items-center justify-center">
                {medicine.image ? (
                  <img
                    src={medicine.image}
                    alt={medicine.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[12rem] font-black text-teal-100/40">
                    {medicine.name.charAt(0)}
                  </span>
                )}
                <div className="absolute top-6 left-6">
                  <Badge className="bg-slate-900/90 text-teal-400 font-black px-4">
                    {medicine.category.name}
                  </Badge>
                </div>
              </div>
            </div>

            <Card className="rounded-[32px] border-slate-200 bg-white overflow-hidden shadow-sm">
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <Store size={20} className="text-teal-600" />
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                    Verified Vendor
                  </h3>
                </div>
                <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 capitalize">
                  {medicine.seller?.status}
                </Badge>
              </div>
              <CardContent className="p-6 space-y-4">
                <p className="text-lg font-black text-slate-800 uppercase">
                  {medicine.seller?.name}
                </p>
                <p className="text-xs font-bold text-slate-400">
                  {medicine.seller?.email}
                </p>
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                  <MapPin size={14} className="text-teal-500" />{" "}
                  {medicine.seller?.address || "Registered Pharmacy Hub"}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: Essential Info & Purchase */}
          <div className="flex flex-col space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-teal-600">
                <ShieldCheck size={18} />
                <span className="text-[11px] font-black uppercase tracking-[0.3em]">
                  Batch No: {medicine.id.slice(0, 8)}
                </span>
              </div>
              <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                {medicine.name}
              </h1>
              <div className="flex flex-wrap gap-4 items-center">
                <p className="text-sm font-bold text-slate-400">
                  MANUFACTURER:{" "}
                  <span className="text-slate-900 uppercase">
                    {medicine.manufacturer}
                  </span>
                </p>
                <div className="flex items-center gap-1.5">
                  <Package className="h-4 w-4 text-teal-500" />
                  <span className="text-[11px] font-black uppercase text-teal-600 tracking-widest">
                    {medicine.stock} Units In Stock
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-6">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-slate-900">
                  {formatPrice(medicine.price)}
                </span>
                <span className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                  per unit
                </span>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus size={14} />
                  </Button>
                  <span className="w-8 text-center font-black">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() =>
                      setQuantity(Math.min(medicine.stock, quantity + 1))
                    }
                  >
                    <Plus size={14} />
                  </Button>
                </div>
                <Button
                  disabled={user?.role !== "customer"}
                  className="flex-1 h-14 cursor-pointer rounded-2xl bg-teal-600 hover:bg-slate-900 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-teal-100 transition-all"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart —{" "}
                  {formatPrice(medicine.price * quantity)}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-400 uppercase tracking-[0.2em] font-black text-[10px]">
                <Zap size={14} className="text-teal-500" /> Clinical Description
              </div>
              <p className="bg-white p-6 rounded-[24px] border border-slate-100 text-sm font-medium text-slate-600 leading-relaxed">
                {medicine.description}
              </p>
            </div>

            {/* REVIEWS SECTION */}
            <div className="space-y-6 pt-6" id="review-section">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2 text-slate-900 uppercase tracking-[0.2em] font-black text-[12px]">
                  <MessageSquare size={16} className="text-teal-500" /> Patient
                  Reviews
                </div>
                <Badge
                  variant="outline"
                  className="rounded-lg font-black text-slate-500"
                >
                  {medicine.reviews?.length || 0} Records
                </Badge>
              </div>

              {/* DYNAMIC REVIEW AREA */}
              {hasPurchased && (
                <>
                  {/* CASE 1: USER ALREADY REVIEWED AND NOT IN EDIT MODE */}
                  {existingReview && !editingReviewId ? (
                    <div className="bg-slate-900 rounded-[32px] p-8 space-y-4 shadow-xl border border-slate-800 animate-in fade-in zoom-in duration-300">
                      <div className="flex items-center gap-3 text-teal-400">
                        <AlertCircle size={20} />
                        <h4 className="text-[10px] font-black uppercase tracking-widest">
                          Integrity Check
                        </h4>
                      </div>
                      <p className="text-sm font-bold text-slate-300">
                        You have already documented your clinical experience for
                        this medicine. Would you like to update your records?
                      </p>
                      <Button
                        onClick={() => handleEditClick(existingReview)}
                        className="bg-teal-600 cursor-pointer hover:bg-white hover:text-slate-900 text-white rounded-xl h-10 px-6 font-black uppercase text-[10px] tracking-widest transition-all"
                      >
                        <Edit2 size={14} className="mr-2" /> Edit My Review
                      </Button>
                    </div>
                  ) : (
                    /* CASE 2: USER IS POSTING FOR FIRST TIME OR CURRENTLY EDITING */
                    <div
                      className={`rounded-[32px] border p-8 space-y-4 shadow-sm transition-all duration-500 ${editingReviewId ? "bg-amber-50/50 border-amber-200" : "bg-teal-50/50 border-teal-100"}`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                          {editingReviewId
                            ? "Update Experience"
                            : "Post Clinical Experience"}
                        </h4>
                        <div className="flex gap-4 items-center">
                          {editingReviewId && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={resetReviewForm}
                              className="h-7 text-[9px] cursor-pointer font-black uppercase text-amber-600 hover:text-amber-700 bg-amber-100/50 rounded-full"
                            >
                              <X size={12} className="mr-1" /> Cancel
                            </Button>
                          )}
                          <div className="flex gap-1 bg-white px-3 py-1.5 rounded-full border border-teal-100">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={16}
                                onClick={() => setRating(star)}
                                className={`cursor-pointer transition-all ${star <= rating ? "fill-teal-500 text-teal-500" : "text-teal-200"}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Describe the clinical efficacy or potential side effects..."
                          className="w-full bg-white rounded-2xl border border-teal-100 p-4 text-sm font-medium focus:ring-4 focus:ring-teal-500/10 outline-none min-h-[110px] resize-none"
                        />
                        <Button
                          disabled={submittingReview || !comment.trim()}
                          onClick={handleSubmitReview}
                          className={`absolute bottom-1 right-1 cursor-pointer rounded-xl h-10 px-4 transition-all ${editingReviewId ? "bg-amber-600 hover:bg-slate-900" : "bg-teal-600 hover:bg-slate-900"}`}
                        >
                          {submittingReview ? (
                            <Spinner className="h-4 w-4" />
                          ) : editingReviewId ? (
                            <Edit2 size={16} />
                          ) : (
                            <Send size={16} />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* REVIEWS LIST */}
              <div className="space-y-4">
                {medicine.reviews?.length > 0 ? (
                  medicine.reviews.map((review: any) => (
                    <div
                      key={review.id}
                      className="bg-white p-6 rounded-[24px] border border-slate-200/60 shadow-sm space-y-3 group"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <User size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800 uppercase">
                              {review.user?.name}
                            </p>
                            <div className="flex items-center gap-0.5 mt-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={10}
                                  className={
                                    i < review.rating
                                      ? "fill-teal-500 text-teal-500"
                                      : "fill-slate-200 text-slate-200"
                                  }
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {user?.id === review.userId && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(review)}
                              className="h-8 w-8 text-slate-400 cursor-pointer hover:text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Edit2 size={14} />
                            </Button>
                          )}
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                            <Calendar size={10} />{" "}
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-slate-600 pl-[52px] italic leading-relaxed">
                        "{review.comment}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-slate-50/50 rounded-[32px] border border-dashed border-slate-200">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      No clinical feedback recorded
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
