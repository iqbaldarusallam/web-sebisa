import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import vm from "vm";

function loadLocalEnv() {
  const envPath = resolve(process.cwd(), ".env.local");

  if (!existsSync(envPath)) {
    return;
  }

  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);

    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2];
    }
  }
}

function requireEnv(key) {
  const value = process.env[key]?.trim();

  if (!value) {
    throw new Error(`${key} belum diisi.`);
  }

  return value;
}

function readExportedArray(filePath, exportName) {
  const source = readFileSync(resolve(process.cwd(), filePath), "utf8");
  const marker = `export const ${exportName}`;
  const markerIndex = source.indexOf(marker);

  if (markerIndex === -1) {
    throw new Error(`Export ${exportName} tidak ditemukan di ${filePath}.`);
  }

  const assignmentIndex = source.indexOf("=", markerIndex);

  if (assignmentIndex === -1) {
    throw new Error(`Assignment ${exportName} tidak ditemukan di ${filePath}.`);
  }

  const start = source.indexOf("[", assignmentIndex);
  let depth = 0;

  for (let index = start; index < source.length; index += 1) {
    const char = source[index];

    if (char === "[") {
      depth += 1;
    }

    if (char === "]") {
      depth -= 1;
    }

    if (depth === 0) {
      const arraySource = source.slice(start, index + 1);
      return vm.runInNewContext(`(${arraySource})`, {});
    }
  }

  throw new Error(`Array ${exportName} di ${filePath} tidak lengkap.`);
}

loadLocalEnv();

const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL").replace(/\/$/, "");
const serviceKey =
  process.env.SUPABASE_SECRET_KEY?.trim() ||
  process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!serviceKey) {
  throw new Error("SUPABASE_SECRET_KEY atau SUPABASE_SERVICE_ROLE_KEY belum diisi.");
}

const headers = {
  apikey: serviceKey,
  Authorization: `Bearer ${serviceKey}`,
  "Content-Type": "application/json",
};

async function tableHasRows(table) {
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=id&limit=1`, {
    headers: {
      ...headers,
      Prefer: "count=exact",
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const range = response.headers.get("content-range");
  const total = Number(range?.split("/")?.[1] ?? "0");

  return total > 0;
}

async function insertIfEmpty(table, rows) {
  if (rows.length === 0) {
    throw new Error(`${table}: data seed kosong, proses dihentikan.`);
  }

  if (await tableHasRows(table)) {
    console.log(`${table}: dilewati, tabel sudah berisi data.`);
    return;
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      ...headers,
      Prefer: "return=minimal",
    },
    body: JSON.stringify(rows),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  console.log(`${table}: ${rows.length} data awal ditambahkan.`);
}

const services = readExportedArray("data/services.ts", "services");
const portfolioItems = readExportedArray("data/portfolio.ts", "portfolioItems");
const testimonials = readExportedArray("data/testimonials.ts", "testimonials");
const teamMembers = readExportedArray("data/team.ts", "teamMembers");
const clientLogos = readExportedArray("data/clientLogos.ts", "clientLogos");

await insertIfEmpty(
  "services",
  services.map((service, index) => ({
    title: service.title,
    description: service.description,
    category: service.icon,
    base_price: service.price,
    is_published: true,
    sort_order: index + 1,
  })),
);

await insertIfEmpty(
  "portfolio_items",
  portfolioItems.map((item, index) => ({
    name: item.name,
    category: item.category,
    description: item.description,
    image_url: item.image ?? null,
    project_url: null,
    is_featured: index < 4,
    is_published: true,
    sort_order: index + 1,
  })),
);

await insertIfEmpty(
  "testimonials",
  testimonials.map((item, index) => ({
    name: item.name,
    role: item.role,
    comment: item.comment,
    rating: [4.8, 4.7, 4.9][index] ?? 4.8,
    is_published: true,
    sort_order: index + 1,
  })),
);

await insertIfEmpty(
  "team_members",
  teamMembers.map((member, index) => ({
    name: member.name,
    division: member.division,
    position: member.position,
    description: member.description,
    image_url: member.image ?? null,
    is_published: true,
    sort_order: index + 1,
  })),
);

await insertIfEmpty(
  "client_logos",
  clientLogos.map((client, index) => ({
    name: client.name,
    industry: client.industry,
    logo_url: client.logoUrl,
    website_url: client.websiteUrl,
    is_published: true,
    sort_order: index + 1,
  })),
);

console.log("Seed CMS selesai.");
