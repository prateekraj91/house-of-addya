"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  Product,
  SiteSettings,
  CartItem,
  Order,
  Coupon,
  CustomerReview,
} from "./types";
import {
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
  INITIAL_ORDERS,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
} from "./mock-data";
import { supabase, isSupabaseConfigured } from "./supabase";

interface StoreContextType {
  products: Product[];
  settings: SiteSettings;
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  isCloudConnected: boolean;
  coupons: Coupon[];
  reviews: CustomerReview[];
  appliedCoupon: Coupon | null;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  // Cart Actions
  addToCart: (product: Product, size: string, colour: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartShippingFee: number;
  cartTotal: number;
  cartItemsCount: number;
  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  // Coupon Actions
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  // Order Actions
  createOrder: (orderData: Omit<Order, "id" | "date" | "orderStatus">) => Order;
  // Admin Operations
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  addProduct: (product: Omit<Product, "id">) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (
    orderId: string,
    status: Order["orderStatus"],
    trackingNumber?: string,
    courierPartner?: string
  ) => void;
  addCoupon: (coupon: Omit<Coupon, "id">) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponActive: (id: string) => void;
  addReview: (review: Omit<CustomerReview, "id" | "date">) => void;
  resetToDefaults: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: "house_of_addya_products",
  SETTINGS: "house_of_addya_settings",
  CART: "house_of_addya_cart",
  WISHLIST: "house_of_addya_wishlist",
  ORDERS: "house_of_addya_orders",
  COUPONS: "house_of_addya_coupons",
  REVIEWS: "house_of_addya_reviews",
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    setIsClient(true);
    try {
      const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (storedProducts) setProducts(JSON.parse(storedProducts));

      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (storedSettings) {
        try {
          const parsed = JSON.parse(storedSettings);
          const upgraded = {
            ...INITIAL_SETTINGS,
            ...parsed,
            upiId: (!parsed.upiId || parsed.upiId === "houseofaddya@okhdfcbank") ? INITIAL_SETTINGS.upiId : parsed.upiId,
            bankName: parsed.bankName || INITIAL_SETTINGS.bankName,
            accountNumber: parsed.accountNumber || INITIAL_SETTINGS.accountNumber,
            ifscCode: parsed.ifscCode || INITIAL_SETTINGS.ifscCode,
            accountHolderName: parsed.accountHolderName || INITIAL_SETTINGS.accountHolderName,
          };
          setSettings(upgraded);
        } catch {
          setSettings(INITIAL_SETTINGS);
        }
      }

      const storedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (storedCart) setCart(JSON.parse(storedCart));

      const storedWishlist = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));

      const storedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (storedOrders) setOrders(JSON.parse(storedOrders));

      const storedCoupons = localStorage.getItem(STORAGE_KEYS.COUPONS);
      if (storedCoupons) setCoupons(JSON.parse(storedCoupons));

