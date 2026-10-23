"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store-context";
import { Sparkles, X } from "lucide-react";
import Link from "next/link";

export default function AnnouncementBar() {
  const { settings } = useStore();
  const [dismissed, setDismissed] = useState(false);

  if (!settings.announcementEnabled || dismissed) return null;

  return (
    <div className="bg-[#1E171B] text-[#FFF0F4] text-xs sm:text-[13px] py-2 px-4 transition-all duration-300 relative overflow-hidden border-b border-pink-950/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 flex items-center justify-center gap-2 text-center font-medium tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse hidden sm:inline-block" />
          <span>{settings.announcementText}</span>
          <Link
            href="/shop"
            className="hidden md:inline-flex items-center ml-2 text-pink-300 hover:text-white underline font-semibold transition-colors"
          >
            Shop Now →
          </Link>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-pink-300/70 hover:text-white transition-colors p-1"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
