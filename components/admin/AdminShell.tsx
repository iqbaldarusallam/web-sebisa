import { logoutAdmin } from "@/app/admin/actions";
import type { AdminSession } from "@/lib/admin/auth";
import AdminAccountMenu from "./AdminAccountMenu";
import AdminSidebar from "./AdminSidebar";
import Link from "next/link";
import { HiArrowTopRightOnSquare, HiArrowRightOnRectangle } from "react-icons/hi2";

export default function AdminShell({
  admin,
  children,
}: {
  admin: AdminSession;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#08111F] text-white">
      <div className="flex">
        <AdminSidebar adminRole={admin.role} />
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-[#08111F]/88 px-5 py-4 backdrop-blur-xl sm:px-7 lg:px-9">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#20C4E8]">
                  CMS Sebisa Project
                </p>
                <p className="mt-1 text-sm font-semibold text-white/58">
                  Kelola konten, prospek, dan transaksi.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <AdminAccountMenu email={admin.email} name={admin.name} />
                <Link
                  href="/"
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/12 px-4 text-xs font-bold text-white/75 transition hover:bg-white/[0.08] hover:text-white"
                >
                  Lihat Website
                  <HiArrowTopRightOnSquare className="h-4 w-4" aria-hidden="true" />
                </Link>
                <form action={logoutAdmin}>
                  <button
                    type="submit"
                    className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white px-4 text-xs font-black text-[#08111F] transition hover:bg-[#DFF3FF]"
                  >
                    Logout
                    <HiArrowRightOnRectangle className="h-4 w-4" aria-hidden="true" />
                  </button>
                </form>
              </div>
            </div>
          </header>
          <main className="px-5 py-6 sm:px-7 lg:px-9">{children}</main>
        </div>
      </div>
    </div>
  );
}
