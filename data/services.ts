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
  {
    title: "Pengelolaan Media Sosial Instagram & TikTok",
    description:
      "Perencanaan konten, desain visual, caption, kalender posting, dan optimasi akun untuk kebutuhan promosi brand.",
    icon: "social",
    price: 1500000,
    compareAtPrice: 2500000,
  },
  {
    title: "Pengelolaan Media Sosial YouTube",
    description:
      "Pengembangan konsep konten YouTube, optimasi channel, thumbnail, judul, dan kebutuhan publikasi video.",
    icon: "video",
    price: 1750000,
    compareAtPrice: 3000000,
  },
  {
    title: "Pembuatan Foto Produk Profesional",
    description:
      "Foto produk untuk katalog, media sosial, marketplace, dan materi promosi agar brand terlihat lebih kredibel.",
    icon: "video",
    price: 750000,
    compareAtPrice: 1200000,
  },
  {
    title: "Pengelolaan Marketplace & Optimasi Toko Online",
    description:
      "Merapikan tampilan toko, katalog produk, visual, deskripsi, dan kebutuhan campaign di marketplace.",
    icon: "store",
    price: 1250000,
    compareAtPrice: 2000000,
  },
  {
    title: "Pembuatan Surat Undangan Online Untuk Event / EO",
    description:
      "Undangan digital interaktif untuk acara, event organizer, wedding, gathering, dan kebutuhan publikasi event.",
    icon: "landing",
    price: 650000,
    compareAtPrice: 1000000,
  },
  {
    title: "Pengembangan Channel YouTube",
    description:
      "Membangun arah channel, format konten, jadwal publikasi, dan identitas visual agar channel lebih konsisten.",
    icon: "video",
    price: 2000000,
    compareAtPrice: 3500000,
  },
  {
    title: "Pengembangan Iklan YouTube",
    description:
      "Menyusun kebutuhan campaign YouTube Ads, materi iklan, dan arah komunikasi agar promosi lebih terukur.",
    icon: "ads",
    price: 1750000,
    compareAtPrice: 3000000,
  },
  {
    title: "Podcast & Produksi Konten Audio Visual",
    description:
      "Produksi konten audio visual untuk podcast, video campaign, dokumentasi, dan kebutuhan promosi brand.",
    icon: "video",
    price: 2500000,
    compareAtPrice: 4000000,
  },
  {
    title: "Pengelolaan Media Sosial untuk Event Tertentu",
    description:
      "Support konten, publikasi, dan dokumentasi digital untuk campaign event, launching, maupun acara khusus.",
    icon: "social",
    price: 1250000,
    compareAtPrice: 2000000,
  },
  {
    title: "Pembuatan Video Iklan Profesional",
    description:
      "Video promosi singkat untuk iklan digital, social media, produk, layanan, dan campaign brand.",
    icon: "video",
    price: 1750000,
    compareAtPrice: 3000000,
  },
  {
    title: "Pengelolaan Iklan Media Digital",
    description:
      "Strategi dan pengelolaan iklan digital untuk menjangkau audiens yang lebih tepat dan mudah dievaluasi.",
    icon: "ads",
    price: 1500000,
    compareAtPrice: 2500000,
  },
  {
    title: "Pembuatan Website Profesional",
    description:
      "Website company profile, katalog, dan profil bisnis yang responsif, modern, dan siap memperkuat kredibilitas.",
    icon: "website",
    price: 2500000,
    compareAtPrice: 4500000,
  },
  {
    title: "Landing Page & Payment Gateway",
    description:
      "Landing page promosi yang fokus pada konversi dan dapat dikembangkan untuk kebutuhan pembayaran online.",
    icon: "landing",
    price: 1500000,
    compareAtPrice: 3000000,
  },
  {
    title: "Paket Lengkap Kebutuhan Digital Bisnis",
    description:
      "Paket terintegrasi untuk website, konten, social media, visual campaign, dan kebutuhan digital bisnis lainnya.",
    icon: "website",
    price: 4500000,
    compareAtPrice: 7500000,
  },
  {
    title: "Merchandise Campaign",
    description:
      "Konsep dan desain merchandise untuk kebutuhan promosi, event, komunitas, dan campaign brand.",
    icon: "store",
    price: 1000000,
    compareAtPrice: 1750000,
  },
];

export const serviceVariants = services.map((service) => service.title);

export function getServiceByTitle(title: string) {
  return services.find((service) => service.title === title);
}

export function getServicePrice(title: string) {
  return getServiceByTitle(title)?.price;
}
