"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store-context";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Truck,
  CheckCircle2,
  Tag,
  ShieldCheck,
  Gift,
} from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
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

  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);
  const [isGiftWrap, setIsGiftWrap] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");

  const amountNeededForFreeShipping = Math.max(
    0,
    settings.freeShippingThreshold - cartSubtotal
  );
  const freeShippingProgress = Math.min(
    100,
    Math.round((cartSubtotal / settings.freeShippingThreshold) * 100)
  );

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    if (res.success) {
      setCouponMsg({ text: res.message, isError: false });
      setCouponCode("");
    } else {
      setCouponMsg({ text: res.message, isError: true });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-pink-100/70 flex items-center justify-center text-pink-600 mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl text-stone-900">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
          Looks like you haven&apos;t chosen any pieces yet. Explore our latest drops of corsets, dresses and co-ords to elevate your wardrobe.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#1E171B] hover:bg-pink-600 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-md"
        >
          <span>Explore New Drops</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="border-b border-pink-100 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-[0.2em] text-pink-600 uppercase block mb-1">
            Review Selection
          </span>
          <h1 className="font-editorial text-3xl sm:text-5xl text-[#1E171B]">
            Shopping Bag ({cart.length})
          </h1>
        </div>
        <Link
          href="/shop"
          className="text-xs font-bold text-pink-700 hover:text-pink-900 underline uppercase tracking-wider"
        >
          Continue Shopping →
        </Link>
      </div>

      {/* Free Shipping Alert */}
      <div className="bg-pink-50/80 p-5 rounded-2xl border border-pink-100">
        {amountNeededForFreeShipping > 0 ? (
          <div className="space-y-2">
            <p className="text-xs sm:text-sm text-stone-800 font-medium flex items-center gap-2">
              <Truck className="w-5 h-5 text-pink-600 flex-shrink-0" />
              Add <span className="font-bold text-pink-700">₹{amountNeededForFreeShipping.toLocaleString("en-IN")}</span> more to unlock FREE Express Shipping!
            </p>
            <div className="w-full bg-pink-200/60 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-pink-500 to-rose-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-emerald-800 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            🎉 You have qualified for FREE Express Shipping across India!
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-pink-100 p-6 shadow-xs divide-y divide-pink-50">
            {cart.map((item) => (
              <div key={item.id} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                <div className="flex gap-4 items-center">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-2xl bg-pink-50 border border-pink-100"
                  />
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-pink-700 tracking-wider">
                      {item.product.category}
                    </span>
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="font-editorial text-base sm:text-lg text-stone-900 hover:text-pink-600 block transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-stone-500">
                      <span>Size: <strong className="text-stone-800">{item.selectedSize}</strong></span>
                      <span>•</span>
                      <span>Colour: <strong className="text-stone-800">{item.selectedColour}</strong></span>
                    </div>
                    <p className="text-xs font-semibold text-stone-700 sm:hidden pt-1">
                      ₹{item.product.price.toLocaleString("en-IN")} each
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8 pt-3 sm:pt-0 border-t sm:border-t-0 border-pink-50">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-stone-200 rounded-xl bg-white px-2 py-1">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="p-1 text-stone-500 hover:text-pink-600"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-stone-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="p-1 text-stone-500 hover:text-pink-600"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-base font-bold text-stone-900">
                      ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                    <span className="text-[11px] text-stone-400 hidden sm:block">
                      ₹{item.product.price.toLocaleString("en-IN")} / item
                    </span>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Gift Wrap & Special Instructions */}
          <div className="bg-white rounded-3xl border border-pink-100 p-6 space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isGiftWrap}
                onChange={(e) => setIsGiftWrap(e.target.checked)}
                className="w-4 h-4 accent-pink-600 rounded"
              />
              <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                <Gift className="w-4 h-4 text-pink-600" />
                <span>Add House of Addya Luxury Gift Packaging & Satin Ribbon (Free)</span>
              </div>
            </label>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Special Delivery Notes / Atelier Requests
              </label>
              <textarea
                rows={2}
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="e.g. Please leave at door, or customize body measurement note..."
                className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>
        </div>

        {/* Right Order Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-pink-100 p-6 shadow-sm space-y-5">
            <h3 className="font-editorial text-xl text-stone-900 pb-3 border-b border-pink-100">
              Order Summary
            </h3>

            {/* Promo Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-pink-100/70 border border-pink-300 text-pink-900 p-3 rounded-2xl text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-pink-600" />
                    <span>Coupon: {appliedCoupon.code} (-₹{cartDiscount})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-pink-700 underline text-xs"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Discount Code (e.g. ADDYA10)"
                      className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl uppercase tracking-wider focus:outline-none focus:border-pink-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-stone-900 hover:bg-pink-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponMsg && (
                    <p
                      className={`text-[11px] ${
                        couponMsg.isError ? "text-rose-600" : "text-emerald-600"
                      }`}
                    >
                      {couponMsg.text}
                    </p>
                  )}
                </form>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs text-stone-600 border-t border-pink-50 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">
                  ₹{cartSubtotal.toLocaleString("en-IN")}
                </span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Promo Discount</span>
                  <span>-₹{cartDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-stone-900">
                  {cartShippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `₹${cartShippingFee}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-pink-100">
                <span>Estimated Total</span>
                <span className="text-pink-600 text-lg font-bold">
                  ₹{cartTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full py-4 bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-widest shadow-pink-soft flex items-center justify-center gap-2 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-[11px] text-stone-400 text-center space-y-1">
              <p className="flex items-center justify-center gap-1.5 text-stone-500 font-medium">
                <ShieldCheck className="w-4 h-4 text-pink-600" />
                <span>Encrypted 256-bit Bank Grade Security</span>
              </p>
              <p>UPI, Credit/Debit Cards, NetBanking & COD supported</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
