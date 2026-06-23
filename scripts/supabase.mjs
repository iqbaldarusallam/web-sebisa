import { randomBytes, scryptSync } from "crypto";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import vm from "vm";
import { Client } from "pg";

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

function getSupabaseRestConfig() {
  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL").replace(/\/$/, "");
  const serviceKey =
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!serviceKey) {
    throw new Error("SUPABASE_SECRET_KEY atau SUPABASE_SERVICE_ROLE_KEY belum diisi.");
  }

  return {
    supabaseUrl,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
  };
}

async function migrate() {
  const databaseUrl = requireEnv("DATABASE_URL");
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  try {
    await client.query(readFileSync("database/schema.sql", "utf8"));

    const { rows } = await client.query(`
      select
        to_regclass('public.admin_users') as admin_users,
        to_regclass('public.services') as services,
        to_regclass('public.orders') as orders
    `);

    console.log("Schema Supabase berhasil diterapkan.");
    console.log(JSON.stringify(rows[0], null, 2));
  } finally {
    await client.end();
  }
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");

  return `scrypt:${salt}:${hash}`;
}

async function createAdmin() {
  const { supabaseUrl, headers } = getSupabaseRestConfig();
  const email = requireEnv("ADMIN_CREATE_EMAIL").toLowerCase();
  const password = requireEnv("ADMIN_CREATE_PASSWORD");
  const name = process.env.ADMIN_CREATE_NAME?.trim() || "Admin Sebisa Project";
  const role = process.env.ADMIN_CREATE_ROLE?.trim() || "admin";

  const response = await fetch(`${supabaseUrl}/rest/v1/admin_users?on_conflict=email`, {
    method: "POST",
    headers: {
      ...headers,
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({
      email,
      name,
      role,
      password_hash: hashPassword(password),
      is_active: true,
      updated_at: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error((await response.text()) || `Gagal membuat admin (${response.status}).`);
  }

  console.log(`Admin ${email} berhasil dibuat/diperbarui sebagai ${role}.`);
}

async function resetAdmins() {
  const databaseUrl = requireEnv("DATABASE_URL");
  const email = requireEnv("ADMIN_CREATE_EMAIL").toLowerCase();
  const password = requireEnv("ADMIN_CREATE_PASSWORD");
  const name = process.env.ADMIN_CREATE_NAME?.trim() || "Super Admin Sebisa";
  const role = process.env.ADMIN_CREATE_ROLE?.trim() || "super_admin";
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  try {
    await client.query("delete from public.admin_users where lower(email) <> lower($1)", [
      email,
    ]);
    await client.query(
      `
        insert into public.admin_users (email, name, role, password_hash, is_active, updated_at)
        values ($1, $2, $3, $4, true, now())
        on conflict (email) do update set
          name = excluded.name,
          role = excluded.role,
          password_hash = excluded.password_hash,
          is_active = true,
          updated_at = now()
      `,
      [email, name, role, hashPassword(password)],
    );

    const { rows } = await client.query(
      "select email, name, role, is_active from public.admin_users order by created_at",
    );

    console.log("Admin users berhasil direset.");
    console.log(JSON.stringify(rows, null, 2));
  } finally {
    await client.end();
  }
}

function readExportedArray(filePath, exportName) {
  const source = readFileSync(resolve(process.cwd(), filePath), "utf8");
  const markerIndex = source.indexOf(`export const ${exportName}`);

  if (markerIndex === -1) {
    throw new Error(`Export ${exportName} tidak ditemukan di ${filePath}.`);
  }

  const assignmentIndex = source.indexOf("=", markerIndex);
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
      return vm.runInNewContext(`(${source.slice(start, index + 1)})`, {});
    }
  }

  throw new Error(`Array ${exportName} di ${filePath} tidak lengkap.`);
}

async function tableHasRows(table, supabaseUrl, headers) {
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=id&limit=1`, {
    headers: {
      ...headers,
      Prefer: "count=exact",
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const total = Number(response.headers.get("content-range")?.split("/")?.[1] ?? "0");
  return total > 0;
}

async function insertIfEmpty(table, rows, supabaseUrl, headers) {
  if (rows.length === 0) {
    throw new Error(`${table}: data seed kosong, proses dihentikan.`);
  }

  if (await tableHasRows(table, supabaseUrl, headers)) {
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

async function seedCms() {
  const { supabaseUrl, headers } = getSupabaseRestConfig();
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
    supabaseUrl,
    headers,
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
    supabaseUrl,
    headers,
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
    supabaseUrl,
    headers,
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
    supabaseUrl,
    headers,
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
    supabaseUrl,
    headers,
  );

  console.log("Seed CMS selesai.");
}

loadLocalEnv();

const command = process.argv[2];
const commands = {
  migrate,
  "create-admin": createAdmin,
  "reset-admin": resetAdmins,
  "seed-cms": seedCms,
};

if (!commands[command]) {
  console.log("Usage: node scripts/supabase.mjs <migrate|seed-cms|create-admin|reset-admin>");
  process.exit(1);
}

await commands[command]();
