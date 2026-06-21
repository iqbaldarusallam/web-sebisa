import AdminCollectionPage from "@/components/admin/AdminCollectionPage";
import { adminCollections } from "@/lib/admin/collections";
import { getAdminSnapshot } from "@/lib/admin/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Testimoni | Sebisa Project",
};

export default async function AdminTestimoniPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; edit?: string; new?: string }>;
}) {
  const [params, snapshot] = await Promise.all([searchParams, getAdminSnapshot()]);

  return (
    <AdminCollectionPage
      config={adminCollections.testimonials}
      rows={snapshot.testimonials}
      saved={params.saved}
      deleted={params.deleted}
      supabaseConfigured={snapshot.supabaseConfigured}
      editId={params.edit}
      isCreating={params.new === "1"}
    />
  );
}
