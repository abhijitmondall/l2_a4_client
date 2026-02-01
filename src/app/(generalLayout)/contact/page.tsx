"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MessageSquare,
  Clock,
  ShieldCheck,
  Send,
  ChevronRight,
  LifeBuoy,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/useToast";

export default function ContactSupportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Inquiry Dispatched",
        description:
          "Your support ticket has been registered in our clinical queue.",
        variant: "success",
      });
      setIsSubmitting(false);
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans">
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 p-3 rounded-2xl text-white shadow-lg shadow-emerald-200">
                <LifeBuoy size={32} />
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">
                Support <span className="text-emerald-500">Center</span>
              </h1>
            </div>
            <p className="text-slate-400 font-bold uppercase text-[12px] tracking-[0.3em] max-w-md">
              Verified Medical Assistance & Technical Troubleshooting Hub
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
              Pharmacists Online: 24/7 Response Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* --- LEFT: CONTACT FORM --- */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm">
              <h3 className="text-[12px] font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
                <Send size={16} className="text-emerald-500" /> Dispatch Inquiry
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-500">
                      Subject Type
                    </label>
                    <select className="w-full bg-slate-50 border-none rounded-2xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none">
                      <option>Order Discrepancy</option>
                      <option>Prescription Consultation</option>
                      <option>Technical Issue</option>
                      <option>Billing & Refunds</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-500">
                      Reference ID
                    </label>
                    <Input
                      placeholder="e.g. ORD-8829"
                      className="bg-slate-50 border-none rounded-2xl py-7 font-bold text-sm focus-visible:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-500">
                    Description of Inquiry
                  </label>
                  <Textarea
                    placeholder="Provide clinical details or order context..."
                    className="bg-slate-50 border-none rounded-[2rem] p-6 font-medium text-sm focus-visible:ring-emerald-500/20 min-h-[200px]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 hover:bg-emerald-600 text-white h-16 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all shadow-xl shadow-slate-200 flex items-center gap-3"
                >
                  {isSubmitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <Send size={18} /> Disconnect Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* --- RIGHT: DIRECT CHANNELS --- */}
          <div className="lg:col-span-5 space-y-8">
            {/* Rapid Contact Card */}
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-[80px] group-hover:bg-emerald-500/30 transition-all duration-700" />

              <div className="relative z-10 space-y-8">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-400">
                  Direct Channels
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="bg-emerald-500 p-3 rounded-xl">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Emergency Line
                      </p>
                      <p className="text-lg font-black">+1 (800) MED-HELP</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="bg-slate-700 p-3 rounded-xl">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Email Registry
                      </p>
                      <p className="text-lg font-black">
                        support@medical.archive
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10">
                  <div className="flex items-center gap-3 text-emerald-400 mb-2">
                    <Clock size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Response Times
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    Priority medical inquiries:{" "}
                    <span className="text-white">15-30 Minutes</span>
                    <br />
                    General account support:{" "}
                    <span className="text-white">2-4 Hours</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links / Help */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Knowledge Base
              </h4>
              <div className="space-y-4">
                {[
                  { icon: FileText, label: "Refund Policy", link: "#" },
                  { icon: ShieldCheck, label: "Privacy Protocol", link: "#" },
                  { icon: MessageSquare, label: "FAQ Archive", link: "#" },
                ].map((item, i) => (
                  <a
                    key={i}
                    href={item.link}
                    className="flex items-center justify-between group p-2"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} className="text-emerald-500" />
                      <span className="text-sm font-bold text-slate-700">
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-slate-300 group-hover:text-emerald-500 transition-colors"
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Warning Note */}
            <div className="bg-amber-50 rounded-[2rem] p-6 border border-amber-100 flex items-start gap-4">
              <AlertCircle className="text-amber-600 shrink-0" size={20} />
              <p className="text-[11px] text-amber-800 font-bold leading-relaxed">
                <span className="uppercase block mb-1">Medical Disclaimer</span>
                Support staff cannot modify active prescriptions. Please consult
                your physician for clinical adjustments.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Loader2({ size, className }: { size: number; className: string }) {
  return (
    <div
      className={`border-2 border-white/20 border-t-white rounded-full animate-spin`}
      style={{ width: size, height: size }}
    />
  );
}
