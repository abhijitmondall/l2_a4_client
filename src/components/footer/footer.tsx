"use client";

import Link from "next/link";
import {
  Pill,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f172a] text-white pt-24 pb-12 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 group-hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20">
                <Pill className="h-6 w-6 text-white rotate-45" />
              </div>
              <span className="text-2xl font-black tracking-tighter">
                Medi<span className="text-emerald-500">Store</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Healthcare reimagined for the digital age. Quality medications,
              verified pharmacists, and lightning-fast delivery to your
              doorstep.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:bg-emerald-500 hover:text-white transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500 mb-8">
              Navigation
            </h3>
            <ul className="space-y-4">
              {[
                "Shop Medicines",
                "About Our Clinic",
                "Partner Program",
                "Contact Support",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors flex items-center group"
                  >
                    <ArrowRight
                      size={14}
                      className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-emerald-500"
                    />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500 mb-8">
              Legal & Help
            </h3>
            <ul className="space-y-4">
              {[
                "Privacy Policy",
                "Shipping Info",
                "Returns & Refunds",
                "FAQ",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="bg-slate-800/50 p-8 rounded-[2rem] border border-white/5">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-6">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-400">
                <Mail size={18} className="text-emerald-500" />
                <span className="text-sm">support@medistore.com</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Phone size={18} className="text-emerald-500" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <MapPin size={18} className="text-emerald-500 shrink-0" />
                <span className="text-sm">
                  Medical Plaza, Suite 402
                  <br />
                  San Francisco, CA 94103
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            &copy; {currentYear} MediStore Global Inc.
          </p>
          <div className="flex gap-8">
            <Link
              href="#"
              className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-emerald-500"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-emerald-500"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-emerald-500"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
