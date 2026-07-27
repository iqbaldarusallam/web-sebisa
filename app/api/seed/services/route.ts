import { hasSupabaseAdminEnv, supabaseInsert, supabaseSelect, supabaseUpdateWhere } from "@/lib/integrations/supabase-rest";
import { NextResponse } from "next/server";

const services = [
  // Paket Utama
  {
    title: 'Starter Package',
    description: 'Paket awal untuk bisnis yang ingin memulai strategi konten social media secara konsisten dan profesional.',
    category: 'social',
    promo_price: 3500000,
    normal_price: 5000000,
    features: '5 Video mirroring TikTok & Instagram\n2 Carousel mirroring TikTok & Instagram\nContent Planning\nCopywriting\nFree pembuatan akun (TikTok Shop/Shopee/Marketplace)\n1x Revisi Minor',
    duration: '/bulan',
    badge_type: 'custom',
    badge_text: 'Populer untuk Pemula',
    is_published: true,
    sort_order: 1
  },
  {
    title: 'Growth Package',
    description: 'Paket lengkap untuk bisnis yang ingin scale up dengan iklan digital dan performa yang terukur.',
    category: 'ads',
    promo_price: 4200000,
    normal_price: 6500000,
    features: 'Semua benefit Starter\nTikTok Ads Management\n1x Online Meeting\nWeekly Performance Report\nOptimasi Campaign\nKonsultasi Marketing',
    duration: '/bulan',
    badge_type: 'popular',
    badge_text: null,
    is_published: true,
    sort_order: 2
  },
  {
    title: 'Scale Package',
    description: 'Paket premium untuk bisnis yang ingin dominasi di berbagai platform dengan strategi komprehensif.',
    category: 'website',
    promo_price: 7500000,
    normal_price: 12000000,
    features: 'Semua benefit Growth\nTikTok Ads\nShopee Ads\nMarketplace Optimization\nWeekly Strategy Meeting\nDashboard Performance\nPrioritas Revisi',
    duration: '/bulan',
    badge_type: 'custom',
    badge_text: 'Best Value',
    is_published: true,
    sort_order: 3
  },
  // Add-On Services
  {
    title: 'TikTok Ads Management',
    description: 'Pengelolaan iklan TikTok profesional untuk meningkatkan reach, engagement, dan konversi penjualan.',
    category: 'ads',
    promo_price: 1500000,
    normal_price: 3000000,
    features: null,
    duration: '/bulan',
    badge_type: 'custom',
    badge_text: 'Add-On',
    is_published: true,
    sort_order: 10
  },
  {
    title: 'Shopee Ads Management',
    description: 'Pengelolaan iklan Shopee untuk meningkatkan visibilitas produk dan penjualan di marketplace.',
    category: 'store',
    promo_price: 750000,
    normal_price: 2000000,
    features: null,
    duration: '/bulan',
    badge_type: 'custom',
    badge_text: 'Add-On',
    is_published: true,
    sort_order: 11
  },
  {
    title: 'Video Tambahan Feed Instagram',
    description: 'Produksi video konten Instagram Feed untuk memperkuat brand awareness dan engagement.',
    category: 'video',
    promo_price: 250000,
    normal_price: 400000,
    features: null,
    duration: '/video',
    badge_type: 'custom',
    badge_text: 'Add-On',
    is_published: true,
    sort_order: 12
  },
  {
    title: 'Carousel Reels',
    description: 'Desain carousel dan reels untuk konten Instagram yang menarik dan informatif.',
    category: 'social',
    promo_price: 150000,
    normal_price: 250000,
    features: null,
    duration: '/desain',
    badge_type: 'custom',
    badge_text: 'Add-On',
    is_published: true,
    sort_order: 13
  },
  {
    title: 'Video Tambahan Reels',
    description: 'Produksi video reels untuk konten Instagram dan TikTok yang viral dan engaging.',
    category: 'video',
    promo_price: 250000,
    normal_price: 400000,
    features: null,
    duration: '/desain',
    badge_type: 'custom',
    badge_text: 'Add-On',
    is_published: true,
    sort_order: 14
  },
  {
    title: 'Copywriting',
    description: 'Penulisan konten copywriting profesional untuk caption, deskripsi produk, dan materi promosi.',
    category: 'landing',
    promo_price: 75000,
    normal_price: 150000,
    features: null,
    duration: '/konten',
    badge_type: 'custom',
    badge_text: 'Add-On',
    is_published: true,
    sort_order: 15
  },
  {
    title: 'Product Photoshoot',
    description: 'Sesi foto produk profesional untuk katalog, marketplace, dan materi promosi brand.',
    category: 'video',
    promo_price: 500000,
    normal_price: 800000,
    features: null,
    duration: '/sesi',
    badge_type: 'custom',
    badge_text: 'Add-On',
    is_published: true,
    sort_order: 16
  },
  {
    title: 'Transport Extra',
    description: 'Biaya transportasi untuk sesi foto atau video di luar lokasi studio.',
    category: 'store',
    promo_price: 100000,
    normal_price: 150000,
    features: null,
    duration: '/perjalanan',
    badge_type: 'custom',
    badge_text: 'Add-On',
    is_published: true,
    sort_order: 17
  },
  {
    title: 'Extra Revisi',
    description: 'Biaya tambahan untuk revisi di luar kuota yang sudah ditentukan dalam paket.',
    category: 'landing',
    promo_price: 100000,
    normal_price: 150000,
    features: null,
    duration: '/revisi',
    badge_type: 'custom',
    badge_text: 'Add-On',
    is_published: true,
    sort_order: 18
  }
];

export async function POST() {
  if (!hasSupabaseAdminEnv()) {
    return NextResponse.json(
      { ok: false, message: "Supabase is not configured" },
      { status: 500 }
    );
  }

  let insertedCount = 0;
  let updatedCount = 0;
  let errorCount = 0;

  for (const service of services) {
    try {
      const existing = await supabaseSelect<{ id: string }>(
        'services',
        `select=id&title=eq.${encodeURIComponent(service.title)}&limit=1`
      );

      if (existing.length > 0) {
        await supabaseUpdateWhere('services', 'title', service.title, {
          ...service,
          updated_at: new Date().toISOString()
        });
        updatedCount++;
      } else {
        await supabaseInsert('services', service);
        insertedCount++;
      }
    } catch (error) {
      console.error(`Failed to process ${service.title}:`, error);
      errorCount++;
    }
  }

  return NextResponse.json({
    ok: true,
    inserted: insertedCount,
    updated: updatedCount,
    errors: errorCount,
    total: services.length
  });
}

export async function GET() {
  return NextResponse.json({
    message: "POST to this endpoint to seed services",
    totalServices: services.length
  });
}
