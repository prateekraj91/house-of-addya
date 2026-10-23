"use client";

import React from "react";
import { useStore } from "@/lib/store-context";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function NewArrivalsPage() {
  const { products } = useStore();
  const newArrivals = products.filter((p) => p.isNewArrival);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Editorial Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-pink-100/70 via-pink-50 to-[#FAF4F7] p-8 sm:p-14 border border-pink-200/60 overflow-hidden text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-pink-700 text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>Limited Run Drop 04</span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl text-[#1E171B]">
            New Arrivals
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Fresh out of the atelier. Handcrafted silhouettes, contemporary drape cuts, and structured corsetry designed to elevate every occasion.
          </p>
        </div>

        <div className="z-10 flex-shrink-0">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#1E171B] hover:bg-pink-700 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            <span>View All Pieces</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Decorative blur */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-pink-300/30 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {newArrivals.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
