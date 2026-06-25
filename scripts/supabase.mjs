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

function getFirstEnv(keys) {
  for (const key of keys) {
    const value = process.env[key]?.trim();

    if (value) {
      return value;
    }
  }

  return "";
}

function requireEnv(key) {
  const value = process.env[key]?.trim();

  if (!value) {
    throw new Error(`${key} belum diisi.`);
  }

  return value;
}

function requireDatabaseUrl() {
  const value = getFirstEnv([
    "DATABASE_URL",
    "POSTGRES_URL",
    "POSTGRES_PRISMA_URL",
    "POSTGRES_URL_NON_POOLING",
    "SUPABASE_DB_URL",
  ]);

  if (!value) {
    throw new Error(
      "DATABASE_URL belum diisi. Isi DATABASE_URL/POSTGRES_URL/SUPABASE_DB_URL dengan connection string Postgres.",
    );
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
  const databaseUrl = requireDatabaseUrl();
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
  const role = "admin";

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
  const databaseUrl = requireDatabaseUrl();
  const email = requireEnv("ADMIN_CREATE_EMAIL").toLowerCase();
  const password = requireEnv("ADMIN_CREATE_PASSWORD");
  const name = process.env.ADMIN_CREATE_NAME?.trim() || "Super Admin Sebisa";
  const role = "super_admin";
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
  return (await getTableRowCount(table, supabaseUrl, headers)) > 0;
}

async function getTableRowCount(table, supabaseUrl, headers) {
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
  return total;
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

async function ensureMinimumRows(table, rows, minimumCount, supabaseUrl, headers) {
  if (rows.length < minimumCount) {
    throw new Error(`${table}: data seed kurang dari ${minimumCount}.`);
  }

  const total = await getTableRowCount(table, supabaseUrl, headers);

  if (total >= minimumCount) {
    console.log(`${table}: sudah berisi ${total} data, minimal ${minimumCount} terpenuhi.`);
    return;
  }

  const rowsToInsert = rows.slice(total, minimumCount);
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      ...headers,
      Prefer: "return=minimal",
    },
    body: JSON.stringify(rowsToInsert),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  console.log(`${table}: ${rowsToInsert.length} data tambahan ditambahkan sampai total minimal ${minimumCount}.`);
}

async function patchRows(table, query, payload, supabaseUrl, headers) {
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${query}`, {
    method: "PATCH",
    headers: {
      ...headers,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      ...payload,
      updated_at: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
}

function isMissingColumnError(error, column) {
  return (
    error instanceof Error &&
    error.message.includes("PGRST204") &&
    error.message.includes(`'${column}'`)
  );
}

function defaultServiceDuration(icon) {
  const durations = {
    ads: "Mulai 5-10 hari kerja",
    landing: "Mulai 7-14 hari kerja",
    social: "Mulai 14-30 hari kerja",
    store: "Mulai 7-14 hari kerja",
    video: "Mulai 7-21 hari kerja",
    website: "Mulai 14-30 hari kerja",
  };

  return durations[icon] ?? "Timeline menyesuaikan scope";
}

function defaultServiceFeatures(service) {
  if (Array.isArray(service.features) && service.features.length > 0) {
    return service.features.join("\n");
  }

  const fragments = service.description
    .split(/,| dan | untuk | agar /i)
    .map((item) => item.trim())
    .filter((item) => item.length > 10);
  const features = [
    ...fragments.slice(0, 4),
    "Konsultasi kebutuhan project",
    "Revisi sesuai scope layanan",
  ];

  return [...new Set(features)].slice(0, 6).join("\n");
}

async function backfillServicePrices(services, supabaseUrl, headers) {
  for (const service of services) {
    const titleQuery = `title=eq.${encodeURIComponent(service.title)}`;

    await patchRows(
      "services",
      `${titleQuery}&promo_price=is.null`,
      { promo_price: service.price },
      supabaseUrl,
      headers,
    );
  }

  try {
    for (const service of services) {
      const titleQuery = `title=eq.${encodeURIComponent(service.title)}`;

      await patchRows(
        "services",
        `${titleQuery}&normal_price=is.null`,
        { normal_price: service.compareAtPrice },
        supabaseUrl,
        headers,
      );
      await patchRows(
        "services",
        `${titleQuery}&features=is.null`,
        { features: defaultServiceFeatures(service) },
        supabaseUrl,
        headers,
      );
      await patchRows(
        "services",
        `${titleQuery}&duration=is.null`,
        { duration: service.durationLabel ?? defaultServiceDuration(service.icon) },
        supabaseUrl,
        headers,
      );
      await patchRows(
        "services",
        `${titleQuery}&badge_type=is.null`,
        { badge_type: service.badgeType ?? (service.isPopular ? "popular" : "discount") },
        supabaseUrl,
        headers,
      );
      await patchRows(
        "services",
        `${titleQuery}&badge_text=is.null`,
        { badge_text: service.badgeLabel ?? null },
        supabaseUrl,
        headers,
      );
    }
  } catch (error) {
    if (isMissingColumnError(error, "normal_price")) {
      console.warn(
        "services: kolom normal_price belum ada, harga normal belum bisa disinkronkan.",
      );
      console.warn("Jalankan migrasi schema terlebih dahulu.");
      return;
    }

    if (
      isMissingColumnError(error, "features") ||
      isMissingColumnError(error, "duration") ||
      isMissingColumnError(error, "badge_type") ||
      isMissingColumnError(error, "badge_text")
    ) {
      console.warn(
        "services: kolom fitur/badge/durasi belum ada, metadata layanan belum bisa disinkronkan.",
      );
      console.warn("Jalankan migrasi schema terlebih dahulu.");
      return;
    }

    throw error;
  }

  console.log("services: harga promo dan harga normal kosong sudah disinkronkan.");
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
      promo_price: service.price,
      normal_price: service.compareAtPrice,
      features: defaultServiceFeatures(service),
      duration: service.durationLabel ?? defaultServiceDuration(service.icon),
      badge_type: service.badgeType ?? (service.isPopular ? "popular" : "discount"),
      badge_text: service.badgeLabel ?? null,
      is_published: true,
      sort_order: index + 1,
    })),
    supabaseUrl,
    headers,
  );
  await backfillServicePrices(services, supabaseUrl, headers);

  await insertIfEmpty(
    "portfolio_items",
    portfolioItems.map((item, index) => ({
      name: item.name,
      category: item.category,
      description: item.description,
      image_url: item.image ?? null,
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
      rating: item.rating ?? [4.8, 4.7, 4.9][index] ?? 4.8,
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
  await ensureMinimumRows(
    "bts_items",
    [
      {
        title: "Proses Shooting Brand Kedai Rasa",
        description: "Behind the scenes proses produksi video brand Kedai Rasa dari konsep sampai editing final.",
        video_url: "https://res.cloudinary.com/dseqmekig/video/upload/v1/sebisa/bts/sample-1.mp4",
        thumbnail_url: null,
        is_published: true,
        sort_order: 1,
      },
      {
        title: "Setup Foto Produk Herbal Glow",
        description: "Dokumentasi proses foto produk untuk katalog dan marketplace client.",
        video_url: "https://res.cloudinary.com/dseqmekig/video/upload/v1/sebisa/bts/sample-2.mp4",
        thumbnail_url: null,
        is_published: true,
        sort_order: 2,
      },
      {
        title: "Editing Konten Social Media",
        description: "Proses editing konten Instagram dan TikTok untuk campaign bulanan.",
        video_url: "https://res.cloudinary.com/dseqmekig/video/upload/v1/sebisa/bts/sample-3.mp4",
        thumbnail_url: null,
        is_published: true,
        sort_order: 3,
      },
      {
        title: "Brainstorming Strategi Digital",
        description: "Sesi diskusi tim untuk menyusun strategi digital client baru.",
        video_url: "https://res.cloudinary.com/dseqmekig/video/upload/v1/sebisa/bts/sample-4.mp4",
        thumbnail_url: null,
        is_published: true,
        sort_order: 4,
      },
      {
        title: "Review Hasil Konten Client",
        description: "Tim mengecek detail visual, caption, dan format konten sebelum diserahkan ke client.",
        video_url: "https://res.cloudinary.com/dseqmekig/video/upload/v1/sebisa/bts/sample-5.mp4",
        thumbnail_url: null,
        is_published: true,
        sort_order: 5,
      },
      {
        title: "Produksi Konten Campaign",
        description: "Cuplikan proses produksi aset campaign mulai dari arahan kreatif sampai finalisasi publikasi.",
        video_url: "https://res.cloudinary.com/dseqmekig/video/upload/v1/sebisa/bts/sample-6.mp4",
        thumbnail_url: null,
        is_published: true,
        sort_order: 6,
      },
    ],
    6,
    supabaseUrl,
    headers,
  );


  console.log("Seed CMS selesai.");
}

async function checkServicePrices() {
  const { supabaseUrl, headers } = getSupabaseRestConfig();
  const [
    allResponse,
    missingPromoPriceResponse,
    missingNormalPriceResponse,
    missingFeaturesResponse,
    missingDurationResponse,
  ] = await Promise.all([
    fetch(`${supabaseUrl}/rest/v1/services?select=id`, {
      headers: {
        ...headers,
        Prefer: "count=exact",
      },
    }),
    fetch(`${supabaseUrl}/rest/v1/services?select=id&promo_price=is.null`, {
      headers: {
        ...headers,
        Prefer: "count=exact",
      },
    }),
    fetch(`${supabaseUrl}/rest/v1/services?select=id&normal_price=is.null`, {
      headers: {
        ...headers,
        Prefer: "count=exact",
      },
    }),
    fetch(`${supabaseUrl}/rest/v1/services?select=id&features=is.null`, {
      headers: {
        ...headers,
        Prefer: "count=exact",
      },
    }),
    fetch(`${supabaseUrl}/rest/v1/services?select=id&duration=is.null`, {
      headers: {
        ...headers,
        Prefer: "count=exact",
      },
    }),
  ]);

  if (!allResponse.ok) {
    throw new Error(await allResponse.text());
  }

  if (!missingPromoPriceResponse.ok) {
    throw new Error(await missingPromoPriceResponse.text());
  }

  if (!missingNormalPriceResponse.ok) {
    throw new Error(await missingNormalPriceResponse.text());
  }

  if (!missingFeaturesResponse.ok) {
    throw new Error(await missingFeaturesResponse.text());
  }

  if (!missingDurationResponse.ok) {
    throw new Error(await missingDurationResponse.text());
  }

  const total = allResponse.headers.get("content-range")?.split("/")?.[1] ?? "0";
  const missingPromoPrice =
    missingPromoPriceResponse.headers.get("content-range")?.split("/")?.[1] ?? "0";
  const missingNormalPrice =
    missingNormalPriceResponse.headers.get("content-range")?.split("/")?.[1] ?? "0";
  const missingFeatures =
    missingFeaturesResponse.headers.get("content-range")?.split("/")?.[1] ?? "0";
  const missingDuration =
    missingDurationResponse.headers.get("content-range")?.split("/")?.[1] ?? "0";

  console.log(`services_total=${total}`);
  console.log(`promo_price_null=${missingPromoPrice}`);
  console.log(`normal_price_null=${missingNormalPrice}`);
  console.log(`features_null=${missingFeatures}`);
  console.log(`duration_null=${missingDuration}`);
}

loadLocalEnv();

const command = process.argv[2];
const commands = {
  migrate,
  "create-admin": createAdmin,
  "reset-admin": resetAdmins,
  "seed-cms": seedCms,
  "check-service-prices": checkServicePrices,
};

if (!commands[command]) {
  console.log(
    "Usage: node scripts/supabase.mjs <migrate|seed-cms|create-admin|reset-admin|check-service-prices>",
  );
  process.exit(1);
}

await commands[command]();
