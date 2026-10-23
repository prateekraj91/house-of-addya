-- =========================================================================
-- HOUSE OF ADDYA — SUPABASE CLIENT CMS PERMISSIONS (v3)
-- Run this once in the Supabase SQL Editor if you want changes made in the 
-- /admin CMS (secured via PIN 5692) to directly persist in Supabase cloud tables.
-- =========================================================================

-- 1. PRODUCTS & VARIANTS
create policy "Allow anon insert products" on products for insert with check (true);
create policy "Allow anon update products" on products for update using (true);
create policy "Allow anon delete products" on products for delete using (true);

create policy "Allow anon insert collections" on collections for insert with check (true);
create policy "Allow anon update collections" on collections for update using (true);
create policy "Allow anon delete collections" on collections for delete using (true);

create policy "Allow anon insert variants" on product_variants for insert with check (true);
create policy "Allow anon update variants" on product_variants for update using (true);
create policy "Allow anon delete variants" on product_variants for delete using (true);

-- 2. SITE SETTINGS & POLICIES
create policy "Allow anon insert site_settings" on site_settings for insert with check (true);
create policy "Allow anon update site_settings" on site_settings for update using (true);

-- 3. COUPONS & PROMOS
create policy "Allow anon insert coupons" on coupons for insert with check (true);
create policy "Allow anon update coupons" on coupons for update using (true);
create policy "Allow anon delete coupons" on coupons for delete using (true);

-- 4. ORDERS & FULFILLMENT
create policy "Allow anon update orders" on orders for update using (true);
create policy "Allow anon delete orders" on orders for delete using (true);
