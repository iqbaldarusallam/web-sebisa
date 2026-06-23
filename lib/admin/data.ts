import { adminCollections } from "./collections";
import { mockAdminSnapshot } from "./mock-data";
import type {
  AdminClientLogo,
  AdminMessage,
  AdminOrder,
  AdminPortfolioItem,
  AdminService,
  AdminSnapshot,
  AdminTeamMember,
  AdminTestimonial,
  AdminUser,
  CmsCollectionKey,
} from "./types";
import { hashAdminPassword } from "./password";
import {
  hasSupabaseAdminEnv,
  supabaseDelete,
  supabaseInsert,
  supabaseSelect,
  supabaseUpdate,
} from "@/lib/integrations/supabase-rest";

type SupabaseServiceRow = {
  id: string;
  title: string;
  description: string;
  category: string | null;
  base_price: number | null;
  is_published: boolean;
  sort_order: number;
};

type SupabasePortfolioRow = {
  id: string;
  name: string;
  category: string;
  description: string;
  image_url: string | null;
  project_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
};

type SupabaseTestimonialRow = {
  id: string;
  name: string;
  role: string;
  comment: string;
  rating: number | null;
  is_published: boolean;
  sort_order: number;
};

type SupabaseTeamRow = {
  id: string;
  name: string;
  division: string;
  position: string;
  description: string;
  image_url: string | null;
  is_published: boolean;
  sort_order: number;
};

type SupabaseClientRow = {
  id: string;
  name: string;
  industry: string | null;
  logo_url: string | null;
  website_url: string | null;
  is_published: boolean;
  sort_order: number;
};

type SupabaseOrderRow = {
  id: string;
  order_code: string;
  customer_name: string;
  brand: string;
  service_name: string;
  whatsapp: string;
  email: string | null;
  notes: string | null;
  amount: number;
  status: AdminOrder["status"];
  payment_status: AdminOrder["paymentStatus"];
  payment_method: string | null;
  created_at: string;
};

type SupabaseMessageRow = {
  id: string;
  name: string;
  brand: string;
  product: string;
  whatsapp: string;
  email: string | null;
  message: string | null;
  status: AdminMessage["status"];
  created_at: string;
};

type SupabaseAdminUserRow = {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  created_at: string;
};

const orderQuery = "select=*&order=sort_order.asc";

function toAdminService(row: SupabaseServiceRow): AdminService {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category ?? "Digital",
    basePrice: row.base_price,
    isPublished: row.is_published,
    sortOrder: row.sort_order,
  };
}

function toAdminPortfolio(row: SupabasePortfolioRow): AdminPortfolioItem {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    imageUrl: row.image_url ?? "",
    projectUrl: row.project_url,
    isFeatured: row.is_featured,
    isPublished: row.is_published,
    sortOrder: row.sort_order,
  };
}

function toAdminTestimonial(row: SupabaseTestimonialRow): AdminTestimonial {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    comment: row.comment,
    rating: row.rating,
    isPublished: row.is_published,
    sortOrder: row.sort_order,
  };
}

function toAdminTeam(row: SupabaseTeamRow): AdminTeamMember {
  return {
    id: row.id,
    name: row.name,
    division: row.division,
    position: row.position,
    description: row.description,
    imageUrl: row.image_url,
    isPublished: row.is_published,
    sortOrder: row.sort_order,
  };
}

function toAdminClient(row: SupabaseClientRow): AdminClientLogo {
  return {
    id: row.id,
    name: row.name,
    industry: row.industry,
    logoUrl: row.logo_url,
    websiteUrl: row.website_url,
    isPublished: row.is_published,
    sortOrder: row.sort_order,
  };
}

function toAdminOrder(row: SupabaseOrderRow): AdminOrder {
  return {
    id: row.id,
    orderCode: row.order_code,
    customerName: row.customer_name,
    brand: row.brand,
    serviceName: row.service_name,
    whatsapp: row.whatsapp,
    email: row.email,
    notes: row.notes,
    amount: row.amount,
    status: row.status,
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method,
    createdAt: row.created_at,
  };
}

function toAdminMessage(row: SupabaseMessageRow): AdminMessage {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    product: row.product,
    whatsapp: row.whatsapp,
    email: row.email,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  };
}

function toAdminUser(row: SupabaseAdminUserRow): AdminUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}

export async function getAdminSnapshot(): Promise<AdminSnapshot> {
  if (!hasSupabaseAdminEnv()) {
    return mockAdminSnapshot;
  }

  try {
    const [
      services,
      portfolio,
      testimonials,
      team,
      clients,
      orders,
      messages,
    ] = await Promise.all([
      supabaseSelect<SupabaseServiceRow>("services", orderQuery),
      supabaseSelect<SupabasePortfolioRow>("portfolio_items", orderQuery),
      supabaseSelect<SupabaseTestimonialRow>("testimonials", orderQuery),
      supabaseSelect<SupabaseTeamRow>("team_members", orderQuery),
      supabaseSelect<SupabaseClientRow>("client_logos", orderQuery),
      supabaseSelect<SupabaseOrderRow>("orders", "select=*&order=created_at.desc&limit=50"),
      supabaseSelect<SupabaseMessageRow>("contact_messages", "select=*&order=created_at.desc&limit=50"),
    ]);

    return {
      supabaseConfigured: true,
      services: services.map(toAdminService),
      portfolio: portfolio.map(toAdminPortfolio),
      testimonials: testimonials.map(toAdminTestimonial),
      team: team.map(toAdminTeam),
      clients: clients.map(toAdminClient),
      orders: orders.map(toAdminOrder),
      messages: messages.map(toAdminMessage),
    };
  } catch (error) {
    console.error("Falling back to mock admin data:", error);
    return { ...mockAdminSnapshot, supabaseConfigured: true };
  }
}

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readNullableString(formData: FormData, key: string) {
  const value = readString(formData, key);
  return value || null;
}