      const storedReviews = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (storedReviews) setReviews(JSON.parse(storedReviews));
    } catch (e) {
      console.error("Failed to load state from localStorage:", e);
    }

    // Connect and synchronize with Supabase Cloud
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      const syncCloud = async () => {
        try {
          // 1. Fetch live orders
          const { data: dbOrders, error: orderErr } = await client
            .from("orders")
            .select("*, order_items(*)")
            .order("created_at", { ascending: false });

          if (!orderErr && dbOrders && dbOrders.length > 0) {
            const mappedOrders: Order[] = dbOrders.map((o: any) => ({
              id: o.id,
              date: new Date(o.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
              customer: {
                fullName: o.customer_name,
                email: o.customer_email,
                phone: o.customer_phone,
                address: o.shipping_address,
                apartment: o.apartment || undefined,
                city: o.city,
                state: o.state,
                pincode: o.pincode,
                notes: o.order_notes || undefined,
              },
              items: (o.order_items || []).map((it: any) => ({
                id: it.id,
                productId: it.product_id || it.id,
                product: {
                  id: it.product_id || it.id,
                  name: it.product_name,
                  slug: (it.product_name || "piece").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                  price: it.unit_price,
                  category: "Tops & Corsets",
                  collection: "Soft Blossom",
                  images: it.product_image ? [it.product_image] : ["/images/product-corset.jpg"],
                  colours: [{ name: it.colour || "Default", hex: "#E8A598" }],
                  sizes: [it.size || "M"],
                  stock: 10,
                  description: "",
                  fabric: "",
                  careInstructions: "",
                  rating: 5.0,
                  reviewCount: 1,
                },
                selectedSize: it.size,
                selectedColour: it.colour,
                quantity: it.quantity,
              })),
              subtotal: o.subtotal,
              discount: o.discount || 0,
              couponCode: o.coupon_code || undefined,
              shippingFee: o.shipping_fee || 0,
              codFee: o.cod_fee || 0,
              total: o.total,
              paymentMethod: o.payment_method,
              paymentStatus: o.payment_status,
              orderStatus: o.order_status,
              trackingNumber: o.tracking_number || undefined,
              courierPartner: o.courier_partner || undefined,
              estimatedDelivery: o.estimated_delivery || undefined,
            }));
            setOrders(mappedOrders);
          }
        } catch (e: unknown) {
          console.warn("Supabase orders sync warning:", e);
        }

        try {
          // 2. Fetch live reviews
          const { data: dbReviews, error: revErr } = await client
            .from("customer_reviews")
            .select("*")
            .order("created_at", { ascending: false });

          if (!revErr && dbReviews && dbReviews.length > 0) {
            const mappedReviews: CustomerReview[] = dbReviews.map((r: any) => ({
              id: r.id,
              productName: r.product_name,
              author: r.author,
              city: r.city || "Verified Buyer",
              rating: r.rating,
              comment: r.comment,
              date: new Date(r.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
              verified: r.verified ?? true,
            }));
            setReviews(mappedReviews);
          }
        } catch (e: unknown) {
          console.warn("Supabase reviews sync warning:", e);
        }

        try {
          // 3. Fetch products if populated in cloud database
          const { data: dbProducts, error: prodErr } = await client
            .from("products")
            .select("*");

          if (!prodErr && dbProducts && dbProducts.length > 0) {
            const mappedProducts: Product[] = dbProducts.map((p: any) => ({
              id: p.id,
              name: p.name,
              slug: p.slug,
              price: p.price,
              originalPrice: p.original_price,
              category: p.category,
              collection: p.collection_name || "Everyday Chic",
              images: Array.isArray(p.images) && p.images.length > 0 ? p.images : ["/images/product-corset.jpg"],
              colours: [
                { name: "Blush Rose", hex: "#E8A598", inStock: true },
                { name: "Ivory Pearl", hex: "#FFFDF9", inStock: true },
                { name: "Noir Black", hex: "#1F1A1D", inStock: true },
              ],
              sizes: ["XS", "S", "M", "L", "XL"],
              stock: p.stock ?? 0,
              description: p.description || "",
              fabric: p.fabric || "",
              careInstructions: p.care_instructions || "",
              rating: Number(p.rating) || 5.0,
              reviewCount: p.review_count || 0,
              isNewArrival: p.is_new_arrival ?? false,
              isBestSeller: p.is_best_seller ?? false,
              isFeatured: p.is_featured ?? false,
              tags: p.tags || [],
            }));
            setProducts(mappedProducts);
          }
        } catch (e: unknown) {
          console.warn("Supabase products sync warning:", e);
        }

        try {
          // 4. Fetch coupons if populated in cloud database
          const { data: dbCoupons, error: coupErr } = await client
            .from("coupons")
            .select("*");

          if (!coupErr && dbCoupons && dbCoupons.length > 0) {
            const mappedCoupons: Coupon[] = dbCoupons.map((c: any) => ({
              id: c.id,
              code: c.code,
              discountPercent: c.discount_percent || undefined,
              discountFlat: c.discount_flat || undefined,
              minOrderValue: c.min_order_value || 0,
              isActive: c.is_active ?? true,
              description: c.description || "",
            }));
            setCoupons(mappedCoupons);
          }
        } catch (e: unknown) {
          console.warn("Supabase coupons sync warning:", e);
        }
      };

      syncCloud();
    }
  }, []);

  // Save to localStorage when state updates
  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products, isClient]);

  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings, isClient]);

  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart, isClient]);

  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist, isClient]);

  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders, isClient]);

  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
    } catch (e) {
      console.error(e);
    }
  }, [coupons, isClient]);

  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch (e) {
      console.error(e);
    }
  }, [reviews, isClient]);

  // Cart calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const cartDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (cartSubtotal < appliedCoupon.minOrderValue) return 0;
    if (appliedCoupon.discountPercent) {
      return Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100);
    }
    if (appliedCoupon.discountFlat) {
      return Math.min(appliedCoupon.discountFlat, cartSubtotal);
    }
    return 0;
  }, [cartSubtotal, appliedCoupon]);

  const cartShippingFee = useMemo(() => {
    if (cart.length === 0) return 0;
    if (appliedCoupon?.code === "FREESHIP") return 0;
    if (cartSubtotal >= settings.freeShippingThreshold) return 0;
    return settings.shippingFeeStandard;
  }, [cart.length, cartSubtotal, appliedCoupon, settings]);

  const cartTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - cartDiscount + cartShippingFee);
  }, [cartSubtotal, cartDiscount, cartShippingFee]);

  const cartItemsCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  // Cart Functions
  const addToCart = (
    product: Product,
    size: string,
    colour: string,
    quantity = 1
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === product.id &&
          item.selectedSize === size &&
          item.selectedColour === colour
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          productId: product.id,
          product,
          selectedSize: size,
          selectedColour: colour,
          quantity,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist Functions
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  // Coupon
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find(
      (c) => c.code.toUpperCase() === cleanCode && c.isActive
    );
    if (!found) {
      return { success: false, message: "Invalid or expired coupon code." };
    }
    if (cartSubtotal < found.minOrderValue) {
      return {
        success: false,
        message: `Minimum order value for ${found.code} is ₹${found.minOrderValue.toLocaleString("en-IN")}.`,
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Order
  const createOrder = (orderData: Omit<Order, "id" | "date" | "orderStatus">): Order => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      ...orderData,
      id: `HOA-${randomNum}`,
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      orderStatus: "Order Confirmed",
      trackingNumber: `SR-88${Math.floor(1000000 + Math.random() * 9000000)}`,
      courierPartner: "Shiprocket (Express)",
      estimatedDelivery: "In 3-4 business days",
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Direct cloud synchronization to Supabase
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      (async () => {
        try {
          const { error } = await client.from("orders").insert([
            {
              id: newOrder.id,
              customer_name: newOrder.customer.fullName,
              customer_email: newOrder.customer.email,
              customer_phone: newOrder.customer.phone,
              shipping_address: newOrder.customer.address,
              apartment: newOrder.customer.apartment || null,
              city: newOrder.customer.city,
              state: newOrder.customer.state,
              pincode: newOrder.customer.pincode,
              order_notes: newOrder.customer.notes || null,
              subtotal: newOrder.subtotal,
              discount: newOrder.discount || 0,
              coupon_code: newOrder.couponCode || null,
              shipping_fee: newOrder.shippingFee || 0,
              cod_fee: newOrder.codFee || 0,
              total: newOrder.total,
              payment_method: newOrder.paymentMethod,
              payment_status: newOrder.paymentStatus || (newOrder.paymentMethod === "COD" ? "COD Confirmed" : "Paid"),
              order_status: newOrder.orderStatus,
              tracking_number: newOrder.trackingNumber,
              courier_partner: newOrder.courierPartner,
              estimated_delivery: newOrder.estimatedDelivery,
            },
          ]);

          if (error) {
            console.error("Supabase order insert error:", error);
          } else if (newOrder.items && newOrder.items.length > 0) {
            const itemsToInsert = newOrder.items.map((item) => ({
              order_id: newOrder.id,
              product_id: null,
              product_name: item.product.name,
              product_image: item.product.images?.[0] || null,
              size: item.selectedSize,
              colour: item.selectedColour,
              unit_price: item.product.price,
              quantity: item.quantity,
              line_total: item.product.price * item.quantity,
            }));
            await client.from("order_items").insert(itemsToInsert);
          }
        } catch (err: unknown) {
          console.error("Supabase order sync error:", err);
        }
      })();
    }

    return newOrder;
  };

  // Admin Functions
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
      policies: {
        ...prev.policies,
        ...(newSettings.policies || {}),
      },
    }));

    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      (async () => {
        try {
          await client.from("site_settings").upsert({
            brand_name: newSettings.brandName || settings.brandName,
            announcement_text: newSettings.announcementText || settings.announcementText,
            whatsapp_number: newSettings.whatsappNumber || settings.whatsappNumber,
            instagram_handle: newSettings.instagramHandle || settings.instagramHandle,
            gst_number: newSettings.gstNumber || settings.gstNumber,
            shipping_fee_standard: newSettings.shippingFeeStandard || settings.shippingFeeStandard,
            cod_available: newSettings.codAvailable ?? settings.codAvailable,
            upi_id: newSettings.upiId || settings.upiId,
            bank_name: newSettings.bankName || settings.bankName,
            account_number: newSettings.accountNumber || settings.accountNumber,
            ifsc_code: newSettings.ifscCode || settings.ifscCode,
            account_holder_name: newSettings.accountHolderName || settings.accountHolderName,
            updated_at: new Date().toISOString(),
          });
        } catch (err: unknown) {
          console.error("Supabase settings update error:", err);
        }
      })();
    }
  };

  const addProduct = (newProdData: Omit<Product, "id">): Product => {
    const newProduct: Product = {
      ...newProdData,
      id: `hoa-${Date.now().toString(36)}`,
      rating: 5.0,
      reviewCount: 0,
    };
    setProducts((prev) => [newProduct, ...prev]);

    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      (async () => {
        try {
          await client.from("products").insert([
            {
              name: newProduct.name,
              slug: newProduct.slug || newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
              price: newProduct.price,
              original_price: newProduct.originalPrice || null,
              category: newProduct.category,
              collection_name: newProduct.collection || "Soft Blossom",
              images: newProduct.images || [],
              stock: newProduct.stock,
              description: newProduct.description,
              fabric: newProduct.fabric,
              care_instructions: newProduct.careInstructions,
              rating: 5.0,
              review_count: 0,
              is_new_arrival: Boolean(newProduct.isNewArrival),
              is_best_seller: Boolean(newProduct.isBestSeller),
              is_featured: Boolean(newProduct.isFeatured),
              tags: newProduct.tags || [],
            },
          ]);
        } catch (err: unknown) {
          console.error("Supabase product insert error:", err);
        }
      })();
    }

    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );

    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      const target = products.find((p) => p.id === id);
      if (target) {
        const payload: Record<string, any> = {};
        if (updates.name !== undefined) payload.name = updates.name;
        if (updates.price !== undefined) payload.price = updates.price;
        if (updates.originalPrice !== undefined) payload.original_price = updates.originalPrice;
        if (updates.stock !== undefined) payload.stock = updates.stock;
        if (updates.category !== undefined) payload.category = updates.category;
        if (updates.collection !== undefined) payload.collection_name = updates.collection;
        if (updates.images !== undefined) payload.images = updates.images;
        if (updates.description !== undefined) payload.description = updates.description;
        if (updates.fabric !== undefined) payload.fabric = updates.fabric;
        if (updates.careInstructions !== undefined) payload.care_instructions = updates.careInstructions;
        if (updates.isNewArrival !== undefined) payload.is_new_arrival = updates.isNewArrival;
        if (updates.isBestSeller !== undefined) payload.is_best_seller = updates.isBestSeller;
        if (updates.isFeatured !== undefined) payload.is_featured = updates.isFeatured;
        payload.updated_at = new Date().toISOString();

        (async () => {
          try {
            await client
              .from("products")
              .update(payload)
              .or(`id.eq.${id},slug.eq.${target.slug}`);
          } catch (err: unknown) {
            console.error("Supabase product update error:", err);
          }
        })();
      }
    }
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));

    if (isSupabaseConfigured && supabase && target) {
      const client = supabase;
      (async () => {
        try {
          await client
            .from("products")
            .delete()
            .or(`id.eq.${id},slug.eq.${target.slug}`);
        } catch (err: unknown) {
          console.error("Supabase product delete error:", err);
        }
      })();
    }
  };

  const updateOrderStatus = (
    orderId: string,
    status: Order["orderStatus"],
    trackingNumber?: string,
    courierPartner?: string
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          orderStatus: status,
          ...(trackingNumber ? { trackingNumber } : {}),
          ...(courierPartner ? { courierPartner } : {}),
        };
      })
    );

    // Update in Supabase cloud
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      (async () => {
        try {
          await client
            .from("orders")
            .update({
              order_status: status,
              ...(trackingNumber ? { tracking_number: trackingNumber } : {}),
              ...(courierPartner ? { courier_partner: courierPartner } : {}),
              updated_at: new Date().toISOString(),
            })
            .eq("id", orderId);
        } catch (err: unknown) {
          console.error("Supabase order status update error:", err);
        }
      })();
    }
  };

  const addCoupon = (newCoupon: Omit<Coupon, "id">) => {
    const coupon: Coupon = {
      ...newCoupon,
      id: `c-${Date.now().toString(36)}`,
    };
    setCoupons((prev) => [coupon, ...prev]);

    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      (async () => {
        try {
          await client.from("coupons").insert([
            {
              code: coupon.code,
              discount_percent: coupon.discountPercent || null,
              discount_flat: coupon.discountFlat || null,
              min_order_value: coupon.minOrderValue || 0,
              is_active: coupon.isActive,
              description: coupon.description,
            },
          ]);
        } catch (err: unknown) {
          console.error("Supabase coupon insert error:", err);
        }
      })();
    }
  };

  const deleteCoupon = (id: string) => {
    const target = coupons.find((c) => c.id === id);
    setCoupons((prev) => prev.filter((c) => c.id !== id));

    if (isSupabaseConfigured && supabase && target) {
      const client = supabase;
      (async () => {
        try {
          await client
            .from("coupons")
            .delete()
            .or(`id.eq.${id},code.eq.${target.code}`);
        } catch (err: unknown) {
          console.error("Supabase coupon delete error:", err);
        }
      })();
    }
  };

  const toggleCouponActive = (id: string) => {
    const target = coupons.find((c) => c.id === id);
    const newActive = target ? !target.isActive : false;
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );

    if (isSupabaseConfigured && supabase && target) {
      const client = supabase;
      (async () => {
        try {
          await client
            .from("coupons")
            .update({ is_active: newActive })
            .or(`id.eq.${id},code.eq.${target.code}`);
        } catch (err: unknown) {
          console.error("Supabase coupon toggle error:", err);
        }
      })();
    }
  };

  const addReview = (review: Omit<CustomerReview, "id" | "date">) => {
    const newRev: CustomerReview = {
      ...review,
      id: `rev-${Date.now().toString(36)}`,
      date: "Just now",
      verified: true,
    };
    setReviews((prev) => [newRev, ...prev]);

    // Insert to Supabase customer_reviews
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      (async () => {
        try {
          await client.from("customer_reviews").insert([
            {
              product_name: review.productName,
              author: review.author,
              city: review.city || "Verified Buyer",
              rating: review.rating,
              comment: review.comment,
              verified: true,
              is_featured: false,
            },
          ]);
        } catch (err: unknown) {
          console.error("Supabase review insert error:", err);
        }
      })();
    }
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setSettings(INITIAL_SETTINGS);
    setOrders(INITIAL_ORDERS);
    setCoupons(INITIAL_COUPONS);
    setReviews(INITIAL_REVIEWS);
    if (typeof window !== "undefined") {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        settings,
        cart,
        wishlist,
        orders,
        coupons,
        reviews,
        isCloudConnected: isSupabaseConfigured,
        appliedCoupon,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartDiscount,
        cartShippingFee,
        cartTotal,
        cartItemsCount,
        toggleWishlist,
        isInWishlist,
        applyCoupon,
        removeCoupon,
        createOrder,
        updateSettings,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        addCoupon,
        deleteCoupon,
        toggleCouponActive,
        addReview,
        resetToDefaults,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
