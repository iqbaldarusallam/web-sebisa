import { clientLogos as fallbackClients, type ClientLogo } from "@/data/clientLogos";
import { portfolioItems as fallbackPortfolio, type PortfolioItem } from "@/data/portfolio";
import {
  getServiceByTitle,
  services as fallbackServices,
  type Service,
} from "@/data/services";
import { teamMembers as fallbackTeam, type TeamMember } from "@/data/team";
import { testimonials as fallbackTestimonials, type Testimonial } from "@/data/testimonials";
import type { ServiceIcon } from "@/data/services";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export type BtsItem = {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string | null;
};

type PublicCmsContent = {
  bts: BtsItem[];
  clients: ClientLogo[];
  services: Service[];
  portfolio: PortfolioItem[];
  team: TeamMember[];
  testimonials: Testimonial[];
};

function hasSupabasePublicEnv() {
  return Boolean(supabaseUrl && supabaseKey);
}

async function publicSelect<T>(table: string, query: string) {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase public env is not configured.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${query}`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${table}`);
  }

  return (await response.json()) as T[];
}

function initialsFromName(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

function serviceIconFromCategory(category: string | null): ServiceIcon {
  const validIcons: ServiceIcon[] = [
    "website",
    "landing",
    "social",
    "ads",
    "video",
    "store",
  ];

  return validIcons.includes(category as ServiceIcon)
    ? (category as ServiceIcon)
    : "website";
}

function servicePriceValue(
  cmsValue: number | null | undefined,
  fallbackValue: number | undefined,
  defaultValue: number,
) {
  const value = cmsValue ?? fallbackValue ?? defaultValue;

  return Number.isFinite(value) && value > 0 ? value : defaultValue;
}

function serviceDurationFromCategory(category: ServiceIcon) {
  const durations: Record<ServiceIcon, string> = {
    ads: "Mulai 5-10 hari kerja",
    landing: "Mulai 7-14 hari kerja",
    social: "Mulai 14-30 hari kerja",
    store: "Mulai 7-14 hari kerja",
    video: "Mulai 7-21 hari kerja",
    website: "Mulai 14-30 hari kerja",
  };

  return durations[category];
}

function serviceFeaturesFromText(value: string | null | undefined) {
  return (value ?? "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeBadgeType(value: string | null | undefined) {
  return value === "popular" || value === "custom" || value === "discount"
    ? value
    : "discount";
}

export async function getPublicCmsContent(): Promise<PublicCmsContent> {
  if (!hasSupabasePublicEnv()) {
    return {
      bts: [],
      clients: fallbackClients,
      services: fallbackServices,
      portfolio: fallbackPortfolio,
      team: fallbackTeam,
      testimonials: fallbackTestimonials,
    };
  }

  try {
    const [bts, clients, services, portfolio, team, testimonials] = await Promise.all([
      publicSelect<{
        title: string;
        description: string;
        video_url: string;
        thumbnail_url: string | null;
      }>(
        "bts_items",
        "select=title,description,video_url,thumbnail_url&is_published=eq.true&order=sort_order.asc",
      ),
      publicSelect<{
        name: string;
        industry: string | null;
        logo_url: string | null;
        website_url: string | null;
      }>(
        "client_logos",
        "select=name,industry,logo_url,website_url&is_published=eq.true&order=sort_order.asc",
      ),
      publicSelect<{
        title: string;
        description: string;
        category: string | null;
        promo_price: number | null;
        normal_price?: number | null;
        features?: string | null;
        duration?: string | null;
        badge_type?: string | null;
        badge_text?: string | null;
      }>(
        "services",
        "select=*&is_published=eq.true&order=sort_order.asc",
      ),
      publicSelect<{
        name: string;
        category: string;
        description: string;
        image_url: string | null;
        is_featured: boolean;
      }>(
        "portfolio_items",
        "select=name,category,description,image_url,is_featured&is_published=eq.true&order=sort_order.asc",
      ),
      publicSelect<{
        name: string;
        division: string;
        position: string;
        description: string;
        image_url: string | null;
      }>(
        "team_members",
        "select=name,division,position,description,image_url&is_published=eq.true&order=sort_order.asc",
      ),
      publicSelect<{
        name: string;
        role: string;
        comment: string;
      }>(
        "testimonials",
        "select=name,role,comment&is_published=eq.true&order=sort_order.asc",
      ),
    ]);

    return {
      bts:
        bts.length > 0
          ? bts.map((item) => ({
              title: item.title,
              description: item.description,
              videoUrl: item.video_url,
              thumbnailUrl: item.thumbnail_url,
            }))
          : [],
      clients:
        clients.length > 0
          ? clients.map((client) => ({
              name: client.name,
              industry: client.industry,
              logoUrl: client.logo_url,
              websiteUrl: client.website_url,
            }))
          : fallbackClients,
      services:
        services.length > 0
          ? services.map((service) => {
              const fallbackService = getServiceByTitle(service.title);
              const price = servicePriceValue(
                service.promo_price,
                fallbackService?.price,
                1500000,
              );
              const rawCompareAtPrice = servicePriceValue(
                service.normal_price,
                fallbackService?.compareAtPrice,
                Math.ceil(price * 1.65),
              );
              const compareAtPrice =
                rawCompareAtPrice > price ? rawCompareAtPrice : price;
              const icon = serviceIconFromCategory(service.category);
              const badgeType = normalizeBadgeType(
                service.badge_type ?? fallbackService?.badgeType,
              );

              return {
                title: service.title,
                description: service.description,
                icon,
                price,
                compareAtPrice,
                features:
                  serviceFeaturesFromText(service.features).length > 0
                    ? serviceFeaturesFromText(service.features)
                    : fallbackService?.features,
                durationLabel:
                  service.duration ??
                  fallbackService?.durationLabel ??
                  serviceDurationFromCategory(icon),
                badgeType,
                badgeLabel: service.badge_text ?? fallbackService?.badgeLabel ?? null,
                isPopular: badgeType === "popular",
              };
            })
          : fallbackServices,
      portfolio:
        portfolio.length > 0
          ? portfolio.map((item) => ({
              name: item.name,
              category: item.category as PortfolioItem["category"],
              filterCategory: item.category as PortfolioItem["filterCategory"],
              description: item.description,
              colors: ["#06B6D4", "#141D38", "#22C55E", "#E0F2FE", "#0891B2", "#64748B"],
              image: item.image_url,
              isFeatured: item.is_featured,
            }))
          : fallbackPortfolio,
      team:
        team.length > 0
          ? team.map((member) => ({
              name: member.name,
              division: member.division,
              position: member.position,
              description: member.description,
              initials: initialsFromName(member.name),
              accent: "#20C4E8",
              image: member.image_url,
            }))
          : fallbackTeam,
      testimonials:
        testimonials.length > 0
          ? testimonials.map((testimonial) => ({
              name: testimonial.name,
              role: testimonial.role,
              comment: testimonial.comment,
              initials: initialsFromName(testimonial.name),
            }))
          : fallbackTestimonials,
    };
  } catch {
    return {
      bts: [],
      clients: fallbackClients,
      services: fallbackServices,
      portfolio: fallbackPortfolio,
      team: fallbackTeam,
      testimonials: fallbackTestimonials,
    };
  }
}
