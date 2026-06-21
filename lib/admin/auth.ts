import { auth } from "@/auth";
import { hasSupabaseAdminEnv } from "@/lib/integrations/supabase-rest";
import { redirect } from "next/navigation";

export type AdminSession = {
  id: string;
  email: string;
  name: string;
  role: string;
};

function getSessionSecret() {
  const secret =
    process.env.AUTH_SECRET?.trim() ?? process.env.ADMIN_SESSION_SECRET?.trim();

  if (secret) {
    return secret;
  }

  return "";
}

export function isAdminRuntimeConfigured() {
  return Boolean(hasSupabaseAdminEnv() && getSessionSecret());
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const session = await auth();
  const user = session?.user;

  if (!user?.email) {
    return null;
  }

  return {
    id: user.id || user.email,
    email: user.email,
    name: user.name ?? "Admin Sebisa",
    role: user.role || "admin",
  };
}

export async function hasAdminSession() {
  return Boolean(await getAdminSession());
}

export async function requireAdminSession() {
  if (!(await hasAdminSession())) {
    redirect("/admin/login");
  }
}