function readNumber(formData: FormData, key: string, fallback = 0) {
  const value = Number(readString(formData, key));
  return Number.isFinite(value) ? value : fallback;
}

export function buildPayload(collection: CmsCollectionKey, formData: FormData) {
  switch (collection) {
    case "services":
      return {
        title: readString(formData, "title"),
        description: readString(formData, "description"),
        category: readString(formData, "category") || null,
        base_price: readString(formData, "basePrice") ? readNumber(formData, "basePrice") : null,
        is_published: formData.get("isPublished") === "on",
        sort_order: readNumber(formData, "sortOrder", 999),
      };
    case "portfolio":
      return {
        name: readString(formData, "name"),
        category: readString(formData, "category"),
        description: readString(formData, "description"),
        image_url: readNullableString(formData, "imageUrl"),
        project_url: readNullableString(formData, "projectUrl"),
        is_featured: formData.get("isFeatured") === "on",
        is_published: true,
        sort_order: readNumber(formData, "sortOrder", 999),
      };
    case "testimonials":
      return {
        name: readString(formData, "name"),
        role: readString(formData, "role"),
        comment: readString(formData, "comment"),
        rating: readString(formData, "rating") ? readNumber(formData, "rating") : null,
        is_published: true,
        sort_order: readNumber(formData, "sortOrder", 999),
      };
    case "team":
      return {
        name: readString(formData, "name"),
        division: readString(formData, "division") || "Production",
        position: readString(formData, "position"),
        description: readString(formData, "description"),
        image_url: readNullableString(formData, "imageUrl"),
        is_published: true,
        sort_order: readNumber(formData, "sortOrder", 999),
      };
    case "clients":
      return {
        name: readString(formData, "name"),
        industry: readNullableString(formData, "industry"),
        logo_url: readNullableString(formData, "logoUrl"),
        website_url: readNullableString(formData, "websiteUrl"),
        is_published: true,
        sort_order: readNumber(formData, "sortOrder", 999),
      };
    case "messages":
      return {
        name: readString(formData, "name"),
        brand: readString(formData, "brand"),
        product: readString(formData, "product"),
        whatsapp: readString(formData, "whatsapp"),
        email: readNullableString(formData, "email"),
        message: readNullableString(formData, "message"),
        status: "new",
      };
  }
}

export async function saveCmsRecord(collection: CmsCollectionKey, formData: FormData) {
  const config = adminCollections[collection];
  const payload = buildPayload(collection, formData);

  if (!hasSupabaseAdminEnv()) {
    return { persisted: false };
  }

  const id = readString(formData, "id");

  if (id) {
    await supabaseUpdate(config.table, id, payload);
  } else {
    await supabaseInsert(config.table, payload);
  }

  return { persisted: true };
}

export async function deleteCmsRecord(collection: CmsCollectionKey, id: string) {
  const config = adminCollections[collection];

  if (!hasSupabaseAdminEnv()) {
    return { persisted: false };
  }

  await supabaseDelete(config.table, id);
  return { persisted: true };
}

export async function getAdminUsers() {
  if (!hasSupabaseAdminEnv()) {
    return [];
  }

  const rows = await supabaseSelect<SupabaseAdminUserRow>(
    "admin_users",
    "select=id,email,name,role,is_active,created_at&order=created_at.asc",
  );

  return rows.map(toAdminUser);
}

export async function saveAdminUser(formData: FormData) {
  if (!hasSupabaseAdminEnv()) {
    return { persisted: false };
  }

  const id = readString(formData, "id");
  const email = readString(formData, "email").toLowerCase();
  const name = readString(formData, "name");
  const role = readString(formData, "role") || "admin";
  const password = readString(formData, "password");
  const payload: Record<string, unknown> = {
    email,
    name,
    role,
    is_active: formData.get("isActive") === "on",
    updated_at: new Date().toISOString(),
  };

  if (!email || !name) {
    throw new Error("Email dan nama admin wajib diisi.");
  }

  if (password) {
    payload.password_hash = hashAdminPassword(password);
  }

  if (id) {
    await supabaseUpdate("admin_users", id, payload);
  } else {
    if (!password) {
      throw new Error("Password admin baru wajib diisi.");
    }

    await supabaseInsert("admin_users", payload);
  }

  return { persisted: true };
}

export async function deleteAdminUser(id: string) {
  if (!hasSupabaseAdminEnv()) {
    return { persisted: false };
  }

  await supabaseDelete("admin_users", id);
  return { persisted: true };
}
