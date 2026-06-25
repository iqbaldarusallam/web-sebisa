"use server";

import { signIn, signOut } from "@/auth";
import { adminCollections } from "@/lib/admin/collections";
import { requireAdminSession, requireSuperAdminSession } from "@/lib/admin/auth";
import {
  changeOwnAdminPassword,
  deleteAdminUser,
  deleteCmsRecord,
  saveAdminUser,
  saveCmsRecord,
} from "@/lib/admin/data";
import type { CmsCollectionKey } from "@/lib/admin/types";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function isCollectionKey(value: string): value is CmsCollectionKey {
  return value in adminCollections;
}

function getSafeAdminPath(value: FormDataEntryValue | null) {
  const path = typeof value === "string" ? value : "";

  if (!path.startsWith("/admin") || path.startsWith("//")) {
    return "/admin";
  }

  return path.split("?")[0].split("#")[0] || "/admin";
}

const publicPathsByCollection: Partial<Record<CmsCollectionKey, string[]>> = {
  services: ["/", "/layanan"],
  portfolio: ["/", "/portofolio"],
  testimonials: ["/", "/testimoni"],
  team: ["/tim"],
  clients: ["/", "/kerjasama"],
  bts: ["/", "/bts"],
};

function revalidateCollectionPaths(collection: CmsCollectionKey, adminPath: string) {
  revalidatePath(adminPath);

  for (const path of publicPathsByCollection[collection] ?? []) {
    revalidatePath(path);
  }
}

export async function loginAdmin(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/admin/login?error=invalid");
    }

    throw error;
  }
}

export async function logoutAdmin() {
  await signOut({
    redirectTo: "/admin/login",
  });
}

export async function saveCmsItem(formData: FormData) {
  await requireAdminSession();

  const collection = String(formData.get("collection") ?? "");

  if (!isCollectionKey(collection)) {
    redirect("/admin?error=collection");
  }

  const result = await saveCmsRecord(collection, formData);
  const path = adminCollections[collection].path;

  revalidateCollectionPaths(collection, path);
  redirect(`${path}?saved=${result.persisted ? "1" : (result.status ?? "demo")}`);
}

export async function deleteCmsItem(formData: FormData) {
  await requireAdminSession();

  const collection = String(formData.get("collection") ?? "");
  const id = String(formData.get("id") ?? "");

  if (!isCollectionKey(collection) || !id) {
    redirect("/admin?error=delete");
  }

  const result = await deleteCmsRecord(collection, id);
  const path = adminCollections[collection].path;

  revalidateCollectionPaths(collection, path);
  redirect(`${path}?deleted=${result.persisted ? "1" : "demo"}`);
}

export async function saveAdminAccount(formData: FormData) {
  const session = await requireSuperAdminSession();
  const result = await saveAdminUser(formData, { currentAdminId: session.id });

  if (!result.persisted) {
    redirect(`/admin/admins?error=${result.status}`);
  }

  revalidatePath("/admin/admins");
  redirect("/admin/admins?saved=1");
}

export async function deleteAdminAccount(formData: FormData) {
  const session = await requireSuperAdminSession();
  const id = String(formData.get("id") ?? "");

  if (!id) {
    redirect("/admin/admins?error=self");
  }

  const result = await deleteAdminUser(id, { currentAdminId: session.id });

  if (!result.persisted) {
    redirect(`/admin/admins?error=${result.status}`);
  }

  revalidatePath("/admin/admins");
  redirect("/admin/admins?deleted=1");
}

export async function changeAdminPassword(formData: FormData) {
  const session = await requireAdminSession();
  const redirectTo = getSafeAdminPath(formData.get("redirectTo"));
  const result = await changeOwnAdminPassword(session.id, formData);
  const query = result.persisted
    ? "account=saved"
    : `accountError=${result.status}`;

  revalidatePath("/admin");
  redirect(`${redirectTo}?${query}`);
}
