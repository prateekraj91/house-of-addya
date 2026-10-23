"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { useStore } from "@/lib/store-context";
import { Heart, Star, ShoppingBag, Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggleWishlist, addToCart } = useStore();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || "S");
  const [selectedColour, setSelectedColour] = useState<string>(
    product.colours[0]?.name || "Default"
  );
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const discountPercent = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const inWishlist = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedSize, selectedColour, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <div
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-pink-100/60 shadow-sm hover:shadow-pink-soft transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-pink-50/40">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={
              isHovered && product.images[1]
                ? product.images[1]
                : product.images[0]
            }
            alt={product.name}
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNewArrival && (
            <span className="bg-[#1E171B] text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm">
              New Drop
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-pink-600 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm">
              Best Seller
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-200">
              {discountPercent}% Off
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            inWishlist
              ? "bg-pink-600 text-white shadow-md scale-110"
              : "bg-white/80 text-stone-700 hover:text-pink-600 hover:bg-white shadow-sm"
          }`}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`}
          />
        </button>

        {/* Quick Add Overlay on Hover / Mobile friendly */}
        <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden sm:block">
          <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-lg border border-pink-100 flex flex-col gap-2">
            {/* Quick Size Select */}
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-[10px] text-stone-500 font-medium uppercase mr-1">
                Size:
              </span>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                    selectedSize === size
                      ? "bg-pink-600 text-white"
                      : "bg-stone-100 text-stone-700 hover:bg-pink-100"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            <button
              onClick={handleQuickAdd}
              className={`w-full py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                addedAnimation
                  ? "bg-emerald-600 text-white"
                  : "bg-[#1E171B] hover:bg-pink-600 text-white"
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added to Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Quick Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Collection */}
          <div className="flex items-center justify-between text-[11px] text-pink-700/80 font-medium uppercase tracking-wider mb-1">
            <span>{product.category}</span>
            <span>{product.collection}</span>
          </div>

          {/* Product Name */}
          <Link
            href={`/product/${product.slug}`}
            className="font-editorial text-stone-900 hover:text-pink-600 text-base font-normal line-clamp-1 transition-colors"
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex items-center text-amber-400">
              <Star className="w-3 h-3 fill-current" />
            </div>
            <span className="text-xs font-semibold text-stone-700">
              {product.rating}
            </span>
            <span className="text-xs text-stone-400">
              ({product.reviewCount})
            </span>
          </div>
        </div>

        {/* Color swatches & Price */}
        <div className="mt-3 pt-3 border-t border-pink-50 flex items-center justify-between">
          {/* Colours dots */}
          <div className="flex items-center gap-1.5">
            {product.colours.map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="w-3.5 h-3.5 rounded-full border border-stone-200 shadow-xs inline-block"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 text-right">
            {product.originalPrice && (
              <span className="text-xs text-stone-400 line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
            <span className="text-sm sm:text-base font-bold text-stone-900">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Mobile direct Add button */}
        <div className="sm:hidden mt-3 pt-2">
          <button
            onClick={handleQuickAdd}
            className="w-full py-2 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-pink-200"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>
        </div>
      </div>
    </div>
  );
}
