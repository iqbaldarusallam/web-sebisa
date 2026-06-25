"use client";

import { changeAdminPassword } from "@/app/admin/actions";
import { usePathname, useSearchParams } from "next/navigation";
import { HiCheckCircle, HiCog6Tooth, HiExclamationTriangle } from "react-icons/hi2";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getErrorMessage(code: string | null) {
  if (code === "current") {
    return "Password saat ini tidak sesuai.";
  }

  if (code === "mismatch") {
    return "Konfirmasi password baru belum sama.";
  }

  if (code === "short") {
    return "Password baru minimal 8 karakter.";
  }

  if (code === "invalid") {
    return "Lengkapi semua field password.";
  }

  return null;
}

export default function AdminAccountMenu({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const saved = searchParams.get("account") === "saved";
  const errorMessage = getErrorMessage(searchParams.get("accountError"));

  return (
    <details className="relative">
      <summary className="flex h-10 cursor-pointer list-none items-center gap-2 rounded-full border border-white/12 px-2 pr-3 text-xs font-bold text-white/75 transition hover:bg-white/[0.08] hover:text-white [&::-webkit-details-marker]:hidden">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#20C4E8] text-xs font-black text-[#041B38]">
          {getInitials(name) || "A"}
        </span>
        <span className="hidden max-w-40 truncate sm:inline">{name}</span>
        <HiCog6Tooth className="h-4 w-4" aria-hidden="true" />
      </summary>

      <div className="absolute right-0 top-12 z-50 w-[20rem] rounded-2xl border border-white/10 bg-[#0B1224] p-4 shadow-2xl shadow-black/40">
        <div className="border-b border-white/10 pb-3">
          <p className="text-sm font-black text-white">{name}</p>
          <p className="mt-1 truncate text-xs font-semibold text-white/45">{email}</p>
        </div>

        {saved ? (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-200">
            <HiCheckCircle className="h-4 w-4" aria-hidden="true" />
            Password berhasil diganti.
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-400/25 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-200">
            <HiExclamationTriangle className="h-4 w-4" aria-hidden="true" />
            {errorMessage}
          </div>
        ) : null}

        <form action={changeAdminPassword} className="mt-4 space-y-3">
          <input type="hidden" name="redirectTo" value={pathname} />
          <label className="block">
            <span className="text-xs font-black text-white/68">Password saat ini</span>
            <input
              name="currentPassword"
              type="password"
              required
              className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-[#08111F]/80 px-3 text-sm font-semibold outline-none focus:border-[#20C4E8]"
            />
          </label>
          <label className="block">
            <span className="text-xs font-black text-white/68">Password baru</span>
            <input
              name="newPassword"
              type="password"
              required
              minLength={8}
              className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-[#08111F]/80 px-3 text-sm font-semibold outline-none focus:border-[#20C4E8]"
            />
          </label>
          <label className="block">
            <span className="text-xs font-black text-white/68">Ulangi password baru</span>
            <input
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-[#08111F]/80 px-3 text-sm font-semibold outline-none focus:border-[#20C4E8]"
            />
          </label>
          <button
            type="submit"
            className="inline-flex min-h-10 w-full items-center justify-center rounded-full bg-[#20C4E8] px-4 text-xs font-black text-[#041B38] transition hover:bg-[#67E8F9]"
          >
            Ganti Password
          </button>
        </form>
      </div>
    </details>
  );
}
