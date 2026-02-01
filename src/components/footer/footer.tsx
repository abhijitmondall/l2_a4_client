"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Pill,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  // Navigation Links matching your Header logic
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Categories", href: "/categories" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const supportLinks = [
    { label: "Track Order", href: "/dashboard/orders" },
    { label: "Help Center", href: "/faq" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ];

  return (
    <footer className="bg-[#020617] text-white pt-20 pb-10 border-t border-slate-900">
      {/* Container matches Header: container mx-auto px-4 */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 group-hover:bg-emerald-600 transition-all duration-500 shadow-lg shadow-emerald-500/10">
                <Pill className="h-5 w-5 text-white rotate-45" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase text-white">
                Medi<span className="text-emerald-500">Store</span>
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-medium">
              Advanced digital dispensary providing verified clinical solutions
              and global pharmaceutical logistics.
            </p>

            <div className="flex gap-3 pt-2">
              {[Facebook, Twitter, Instagram].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="h-9 w-9 flex items-center justify-center rounded-lg bg-slate-900 text-slate-500 hover:bg-emerald-600 hover:text-white transition-all duration-300 border border-slate-800"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Main Navigation - Logic synced with Header */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500">
              Navigation
            </h3>
            <ul className="space-y-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center group text-[11px] font-black uppercase tracking-[0.15em] transition-colors ${
                        isActive
                          ? "text-emerald-500"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <ArrowRight
                        size={10}
                        className={`mr-2 transition-all ${
                          isActive
                            ? "opacity-100 ml-0"
                            : "opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 text-emerald-500"
                        }`}
                      />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Support Links */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500">
              Assistance
            </h3>
            <ul className="space-y-4">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors text-[11px] font-black uppercase tracking-[0.15em]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dispatch Command Card */}
          <div className="md:col-span-4 bg-slate-900/40 p-6 rounded-[2rem] border border-slate-800/60 relative group transition-all hover:border-emerald-500/30">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
              <ShieldCheck size={16} className="text-emerald-500" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">
                Dispatch Hub
              </h3>
            </div>

            <ul className="space-y-5">
              <li className="flex items-center gap-4 group/item">
                <div className="h-9 w-9 rounded-xl bg-slate-800 flex items-center justify-center group-hover/item:bg-emerald-600 transition-colors">
                  <Mail
                    size={14}
                    className="text-emerald-500 group-hover/item:text-white"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                    Support Email
                  </span>
                  <span className="text-xs font-bold">ops@medistore.io</span>
                </div>
              </li>

              <li className="flex items-center gap-4 group/item">
                <div className="h-9 w-9 rounded-xl bg-slate-800 flex items-center justify-center group-hover/item:bg-emerald-600 transition-colors">
                  <Phone
                    size={14}
                    className="text-emerald-500 group-hover/item:text-white"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                    Direct Line
                  </span>
                  <span className="text-xs font-bold">+1.800.MEDI.OPS</span>
                </div>
              </li>
            </ul>

            <Link
              href="/contact"
              className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-slate-800 hover:bg-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
            >
              Ticket Center <ExternalLink size={12} />
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
              &copy; {currentYear} MediStore Global Registry
            </p>
            <div className="flex items-center gap-2 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500/80">
                Systems Secure
              </span>
            </div>
          </div>

          <div className="flex gap-8">
            {["Terms", "Protocol", "Security"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-emerald-500 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
