import { randomBytes, scryptSync } from "crypto";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

function loadLocalEnv() {
  const envPath = resolve(process.cwd(), ".env.local");

  if (!existsSync(envPath)) {
    return;
  }

  const content = readFileSync(envPath, "utf8");

  for (const line of content.split(/\r?\n/)) {
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

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");

  return `scrypt:${salt}:${hash}`;
}

loadLocalEnv();

const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL").replace(/\/$/, "");
const serviceKey =
  process.env.SUPABASE_SECRET_KEY?.trim() ||
  process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!serviceKey) {
  throw new Error("SUPABASE_SECRET_KEY atau SUPABASE_SERVICE_ROLE_KEY belum diisi.");
}

const email = requireEnv("ADMIN_CREATE_EMAIL").toLowerCase();
const password = requireEnv("ADMIN_CREATE_PASSWORD");
const name = process.env.ADMIN_CREATE_NAME?.trim() || "Admin Sebisa Project";
const role = process.env.ADMIN_CREATE_ROLE?.trim() || "admin";

const response = await fetch(`${supabaseUrl}/rest/v1/admin_users?on_conflict=email`, {
  method: "POST",
  headers: {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
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
  const message = await response.text();
  throw new Error(message || `Gagal membuat admin (${response.status}).`);
}

console.log(`Admin ${email} berhasil dibuat/diperbarui sebagai ${role}.`);
