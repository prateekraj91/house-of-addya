-- =========================================================================
-- HOUSE OF ADDYA — PRODUCTION INITIAL SEED SCRIPT (v3)
-- Run this in Supabase SQL Editor to populate the initial catalog,
-- collections, store settings, and coupons into your cloud database.
-- =========================================================================

-- 1. INSERT COLLECTIONS
insert into collections (name, slug, tagline, mood, cover_image, is_featured)
values
  ('Soft Blossom', 'soft-blossom', 'Romantic blush silks, sculpted corsetry, and delicate pastels.', 'Ethereal • Feminine • Dreamy', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80', true),
  ('Date Night Euphoria', 'date-night-euphoria', 'Body-contouring silhouettes in noir black and cherry wine.', 'Bold • Seductive • Magnetic', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80', true),
  ('Brunch & Bubbly', 'brunch-and-bubbly', 'Airy tiered maxis, daytime linen blends, and sunshine aesthetics.', 'Playful • Chic • Effervescent', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80', true),
  ('Midnight Muse', 'midnight-muse', 'Architectural tailoring, duchess satin, and metallic accents.', 'Empowered • Luxe • Couture', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80', true),
  ('Everyday Chic', 'everyday-chic', 'Effortless elevated basics and contemporary coordinates.', 'Minimalist • Versatile • Refined', 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=80', true)
on conflict (name) do nothing;

-- 2. INSERT INITIAL COUPONS
insert into coupons (code, discount_percent, discount_flat, min_order_value, is_active, description)
values
  ('ADDYA10', 10, null, 0, true, '10% off on your entire purchase'),
  ('MUSE15', 15, null, 2499, true, '15% off orders above ₹2,499'),
  ('FIRST500', null, 500, 2999, true, 'Flat ₹500 off on first purchase above ₹2,999')
on conflict (code) do nothing;

-- 3. INSERT INITIAL PRODUCTS
insert into products (name, slug, price, original_price, category, collection_name, images, stock, description, fabric, care_instructions, rating, review_count, is_new_arrival, is_best_seller, is_featured, tags)
values
  (
    'The Rosewood Sculpted Corset',
    'rosewood-sculpted-corset',
    1899,
    2499,
    'Tops & Corsets',
    'Soft Blossom',
    ARRAY['/images/product-corset.jpg', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'],
    22,
    'Engineered with internal flexible boning and an architectural sweetheart neckline. Tailored from lustrous stretch satin that hugs curves with zero pinch.',
    'Premium Structured Satin Silk Blend with Poly-Spandex inner lining.',
    'Delicate dry clean or gentle hand wash in cold water. Lay flat to dry.',
    4.9,
    14,
    true,
    false,
    true,
    ARRAY['Bestseller', 'Corset', 'Date Night']
  ),
  (
    'The Euphoria Draped Satin Midi Dress',
    'euphoria-draped-satin-midi',
    2899,
    3799,
    'Dresses',
    'Date Night Euphoria',
    ARRAY['/images/product-dress.jpg', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80'],
    16,
    'Fluid cowl neck draped midi silhouette with an asymmetric thigh slit and cowl drape back. Designed to turn heads effortlessly.',
    '100% Heavy Mulberry Satin with fluid drape.',
    'Dry clean highly recommended. Cool iron on reverse side.',
    5.0,
    28,
    false,
    true,
    true,
    ARRAY['Cowl Neck', 'Evening Wear', 'Satin']
  ),
  (
    'The Starlight Halter Neck Co-ord Set',
    'starlight-halter-neck-coord',
    3499,
    4499,
    'Co-ords',
    'Midnight Muse',
    ARRAY['/images/product-coord.jpg', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80'],
    18,
    'A two-piece co-ord featuring a ruched halter cropped silhouette paired with high-waist fluid palazzo trousers with hidden side pockets.',
    'Viscose Poly Blend with subtle micro-sheen.',
    'Machine wash cold on gentle cycle. Warm iron.',
    4.8,
    19,
    true,
    true,
    true,
    ARRAY['Co-ord', 'High Waist', 'Party Ready']
  ),
  (
    'The Parisian Pleated Linen Trousers',
    'parisian-pleated-linen-trousers',
    2199,
    2899,
    'Skirts & Bottoms',
    'Everyday Chic',
    ARRAY['https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80'],
    15,
    'Tailored front pleats with a relaxed straight leg silhouette. Features an internal adjustable waistband for the ultimate comfort fit.',
    'Pure Washed Flax Linen blend.',
    'Gentle cycle cold wash. Steam or warm iron while slightly damp.',
    4.7,
    11,
    false,
    false,
    false,
    ARRAY['Linen', 'Pleated', 'Office to Bar']
  ),
  (
    'The Cherry Wine Velvet Bustier',
    'cherry-wine-velvet-bustier',
    1999,
    2699,
    'Tops & Corsets',
    'Date Night Euphoria',
    ARRAY['https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80'],
    12,
    'Luxe deep cherry wine velvet bustier with metallic eyelet back lacing and structured underwire cups.',
    'Plush Silk Velvet with breathable cotton lining.',
    'Spot clean or dry clean only.',
    4.9,
    22,
    false,
    true,
    true,
    ARRAY['Velvet', 'Bustier', 'Romantic']
  ),
  (
    'The Amalfi Coast Tiered Sundress',
    'amalfi-coast-tiered-sundress',
    2799,
    3599,
    'Dresses',
    'Brunch & Bubbly',
    ARRAY['https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80'],
    25,
    'Voluminous tiered ruffle skirt with smocked bodice and tie-up shoulder ribbons. The quintessential summer holiday dress.',
    '100% Breathable Organic Cotton Poplin.',
    'Machine wash cold. Line dry in shade.',
    5.0,
    17,
    true,
    false,
    true,
    ARRAY['Sundress', 'Cotton Poplin', 'Holiday']
  ),
  (
    'The Monolith Tailored Oversized Blazer',
    'monolith-tailored-oversized-blazer',
    3999,
    5299,
    'Outerwear',
    'Midnight Muse',
    ARRAY['https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=80'],
    9,
    'Power silhouette oversized blazer with padded structured shoulders, horn buttons, and contrast jacquard logo lining.',
    'Premium Tropical Suiting Wool-Poly Blend.',
    'Professional dry clean only.',
    4.9,
    31,
    false,
    true,
    false,
    ARRAY['Blazer', 'Outerwear', 'Power Suit']
  ),
  (
    'The Cloud Nine Broderie Anglaise Top',
    'cloud-nine-broderie-anglaise-top',
    1699,
    2199,
    'Tops & Corsets',
    'Brunch & Bubbly',
    ARRAY['https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=80'],
    14,
    'Intricate eyelet embroidery with puffed elbow sleeves and a scallop scalloped hemline. Pairs seamlessly with denim or high-waist skirts.',
    '100% Broderie Anglaise Cotton.',
    'Cold wash delicate bag. Warm steam iron.',
    4.8,
    9,
    true,
    false,
    false,
    ARRAY['Broderie', 'Puff Sleeve', 'Casual']
  )
on conflict (slug) do nothing;

-- 4. INSERT SITE SETTINGS
insert into site_settings (
  brand_name, founder_name, business_email, business_phone, whatsapp_number,
  gst_number, upi_id, bank_name, account_number, ifsc_code, account_holder_name
)
values (
  'House of Addya', 'Addya Dubey', 'hello@houseofaddya.com', '+91 98712 34567', '919871234567',
  '07AABCH8921M1ZY', 'anmoldube93@okhdfcbank', 'PUNJAB NATIONAL BANK', '0781100100005018', 'PUNB0078110', 'Anmol Dubey'
);
