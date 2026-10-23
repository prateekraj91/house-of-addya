"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store-context";
import ProductCard from "@/components/ProductCard";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  LayoutGrid,
  Grid3X3,
  Search,
  RotateCcw,
} from "lucide-react";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "ALL";
  const initialFilter = searchParams.get("filter") || "";

  const { products, wishlist } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedCollection, setSelectedCollection] = useState<string>("ALL");
  const [selectedSize, setSelectedSize] = useState<string>("ALL");
  const [priceMax, setPriceMax] = useState<number>(5000);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [wishlistOnly, setWishlistOnly] = useState(initialFilter === "wishlist");

  const categories = [
    "ALL",
    "Dresses",
    "Co-ords",
    "Tops & Corsets",
    "Skirts & Bottoms",
    "Outerwear",
  ];

  const collections = [
    "ALL",
    "Soft Blossom",
    "Date Night Euphoria",
    "Brunch & Bubbly",
    "Midnight Muse",
    "Everyday Chic",
  ];

  const sizes = ["ALL", "XS", "S", "M", "L", "XL"];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (wishlistOnly && !wishlist.includes(p.id)) return false;
        if (selectedCategory !== "ALL" && p.category !== selectedCategory)
          return false;
        if (
          selectedCollection !== "ALL" &&
          p.collection !== selectedCollection
        )
          return false;
        if (selectedSize !== "ALL" && !p.sizes.includes(selectedSize as any))
          return false;
        if (p.price > priceMax) return false;
        if (
          searchQuery &&
          !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !p.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
          return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "newest") return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        return 0; // featured default
      });
  }, [
    products,
    wishlistOnly,
    wishlist,
    selectedCategory,
    selectedCollection,
    selectedSize,
    priceMax,
    searchQuery,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setSelectedCategory("ALL");
    setSelectedCollection("ALL");
    setSelectedSize("ALL");
    setPriceMax(5000);
    setSearchQuery("");
    setWishlistOnly(false);
    setSortBy("featured");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Title & Banner */}
      <div className="mb-10 text-center sm:text-left border-b border-pink-100 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-[0.2em] text-pink-600 uppercase block mb-1">
            {wishlistOnly ? "Your Favorites" : "Curated Western Wear"}
          </span>
          <h1 className="font-editorial text-3xl sm:text-5xl text-[#1E171B]">
            {wishlistOnly ? "My Saved Wishlist" : "The Full Collection"}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-lg">
            Effortlessly chic tops, structured corsets, bias-cut slip dresses,
            and brunch co-ords tailored for modern young women.
          </p>
        </div>

        <div className="flex items-center gap-3 self-center md:self-end">
          {/* Wishlist toggle pill */}
          <button
            onClick={() => setWishlistOnly(!wishlistOnly)}
            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
              wishlistOnly
                ? "bg-pink-600 text-white border-pink-600"
                : "bg-white text-stone-700 border-pink-200 hover:border-pink-400"
            }`}
          >
            Saved Pieces ({wishlist.length})
          </button>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-full text-xs font-semibold uppercase tracking-wider"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-7 pr-4">
          <div className="flex items-center justify-between pb-3 border-b border-pink-100">
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-pink-600" />
              <span>Filter Catalog</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-pink-600 hover:text-pink-800 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Search in Catalog */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-stone-700 tracking-wider">
              Search Styles
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Corset, dress, linen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-stone-700 tracking-wider">
              Category
            </label>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                    selectedCategory === cat
                      ? "bg-pink-100/80 text-pink-900 font-bold"
                      : "text-stone-600 hover:bg-pink-50"
                  }`}
                >
                  <span>{cat === "ALL" ? "All Categories" : cat}</span>
                  {selectedCategory === cat && (
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Collection Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-stone-700 tracking-wider">
              Collection Capsule
            </label>
            <div className="space-y-1">
              {collections.map((col) => (
                <button
                  key={col}
                  onClick={() => setSelectedCollection(col)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                    selectedCollection === col
                      ? "bg-pink-100/80 text-pink-900 font-bold"
                      : "text-stone-600 hover:bg-pink-50"
                  }`}
                >
                  <span>{col === "ALL" ? "All Capsules" : col}</span>
                  {selectedCollection === col && (
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-stone-700 tracking-wider">
              Size
            </label>
            <div className="flex flex-wrap gap-1.5">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedSize === s
                      ? "bg-[#1E171B] text-white"
                      : "bg-white border border-stone-200 text-stone-700 hover:border-pink-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-stone-700">
              <span className="uppercase tracking-wider">Max Price</span>
              <span className="text-pink-600 font-bold">
                ₹{priceMax.toLocaleString("en-IN")}
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="5000"
              step="100"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-pink-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>₹1,000</span>
              <span>₹5,000</span>
            </div>
          </div>
        </aside>

        {/* Main Products Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort & Count Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-pink-100 text-xs">
            <span className="text-stone-500 font-medium">
              Showing{" "}
              <strong className="text-stone-900">{filteredProducts.length}</strong>{" "}
              pieces
            </span>

            <div className="flex items-center gap-3">
              <span className="text-stone-500 uppercase tracking-wider font-semibold">
                Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-medium text-stone-800 focus:outline-none focus:border-pink-500"
              >
                <option value="featured">Featured Muses</option>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated (5★)</option>
              </select>
            </div>
          </div>

          {/* Active Filter Badges */}
          {(selectedCategory !== "ALL" ||
            selectedCollection !== "ALL" ||
            selectedSize !== "ALL" ||
            wishlistOnly ||
            searchQuery) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-stone-400">Active:</span>
              {selectedCategory !== "ALL" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-medium">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory("ALL")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCollection !== "ALL" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-medium">
                  {selectedCollection}
                  <button onClick={() => setSelectedCollection("ALL")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedSize !== "ALL" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-medium">
                  Size {selectedSize}
                  <button onClick={() => setSelectedSize("ALL")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {wishlistOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-medium">
                  Wishlist Only
                  <button onClick={() => setWishlistOnly(false)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs text-stone-500 underline ml-2 hover:text-stone-900"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-pink-100 p-8 space-y-4">
              <p className="font-editorial text-2xl text-stone-800">
                No matching pieces found
              </p>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                We couldn&apos;t find anything matching your exact filter criteria.
                Try relaxing the filters to explore our full collection.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-[#1E171B] hover:bg-pink-600 text-white rounded-full text-xs font-semibold uppercase tracking-wider"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl p-6 flex flex-col z-10 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-pink-100">
              <h3 className="font-editorial text-lg text-stone-900">
                Filter Collection
              </h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-6">
              {/* Category */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
                  Category
                </label>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium ${
                        selectedCategory === cat
                          ? "bg-pink-100 text-pink-900 font-bold"
                          : "text-stone-600"
                      }`}
                    >
                      {cat === "ALL" ? "All Categories" : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
                  Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        selectedSize === s
                          ? "bg-pink-600 text-white"
                          : "bg-stone-100 text-stone-700"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                  <span>Max Price</span>
                  <span className="text-pink-600 font-bold">₹{priceMax}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="5000"
                  step="100"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-pink-600"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-pink-100 flex gap-2">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-3 bg-stone-100 text-stone-700 rounded-xl text-xs font-bold uppercase"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 bg-[#1E171B] text-white rounded-xl text-xs font-bold uppercase"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-stone-500">
          Loading House of Addya catalog...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
