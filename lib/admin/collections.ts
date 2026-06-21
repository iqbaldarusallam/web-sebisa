import type { CmsCollectionKey } from "./types";

export type AdminFieldType =
  | "text"
  | "textarea"
  | "number"
  | "url"
  | "email"
  | "checkbox"
  | "select";

export type AdminField = {
  name: string;
  label: string;
  type: AdminFieldType;
  placeholder?: string;
  required?: boolean;
  options?: string[];
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
      { name: "basePrice", label: "Harga promo", type: "number", placeholder: "1500000" },
      { name: "description", label: "Deskripsi", type: "textarea", required: true },
      { name: "sortOrder", label: "Urutan tampil", type: "number", placeholder: "1" },
      { name: "isPublished", label: "Aktif", type: "checkbox" },
    ],
    columns: [
      { key: "title", label: "Layanan" },
      { key: "category", label: "Kategori" },
      { key: "description", label: "Deskripsi" },
      { key: "basePrice", label: "Harga", type: "money" },
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
      { name: "category", label: "Kategori", type: "text", required: true },
      { name: "imageUrl", label: "Gambar portfolio", type: "url" },
      { name: "projectUrl", label: "Link project", type: "url" },
      { name: "description", label: "Deskripsi", type: "textarea", required: true },
      { name: "sortOrder", label: "Urutan tampil", type: "number" },
      { name: "isFeatured", label: "Featured", type: "checkbox" },
    ],
    columns: [
      { key: "imageUrl", label: "Gambar", type: "image" },
      { key: "name", label: "Project" },
      { key: "category", label: "Kategori" },
      { key: "description", label: "Deskripsi" },
      { key: "projectUrl", label: "Link", type: "url" },
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
