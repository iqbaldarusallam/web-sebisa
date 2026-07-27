export type ServiceIcon =
  | "website"
  | "landing"
  | "social"
  | "ads"
  | "video"
  | "store";

export type Service = {
  title: string;
  description: string;
  icon: ServiceIcon;
  price: number;
  compareAtPrice: number;
  features?: string[];
  durationLabel?: string;
  badgeType?: "discount" | "popular" | "custom";
  badgeLabel?: string | null;
  isPopular?: boolean;
};

export const services: Service[] = [
  // === PAKET UTAMA ===
  {
    title: "Starter Package",
    description:
      "Paket awal untuk bisnis yang ingin memulai strategi konten social media secara konsisten dan profesional.",
    icon: "social",
    price: 3500000,
    compareAtPrice: 5000000,
    badgeType: "custom",
    badgeLabel: "Populer untuk Pemula",
    features: [
      "5 Video mirroring TikTok & Instagram",
      "2 Carousel mirroring TikTok & Instagram",
      "Content Planning",
      "Copywriting",
      "Free pembuatan akun (TikTok Shop/Shopee/Marketplace)",
      "1x Revisi Minor",
    ],
    durationLabel: "/bulan",
  },
  {
    title: "Growth Package",
    description:
      "Paket lengkap untuk bisnis yang inginscale up dengan iklan digital dan performa yang terukur.",
    icon: "ads",
    price: 4200000,
    compareAtPrice: 6500000,
    badgeType: "popular",
    isPopular: true,
    features: [
      "Semua benefit Starter",
      "TikTok Ads Management",
      "1x Online Meeting",
      "Weekly Performance Report",
      "Optimasi Campaign",
      "Konsultasi Marketing",
    ],
    durationLabel: "/bulan",
  },
  {
    title: "Scale Package",
    description:
      "Paket premium untuk bisnis yang ingin dominasi di berbagai platform dengan strategi komprehensif.",
    icon: "website",
    price: 7500000,
    compareAtPrice: 12000000,
    badgeType: "custom",
    badgeLabel: "Best Value",
    features: [
      "Semua benefit Growth",
      "TikTok Ads",
      "Shopee Ads",
      "Marketplace Optimization",
      "Weekly Strategy Meeting",
      "Dashboard Performance",
      "Prioritas Revisi",
    ],
    durationLabel: "/bulan",
  },

  // === ADD-ON SERVICES ===
  {
    title: "TikTok Ads Management",
    description:
      "Pengelolaan iklan TikTok profesional untuk meningkatkan reach, engagement, dan konversi penjualan.",
    icon: "ads",
    price: 1500000,
    compareAtPrice: 3000000,
    badgeType: "custom",
    badgeLabel: "Add-On",
    durationLabel: "/bulan",
  },
  {
    title: "Shopee Ads Management",
    description:
      "Pengelolaan iklan Shopee untuk meningkatkan visibilitas produk dan penjualan di marketplace.",
    icon: "store",
    price: 750000,
    compareAtPrice: 2000000,
    badgeType: "custom",
    badgeLabel: "Add-On",
    durationLabel: "/bulan",
  },
  {
    title: "Video Tambahan Feed Instagram",
    description:
      "Produksi video konten Instagram Feed untuk memperkuat brand awareness dan engagement.",
    icon: "video",
    price: 250000,
    compareAtPrice: 400000,
    badgeType: "custom",
    badgeLabel: "Add-On",
    durationLabel: "/video",
  },
  {
    title: "Carousel Reels",
    description:
      "Desain carousel dan reels untuk konten Instagram yang menarik dan informatif.",
    icon: "social",
    price: 150000,
    compareAtPrice: 250000,
    badgeType: "custom",
    badgeLabel: "Add-On",
    durationLabel: "/desain",
  },
  {
    title: "Video Tambahan Reels",
    description:
      "Produksi video reels untuk konten Instagram dan TikTok yang viral dan engaging.",
    icon: "video",
    price: 250000,
    compareAtPrice: 400000,
    badgeType: "custom",
    badgeLabel: "Add-On",
    durationLabel: "/desain",
  },
  {
    title: "Copywriting",
    description:
      "Penulisan konten copywriting profesional untuk caption, deskripsi produk, dan materi promosi.",
    icon: "landing",
    price: 75000,
    compareAtPrice: 150000,
    badgeType: "custom",
    badgeLabel: "Add-On",
    durationLabel: "/konten",
  },
  {
    title: "Product Photoshoot",
    description:
      "Sesi foto produk profesional untuk katalog, marketplace, dan materi promosi brand.",
    icon: "video",
    price: 500000,
    compareAtPrice: 800000,
    badgeType: "custom",
    badgeLabel: "Add-On",
    durationLabel: "/sesi",
  },
  {
    title: "Transport Extra",
    description:
      "Biaya transportasi untuk sesi foto atau video di luar lokasi studio.",
    icon: "store",
    price: 100000,
    compareAtPrice: 150000,
    badgeType: "custom",
    badgeLabel: "Add-On",
    durationLabel: "/perjalanan",
  },
  {
    title: "Extra Revisi",
    description:
      "Biaya tambahan untuk revisi di luar kuota yang sudah ditentukan dalam paket.",
    icon: "landing",
    price: 100000,
    compareAtPrice: 150000,
    badgeType: "custom",
    badgeLabel: "Add-On",
    durationLabel: "/revisi",
  },
];

export const serviceVariants = services.map((service) => service.title);

export function getServiceByTitle(title: string) {
  return services.find((service) => service.title === title);
}

export function getServicePrice(title: string) {
  return getServiceByTitle(title)?.price;
}
