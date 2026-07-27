-- Migration: Update services with new rate card
-- Jalankan di Supabase SQL Editor untuk update layanan

-- Hapus semua services lama (opsional, comment jika ingin keep data lama)
-- DELETE FROM public.services;

-- Insert paket utama
INSERT INTO public.services (title, description, category, promo_price, normal_price, features, duration, badge_type, badge_text, is_published, sort_order)
VALUES
  -- Starter Package
  (
    'Starter Package',
    'Paket awal untuk bisnis yang ingin memulai strategi konten social media secara konsisten dan profesional.',
    'social',
    3500000,
    5000000,
    '5 Video mirroring TikTok & Instagram
2 Carousel mirroring TikTok & Instagram
Content Planning
Copywriting
Free pembuatan akun (TikTok Shop/Shopee/Marketplace)
1x Revisi Minor',
    '/bulan',
    'custom',
    'Populer untuk Pemula',
    true,
    1
  ),
  -- Growth Package
  (
    'Growth Package',
    'Paket lengkap untuk bisnis yang ingin scale up dengan iklan digital dan performa yang terukur.',
    'ads',
    4200000,
    6500000,
    'Semua benefit Starter
TikTok Ads Management
1x Online Meeting
Weekly Performance Report
Optimasi Campaign
Konsultasi Marketing',
    '/bulan',
    'popular',
    NULL,
    true,
    2
  ),
  -- Scale Package
  (
    'Scale Package',
    'Paket premium untuk bisnis yang ingin dominasi di berbagai platform dengan strategi komprehensif.',
    'website',
    7500000,
    12000000,
    'Semua benefit Growth
TikTok Ads
Shopee Ads
Marketplace Optimization
Weekly Strategy Meeting
Dashboard Performance
Prioritas Revisi',
    '/bulan',
    'custom',
    'Best Value',
    true,
    3
  ),

  -- Add-On Services
  -- TikTok Ads Management
  (
    'TikTok Ads Management',
    'Pengelolaan iklan TikTok profesional untuk meningkatkan reach, engagement, dan konversi penjualan.',
    'ads',
    1500000,
    3000000,
    NULL,
    '/bulan',
    'custom',
    'Add-On',
    true,
    10
  ),
  -- Shopee Ads Management
  (
    'Shopee Ads Management',
    'Pengelolaan iklan Shopee untuk meningkatkan visibilitas produk dan penjualan di marketplace.',
    'store',
    750000,
    2000000,
    NULL,
    '/bulan',
    'custom',
    'Add-On',
    true,
    11
  ),
  -- Video Tambahan Feed Instagram
  (
    'Video Tambahan Feed Instagram',
    'Produksi video konten Instagram Feed untuk memperkuat brand awareness dan engagement.',
    'video',
    250000,
    400000,
    NULL,
    '/video',
    'custom',
    'Add-On',
    true,
    12
  ),
  -- Carousel Reels
  (
    'Carousel Reels',
    'Desain carousel dan reels untuk konten Instagram yang menarik dan informatif.',
    'social',
    150000,
    250000,
    NULL,
    '/desain',
    'custom',
    'Add-On',
    true,
    13
  ),
  -- Video Tambahan Reels
  (
    'Video Tambahan Reels',
    'Produksi video reels untuk konten Instagram dan TikTok yang viral dan engaging.',
    'video',
    250000,
    400000,
    NULL,
    '/desain',
    'custom',
    'Add-On',
    true,
    14
  ),
  -- Copywriting
  (
    'Copywriting',
    'Penulisan konten copywriting profesional untuk caption, deskripsi produk, dan materi promosi.',
    'landing',
    75000,
    150000,
    NULL,
    '/konten',
    'custom',
    'Add-On',
    true,
    15
  ),
  -- Product Photoshoot
  (
    'Product Photoshoot',
    'Sesi foto produk profesional untuk katalog, marketplace, dan materi promosi brand.',
    'video',
    500000,
    800000,
    NULL,
    '/sesi',
    'custom',
    'Add-On',
    true,
    16
  ),
  -- Transport Extra
  (
    'Transport Extra',
    'Biaya transportasi untuk sesi foto atau video di luar lokasi studio.',
    'store',
    100000,
    150000,
    NULL,
    '/perjalanan',
    'custom',
    'Add-On',
    true,
    17
  ),
  -- Extra Revisi
  (
    'Extra Revisi',
    'Biaya tambahan untuk revisi di luar kuota yang sudah ditentukan dalam paket.',
    'landing',
    100000,
    150000,
    NULL,
    '/revisi',
    'custom',
    'Add-On',
    true,
    18
  )
ON CONFLICT (title) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  promo_price = EXCLUDED.promo_price,
  normal_price = EXCLUDED.normal_price,
  features = EXCLUDED.features,
  duration = EXCLUDED.duration,
  badge_type = EXCLUDED.badge_type,
  badge_text = EXCLUDED.badge_text,
  is_published = EXCLUDED.is_published,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();
