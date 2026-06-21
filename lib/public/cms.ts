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

type PublicCmsContent = {
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

export async function getPublicCmsContent(): Promise<PublicCmsContent> {
  if (!hasSupabasePublicEnv()) {
    return {
      clients: fallbackClients,
      services: fallbackServices,
      portfolio: fallbackPortfolio,
      team: fallbackTeam,
      testimonials: fallbackTestimonials,
    };
  }

  try {
    const [clients, services, portfolio, team, testimonials] = await Promise.all([
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
        base_price: number | null;
      }>("services", "select=title,description,category,base_price&is_published=eq.true&order=sort_order.asc"),
      publicSelect<{
        name: string;
        category: string;
        description: string;
        image_url: string | null;
      }>(
        "portfolio_items",
        "select=name,category,description,image_url&is_published=eq.true&order=sort_order.asc",
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
              const price = service.base_price ?? fallbackService?.price ?? 1500000;

              return {
                title: service.title,
                description: service.description,
                icon: serviceIconFromCategory(service.category),
                price,
                compareAtPrice:
                  fallbackService?.compareAtPrice ?? Math.ceil(price * 1.65),
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
      clients: fallbackClients,
      services: fallbackServices,
      portfolio: fallbackPortfolio,
      team: fallbackTeam,
      testimonials: fallbackTestimonials,
    };
  }
}
