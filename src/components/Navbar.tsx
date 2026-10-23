"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store-context";
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  SlidersHorizontal,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { cartItemsCount, wishlist, setIsCartOpen, products } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { name: "Shop All", href: "/shop" },
    { name: "New Arrivals", href: "/new-arrivals" },
    { name: "Collections", href: "/collections" },
    { name: "About Us", href: "/about" },
    { name: "Size Guide", href: "/size-guide" },
    { name: "Track Order", href: "/track" },
  ];

  const searchResults = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.collection.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-pink-100/70 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-2 text-stone-800 hover:text-pink-600 focus:outline-none transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Desktop Navigation Links Left */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.slice(0, 3).map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm tracking-wider uppercase font-medium transition-colors duration-200 relative py-1 ${
                      isActive
                        ? "text-pink-600 font-semibold"
                        : "text-stone-700 hover:text-pink-600"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Brand Logo Center */}
            <div className="flex flex-col items-center justify-center text-center">
              <Link href="/" className="group flex flex-col items-center">
                <span className="font-editorial text-2xl sm:text-3xl md:text-3xl tracking-[0.18em] text-[#1E171B] uppercase font-normal group-hover:text-pink-700 transition-colors">
                  House of Addya
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-[0.25em] text-pink-700/80 uppercase font-sans font-medium -mt-1">
                  Atelier • New Delhi
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links Right + Actions */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              <nav className="hidden lg:flex items-center space-x-7 mr-2">
                {navLinks.slice(3).map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`text-sm tracking-wider uppercase font-medium transition-colors duration-200 relative py-1 ${
                        isActive
                          ? "text-pink-600 font-semibold"
                          : "text-stone-700 hover:text-pink-600"
                      }`}
                    >
                      {link.name}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500 rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Search Toggle Button */}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-stone-700 hover:text-pink-600 transition-colors"
                aria-label="Search catalog"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Link */}
              <Link
                href="/shop?filter=wishlist"
                className="p-2 text-stone-700 hover:text-pink-600 transition-colors relative hidden sm:block"
                aria-label="View wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 bg-pink-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold ring-2 ring-white">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-stone-800 hover:text-pink-600 transition-colors relative"
                aria-label="Open Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute top-1 right-1 bg-gradient-to-r from-pink-500 to-rose-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold ring-2 ring-white animate-bounce">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* Admin Panel Quick Link */}
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-pink-700 bg-pink-50 hover:bg-pink-100 rounded-full border border-pink-200 transition-all duration-200"
                title="Open CMS / Admin Dashboard"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Admin CMS</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Live Search Bar Overlay */}
        {searchOpen && (
          <div className="border-t border-pink-100 bg-white shadow-lg px-4 py-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search corsets, cowl dresses, co-ords, linen blazers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 text-sm bg-stone-50 border border-stone-200 rounded-full focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs bg-stone-200 rounded-full p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Instant Search Results Dropdown */}
              {searchQuery && (
                <div className="mt-3 bg-white border border-pink-100 rounded-2xl shadow-xl max-h-80 overflow-y-auto divide-y divide-pink-50">
                  {searchResults.length > 0 ? (
                    searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-4 p-3 hover:bg-pink-50/50 transition-colors"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-14 object-cover rounded-lg bg-pink-100"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-stone-900 truncate">
                            {product.name}
                          </h4>
                          <p className="text-xs text-stone-500">
                            {product.category} • {product.collection}
                          </p>
                        </div>
                        <div className="text-sm font-semibold text-pink-600">
                          ₹{product.price.toLocaleString("en-IN")}
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-6 text-center text-sm text-stone-500">
                      No matching pieces found for &ldquo;{searchQuery}&rdquo;. Try browsing our{" "}
                      <Link
                        href="/shop"
                        onClick={() => setSearchOpen(false)}
                        className="text-pink-600 underline font-medium"
                      >
                        Shop catalog
                      </Link>
                      .
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
            <div className="p-6 border-b border-pink-100 flex items-center justify-between">
              <div>
                <span className="font-editorial text-xl tracking-[0.16em] uppercase text-stone-900 block">
                  House of Addya
                </span>
                <span className="text-[10px] tracking-widest text-pink-600 uppercase font-sans font-semibold">
                  New Delhi Atelier
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-stone-500 hover:text-stone-900"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              <nav className="space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 text-base font-medium tracking-wide text-stone-800 hover:text-pink-600 border-b border-stone-100"
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-4 h-4 text-stone-400" />
                  </Link>
                ))}
              </nav>

              <div className="pt-4 border-t border-pink-100 space-y-3">
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between w-full py-2.5 px-4 bg-pink-50 hover:bg-pink-100 text-pink-700 font-semibold text-sm rounded-xl border border-pink-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Admin CMS & Dashboard
                  </span>
                  <span className="text-xs bg-pink-200 text-pink-800 px-2 py-0.5 rounded-full">
                    Manage
                  </span>
                </Link>

                <Link
                  href="/shop?filter=wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 text-sm text-stone-700 hover:text-pink-600"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-pink-500" />
                    My Saved Wishlist
                  </span>
                  <span className="text-xs font-semibold text-stone-500">
                    ({wishlist.length})
                  </span>
                </Link>
              </div>

              <div className="bg-pink-50/70 p-4 rounded-2xl border border-pink-100">
                <div className="flex items-center gap-2 text-xs font-semibold text-pink-800 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                  <span>Gen-Z Styling Concierge</span>
                </div>
                <p className="text-xs text-stone-600 mb-2">
                  Need sizing advice or quick custom alterations inquiry? Chat directly with us.
                </p>
                <a
                  href="https://wa.me/919871234567?text=Hi%20House%20of%20Addya,%20I%20have%20a%20question%20about%20your%20collection!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-xs font-bold text-pink-700 underline"
                >
                  WhatsApp Us →
                </a>
              </div>
            </div>

            <div className="p-6 border-t border-pink-100 text-xs text-stone-500 text-center">
              Designed with love by Addya Dubey © {new Date().getFullYear()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
