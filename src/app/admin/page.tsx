"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store-context";
import { Product, SiteSettings, Coupon, Order } from "@/lib/types";
import {
  Package,
  ShoppingBag,
  SlidersHorizontal,
  TrendingUp,
  AlertTriangle,
  Plus,
  Trash2,
  Edit3,
  Check,
  Save,
  Eye,
  RefreshCw,
  Truck,
  Tag,
  Settings,
  FileText,
  Star,
  Sparkles,
  Search,
  ExternalLink,
  X,
  CreditCard,
  Building,
  Upload,
  Image as ImageIcon,
  Copy,
  Lock,
  Unlock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Layers,
  LayoutGrid,
  List,
  ArrowUpDown,
  Palette,
  Filter,
} from "lucide-react";

export default function AdminPage() {
  const {
    products,
    settings,
    orders,
    coupons,
    reviews,
    updateSettings,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    addCoupon,
    deleteCoupon,
    toggleCouponActive,
    resetToDefaults,
    isCloudConnected,
  } = useStore();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string | null>(null);
  const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || "5692";
  const isCustomPin = ADMIN_PIN !== "1234";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = sessionStorage.getItem("hoa_admin_session");
      if (auth === "true") {
        setIsAuthenticated(true);
      } else {
        const params = new URLSearchParams(window.location.search);
        if (params.get("pin") === ADMIN_PIN || (!isCustomPin && params.get("bypass") === "1")) {
          setIsAuthenticated(true);
          sessionStorage.setItem("hoa_admin_session", "true");
        }
      }
    }
  }, [ADMIN_PIN, isCustomPin]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === ADMIN_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem("hoa_admin_session", "true");
      setPinError(null);
    } else {
      setPinError(isCustomPin ? "Incorrect passkey. Please enter the valid 4-digit PIN." : "Incorrect PIN. Please enter '1234' (default).");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("hoa_admin_session");
    if (typeof window !== "undefined" && window.location.search) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "products"
    | "orders"
    | "coupons"
    | "banners"
    | "settings"
    | "policies"
    | "reviews"
  >("products");

  // Save feedback notice
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const triggerSaveNotice = (msg = "Changes saved successfully!") => {
    setSaveNotice(msg);
    setTimeout(() => setSaveNotice(null), 2500);
  };

  // Local state for Store Settings
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(settings);
  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  // Product Add / Edit Modal state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // File upload input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: "",
    slug: "",
    price: 1999,
    originalPrice: 2499,
    category: "Tops & Corsets",
    collection: "Soft Blossom",
    images: ["/images/product-corset.jpg"],
    colours: [{ name: "Blush Rose", hex: "#E8A598", inStock: true }],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 20,
    description: "",
    fabric: "",
    careInstructions: "",
    isNewArrival: true,
    isBestSeller: false,
    isFeatured: true,
  });

  // Size specific stock counters
  const [sizeStocks, setSizeStocks] = useState<Record<string, number>>({
    XS: 4,
    S: 6,
    M: 6,
    L: 4,
    XL: 2,
  });

  // Coupon Form state
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState<number>(10);
  const [couponMinSpend, setCouponMinSpend] = useState<number>(999);
  const [couponDesc, setCouponDesc] = useState("");

  // Product Search & Filter state
  const [productSearch, setProductSearch] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("ALL");
  const [productViewMode, setProductViewMode] = useState<"table" | "grid">("table");
  const [stockFilter, setStockFilter] = useState<"ALL" | "IN_STOCK" | "LOW_STOCK" | "SOLD_OUT">("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc" | "stock_asc" | "stock_desc">("newest");
  const [imageUrlInput, setImageUrlInput] = useState<string>("");
  const [customColorName, setCustomColorName] = useState("");
  const [customColorHex, setCustomColorHex] = useState("#E8A598");

  // Quick Stock adjustment modal
  const [quickStockProduct, setQuickStockProduct] = useState<Product | null>(null);
  const [quickStockBreakdown, setQuickStockBreakdown] = useState<Record<string, number>>({
    XS: 0,
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
  });

  const COLOR_PRESETS = [
    { name: "Blush Rose", hex: "#E8A598" },
    { name: "Ivory Pearl", hex: "#FFFDF9" },
    { name: "Noir Black", hex: "#1F1A1D" },
    { name: "Champagne Gold", hex: "#D4AF37" },
    { name: "Cherry Wine", hex: "#722F37" },
    { name: "Sage Mist", hex: "#9FAF90" },
    { name: "Lavender Haze", hex: "#B5A6C9" },
    { name: "Midnight Navy", hex: "#1B263B" },
  ];

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setProductForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), imageUrlInput.trim()],
    }));
    setImageUrlInput("");
    triggerSaveNotice("Image URL added to piece!");
  };

  const handleAddPresetColor = (preset: { name: string; hex: string }) => {
    const existing = productForm.colours || [];
    if (existing.some((c) => c.name.toLowerCase() === preset.name.toLowerCase())) return;
    setProductForm((prev) => ({
      ...prev,
      colours: [...existing, { ...preset, inStock: true }],
    }));
  };

  const handleAddCustomColor = () => {
    if (!customColorName.trim()) return;
    const existing = productForm.colours || [];
    setProductForm((prev) => ({
      ...prev,
      colours: [...existing, { name: customColorName.trim(), hex: customColorHex, inStock: true }],
    }));
    setCustomColorName("");
  };

  const handleRemoveColor = (index: number) => {
    setProductForm((prev) => ({
      ...prev,
      colours: (prev.colours || []).filter((_, i) => i !== index),
    }));
  };

  const handleOpenQuickStock = (p: Product) => {
    setQuickStockProduct(p);
    const perSize = Math.floor(p.stock / 5);
    setQuickStockBreakdown({
      XS: perSize,
      S: perSize + (p.stock % 5),
      M: perSize,
      L: perSize,
      XL: perSize,
    });
  };

  const handleSaveQuickStock = () => {
    if (!quickStockProduct) return;
    const newTotal = Object.values(quickStockBreakdown).reduce((a, b) => a + b, 0);
    updateProduct(quickStockProduct.id, { stock: Math.max(0, newTotal) });
    triggerSaveNotice(`Updated inventory for "${quickStockProduct.name}" to ${newTotal} pieces!`);
    setQuickStockProduct(null);
  };

  // Inline stock edit states
  const [inlineEditingStock, setInlineEditingStock] = useState<Record<string, number>>({});

  // KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalUnitsInStock = products.reduce((acc, p) => acc + p.stock, 0);
  const totalInventoryRetailValue = products.reduce((acc, p) => acc + p.stock * p.price, 0);
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock < 10).length;
  const soldOutCount = products.filter((p) => p.stock === 0).length;
  const lowStockProducts = products.filter((p) => p.stock < 10);
  const outOfStockProducts = products.filter((p) => p.stock === 0);

  const filteredAndSortedProducts = products
    .filter((p) => {
      const matchCat = selectedCategoryFilter === "ALL" || p.category === selectedCategoryFilter;
      const matchSearch =
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.collection.toLowerCase().includes(productSearch.toLowerCase()) ||
        (p.fabric && p.fabric.toLowerCase().includes(productSearch.toLowerCase()));
      let matchStock = true;
      if (stockFilter === "IN_STOCK") matchStock = p.stock > 0;
      if (stockFilter === "LOW_STOCK") matchStock = p.stock > 0 && p.stock < 10;
      if (stockFilter === "SOLD_OUT") matchStock = p.stock === 0;

      return matchCat && matchSearch && matchStock;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "stock_asc") return a.stock - b.stock;
      if (sortBy === "stock_desc") return b.stock - a.stock;
      return 0;
    });

  // Handle Photo File Upload (From Phone Camera or Laptop Gallery)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        if (base64Url) {
          setProductForm((prev) => ({
            ...prev,
            images: [...(prev.images || []), base64Url],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (index: number) => {
    setProductForm((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: "",
      slug: "",
      price: 1899,
      originalPrice: 2499,
      category: "Tops & Corsets",
      collection: "Soft Blossom",
      images: ["/images/product-corset.jpg"],
      colours: [
        { name: "Blush Rose", hex: "#E8A598", inStock: true },
        { name: "Ivory Pearl", hex: "#FFFDF9", inStock: true },
        { name: "Noir Black", hex: "#1F1A1D", inStock: true },
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
      stock: 22,
      description: "Engineered with internal flexible boning and an architectural sweetheart neckline.",
      fabric: "Premium Structured Satin Silk Blend.",
      careInstructions: "Delicate dry clean or cold wash. Lay flat to dry.",
      isNewArrival: true,
      isBestSeller: false,
      isFeatured: true,
    });
    setSizeStocks({ XS: 4, S: 6, M: 6, L: 4, XL: 2 });
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProductForm({ ...prod });
    const perSize = Math.floor(prod.stock / 5);
    setSizeStocks({
      XS: perSize,
      S: perSize + (prod.stock % 5),
      M: perSize,
      L: perSize,
      XL: perSize,
    });
    setProductModalOpen(true);
  };

  // Duplicate product for quick styling
  const handleDuplicateProduct = (prod: Product) => {
    const duplicated = addProduct({
      ...prod,
      name: `${prod.name} (Copy)`,
      slug: `${prod.slug}-copy-${Date.now().toString(36)}`,
      stock: prod.stock,
      isNewArrival: true,
    });
    triggerSaveNotice(`Duplicated "${prod.name}" successfully!`);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      alert("Please enter product name and price.");
      return;
    }

    const calculatedStock = Object.values(sizeStocks).reduce((a, b) => a + b, 0) || Number(productForm.stock) || 10;

    const slug =
      productForm.slug ||
      productForm.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    if (editingProductId) {
      updateProduct(editingProductId, {
        ...productForm,
        stock: calculatedStock,
        slug,
      });
      triggerSaveNotice(`Updated "${productForm.name}" successfully!`);
    } else {
      addProduct({
        name: productForm.name!,
        slug,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice) || undefined,
        category: (productForm.category as any) || "Tops & Corsets",
        collection: productForm.collection || "Soft Blossom",
        images: productForm.images?.length
          ? productForm.images
          : ["/images/hero-fashion.jpg"],
        colours: productForm.colours?.length
          ? productForm.colours
          : [{ name: "Blush Rose", hex: "#E8A598", inStock: true }],
        sizes: productForm.sizes?.length ? productForm.sizes : ["XS", "S", "M", "L", "XL"],
        stock: calculatedStock,
        description: productForm.description || "",
        fabric: productForm.fabric || "",
        careInstructions: productForm.careInstructions || "",
        rating: 5.0,
        reviewCount: 0,
        isNewArrival: Boolean(productForm.isNewArrival),
        isBestSeller: Boolean(productForm.isBestSeller),
        isFeatured: Boolean(productForm.isFeatured),
      });
      triggerSaveNotice(`Added new piece "${productForm.name}"!`);
    }

    setProductModalOpen(false);
  };

  const handleInlineStockChange = (productId: string, newStock: number) => {
    updateProduct(productId, { stock: Math.max(0, newStock) });
    triggerSaveNotice("Stock updated!");
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    triggerSaveNotice("Store Settings & Policies updated across the site!");
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    addCoupon({
      code: couponCode.trim().toUpperCase(),
      discountPercent: Number(couponDiscount),
      minOrderValue: Number(couponMinSpend),
      isActive: true,
      description: couponDesc || `${couponDiscount}% off orders above ₹${couponMinSpend}`,
    });
    setCouponCode("");
    setCouponDesc("");
    triggerSaveNotice(`Coupon "${couponCode.toUpperCase()}" created!`);
  };

  // If Not Authenticated, show sleek Owner PIN Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF5F7] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-pink-100 p-8 sm:p-10 shadow-pink-soft text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-pink-50 border border-pink-200/80 flex items-center justify-center mx-auto text-pink-600 shadow-sm">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] tracking-[0.25em] text-pink-700 uppercase font-bold">
              Founder & Atelier Access
            </span>
            <h1 className="font-editorial text-3xl text-stone-900">
              House of Addya CMS
            </h1>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              Please enter your 4-digit admin passkey to manage products, stock, and customer orders.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                maxLength={8}
                autoFocus
                placeholder={isCustomPin ? "Enter 4-Digit Passkey" : "Enter PIN (Default: 1234)"}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full text-center tracking-widest text-lg font-bold py-3.5 px-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:border-pink-500"
              />
            </div>

            {pinError && (
              <p className="text-xs text-rose-600 font-semibold flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{pinError}</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 hover:from-pink-700 hover:to-rose-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-pink-soft transition-all"
            >
              Unlock Dashboard →
            </button>

            {!isCustomPin && (
              <button
                type="button"
                onClick={() => {
                  setIsAuthenticated(true);
                  sessionStorage.setItem("hoa_admin_session", "true");
                }}
                className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-2xl text-xs font-bold transition-colors"
              >
                ⚡ One-Tap Demo Access (Default PIN: 1234)
              </button>
            )}
          </form>

          <div className="pt-2 border-t border-pink-50 text-[11px] text-stone-400">
            {isCustomPin ? (
              <span>House of Addya Atelier Security Gate</span>
            ) : (
              <>
                <span>Default demo pin is </span>
                <strong className="text-stone-800 font-mono">1234</strong>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF7F8] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="bg-white rounded-3xl border border-pink-100 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-500 text-white flex items-center justify-center shadow-pink-soft flex-shrink-0">
              <SlidersHorizontal className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-editorial text-2xl sm:text-3xl text-stone-900">
                  House of Addya CMS
                </h1>
                <span className="px-2.5 py-0.5 bg-pink-100 text-pink-800 text-[10px] font-bold uppercase rounded-full">
                  Owner Dashboard
                </span>
                {isCloudConnected && (
                  <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-[10px] font-bold uppercase rounded-full flex items-center gap-1.5 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Supabase Cloud Active</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Add & remove clothing pieces, adjust inventory stock, track Shiprocket orders, and customize store settings.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Live Store</span>
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </Link>

            <button
              onClick={() => {
                if (confirm("Reset store to default initial data? This will restore sample pieces and settings.")) {
                  resetToDefaults();
                  triggerSaveNotice("Store reset to defaults.");
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 text-stone-500 hover:text-stone-800 text-xs font-semibold"
              title="Reset sample data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 text-stone-500 hover:text-rose-600 text-xs font-semibold"
              title="Lock Admin Panel"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock</span>
            </button>
          </div>
        </div>

        {/* Global Save Toast */}
        {saveNotice && (
          <div className="fixed top-24 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold border border-pink-500 animate-in fade-in slide-in-from-top-4">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{saveNotice}</span>
          </div>
        )}

        {/* Navigation Tabs (Mobile scrollable) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: "products", label: "👗 Products & Stock", icon: Package },
            { id: "orders", label: "📦 Orders & Shipping", icon: Truck },
            { id: "dashboard", label: "📊 Sales Overview", icon: TrendingUp },
            { id: "banners", label: "🖼️ Banners & Hero", icon: Sparkles },
            { id: "coupons", label: "🏷️ Coupons & Promos", icon: Tag },
            { id: "settings", label: "⚙️ Store & GST Settings", icon: Settings },
            { id: "policies", label: "📜 Policy Editor", icon: FileText },
            { id: "reviews", label: "⭐ Reviews Moderation", icon: Star },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#1E171B] text-white shadow-md"
                    : "bg-white text-stone-600 border border-pink-100 hover:bg-pink-50 hover:text-stone-900"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* TAB 1: PRODUCTS & STOCK MANAGEMENT (PRIMARY OWNER FOCUS) */}
        {/* ======================================================== */}
        {activeTab === "products" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Inventory KPI Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <div className="bg-white rounded-2xl border border-pink-100 p-4 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Active Styles</span>
                  <Package className="w-4 h-4 text-pink-600" />
                </div>
                <div className="font-editorial text-2xl font-bold text-stone-900">{products.length}</div>
                <span className="text-[10px] text-stone-400">Total live catalog styles</span>
              </div>

              <div className="bg-white rounded-2xl border border-pink-100 p-4 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Total In Stock</span>
                  <Layers className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="font-editorial text-2xl font-bold text-emerald-700">{totalUnitsInStock}</div>
                <span className="text-[10px] text-stone-400">Total units in inventory</span>
              </div>

              <button
                onClick={() => setStockFilter(stockFilter === "LOW_STOCK" ? "ALL" : "LOW_STOCK")}
                className={`text-left rounded-2xl border p-4 shadow-2xs transition-all ${
                  stockFilter === "LOW_STOCK"
                    ? "bg-amber-50 border-amber-300 ring-2 ring-amber-400"
                    : "bg-white border-pink-100 hover:border-amber-200"
                }`}
              >
                <div className="flex items-center justify-between text-amber-700 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Low Stock</span>
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
                <div className="font-editorial text-2xl font-bold text-amber-800">{lowStockCount}</div>
                <span className="text-[10px] text-stone-500">Less than 10 pieces left</span>
              </button>

              <button
                onClick={() => setStockFilter(stockFilter === "SOLD_OUT" ? "ALL" : "SOLD_OUT")}
                className={`text-left rounded-2xl border p-4 shadow-2xs transition-all ${
                  stockFilter === "SOLD_OUT"
                    ? "bg-rose-50 border-rose-300 ring-2 ring-rose-400"
                    : "bg-white border-pink-100 hover:border-rose-200"
                }`}
              >
                <div className="flex items-center justify-between text-rose-700 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Sold Out</span>
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                </div>
                <div className="font-editorial text-2xl font-bold text-rose-800">{soldOutCount}</div>
                <span className="text-[10px] text-stone-500">Need restock / restyle</span>
              </button>

              <div className="col-span-2 lg:col-span-1 bg-white rounded-2xl border border-pink-100 p-4 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Inventory Value</span>
                  <CreditCard className="w-4 h-4 text-pink-600" />
                </div>
                <div className="font-editorial text-2xl font-bold text-pink-700">
                  ₹{totalInventoryRetailValue.toLocaleString("en-IN")}
                </div>
                <span className="text-[10px] text-stone-400">Total retail inventory</span>
              </div>
            </div>

            {/* Quick Header Banner */}
            <div className="bg-white rounded-3xl border border-pink-100 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h2 className="font-editorial text-2xl text-stone-900">
                    Product Catalog & Self-Service Inventory
                  </h2>
                  <span className="px-3 py-1 bg-pink-100 text-pink-800 text-xs font-bold rounded-full">
                    {products.length} Styles Live
                  </span>
                </div>
                <p className="text-xs text-stone-500">
                  Add new western styles, upload photos from your phone, adjust piece quantities, or delete retired outfits anytime.
                </p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 hover:from-pink-700 hover:to-rose-700 text-white rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider shadow-pink-soft transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add New Product</span>
              </button>
            </div>

            {/* Filter, Search & View Mode Bar */}
            <div className="bg-white rounded-3xl border border-pink-100 p-4 sm:p-6 shadow-2xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-5 relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search pieces by name, category, fabric..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-pink-500 font-semibold"
                  >
                    <option value="ALL">All Categories ({products.length})</option>
                    <option value="Tops & Corsets">Tops & Corsets</option>
                    <option value="Dresses">Dresses</option>
                    <option value="Co-ords">Co-ords</option>
                    <option value="Skirts & Bottoms">Skirts & Bottoms</option>
                    <option value="Outerwear">Outerwear</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-3 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-pink-500 font-semibold"
                  >
                    <option value="newest">Sort: Newest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="stock_asc">Stock: Low to High</option>
                    <option value="stock_desc">Stock: High to Low</option>
                  </select>
                </div>

                {/* Table vs Grid View Toggle */}
                <div className="sm:col-span-2 flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => setProductViewMode("table")}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      productViewMode === "table"
                        ? "bg-stone-900 text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                    title="Table View"
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>Table</span>
                  </button>
                  <button
                    onClick={() => setProductViewMode("grid")}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      productViewMode === "grid"
                        ? "bg-stone-900 text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                    title="Card Grid View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Grid</span>
                  </button>
                </div>
              </div>

              {/* Stock Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-pink-50">
                <span className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider mr-1">
                  Filter Stock:
                </span>
                {[
                  { id: "ALL", label: `All Outfits (${products.length})` },
                  { id: "IN_STOCK", label: `In Stock (${products.filter((p) => p.stock > 0).length})` },
                  { id: "LOW_STOCK", label: `Low Stock (${lowStockCount})` },
                  { id: "SOLD_OUT", label: `Sold Out (${soldOutCount})` },
                ].map((pill) => (
                  <button
                    key={pill.id}
                    onClick={() => setStockFilter(pill.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      stockFilter === pill.id
                        ? "bg-pink-600 text-white shadow-xs"
                        : "bg-pink-50 text-pink-900 hover:bg-pink-100"
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Empty State */}
            {filteredAndSortedProducts.length === 0 && (
              <div className="bg-white rounded-3xl border border-pink-100 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mx-auto">
                  <Package className="w-8 h-8" />
                </div>
                <h3 className="font-editorial text-2xl text-stone-900">No matching pieces found</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try adjusting your search query, clearing filters, or adding a new product to your boutique catalog.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setProductSearch("");
                      setSelectedCategoryFilter("ALL");
                      setStockFilter("ALL");
                    }}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold"
                  >
                    Clear All Filters
                  </button>
                  <button
                    onClick={handleOpenAddProduct}
                    className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    + Add New Piece
                  </button>
                </div>
              </div>
            )}

            {/* VIEW MODE 1: TABLE VIEW */}
            {productViewMode === "table" && filteredAndSortedProducts.length > 0 && (
              <div className="bg-white rounded-3xl border border-pink-100 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-pink-50/70 text-stone-900 border-b border-pink-100">
                        <th className="p-4 font-bold">Image</th>
                        <th className="p-4 font-bold">Outfit Details</th>
                        <th className="p-4 font-bold">Category & Capsule</th>
                        <th className="p-4 font-bold">Selling Price</th>
                        <th className="p-4 font-bold">Total Stock Quantity</th>
                        <th className="p-4 font-bold">Status</th>
                        <th className="p-4 font-bold text-right">Quick Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-pink-50">
                      {filteredAndSortedProducts.map((p) => {
                        const isLowStock = p.stock > 0 && p.stock < 10;
                        const isSoldOut = p.stock === 0;

                        return (
                          <tr key={p.id} className="hover:bg-pink-50/20 transition-colors">
                            {/* Product Image */}
                            <td className="p-4">
                              <img
                                src={p.images[0]}
                                alt={p.name}
                                className="w-14 h-16 object-cover rounded-xl bg-pink-50 border border-pink-100 shadow-xs"
                              />
                            </td>

                            {/* Title & Sizes */}
                            <td className="p-4">
                              <Link
                                href={`/product/${p.slug}`}
                                target="_blank"
                                className="font-editorial text-sm font-bold text-stone-900 hover:text-pink-600 transition-colors block"
                              >
                                {p.name}
                              </Link>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] text-stone-500">
                                  Sizes: {p.sizes.join(", ")}
                                </span>
                                <button
                                  onClick={() => handleOpenQuickStock(p)}
                                  className="text-[10px] text-pink-700 hover:underline font-bold"
                                  title="Adjust per-size inventory count"
                                >
                                  (Adjust Sizes)
                                </button>
                              </div>
                              <div className="flex items-center gap-1.5 mt-1">
                                {p.colours.map((c) => (
                                  <span
                                    key={c.name}
                                    title={c.name}
                                    className="w-2.5 h-2.5 rounded-full border border-stone-300"
                                    style={{ backgroundColor: c.hex }}
                                  />
                                ))}
                              </div>
                            </td>

                            {/* Category & Collection */}
                            <td className="p-4">
                              <strong className="text-stone-800 block">{p.category}</strong>
                              <span className="text-stone-500 text-[11px]">{p.collection}</span>
                            </td>

                            {/* Price */}
                            <td className="p-4">
                              <span className="font-bold text-stone-900 text-sm">
                                ₹{p.price.toLocaleString("en-IN")}
                              </span>
                              {p.originalPrice && (
                                <span className="text-[11px] text-stone-400 line-through block">
                                  ₹{p.originalPrice.toLocaleString("en-IN")}
                                </span>
                              )}
                            </td>

                            {/* Quantity / Stock Stepper */}
                            <td className="p-4">
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => handleInlineStockChange(p.id, p.stock - 5)}
                                    className="px-1.5 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[10px] font-bold"
                                    title="Decrease stock by 5"
                                  >
                                    -5
                                  </button>
                                  <button
                                    onClick={() => handleInlineStockChange(p.id, p.stock - 1)}
                                    className="w-6 h-6 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs font-bold"
                                    title="Decrease stock by 1"
                                  >
                                    -
                                  </button>
                                  <input
                                    type="number"
                                    min="0"
                                    value={inlineEditingStock[p.id] ?? p.stock}
                                    onChange={(e) =>
                                      setInlineEditingStock({
                                        ...inlineEditingStock,
                                        [p.id]: Number(e.target.value),
                                      })
                                    }
                                    onBlur={(e) => {
                                      handleInlineStockChange(p.id, Number(e.target.value));
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        handleInlineStockChange(p.id, (e.target as any).value);
                                      }
                                    }}
                                    className="w-14 text-center py-1 border border-stone-300 rounded font-bold text-xs"
                                  />
                                  <button
                                    onClick={() => handleInlineStockChange(p.id, p.stock + 1)}
                                    className="w-6 h-6 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs font-bold"
                                    title="Increase stock by 1"
                                  >
                                    +
                                  </button>
                                  <button
                                    onClick={() => handleInlineStockChange(p.id, p.stock + 5)}
                                    className="px-1.5 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[10px] font-bold"
                                    title="Increase stock by 5"
                                  >
                                    +5
                                  </button>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleInlineStockChange(p.id, 0)}
                                    className="text-[10px] text-stone-400 hover:text-rose-600 underline"
                                  >
                                    Mark Sold Out
                                  </button>
                                  <button
                                    onClick={() => handleInlineStockChange(p.id, p.stock + 20)}
                                    className="text-[10px] text-emerald-600 hover:underline font-semibold"
                                  >
                                    Restock +20
                                  </button>
                                </div>
                              </div>
                            </td>

                            {/* Stock Badge */}
                            <td className="p-4">
                              {isSoldOut ? (
                                <span className="px-2.5 py-1 bg-stone-200 text-stone-700 text-[10px] font-bold rounded-full uppercase">
                                  Sold Out
                                </span>
                              ) : isLowStock ? (
                                <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full uppercase">
                                  Low ({p.stock} left)
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase">
                                  In Stock ({p.stock})
                                </span>
                              )}
                            </td>

                            {/* Actions: Edit, Duplicate, Delete */}
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenEditProduct(p)}
                                  className="p-2 text-stone-600 hover:text-pink-600 bg-stone-50 hover:bg-pink-50 rounded-xl transition-colors"
                                  title="Edit Piece Details & Pricing"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => handleDuplicateProduct(p)}
                                  className="p-2 text-stone-600 hover:text-stone-900 bg-stone-50 hover:bg-stone-200 rounded-xl transition-colors"
                                  title="Duplicate / Clone Piece"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => setDeleteConfirmId(p.id)}
                                  className="p-2 text-stone-400 hover:text-rose-600 bg-stone-50 hover:bg-rose-50 rounded-xl transition-colors"
                                  title="Delete Piece"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW MODE 2: CARD GRID VIEW (MOBILE & VISUAL FRIENDLY) */}
            {productViewMode === "grid" && filteredAndSortedProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedProducts.map((p) => {
                  const isLowStock = p.stock > 0 && p.stock < 10;
                  const isSoldOut = p.stock === 0;

                  return (
                    <div
                      key={p.id}
                      className="bg-white rounded-3xl border border-pink-100 overflow-hidden shadow-xs hover:shadow-pink-soft transition-all flex flex-col justify-between group"
                    >
                      {/* Image & Badges */}
                      <div className="relative aspect-[3/4] bg-pink-50 overflow-hidden">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                          {isSoldOut ? (
                            <span className="px-3 py-1 bg-stone-900 text-white text-[10px] font-bold rounded-full uppercase shadow-xs">
                              Sold Out
                            </span>
                          ) : isLowStock ? (
                            <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-full uppercase shadow-xs">
                              Low: {p.stock} Left
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-full uppercase shadow-xs">
                              Stock: {p.stock}
                            </span>
                          )}

                          {p.isNewArrival && (
                            <span className="px-2.5 py-0.5 bg-pink-600 text-white text-[9px] font-bold rounded-full uppercase">
                              New Drop
                            </span>
                          )}
                        </div>

                        {/* Live Link Button */}
                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-xl text-stone-700 hover:text-pink-600 transition-colors shadow-xs"
                          title="View on Live Store"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      {/* Content & Details */}
                      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] text-pink-700 font-bold uppercase tracking-wider">
                            <span>{p.category}</span>
                            <span className="text-stone-400 font-normal">{p.collection}</span>
                          </div>

                          <Link
                            href={`/product/${p.slug}`}
                            target="_blank"
                            className="font-editorial text-lg text-stone-900 font-bold hover:text-pink-600 transition-colors line-clamp-1"
                          >
                            {p.name}
                          </Link>

                          <div className="flex items-center gap-2">
                            <span className="font-editorial text-xl font-bold text-stone-900">
                              ₹{p.price.toLocaleString("en-IN")}
                            </span>
                            {p.originalPrice && (
                              <span className="text-xs text-stone-400 line-through">
                                ₹{p.originalPrice.toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-1 text-[11px] text-stone-500 border-t border-pink-50">
                            <span>Sizes: {p.sizes.join(", ")}</span>
                            <div className="flex items-center gap-1">
                              {p.colours.map((c) => (
                                <span
                                  key={c.name}
                                  title={c.name}
                                  className="w-2.5 h-2.5 rounded-full border border-stone-300"
                                  style={{ backgroundColor: c.hex }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Quick Stock Controls */}
                        <div className="bg-pink-50/50 p-3 rounded-2xl border border-pink-100 space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-bold text-stone-600">
                            <span>INVENTORY STOCK</span>
                            <button
                              onClick={() => handleOpenQuickStock(p)}
                              className="text-pink-700 hover:underline font-bold"
                            >
                              Adjust Sizes →
                            </button>
                          </div>

                          <div className="flex items-center justify-between gap-1">
                            <button
                              onClick={() => handleInlineStockChange(p.id, p.stock - 5)}
                              className="px-2 py-1 bg-white hover:bg-stone-100 text-stone-700 rounded-lg text-[10px] font-bold border border-pink-100"
                            >
                              -5
                            </button>
                            <button
                              onClick={() => handleInlineStockChange(p.id, p.stock - 1)}
                              className="w-7 h-7 bg-white hover:bg-stone-100 text-stone-700 rounded-lg text-xs font-bold border border-pink-100"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={inlineEditingStock[p.id] ?? p.stock}
                              onChange={(e) =>
                                setInlineEditingStock({
                                  ...inlineEditingStock,
                                  [p.id]: Number(e.target.value),
                                })
                              }
                              onBlur={(e) => {
                                handleInlineStockChange(p.id, Number(e.target.value));
                              }}
                              className="w-14 text-center py-1 bg-white border border-pink-200 rounded-lg font-bold text-xs"
                            />
                            <button
                              onClick={() => handleInlineStockChange(p.id, p.stock + 1)}
                              className="w-7 h-7 bg-white hover:bg-stone-100 text-stone-700 rounded-lg text-xs font-bold border border-pink-100"
                            >
                              +
                            </button>
                            <button
                              onClick={() => handleInlineStockChange(p.id, p.stock + 5)}
                              className="px-2 py-1 bg-white hover:bg-stone-100 text-stone-700 rounded-lg text-[10px] font-bold border border-pink-100"
                            >
                              +5
                            </button>
                          </div>

                          <div className="flex items-center justify-between text-[10px] pt-1 border-t border-pink-100">
                            <button
                              onClick={() => handleInlineStockChange(p.id, 0)}
                              className="text-stone-400 hover:text-rose-600 underline"
                            >
                              Mark Sold Out
                            </button>
                            <button
                              onClick={() => handleInlineStockChange(p.id, p.stock + 20)}
                              className="text-emerald-700 hover:underline font-bold"
                            >
                              Restock +20
                            </button>
                          </div>
                        </div>

                        {/* Action Buttons: Edit, Duplicate, Delete */}
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-pink-50">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="flex items-center justify-center gap-1 py-2 bg-stone-50 hover:bg-pink-50 text-stone-700 hover:text-pink-700 rounded-xl text-xs font-bold transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDuplicateProduct(p)}
                            className="flex items-center justify-center gap-1 py-2 bg-stone-50 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Clone</span>
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="flex items-center justify-center gap-1 py-2 bg-stone-50 hover:bg-rose-50 text-stone-400 hover:text-rose-600 rounded-xl text-xs font-bold transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: ORDERS & SHIPPING FULFILLMENT */}
        {/* ======================================================== */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-pink-100 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-pink-100">
                <div>
                  <h3 className="font-editorial text-2xl text-stone-900">
                    Customer Orders ({orders.length})
                  </h3>
                  <p className="text-xs text-stone-500">
                    Update order progress and enter Shiprocket AWB tracking numbers.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-6 rounded-2xl border border-pink-100 bg-[#FAF7F8] space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-pink-200/50">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="font-editorial text-lg text-stone-900">
                            Order #{ord.id}
                          </strong>
                          <span className="text-xs text-stone-400">({ord.date})</span>
                        </div>
                        <p className="text-xs text-stone-600 mt-0.5">
                          Customer: <strong>{ord.customer.fullName}</strong> • {ord.customer.phone} • {ord.customer.email}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-editorial text-xl font-bold text-pink-700">
                          ₹{ord.total.toLocaleString("en-IN")}
                        </span>
                        <span className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-xs font-semibold">
                          {ord.paymentMethod} ({ord.paymentStatus})
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-2">
                        <span className="font-bold uppercase tracking-wider text-stone-500 block">
                          Ordered Outfits:
                        </span>
                        {ord.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-pink-100/60"
                          >
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-10 h-12 object-cover rounded-lg bg-pink-50"
                            />
                            <div>
                              <p className="font-bold text-stone-900">{item.product.name}</p>
                              <span className="text-stone-500">
                                Size: {item.selectedSize} • Qty: {item.quantity} • ₹{item.product.price}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <span className="font-bold uppercase tracking-wider text-stone-500 block">
                          Shipping Address:
                        </span>
                        <div className="bg-white p-3 rounded-xl border border-pink-100/60 text-stone-600 leading-relaxed">
                          {ord.customer.address},{" "}
                          {ord.customer.apartment && `${ord.customer.apartment}, `}
                          {ord.customer.city}, {ord.customer.state} - {ord.customer.pincode}
                        </div>

                        {ord.customer.notes && (
                          <div className="p-2.5 bg-pink-50 rounded-xl border border-pink-200 text-stone-800 text-[11px] font-medium flex items-start gap-2">
                            <FileText className="w-3.5 h-3.5 text-pink-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-bold text-pink-900 block">Payment Reference / Notes:</span>
                              <span className="font-mono">{ord.customer.notes}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-pink-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-stone-700">Status:</span>
                        <select
                          value={ord.orderStatus}
                          onChange={(e) =>
                            updateOrderStatus(ord.id, e.target.value as Order["orderStatus"])
                          }
                          className="bg-white border border-stone-300 rounded-xl px-3 py-1.5 font-bold text-stone-800"
                        >
                          <option value="Order Confirmed">Order Confirmed</option>
                          <option value="Processing">Processing / Atelier</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped via Shiprocket</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-700">Shiprocket AWB:</span>
                        <input
                          type="text"
                          defaultValue={ord.trackingNumber || ""}
                          onBlur={(e) =>
                            updateOrderStatus(ord.id, ord.orderStatus, e.target.value)
                          }
                          placeholder="e.g. SR-88291039"
                          className="bg-white border border-stone-300 rounded-xl px-3 py-1.5 font-mono text-xs w-40"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: DASHBOARD METRICS */}
        {/* ======================================================== */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-xs space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Total Sales Revenue
                </span>
                <p className="font-editorial text-3xl font-bold text-stone-900">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </p>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +18% this month
                </span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-xs space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Active Orders
                </span>
                <p className="font-editorial text-3xl font-bold text-stone-900">
                  {orders.length}
                </p>
                <span className="text-[11px] text-stone-500">
                  Dispatched via Shiprocket
                </span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-xs space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Catalog Styles
                </span>
                <p className="font-editorial text-3xl font-bold text-stone-900">
                  {products.length}
                </p>
                <span className="text-[11px] text-pink-700 font-semibold">
                  Western Silhouettes Live
                </span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-xs space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Low Stock Alert
                </span>
                <p className="font-editorial text-3xl font-bold text-amber-600">
                  {lowStockProducts.length}
                </p>
                <span className="text-[11px] text-amber-700 font-medium">
                  Pieces &lt; 10 units remaining
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: BANNERS & HOMEPAGE CONTENT */}
        {/* ======================================================== */}
        {activeTab === "banners" && (
          <form onSubmit={handleSaveSettings} className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-pink-100 p-8 shadow-xs space-y-6">
              <h3 className="font-editorial text-xl text-stone-900 pb-3 border-b border-pink-100">
                Homepage Hero & Announcement Banners
              </h3>

              <div className="space-y-4 text-xs">
                <div className="bg-pink-50/60 p-5 rounded-2xl border border-pink-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-stone-900 uppercase tracking-wider">
                      Top Announcement Bar
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settingsForm.announcementEnabled}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            announcementEnabled: e.target.checked,
                          })
                        }
                        className="accent-pink-600"
                      />
                      <span className="text-stone-700 font-semibold">
                        Show Announcement Bar
                      </span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={settingsForm.announcementText}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        announcementText: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1 uppercase tracking-wider">
                    Hero Section Headline
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroHeadline}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        heroHeadline: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1 uppercase tracking-wider">
                    Hero Subtitle Description
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.heroSubtext}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        heroSubtext: e.target.value,
                      })
                    }
                    className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1 uppercase tracking-wider">
                    Hero Campaign Photo URL
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroImageUrl}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        heroImageUrl: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 bg-[#1E171B] hover:bg-pink-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Banner & Homepage Content</span>
              </button>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* TAB 5: COUPONS */}
        {/* ======================================================== */}
        {activeTab === "coupons" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-pink-100 p-8 shadow-xs space-y-5">
              <h3 className="font-editorial text-xl text-stone-900 pb-3 border-b border-pink-100">
                Create New Promo Code
              </h3>

              <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VIP25"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl uppercase tracking-wider font-bold"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Discount % *</label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    required
                    value={couponDiscount}
                    onChange={(e) => setCouponDiscount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Min Spend (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={couponMinSpend}
                    onChange={(e) => setCouponMinSpend(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    Add Coupon Code
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-3xl border border-pink-100 overflow-hidden shadow-xs">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-pink-50/70 text-stone-900 border-b border-pink-100">
                    <th className="p-4 font-bold">Code</th>
                    <th className="p-4 font-bold">Discount</th>
                    <th className="p-4 font-bold">Min Spend</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50">
                  {coupons.map((c) => (
                    <tr key={c.id}>
                      <td className="p-4 font-bold text-pink-700 font-mono text-sm">{c.code}</td>
                      <td className="p-4 font-medium">
                        {c.discountPercent ? `${c.discountPercent}% OFF` : `₹${c.discountFlat} FLAT`}
                      </td>
                      <td className="p-4 text-stone-600">₹{c.minOrderValue.toLocaleString("en-IN")}</td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleCouponActive(c.id)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                            c.isActive ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-600"
                          }`}
                        >
                          {c.isActive ? "Active" : "Disabled"}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => deleteCoupon(c.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: STORE SETTINGS */}
        {/* ======================================================== */}
        {activeTab === "settings" && (
          <form onSubmit={handleSaveSettings} className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-pink-100 p-8 shadow-xs space-y-6">
              <h3 className="font-editorial text-xl text-stone-900 pb-3 border-b border-pink-100 flex items-center gap-2">
                <Building className="w-5 h-5 text-pink-600" />
                <span>Business, GSTIN & Logistics Configurations</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={settingsForm.brandName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Founder Name</label>
                  <input
                    type="text"
                    value={settingsForm.founderName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, founderName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Business Support Email</label>
                  <input
                    type="email"
                    value={settingsForm.businessEmail}
                    onChange={(e) => setSettingsForm({ ...settingsForm, businessEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Business Phone Number</label>
                  <input
                    type="text"
                    value={settingsForm.businessPhone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, businessPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">WhatsApp Concierge Mobile</label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    value={settingsForm.gstNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, gstNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl uppercase font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-700 font-bold mb-1">Studio Address</label>
                  <input
                    type="text"
                    value={settingsForm.businessAddress}
                    onChange={(e) => setSettingsForm({ ...settingsForm, businessAddress: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-700 font-bold mb-1">Returns Hub Address</label>
                  <input
                    type="text"
                    value={settingsForm.returnAddress}
                    onChange={(e) => setSettingsForm({ ...settingsForm, returnAddress: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2 pt-4 border-t border-pink-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">Standard Shipping Fee (₹)</label>
                    <input
                      type="number"
                      value={settingsForm.shippingFeeStandard}
                      onChange={(e) => setSettingsForm({ ...settingsForm, shippingFeeStandard: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-bold mb-1">Free Shipping Threshold (₹)</label>
                    <input
                      type="number"
                      value={settingsForm.freeShippingThreshold}
                      onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-bold mb-1">COD Handling Fee (₹)</label>
                    <input
                      type="number"
                      value={settingsForm.codFee}
                      onChange={(e) => setSettingsForm({ ...settingsForm, codFee: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>
                </div>

                {/* Payment Gateway & Direct UPI Section */}
                <div className="sm:col-span-2 pt-6 border-t border-pink-100 space-y-4">
                  <h4 className="font-editorial text-lg text-stone-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-pink-600" />
                    <span>Payment Methods & Merchant Credentials</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        Merchant UPI ID (Zero Gateway Fee)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. anmoldube93@okhdfcbank"
                        value={settingsForm.upiId || ""}
                        onChange={(e) => setSettingsForm({ ...settingsForm, upiId: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-800"
                      />
                      <p className="text-[10px] text-stone-400 mt-1">
                        Customers scanning the dynamic QR at checkout pay directly to this UPI VPA with 0% gateway commission.
                      </p>
                    </div>

                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        Razorpay Merchant Key (Optional Future Gateway)
                      </label>
                      <input
                        type="text"
                        placeholder="rzp_live_xxxxxxxx (Optional)"
                        value={settingsForm.razorpayKeyId || ""}
                        onChange={(e) => setSettingsForm({ ...settingsForm, razorpayKeyId: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-800"
                      />
                      <p className="text-[10px] text-stone-400 mt-1">
                        Optional: Leave empty for direct zero-fee settlement. Direct UPI and Punjab National Bank are active by default.
                      </p>
                    </div>

                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        Settlement Bank Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. PUNJAB NATIONAL BANK"
                        value={settingsForm.bankName || ""}
                        onChange={(e) => setSettingsForm({ ...settingsForm, bankName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        Bank Account Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 0781100100005018"
                        value={settingsForm.accountNumber || ""}
                        onChange={(e) => setSettingsForm({ ...settingsForm, accountNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-800 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        Bank IFSC Code
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. PUNB0078110"
                        value={settingsForm.ifscCode || ""}
                        onChange={(e) => setSettingsForm({ ...settingsForm, ifscCode: e.target.value.toUpperCase() })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-800 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        Account Holder / Beneficiary Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Anmol Dubey"
                        value={settingsForm.accountHolderName || ""}
                        onChange={(e) => setSettingsForm({ ...settingsForm, accountHolderName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 font-semibold"
                      />
                    </div>

                    <div className="sm:col-span-2 p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-emerald-950 block">
                            Direct Settlement Active: {settingsForm.bankName || "PUNJAB NATIONAL BANK"}
                          </span>
                          <span className="text-[11px] text-emerald-700 font-mono">
                            A/C: {settingsForm.accountNumber || "0781100100005018"} • IFSC: {settingsForm.ifscCode || "PUNB0078110"} • UPI: {settingsForm.upiId || "anmoldube93@okhdfcbank"}
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        0% Commission Direct
                      </span>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-pink-50/50 rounded-2xl border border-pink-100">
                      <input
                        type="checkbox"
                        id="razorpayEnabled"
                        checked={settingsForm.razorpayEnabled ?? true}
                        onChange={(e) => setSettingsForm({ ...settingsForm, razorpayEnabled: e.target.checked })}
                        className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                      />
                      <label htmlFor="razorpayEnabled" className="text-xs font-semibold text-stone-800 cursor-pointer">
                        Enable Online Gateway (Cards & NetBanking via Razorpay)
                      </label>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-pink-50/50 rounded-2xl border border-pink-100">
                      <input
                        type="checkbox"
                        id="codAvailable"
                        checked={settingsForm.codAvailable ?? true}
                        onChange={(e) => setSettingsForm({ ...settingsForm, codAvailable: e.target.checked })}
                        className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                      />
                      <label htmlFor="codAvailable" className="text-xs font-semibold text-stone-800 cursor-pointer">
                        Enable Cash on Delivery (COD) Checkout Option
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 bg-pink-600 hover:bg-pink-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Business Settings</span>
              </button>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* TAB 7: POLICY EDITOR */}
        {/* ======================================================== */}
        {activeTab === "policies" && (
          <form onSubmit={handleSaveSettings} className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-pink-100 p-8 shadow-xs space-y-6">
              <h3 className="font-editorial text-xl text-stone-900 pb-3 border-b border-pink-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-pink-600" />
                <span>Store Policies & Legal Terms</span>
              </h3>

              <div className="space-y-5 text-xs">
                <div>
                  <label className="block text-stone-900 font-bold uppercase tracking-wider mb-1">
                    Return & Size Exchange Policy
                  </label>
                  <textarea
                    rows={4}
                    value={settingsForm.policies.returnExchangePolicy}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        policies: { ...settingsForm.policies, returnExchangePolicy: e.target.value },
                      })
                    }
                    className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-stone-900 font-bold uppercase tracking-wider mb-1">
                    Shipping & Delivery Policy
                  </label>
                  <textarea
                    rows={4}
                    value={settingsForm.policies.shippingPolicy}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        policies: { ...settingsForm.policies, shippingPolicy: e.target.value },
                      })
                    }
                    className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl leading-relaxed"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 bg-pink-600 hover:bg-pink-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Policies</span>
              </button>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* TAB 8: REVIEWS */}
        {/* ======================================================== */}
        {activeTab === "reviews" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-pink-100 p-8 shadow-xs space-y-4">
              <h3 className="font-editorial text-xl text-stone-900 pb-3 border-b border-pink-100">
                Customer Reviews & Ratings ({reviews.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl border border-pink-100 bg-[#FAF7F8] space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="text-[11px] text-stone-400">{rev.date}</span>
                      </div>
                      <p className="text-stone-800 font-medium italic mt-2">&ldquo;{rev.comment}&rdquo;</p>
                    </div>

                    <div className="pt-2 border-t border-pink-200/50 flex items-center justify-between text-[11px]">
                      <div>
                        <strong className="text-stone-900">{rev.author}</strong>
                        <span className="text-stone-400"> • {rev.city}</span>
                      </div>
                      <span className="text-pink-700 font-semibold">{rev.productName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* QUICK SIZE & STOCK ADJUSTMENT MODAL */}
      {/* ======================================================== */}
      {quickStockProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setQuickStockProduct(null)}
          />

          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 z-10 shadow-2xl space-y-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-pink-100">
              <div className="flex items-center gap-3">
                <img
                  src={quickStockProduct.images[0]}
                  alt={quickStockProduct.name}
                  className="w-12 h-14 object-cover rounded-xl border border-pink-100 bg-pink-50"
                />
                <div>
                  <h3 className="font-editorial text-xl text-stone-900 leading-tight">
                    {quickStockProduct.name}
                  </h3>
                  <span className="text-[11px] text-pink-700 font-bold uppercase tracking-wider">
                    Quick Inventory Adjustment
                  </span>
                </div>
              </div>
              <button
                onClick={() => setQuickStockProduct(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuickStockBreakdown({ XS: 5, S: 5, M: 5, L: 5, XL: 5 })}
                className="px-2.5 py-1 bg-pink-50 hover:bg-pink-100 text-pink-800 rounded-lg text-[10px] font-bold"
              >
                Set All to 5
              </button>
              <button
                type="button"
                onClick={() => setQuickStockBreakdown({ XS: 10, S: 10, M: 10, L: 10, XL: 10 })}
                className="px-2.5 py-1 bg-pink-50 hover:bg-pink-100 text-pink-800 rounded-lg text-[10px] font-bold"
              >
                Set All to 10
              </button>
              <button
                type="button"
                onClick={() => setQuickStockBreakdown({ XS: 0, S: 0, M: 0, L: 0, XL: 0 })}
                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-[10px] font-bold"
              >
                Mark Sold Out (0)
              </button>
            </div>

            {/* Per-Size Steppers */}
            <div className="grid grid-cols-5 gap-2 text-center">
              {["XS", "S", "M", "L", "XL"].map((sz) => (
                <div key={sz} className="bg-pink-50/50 p-2.5 rounded-2xl border border-pink-100 space-y-1.5">
                  <span className="text-xs font-bold text-pink-800 block">{sz}</span>
                  <input
                    type="number"
                    min="0"
                    value={quickStockBreakdown[sz] ?? 0}
                    onChange={(e) =>
                      setQuickStockBreakdown({
                        ...quickStockBreakdown,
                        [sz]: Math.max(0, Number(e.target.value)),
                      })
                    }
                    className="w-full text-center py-1.5 bg-white border border-pink-200 rounded-lg font-bold text-xs"
                  />
                  <div className="flex items-center justify-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setQuickStockBreakdown({
                          ...quickStockBreakdown,
                          [sz]: Math.max(0, (quickStockBreakdown[sz] ?? 0) - 1),
                        })
                      }
                      className="w-5 h-5 bg-white hover:bg-stone-100 rounded text-[10px] font-bold border border-pink-100"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setQuickStockBreakdown({
                          ...quickStockBreakdown,
                          [sz]: (quickStockBreakdown[sz] ?? 0) + 1,
                        })
                      }
                      className="w-5 h-5 bg-white hover:bg-stone-100 rounded text-[10px] font-bold border border-pink-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl flex items-center justify-between text-xs font-bold text-stone-700">
              <span>Total Units Ready to Ship:</span>
              <span className="font-editorial text-lg text-pink-700">
                {Object.values(quickStockBreakdown).reduce((a, b) => a + b, 0)} Units
              </span>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setQuickStockProduct(null)}
                className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs uppercase"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveQuickStock}
                className="flex-1 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-sm"
              >
                Save Stock Quantity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ADD / EDIT PRODUCT MODAL (COMPLETE SELF-SERVICE FOR OWNER) */}
      {/* ======================================================== */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setProductModalOpen(false)}
          />

          <div className="relative bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 z-10 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-pink-100">
              <div>
                <h3 className="font-editorial text-2xl text-stone-900">
                  {editingProductId ? "Edit Outfit Piece" : "Add New Clothing Piece"}
                </h3>
                <p className="text-xs text-stone-500">
                  Add photos, set prices, assign colors, and configure ready stock quantities.
                </p>
              </div>
              <button
                onClick={() => setProductModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6 text-xs">
              {/* Image Upload Area: Phone Camera / File Picker + Image URL */}
              <div className="space-y-3 bg-pink-50/40 p-4 sm:p-5 rounded-2xl border border-pink-100">
                <div className="flex items-center justify-between">
                  <label className="block text-stone-800 font-bold uppercase tracking-wider">
                    Product Photos (Camera, Photo Library or URL) *
                  </label>
                  <span className="text-[11px] text-pink-700 font-bold">
                    {(productForm.images || []).length} Photo(s) Attached
                  </span>
                </div>

                {/* Upload Thumbnails */}
                <div className="flex flex-wrap gap-3 items-center">
                  {(productForm.images || []).map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-20 h-24 rounded-xl overflow-hidden border-2 border-pink-200 bg-pink-50 group"
                    >
                      <img src={img} alt="Preview" className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 bg-stone-900/80 text-white text-[8px] font-bold px-1 rounded uppercase">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-1 right-1 bg-black/60 hover:bg-rose-600 text-white p-1 rounded-full opacity-80 hover:opacity-100 transition-opacity"
                        title="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {/* Upload Trigger Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-24 rounded-xl border-2 border-dashed border-pink-300 hover:border-pink-500 bg-white hover:bg-pink-100/50 flex flex-col items-center justify-center gap-1.5 text-pink-700 transition-all p-2 text-center"
                  >
                    <Upload className="w-5 h-5 text-pink-500" />
                    <span className="text-[10px] font-bold">+ Upload</span>
                    <span className="text-[8px] text-stone-400">Camera / Files</span>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>

                {/* Direct Image URL input option */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="url"
                    placeholder="Or paste an image URL (Unsplash, Cloudinary, Instagram, Imgur)..."
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-pink-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2 bg-stone-900 hover:bg-pink-600 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    + Add URL
                  </button>
                </div>

                <p className="text-[11px] text-stone-400">
                  Tip: On mobile, tapping <strong>+ Upload</strong> opens your iPhone/Android camera directly so you can photograph new pieces right in your studio!
                </p>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Piece Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Rosewood Sculpted Corset"
                    value={productForm.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)+/g, "");
                      setProductForm({ ...productForm, name, slug: productForm.slug || slug });
                    }}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                  >
                    <option value="Tops & Corsets">Tops & Corsets</option>
                    <option value="Dresses">Dresses</option>
                    <option value="Co-ords">Co-ords</option>
                    <option value="Skirts & Bottoms">Skirts & Bottoms</option>
                    <option value="Outerwear">Outerwear</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="1899"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-stone-700 font-bold">Original Price (Strike-through ₹)</label>
                    {productForm.price && productForm.originalPrice && productForm.originalPrice > productForm.price && (
                      <span className="text-[10px] text-pink-700 font-bold">
                        {Math.round(((productForm.originalPrice - productForm.price) / productForm.originalPrice) * 100)}% OFF (Save ₹{productForm.originalPrice - productForm.price})
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    placeholder="2499"
                    value={productForm.originalPrice || ""}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Capsule Collection</label>
                  <select
                    value={productForm.collection}
                    onChange={(e) => setProductForm({ ...productForm, collection: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="Soft Blossom">Soft Blossom</option>
                    <option value="Date Night Euphoria">Date Night Euphoria</option>
                    <option value="Brunch & Bubbly">Brunch & Bubbly</option>
                    <option value="Midnight Muse">Midnight Muse</option>
                    <option value="Everyday Chic">Everyday Chic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Total Stock Count (Auto Computed)</label>
                  <input
                    type="number"
                    value={Object.values(sizeStocks).reduce((a, b) => a + b, 0)}
                    disabled
                    className="w-full px-3.5 py-2.5 bg-stone-100 border border-stone-200 rounded-xl font-bold text-pink-700"
                  />
                </div>
              </div>

              {/* Color Swatch Manager */}
              <div className="space-y-2 bg-pink-50/50 p-4 rounded-2xl border border-pink-100">
                <div className="flex items-center justify-between">
                  <label className="block text-stone-800 font-bold uppercase tracking-wider">
                    Available Colors & Swatches
                  </label>
                  <span className="text-[10px] text-stone-400">Tap preset to add colorway</span>
                </div>

                {/* Preset Color Chips */}
                <div className="flex flex-wrap gap-1.5 items-center">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleAddPresetColor(preset)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-pink-200 hover:border-pink-500 rounded-full text-[10px] font-bold text-stone-700 transition-colors"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-stone-300"
                        style={{ backgroundColor: preset.hex }}
                      />
                      <span>+ {preset.name}</span>
                    </button>
                  ))}
                </div>

                {/* Currently Assigned Colors */}
                <div className="flex flex-wrap gap-2 items-center pt-2">
                  {(productForm.colours || []).map((col, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-pink-100 text-xs font-semibold shadow-2xs"
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-stone-300"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className="text-stone-800">{col.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(idx)}
                        className="text-stone-400 hover:text-rose-600"
                        title="Remove color"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Custom Color Input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="color"
                    value={customColorHex}
                    onChange={(e) => setCustomColorHex(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-stone-300 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Custom Color Name (e.g. Desert Sand)..."
                    value={customColorName}
                    onChange={(e) => setCustomColorName(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-pink-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomColor}
                    className="px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold"
                  >
                    Add Color
                  </button>
                </div>
              </div>

              {/* Per-Size Stock Breakdown */}
              <div className="bg-pink-50/60 p-4 rounded-2xl border border-pink-100 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-stone-800 font-bold uppercase tracking-wider">
                    Inventory Stock Breakdown By Size (Pieces Ready to Ship)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSizeStocks({ XS: 5, S: 5, M: 5, L: 5, XL: 5 })}
                      className="text-[10px] text-pink-700 hover:underline font-bold"
                    >
                      5 Each
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setSizeStocks({ XS: 10, S: 10, M: 10, L: 10, XL: 10 })}
                      className="text-[10px] text-pink-700 hover:underline font-bold"
                    >
                      10 Each
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setSizeStocks({ XS: 0, S: 0, M: 0, L: 0, XL: 0 })}
                      className="text-[10px] text-rose-600 hover:underline font-bold"
                    >
                      Clear 0
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2 text-center">
                  {["XS", "S", "M", "L", "XL"].map((sz) => (
                    <div key={sz} className="bg-white p-2.5 rounded-xl border border-pink-100">
                      <span className="text-xs font-bold text-pink-700 block mb-1">{sz}</span>
                      <input
                        type="number"
                        min="0"
                        value={sizeStocks[sz] ?? 0}
                        onChange={(e) =>
                          setSizeStocks({ ...sizeStocks, [sz]: Math.max(0, Number(e.target.value)) })
                        }
                        className="w-full text-center border border-stone-200 rounded py-1 font-bold text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Description, Fabric & Care */}
              <div className="space-y-4">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Design & Fit Description</label>
                  <textarea
                    rows={2}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="e.g. Sculpted sweetheart neckline, internal boning, curved hem..."
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">Fabric & Composition</label>
                    <input
                      type="text"
                      placeholder="e.g. Duchess Satin with poly-spandex lining"
                      value={productForm.fabric}
                      onChange={(e) => setProductForm({ ...productForm, fabric: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-bold mb-1">Care Instructions</label>
                    <input
                      type="text"
                      placeholder="e.g. Dry clean only or cold hand wash"
                      value={productForm.careInstructions}
                      onChange={(e) => setProductForm({ ...productForm, careInstructions: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>
                </div>

                {/* Badges Toggles */}
                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
                    <input
                      type="checkbox"
                      checked={productForm.isNewArrival}
                      onChange={(e) => setProductForm({ ...productForm, isNewArrival: e.target.checked })}
                      className="accent-pink-600"
                    />
                    <span>Mark as New Drop</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
                    <input
                      type="checkbox"
                      checked={productForm.isBestSeller}
                      onChange={(e) => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                      className="accent-pink-600"
                    />
                    <span>Mark as Best Seller</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
                    <input
                      type="checkbox"
                      checked={productForm.isFeatured}
                      onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                      className="accent-pink-600"
                    />
                    <span>Featured in Home Showcase</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-pink-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-5 py-2.5 bg-stone-100 text-stone-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold rounded-xl shadow-md text-xs uppercase tracking-wider"
                >
                  Save & Publish Piece
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DELETE PRODUCT CONFIRMATION MODAL */}
      {/* ======================================================== */}
      {deleteConfirmId && (() => {
        const prodToDelete = products.find((p) => p.id === deleteConfirmId);
        if (!prodToDelete) return null;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setDeleteConfirmId(null)}
            />
            <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 z-10 shadow-2xl space-y-5 text-center animate-in zoom-in-95 duration-150">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="font-editorial text-2xl text-stone-900">
                  Delete &ldquo;{prodToDelete.name}&rdquo;?
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  This piece will be immediately removed from the House of Addya storefront, collections, and search.
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl flex items-center gap-3 text-left">
                <img
                  src={prodToDelete.images[0]}
                  alt={prodToDelete.name}
                  className="w-12 h-14 object-cover rounded-xl border border-stone-200"
                />
                <div className="text-xs">
                  <strong className="block text-stone-900 font-editorial text-sm">
                    {prodToDelete.name}
                  </strong>
                  <span className="text-stone-500">
                    ₹{prodToDelete.price.toLocaleString("en-IN")} • Stock: {prodToDelete.stock} units
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-3 bg-stone-100 text-stone-700 font-bold rounded-xl text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteProduct(prodToDelete.id);
                    setDeleteConfirmId(null);
                    triggerSaveNotice(`Removed "${prodToDelete.name}" from store.`);
                  }}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
