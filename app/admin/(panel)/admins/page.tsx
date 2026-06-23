import { deleteAdminAccount, saveAdminAccount } from "@/app/admin/actions";
import { requireSuperAdminSession } from "@/lib/admin/auth";
import { getAdminUsers } from "@/lib/admin/data";
import type { Metadata } from "next";
import { HiCheckCircle, HiTrash } from "react-icons/hi2";

export const metadata: Metadata = {
  title: "Manajemen Admin | Sebisa Project",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  const session = await requireSuperAdminSession();
  const params = await searchParams;
  const admins = await getAdminUsers();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#20C4E8]">
              Super Admin
            </p>
            <h1 className="mt-2 text-3xl font-black">Manajemen Admin</h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/58">
              Kelola akses dashboard Sebisa Project dari satu tempat.
            </p>
          </div>
          <div className="rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-white/70">
            Login sebagai {session.email}
          </div>
        </div>

        {params.saved ? (
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-200">
            <HiCheckCircle className="h-5 w-5" aria-hidden="true" />
            Admin berhasil disimpan.
          </div>
        ) : null}
        {params.deleted ? (
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-200">
            <HiCheckCircle className="h-5 w-5" aria-hidden="true" />
            Admin berhasil dihapus.
          </div>
        ) : null}
        {params.error === "self" ? (
          <div className="mt-5 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
            Akun yang sedang dipakai tidak bisa dihapus.
          </div>
        ) : null}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form action={saveAdminAccount} className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
          <h2 className="text-xl font-black">Tambah Admin</h2>
          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-black text-white/75">Nama</span>
              <input
                name="name"
                required
                className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-[#08111F]/80 px-4 text-sm font-semibold outline-none focus:border-[#20C4E8]"
              />
            </label>
            <label className="block">
              <span className="text-sm font-black text-white/75">Email</span>
              <input
                name="email"
                type="email"
                required
                className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-[#08111F]/80 px-4 text-sm font-semibold outline-none focus:border-[#20C4E8]"
              />
            </label>
            <label className="block">
              <span className="text-sm font-black text-white/75">Password</span>
              <input
                name="password"
                type="password"
                required
                className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-[#08111F]/80 px-4 text-sm font-semibold outline-none focus:border-[#20C4E8]"
              />
            </label>
            <label className="block">
              <span className="text-sm font-black text-white/75">Role</span>
              <select
                name="role"
                defaultValue="admin"
                className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-[#08111F]/80 px-4 text-sm font-semibold outline-none focus:border-[#20C4E8]"
              >
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </label>
            <label className="flex items-center gap-3 text-sm font-bold text-white/75">
              <input name="isActive" type="checkbox" defaultChecked className="h-4 w-4" />
              Aktif
            </label>
            <button
              type="submit"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#20C4E8] px-5 text-sm font-black text-[#041B38] transition hover:bg-[#67E8F9]"
            >
              Simpan Admin
            </button>
          </div>
        </form>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06]">
          <div className="border-b border-white/10 px-5 py-4">
            <h2 className="text-xl font-black">Daftar Admin</h2>
          </div>
          <div className="divide-y divide-white/10">
            {admins.map((admin) => (
              <form
                key={admin.id}
                action={saveAdminAccount}
                className="grid gap-3 px-5 py-4 lg:grid-cols-[1fr_1fr_9rem_7rem_auto]"
              >
                <input type="hidden" name="id" value={admin.id} />
                <input
                  name="name"
                  defaultValue={admin.name}
                  required
                  className="h-11 rounded-xl border border-white/10 bg-[#08111F]/80 px-3 text-sm font-semibold outline-none focus:border-[#20C4E8]"
                />
                <input
                  name="email"
                  type="email"
                  defaultValue={admin.email}
                  required
                  className="h-11 rounded-xl border border-white/10 bg-[#08111F]/80 px-3 text-sm font-semibold outline-none focus:border-[#20C4E8]"
                />
                <select
                  name="role"
                  defaultValue={admin.role}
                  className="h-11 rounded-xl border border-white/10 bg-[#08111F]/80 px-3 text-sm font-semibold outline-none focus:border-[#20C4E8]"
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
                <label className="flex h-11 items-center gap-2 rounded-xl border border-white/10 px-3 text-xs font-bold text-white/70">
                  <input name="isActive" type="checkbox" defaultChecked={admin.isActive} />
                  Aktif
                </label>
                <div className="flex gap-2">
                  <input
                    name="password"
                    type="password"
                    placeholder="Password baru"
                    className="h-11 min-w-0 rounded-xl border border-white/10 bg-[#08111F]/80 px-3 text-sm font-semibold outline-none placeholder:text-white/35 focus:border-[#20C4E8]"
                  />
                  <button
                    type="submit"
                    className="inline-flex h-11 items-center justify-center rounded-full bg-white px-4 text-xs font-black text-[#08111F] transition hover:bg-[#DFF3FF]"
                  >
                    Update
                  </button>
                </div>
              </form>
            ))}
          </div>
          <div className="divide-y divide-white/10 border-t border-white/10">
            {admins.map((admin) => (
              <form key={admin.id} action={deleteAdminAccount} className="flex items-center justify-between gap-3 px-5 py-3">
                <input type="hidden" name="id" value={admin.id} />
                <p className="text-sm font-semibold text-white/60">{admin.email}</p>
                <button
                  type="submit"
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-red-400/25 px-3 text-xs font-black text-red-200 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={admin.id === session.id}
                >
                  <HiTrash className="h-4 w-4" aria-hidden="true" />
                  Hapus
                </button>
              </form>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
