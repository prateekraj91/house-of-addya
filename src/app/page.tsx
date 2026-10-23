"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store-context";
import ProductCard from "@/components/ProductCard";
import {
  ArrowRight,
  Sparkles,
  Star,
  ShieldCheck,
  Truck,
  Heart,
  Quote,
  CheckCircle,
} from "lucide-react";
import { InstagramIcon } from "@/components/Icons";

export default function HomePage() {
  const { products, settings, reviews } = useStore();
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("ALL");

  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  const featuredCollections = [
    {
      title: "Soft Blossom",
      tagline: "Romantic corsets & fluid tailored cuts",
      image: "/images/collection-brunch.jpg",
      link: "/shop?category=Tops%20%26%20Corsets",
      count: "8 Styles",
    },
    {
      title: "Date Night Euphoria",
      tagline: "Liquid cowl necks & high-slit slip dresses",
      image: "/images/collection-datenight.jpg",
      link: "/shop?category=Dresses",
      count: "6 Styles",
    },
    {
      title: "Brunch & Bubbly",
      tagline: "Effortless matching linen co-ord sets",
      image: "/images/hero-fashion.jpg",
      link: "/shop?category=Co-ords",
      count: "5 Styles",
    },
  ];

  const instagramPosts = [
    {
      img: "/images/product-corset.jpg",
      handle: "@houseofaddya",
      likes: "1.4k",
      tag: "The Rosewood Corset",
    },
    {
      img: "/images/collection-datenight.jpg",
      handle: "@houseofaddya",
      likes: "2.1k",
      tag: "Aura Cowl Dress",
    },
    {
      img: "/images/collection-brunch.jpg",
      handle: "@houseofaddya",
      likes: "980",
      tag: "Lilac Co-ord Set",
    },
    {
      img: "/images/founder-addya.jpg",
      handle: "@houseofaddya",
      likes: "3.2k",
      tag: "Atelier Moments with Addya",
    },
    {
      img: "/images/hero-fashion.jpg",
      handle: "@houseofaddya",
      likes: "1.8k",
      tag: "Petal Ruffle Jumpsuit",
    },
    {
      img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
      handle: "@houseofaddya",
      likes: "1.1k",
      tag: "Weekend Lookbook",
    },
  ];

  return (
    <div className="space-y-20 sm:space-y-28">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center bg-[#FDF8F9] overflow-hidden border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Typography */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100/80 border border-pink-200 text-pink-800 text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                <span>The Spring/Summer Drop is Live</span>
              </div>

              <div className="space-y-3">
                <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl text-[#1E171B] leading-[1.08] tracking-tight">
                  Effortless Western{" "}
                  <span className="italic font-normal text-pink-700 underline decoration-pink-300 decoration-1 underline-offset-8">
                    Silhouettes
                  </span>{" "}
                  For The Modern Muse.
                </h1>
                <p className="text-stone-600 text-base sm:text-lg max-w-xl font-normal leading-relaxed pt-2">
                  {settings.heroSubtext}
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  href="/shop"
                  className="px-8 py-4 bg-[#1E171B] hover:bg-pink-700 text-white rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest shadow-pink-soft flex items-center justify-center gap-3 transition-all duration-300 group"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/new-arrivals"
                  className="px-8 py-4 bg-white hover:bg-pink-50 text-stone-900 border border-pink-200 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <span>Shop New Drops</span>
                </Link>
              </div>

              {/* Trust Micro-Badges */}
              <div className="pt-6 border-t border-pink-100 flex flex-wrap items-center gap-6 text-xs text-stone-500">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Ready to Ship in 48h</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-pink-500" />
                  <span>Free Shipping on Orders &gt; ₹1,499</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-pink-500" />
                  <span>7-Day Hassle-Free Exchange</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Card */}
                <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative z-10 bg-pink-100">
                  <img
                    src={settings.heroImageUrl || "/images/hero-fashion.jpg"}
                    alt="House of Addya Campaign"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-6">
                    <div className="text-white">
                      <span className="text-[10px] tracking-widest uppercase font-semibold text-pink-300 block">
                        Signature Atelier Drop
                      </span>
                      <h3 className="font-editorial text-xl sm:text-2xl text-white">
                        The Petal Ruffle Flounce
                      </h3>
                      <p className="text-xs text-stone-200 mt-1">
                        Tailored in New Delhi • Limited Edition
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating pill badge */}
                <div className="absolute -bottom-6 -left-6 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-pink-100 hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                    <Heart className="w-5 h-5 fill-pink-500 text-pink-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs font-bold text-stone-800 mt-0.5">
                      Loved by 5,000+ Modern Muses
                    </p>
                  </div>
                </div>

                {/* Decorative Pink Glow */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-pink-300/30 to-rose-200/30 rounded-3xl blur-2xl -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TICKER BANNER */}
      <div className="bg-[#1E171B] text-white py-3.5 overflow-hidden whitespace-nowrap -mt-20 sm:-mt-28">
        <div className="inline-flex animate-[marquee_25s_linear_infinite] space-x-8 text-xs sm:text-sm uppercase tracking-[0.25em] font-medium text-pink-200">
          <span>✨ SCULPTED SILHOUETTES</span>
          <span>•</span>
          <span>EXPRESS 48H SHIPROCKET DISPATCH</span>
          <span>•</span>
          <span>GEN-Z MODERN WESTERN WEAR</span>
          <span>•</span>
          <span>DESIGNED IN NEW DELHI BY ADDYA DUBEY</span>
          <span>•</span>
          <span>100% PREMIUM HANDPICKED FABRICS</span>
          <span>•</span>
          <span>7-DAY DOORSTEP SIZE EXCHANGES</span>
          <span>•</span>
          <span>COD AVAILABLE ACROSS INDIA</span>
          <span>•</span>
          <span>SCULPTED SILHOUETTES</span>
          <span>•</span>
          <span>EXPRESS 48H SHIPROCKET DISPATCH</span>
        </div>
      </div>

      {/* 3. NEW ARRIVALS SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-pink-100">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-pink-600 uppercase block mb-1">
              Fresh From The Atelier
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#1E171B]">
              New Arrivals Drop
            </h2>
          </div>
          <Link
            href="/new-arrivals"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-800 hover:text-pink-600 transition-colors"
          >
            <span>View All New Drops</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. FEATURED COLLECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-[0.2em] text-pink-600 uppercase block mb-1">
            Curated Moodboards
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#1E171B]">
            Featured Collections
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            Each capsule collection is themed around real moments in a modern woman&apos;s life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {featuredCollections.map((col) => (
            <Link
              key={col.title}
              href={col.link}
              className="group relative aspect-[3/4] rounded-3xl overflow-hidden shadow-lg border border-pink-100 block"
            >
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[11px] uppercase tracking-widest text-pink-300 font-semibold mb-1">
                  {col.count}
                </span>
                <h3 className="font-editorial text-2xl text-white group-hover:text-pink-200 transition-colors">
                  {col.title}
                </h3>
                <p className="text-xs text-stone-300 mt-1 mb-4 line-clamp-1">
                  {col.tagline}
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-300 group-hover:translate-x-1 transition-transform">
                  <span>Explore Capsule</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. BEST SELLERS */}
      <section className="bg-pink-50/50 py-16 sm:py-24 border-y border-pink-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-pink-200/60">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-pink-600 uppercase block mb-1">
                Most Wanted Pieces
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#1E171B]">
                Best Sellers
              </h2>
            </div>
            <Link
              href="/shop?sort=bestseller"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-800 hover:text-pink-600 transition-colors"
            >
              <span>Explore All Best Sellers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. FOUNDER & BRAND STORY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-pink-100 shadow-pink-soft overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Founder Image */}
            <div className="lg:col-span-5 relative aspect-[3/4] lg:h-full">
              <img
                src="/images/founder-addya.jpg"
                alt="Addya Dubey - Founder of House of Addya"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6 lg:hidden">
                <div className="text-white">
                  <h3 className="font-editorial text-2xl">Addya Dubey</h3>
                  <p className="text-xs text-pink-300">Founder & Creative Director</p>
                </div>
              </div>
            </div>

            {/* Founder Story Copy */}
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-50 rounded-full text-pink-700 text-xs font-bold uppercase tracking-wider">
                <Quote className="w-3.5 h-3.5 text-pink-500" />
                <span>The Founder&apos;s Vision</span>
              </div>

              <h2 className="font-editorial text-3xl sm:text-4xl text-[#1E171B] leading-tight">
                &ldquo;{settings.aboutStoryHeadline}&rdquo;
              </h2>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                {settings.aboutStoryText}
              </p>

              <div className="pt-2 border-t border-pink-100 grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-editorial text-2xl text-stone-900 font-bold">
                    100%
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Designed & Made in India
                  </p>
                </div>
                <div>
                  <h4 className="font-editorial text-2xl text-stone-900 font-bold">
                    Zero
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Fast Fashion Compromises
                  </p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <h4 className="font-editorial text-2xl text-stone-900 font-bold">
                    7-Day
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Doorstep Exchange
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <div>
                  <span className="font-editorial text-lg text-stone-900 block">
                    {settings.founderName}
                  </span>
                  <span className="text-xs text-pink-700 font-medium">
                    Founder, House of Addya
                  </span>
                </div>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-700 hover:text-pink-900 underline"
                >
                  Read Full Story →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS & LOVE NOTES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-[0.2em] text-pink-600 uppercase block mb-1">
            Real Reviews From Real Muses
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#1E171B]">
            What Our Girls Say
          </h2>
          <div className="flex items-center justify-center gap-1 text-amber-400 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
            <span className="text-xs font-bold text-stone-700 ml-2">
              4.9/5 Average Rating
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-stone-400">{rev.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-pink-50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-stone-900">
                    {rev.author}
                  </h4>
                  <p className="text-[10px] text-stone-400">{rev.city}</p>
                </div>
                {rev.verified && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full font-medium">
                    <CheckCircle className="w-3 h-3 text-pink-600" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. INSTAGRAM COMMUNITY FEED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 text-pink-600 text-xs font-bold uppercase tracking-wider mb-1">
            <InstagramIcon className="w-4 h-4" />
            <span>Tag us on Instagram</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#1E171B]">
            @{settings.instagramHandle}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Tag <span className="font-bold text-pink-700">#HouseOfAddya</span> to get featured on our editorial feed.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {instagramPosts.map((post, idx) => (
            <a
              key={idx}
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden bg-pink-100 block shadow-sm"
            >
              <img
                src={post.img}
                alt={post.tag}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center text-white">
                <InstagramIcon className="w-5 h-5 mb-1 text-pink-300" />
                <span className="text-[10px] font-semibold">{post.tag}</span>
                <span className="text-[9px] text-pink-200 mt-0.5">
                  ❤️ {post.likes}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 9. VIP CLUB / NEWSLETTER PROMO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-pink-900 via-[#2A1822] to-pink-950 rounded-3xl p-8 sm:p-14 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-800/60 rounded-full text-pink-200 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Exclusive 10% Welcome Perk</span>
            </div>

            <h2 className="font-editorial text-3xl sm:text-5xl text-white">
              Step Into The House of Addya
            </h2>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-lg mx-auto">
              Join our private collective to receive early access to new seasonal drops, limited run alerts, and private styling notes directly from Addya.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your personal email..."
                className="w-full px-5 py-3 text-xs bg-white/10 border border-white/20 rounded-full text-white placeholder-stone-400 focus:outline-none focus:border-pink-400"
              />
              <button
                type="button"
                className="w-full sm:w-auto px-8 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md"
              >
                Join VIP
              </button>
            </div>

            <p className="text-[11px] text-stone-400 pt-2">
              Instant coupon code: <span className="text-pink-300 font-bold">ADDYA10</span> unlocks 10% off at checkout.
            </p>
          </div>

          {/* Decorative glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>
    </div>
  );
}
