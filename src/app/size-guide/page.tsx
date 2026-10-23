"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Ruler, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function SizeGuidePage() {
  const [unit, setUnit] = useState<"in" | "cm">("in");
  const [calcBust, setCalcBust] = useState("");
  const [calcWaist, setCalcWaist] = useState("");
  const [calcHip, setCalcHip] = useState("");
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);

  const handleCalculateSize = (e: React.FormEvent) => {
    e.preventDefault();
    const bust = parseFloat(calcBust);
    const waist = parseFloat(calcWaist);

    if (isNaN(bust) || isNaN(waist)) {
      alert("Please enter valid numbers for Bust and Waist.");
      return;
    }

    // Normalized to inches
    const bustIn = unit === "cm" ? bust / 2.54 : bust;
    const waistIn = unit === "cm" ? waist / 2.54 : waist;

    if (bustIn <= 32 && waistIn <= 26) {
      setRecommendedSize("XS");
    } else if (bustIn <= 34.5 && waistIn <= 28) {
      setRecommendedSize("S");
    } else if (bustIn <= 36.5 && waistIn <= 30.5) {
      setRecommendedSize("M");
    } else if (bustIn <= 39.5 && waistIn <= 33.5) {
      setRecommendedSize("L");
    } else {
      setRecommendedSize("XL");
    }
  };

  const measurementsInches = [
    { size: "XS", bust: "30 - 32", waist: "24 - 26", hip: "34 - 36", uk: "UK 6", us: "US 2" },
    { size: "S", bust: "33 - 34.5", waist: "26.5 - 28", hip: "36.5 - 38", uk: "UK 8", us: "US 4" },
    { size: "M", bust: "35 - 36.5", waist: "28.5 - 30", hip: "38.5 - 40", uk: "UK 10", us: "US 6" },
    { size: "L", bust: "37 - 39", waist: "31 - 33", hip: "41 - 43", uk: "UK 12", us: "US 8" },
    { size: "XL", bust: "40 - 42", waist: "34 - 36", hip: "44 - 46", uk: "UK 14", us: "US 10" },
  ];

  const measurementsCm = [
    { size: "XS", bust: "76 - 81", waist: "61 - 66", hip: "86 - 91", uk: "UK 6", us: "US 2" },
    { size: "S", bust: "84 - 88", waist: "67 - 71", hip: "93 - 97", uk: "UK 8", us: "US 4" },
    { size: "M", bust: "89 - 93", waist: "72 - 76", hip: "98 - 102", uk: "UK 10", us: "US 6" },
    { size: "L", bust: "94 - 99", waist: "79 - 84", hip: "104 - 109", uk: "UK 12", us: "US 8" },
    { size: "XL", bust: "102 - 107", waist: "86 - 91", hip: "112 - 117", uk: "UK 14", us: "US 10" },
  ];

  const currentTable = unit === "in" ? measurementsInches : measurementsCm;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold tracking-[0.2em] text-pink-600 uppercase block">
          Flawless Fit Guaranteed
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl text-[#1E171B]">
          House of Addya Size Guide
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Our silhouettes are cut with modern precision for a contoured yet comfortable fit. Use our interactive calculator or measurement charts below.
        </p>
      </div>

      {/* Interactive Size Finder */}
      <div className="bg-white rounded-3xl border border-pink-100 p-8 sm:p-10 shadow-pink-soft space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-pink-100">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-pink-600" />
            <h3 className="font-editorial text-2xl text-stone-900">
              Interactive Fit Calculator
            </h3>
          </div>

          {/* Unit Toggle */}
          <div className="flex bg-stone-100 rounded-full p-1 text-xs font-bold">
            <button
              onClick={() => setUnit("in")}
              className={`px-4 py-1.5 rounded-full transition-all ${
                unit === "in"
                  ? "bg-pink-600 text-white shadow-xs"
                  : "text-stone-600"
              }`}
            >
              Inches (in)
            </button>
            <button
              onClick={() => setUnit("cm")}
              className={`px-4 py-1.5 rounded-full transition-all ${
                unit === "cm"
                  ? "bg-pink-600 text-white shadow-xs"
                  : "text-stone-600"
              }`}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        <form onSubmit={handleCalculateSize} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-stone-700 font-bold mb-1">
              Bust Measurement ({unit})
            </label>
            <input
              type="number"
              step="0.5"
              required
              value={calcBust}
              onChange={(e) => setCalcBust(e.target.value)}
              placeholder={unit === "in" ? "e.g. 34" : "e.g. 86"}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-bold mb-1">
              Natural Waist ({unit})
            </label>
            <input
              type="number"
              step="0.5"
              required
              value={calcWaist}
              onChange={(e) => setCalcWaist(e.target.value)}
              placeholder={unit === "in" ? "e.g. 28" : "e.g. 71"}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-bold mb-1">
              Hip / Lower Waist ({unit})
            </label>
            <input
              type="number"
              step="0.5"
              value={calcHip}
              onChange={(e) => setCalcHip(e.target.value)}
              placeholder={unit === "in" ? "e.g. 38" : "e.g. 96"}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="sm:col-span-3 pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow-pink-soft"
            >
              Calculate My Ideal Size →
            </button>
          </div>
        </form>

        {recommendedSize && (
          <div className="bg-pink-100/70 border border-pink-300 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-pink-600 text-white font-editorial text-2xl flex items-center justify-center font-bold">
                {recommendedSize}
              </div>
              <div>
                <h4 className="font-editorial text-lg text-stone-900 font-bold">
                  Recommended Size: {recommendedSize}
                </h4>
                <p className="text-xs text-stone-600">
                  Based on your measurements, size {recommendedSize} will provide an optimal contour fit with room to breathe comfortably.
                </p>
              </div>
            </div>

            <Link
              href="/shop"
              className="px-6 py-2.5 bg-stone-900 hover:bg-pink-600 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Shop Size {recommendedSize}
            </Link>
          </div>
        )}
      </div>

      {/* Standard Measurement Matrix */}
      <div className="space-y-4">
        <h3 className="font-editorial text-2xl text-stone-900">
          Standard Measurements Chart ({unit === "in" ? "Inches" : "Centimeters"})
        </h3>

        <div className="bg-white rounded-3xl border border-pink-100 overflow-hidden shadow-xs">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-pink-50 text-stone-900 border-b border-pink-100">
                <th className="p-4 font-bold uppercase">Size</th>
                <th className="p-4 font-bold uppercase">Bust ({unit})</th>
                <th className="p-4 font-bold uppercase">Waist ({unit})</th>
                <th className="p-4 font-bold uppercase">Hips ({unit})</th>
                <th className="p-4 font-bold uppercase">UK Size</th>
                <th className="p-4 font-bold uppercase">US Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {currentTable.map((row, idx) => (
                <tr
                  key={row.size}
                  className={idx % 2 === 1 ? "bg-pink-50/20" : "bg-white"}
                >
                  <td className="p-4 font-bold text-pink-700 text-sm">
                    {row.size}
                  </td>
                  <td className="p-4 font-medium text-stone-800">{row.bust}</td>
                  <td className="p-4 font-medium text-stone-800">{row.waist}</td>
                  <td className="p-4 font-medium text-stone-800">{row.hip}</td>
                  <td className="p-4 text-stone-500">{row.uk}</td>
                  <td className="p-4 text-stone-500">{row.us}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* How to Measure Guide */}
      <div className="bg-pink-50/60 rounded-3xl border border-pink-100 p-8 sm:p-10 space-y-6">
        <h3 className="font-editorial text-2xl text-stone-900">
          How to Measure Yourself Accurately
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-600">
          <div className="space-y-2 bg-white p-5 rounded-2xl border border-pink-100/70">
            <span className="font-bold text-pink-700 uppercase tracking-wider block">
              1. Bust
            </span>
            <p className="leading-relaxed">
              Wrap the measuring tape horizontally around the fullest part of your chest, keeping tape comfortably level under your armpits and across shoulder blades.
            </p>
          </div>

          <div className="space-y-2 bg-white p-5 rounded-2xl border border-pink-100/70">
            <span className="font-bold text-pink-700 uppercase tracking-wider block">
              2. Natural Waist
            </span>
            <p className="leading-relaxed">
              Measure around the narrowest part of your torso (usually 1-2 inches above your belly button). Keep one finger between the tape and your body.
            </p>
          </div>

          <div className="space-y-2 bg-white p-5 rounded-2xl border border-pink-100/70">
            <span className="font-bold text-pink-700 uppercase tracking-wider block">
              3. Hips
            </span>
            <p className="leading-relaxed">
              Stand with heels together and measure around the fullest circumference of your hips and buttocks to ensure slip dresses and trousers drape effortlessly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
