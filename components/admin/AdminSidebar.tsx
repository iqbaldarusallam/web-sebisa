"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiCamera,
  HiChartBarSquare,
  HiChatBubbleLeftRight,
  HiCreditCard,
  HiDocumentText,
  HiFolderOpen,
  HiHome,
  HiMegaphone,
  HiSparkles,
  HiShieldCheck,
  HiUsers,
} from "react-icons/hi2";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: HiHome },
  { label: "Layanan", href: "/admin/layanan", icon: HiMegaphone },
  { label: "Portofolio", href: "/admin/portofolio", icon: HiFolderOpen },
  { label: "Testimoni", href: "/admin/testimoni", icon: HiChatBubbleLeftRight },
  { label: "Tim", href: "/admin/tim", icon: HiUsers },
  { label: "Client / Kerjasama", href: "/admin/kerjasama", icon: HiSparkles },
  { label: "BTS", href: "/admin/bts", icon: HiCamera },
  { label: "Transaksi", href: "/admin/transaksi", icon: HiCreditCard },
  { label: "Pesan Masuk", href: "/admin/pesan", icon: HiDocumentText },
  { label: "Admin", href: "/admin/admins", icon: HiShieldCheck, superAdminOnly: true },
];

export default function AdminSidebar({ adminRole }: { adminRole: string }) {
  const pathname = usePathname();
  const visibleNavItems = navItems.filter(
    (item) => !item.superAdminOnly || adminRole === "super_admin",
  );

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-white/10 bg-[#0B1224] px-5 py-6 text-white lg:block">
      <Link href="/" className="flex items-center gap-3 rounded-2xl bg-white/[0.06] p-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#08BBD8] text-[#041B38]">
          <HiChartBarSquare className="h-6 w-6" aria-hidden="true" />
        </span>
        <span>
          <span className="block text-sm font-black">Sebisa Admin</span>
          <span className="block text-xs font-semibold text-white/55">CMS & transaksi</span>
        </span>
      </Link>

      <nav className="mt-8 space-y-1">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition ${
                active
                  ? "bg-[#08BBD8] text-[#041B38] shadow-lg shadow-cyan-950/30"
                  : "text-white/68 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
