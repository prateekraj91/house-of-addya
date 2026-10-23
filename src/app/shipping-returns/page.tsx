"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/lib/store-context";
import {
  Truck,
  RotateCcw,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function ShippingReturnsPage() {
  const { settings } = useStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 space-y-16">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold tracking-[0.2em] text-pink-600 uppercase block">
          Transparent Logistics
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl text-[#1E171B]">
          Shipping & Returns Policy
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          At House of Addya, we believe luxury service extends to how your parcel arrives and how easy it is to exchange sizes.
        </p>
      </div>

      {/* Summary Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-pink-100 p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="font-editorial text-xl text-stone-900">
            Shipping Charges
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            • <strong>FREE Express Shipping</strong> on all prepaid orders exceeding ₹{settings.freeShippingThreshold.toLocaleString("en-IN")}.<br />
            • Standard Flat Shipping: ₹{settings.shippingFeeStandard} across India.<br />
            • COD Handling: ₹{settings.codFee}.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-pink-100 p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-editorial text-xl text-stone-900">
            Delivery Timeline
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            • Dispatch: 24 to 48 business hours via Shiprocket.<br />
            • Metros (NCR, Mumbai, Blr): <strong>2 - 4 business days</strong>.<br />
            • Tier 2/3 Cities: 4 - 6 business days.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-pink-100 p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center">
            <RotateCcw className="w-5 h-5" />
          </div>
          <h3 className="font-editorial text-xl text-stone-900">
            7-Day Exchanges
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            • 7-day hassle-free window from delivery date.<br />
            • <strong>Free reverse pickup</strong> from your doorstep for size swaps.<br />
            • Unworn with original tags attached.
          </p>
        </div>
      </div>

      {/* Step by Step Exchange Process */}
      <div className="bg-white rounded-3xl border border-pink-100 p-8 sm:p-12 shadow-pink-soft space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-pink-600 block mb-1">
            Simple 4-Step Procedure
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl text-stone-900">
            How to Initiate a Size Exchange or Return
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-stone-600">
          <div className="space-y-2 bg-pink-50/50 p-5 rounded-2xl border border-pink-100">
            <span className="w-6 h-6 rounded-full bg-pink-600 text-white font-bold flex items-center justify-center text-xs">
              1
            </span>
            <strong className="block text-stone-900 font-bold">
              Drop Us a Message
            </strong>
            <p>
              Message us on WhatsApp with your Order ID and the preferred size you want to swap for.
            </p>
          </div>

          <div className="space-y-2 bg-pink-50/50 p-5 rounded-2xl border border-pink-100">
            <span className="w-6 h-6 rounded-full bg-pink-600 text-white font-bold flex items-center justify-center text-xs">
              2
            </span>
            <strong className="block text-stone-900 font-bold">
              Reverse Courier Pickup
            </strong>
            <p>
              Our Shiprocket delivery partner will arrive at your address within 24-48 hours to collect the piece.
            </p>
          </div>

          <div className="space-y-2 bg-pink-50/50 p-5 rounded-2xl border border-pink-100">
            <span className="w-6 h-6 rounded-full bg-pink-600 text-white font-bold flex items-center justify-center text-xs">
              3
            </span>
            <strong className="block text-stone-900 font-bold">
              Atelier Quality Check
            </strong>
            <p>
              Once received at our Delhi hub, the piece is quickly verified for unworn condition and intact tags.
            </p>
          </div>

          <div className="space-y-2 bg-pink-50/50 p-5 rounded-2xl border border-pink-100">
            <span className="w-6 h-6 rounded-full bg-pink-600 text-white font-bold flex items-center justify-center text-xs">
              4
            </span>
            <strong className="block text-stone-900 font-bold">
              Replacement Dispatched
            </strong>
            <p>
              Your new size is dispatched immediately via express courier with new tracking updates.
            </p>
          </div>
        </div>
      </div>

      {/* Cancellation Policy & Important Notes */}
      <div className="space-y-6 text-xs sm:text-sm text-stone-600 leading-relaxed bg-pink-50/60 p-8 sm:p-10 rounded-3xl border border-pink-100">
        <h3 className="font-editorial text-2xl text-stone-900">
          Order Cancellation & Policy Terms
        </h3>
        <p>
          Orders can be cancelled free of charge anytime prior to dispatch (within approximately 12-24 hours of placement). Once an order has been manifested and handed to Shiprocket courier executives, cancellation is no longer possible, but you may refuse delivery or request an exchange upon receipt.
        </p>
        <p>
          In the rare event of receiving a transit-damaged or defective piece, please notify us within 48 hours of delivery with unboxing photos for an immediate priority replacement at zero extra cost.
        </p>

        <div className="pt-4 border-t border-pink-200/60 flex items-center justify-between">
          <Link
            href="/track"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-700 underline"
          >
            <span>Track existing shipment →</span>
          </Link>
          <a
            href="https://wa.me/919871234567"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-stone-800 font-bold underline"
          >
            WhatsApp Returns Support
          </a>
        </div>
      </div>
    </div>
  );
}
