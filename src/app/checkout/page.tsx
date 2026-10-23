"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store-context";
import { OrderCustomer } from "@/lib/types";
import confetti from "canvas-confetti";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle2,
  ArrowRight,
  Lock,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  X,
  Copy,
  Check,
  Building2,
  Smartphone,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartTotal,
    appliedCoupon,
    settings,
    createOrder,
  } = useStore();

  const [form, setForm] = useState<OrderCustomer>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "Delhi",
    pincode: "",
    notes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<
    "UPI" | "Card" | "NetBanking" | "COD"
  >("UPI");
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayModalOpen, setRazorpayModalOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [utrNumber, setUtrNumber] = useState("");

  const copyToClipboard = (text: string, fieldName: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(text);
      }
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2500);
    } catch (e) {
      console.warn("Failed to copy:", e);
    }
  };

  const codFee = paymentMethod === "COD" ? settings.codFee : 0;
  const finalPayable = cartTotal + codFee;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fullName || !form.email || !form.phone || !form.address || !form.pincode) {
      alert("Please fill in all mandatory shipping address fields.");
      return;
    }

    if (paymentMethod === "COD") {
      completeOrderPlacement("COD", "COD Confirmed");
    } else {
      // Open simulated Razorpay modal
      setRazorpayModalOpen(true);
    }
  };

  const completeOrderPlacement = (
    method: "UPI" | "Card" | "NetBanking" | "COD",
    status: "Paid" | "COD Confirmed"
  ) => {
    setIsProcessing(true);
    setTimeout(() => {
      const order = createOrder({
        customer: {
          ...form,
          notes: utrNumber
            ? `${form.notes ? form.notes + " • " : ""}Payment Ref/UTR: ${utrNumber}`
            : form.notes,
        },
        items: cart,
        subtotal: cartSubtotal,
        discount: cartDiscount,
        couponCode: appliedCoupon?.code,
        shippingFee: cartShippingFee,
        codFee,
        total: finalPayable,
        paymentMethod: method,
        paymentStatus: status,
      });

      setConfirmedOrder(order);
      setIsProcessing(false);
      setRazorpayModalOpen(false);

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#DB2777", "#EC4899", "#F472B6", "#FBCFE8", "#1E171B"],
      });
    }, 1200);
  };

  // If order is placed, show Order Confirmation Screen
  if (confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white rounded-3xl border border-pink-100 p-8 sm:p-12 shadow-pink-soft text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-pink-700">
              Payment Confirmed • Order #{confirmedOrder.id}
            </span>
            <h1 className="font-editorial text-3xl sm:text-5xl text-stone-900">
              Thank You, {confirmedOrder.customer.fullName.split(" ")[0]}!
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
              Your House of Addya outfit has been reserved and queued for tailoring inspection & dispatch.
            </p>
          </div>

          {/* Details Card */}
          <div className="bg-pink-50/70 p-6 rounded-2xl text-left text-xs space-y-4 border border-pink-100">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-pink-200/60">
              <div>
                <span className="text-stone-400 block">Order ID</span>
                <strong className="text-stone-900 font-bold">{confirmedOrder.id}</strong>
              </div>
              <div>
                <span className="text-stone-400 block">Payment Method</span>
                <strong className="text-stone-900 font-bold">
                  {confirmedOrder.paymentMethod} ({confirmedOrder.paymentStatus})
                </strong>
              </div>
              <div>
                <span className="text-stone-400 block">Estimated Delivery</span>
                <strong className="text-emerald-700 font-bold">3-4 Days</strong>
              </div>
              <div>
                <span className="text-stone-400 block">Total Paid</span>
                <strong className="text-pink-700 font-bold text-sm">
                  ₹{confirmedOrder.total.toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-stone-400 block">Delivery Address:</span>
              <p className="text-stone-800 font-medium">
                {confirmedOrder.customer.address}, {confirmedOrder.customer.apartment && `${confirmedOrder.customer.apartment}, `}
                {confirmedOrder.customer.city}, {confirmedOrder.customer.state} - {confirmedOrder.customer.pincode}
              </p>
              <p className="text-stone-500">
                Phone: {confirmedOrder.customer.phone} • Email: {confirmedOrder.customer.email}
              </p>
            </div>

            <div className="pt-2 text-stone-600 flex items-center gap-2">
              <Truck className="w-4 h-4 text-pink-600 flex-shrink-0" />
              <span>
                Tracking number <strong>{confirmedOrder.trackingNumber}</strong> assigned via {confirmedOrder.courierPartner}.
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href={`/track?orderId=${confirmedOrder.id}`}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Track Live on Shiprocket</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-editorial text-2xl text-stone-900">
          Your shopping bag is empty
        </h2>
        <p className="text-xs text-stone-500">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="inline-block px-6 py-2.5 bg-pink-600 text-white rounded-full text-xs font-bold uppercase tracking-wider"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Checkout Title */}
      <div className="border-b border-pink-100 pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold tracking-[0.2em] text-pink-600 uppercase block mb-1">
            Express Checkout
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-[#1E171B]">
            Shipping & Payment
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>SSL Secured</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form: Address + Payment */}
        <div className="lg:col-span-7 space-y-8">
          {/* Step 1: Customer Contact & Address */}
          <div className="bg-white rounded-3xl border border-pink-100 p-6 sm:p-8 space-y-5 shadow-xs">
            <h3 className="font-editorial text-xl text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-pink-600 text-white text-xs flex items-center justify-center font-bold">
                1
              </span>
              <span>Customer & Delivery Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  name="fullName"
                  placeholder="e.g. Diya Sen"
                  value={form.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  Mobile Number (for Shiprocket OTP & delivery updates) *
                </label>
                <input
                  type="tel"
                  required
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-700 font-bold mb-1">
                  Email Address (for order confirmation invoice) *
                </label>
                <input
                  type="email"
                  required
                  name="email"
                  placeholder="diya.sen@gmail.com"
                  value={form.email}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-700 font-bold mb-1">
                  Street Address & House / Flat No. *
                </label>
                <input
                  type="text"
                  required
                  name="address"
                  placeholder="House 42, Sunrise Apartments, 12th Main Road"
                  value={form.address}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  Apartment / Landmark (Optional)
                </label>
                <input
                  type="text"
                  name="apartment"
                  placeholder="Near City Mall"
                  value={form.apartment}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  required
                  name="pincode"
                  placeholder="110001"
                  value={form.pincode}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  name="city"
                  placeholder="New Delhi"
                  value={form.city}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  State *
                </label>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-pink-500"
                >
                  <option value="Delhi">Delhi / NCR</option>
                  <option value="Maharashtra">Maharashtra (Mumbai / Pune)</option>
                  <option value="Karnataka">Karnataka (Bengaluru)</option>
                  <option value="Tamil Nadu">Tamil Nadu (Chennai)</option>
                  <option value="Telangana">Telangana (Hyderabad)</option>
                  <option value="West Bengal">West Bengal (Kolkata)</option>
                  <option value="Gujarat">Gujarat (Ahmedabad)</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Rajasthan">Rajasthan (Jaipur)</option>
                  <option value="Other">Other State</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 2: Payment Options */}
          <div className="bg-white rounded-3xl border border-pink-100 p-6 sm:p-8 space-y-5 shadow-xs">
            <h3 className="font-editorial text-xl text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-pink-600 text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span>Select Payment Method</span>
            </h3>

            <div className="space-y-3">
              {/* UPI Option */}
              <div
                onClick={() => setPaymentMethod("UPI")}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === "UPI"
                    ? "border-pink-600 bg-pink-50/40"
                    : "border-stone-200 hover:border-pink-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "UPI"}
                      onChange={() => setPaymentMethod("UPI")}
                      className="accent-pink-600"
                    />
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-stone-900 block">
                        UPI Instant Pay (GPay / PhonePe / Paytm / BHIM)
                      </span>
                      <span className="text-[11px] text-stone-500">
                        Zero convenience fees • Instant QR code or app launcher
                      </span>
                    </div>
                  </div>
                  <QrCode className="w-5 h-5 text-pink-600" />
                </div>

                {paymentMethod === "UPI" && (
                  <div className="mt-3.5 pt-3 border-t border-pink-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-stone-600 text-[11px]">Direct VPA:</span>
                      <code className="px-2 py-0.5 bg-white border border-pink-200 rounded-md font-mono font-bold text-pink-700 text-xs">
                        {settings.upiId || "anmoldube93@okhdfcbank"}
                      </code>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(settings.upiId || "anmoldube93@okhdfcbank", "upi");
                      }}
                      className="text-[11px] font-bold text-pink-600 hover:text-pink-700 bg-white hover:bg-pink-100/70 border border-pink-200 px-2.5 py-1 rounded-full flex items-center gap-1 transition-all"
                    >
                      {copiedField === "upi" ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy UPI ID</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Cards Option */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === "Card"
                    ? "border-pink-600 bg-pink-50/50"
                    : "border-stone-200 hover:border-pink-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "Card"}
                    onChange={() => setPaymentMethod("Card")}
                    className="accent-pink-600"
                  />
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-stone-900 block">
                      Credit / Debit Card (Visa / Mastercard / RuPay)
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Razorpay 3D Secure OTP verification
                    </span>
                  </div>
                </div>
                <CreditCard className="w-5 h-5 text-pink-600" />
              </label>

              {/* NetBanking / Bank Transfer Option */}
              <div
                onClick={() => setPaymentMethod("NetBanking")}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === "NetBanking"
                    ? "border-pink-600 bg-pink-50/40"
                    : "border-stone-200 hover:border-pink-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "NetBanking"}
                      onChange={() => setPaymentMethod("NetBanking")}
                      className="accent-pink-600"
                    />
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-stone-900 block">
                        Direct Bank Transfer (IMPS / NEFT / NetBanking)
                      </span>
                      <span className="text-[11px] text-stone-500">
                        {settings.bankName || "PUNJAB NATIONAL BANK"} • Direct zero-fee settlement
                      </span>
                    </div>
                  </div>
                  <Building2 className="w-5 h-5 text-pink-600" />
                </div>

                {paymentMethod === "NetBanking" && (
                  <div className="mt-3.5 pt-3 border-t border-pink-100 space-y-2 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="p-2.5 bg-white rounded-xl border border-pink-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-stone-400 block uppercase font-bold tracking-wider">
                            Bank Name
                          </span>
                          <span className="font-bold text-stone-900 text-xs">
                            {settings.bankName || "PUNJAB NATIONAL BANK"}
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-white rounded-xl border border-pink-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-stone-400 block uppercase font-bold tracking-wider">
                            Account Number
                          </span>
                          <span className="font-mono font-bold text-stone-900 text-xs">
                            {settings.accountNumber || "0781100100005018"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(settings.accountNumber || "0781100100005018", "acc");
                          }}
                          className="p-1 text-stone-400 hover:text-pink-600 rounded transition-colors"
                          title="Copy Account Number"
                        >
                          {copiedField === "acc" ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <div className="p-2.5 bg-white rounded-xl border border-pink-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-stone-400 block uppercase font-bold tracking-wider">
                            IFSC Code
                          </span>
                          <span className="font-mono font-bold text-stone-900 text-xs">
                            {settings.ifscCode || "PUNB0078110"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(settings.ifscCode || "PUNB0078110", "ifsc");
                          }}
                          className="p-1 text-stone-400 hover:text-pink-600 rounded transition-colors"
                          title="Copy IFSC Code"
                        >
                          {copiedField === "ifsc" ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <div className="p-2.5 bg-white rounded-xl border border-pink-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-stone-400 block uppercase font-bold tracking-wider">
                            Beneficiary Name
                          </span>
                          <span className="font-bold text-stone-900 text-xs">
                            {settings.accountHolderName || "Anmol Dubey"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(settings.accountHolderName || "Anmol Dubey", "holder");
                          }}
                          className="p-1 text-stone-400 hover:text-pink-600 rounded transition-colors"
                          title="Copy Beneficiary Name"
                        >
                          {copiedField === "holder" ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* COD Option */}
              {settings.codAvailable && (
                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "COD"
                      ? "border-pink-600 bg-pink-50/50"
                      : "border-stone-200 hover:border-pink-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="accent-pink-600"
                    />
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-stone-900 block">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-[11px] text-stone-500">
                        Pay cash or UPI at your doorstep upon delivery (+₹{settings.codFee} handling)
                      </span>
                    </div>
                  </div>
                  <Banknote className="w-5 h-5 text-stone-600" />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Right Order Summary & Confirm */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-pink-100 p-6 sm:p-8 space-y-6 shadow-sm sticky top-28">
            <h3 className="font-editorial text-xl text-stone-900 pb-3 border-b border-pink-100">
              Bag Summary ({cart.length} pieces)
            </h3>

            {/* Items mini list */}
            <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-pink-50 pr-1">
              {cart.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex gap-3 items-center">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-14 h-16 object-cover rounded-xl bg-pink-50"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-semibold text-stone-900 truncate">
                      {item.product.name}
                    </h5>
                    <p className="text-[11px] text-stone-500">
                      Size: {item.selectedSize} • Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-stone-900">
                    ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div className="space-y-2 text-xs text-stone-600 pt-3 border-t border-pink-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">
                  ₹{cartSubtotal.toLocaleString("en-IN")}
                </span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{cartDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-semibold text-stone-900">
                  {cartShippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `₹${cartShippingFee}`
                  )}
                </span>
              </div>

              {paymentMethod === "COD" && (
                <div className="flex justify-between text-amber-700">
                  <span>COD Handling Fee</span>
                  <span>₹{settings.codFee}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-pink-100">
                <span>Total Payable</span>
                <span className="text-pink-600 font-bold text-xl">
                  ₹{finalPayable.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-widest shadow-pink-soft flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <span>
                    {paymentMethod === "COD"
                      ? "Place Cash on Delivery Order"
                      : `Pay ₹${finalPayable.toLocaleString("en-IN")} Securely`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center text-[11px] text-stone-400 space-y-1">
              <p>House of Addya • GST Registered Business</p>
              <p>Free 7-Day Doorstep Exchange Policy applies to all orders.</p>
            </div>
          </div>
        </div>
      </form>

      {/* Tailored Payment Modal */}
      {razorpayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setRazorpayModalOpen(false)}
          />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 z-10 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-pink-100 text-pink-700 rounded text-[10px] font-bold uppercase tracking-wider">
                  {paymentMethod === "UPI" ? "UPI Direct" : paymentMethod === "NetBanking" ? "Bank Transfer" : "Razorpay"}
                </span>
                <span className="text-xs font-semibold text-stone-600">
                  {settings.brandName || "House of Addya"}
                </span>
              </div>
              <button
                onClick={() => setRazorpayModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Total Payable Summary */}
            <div className="text-center space-y-1">
              <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold">Total Amount</span>
              <h3 className="font-editorial text-3xl font-bold text-stone-900">
                ₹{finalPayable.toLocaleString("en-IN")}
              </h3>
            </div>

            {/* 1. UPI Payment Mode */}
            {paymentMethod === "UPI" && (
              <div className="space-y-4">
                {/* Dynamic UPI QR Code */}
                <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl flex flex-col items-center justify-center space-y-3">
                  <div className="w-44 h-44 bg-white p-2.5 rounded-2xl border border-stone-300 flex items-center justify-center shadow-xs">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                        `upi://pay?pa=${settings.upiId || "anmoldube93@okhdfcbank"}&pn=${encodeURIComponent(
                          settings.brandName || "House of Addya"
                        )}&am=${finalPayable}&cu=INR&tn=${encodeURIComponent(
                          "House of Addya Order"
                        )}`
                      )}`}
                      alt="Scan to Pay via UPI"
                      className="w-40 h-40 object-contain rounded-xl"
                    />
                  </div>

                  <div className="text-center space-y-1">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-stone-700 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span>Scan with GPay, PhonePe, Paytm, or BHIM</span>
                    </div>
                    <p className="text-[11px] text-stone-400">
                      Auto-fills exact amount of <strong>₹{finalPayable.toLocaleString("en-IN")}</strong>
                    </p>
                  </div>
                </div>

                {/* VPA Copy Bar */}
                <div className="p-3 bg-pink-50/60 rounded-xl border border-pink-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">UPI VPA</span>
                    <span className="font-mono font-bold text-pink-700">
                      {settings.upiId || "anmoldube93@okhdfcbank"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(settings.upiId || "anmoldube93@okhdfcbank", "modal_upi")}
                    className="px-3 py-1 bg-white hover:bg-pink-100 border border-pink-200 text-pink-700 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all"
                  >
                    {copiedField === "modal_upi" ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Mobile Intent Launcher */}
                <a
                  href={`upi://pay?pa=${encodeURIComponent(
                    settings.upiId || "anmoldube93@okhdfcbank"
                  )}&pn=${encodeURIComponent(
                    settings.brandName || "House of Addya"
                  )}&am=${finalPayable}&cu=INR&tn=${encodeURIComponent(
                    "House of Addya Order"
                  )}`}
                  className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border border-stone-200"
                >
                  <Smartphone className="w-4 h-4 text-pink-600" />
                  <span>Tap to Pay on Mobile (GPay / PhonePe)</span>
                </a>

                {/* UTR Input */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    UPI Reference / UTR Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 428901238491"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>

                <button
                  onClick={() => completeOrderPlacement("UPI", "Paid")}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>I Have Paid ₹{finalPayable.toLocaleString("en-IN")} • Confirm Order</span>
                </button>
              </div>
            )}

            {/* 2. NetBanking / Punjab National Bank Mode */}
            {paymentMethod === "NetBanking" && (
              <div className="space-y-4">
                <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl space-y-2.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                    <span className="font-bold text-stone-900 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-pink-600" />
                      <span>{settings.bankName || "PUNJAB NATIONAL BANK"}</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      0% Fee
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500 text-[11px]">Account Number:</span>
                    <div className="flex items-center gap-1.5 font-mono font-bold text-stone-900">
                      <span>{settings.accountNumber || "0781100100005018"}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(settings.accountNumber || "0781100100005018", "m_acc")}
                        className="text-stone-400 hover:text-pink-600"
                      >
                        {copiedField === "m_acc" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500 text-[11px]">IFSC Code:</span>
                    <div className="flex items-center gap-1.5 font-mono font-bold text-stone-900">
                      <span>{settings.ifscCode || "PUNB0078110"}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(settings.ifscCode || "PUNB0078110", "m_ifsc")}
                        className="text-stone-400 hover:text-pink-600"
                      >
                        {copiedField === "m_ifsc" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-stone-500 text-[11px]">Beneficiary Name:</span>
                    <span className="font-bold text-stone-900">{settings.accountHolderName || "Anmol Dubey"}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    IMPS / NEFT Transfer Reference (UTR) Number *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter 12-digit UTR from your bank app"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>

                <button
                  onClick={() => completeOrderPlacement("NetBanking", "Paid")}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Bank Transfer • Place Order</span>
                </button>
              </div>
            )}

            {/* 3. Card Mode */}
            {paymentMethod === "Card" && (
              <div className="space-y-4">
                <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl space-y-3 text-xs">
                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="4111 •••• •••• 1111"
                      defaultValue="4111 2345 6789 1111"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-600 font-semibold mb-1">Expiry</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        defaultValue="08/28"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 font-semibold mb-1">CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        defaultValue="789"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl font-mono"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => completeOrderPlacement("Card", "Paid")}
                  className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize ₹{finalPayable.toLocaleString("en-IN")} via 3D Secure</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
