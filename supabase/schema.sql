-- =========================================================================
-- HOUSE OF ADDYA — SUPABASE PRODUCTION DATABASE SCHEMA (v3)
-- Zero-cost build • PostgreSQL + Row-Level Security (RLS)
-- =========================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. SITE SETTINGS TABLE (Feeds footer, policies, invoices, Razorpay config)
create table if not exists site_settings (
    id uuid primary key default uuid_generate_v4(),
    brand_name text not null default 'House of Addya',
    founder_name text not null default 'Addya Dubey',
    tagline text not null default 'Effortless Western Silhouettes for the Modern Muse',
    announcement_text text default '✨ FREE EXPRESS SHIPPING OVER ₹1,499 | USE CODE ADDYA10 FOR 10% OFF ✨',
    announcement_enabled boolean default true,
    business_email text not null default 'hello@houseofaddya.com',
    business_phone text not null default '+91 98712 34567',
    whatsapp_number text not null default '919871234567',
    business_address text not null default 'Atelier House of Addya, Fashion Boulevard, Shahpur Jat, New Delhi - 110049',
    return_address text not null default 'House of Addya Logistics Hub, Warehouse 4B, Okhla Phase III, New Delhi - 110020',
    gst_number text not null default '07AABCH8921M1ZY',
    instagram_handle text default 'houseofaddya',
    instagram_url text default 'https://instagram.com/houseofaddya',
    shipping_fee_standard integer default 99,
    shipping_fee_express integer default 199,
    free_shipping_threshold integer default 1499,
    cod_available boolean default true,
    cod_fee integer default 49,
    razorpay_enabled boolean default true,
    razorpay_key_id text default 'rzp_test_addya_live',
    upi_id text default 'anmoldube93@okhdfcbank',
    bank_name text default 'PUNJAB NATIONAL BANK',
    account_number text default '0781100100005018',
    ifsc_code text default 'PUNB0078110',
    account_holder_name text default 'Anmol Dubey',
    hero_headline text default 'Effortless Western Silhouettes For The Modern Muse',
    hero_subtext text default 'Trendy, confident and accessible luxury tailored for young women.',
    hero_image_url text default '/images/hero-fashion.jpg',
    shipping_policy text,
    return_exchange_policy text,
    privacy_policy text,
    terms_conditions text,
    updated_at timestamp with time zone default now()
);

-- 2. COLLECTIONS TABLE
create table if not exists collections (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique,
    slug text not null unique,
    tagline text,
    mood text,
    cover_image text,
    is_featured boolean default true,
    created_at timestamp with time zone default now()
);

-- 3. PRODUCTS TABLE
create table if not exists products (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    slug text not null unique,
    price integer not null,
    original_price integer,
    category text not null, -- 'Dresses', 'Co-ords', 'Tops & Corsets', 'Skirts & Bottoms', 'Outerwear'
    collection_name text references collections(name) on update cascade on delete set null,
    images text[] not null default '{}',
    stock integer not null default 0,
    description text,
    fabric text,
    care_instructions text,
    rating numeric(2,1) default 5.0,
    review_count integer default 0,
    is_new_arrival boolean default false,
    is_best_seller boolean default false,
    is_featured boolean default false,
    tags text[] default '{}',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- 4. PRODUCT VARIANTS (Colours & Sizes)
create table if not exists product_variants (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid not null references products(id) on delete cascade,
    size text not null, -- 'XS', 'S', 'M', 'L', 'XL'
    colour_name text not null,
    colour_hex text not null,
    stock integer not null default 0,
    created_at timestamp with time zone default now()
);

-- 5. COUPONS & DISCOUNTS
create table if not exists coupons (
    id uuid primary key default uuid_generate_v4(),
    code text not null unique,
    discount_percent integer,
    discount_flat integer,
    min_order_value integer default 0,
    is_active boolean default true,
    description text,
    created_at timestamp with time zone default now()
);

-- 6. CUSTOMER REVIEWS
create table if not exists customer_reviews (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid references products(id) on delete set null,
    product_name text not null,
    author text not null,
    city text default 'Verified Buyer',
    rating integer not null check (rating >= 1 and rating <= 5),
    comment text not null,
    verified boolean default true,
    is_featured boolean default false,
    created_at timestamp with time zone default now()
);

-- 7. ORDERS TABLE (Shiprocket & Razorpay integrated)
create table if not exists orders (
    id text primary key, -- e.g. 'HOA-98210'
    customer_name text not null,
    customer_email text not null,
    customer_phone text not null,
    shipping_address text not null,
    apartment text,
    city text not null,
    state text not null,
    pincode text not null,
    order_notes text,
    subtotal integer not null,
    discount integer default 0,
    coupon_code text,
    shipping_fee integer default 0,
    cod_fee integer default 0,
    total integer not null,
    payment_method text not null, -- 'UPI', 'Card', 'NetBanking', 'COD'
    payment_status text not null, -- 'Paid', 'Pending', 'COD Confirmed'
    order_status text not null default 'Order Confirmed',
    tracking_number text, -- Shiprocket AWB
    courier_partner text default 'Shiprocket Express',
    estimated_delivery text default '3-4 business days',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- 8. ORDER ITEMS TABLE
create table if not exists order_items (
    id uuid primary key default uuid_generate_v4(),
    order_id text not null references orders(id) on delete cascade,
    product_id uuid references products(id) on delete set null,
    product_name text not null,
    product_image text,
    size text not null,
    colour text not null,
    unit_price integer not null,
    quantity integer not null,
    line_total integer not null
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

alter table site_settings enable row level security;
alter table collections enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table coupons enable row level security;
alter table customer_reviews enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Public can read active products, collections, settings, coupons, reviews
create policy "Public read products" on products for select using (true);
create policy "Public read collections" on collections for select using (true);
create policy "Public read variants" on product_variants for select using (true);
create policy "Public read site_settings" on site_settings for select using (true);
create policy "Public read coupons" on coupons for select using (is_active = true);
create policy "Public read reviews" on customer_reviews for select using (true);
create policy "Public insert reviews" on customer_reviews for insert with check (true);
create policy "Public create orders" on orders for insert with check (true);
create policy "Public create order items" on order_items for insert with check (true);
create policy "Public read own order" on orders for select using (true);
create policy "Public read order items" on order_items for select using (true);

-- Authenticated Admin has full CRUD on all tables
create policy "Admin full access products" on products for all using (auth.role() = 'authenticated');
create policy "Admin full access settings" on site_settings for all using (auth.role() = 'authenticated');
create policy "Admin full access orders" on orders for all using (auth.role() = 'authenticated');
create policy "Admin full access coupons" on coupons for all using (auth.role() = 'authenticated');
create policy "Admin full access collections" on collections for all using (auth.role() = 'authenticated');
