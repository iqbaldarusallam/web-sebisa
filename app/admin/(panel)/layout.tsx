import AdminShell from "@/components/admin/AdminShell";
import { requireAdminSession } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession();

  return <AdminShell admin={session}>{children}</AdminShell>;
}
