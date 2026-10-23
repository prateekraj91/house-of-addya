export interface ProductColor {
  name: string;
  hex: string;
  inStock?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: "Dresses" | "Co-ords" | "Tops & Corsets" | "Skirts & Bottoms" | "Outerwear";
  collection: string;
  images: string[];
  colours: ProductColor[];
  sizes: ("XS" | "S" | "M" | "L" | "XL")[];
  stock: number;
  description: string;
  fabric: string;
  careInstructions: string;
  rating: number;
  reviewCount: number;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  tags?: string[];
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedSize: string;
  selectedColour: string;
  quantity: number;
}

export interface OrderCustomer {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
}

export interface Order {
  id: string;
  date: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  codFee: number;
  total: number;
  paymentMethod: "UPI" | "Card" | "NetBanking" | "COD";
  paymentStatus: "Paid" | "Pending" | "COD Confirmed";
  orderStatus: "Order Confirmed" | "Processing" | "Packed" | "Shipped" | "Delivered" | "Cancelled";
  trackingNumber?: string;
  courierPartner?: string;
  estimatedDelivery?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent?: number;
  discountFlat?: number;
  minOrderValue: number;
  isActive: boolean;
  description: string;
}

export interface SiteSettings {
  brandName: string;
  founderName: string;
  tagline: string;
  announcementText: string;
  announcementEnabled: boolean;
  businessEmail: string;
  businessPhone: string;
  whatsappNumber: string;
  businessAddress: string;
  returnAddress: string;
  gstNumber: string;
  instagramHandle: string;
  instagramUrl: string;
  shippingFeeStandard: number;
  shippingFeeExpress: number;
  freeShippingThreshold: number;
  codAvailable: boolean;
  codFee: number;
  razorpayEnabled: boolean;
  razorpayKeyId?: string;
  upiId: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  accountHolderName?: string;
  heroHeadline: string;
  heroSubtext: string;
  heroImageUrl: string;
  aboutStoryHeadline: string;
  aboutStoryText: string;
  policies: {
    shippingPolicy: string;
    returnExchangePolicy: string;
    privacyPolicy: string;
    termsConditions: string;
  };
}

export interface CustomerReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  productName: string;
  productId?: string;
  isFeatured?: boolean;
}
