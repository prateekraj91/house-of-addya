"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store-context";
import { MessageCircle, X } from "lucide-react";

export default function WhatsAppWidget() {
  const { settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=Hi%20House%20of%20Addya%2C%20I%20have%20a%20question%20about%20my%20order%20or%20sizing!`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Tooltip Dialog */}
      {isOpen && (
        <div className="mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-pink-100 p-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-pink-50 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-xs font-bold text-stone-800">
                House of Addya Concierge
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-stone-700"
              aria-label="Close chat bubble"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-stone-600 mb-3 leading-relaxed">
            Hey babe! ✨ Need help with outfit sizing, quick alterations, or checking stock before ordering? Message us directly on WhatsApp!
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ring-4 ring-emerald-100"
        aria-label="Open WhatsApp Customer Support"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="sr-only">Contact WhatsApp</span>
      </button>
    </div>
  );
}
