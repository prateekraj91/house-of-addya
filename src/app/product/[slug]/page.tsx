"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store-context";
import ProductCard from "@/components/ProductCard";
import {
  Heart,
  Star,
  ShoppingBag,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  Ruler,
  Check,
  ChevronRight,
  Sparkles,
  X,
  MessageSquare,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const {
    products,
    addToCart,
    isInWishlist,
    toggleWishlist,
    reviews,
    addReview,
    settings,
  } = useStore();

  const product = products.find((p) => p.slug === slug) || products[0];

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes[0] || "S");
  const [selectedColour, setSelectedColour] = useState<string>(
    product?.colours[0]?.name || "Blush Rose"
  );
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  // Review Form Modal
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewCity, setReviewCity] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="font-editorial text-2xl text-stone-800">
          Piece not found
        </p>
        <Link href="/shop" className="text-pink-600 underline text-xs mt-2 inline-block">
          Return to Shop catalog
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.collection === product.collection))
    .slice(0, 4);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColour, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColour, quantity);
    router.push("/checkout");
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor || !reviewComment) return;
    addReview({
      author: reviewAuthor,
      city: reviewCity || "Verified Buyer",
      rating: reviewRating,
      comment: reviewComment,
      verified: true,
      productName: product.name,
      productId: product.id,
    });
    setReviewAuthor("");
    setReviewCity("");
    setReviewComment("");
    setShowReviewForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <Link href="/" className="hover:text-pink-600">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
        <Link href="/shop" className="hover:text-pink-600">
          Shop
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
        <Link
          href={`/shop?category=${encodeURIComponent(product.category)}`}
          className="hover:text-pink-600"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
        <span className="text-stone-900 font-semibold truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-24 flex-shrink-0">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`aspect-[3/4] w-20 sm:w-full rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-pink-50 ${
                  activeImage === idx
                    ? "border-pink-600 ring-2 ring-pink-100"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover object-top"
                />
              </button>
            ))}
          </div>

          {/* Main Stage Image */}
          <div className="flex-1 aspect-[3/4] rounded-3xl overflow-hidden bg-pink-50 relative border border-pink-100/60 shadow-sm">
            <img
              src={product.images[activeImage] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-top"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNewArrival && (
                <span className="bg-[#1E171B] text-white text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-md">
                  New Drop
                </span>
              )}
              {discountPercent > 0 && (
                <span className="bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1 rounded-full border border-rose-200">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-md ${
                inWishlist
                  ? "bg-pink-600 text-white"
                  : "bg-white/80 text-stone-800 hover:text-pink-600 hover:bg-white"
              }`}
              aria-label="Save to wishlist"
            >
              <Heart
                className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Right Product Actions & Info */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-pink-700 tracking-wider uppercase mb-1">
              <span>{product.category}</span>
              <span>{product.collection} Capsule</span>
            </div>

            <h1 className="font-editorial text-3xl sm:text-4xl text-[#1E171B]">
              {product.name}
            </h1>

            {/* Ratings Bar */}
            <div className="flex items-center gap-3 mt-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-current"
                        : "text-stone-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-stone-700">
                {product.rating} / 5.0
              </span>
              <span className="text-xs text-stone-400">
                ({product.reviewCount} customer reviews)
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pb-4 border-b border-pink-100">
            <span className="font-editorial text-3xl font-bold text-stone-900">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && (
              <span className="text-stone-400 line-through text-base">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
            <span className="text-xs text-stone-500 font-medium">
              (Inclusive of all taxes & GST)
            </span>
          </div>

          {/* Colour Swatches */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-stone-700 uppercase tracking-wider">
                Colour:{" "}
                <strong className="text-stone-900">{selectedColour}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              {product.colours.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColour(c.name)}
                  className={`w-8 h-8 rounded-full border-2 transition-all p-0.5 relative ${
                    selectedColour === c.name
                      ? "border-pink-600 ring-2 ring-pink-200"
                      : "border-stone-200 hover:border-pink-300"
                  }`}
                  title={c.name}
                >
                  <span
                    className="w-full h-full rounded-full block shadow-inner"
                    style={{ backgroundColor: c.hex }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector + Size Guide */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-stone-700 uppercase tracking-wider">
                Select Size:{" "}
                <strong className="text-stone-900">{selectedSize}</strong>
              </span>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-pink-600 hover:text-pink-800 flex items-center gap-1 underline font-semibold text-xs"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2.5 rounded-xl text-xs font-bold uppercase transition-all ${
                    selectedSize === size
                      ? "bg-[#1E171B] text-white shadow-sm"
                      : "bg-white border border-stone-200 text-stone-700 hover:border-pink-300"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Alert */}
          <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50/70 border border-amber-200/60 p-2.5 rounded-xl">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span>
              Hurry! Only <strong>{product.stock} pieces</strong> left in ready
              inventory for this size.
            </span>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-stone-300 rounded-xl bg-white px-2 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 py-1 text-stone-600 hover:text-pink-600 font-bold"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-stone-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2 py-1 text-stone-600 hover:text-pink-600 font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                {addedNotice ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              className="w-full py-4 px-6 bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider shadow-pink-soft flex items-center justify-center gap-2 transition-all"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Buy Now — Instant Checkout</span>
            </button>
          </div>

          {/* Delivery & Assurance Highlights */}
          <div className="pt-4 border-t border-pink-100 space-y-2.5 text-xs text-stone-600">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-pink-600 flex-shrink-0" />
              <span>
                Dispatch within 24-48 hours via Shiprocket express delivery.
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-pink-600 flex-shrink-0" />
              <span>7-day free reverse pickup & hassle-free size exchange.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-pink-600 flex-shrink-0" />
              <span>
                Cash on Delivery (COD) & UPI / Card payments supported.
              </span>
            </div>
          </div>

          {/* Editorial Specs Accordion */}
          <div className="space-y-4 pt-4 border-t border-pink-100">
            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Design & Silhouette
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Fabric */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Fabric & Composition
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {product.fabric}
              </p>
            </div>

            {/* Care */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Garment Care
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {product.careInstructions}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Spotlight */}
      <section className="pt-12 border-t border-pink-100 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-editorial text-2xl sm:text-3xl text-stone-900">
              Customer Reviews ({product.reviewCount})
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Read how fellow muses style this piece in real life.
            </p>
          </div>

          <button
            onClick={() => setShowReviewForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.slice(0, 4).map((r) => (
            <div
              key={r.id}
              className="bg-white p-6 rounded-2xl border border-pink-100 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[11px] text-stone-400">{r.date}</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 italic">
                &ldquo;{r.comment}&rdquo;
              </p>
              <div className="pt-2 border-t border-pink-50 flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900">{r.author}</span>
                <span className="text-stone-400">{r.city}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-pink-100 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-2xl sm:text-3xl text-stone-900">
              Style It With / Related Pieces
            </h2>
            <Link
              href="/shop"
              className="text-xs font-bold uppercase tracking-wider text-pink-600 hover:text-pink-800"
            >
              View More →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsSizeGuideOpen(false)}
          />
          <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 z-10 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-pink-100 pb-4">
              <div>
                <h3 className="font-editorial text-2xl text-stone-900">
                  House of Addya Size Guide
                </h3>
                <p className="text-xs text-stone-500">
                  Measurements in inches (and cm) for standard Indian & Western fit.
                </p>
              </div>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Size Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-pink-50 text-stone-900 border-b border-pink-100">
                    <th className="p-3 font-bold">Size</th>
                    <th className="p-3 font-bold">Bust (in)</th>
                    <th className="p-3 font-bold">Waist (in)</th>
                    <th className="p-3 font-bold">Hip (in)</th>
                    <th className="p-3 font-bold">Equivalent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50">
                  <tr>
                    <td className="p-3 font-bold text-pink-700">XS</td>
                    <td className="p-3">30 - 32</td>
                    <td className="p-3">24 - 26</td>
                    <td className="p-3">34 - 36</td>
                    <td className="p-3">UK 6 / US 2</td>
                  </tr>
                  <tr className="bg-pink-50/30">
                    <td className="p-3 font-bold text-pink-700">S</td>
                    <td className="p-3">33 - 34</td>
                    <td className="p-3">26 - 28</td>
                    <td className="p-3">36 - 38</td>
                    <td className="p-3">UK 8 / US 4</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-pink-700">M</td>
                    <td className="p-3">35 - 36</td>
                    <td className="p-3">28 - 30</td>
                    <td className="p-3">38 - 40</td>
                    <td className="p-3">UK 10 / US 6</td>
                  </tr>
                  <tr className="bg-pink-50/30">
                    <td className="p-3 font-bold text-pink-700">L</td>
                    <td className="p-3">37 - 39</td>
                    <td className="p-3">31 - 33</td>
                    <td className="p-3">41 - 43</td>
                    <td className="p-3">UK 12 / US 8</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-pink-700">XL</td>
                    <td className="p-3">40 - 42</td>
                    <td className="p-3">34 - 36</td>
                    <td className="p-3">44 - 46</td>
                    <td className="p-3">UK 14 / US 10</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-pink-50/60 p-4 rounded-2xl text-xs text-stone-600 space-y-1.5 border border-pink-100">
              <h5 className="font-bold text-stone-900">Between sizes?</h5>
              <p>
                For structured boned corsets, we recommend sizing according to your natural bust and ribcage. For fluid slip dresses and co-ords, choose your normal standard high-street size.
              </p>
            </div>

            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="w-full py-3 bg-[#1E171B] text-white rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Got It, Back to Product
            </button>
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowReviewForm(false)}
          />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 z-10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-pink-100 pb-3">
              <h3 className="font-editorial text-xl text-stone-900">
                Share Your Outfit Experience
              </h3>
              <button
                onClick={() => setShowReviewForm(false)}
                className="p-1 text-stone-400 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  placeholder="e.g. Mehak Singhania"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={reviewCity}
                  onChange={(e) => setReviewCity(e.target.value)}
                  placeholder="e.g. Mumbai, New Delhi"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-amber-400"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating ? "fill-current" : "text-stone-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  Your Review
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="How did the fit, fabric and silhouette feel?"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl uppercase tracking-wider text-xs"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
