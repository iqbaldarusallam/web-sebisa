export type CmsCollectionKey =
  | "services"
  | "portfolio"
  | "testimonials"
  | "team"
  | "clients"
  | "messages";

export type PaymentStatus =
  | "pending"
  | "settlement"
  | "capture"
  | "deny"
  | "cancel"
  | "expire"
  | "failure"
  | "refund";

export type OrderStatus =
  | "draft"
  | "pending_payment"
  | "paid"
  | "expired"
  | "failed"
  | "cancelled"
  | "follow_up";

export type AdminService = {
  id: string;
  title: string;
  description: string;
  category: string;
  basePrice: number | null;
  isPublished: boolean;
  sortOrder: number;
};

export type AdminPortfolioItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  projectUrl: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
};

export type AdminTestimonial = {
  id: string;
  name: string;
  role: string;
  comment: string;
  rating: number | null;
  isPublished: boolean;
  sortOrder: number;
};

export type AdminTeamMember = {
  id: string;
  name: string;
  division: string;
  position: string;
  description: string;
  imageUrl: string | null;
  isPublished: boolean;
  sortOrder: number;
};

export type AdminClientLogo = {
  id: string;
  name: string;
  industry: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  isPublished: boolean;
  sortOrder: number;
};

export type AdminOrder = {
  id: string;
  orderCode: string;
  customerName: string;
  brand: string;
  serviceName: string;
  whatsapp: string;
  email: string | null;
  notes: string | null;
  amount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus | "unpaid";
  paymentMethod: string | null;
  createdAt: string;
};

export type AdminMessage = {
  id: string;
  name: string;
  brand: string;
  product: string;
  whatsapp: string;
  email: string | null;
  message: string | null;
  status: "new" | "contacted" | "closed";
  createdAt: string;
};

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
};

export type AdminSnapshot = {
  supabaseConfigured: boolean;
  services: AdminService[];
  portfolio: AdminPortfolioItem[];
  testimonials: AdminTestimonial[];
  team: AdminTeamMember[];
  clients: AdminClientLogo[];
  orders: AdminOrder[];
  messages: AdminMessage[];
};

export type AdminCollectionRow =
  | AdminService
  | AdminPortfolioItem
  | AdminTestimonial
  | AdminTeamMember
  | AdminClientLogo
  | AdminMessage;
