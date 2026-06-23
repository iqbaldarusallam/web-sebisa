import { hasSupabaseAdminEnv, supabaseSelect } from "@/lib/integrations/supabase-rest";
import { verifyAdminPasswordHash } from "./password";

type AdminUserRow = {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: string;
  is_active: boolean;
};

export type VerifiedAdmin = {
  id: string;
  email: string;
  name: string;
  role: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function findAdminUser(email: string) {
  if (!hasSupabaseAdminEnv()) {
    return null;
  }

  const rows = await supabaseSelect<AdminUserRow>(
    "admin_users",
    `select=*&email=eq.${encodeURIComponent(email)}&is_active=eq.true&limit=1`,
  );

  return rows[0] ?? null;
}

export async function verifyAdminCredentials(
  email: string,
  password: string,
): Promise<VerifiedAdmin | null> {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password) {
    return null;
  }

  try {
    const admin = await findAdminUser(normalizedEmail);

    if (admin && verifyAdminPasswordHash(password, admin.password_hash)) {
      return {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      };
    }
  } catch (error) {
    console.error("Admin database login failed:", error);
  }

  return null;
}
