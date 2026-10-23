"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store-context";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  Sparkles,
  Truck,
  CheckCircle2,
} from "lucide-react";

export default function CartDrawer() {
  const router = useRouter();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    settings,
  } = useStore();

  const [couponInput, setCouponInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const result = applyCoupon(couponInput);
    if (result.success) {
      setCouponFeedback({ text: result.message, isError: false });
      setCouponInput("");
    } else {
      setCouponFeedback({ text: result.message, isError: true });
    }
  };

  const amountNeededForFreeShipping = Math.max(
    0,
    settings.freeShippingThreshold - cartSubtotal
  );
  const freeShippingProgress = Math.min(
    100,
    Math.round((cartSubtotal / settings.freeShippingThreshold) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-pink-100 flex items-center justify-between bg-stone-50/60">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-pink-600" />
              <h3 className="font-editorial text-lg text-stone-900 tracking-wide">
                Your Shopping Bag
              </h3>
              <span className="text-xs bg-pink-100 text-pink-800 font-semibold px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-800 transition-colors"
              aria-label="Close bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress bar */}
          <div className="bg-pink-50/80 px-5 py-3 border-b border-pink-100 text-xs">
            {amountNeededForFreeShipping > 0 ? (
              <div>
                <p className="text-stone-700 mb-1.5 flex items-center gap-1.5 font-medium">
                  <Truck className="w-4 h-4 text-pink-600 flex-shrink-0" />
                  Add <span className="font-bold text-pink-700">₹{amountNeededForFreeShipping.toLocaleString("en-IN")}</span> more for FREE Express Shipping!
                </p>
                <div className="w-full bg-pink-200/70 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-rose-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                You unlocked FREE Express Shipping across India! ✨
              </p>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-pink-50">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center text-pink-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-editorial text-lg text-stone-800 mb-1">
                    Your bag is empty
                  </h4>
                  <p className="text-xs text-stone-500 max-w-xs">
                    Discover our newest drop of sculpted corsets, fluid slip dresses, and brunch co-ords.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    router.push("/shop");
                  }}
                  className="px-6 py-2.5 bg-[#1E171B] hover:bg-pink-600 text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-all"
                >
                  Explore New Drops →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="pt-4 first:pt-0 flex gap-3.5">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-24 object-cover rounded-xl bg-pink-50 flex-shrink-0 border border-pink-100/60"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/product/${item.product.slug}`}
                            onClick={() => setIsCartOpen(false)}
                            className="text-xs sm:text-sm font-semibold text-stone-900 hover:text-pink-600 transition-colors line-clamp-1"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-stone-400 hover:text-rose-500 p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
                          <span className="bg-stone-100 px-2 py-0.5 rounded font-medium">
                            Size: {item.selectedSize}
                          </span>
                          <span className="bg-stone-100 px-2 py-0.5 rounded font-medium">
                            {item.selectedColour}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-1">
                        <div className="flex items-center border border-stone-200 rounded-lg">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1 hover:text-pink-600 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold text-stone-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1 hover:text-pink-600 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-xs sm:text-sm font-bold text-stone-900">
                            ₹{(item.product.price * item.quantity).toLocaleString(
                              "en-IN"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-pink-100 bg-stone-50/70 space-y-3.5">
              {/* Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-pink-100/80 border border-pink-300 text-pink-900 px-3 py-2 rounded-xl text-xs font-medium">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-pink-600" />
                      <span>
                        Applied: <strong>{appliedCoupon.code}</strong> (-₹{cartDiscount.toLocaleString("en-IN")})
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-pink-700 hover:text-pink-900 text-[11px] underline font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Coupon code (e.g. ADDYA10)"
                        className="flex-1 px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl uppercase tracking-wider focus:outline-none focus:border-pink-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-stone-900 hover:bg-pink-600 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {couponFeedback && (
                      <p
                        className={`text-[11px] ${
                          couponFeedback.isError
                            ? "text-rose-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {couponFeedback.text}
                      </p>
                    )}
                  </form>
                )}
              </div>

              {/* Price Calculation breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">
                    ₹{cartSubtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>-₹{cartDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-stone-900">
                    {cartShippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${cartShippingFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-950 pt-2 border-t border-stone-200">
                  <span>Total Amount</span>
                  <span className="text-pink-600 font-bold text-base">
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    router.push("/checkout");
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider shadow-pink-soft flex items-center justify-center gap-2 transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between text-[11px] text-stone-500 px-1">
                  <Link
                    href="/cart"
                    onClick={() => setIsCartOpen(false)}
                    className="hover:text-pink-600 underline"
                  >
                    View detailed cart
                  </Link>
                  <span>100% Secure & Encrypted</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
