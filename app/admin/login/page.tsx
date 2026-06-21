import { loginAdmin } from "@/app/admin/actions";
import { isAdminRuntimeConfigured } from "@/lib/admin/auth";
import type { Metadata } from "next";
import Link from "next/link";
import { HiLockClosed, HiShieldCheck } from "react-icons/hi2";

export const metadata: Metadata = {
  title: "Login Admin | Sebisa Project",
  description: "Masuk ke CMS admin Sebisa Project.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const hasError = params.error === "invalid";

  return (
    <main className="min-h-screen bg-[#08111F] px-5 py-8 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section>
          <span className="inline-flex rounded-full border border-[#20C4E8]/30 bg-[#20C4E8]/12 px-4 py-2 text-xs font-black text-[#20C4E8]">
            ADMIN CMS
          </span>
          <h1 className="mt-6 max-w-2xl text-5xl font-black leading-tight tracking-tight sm:text-6xl">
            Kelola konten, transaksi, dan prospek dari satu tempat.
          </h1>

          <div className="mt-8 flex max-w-xl flex-wrap gap-3">
            {[
              "Konten Website",
              "Data Prospek",
              "Transaksi Project",
              "Media Brand",
            ].map((item) => (
              <div
                key={item}
                className="inline-flex min-h-12 items-center gap-3 rounded-full border border-white/10 bg-white/6 px-4"
              >
                <HiShieldCheck
                  className="h-5 w-5 text-[#20C4E8]"
                  aria-hidden="true"
                />
                <p className="text-sm font-black">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/8 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#20C4E8] text-[#041B38]">
            <HiLockClosed className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2 className="mt-6 text-3xl font-black">Masuk Admin</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-white/55">
            Gunakan email dan password admin Sebisa Project.
          </p>

          {hasError ? (
            <div className="mt-5 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
              Email atau password admin tidak sesuai.
            </div>
          ) : null}

          {!isAdminRuntimeConfigured() ? (
            <div className="mt-5 rounded-2xl border border-[#F59E0B]/25 bg-[#F59E0B]/10 px-4 py-3 text-sm font-bold text-[#FCD34D]">
              Akses admin belum siap. Hubungi developer untuk mengaktifkan
              konfigurasi produksi.
            </div>
          ) : null}

          <form action={loginAdmin} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-black text-white/80">Email</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="admin@sebisa.com"
                className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-[#08111F]/80 px-4 text-sm font-semibold text-white outline-none transition placeholder:text-white/32 focus:border-[#20C4E8]"
              />
            </label>
            <label className="block">
              <span className="text-sm font-black text-white/80">Password</span>
              <input
                type="password"
                name="password"
                required
                placeholder="Masukkan password admin"
                className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-[#08111F]/80 px-4 text-sm font-semibold text-white outline-none transition placeholder:text-white/32 focus:border-[#20C4E8]"
              />
            </label>
            <button
              type="submit"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#20C4E8] px-5 text-sm font-black text-[#041B38] transition hover:bg-[#67E8F9]"
            >
              Masuk Dashboard
            </button>
          </form>

          <Link
            href="/"
            className="mt-5 inline-flex text-sm font-bold text-white/55 transition hover:text-white"
          >
            Kembali ke website
          </Link>
        </section>
      </div>
    </main>
  );
}
