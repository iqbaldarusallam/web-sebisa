import type { CmsCollectionKey } from "./types";

export type AdminFieldType =
  | "text"
  | "textarea"
  | "number"
  | "url"
  | "email"
  | "checkbox"
  | "select"
  | "badge";

export type AdminField = {
  name: string;
  label: string;
  type: AdminFieldType;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  allowCustom?: boolean;
  customFieldName?: string;
  customPlaceholder?: string;
  accept?: string;
  uploadKind?: "image" | "video" | "media";
  uploadLabel?: string;
};

export type AdminColumn = {
  key: string;
  label: string;
  type?: "text" | "money" | "boolean" | "status" | "date" | "image" | "url";
};

export type AdminCollectionConfig = {
  key: CmsCollectionKey;
  title: string;
  description: string;
  table: string;
  path: string;
  badge: string;
  maxItems?: number;
  fields: AdminField[];
  columns: AdminColumn[];
};

export const adminCollections: Record<CmsCollectionKey, AdminCollectionConfig> = {
  services: {
    key: "services",
    title: "Layanan",
    description:
      "Kelola daftar layanan yang tampil di section Layanan Kami.",
    table: "services",
    path: "/admin/layanan",
    badge: "CMS Layanan",
    fields: [
      { name: "title", label: "Nama layanan", type: "text", required: true },
      {
        name: "category",
        label: "Kategori paket",
        type: "select",
        options: ["social", "video", "ads", "website", "landing", "store"],
      },
      {
        name: "normalPrice",
        label: "Harga normal (dicoret)",
        type: "number",
        placeholder: "2500000",
      },
      { name: "promoPrice", label: "Harga promo", type: "number", placeholder: "1500000" },
      {
        name: "badgeType",
        label: "Badge",
        type: "badge",
        options: ["discount", "popular", "custom"],
        customPlaceholder: "Contoh: Best Value, Limited, Paket Favorit",
      },
      {
        name: "duration",
        label: "Durasi pengerjaan",
        type: "text",
        placeholder: "Mulai 7-14 hari kerja",
      },
      {
        name: "features",
        label: "Fitur layanan",
        type: "textarea",
        placeholder: "Satu fitur per baris",
      },
      { name: "description", label: "Deskripsi", type: "textarea", required: true },
      { name: "sortOrder", label: "Urutan tampil", type: "number", placeholder: "1" },
      { name: "isPublished", label: "Aktif", type: "checkbox" },
    ],
    columns: [
      { key: "title", label: "Layanan" },
      { key: "category", label: "Kategori" },
      { key: "normalPrice", label: "Harga normal", type: "money" },
      { key: "promoPrice", label: "Harga promo", type: "money" },
      { key: "badgeDisplay", label: "Badge" },
      { key: "duration", label: "Durasi" },
      { key: "sortOrder", label: "Urutan" },
      { key: "isPublished", label: "Aktif", type: "boolean" },
    ],
  },
  portfolio: {
    key: "portfolio",
    title: "Portofolio",
    description:
      "Kelola project yang tampil di halaman portofolio dan section Recent Work.",
    table: "portfolio_items",
    path: "/admin/portofolio",
    badge: "CMS Karya",
    fields: [
      { name: "name", label: "Nama project", type: "text", required: true },
      {
        name: "category",
        label: "Kategori",
        type: "select",
        required: true,
        allowCustom: true,
        customFieldName: "customCategory",
        customPlaceholder: "Atau isi kategori baru, contoh: Podcast Artist",
        options: [
          "Social Media",
          "Graphic Design",
          "Website & Landing Page",
          "Marketplace",
          "Branding",
          "Digital Campaign",
        ],
      },
      { name: "imageUrl", label: "Gambar portfolio", type: "url" },
      { name: "description", label: "Deskripsi", type: "textarea", required: true },
      { name: "sortOrder", label: "Urutan tampil", type: "number" },
      { name: "isFeatured", label: "Featured", type: "checkbox" },
    ],
    columns: [
      { key: "imageUrl", label: "Gambar", type: "image" },
      { key: "name", label: "Project" },
      { key: "category", label: "Kategori" },
      { key: "description", label: "Deskripsi" },
      { key: "isFeatured", label: "Featured", type: "boolean" },
    ],
  },
  testimonials: {
    key: "testimonials",
    title: "Testimoni",
    description:
      "Kelola review client agar testimoni tetap natural, jelas, dan mudah dipercaya.",
    table: "testimonials",
    path: "/admin/testimoni",
    badge: "CMS Review",
    fields: [
      { name: "name", label: "Nama client", type: "text", required: true },
      { name: "role", label: "Brand / jabatan", type: "text", required: true },
      { name: "rating", label: "Rating natural", type: "number", placeholder: "4.8" },
      { name: "comment", label: "Isi testimoni", type: "textarea", required: true },
      { name: "sortOrder", label: "Urutan tampil", type: "number" },
    ],
    columns: [
      { key: "name", label: "Client" },
      { key: "role", label: "Brand" },
      { key: "rating", label: "Rating" },
      { key: "comment", label: "Testimoni" },
    ],
  },
  team: {
    key: "team",
    title: "Tim",
    description:
      "Kelola anggota tim berdasarkan divisi, posisi, deskripsi pekerjaan, dan foto.",
    table: "team_members",
    path: "/admin/tim",
    badge: "CMS Tim",
    fields: [
      { name: "name", label: "Nama anggota", type: "text", required: true },
      {
        name: "division",
        label: "Divisi",
        type: "select",
        options: ["Leadership", "Business Support", "Production", "Virtual Assistant", "Marketing"],
      },
      { name: "position", label: "Posisi", type: "text", required: true },
      { name: "imageUrl", label: "Foto anggota", type: "url" },
      { name: "description", label: "Deskripsi pekerjaan", type: "textarea", required: true },
      { name: "sortOrder", label: "Urutan tampil", type: "number" },
    ],
    columns: [
      { key: "imageUrl", label: "Foto", type: "image" },
      { key: "name", label: "Nama" },
      { key: "division", label: "Divisi" },
      { key: "position", label: "Posisi" },
      { key: "description", label: "Deskripsi" },
    ],
  },
  clients: {
    key: "clients",
    title: "Client / Kerjasama",
    description:
      "Satu data logo untuk Home dan halaman Kerjasama agar tidak perlu input dua kali.",
    table: "client_logos",
    path: "/admin/kerjasama",
    badge: "CMS Client",
    fields: [
      { name: "name", label: "Nama client", type: "text", required: true },
      { name: "industry", label: "Industri", type: "text", placeholder: "F&B, Education, Retail" },
      { name: "logoUrl", label: "Logo client", type: "url" },
      { name: "websiteUrl", label: "Website / sosial media", type: "url" },
      { name: "sortOrder", label: "Urutan tampil", type: "number" },
    ],
    columns: [
      { key: "logoUrl", label: "Logo", type: "image" },
      { key: "name", label: "Client" },
      { key: "industry", label: "Industri" },
      { key: "websiteUrl", label: "Link", type: "url" },
      { key: "sortOrder", label: "Urutan" },
    ],
  },
  bts: {
    key: "bts",
    title: "Behind The Scenes",
    description:
      "Kelola konten BTS berupa video proses kerja yang tampil di homepage dan halaman BTS.",
    table: "bts_items",
    path: "/admin/bts",
    badge: "CMS BTS",
    maxItems: 6,
    fields: [
      { name: "title", label: "Judul video", type: "text", required: true },
      { name: "description", label: "Deskripsi singkat", type: "textarea", required: true },
      {
        name: "videoUrl",
        label: "Video",
        type: "url",
        required: true,
        placeholder: "https://res.cloudinary.com/.../video.mp4",
        accept: "video/mp4,video/webm,video/quicktime",
        uploadKind: "video",
        uploadLabel: "Upload Video",
      },
      {
        name: "thumbnailUrl",
        label: "Thumbnail",
        type: "url",
        placeholder: "https://res.cloudinary.com/.../thumb.jpg",
        uploadKind: "image",
        uploadLabel: "Upload Thumbnail",
      },
      { name: "sortOrder", label: "Urutan tampil", type: "number", placeholder: "1" },
      { name: "isPublished", label: "Aktif", type: "checkbox" },
    ],
    columns: [
      { key: "thumbnailUrl", label: "Thumbnail", type: "image" },
      { key: "title", label: "Judul" },
      { key: "description", label: "Deskripsi" },
      { key: "videoUrl", label: "Video", type: "url" },
      { key: "sortOrder", label: "Urutan" },
      { key: "isPublished", label: "Aktif", type: "boolean" },
    ],
  },
  messages: {
    key: "messages",
    title: "Pesan Masuk",
    description:
      "Pantau prospek yang masuk dari form konsultasi dan halaman checkout.",
    table: "contact_messages",
    path: "/admin/pesan",
    badge: "Leads",
    fields: [
      { name: "name", label: "Nama", type: "text", required: true },
      { name: "brand", label: "Brand", type: "text" },
      { name: "product", label: "Produk / layanan", type: "text" },
      { name: "whatsapp", label: "WhatsApp", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "message", label: "Pesan", type: "textarea" },
    ],
    columns: [
      { key: "name", label: "Nama" },
      { key: "brand", label: "Brand" },
      { key: "product", label: "Kebutuhan" },
      { key: "createdAt", label: "Masuk", type: "date" },
    ],
  },
};

export const cmsTableToCollection = Object.fromEntries(
  Object.values(adminCollections).map((collection) => [collection.table, collection.key]),
) as Record<string, CmsCollectionKey>;
