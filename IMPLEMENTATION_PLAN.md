# House of Addya — Master Implementation & Handover Plan
**Brand**: House of Addya  
**Founder**: Addya Dubey  
**Developer**: Prateek Raj  
**Target URL**: `https://houseofaddya.com`  
**Stack**: Next.js 16 (App Router), Tailwind CSS v4, Lucide Icons, Canvas Confetti  
**Cost Model**: ₹0 / month (Zero recurring software or server bills)

---

## 📋 Executive Summary

This document outlines the step-by-step implementation, deployment, and handover architecture for the **House of Addya** high-fashion e-commerce platform.

The system is engineered specifically so that **the founder (Addya Dubey) has 100% self-service control over the product catalog, pricing, inventory stock quantities per size, and retired pieces via `/admin` without requiring any developer intervention or code modifications.**

---

## 🏗️ Architecture & Zero-Cost Tech Stack

| Component | Technology | Cost | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend & API** | Next.js 16 (Turbopack + App Router) | ₹0 / mo (Vercel Free Tier) | High-speed, responsive storefront & CMS |
| **Styling & Theme** | Tailwind CSS v4 + Editorial Typography | ₹0 | Feminine Gen-Z luxury pink aesthetic (`#FFF5F7` to `#BE185D`) |
| **State & Persistence** | Store Context + LocalStorage / Supabase | ₹0 (Supabase Free Tier) | Real-time reactive cart, catalog, and inventory sync |
| **Database** | PostgreSQL (`supabase/schema.sql`) | ₹0 (500 MB free) | Cloud catalog persistence, orders, and customer data |
| **Payments** | Razorpay PG + Direct UPI QR | 0% setup, 2% per txn | Instant UPI, Cards, NetBanking, and COD |
| **Logistics** | Shiprocket Express Shipping | Pay per label (₹40-60/order) | Automated AWB, Delhivery/BlueDart pickup, tracking |
| **Domain & SSL** | Cloudflare / Vercel DNS | ~₹800/year (Domain registrar) | Free automatic SSL certificate and edge CDN |

---

## 🔐 Step 1: Admin Passkey & Security Setup (Phase 1) ✅ Completed

The `/admin` portal is protected with a secure PIN entry screen designed for quick mobile and laptop authentication.

