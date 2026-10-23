"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store-context";
import ProductCard from "@/components/ProductCard";
import { Sparkles, ArrowRight } from "lucide-react";

export default function CollectionsPage() {
  const { products } = useStore();
  const [activeCollection, setActiveCollection] = useState<string>("Soft Blossom");

  const collectionData = [
    {
      name: "Soft Blossom",
      tagline: "Romantic corsets & delicate sculpted pastel silhouettes",
      mood: "Pastel blooms, daytime garden affairs, and architectural sweetheart necklines.",
      image: "/images/collection-brunch.jpg",
      fabrics: "Duchess Satin, Hand-embroidered Georgette, Cotton Crepe",
    },
    {
      name: "Date Night Euphoria",
      tagline: "Liquid cowl necklines, thigh-high slits, and midnight shimmer",
      mood: "Rooftop martinis, candlelit dinners, and sensual silk slips that drape effortlessly.",
      image: "/images/collection-datenight.jpg",
      fabrics: "Heavy Mulberry-feel Satin, Chiffon Pleats, Stretch Modal",
    },
    {
      name: "Brunch & Bubbly",
      tagline: "Tailored linen co-ords & sunshine silhouettes",
      mood: "Sundays with the girls, iced matcha lattes, and effortlessly sharp matching sets.",
      image: "/images/hero-fashion.jpg",
      fabrics: "European Structured Linen, Breathable Cotton Twill",
    },
    {
      name: "Midnight Muse",
      tagline: "Sleek noir bodycon dresses and after-dark allure",
      mood: "Club lounges, gallery after-parties, and sculpted statement dresses.",
      image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80",
      fabrics: "Double-layered Ruched Modal Jersey, Velvet Rib",
    },
    {
      name: "Everyday Chic",
      tagline: "Effortless casual luxury for the modern working muse",
      mood: "Desk to dinner transitions, relaxed blazers, and versatile drape tops.",
      image: "/images/founder-addya.jpg",
      fabrics: "Lightweight Suiting Blend, Pure Georgette",
    },
  ];

  const currentCollection =
    collectionData.find((c) => c.name === activeCollection) || collectionData[0];
  const collectionProducts = products.filter(
    (p) => p.collection.toLowerCase() === activeCollection.toLowerCase()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-14">
      {/* Editorial Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold tracking-[0.2em] text-pink-600 uppercase block">
          Editorial Moodboards
        </span>
        <h1 className="font-editorial text-4xl sm:text-6xl text-[#1E171B]">
          Curated Collections
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Every collection is conceived by Addya Dubey around distinctive moods
          and moments in modern life, bringing runway allure to wearable silhouettes.
        </p>
      </div>

      {/* Collection Navigation Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {collectionData.map((col) => (
          <button
            key={col.name}
            onClick={() => setActiveCollection(col.name)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              activeCollection === col.name
                ? "bg-[#1E171B] text-white shadow-md"
                : "bg-white text-stone-700 border border-pink-100 hover:border-pink-300"
            }`}
          >
            {col.name}
          </button>
        ))}
      </div>

      {/* Featured Collection Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-pink-100 shadow-pink-soft">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5 aspect-[4/3] lg:aspect-[3/4] relative">
            <img
              src={currentCollection.image}
              alt={currentCollection.name}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6 lg:hidden">
              <span className="font-editorial text-2xl text-white">
                {currentCollection.name}
              </span>
            </div>
          </div>

          <div className="lg:col-span-7 p-8 sm:p-12 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-100/70 rounded-full text-pink-800 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>Capsule Lookbook</span>
            </div>

            <h2 className="font-editorial text-3xl sm:text-4xl text-[#1E171B]">
              {currentCollection.name}
            </h2>

            <p className="text-sm font-semibold text-pink-700 italic">
              &ldquo;{currentCollection.tagline}&rdquo;
            </p>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {currentCollection.mood}
            </p>

            <div className="pt-2 border-t border-pink-100 text-xs text-stone-500">
              <strong className="text-stone-800">Signature Fabrics:</strong>{" "}
              {currentCollection.fabrics}
            </div>

            <div className="pt-2">
              <Link
                href={`/shop?category=ALL`}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-700 hover:text-pink-900 underline"
              >
                <span>Shop entire collection below</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Products in This Collection */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-pink-100">
          <h3 className="font-editorial text-2xl text-stone-900">
            Pieces in &ldquo;{currentCollection.name}&rdquo; ({collectionProducts.length})
          </h3>
          <Link
            href="/shop"
            className="text-xs font-semibold uppercase tracking-wider text-pink-600 hover:text-pink-800"
          >
            Explore all categories →
          </Link>
        </div>

        {collectionProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {collectionProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-pink-100 p-6 text-xs text-stone-500">
            More pieces for {currentCollection.name} dropping this week! Check our{" "}
            <Link href="/shop" className="text-pink-600 underline">
              full catalog
            </Link>{" "}
            for in-stock styles.
          </div>
        )}
      </div>
    </div>
  );
}
