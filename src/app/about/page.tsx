"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/lib/store-context";
import { Sparkles, Heart, Quote, ArrowRight, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  const { settings } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 space-y-20">
      {/* Hero Brand Manifesto */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold tracking-[0.2em] text-pink-600 uppercase block">
          The Atelier Story
        </span>
        <h1 className="font-editorial text-4xl sm:text-6xl text-[#1E171B] leading-tight">
          Where Runway Sophistication Meets Wearable Ease.
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
          Founded in New Delhi by Addya Dubey, House of Addya is an independent
          fashion label designed for modern young women who crave trendy,
          confident silhouettes without compromising on fabric quality or fit.
        </p>
      </div>

      {/* Founder Spotlight Card */}
      <div className="bg-white rounded-3xl border border-pink-100 shadow-pink-soft overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5 aspect-[3/4] relative bg-pink-100">
            <img
              src="/images/founder-addya.jpg"
              alt="Addya Dubey, Founder of House of Addya"
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div className="lg:col-span-7 p-8 sm:p-14 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-pink-50 rounded-full text-pink-700 text-xs font-bold uppercase tracking-wider">
              <Quote className="w-3.5 h-3.5 text-pink-500" />
              <span>A Note From Addya Dubey</span>
            </div>

            <h2 className="font-editorial text-3xl sm:text-4xl text-[#1E171B] leading-snug">
              &ldquo;I started House of Addya because every young woman deserves to feel magnetic.&rdquo;
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
              <p>
                Growing up immersed in fashion culture, I frequently noticed a
                jarring gap: international western wear was either exorbitantly
                expensive and ill-fitting for Indian body frames, or cheap fast
                fashion that fell apart after a single wash and pinched in all the
                wrong places.
              </p>
              <p>
                House of Addya was born to bridge that exact divide. We engineer
                flexible corsets with contouring boning, bias-cut silk dresses
                that drape like liquid, and co-ords you can wear from an 11 AM
                brunch meeting to a 10 PM cocktail lounge.
              </p>
              <p>
                Every single sketch, fabric swatch, and sample stitch is
                personally tested by me and our Delhi atelier team before it
                reaches your hands.
              </p>
            </div>

            <div className="pt-4 border-t border-pink-100 flex items-center justify-between">
              <div>
                <span className="font-editorial text-xl text-stone-900 block">
                  Addya Dubey
                </span>
                <span className="text-xs text-pink-700 font-semibold uppercase tracking-wider">
                  Founder & Creative Director
                </span>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E171B] hover:bg-pink-600 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all"
              >
                <span>Explore Designs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* The 3 Brand Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-pink-50/60 p-8 rounded-3xl border border-pink-100 space-y-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-pink-600 shadow-xs mx-auto sm:mx-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-editorial text-2xl text-stone-900">
            Thoughtful Silhouette Cuts
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Our patterns are tailored specifically for real curves, incorporating
            flexible boning and subtle stretch gussets so you can dance, dine,
            and move with effortless confidence.
          </p>
        </div>

        <div className="bg-pink-50/60 p-8 rounded-3xl border border-pink-100 space-y-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-pink-600 shadow-xs mx-auto sm:mx-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-editorial text-2xl text-stone-900">
            Conscious Small Batch Drops
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            We reject the landfills of mass production. Each collection is
            crafted in limited batches of 50-100 pieces to ensure exceptional
            stitching standards and minimize fabric waste.
          </p>
        </div>

        <div className="bg-pink-50/60 p-8 rounded-3xl border border-pink-100 space-y-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-pink-600 shadow-xs mx-auto sm:mx-0">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-editorial text-2xl text-stone-900">
            Accessible Luxury
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Statement editorial style should not come with a 4-figure dollar
            markup. By manufacturing in India and retailing directly to you,
            we deliver luxury standards at honest prices.
          </p>
        </div>
      </div>
    </div>
  );
}
