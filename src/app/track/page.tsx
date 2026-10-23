"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store-context";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  MessageCircle,
} from "lucide-react";

function TrackContent() {
  const searchParams = useSearchParams();
  const urlOrderId = searchParams.get("orderId") || "";

  const { orders } = useStore();
  const [searchInput, setSearchInput] = useState(urlOrderId);
  const [searchedOrder, setSearchedOrder] = useState<any>(() => {
    if (!urlOrderId) return null;
    const clean = urlOrderId.trim().toUpperCase();
    return (
      orders.find(
        (o) =>
          o.id.toUpperCase() === clean ||
          o.customer.phone.includes(clean) ||
          o.customer.email.toLowerCase() === clean.toLowerCase()
      ) || null
    );
  });
  const [hasSearched, setHasSearched] = useState(Boolean(urlOrderId));

  useEffect(() => {
    if (urlOrderId) {
      handleSearch(urlOrderId);
    }
  }, [urlOrderId, orders]);

  const handleSearch = (idToSearch = searchInput) => {
    const clean = idToSearch.trim().toUpperCase();
    if (!clean) return;
    setHasSearched(true);
    const found = orders.find(
      (o) =>
        o.id.toUpperCase() === clean ||
        o.customer.phone.includes(clean) ||
        o.customer.email.toLowerCase() === clean.toLowerCase()
    );
    setSearchedOrder(found || null);
  };

  const steps = [
    { title: "Order Confirmed", desc: "Payment verified & inventory allocated" },
    { title: "Atelier Inspection", desc: "Quality checking stitch & finish" },
    { title: "Packed & Manifested", desc: "Packed in luxury pink packaging" },
    { title: "Handed to Courier", desc: "In transit via Shiprocket Express" },
    { title: "Out for Delivery", desc: "Arriving at your doorstep today" },
    { title: "Delivered", desc: "Enjoy your House of Addya outfit!" },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case "Order Confirmed":
        return 1;
      case "Processing":
        return 2;
      case "Packed":
        return 3;
      case "Shipped":
        return 4;
      case "Delivered":
        return 6;
      default:
        return 1;
    }
  };

  const currentStep = searchedOrder ? getStepIndex(searchedOrder.orderStatus) : 1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold tracking-[0.2em] text-pink-600 uppercase block">
          Shiprocket Dispatch Tracking
        </span>
        <h1 className="font-editorial text-3xl sm:text-5xl text-[#1E171B]">
          Track Your Order
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Enter your Order ID (e.g. HOA-98210) or registered phone number to track your package in real-time.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-3xl border border-pink-100 shadow-sm flex flex-col sm:flex-row gap-2 max-w-xl mx-auto">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Enter Order ID (e.g. HOA-98210) or Mobile"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-11 pr-4 py-3 text-xs bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:border-pink-500"
          />
        </div>
        <button
          onClick={() => handleSearch()}
          className="px-8 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all"
        >
          Track Package
        </button>
      </div>

      {/* Search Result */}
      {searchedOrder ? (
        <div className="bg-white rounded-3xl border border-pink-100 p-6 sm:p-10 shadow-pink-soft space-y-8 animate-in fade-in duration-300">
          {/* Top Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-pink-100 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-600">
                  Shiprocket Express
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                  {searchedOrder.orderStatus}
                </span>
              </div>
              <h3 className="font-editorial text-2xl text-stone-900 mt-1">
                Order #{searchedOrder.id}
              </h3>
              <p className="text-xs text-stone-500">
                Placed on {searchedOrder.date} • Estimated: {searchedOrder.estimatedDelivery || "3-4 Days"}
              </p>
            </div>

            <div className="bg-pink-50/80 p-4 rounded-2xl text-xs space-y-1 border border-pink-100/60">
              <span className="text-stone-400 block font-medium">
                Tracking Number (AWB):
              </span>
              <strong className="text-stone-900 font-mono text-sm block">
                {searchedOrder.trackingNumber || "SR-PENDING"}
              </strong>
              <span className="text-pink-700 font-semibold block">
                Partner: {searchedOrder.courierPartner || "Delhivery"}
              </span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Shipment Status Timeline
            </h4>
            <div className="relative pl-6 sm:pl-8 space-y-8 border-l-2 border-pink-100 ml-4">
              {steps.map((step, idx) => {
                const isCompleted = idx + 1 <= currentStep;
                const isCurrent = idx + 1 === currentStep;

                return (
                  <div key={step.title} className="relative">
                    <span
                      className={`absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCompleted
                          ? "bg-pink-600 text-white ring-4 ring-pink-100"
                          : "bg-stone-200 text-stone-500"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </span>

                    <div>
                      <h5
                        className={`text-sm font-bold ${
                          isCurrent
                            ? "text-pink-700 font-editorial text-base"
                            : isCompleted
                            ? "text-stone-900"
                            : "text-stone-400"
                        }`}
                      >
                        {step.title}
                      </h5>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details & Delivery Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-pink-100 text-xs">
            <div className="space-y-2">
              <span className="font-bold uppercase tracking-wider text-stone-700 block">
                Delivery Address
              </span>
              <p className="text-stone-800 font-medium">
                {searchedOrder.customer.fullName}
              </p>
              <p className="text-stone-500 leading-relaxed">
                {searchedOrder.customer.address},{" "}
                {searchedOrder.customer.city}, {searchedOrder.customer.state} -{" "}
                {searchedOrder.customer.pincode}
              </p>
              <p className="text-stone-500">Phone: {searchedOrder.customer.phone}</p>
            </div>

            <div className="space-y-2">
              <span className="font-bold uppercase tracking-wider text-stone-700 block">
                Items In This Package
              </span>
              <div className="space-y-2">
                {searchedOrder.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-10 h-12 object-cover rounded-lg bg-pink-50"
                    />
                    <div>
                      <p className="font-semibold text-stone-900">
                        {item.product.name}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        Size: {item.selectedSize} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* WhatsApp Support Callout */}
          <div className="bg-pink-50/60 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border border-pink-100">
            <span className="text-stone-700 text-center sm:text-left">
              Need urgent address correction or express delivery coordination?
            </span>
            <a
              href={`https://wa.me/919871234567?text=Hi%2C%20I%20need%20assistance%20with%20Order%20${searchedOrder.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold shadow-xs transition-colors flex-shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Concierge</span>
            </a>
          </div>
        </div>
      ) : hasSearched ? (
        <div className="bg-white rounded-3xl border border-pink-100 p-10 text-center space-y-4">
          <Package className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-editorial text-2xl text-stone-800">
            No Order Found for &ldquo;{searchInput}&rdquo;
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Please check the Order ID in your email invoice or SMS confirmation, or try searching with your 10-digit mobile number.
          </p>
          <div className="pt-2">
            <button
              onClick={() => handleSearch("HOA-98210")}
              className="text-xs text-pink-600 underline font-semibold"
            >
              Click here to test demo order #HOA-98210
            </button>
          </div>
        </div>
      ) : (
        /* Demo quick tip */
        <div className="text-center pt-4">
          <p className="text-xs text-stone-400">
            Tip: You can test with demo order ID:{" "}
            <button
              onClick={() => {
                setSearchInput("HOA-98210");
                handleSearch("HOA-98210");
              }}
              className="text-pink-600 font-bold underline ml-1"
            >
              HOA-98210
            </button>
          </p>
        </div>
      )}
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-stone-400">
          Loading order tracking details...
        </div>
      }
    >
      <TrackContent />
    </Suspense>
  );
}
