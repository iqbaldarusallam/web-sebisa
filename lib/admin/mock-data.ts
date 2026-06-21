import { clientLogos } from "@/data/clientLogos";
import { portfolioItems } from "@/data/portfolio";
import { services } from "@/data/services";
import { teamMembers } from "@/data/team";
import { testimonials } from "@/data/testimonials";
import type {
  AdminClientLogo,
  AdminMessage,
  AdminOrder,
  AdminPortfolioItem,
  AdminService,
  AdminSnapshot,
  AdminTeamMember,
  AdminTestimonial,
} from "./types";

const now = new Date("2026-06-15T09:00:00+07:00");

export const mockServices: AdminService[] = services.map((service, index) => ({
  id: `service-${index + 1}`,
  title: service.title,
  description: service.description,
  category: service.icon,
  basePrice: service.price,
  isPublished: true,
  sortOrder: index + 1,
}));

export const mockPortfolio: AdminPortfolioItem[] = portfolioItems.map((item, index) => ({
  id: `portfolio-${index + 1}`,
  name: item.name,
  category: item.category,
  description: item.description,
  imageUrl: item.image ?? "",
  projectUrl: null,
  isFeatured: index < 4,
  isPublished: true,
  sortOrder: index + 1,
}));

export const mockTestimonials: AdminTestimonial[] = testimonials.map((item, index) => ({
  id: `testimonial-${index + 1}`,
  name: item.name,
  role: item.role,
  comment: item.comment,
  rating: [4.8, 4.7, 4.9][index] ?? 4.8,
  isPublished: true,
  sortOrder: index + 1,
}));

export const mockTeam: AdminTeamMember[] = teamMembers.map((member, index) => ({
  id: `team-${index + 1}`,
  name: member.name,
  division: member.division,
  position: member.position,
  description: member.description,
  imageUrl: null,
  isPublished: true,
  sortOrder: index + 1,
}));

export const mockClients: AdminClientLogo[] = clientLogos.map((client, index) => ({
  id: `client-${index + 1}`,
  name: client.name,
  industry: client.industry,
  logoUrl: client.logoUrl,
  websiteUrl: client.websiteUrl,
  isPublished: true,
  sortOrder: index + 1,
}));

export const mockOrders: AdminOrder[] = [
  {
    id: "order-1",
    orderCode: "SP-20260615-001",
    customerName: "Aulia Rahma",
    brand: "Kedai Rasa",
    serviceName: "Landing Page & Payment Gateway",
    whatsapp: "+62 812-0000-1133",
    email: "aulia@example.com",
    notes: "Butuh landing page promosi dan tracking leads.",
    amount: 1500000,
    status: "paid",
    paymentStatus: "settlement",
    paymentMethod: "qris",
    createdAt: now.toISOString(),
  },
  {
    id: "order-2",
    orderCode: "SP-20260614-004",
    customerName: "Rafi Pradana",
    brand: "Nusa Edu",
    serviceName: "Pengelolaan Media Sosial Instagram & TikTok",
    whatsapp: "+62 813-0000-9088",
    email: "rafi@example.com",
    notes: "Ingin paket social media dan video pendek.",
    amount: 1500000,
    status: "pending_payment",
    paymentStatus: "pending",
    paymentMethod: null,
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: "order-3",
    orderCode: "SP-20260612-002",
    customerName: "Dewi Lestari",
    brand: "Herbal Glow",
    serviceName: "Pembuatan Foto Produk Profesional",
    whatsapp: "+62 821-0000-7788",
    email: null,
    notes: "Butuh konsep foto untuk katalog dan marketplace.",
    amount: 750000,
    status: "follow_up",
    paymentStatus: "unpaid",
    paymentMethod: null,
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 52).toISOString(),
  },
];

export const mockMessages: AdminMessage[] = [
  {
    id: "message-1",
    name: "Nadia Putri",
    brand: "Nadia Studio",
    product: "Branding dan konten",
    whatsapp: "+62 831-1111-2222",
    email: "nadia@example.com",
    message: "Ingin diskusi paket branding untuk launching brand.",
    status: "new",
    createdAt: now.toISOString(),
  },
  {
    id: "message-2",
    name: "Fajar Nugraha",
    brand: "Fajar Coffee",
    product: "Social media",
    whatsapp: "+62 812-3333-4444",
    email: null,
    message: "Butuh konten Instagram dan TikTok per bulan.",
    status: "contacted",
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 30).toISOString(),
  },
];

export const mockAdminSnapshot: AdminSnapshot = {
  supabaseConfigured: false,
  services: mockServices,
  portfolio: mockPortfolio,
  testimonials: mockTestimonials,
  team: mockTeam,
  clients: mockClients,
  orders: mockOrders,
  messages: mockMessages,
};
