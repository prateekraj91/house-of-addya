"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, MessageCircle, ArrowRight } from "lucide-react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How long does shipping take across India?",
      a: "Orders are dispatched within 24 to 48 business hours from our New Delhi atelier via Shiprocket. Metro deliveries (Delhi NCR, Mumbai, Bengaluru, Pune, Hyderabad) take 2 to 4 business days. Other regions take 4 to 6 business days.",
    },
    {
      q: "Is Cash on Delivery (COD) available?",
      a: "Yes! Cash on Delivery is available for all serviceable pin codes across India with a nominal ₹49 handling fee. You can also pay via UPI QR code directly to the courier executive upon parcel delivery.",
    },
    {
      q: "What is your 7-day exchange and return policy?",
      a: "We offer a 7-day hassle-free exchange and return policy from the date of delivery. For size exchanges, we arrange reverse courier pickup from your doorstep at zero extra charge. Items must be unworn with all tags and original pink packaging intact.",
    },
    {
      q: "How do I choose the right corset size?",
      a: "Our corsets feature internal flexible boning that conforms to your curves without restricting breathing. Measure your natural bust and ribcage circumference, and refer to our interactive Size Guide. If you are between sizes, we recommend sizing according to your bust measurement.",
    },
    {
      q: "Do you offer free shipping?",
      a: "Yes, free express shipping is automatically applied on all prepaid orders exceeding ₹1,499. You can also use code FREESHIP if available during special promotional campaigns.",
    },
    {
      q: "How can I track my package once dispatched?",
      a: "As soon as your order is packed, you will receive an SMS and email notification with your Shiprocket AWB tracking number. You can also visit our 'Track Order' page on this website to view live timeline stages.",
    },
    {
      q: "How do I care for my silk satin slip dresses and structured corsets?",
      a: "For satin and silk pieces, we recommend cold hand washing with mild detergent or delicate cycle inside a mesh laundry bag. Structured boned corsets should be dry-cleaned or spot-cleaned to maintain the integrity of internal boning channels.",
    },
    {
      q: "How do I contact Addya's styling team for urgent advice?",
      a: "You can click the floating WhatsApp icon at the bottom right corner of any page to chat directly with our concierge team, or email us at hello@houseofaddya.com.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 space-y-12">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold tracking-[0.2em] text-pink-600 uppercase block">
          Help & Clarifications
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl text-[#1E171B]">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Everything you need to know about placing orders, choosing your fit, Shiprocket deliveries, and size exchanges.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-pink-100 overflow-hidden shadow-xs transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-pink-50/40 transition-colors"
              >
                <span className="font-editorial text-base sm:text-lg text-stone-900 font-medium">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-pink-600 flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-pink-50 animate-in fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Need more help */}
      <div className="bg-pink-50/70 rounded-3xl border border-pink-100 p-8 text-center space-y-4">
        <h3 className="font-editorial text-2xl text-stone-900">
          Still Have Questions?
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
          Our styling and support team is always one message away on WhatsApp.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href="https://wa.me/919871234567"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
          <Link
            href="/contact"
            className="px-6 py-3 bg-stone-900 hover:bg-pink-600 text-white rounded-full text-xs font-bold uppercase tracking-wider"
          >
            <span>Contact Atelier Page</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
