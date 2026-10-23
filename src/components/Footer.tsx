"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store-context";
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { InstagramIcon } from "@/components/Icons";

export default function Footer() {
  const { settings } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) return;
    setSubscribed(true);
    setNewsletterEmail("");
  };

  return (
    <footer className="bg-[#1C161A] text-stone-300 pt-16 pb-12 border-t border-pink-950/40 font-sans">
      {/* Brand Trust Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
          <div className="flex items-center sm:items-start gap-4 justify-center sm:justify-start">
            <div className="p-3 bg-pink-900/30 rounded-2xl border border-pink-800/40 text-pink-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-white font-medium text-sm tracking-wide">
                Express 48h Dispatch
              </h5>
              <p className="text-stone-400 text-xs mt-0.5">
                Fast delivery via Shiprocket across India
              </p>
            </div>
          </div>

          <div className="flex items-center sm:items-start gap-4 justify-center sm:justify-start">
            <div className="p-3 bg-pink-900/30 rounded-2xl border border-pink-800/40 text-pink-400">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-white font-medium text-sm tracking-wide">
                7-Day Easy Exchanges
              </h5>
              <p className="text-stone-400 text-xs mt-0.5">
                Free reverse doorstep pickup for size swaps
              </p>
            </div>
          </div>

          <div className="flex items-center sm:items-start gap-4 justify-center sm:justify-start">
            <div className="p-3 bg-pink-900/30 rounded-2xl border border-pink-800/40 text-pink-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-white font-medium text-sm tracking-wide">
                Gen-Z Tailored Fit
              </h5>
              <p className="text-stone-400 text-xs mt-0.5">
                Western cuts engineered for Indian proportions
              </p>
            </div>
          </div>

          <div className="flex items-center sm:items-start gap-4 justify-center sm:justify-start">
            <div className="p-3 bg-pink-900/30 rounded-2xl border border-pink-800/40 text-pink-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-white font-medium text-sm tracking-wide">
                100% Secure Checkout
              </h5>
              <p className="text-stone-400 text-xs mt-0.5">
                Encrypted UPI, Cards, NetBanking & COD
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-editorial text-2xl tracking-[0.16em] uppercase text-white font-normal block">
                {settings.brandName}
              </span>
              <span className="text-[10px] tracking-[0.25em] text-pink-400 uppercase font-sans font-semibold">
                Founded by {settings.founderName}
              </span>
            </Link>

            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Modern fashion brand focused on stylish, wearable and affordable
              Western clothing. Thoughtfully crafted for young women who want
              trendy, confident and effortlessly stylish outfits without
              compromising on comfort or quality.
            </p>

            <div className="pt-2 flex items-center space-x-3">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-pink-950/60 border border-pink-800/40 flex items-center justify-center text-pink-300 hover:text-white hover:bg-pink-800 transition-all"
                aria-label="Follow us on Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-pink-950/60 border border-pink-800/40 flex items-center justify-center text-pink-300 hover:text-white hover:bg-pink-800 transition-all"
                aria-label="WhatsApp Concierge"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${settings.businessEmail}`}
                className="w-9 h-9 rounded-full bg-pink-950/60 border border-pink-800/40 flex items-center justify-center text-pink-300 hover:text-white hover:bg-pink-800 transition-all"
                aria-label="Email Support"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-2 text-xs text-stone-500 space-y-1">
              <p>
                <span className="text-stone-400 font-medium">GSTIN:</span>{" "}
                {settings.gstNumber}
              </p>
              <p>
                <span className="text-stone-400 font-medium">Studio:</span>{" "}
                {settings.businessAddress}
              </p>
            </div>
          </div>

          {/* Catalog Links */}
          <div className="space-y-3">
            <h5 className="text-white text-xs font-semibold uppercase tracking-wider text-pink-300">
              Explore Collections
            </h5>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-400">
              <li>
                <Link href="/shop" className="hover:text-pink-300 transition-colors">
                  Shop All Pieces
                </Link>
              </li>
              <li>
                <Link
                  href="/new-arrivals"
                  className="hover:text-pink-300 transition-colors"
                >
                  New Arrivals Drop
                </Link>
              </li>
              <li>
                <Link
                  href="/collections"
                  className="hover:text-pink-300 transition-colors"
                >
                  Curated Lookbooks
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=Tops%20%26%20Corsets"
                  className="hover:text-pink-300 transition-colors"
                >
                  Sculpted Corsets
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=Dresses"
                  className="hover:text-pink-300 transition-colors"
                >
                  Silk & Cowl Dresses
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=Co-ords"
                  className="hover:text-pink-300 transition-colors"
                >
                  Brunch Co-ord Sets
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h5 className="text-white text-xs font-semibold uppercase tracking-wider text-pink-300">
              Customer Support
            </h5>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-400">
              <li>
                <Link
                  href="/track"
                  className="hover:text-pink-300 transition-colors"
                >
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link
                  href="/size-guide"
                  className="hover:text-pink-300 transition-colors"
                >
                  Fit & Size Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-returns"
                  className="hover:text-pink-300 transition-colors"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-pink-300 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-pink-300 transition-colors"
                >
                  Contact & Atelier
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-pink-300 transition-colors"
                >
                  About Addya Dubey
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-4">
            <h5 className="text-white text-xs font-semibold uppercase tracking-wider text-pink-300">
              Join The Addya Club
            </h5>
            <p className="text-stone-400 text-xs leading-relaxed">
              Unlock 10% off your first order, private preview access to limited
              drops, and styling tips from Addya.
            </p>

            {subscribed ? (
              <div className="bg-pink-950/60 border border-pink-800 text-pink-200 text-xs p-3.5 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-400 flex-shrink-0" />
                <span>You&apos;re in! Use coupon code <strong>ADDYA10</strong> at checkout.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email..."
                    className="w-full px-4 py-2.5 text-xs bg-stone-900/90 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-semibold rounded-xl uppercase tracking-wider shadow-sm transition-all"
                >
                  Subscribe →
                </button>
              </form>
            )}

            <div className="pt-2 border-t border-white/10">
              <span className="text-[11px] text-stone-500 block mb-1">
                Store Management
              </span>
              <Link
                href="/admin"
                className="text-xs text-pink-400 hover:text-pink-300 underline font-medium"
              >
                Owner CMS & Inventory Dashboard →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Payment Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-4">
        <div>
          © {new Date().getFullYear()} House of Addya. All Rights Reserved. Crafted
          with elegance.
        </div>

        {/* Payment Icons */}
        <div className="flex items-center gap-2 flex-wrap justify-center text-[11px] text-stone-400">
          <span className="px-2.5 py-1 bg-stone-900 rounded border border-stone-800 font-medium">
            UPI (GPay / PhonePe / Paytm)
          </span>
          <span className="px-2.5 py-1 bg-stone-900 rounded border border-stone-800 font-medium">
            RuPay
          </span>
          <span className="px-2.5 py-1 bg-stone-900 rounded border border-stone-800 font-medium">
            Visa / Mastercard
          </span>
          <span className="px-2.5 py-1 bg-stone-900 rounded border border-stone-800 font-medium">
            COD Available
          </span>
          <span className="px-2.5 py-1 bg-pink-950/60 text-pink-300 rounded border border-pink-900/60 font-semibold">
            Razorpay Secure
          </span>
        </div>
      </div>
    </footer>
  );
}
