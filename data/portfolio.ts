export const portfolioCategories = [
  "Semua",
  "Social Media",
  "Graphic Design",
  "Website & Landing Page",
  "Marketplace",
  "Branding",
  "Digital Campaign",
] as const;

export type PortfolioCategory = (typeof portfolioCategories)[number];

export type PortfolioItem = {
  name: string;
  category: Exclude<PortfolioCategory, "Semua">;
  filterCategory: Exclude<PortfolioCategory, "Semua">;
  description: string;
  colors: string[];
  image: string;
};

export const portfolioItems: PortfolioItem[] = [
  {
    name: "Magic Bean",
    category: "Graphic Design",
    filterCategory: "Graphic Design",
    description: "Dokumentasi desain visual untuk brand lifestyle dan produk retail.",
    colors: ["#BFA7FF", "#FCE7F3", "#C4B5FD", "#7DD3FC", "#FDE68A", "#DDD6FE"],
    image: "/portfolio/magic-bean.svg",
  },
  {
    name: "Teleriz Foods",
    category: "Graphic Design",
    filterCategory: "Graphic Design",
    description: "Materi promosi makanan dengan visual produk yang mudah dipindai.",
    colors: ["#F97316", "#FACC15", "#EF4444", "#FDBA74", "#FEF3C7", "#DC2626"],
    image: "/portfolio/ponpen.svg",
  },
  {
    name: "Gapura Mitra Mulia",
    category: "Social Media",
    filterCategory: "Social Media",
    description: "Konten sosial untuk memperkuat citra layanan dan aktivitas perusahaan.",
    colors: ["#06B6D4", "#141D38", "#0A0F1E", "#86EFAC", "#141D38", "#0A0F1E"],
    image: "/portfolio/gapura.svg",
  },
  {
    name: "Ponpen An-Najah Bogor",
    category: "Social Media",
    filterCategory: "Social Media",
    description: "Desain publikasi kegiatan edukasi dan komunitas dengan gaya informatif.",
    colors: ["#16A34A", "#F59E0B", "#22C55E", "#60A5FA", "#FDE68A", "#15803D"],
    image: "/portfolio/ponpen.svg",
  },
  {
    name: "Company Profile UMKM",
    category: "Website & Landing Page",
    filterCategory: "Website & Landing Page",
    description: "Profil digital bisnis yang ringan, jelas, dan siap dipakai untuk promosi.",
    colors: ["#06B6D4", "#141D38", "#22C55E", "#0A0F1E", "#141D38", "#94A3B8"],
    image: "/portfolio/gapura.svg",
  },
  {
    name: "Digital Campaign Launch",
    category: "Digital Campaign",
    filterCategory: "Digital Campaign",
    description: "Materi campaign dengan alur komunikasi yang fokus pada lead dan konversi.",
    colors: ["#06B6D4", "#F97316", "#0A0F1E", "#DCFCE7", "#141D38", "#141D38"],
    image: "/portfolio/magic-bean.svg",
  },
  {
    name: "Katalog Produk Digital",
    category: "Marketplace",
    filterCategory: "Marketplace",
    description: "Katalog produk responsif untuk mempercepat calon pembeli memahami penawaran.",
    colors: ["#34D399", "#DBEAFE", "#F43F5E", "#F8FAFC", "#2563EB", "#A7F3D0"],
    image: "/portfolio/ponpen.svg",
  },
  {
    name: "Personal Brand Portfolio",
    category: "Branding",
    filterCategory: "Branding",
    description: "Profil personal yang menampilkan layanan, bukti karya, dan jalur konsultasi.",
    colors: ["#1D4ED8", "#E0F2FE", "#FACC15", "#FFFFFF", "#0891B2", "#64748B"],
    image: "/portfolio/magic-bean.svg",
  },
];