### 1.1 Configured PIN
- **Active Admin Passkey**: `5692`
- Set in: `.env.local` (`NEXT_PUBLIC_ADMIN_PIN=5692`)
- Source Code: [`src/app/admin/page.tsx`](file:///Users/prateekraj/Desktop/Ideas/Addya/src/app/admin/page.tsx#L69)
```typescript
const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || "5692";
```

### 1.2 Changing the PIN for Production
Before final handover to Addya:
1. Open `.env.local` (or create it in the project root):
   ```bash
   NEXT_PUBLIC_ADMIN_PIN=5692
   ```
2. When deploying to Vercel, add `NEXT_PUBLIC_ADMIN_PIN=5692` in **Project Settings → Environment Variables**.
3. Provide the 4-digit PIN exclusively to Addya.

### 1.3 Quick Access URL for the Owner
Addya can bookmark this link on her phone to unlock the dashboard automatically:
```
https://houseofaddya.com/admin?pin=5692
```

---

## 👗 Step 2: Owner Self-Service Product & Inventory Guide (Addya's Handbook)

Addya can manage the entire boutique catalog directly from her iPhone, iPad, or laptop.

### 2.1 Adding a New Outfit Piece (Without Developer)
1. Open `/admin` and enter the 4-digit passkey.
2. Click the prominent **`+ Add New Product`** button.
3. **Upload Product Photos**:
   - **Phone Camera / Gallery**: Tap **`+ Upload`** to snap photos directly with your phone camera or select from your gallery. Photos are automatically compressed and assigned.
   - **External Image URL**: Or paste an image URL (Unsplash, Cloudinary, Imgur, or Instagram CDN) into the URL field and click **`+ Add URL`**.
   - The first photo automatically becomes the **Cover Photo** on the shop grid.
4. **Enter Piece Details**:
   - **Piece Name**: e.g., *The Rosewood Sculpted Corset*.
   - **Category**: Select from *Tops & Corsets*, *Dresses*, *Co-ords*, *Skirts & Bottoms*, *Outerwear*.
   - **Capsule Collection**: Select *Soft Blossom*, *Date Night Euphoria*, *Brunch & Bubbly*, *Midnight Muse*, or *Everyday Chic*.
5. **Set Pricing & Compare-At Price**:
   - **Selling Price (₹)**: e.g., `1899`.
   - **Original Price (₹)**: e.g., `2499` (The system automatically calculates and displays the discount pill, e.g., `24% OFF - Customer Saves ₹600`).
6. **Assign Colorways**:
   - Tap any preset chip (*Blush Rose*, *Ivory Pearl*, *Noir Black*, *Champagne Gold*, *Cherry Wine*, *Sage Mist*, *Lavender Haze*, *Midnight Navy*).
   - Or pick a custom shade using the color picker and name it.
7. **Set Ready-to-Ship Quantities Per Size**:
   - Enter the stock units for **XS**, **S**, **M**, **L**, and **XL**.
   - Use quick shortcut buttons: **`5 Each`**, **`10 Each`**, or **`Clear 0`**.
   - Total stock count is automatically computed and displayed.
8. **Add Design & Care Story**:
   - Enter the fit description, fabric composition (e.g., *Duchess Satin with poly-spandex lining*), and care instructions.
9. **Set Badges**:
   - Check **Mark as New Drop** (adds to the homepage *New Arrivals* ticker).
   - Check **Mark as Best Seller**.
   - Check **Featured in Home Showcase**.
10. Click **`Save & Publish Piece`**. The outfit immediately appears live on the storefront, search, and collections!

---

### 2.2 Adjusting Stock Quantities on Existing Outfits
Addya can adjust inventory stock in three different ways:

#### Method A: Direct Inline Stepper (Fastest on Desktop)
- In the Products Table or Grid view, use the stepper buttons on any piece:
  - **`-5`** or **`-1`**: Decreases inventory.
  - **`+1`** or **`+5`**: Increases inventory.
  - Type any number directly into the stock box (e.g., `35`) and press Enter.
  - Tap **`Mark Sold Out`** to instantly set stock to `0`.
  - Tap **`Restock +20`** for quick batch restocking.

#### Method B: Quick Size Breakdown Modal (Fastest on Mobile)
- Tap **`(Adjust Sizes)`** next to the size list on any piece.
- A popup opens showing XS, S, M, L, and XL with `+` and `-` steppers.
- Adjust specific sizes (e.g., customer ordered 2 Medium on WhatsApp → reduce M by 2).
- Click **`Save Stock Quantity`**.

#### Method C: Full Edit Modal
- Click the **Edit Pencil Icon** on any piece to change photos, prices, descriptions, or sizes simultaneously.

---

### 2.3 Removing or Retiring an Existing Product
1. In `/admin` on the product row or card, click the **Trash Icon** (Delete).
2. A safety confirmation modal appears showing the product photo, name, selling price, and remaining stock.
3. Click **`Confirm Delete`**.
4. The product is instantly removed from the shop, homepage showcases, search indexing, and customer cart.

---

### 2.4 Duplicating / Cloning an Outfit (For Color Variations)
- Click the **Copy / Clone Icon** on any existing piece.
- An identical piece is created instantly with `(Copy)` appended to the name.
- Open it, change the color name and photo, and save!

---

## 🗄️ Step 3: Cloud Database Setup (Phase 2) ✅ Completed

Permanent multi-device cloud synchronization across multiple admins:

### 3.1 Supabase Project Status
- **Status**: Connected & Verified
- **Project URL**: `https://wmlfztqryyqwfwugcfer.supabase.co`
- **Region**: Mumbai (`ap-south-1`)

### 3.2 Executed Database Schema
Tables successfully created and verified:
- `products` (full catalog with images, colors, sizes, stock, price)
- `site_settings` (announcement bar, GSTIN, WhatsApp, policies)
- `collections` (curated capsules)
- `orders` & `order_items` (customer details, Shiprocket tracking, payment method)
- `coupons` (discount codes, min spend, expiry)
- `customer_reviews` (customer testimonials)
- `product_variants` (colorway & size stock breakdown)

### 3.3 Configured API Keys in `.env.local`
Configured in `.env.local` and integrated via `src/lib/store-context.tsx`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://wmlfztqryyqwfwugcfer.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```
*(Also deploy these to Vercel Project Settings → Environment Variables for production)*

---

## 💳 Step 4: Payment Gateway Integration (Razorpay & Direct UPI)

House of Addya supports **Direct Zero-Fee UPI**, **Credit/Debit Cards**, **NetBanking**, and **Cash on Delivery (COD)**.

### 4.1 Razorpay Standard Setup
1. Register at [razorpay.com](https://razorpay.com) with Addya's business details & bank account.
2. Complete KYC (PAN, GSTIN or Proprietorship proof, Cancelled Cheque).
3. In **Settings → API Keys**, generate your **Key ID** and **Key Secret**.
4. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_secret_key
   ```
5. In `/admin` under **⚙️ Store & GST Settings**, toggle **Razorpay Payment Gateway** to **Enabled**.

### 4.2 Direct UPI QR Code & Instant Settlement (0% Gateway Fee)
- **Official Merchant UPI ID**: `anmoldube93@okhdfcbank`
- **Settlement Beneficiary**: Anmol Dubey / House of Addya
- **Zero Commission**: Payments made via GPay, PhonePe, Paytm, or BHIM go 100% directly into the Punjab National Bank account with 0% gateway commission or middlemen deduction.
- **Dynamic Scannable QR Code**: The checkout page automatically generates a dynamic UPI QR code embedding the exact order payable amount.
- **Mobile 1-Tap App Launcher**: Mobile shoppers can tap to open their installed UPI app directly.

### 4.3 Direct NetBanking & Bank Transfer (NEFT / IMPS)
- **Bank Name**: `PUNJAB NATIONAL BANK`
- **Account Number**: `0781100100005018`
- **IFSC Code**: `PUNB0078110`
- **Account Holder**: `Anmol Dubey`
- Customers can copy these details with 1 click directly during checkout, transfer via their banking app, and enter their UTR number for verification.

### 4.4 Cash on Delivery (COD) Rules
- COD can be enabled/disabled with one click in `/admin`.
- Set the optional COD handling fee (e.g., ₹49) to encourage prepaid orders.

---

## 📦 Step 5: Courier & Logistics Setup (Shiprocket Express)

### 5.1 Account & Pickup Hub
1. Register at [shiprocket.in](https://shiprocket.in).
2. Add the Atelier pickup address:
   - *Atelier House of Addya, Fashion Boulevard, Shahpur Jat, New Delhi, 110049*.
3. Recharge shipping wallet (₹500-1000 initial balance).

### 5.2 Order Fulfillment Workflow
1. When a new order arrives, it appears in `/admin` under **📦 Orders & Shipping**.
2. Pack the garment in House of Addya signature pink tissue and premium box.
3. In Shiprocket, generate the shipping label (AWB number).
4. In `/admin`, update the order status:
   - Select **Shipped**.
   - Enter the Shiprocket AWB tracking number (e.g., `SR-884920193`).
   - Select Courier Partner (e.g., `Delhivery Express` or `BlueDart`).
5. The customer can instantly track their package on the live tracking page at [`/track`](file:///Users/prateekraj/Desktop/Ideas/Addya/src/app/track/page.tsx).

---

## 🌐 Step 6: Custom Domain & Free Cloud Hosting (Vercel)

### 6.1 Deploying to Vercel (100% Free)
1. Push repository to GitHub:
   ```bash
   git add .
   git commit -m "House of Addya Production Release"
   git push origin main
   ```
2. Log into [vercel.com](https://vercel.com) using your GitHub account.
3. Click **Add New → Project** → Import `Addya`.
4. Leave build settings as default (`next build`).
5. Add environment variables:
   - `NEXT_PUBLIC_ADMIN_PIN`: Addya's PIN
   - `NEXT_PUBLIC_SUPABASE_URL`: (if enabled)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (if enabled)
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`: Razorpay key
6. Click **Deploy**. Vercel will provide an instant live URL (`house-of-addya.vercel.app`).

### 6.2 Connecting Custom Domain (`houseofaddya.com`)
1. In Vercel Project Settings → **Domains** → Enter `houseofaddya.com`.
2. In your domain registrar (GoDaddy, Namecheap, Hostinger, or Cloudflare):
   - Add **A Record**: `@` → `76.76.21.21`
   - Add **CNAME Record**: `www` → `cname.vercel-dns.com`
3. SSL certificate is provisioned automatically within 5 minutes.

---

## ⚙️ Step 7: Store Settings, GST & Legal Policies

All store copy and business credentials can be changed in `/admin` without editing code:

| Setting | Location in `/admin` | Storefront Impact |
| :--- | :--- | :--- |
| **Announcement Bar** | 🖼️ Banners & Hero | Top notification marquee on every page |
| **WhatsApp Number** | ⚙️ Store & GST Settings | Floating concierge chat widget & order assistance |
| **Instagram Handle** | ⚙️ Store & GST Settings | Footer & homepage editorial feed link |
| **GST Number** | ⚙️ Store & GST Settings | Printed on invoices and checkout legal note |
| **Shipping & Return Policy** | 📜 Policy Editor | Live `/shipping-returns` page |
| **Promo Coupons** | 🏷️ Coupons & Promos | Discount codes at checkout (`ADDYA10`, `MUSE15`) |

---

## 🤝 Step 8: Client 10-Minute Handover Protocol

Use this structured agenda for your handover call with Addya Dubey:

### Handover Agenda (10 Minutes)
1. **Minute 0–2: Live Storefront Walkthrough**
   - Showcase homepage aesthetic, video banner, New Drops ticker, and Collections.
   - Demonstrate multi-filter shopping page, size guide calculator, and instant bag drawer.
   - Show checkout flow with direct UPI QR code simulation.
2. **Minute 2–6: Owner Admin CMS Demonstration (`/admin`)**
   - Enter PIN `1234` on phone screen share.
   - Add a sample new dress: snap photo with phone camera, set price ₹2,499, set stock to 15.
   - Show how it appears immediately in the live shop.
   - Demonstrate quick quantity adjustments (`+5`, `-1`, `Mark Sold Out`).
   - Demonstrate deleting a piece with confirmation dialog.
3. **Minute 6–8: Orders & Shiprocket Fulfillment**
   - Open Orders tab → Show how to paste AWB tracking number.
   - Open `/track` on phone to show customer tracking timeline.
4. **Minute 8–10: Settings, Questions & Passkey Handover**
   - Show how to edit announcement bar and promo coupons.
   - Set Addya's custom 4-digit PIN.
   - Hand over GitHub / Vercel credentials.

---

## 📞 Support & Maintenance Protocol

- **Codebase Repository**: Private GitHub repository.
- **Local Dev Server**: `npm run dev` on `http://localhost:3000`.
- **Production Build Check**: `npm run build` or `npx tsc --noEmit`.
- **Zero Cost Guarantee**: The system runs entirely within free tiers (Next.js on Vercel Hobby, Supabase Free Tier, Cloudflare edge, Razorpay/Shiprocket pay-per-use).

---
*Created with love for House of Addya by Prateek Raj.*
