import AdminCollectionPage from "@/components/admin/AdminCollectionPage";
import { adminCollections } from "@/lib/admin/collections";
import { getBtsItems, isSupabaseConfigured } from "@/lib/admin/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BTS | Admin Sebisa Project",
};

export default async function AdminBtsPage({
  searchParams,
}: {
  searchParams: Promise<{
    saved?: string;
    deleted?: string;
    edit?: string;
    new?: string;
  }>;
}) {
  const params = await searchParams;
  const config = adminCollections.bts;
  const rows = await getBtsItems();

  return (
    <AdminCollectionPage
      config={config}
      rows={rows}
      saved={params.saved}
      deleted={params.deleted}
      supabaseConfigured={isSupabaseConfigured()}
      editId={params.edit}
      isCreating={params.new === "1"}
    />
  );
}
